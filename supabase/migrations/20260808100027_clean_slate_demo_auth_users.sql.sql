/*
# Clean slate for demo auth users

## Strategy
Delete the manually-inserted demo auth.users (GoTrue can't authenticate them).
Create fresh ones via the admin API (edge function) which properly registers
them in GoTrue. Then update profiles + all FK references to the new UUIDs.
*/
DO $$
DECLARE
  new_klient_id uuid;
  new_art_id uuid;
BEGIN
  -- Delete old auth users and identities
  DELETE FROM auth.identities WHERE user_id IN ('11111111-1111-1111-1111-000000000c01', '11111111-1111-1111-1111-000000000a01');
  DELETE FROM auth.users WHERE id IN ('11111111-1111-1111-1111-000000000c01', '11111111-1111-1111-1111-000000000a01');
END $$;
