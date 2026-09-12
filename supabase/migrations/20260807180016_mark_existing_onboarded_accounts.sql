/*
# Mark existing accounts as onboarding-completed

## What this migration does

For all existing accounts that already have a profile row in `profiles`
but where `onboarding_completed` is still false/null, this sets the flag
to true. This covers accounts that completed the onboarding flow BEFORE
the `onboarding_completed` column existed or was being reliably written.

## Logic

An account is considered "already onboarded" if it has at least one of:
- a row in `client_profiles` (client completed onboarding), OR
- a row in `artist_profiles` (artist completed onboarding), OR
- a row in `profiles` with a non-null `display_name` and `status` != 'pending'

This is a one-time backfill. No new tables, no new columns, no RLS changes.
No data is deleted. Only `profiles.onboarding_completed` is updated from
false/null to true for matching rows.
*/

UPDATE profiles p
SET onboarding_completed = true,
    updated_at = now()
WHERE (p.onboarding_completed IS NULL OR p.onboarding_completed = false)
  AND (
    EXISTS (SELECT 1 FROM client_profiles cp WHERE cp.user_id = p.id)
    OR EXISTS (SELECT 1 FROM artist_profiles ap WHERE ap.user_id = p.id)
    OR (p.display_name IS NOT NULL AND p.display_name <> '' AND p.status <> 'pending')
  );
