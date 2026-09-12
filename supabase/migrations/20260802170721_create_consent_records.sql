/*
# Create consent_records table

1. New Tables
- `consent_records` - stores user consent/acceptance events for legal documents and platform rules
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, not null) - the user who gave consent
  - `consent_type` (text, not null) - e.g. 'terms', 'privacy_policy', 'artist_rules', 'client_rules', 'commission_publication', 'image_rights', 'offer_rules', 'comment_not_offer', 'paid_applications'
  - `version` (text, not null) - version identifier of the document/consent text the user agreed to
  - `accepted_at` (timestamptz, default now()) - when the consent was recorded
  - `metadata` (jsonb, default '{}') - additional context (e.g. commission_id, form_url, ip_hash)

2. Indexes
- Index on `user_id` for listing a user's consent history
- Index on `consent_type` for auditing specific consent types
- Unique constraint on `(user_id, consent_type, version)` to prevent duplicate records

3. Security
- Enable RLS on `consent_records`
- Users can read only their own consent records
- Users can insert only their own consent records (user_id defaults to auth.uid())
- No update or delete - consent records are immutable audit entries
*/

CREATE TABLE IF NOT EXISTS consent_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type text NOT NULL,
  version text NOT NULL DEFAULT '1.0',
  accepted_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_consent_records_user_id ON consent_records(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_consent_type ON consent_records(consent_type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_consent_records_unique ON consent_records(user_id, consent_type, version);

ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_consents" ON consent_records;
CREATE POLICY "select_own_consents"
  ON consent_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_consents" ON consent_records;
CREATE POLICY "insert_own_consents"
  ON consent_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
