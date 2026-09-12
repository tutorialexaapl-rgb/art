/*
# Single-role account constraints - one email = one account = one role

## Purpose
Prevents a user from creating two separate accounts (one client, one artist)
on the same email or phone. Enforces "one user_id = one role profile" at the
database level so even a bypass of frontend validation cannot create duplicate
or cross-role accounts.

## Changes

### 1. profiles table - new columns
- `phone` (text, nullable) - raw phone number, written during onboarding
- `email_normalized` (text, NOT NULL) - lowercased+trimmed email, auto-populated by trigger
- `phone_normalized` (text, nullable) - normalized phone (digits with leading +)

### 2. Unique indexes
- UNIQUE on `email_normalized` - prevents case-variant duplicates
- Partial UNIQUE on `phone_normalized` WHERE NOT NULL

### 3. Trigger: profiles_normalize_fields()
- BEFORE INSERT OR UPDATE on profiles
- Auto-populates email_normalized (lower+trim) and phone_normalized (digits+leading +)

### 4. check_account_availability() - SECURITY DEFINER function
- Callable by anon role (pre-login registration page)
- Checks email_normalized and phone_normalized
- Returns JSON: { status, existing_role }
- status: 'available', 'email_already_used', 'phone_already_used',
  'account_exists_as_client', 'account_exists_as_artist'

### 5. RLS policy for check_account_availability
- SECURITY DEFINER bypasses RLS internally; EXECUTE granted to anon + authenticated

### Existing constraints already in place
- profiles.id is PK (1:1 with auth.users)
- profiles.email has UNIQUE constraint
- client_profiles.user_id has UNIQUE constraint
- artist_profiles.user_id has UNIQUE constraint
*/

-- ──────────────────────────────────────────────
-- 1. Add columns to profiles
-- ──────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_normalized text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_normalized text;

-- Backfill email_normalized from existing rows
UPDATE profiles
SET email_normalized = lower(trim(email))
WHERE email_normalized IS NULL;

-- Backfill phone_normalized from client_profiles if available
UPDATE profiles p
SET phone_normalized = '+' || regexp_replace(cp.phone, '[^0-9]', '', 'g')
FROM client_profiles cp
WHERE cp.user_id = p.id
  AND cp.phone IS NOT NULL AND cp.phone != ''
  AND p.phone_normalized IS NULL;

-- Make email_normalized NOT NULL after backfill
ALTER TABLE profiles ALTER COLUMN email_normalized SET NOT NULL;

-- ──────────────────────────────────────────────
-- 2. Unique indexes on normalized fields
-- ──────────────────────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email_normalized_unique
  ON profiles (email_normalized);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_phone_normalized_unique
  ON profiles (phone_normalized)
  WHERE phone_normalized IS NOT NULL;

-- ──────────────────────────────────────────────
-- 3. Trigger to auto-populate normalized fields
-- ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION profiles_normalize_fields()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.email_normalized = lower(trim(NEW.email));

  IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN
    NEW.phone_normalized = '+' || regexp_replace(NEW.phone, '[^0-9]', '', 'g');
  ELSE
    NEW.phone_normalized = NULL;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_profiles_normalized ON profiles;
CREATE TRIGGER set_profiles_normalized
  BEFORE INSERT OR UPDATE OF email, phone ON profiles
  FOR EACH ROW EXECUTE FUNCTION profiles_normalize_fields();

-- ──────────────────────────────────────────────
-- 4. check_account_availability function (SECURITY DEFINER)
-- ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION check_account_availability(
  p_email text,
  p_phone text DEFAULT NULL,
  p_requested_role text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email_norm text;
  v_phone_norm text;
  v_existing_role text;
  v_existing_phone_role text;
BEGIN
  v_email_norm = lower(trim(p_email));

  IF p_phone IS NOT NULL AND p_phone != '' THEN
    v_phone_norm = '+' || regexp_replace(p_phone, '[^0-9]', '', 'g');
  END IF;

  SELECT role INTO v_existing_role
  FROM profiles
  WHERE email_normalized = v_email_norm
  LIMIT 1;

  IF FOUND THEN
    IF p_requested_role IS NOT NULL AND v_existing_role != p_requested_role THEN
      IF v_existing_role = 'client' THEN
        RETURN json_build_object('status', 'account_exists_as_client', 'existing_role', v_existing_role);
      ELSIF v_existing_role = 'artist' THEN
        RETURN json_build_object('status', 'account_exists_as_artist', 'existing_role', v_existing_role);
      END IF;
    END IF;
    RETURN json_build_object('status', 'email_already_used', 'existing_role', v_existing_role);
  END IF;

  IF v_phone_norm IS NOT NULL THEN
    SELECT role INTO v_existing_phone_role
    FROM profiles
    WHERE phone_normalized = v_phone_norm
    LIMIT 1;

    IF FOUND THEN
      RETURN json_build_object('status', 'phone_already_used', 'existing_role', v_existing_phone_role);
    END IF;
  END IF;

  RETURN json_build_object('status', 'available', 'existing_role', NULL);
END;
$$;

REVOKE ALL ON FUNCTION check_account_availability(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION check_account_availability(text, text, text) TO anon, authenticated;
