/*
# Set known passwords for demo accounts

## Purpose
Enables one-click demo login from the login/register pages by setting
a known password on two existing demo accounts (one client, one artist).

## Changes
- Updates `auth.users.encrypted_password` for:
  - demo.klient1@atelier-demo.pl (Julia Wisniewska - client)
  - demo.art1@atelier-demo.pl (Lena Wojcik - artist)
- Password is set to "AtelierDemo2025" using bcrypt via Postgres crypt()/gen_salt().
- These accounts already have is_demo:true in raw_user_meta_data.

## Security
- No schema changes.
- No RLS policy changes.
- Demo accounts remain read-only at the UI level (frontend guards prevent mutations).
*/
UPDATE auth.users
SET encrypted_password = crypt('AtelierDemo2025', gen_salt('bf'))
WHERE email IN ('demo.klient1@atelier-demo.pl', 'demo.art1@atelier-demo.pl');
