/*
# Add UPDATE policy on messages for mark-as-read

## Purpose
The `messages` table has SELECT and INSERT policies but NO UPDATE policy.
The frontend `markAsRead` function updates `read_at` on messages where the
current user is the recipient. Without an UPDATE policy, RLS silently blocks
this operation — messages never get marked as read.

## Changes
1. Add `update_messages` policy: a participant in the conversation can update
   messages (only `read_at` in practice) where they are NOT the sender.
   The `USING` and `WITH CHECK` both verify conversation membership via
   `client_id = auth.uid() OR artist_id = auth.uid()`.

## Security
- Only conversation participants can update messages.
- The sender_id != auth.uid() guard ensures a user can only mark messages
  *received by them* as read, not their own sent messages or others' messages.
- No new columns or data exposure.
*/

DROP POLICY IF EXISTS "update_messages" ON messages;
CREATE POLICY "update_messages" ON messages FOR UPDATE
  TO authenticated
  USING (
    sender_id != auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (c.client_id = auth.uid() OR c.artist_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (c.client_id = auth.uid() OR c.artist_id = auth.uid())
    )
  );
