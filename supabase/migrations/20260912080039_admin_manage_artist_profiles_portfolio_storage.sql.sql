-- Admin can INSERT artist_profiles for any user (not just own)
-- and manage (INSERT/UPDATE/DELETE) artist_portfolio_items for any artist.
-- Storage: admin can upload to avatars and artist-portfolio buckets
-- regardless of folder prefix (folder = artist's user_id, not admin's).

-- ══════════════════════════════════════════════
-- 1. artist_profiles: admin INSERT
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "insert_artist_profile_admin" ON artist_profiles;
CREATE POLICY "insert_artist_profile_admin" ON artist_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ══════════════════════════════════════════════
-- 2. artist_portfolio_items: admin INSERT/UPDATE/DELETE for any artist
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "insert_portfolio_items_admin" ON artist_portfolio_items;
CREATE POLICY "insert_portfolio_items_admin" ON artist_portfolio_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM artist_profiles ap WHERE ap.id = artist_portfolio_items.artist_id AND ap.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "update_portfolio_items" ON artist_portfolio_items;
CREATE POLICY "update_portfolio_items" ON artist_portfolio_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM artist_profiles ap WHERE ap.id = artist_portfolio_items.artist_id AND ap.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM artist_profiles ap WHERE ap.id = artist_portfolio_items.artist_id AND ap.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "delete_portfolio_items" ON artist_portfolio_items;
CREATE POLICY "delete_portfolio_items" ON artist_portfolio_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM artist_profiles ap WHERE ap.id = artist_portfolio_items.artist_id AND ap.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ══════════════════════════════════════════════
-- 3. profiles: admin can INSERT profiles for newly created auth users
-- ══════════════════════════════════════════════
DROP POLICY IF EXISTS "insert_profile_admin" ON profiles;
CREATE POLICY "insert_profile_admin" ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ══════════════════════════════════════════════
-- 4. Storage: admin can INSERT/UPDATE/DELETE in avatars and artist-portfolio
--    regardless of folder prefix (folder = artist's user_id, not admin's)
-- ══════════════════════════════════════════════

-- avatars: admin insert
DROP POLICY IF EXISTS "avatars_admin_insert" ON storage.objects;
CREATE POLICY "avatars_admin_insert" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- avatars: admin delete
DROP POLICY IF EXISTS "avatars_admin_delete" ON storage.objects;
CREATE POLICY "avatars_admin_delete" ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- artist-portfolio: admin insert
DROP POLICY IF EXISTS "portfolio_admin_insert" ON storage.objects;
CREATE POLICY "portfolio_admin_insert" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'artist-portfolio'
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- artist-portfolio: admin update
DROP POLICY IF EXISTS "portfolio_admin_update" ON storage.objects;
CREATE POLICY "portfolio_admin_update" ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'artist-portfolio'
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    bucket_id = 'artist-portfolio'
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- artist-portfolio: admin delete
DROP POLICY IF EXISTS "portfolio_admin_delete" ON storage.objects;
CREATE POLICY "portfolio_admin_delete" ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'artist-portfolio'
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );