/*
# Add participant metadata columns to conversations

## Purpose
The conversations table stored participant IDs in `participant_ids uuid[]`, but had no columns
for participant names or avatar URLs. The frontend `Conversation` type needs these to render
the conversation list and chat header without an extra profile lookup per conversation.

## Changes
1. Add `participant_names text[]` — display names parallel to `participant_ids`.
2. Add `participant_avatar_urls text[]` — avatar URLs parallel to `participant_ids`.
3. Backfill existing rows with empty arrays (no data loss).

## Security
No RLS changes. Existing policies on `conversations` already check `auth.uid() = ANY(participant_ids)`,
so access control is unaffected. The new columns are metadata only and are visible to the same
participants who can already read the row.
*/

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS participant_names text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS participant_avatar_urls text[] NOT NULL DEFAULT '{}';
