/*
# Update check_account_availability to detect accounts without profiles

## Problem
When a user registers but doesn't complete onboarding, a `profiles` row is never
created (after the fix). However, `check_account_availability` only checks the
`profiles` table, so it would report "available" for an email that already has
an auth user - allowing a duplicate registration.

## Changes
1. Updated `check_account_availability` to also check `auth.users` for existing
   emails. If an auth user exists but no profile row, the function reports
   `email_already_used` so the registration form prevents a duplicate.

## Security
- Function remains `SECURITY DEFINER` with `search_path = 'public'`.
- No new policies or table changes.
*/

CREATE OR REPLACE FUNCTION public.check_account_availability(
  p_email text,
  p_phone text DEFAULT NULL,
  p_requested_role text DEFAULT NULL
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_email_norm text;
  v_phone_norm text;
  v_existing_role text;
  v_existing_phone_role text;
  v_auth_exists boolean;
BEGIN
  v_email_norm = lower(trim(p_email));

  -- Check profiles table first (completed onboarding)
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

  -- Also check auth.users for emails of users who registered but
  -- haven't completed onboarding yet (no profile row exists).
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE lower(trim(email)) = v_email_norm
  ) INTO v_auth_exists;

  IF v_auth_exists THEN
    RETURN json_build_object('status', 'email_already_used', 'existing_role', NULL);
  END IF;

  IF v_phone_norm IS NOT NULL AND v_phone_norm != '' THEN
    v_phone_norm = '+' || regexp_replace(p_phone, '[^0-9]', '', 'g');

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
$function$;