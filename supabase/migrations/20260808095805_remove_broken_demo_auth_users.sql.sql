/*
# Remove broken auth.users entries for demo accounts

## Purpose
The seed migration inserted demo users directly into auth.users via SQL.
GoTrue's admin API cannot interact with these rows (returns "Database error").
We delete them so they can be re-created via the Supabase Auth admin API,
which properly registers them in GoTrue's internal state.

## Safety
- Only deletes auth.users rows for demo email addresses
- profiles rows are preserved (linked by the same UUID)
- No data loss for commissions, offers, messages etc.
*/
DELETE FROM auth.users
WHERE email IN ('demo.klient1@atelier-demo.pl', 'demo.art1@atelier-demo.pl');
