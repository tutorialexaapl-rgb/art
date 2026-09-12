/*
# Fix onboarding persistence: add onboarding_completed_at + fix client_type constraint

## Problems fixed

1. `profiles.onboarding_completed_at` was missing - now added.
2. `client_profiles.client_type` had a CHECK constraint allowing only
   'individual' and 'company', but the onboarding form sends values
   like 'Klient indywidualny', 'Architekt wnętrz', 'Deweloper', etc.
   This caused every client onboarding upsert to silently fail the
   constraint, meaning the profile was never saved and the user was
   stuck in onboarding forever. The constraint is now expanded.
3. Backfill: existing profiles with role-profiles but missing
   onboarding_completed_at get timestamp set.
*/

-- 1. Add onboarding_completed_at to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;

-- 2. Expand client_type constraint to match all onboarding form values
ALTER TABLE client_profiles
  DROP CONSTRAINT IF EXISTS client_profiles_client_type_check;

ALTER TABLE client_profiles
  ADD CONSTRAINT client_profiles_client_type_check
  CHECK (client_type IS NULL OR client_type IN (
    'individual', 'company',
    'architect', 'developer', 'hotel', 'restaurant', 'other',
    'Klient indywidualny', 'Architekt wnętrz', 'Deweloper',
    'Firma', 'Hotel', 'Restauracja', 'Inne'
  ));

-- 3. Backfill onboarding_completed_at for already-onboarded profiles
UPDATE profiles
SET onboarding_completed_at = COALESCE(onboarding_completed_at, now()),
    onboarding_completed = true
WHERE onboarding_completed = true
  AND onboarding_completed_at IS NULL;

-- 4. Backfill onboarding_completed for profiles that have role-profiles
--    but somehow missed the flag
UPDATE profiles p
SET onboarding_completed = true,
    onboarding_completed_at = COALESCE(p.onboarding_completed_at, now())
WHERE (p.onboarding_completed IS NULL OR p.onboarding_completed = false)
  AND (
    EXISTS (SELECT 1 FROM client_profiles cp WHERE cp.user_id = p.id)
    OR EXISTS (SELECT 1 FROM artist_profiles ap WHERE ap.user_id = p.id)
  );
