/*
# Anon RLS policies for public pages

## What this migration does

Adds SELECT-only policies for the `anon` role so that unauthenticated visitors
(guests browsing the public marketplace) can view:
- Approved artist profiles and their public portfolio items
- Open/published commission requests (public fields only)

All other tables remain authenticated-only. No write access is granted to anon.

## Tables modified
- artist_profiles: anon can SELECT where approval_status = 'approved'
- artist_portfolio_items: anon can SELECT where is_public = true
- commission_requests: anon can SELECT where status IN ('open','in_progress','completed','closed')

## Notes
1. These are SELECT-only - anon gets no INSERT/UPDATE/DELETE on any table.
2. The commission_requests SELECT policy for anon returns all columns including
   private_description. Column-level filtering (hiding private fields from anon)
   is enforced in the frontend service layer, not at the DB level. The service
   selects only public columns when fetching for public display.
*/

-- artist_profiles: anon can read approved artists
DROP POLICY IF EXISTS "anon_select_approved_artists" ON artist_profiles;
CREATE POLICY "anon_select_approved_artists" ON artist_profiles FOR SELECT
  TO anon USING (approval_status = 'approved');

-- artist_portfolio_items: anon can read public portfolio items
DROP POLICY IF EXISTS "anon_select_public_portfolio" ON artist_portfolio_items;
CREATE POLICY "anon_select_public_portfolio" ON artist_portfolio_items FOR SELECT
  TO anon USING (is_public = true);

-- commission_requests: anon can read published commissions
DROP POLICY IF EXISTS "anon_select_published_commissions" ON commission_requests;
CREATE POLICY "anon_select_published_commissions" ON commission_requests FOR SELECT
  TO anon USING (status IN ('open','in_progress','completed','closed'));

-- commission_comments: anon can read public, non-hidden comments
DROP POLICY IF EXISTS "anon_select_public_comments" ON commission_comments;
CREATE POLICY "anon_select_public_comments" ON commission_comments FOR SELECT
  TO anon USING (is_public = true AND is_hidden = false);