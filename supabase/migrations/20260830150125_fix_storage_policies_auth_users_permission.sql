/*
# Fix: permission denied for table users during storage uploads

## Problem
Three storage.objects policies for the `site-images` bucket contained:
  auth.uid() IN (SELECT users.id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')

The `authenticated` role does NOT have SELECT permission on `auth.users`.
When any storage upload happens (any bucket), PostgreSQL evaluates ALL
permissive INSERT policies on storage.objects. The `admin_insert_site_images`
policy's WITH CHECK clause queried auth.users, causing:
  "permission denied for table users"
This blocked every storage upload — including commission-inspirations.

## Fix
Replace the `auth.uid() IN (SELECT ... FROM auth.users ...)` pattern
with the existing `is_admin()` SECURITY DEFINER function, which queries
`profiles` (not auth.users) and is already used by every other admin policy
in the database.

## What changed
- storage.objects: `admin_insert_site_images` INSERT policy — uses is_admin()
- storage.objects: `admin_update_site_images` UPDATE policy — uses is_admin()
- storage.objects: `admin_delete_site_images` DELETE policy — uses is_admin()

## What did NOT change
- commission-inspirations bucket and its policies: UNCHANGED
- RLS on any public table: UNCHANGED
- Database schema: UNCHANGED
- auth.users: UNCHANGED
- No new tables, no new buckets, no schema changes
- No grants on auth.users
- RLS remains enabled everywhere
*/

-- Drop and recreate the 3 site-images policies using is_admin() instead of auth.users

DROP POLICY IF EXISTS "admin_insert_site_images" ON storage.objects;
CREATE POLICY "admin_insert_site_images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ((bucket_id = 'site-images'::text) AND is_admin());

DROP POLICY IF EXISTS "admin_update_site_images" ON storage.objects;
CREATE POLICY "admin_update_site_images"
ON storage.objects FOR UPDATE
TO authenticated
USING ((bucket_id = 'site-images'::text) AND is_admin())
WITH CHECK ((bucket_id = 'site-images'::text) AND is_admin());

DROP POLICY IF EXISTS "admin_delete_site_images" ON storage.objects;
CREATE POLICY "admin_delete_site_images"
ON storage.objects FOR DELETE
TO authenticated
USING ((bucket_id = 'site-images'::text) AND is_admin());
