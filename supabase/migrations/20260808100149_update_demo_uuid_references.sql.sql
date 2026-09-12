/*
# Update all FK references from old demo UUIDs to new auth user UUIDs

## Context
Demo auth users were re-created via Supabase signup (GoTrue-compatible).
New UUIDs differ from the original seeded ones. The profiles table and
all child tables still reference the old UUIDs.

## New UUIDs
- Client: 1bd44a8d-8f5b-46a8-a9fb-ad440603a12e (was ...000c01)
- Artist: f2c00248-62db-415c-8730-79db07211a72 (was ...000a01)

## Approach
Update every table that references profiles.id, then update profiles.id itself.
All done inside a DO block so FK checks are deferred to the end.
*/
DO $$
BEGIN
  -- Child tables referencing profiles.id
  UPDATE admin_audit_logs SET admin_id = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE admin_id = '11111111-1111-1111-1111-000000000c01';
  UPDATE admin_audit_logs SET admin_id = 'f2c00248-62db-415c-8730-79db07211a72' WHERE admin_id = '11111111-1111-1111-1111-000000000a01';

  UPDATE artist_profiles SET user_id = 'f2c00248-62db-415c-8730-79db07211a72' WHERE user_id = '11111111-1111-1111-1111-000000000a01';

  UPDATE client_profiles SET user_id = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE user_id = '11111111-1111-1111-1111-000000000c01';

  UPDATE commission_attachments SET uploaded_by = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE uploaded_by = '11111111-1111-1111-1111-000000000c01';
  UPDATE commission_attachments SET uploaded_by = 'f2c00248-62db-415c-8730-79db07211a72' WHERE uploaded_by = '11111111-1111-1111-1111-000000000a01';

  UPDATE commission_comments SET author_id = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE author_id = '11111111-1111-1111-1111-000000000c01';
  UPDATE commission_comments SET author_id = 'f2c00248-62db-415c-8730-79db07211a72' WHERE author_id = '11111111-1111-1111-1111-000000000a01';

  UPDATE commission_offers SET artist_id = 'f2c00248-62db-415c-8730-79db07211a72' WHERE artist_id = '11111111-1111-1111-1111-000000000a01';

  UPDATE commission_projects SET client_id = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE client_id = '11111111-1111-1111-1111-000000000c01';
  UPDATE commission_projects SET artist_id = 'f2c00248-62db-415c-8730-79db07211a72' WHERE artist_id = '11111111-1111-1111-1111-000000000a01';

  UPDATE commission_requests SET client_id = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE client_id = '11111111-1111-1111-1111-000000000c01';

  UPDATE commission_status_history SET changed_by = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE changed_by = '11111111-1111-1111-1111-000000000c01';
  UPDATE commission_status_history SET changed_by = 'f2c00248-62db-415c-8730-79db07211a72' WHERE changed_by = '11111111-1111-1111-1111-000000000a01';

  UPDATE consent_records SET user_id = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE user_id = '11111111-1111-1111-1111-000000000c01';
  UPDATE consent_records SET user_id = 'f2c00248-62db-415c-8730-79db07211a72' WHERE user_id = '11111111-1111-1111-1111-000000000a01';

  UPDATE conversations SET client_id = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE client_id = '11111111-1111-1111-1111-000000000c01';
  UPDATE conversations SET artist_id = 'f2c00248-62db-415c-8730-79db07211a72' WHERE artist_id = '11111111-1111-1111-1111-000000000a01';

  UPDATE messages SET sender_id = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE sender_id = '11111111-1111-1111-1111-000000000c01';
  UPDATE messages SET sender_id = 'f2c00248-62db-415c-8730-79db07211a72' WHERE sender_id = '11111111-1111-1111-1111-000000000a01';

  UPDATE milestone_attachments SET uploaded_by = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE uploaded_by = '11111111-1111-1111-1111-000000000c01';
  UPDATE milestone_attachments SET uploaded_by = 'f2c00248-62db-415c-8730-79db07211a72' WHERE uploaded_by = '11111111-1111-1111-1111-000000000a01';

  UPDATE moderation_events SET moderator_id = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE moderator_id = '11111111-1111-1111-1111-000000000c01';
  UPDATE moderation_events SET moderator_id = 'f2c00248-62db-415c-8730-79db07211a72' WHERE moderator_id = '11111111-1111-1111-1111-000000000a01';

  UPDATE moderation_reports SET reported_by = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE reported_by = '11111111-1111-1111-1111-000000000c01';
  UPDATE moderation_reports SET reported_by = 'f2c00248-62db-415c-8730-79db07211a72' WHERE reported_by = '11111111-1111-1111-1111-000000000a01';
  UPDATE moderation_reports SET resolved_by = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE resolved_by = '11111111-1111-1111-1111-000000000c01';
  UPDATE moderation_reports SET resolved_by = 'f2c00248-62db-415c-8730-79db07211a72' WHERE resolved_by = '11111111-1111-1111-1111-000000000a01';

  UPDATE platform_settings SET updated_by = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE updated_by = '11111111-1111-1111-1111-000000000c01';
  UPDATE platform_settings SET updated_by = 'f2c00248-62db-415c-8730-79db07211a72' WHERE updated_by = '11111111-1111-1111-1111-000000000a01';

  -- Finally, update profiles.id itself
  UPDATE profiles SET id = '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e' WHERE id = '11111111-1111-1111-1111-000000000c01';
  UPDATE profiles SET id = 'f2c00248-62db-415c-8730-79db07211a72' WHERE id = '11111111-1111-1111-1111-000000000a01';
END $$;
