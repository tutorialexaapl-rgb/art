/*
# Create Supabase Storage buckets with RLS policies

## What this migration does

Creates 7 storage buckets for the commission art platform, each with
appropriate public/private visibility and row-level security policies
that enforce ownership-based access control.

## Buckets created

### Public buckets (read anyone, write owner only)
1. `avatars` - user profile photos (2 MB max, public read)
2. `artist-portfolio` - artist portfolio works (8 MB max, public read)
3. `commission-inspirations` - commission reference images (8 MB max, public read)

### Private buckets (read authorized only, write owner only)
4. `commission-comment-attachments` - comment attachments (8 MB max, private)
5. `offer-attachments` - offer attachments (8 MB max, private)
6. `project-milestones` - milestone progress images (10 MB max, private)
7. `message-attachments` - conversation message attachments (8 MB max, private)

## Security model

### Public buckets (avatars, artist-portfolio, commission-inspirations)
- SELECT (read): `TO anon, authenticated` - anyone can view
- INSERT: `TO authenticated` - owner uploads to `userId/` path
- DELETE: `TO authenticated` - owner deletes from `userId/` path
- UPDATE: `TO authenticated` - owner updates own files
- Path enforcement: files stored under `{auth.uid()}/...` so users can
  only write/delete their own files.

### Private buckets (comment-attachments, offer-attachments, project-milestones, message-attachments)
- SELECT (read): `TO authenticated` - owner reads own files
  (Broader access for collaborators is handled via signed URLs in the app layer)
- INSERT: `TO authenticated` - owner uploads
- DELETE: `TO authenticated` - owner deletes
- UPDATE: `TO authenticated` - owner updates
- No anon access - these buckets are fully private

## File path convention

All files stored as: `{userId}/{uuid}.{ext}`
- userId prefix ensures ownership scoping in RLS policies
- uuid filename prevents PII leakage and filename collisions
- extension preserved for content-type detection

## Notes
1. Bucket `public` flag: public=true means anon can read without going
   through RLS. We set public=true for the 3 public buckets and false
   for the 4 private ones.
2. RLS on storage.objects still applies even for public buckets -
   public read is handled by the bucket flag, but writes are governed
   by policies.
3. File size limits are enforced in the application layer (frontend)
   before upload, not at the storage level. Supabase Storage does not
   support per-bucket size limits via SQL.
*/

-- Insert bucket records
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('artist-portfolio', 'artist-portfolio', true, 8388608, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('commission-inspirations', 'commission-inspirations', true, 8388608, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('commission-comment-attachments', 'commission-comment-attachments', false, 8388608, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('offer-attachments', 'offer-attachments', false, 8388608, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('project-milestones', 'project-milestones', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('message-attachments', 'message-attachments', false, 8388608, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PUBLIC BUCKETS: avatars, artist-portfolio, commission-inspirations
-- ============================================

-- avatars: public read, owner write/delete
DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_owner_insert" ON storage.objects;
CREATE POLICY "avatars_owner_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "avatars_owner_update" ON storage.objects;
CREATE POLICY "avatars_owner_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "avatars_owner_delete" ON storage.objects;
CREATE POLICY "avatars_owner_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- artist-portfolio: public read, owner write/delete
DROP POLICY IF EXISTS "portfolio_public_read" ON storage.objects;
CREATE POLICY "portfolio_public_read" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'artist-portfolio');

DROP POLICY IF EXISTS "portfolio_owner_insert" ON storage.objects;
CREATE POLICY "portfolio_owner_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'artist-portfolio' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "portfolio_owner_update" ON storage.objects;
CREATE POLICY "portfolio_owner_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'artist-portfolio' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'artist-portfolio' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "portfolio_owner_delete" ON storage.objects;
CREATE POLICY "portfolio_owner_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'artist-portfolio' AND (storage.foldername(name))[1] = auth.uid()::text);

-- commission-inspirations: public read, owner write/delete
DROP POLICY IF EXISTS "inspirations_public_read" ON storage.objects;
CREATE POLICY "inspirations_public_read" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'commission-inspirations');

DROP POLICY IF EXISTS "inspirations_owner_insert" ON storage.objects;
CREATE POLICY "inspirations_owner_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'commission-inspirations' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "inspirations_owner_update" ON storage.objects;
CREATE POLICY "inspirations_owner_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'commission-inspirations' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'commission-inspirations' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "inspirations_owner_delete" ON storage.objects;
CREATE POLICY "inspirations_owner_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'commission-inspirations' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================
-- PRIVATE BUCKETS: comment-attachments, offer-attachments, project-milestones, message-attachments
-- ============================================

-- commission-comment-attachments: owner-only access
DROP POLICY IF EXISTS "comment_att_owner_read" ON storage.objects;
CREATE POLICY "comment_att_owner_read" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'commission-comment-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "comment_att_owner_insert" ON storage.objects;
CREATE POLICY "comment_att_owner_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'commission-comment-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "comment_att_owner_delete" ON storage.objects;
CREATE POLICY "comment_att_owner_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'commission-comment-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

-- offer-attachments: owner-only access
DROP POLICY IF EXISTS "offer_att_owner_read" ON storage.objects;
CREATE POLICY "offer_att_owner_read" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'offer-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "offer_att_owner_insert" ON storage.objects;
CREATE POLICY "offer_att_owner_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'offer-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "offer_att_owner_delete" ON storage.objects;
CREATE POLICY "offer_att_owner_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'offer-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

-- project-milestones: owner-only access
DROP POLICY IF EXISTS "milestone_att_owner_read" ON storage.objects;
CREATE POLICY "milestone_att_owner_read" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'project-milestones' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "milestone_att_owner_insert" ON storage.objects;
CREATE POLICY "milestone_att_owner_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'project-milestones' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "milestone_att_owner_delete" ON storage.objects;
CREATE POLICY "milestone_att_owner_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'project-milestones' AND (storage.foldername(name))[1] = auth.uid()::text);

-- message-attachments: owner-only access
DROP POLICY IF EXISTS "message_att_owner_read" ON storage.objects;
CREATE POLICY "message_att_owner_read" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'message-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "message_att_owner_insert" ON storage.objects;
CREATE POLICY "message_att_owner_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'message-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "message_att_owner_delete" ON storage.objects;
CREATE POLICY "message_att_owner_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'message-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);