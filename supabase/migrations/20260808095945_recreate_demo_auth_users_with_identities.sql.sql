/*
# Re-create demo auth users with proper identities

## Root cause
Original seed inserted auth.users but NOT auth.identities. GoTrue needs both.

## Fix
1. Delete wrong-UUID auth users from prior admin API step
2. Re-insert auth.users with original UUIDs + working bcrypt hash
3. Insert matching auth.identities rows (email column is generated)
*/
DO $$
BEGIN
  DELETE FROM auth.identities
  WHERE user_id IN ('44c78058-42c8-4e43-94cf-8a466b936b3a', '9e53b3d8-7dfc-4e38-b69a-0d4d51c05c42');

  DELETE FROM auth.users
  WHERE id IN ('44c78058-42c8-4e43-94cf-8a466b936b3a', '9e53b3d8-7dfc-4e38-b69a-0d4d51c05c42');

  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role, aud, instance_id, raw_app_meta_data, raw_user_meta_data)
  VALUES
    ('11111111-1111-1111-1111-000000000c01', 'demo.klient1@atelier-demo.pl',
     '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrqJ3Bz.qV5dLgGxKw2qYjxvBqJwYKu',
     now(), now(), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000',
     '{"provider":"email","providers":["email"]}'::jsonb,
     '{"is_demo":true,"displayName":"Julia Wisniewska"}'::jsonb),
    ('11111111-1111-1111-1111-000000000a01', 'demo.art1@atelier-demo.pl',
     '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrqJ3Bz.qV5dLgGxKw2qYjxvBqJwYKu',
     now(), now(), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000',
     '{"provider":"email","providers":["email"]}'::jsonb,
     '{"is_demo":true,"is_artist":true,"displayName":"Lena Wojcik"}'::jsonb)
  ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    updated_at = now();

  INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES
    ('11111111-1111-1111-1111-000000000c01', '11111111-1111-1111-1111-000000000c01',
     '{"sub":"11111111-1111-1111-1111-000000000c01","email":"demo.klient1@atelier-demo.pl","email_verified":true,"phone_verified":false}'::jsonb,
     'email', now(), now(), now()),
    ('11111111-1111-1111-1111-000000000a01', '11111111-1111-1111-1111-000000000a01',
     '{"sub":"11111111-1111-1111-1111-000000000a01","email":"demo.art1@atelier-demo.pl","email_verified":true,"phone_verified":false}'::jsonb,
     'email', now(), now(), now())
  ON CONFLICT DO NOTHING;
END $$;
