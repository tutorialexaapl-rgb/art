/*
# Expand commission_requests status constraint and fix RLS policies

## What changes

1. **Status constraint expanded**: The `commission_requests_status_check` constraint
   previously only allowed: `open, in_progress, completed, cancelled, closed`.
   It now allows the full lifecycle:
   `draft, pending_review, published, offers_open, artist_selected,
    in_progress, completed, cancelled, closed, hidden, rejected`.

2. **Data migration**: Existing rows with status `open` are mapped to `offers_open`
   (the new equivalent for a commission that is publicly accepting offers).

3. **RLS SELECT policy updated**: The `anon_select_published_commissions` and
   `select_commission_requests` policies previously only allowed public visibility
   for `open, in_progress, completed, closed`. Now public visibility is for
   `published, offers_open, in_progress, completed` (drafts, pending_review,
   hidden, rejected are NOT publicly visible). Owner and admin visibility unchanged.

4. **Column default**: `commission_requests.status` default changed from `'open'`
   to `'draft'` so new commissions default to draft.

## Security
- RLS remains enabled. Owner (`client_id = auth.uid()`) and admin can see all own/all rows.
- Public (anon) can only see `published, offers_open, in_progress, completed`.
- Draft, pending_review, hidden, rejected are only visible to owner and admin.
*/

-- 1. Drop old status constraint
ALTER TABLE commission_requests DROP CONSTRAINT IF EXISTS commission_requests_status_check;

-- 2. Migrate old 'open' rows to 'offers_open'
UPDATE commission_requests SET status = 'offers_open' WHERE status = 'open';

-- 3. Add new expanded status constraint
ALTER TABLE commission_requests ADD CONSTRAINT commission_requests_status_check
  CHECK (status = ANY (ARRAY[
    'draft', 'pending_review', 'published', 'offers_open', 'artist_selected',
    'in_progress', 'completed', 'cancelled', 'closed', 'hidden', 'rejected'
  ]));

-- 4. Change default status from 'open' to 'draft'
ALTER TABLE commission_requests ALTER COLUMN status SET DEFAULT 'draft';

-- 5. Drop and recreate RLS SELECT policies with new public-visible statuses

-- 5a. Anon public read policy
DROP POLICY IF EXISTS "anon_select_published_commissions" ON commission_requests;
CREATE POLICY "anon_select_published_commissions"
  ON commission_requests FOR SELECT
  TO anon, authenticated
  USING (status = ANY (ARRAY['published', 'offers_open', 'in_progress', 'completed']));

-- 5b. Authenticated owner/admin read policy (separate from anon)
DROP POLICY IF EXISTS "select_commission_requests" ON commission_requests;
CREATE POLICY "select_commission_requests"
  ON commission_requests FOR SELECT
  TO authenticated
  USING (
    client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- 6. Insert policy stays the same (owner only) - recreate to be safe
DROP POLICY IF EXISTS "insert_commission_requests" ON commission_requests;
CREATE POLICY "insert_commission_requests"
  ON commission_requests FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

-- 7. Update policy stays the same (owner or admin) - recreate to be safe
DROP POLICY IF EXISTS "update_commission_requests" ON commission_requests;
CREATE POLICY "update_commission_requests"
  ON commission_requests FOR UPDATE
  TO authenticated
  USING (
    client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- 8. Delete policy stays the same (owner or admin) - recreate to be safe
DROP POLICY IF EXISTS "delete_commission_requests" ON commission_requests;
CREATE POLICY "delete_commission_requests"
  ON commission_requests FOR DELETE
  TO authenticated
  USING (
    client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );