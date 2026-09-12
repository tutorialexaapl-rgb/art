/*
# Reset demo account passwords to known value

## Purpose
Ensures demo accounts can log in via Supabase Auth signInWithPassword.
Uses the same bcrypt hash format that Supabase GoTrue expects.

## Password
"AtelierDemo2025" - bcrypt cost 10, matching Supabase Auth's default.

## Accounts
- demo.klient1@atelier-demo.pl (client demo)
- demo.art1@atelier-demo.pl (artist demo)
*/
UPDATE auth.users
SET encrypted_password = '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrqJ3Bz.qV5dLgGxKw2qYjxvBqJwYKu'
WHERE email IN ('demo.klient1@atelier-demo.pl', 'demo.art1@atelier-demo.pl');
