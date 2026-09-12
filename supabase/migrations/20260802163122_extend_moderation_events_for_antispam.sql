/*
# Extend moderation_events for antispam + update RLS

## Purpose
The moderation_events table previously only tracked admin moderation actions
linked to reports. We now extend it to also serve as the audit log for the
antispam system - contact-attempt detection, rate-limit hits, and duplicate
message blocking.

## Changes to `moderation_events`
New columns (all nullable so existing rows remain valid):
1. `user_id` (uuid, nullable) - the user who triggered an antispam event
   (NULL for admin-only moderation actions).
2. `event_type` (text, not null, default 'moderation_action') - broad category:
   'moderation_action' | 'contact_attempt' | 'rate_limit' | 'duplicate_message'.
3. `entity_type` (text, nullable) - what content was involved:
   'commission' | 'comment' | 'offer' | 'profile' | 'message'.
4. `entity_id` (text, nullable) - ID of the content (text for flexibility).
5. `metadata` (jsonb, nullable) - structured extra data
   (detected matches, rate-limit counts, message hash, etc.).
6. `moderator_name` (text, nullable) - display name of the admin who acted.

## RLS changes on `moderation_events`
- INSERT: any authenticated user may insert their own antispam events
  (user_id = auth.uid()), OR admins may insert moderation actions.
  Replaces the previous admin-only INSERT policy.
- SELECT: admin-only (unchanged, but policy recreated to be safe).
- UPDATE: admin-only (new - previously no update policy existed).
- DELETE: admin-only (new - previously no delete policy existed).

## No changes to `moderation_reports` or `admin_audit_logs`
Their schemas and policies are already correct for this feature.

## Notes
1. All new columns are nullable (except event_type which has a default)
   so existing rows are not affected.
2. No data is lost - this is purely additive.
3. Index on (user_id, created_at) for rate-limit lookups.
4. Index on (event_type, created_at) for antispam event filtering.
*/

-- Add new columns to moderation_events
ALTER TABLE moderation_events
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS event_type text NOT NULL DEFAULT 'moderation_action',
  ADD COLUMN IF NOT EXISTS entity_type text,
  ADD COLUMN IF NOT EXISTS entity_id text,
  ADD COLUMN IF NOT EXISTS metadata jsonb,
  ADD COLUMN IF NOT EXISTS moderator_name text;

-- Indexes for antispam queries
CREATE INDEX IF NOT EXISTS idx_moderation_events_user_created
  ON moderation_events (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_moderation_events_type_created
  ON moderation_events (event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_moderation_events_entity
  ON moderation_events (entity_type, entity_id);

-- RLS: drop and recreate all policies on moderation_events
DROP POLICY IF EXISTS "insert_moderation_events" ON moderation_events;
DROP POLICY IF EXISTS "select_moderation_events" ON moderation_events;

-- INSERT: authenticated users can insert their own antispam events,
-- OR admins can insert moderation actions
CREATE POLICY "insert_moderation_events"
ON moderation_events FOR INSERT
TO authenticated
WITH CHECK (
  (user_id = auth.uid())
  OR (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ))
);

-- SELECT: admin-only
CREATE POLICY "select_moderation_events"
ON moderation_events FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- UPDATE: admin-only
DROP POLICY IF EXISTS "update_moderation_events" ON moderation_events;
CREATE POLICY "update_moderation_events"
ON moderation_events FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- DELETE: admin-only
DROP POLICY IF EXISTS "delete_moderation_events" ON moderation_events;
CREATE POLICY "delete_moderation_events"
ON moderation_events FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);
