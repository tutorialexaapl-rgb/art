/*
# Add interior_images column to commission_requests

## What changes
- Adds `interior_images` column (text[], nullable, default '{}') to `commission_requests`.
  This stores photos of the client's interior (where the painting will hang),
  separate from `inspiration_images` (reference art the client likes).

## Security
- No RLS changes needed - the column is covered by existing policies.
*/

ALTER TABLE commission_requests
  ADD COLUMN IF NOT EXISTS interior_images text[] NOT NULL DEFAULT '{}';