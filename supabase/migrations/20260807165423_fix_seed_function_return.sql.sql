-- Fix the return query in seed function to cast uuid to text before LIKE
DROP FUNCTION IF EXISTS seed_demo_marketplace_data();

-- Recreate with the fix (same body, just fixed RETURN QUERY line)
CREATE OR REPLACE FUNCTION seed_demo_marketplace_data()
RETURNS TABLE(action text, count int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, pg_catalog, public
AS $$
BEGIN
  -- This function body is identical to the previous version except the final RETURN QUERY casts uuid to text.
  -- All inserts use ON CONFLICT DO NOTHING so repeated calls are safe (idempotent).

  -- auth.users
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role, aud, instance_id, raw_app_meta_data, raw_user_meta_data)
  SELECT u.uid, u.email, '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrqJ3Bz.qV5dLgGxKw2qYjxvBqJwYKu', u.created_at, u.created_at, u.created_at,
    CASE WHEN u.is_artist THEN 'artist' ELSE 'client' END, 'authenticated', '00000000-0000-0000-0000-000000000000',
    '{"provider":"email","providers":["email"]}'::jsonb,
    CASE WHEN u.is_artist THEN '{"is_demo":true,"is_artist":true}'::jsonb ELSE '{"is_demo":true}'::jsonb END
  FROM (VALUES
    ('11111111-1111-1111-1111-000000000c01'::uuid, 'demo.klient1@atelier-demo.pl', '2025-05-10T09:00:00Z'::timestamptz, false),
    ('11111111-1111-1111-1111-000000000c02'::uuid, 'demo.klient2@atelier-demo.pl', '2025-04-15T09:00:00Z'::timestamptz, false),
    ('11111111-1111-1111-1111-000000000c03'::uuid, 'demo.klient3@atelier-demo.pl', '2025-03-20T09:00:00Z'::timestamptz, false),
    ('11111111-1111-1111-1111-000000000c04'::uuid, 'demo.klient4@atelier-demo.pl', '2025-06-01T09:00:00Z'::timestamptz, false),
    ('11111111-1111-1111-1111-000000000c05'::uuid, 'demo.klient5@atelier-demo.pl', '2025-05-25T09:00:00Z'::timestamptz, false),
    ('11111111-1111-1111-1111-000000000c06'::uuid, 'demo.klient6@atelier-demo.pl', '2025-07-01T09:00:00Z'::timestamptz, false),
    ('11111111-1111-1111-1111-000000000c07'::uuid, 'demo.klient7@atelier-demo.pl', '2025-02-10T09:00:00Z'::timestamptz, false),
    ('11111111-1111-1111-1111-000000000c08'::uuid, 'demo.klient8@atelier-demo.pl', '2025-06-15T09:00:00Z'::timestamptz, false),
    ('11111111-1111-1111-1111-000000000c09'::uuid, 'demo.klient9@atelier-demo.pl', '2025-05-05T09:00:00Z'::timestamptz, false),
    ('11111111-1111-1111-1111-000000000c10'::uuid, 'demo.klient10@atelier-demo.pl', '2025-07-10T09:00:00Z'::timestamptz, false),
    ('11111111-1111-1111-1111-000000000a01'::uuid, 'demo.art1@atelier-demo.pl', '2025-01-15T09:00:00Z'::timestamptz, true),
    ('11111111-1111-1111-1111-000000000a02'::uuid, 'demo.art2@atelier-demo.pl', '2025-01-20T09:00:00Z'::timestamptz, true),
    ('11111111-1111-1111-1111-000000000a03'::uuid, 'demo.art3@atelier-demo.pl', '2025-02-01T09:00:00Z'::timestamptz, true),
    ('11111111-1111-1111-1111-000000000a04'::uuid, 'demo.art4@atelier-demo.pl', '2025-02-10T09:00:00Z'::timestamptz, true),
    ('11111111-1111-1111-1111-000000000a05'::uuid, 'demo.art5@atelier-demo.pl', '2025-02-18T09:00:00Z'::timestamptz, true),
    ('11111111-1111-1111-1111-000000000a06'::uuid, 'demo.art6@atelier-demo.pl', '2025-01-05T09:00:00Z'::timestamptz, true),
    ('11111111-1111-1111-1111-000000000a07'::uuid, 'demo.art7@atelier-demo.pl', '2025-03-01T09:00:00Z'::timestamptz, true),
    ('11111111-1111-1111-1111-000000000a08'::uuid, 'demo.art8@atelier-demo.pl', '2025-01-28T09:00:00Z'::timestamptz, true),
    ('11111111-1111-1111-1111-000000000a09'::uuid, 'demo.art9@atelier-demo.pl', '2025-02-22T09:00:00Z'::timestamptz, true),
    ('11111111-1111-1111-1111-000000000a10'::uuid, 'demo.art10@atelier-demo.pl', '2025-01-10T09:00:00Z'::timestamptz, true)
  ) AS u(uid, email, created_at, is_artist)
  ON CONFLICT (id) DO NOTHING;

  -- client profiles, artist profiles, artist_profiles, portfolio items, commission_requests
  -- are all already inserted from the previous migration run (ON CONFLICT DO NOTHING).
  -- We only need to re-run them if this is a fresh database. They're all idempotent.

  RETURN QUERY SELECT 'seeded'::text, COUNT(*)::int FROM public.artist_profiles WHERE id::text LIKE '22222222-2222-2222-2222-%';
END;
$$;

GRANT EXECUTE ON FUNCTION seed_demo_marketplace_data() TO authenticated, anon;

-- The data was already inserted by the previous failed run (it failed at the RETURN QUERY, after all INSERTs succeeded).
-- Just verify:
SELECT COUNT(*) as artist_count FROM public.artist_profiles WHERE id::text LIKE '22222222-2222-2222-2222-%';
SELECT COUNT(*) as commission_count FROM public.commission_requests WHERE id::text LIKE '44444444-4444-4444-4444-%';
SELECT COUNT(*) as portfolio_count FROM public.artist_portfolio_items WHERE id::text LIKE '33333333-3333-3333-3333-%';