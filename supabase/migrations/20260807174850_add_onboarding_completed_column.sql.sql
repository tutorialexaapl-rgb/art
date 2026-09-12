/*
# Persist onboarding completion in profiles table

## Purpose
Previously onboarding completion was only stored in localStorage and React state.
On next login the JWT user_metadata didn't contain onboardingCompleted, so users
were re-prompted to complete onboarding every time they logged in.

## Changes
1. Add `onboarding_completed` boolean column to profiles (default false)
2. Backfill existing client_profiles/artist_profiles rows: if a role profile
   exists for a user, mark onboarding_completed = true (they already onboarded)

## Security
- No RLS policy changes needed; existing profiles policies cover the new column
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

-- Backfill: users who already have a role profile have completed onboarding
UPDATE profiles p
SET onboarding_completed = true
WHERE EXISTS (SELECT 1 FROM client_profiles cp WHERE cp.user_id = p.id)
   OR EXISTS (SELECT 1 FROM artist_profiles ap WHERE ap.user_id = p.id);

CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed
  ON profiles (onboarding_completed)
  WHERE onboarding_completed = false;
