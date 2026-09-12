-- Add is_demo flag to user metadata for demo accounts
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"is_demo":true}'::jsonb
WHERE email IN ('demo.klient1@atelier-demo.pl', 'demo.art1@atelier-demo.pl');

-- Also set is_demo and is_artist flags for the artist
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"is_demo":true,"is_artist":true}'::jsonb
WHERE email = 'demo.art1@atelier-demo.pl';
