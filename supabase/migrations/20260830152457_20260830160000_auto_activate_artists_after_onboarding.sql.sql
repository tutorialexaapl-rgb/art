-- Auto-activate artists: remove the admin-approval requirement.
-- Artists who completed onboarding but are still 'pending' are now 'approved'.
-- Suspended accounts remain suspended (admin moderation still works).

-- 1. Update profiles: pending artists -> approved (keep suspended as-is)
UPDATE profiles
SET status = 'approved',
    updated_at = now()
WHERE role = 'artist'
  AND status = 'pending';

-- 2. Update artist_profiles: pending approval_status -> approved (keep suspended/rejected as-is)
UPDATE artist_profiles
SET approval_status = 'approved'
WHERE approval_status = 'pending';

-- 3. Mark is_verified = true for approved artists (informational field, not a gate)
UPDATE artist_profiles
SET is_verified = true
WHERE approval_status = 'approved'
  AND is_verified = false;
