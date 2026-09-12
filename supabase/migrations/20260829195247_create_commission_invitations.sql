/*
# Create commission_invitations table

1. Purpose
   Allows a client to invite a specific artist to one of their commission requests.
   The artist sees the invitation and can choose to submit an offer for that commission.

2. New Tables
   - `commission_invitations`
     - `id` uuid PK
     - `commission_request_id` uuid FK -> commission_requests.id (CASCADE)
     - `artist_id` uuid FK -> artist_profiles.id (CASCADE)
     - `client_id` uuid NOT NULL (the inviting client's auth user id)
     - `status` text NOT NULL DEFAULT 'pending' - values: pending | accepted | declined
     - `message` text (optional personal note from client)
     - `created_at` timestamptz DEFAULT now()
     - UNIQUE constraint on (commission_request_id, artist_id) to prevent duplicate invites

3. Security
   - RLS enabled.
   - Clients (authenticated) can CRUD their own invitations (client_id = auth.uid()).
   - Artists (authenticated) can SELECT invitations targeting them - scoped via
     EXISTS check on artist_profiles where artist_profiles.user_id = auth.uid().
   - This is a signed-in app, so policies use TO authenticated with auth.uid() ownership checks.
*/

CREATE TABLE IF NOT EXISTS commission_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_request_id uuid NOT NULL REFERENCES commission_requests(id) ON DELETE CASCADE,
  artist_id uuid NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  message text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (commission_request_id, artist_id)
);

ALTER TABLE commission_invitations ENABLE ROW LEVEL SECURITY;

-- Client who owns the invitation can do everything with their own rows
DROP POLICY IF EXISTS "select_own_invitations" ON commission_invitations;
CREATE POLICY "select_own_invitations"
  ON commission_invitations FOR SELECT
  TO authenticated
  USING (
    client_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM artist_profiles
      WHERE artist_profiles.id = commission_invitations.artist_id
        AND artist_profiles.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_own_invitations" ON commission_invitations;
CREATE POLICY "insert_own_invitations"
  ON commission_invitations FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

DROP POLICY IF EXISTS "update_own_invitations" ON commission_invitations;
CREATE POLICY "update_own_invitations"
  ON commission_invitations FOR UPDATE
  TO authenticated
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

DROP POLICY IF EXISTS "delete_own_invitations" ON commission_invitations;
CREATE POLICY "delete_own_invitations"
  ON commission_invitations FOR DELETE
  TO authenticated
  USING (client_id = auth.uid());

-- Index for looking up invitations by artist
CREATE INDEX IF NOT EXISTS idx_commission_invitations_artist_id ON commission_invitations(artist_id);
CREATE INDEX IF NOT EXISTS idx_commission_invitations_commission_id ON commission_invitations(commission_request_id);
CREATE INDEX IF NOT EXISTS idx_commission_invitations_client_id ON commission_invitations(client_id);
