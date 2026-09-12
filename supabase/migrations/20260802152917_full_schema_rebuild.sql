/*
# Full schema rebuild - 22 tables for Atelier commission platform

## What this migration does

This migration REPLACES the previous partial schema (18 tables, 0 rows, no data)
with a complete, consistently-named 22-table schema for the Atelier art-commission
platform. All prior tables are dropped with CASCADE first - they contained no data.

## Tables created (22)

1.  profiles                       - base user record, 1:1 with auth.users
2.  client_profiles                - extended client data, 1:1 with profiles
3.  artist_profiles                - extended artist data + portfolio metadata
4.  artist_portfolio_items         - portfolio images belonging to an artist
5.  commission_requests            - client commission listing (the "zlecenie")
6.  commission_attachments         - files attached to a commission request
7.  commission_comments            - public/private discussion on a commission
8.  commission_comment_attachments - files attached to a comment
9.  commission_offers              - artist proposals on a commission
10. commission_projects            - active engagement after offer acceptance
11. conversations                  - 1:1 or project-scoped chat threads
12. messages                       - individual chat messages
13. message_attachments            - files attached to a message
14. commission_milestones          - ordered delivery steps within a project
15. milestone_attachments          - progress images/files per milestone
16. commission_payments            - deposit / milestone / final payments
17. commission_status_history      - audit trail of status transitions
18. moderation_reports             - user-submitted reports
19. moderation_events              - moderator action log per report
20. admin_audit_logs               - admin action audit trail
21. consent_records                - GDPR consent tracking per user
22. platform_settings              - key/value app configuration (JSONB)

## Naming conventions
- All PKs: uuid DEFAULT gen_random_uuid()
- FK columns use full parent table name: commission_request_id, commission_project_id
- All tables have created_at DEFAULT now()
- Tables with mutable data have updated_at (trigger-maintained)
- Status columns use text + CHECK constraint, not enums

## Constraints of note
- commission_requests.slug is UNIQUE
- Partial unique index on commission_offers(commission_request_id, artist_id)
  WHERE status IN ('pending','accepted') - one active offer per artist per commission
- All child tables use ON DELETE CASCADE where the parent owns the child

## Security
- RLS is ENABLED on every table (locked down by default).
- Policies are NOT defined in this migration - see rls_policies migration.
- Tables are inaccessible until policies are added.

## Notes
1. The previous schema used names like `commissions`, `offers`, `projects`,
   `portfolio_items`, `audit_logs`. These are renamed to `commission_requests`,
   `commission_offers`, `commission_projects`, `artist_portfolio_items`,
   `admin_audit_logs` for clarity and consistency.
2. All previous tables had 0 rows - no data loss from the drop.
*/

-- ──────────────────────────────────────────────
-- 1. Drop previous schema (all tables empty)
-- ──────────────────────────────────────────────
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS moderation_reports CASCADE;
DROP TABLE IF EXISTS project_messages CASCADE;
DROP TABLE IF EXISTS progress_images CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS commission_comment_attachments CASCADE;
DROP TABLE IF EXISTS commission_comments CASCADE;
DROP TABLE IF EXISTS commission_attachments CASCADE;
DROP TABLE IF EXISTS commissions CASCADE;
DROP TABLE IF EXISTS portfolio_items CASCADE;
DROP TABLE IF EXISTS artist_profiles CASCADE;
DROP TABLE IF EXISTS client_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ──────────────────────────────────────────────
-- 2. Core tables (in dependency order)
-- ──────────────────────────────────────────────

-- 1. profiles - mirrors auth.users, holds role + display info
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid() REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL UNIQUE,
  role        text NOT NULL DEFAULT 'guest'
                CHECK (role IN ('guest','client','artist','admin')),
  status      text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','approved','suspended')),
  display_name text NOT NULL DEFAULT '',
  avatar_url  text,
  bio         text,
  location    text,
  website     text,
  instagram   text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. client_profiles - 1:1 extension for clients
CREATE TABLE IF NOT EXISTS client_profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_url  text,
  bio         text,
  location    text,
  phone       text,
  client_type text CHECK (client_type IN ('individual','company')),
  company     text,
  nip         text,
  preferred_styles text[] NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- 3. artist_profiles - 1:1 extension for artists
CREATE TABLE IF NOT EXISTS artist_profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug        text NOT NULL UNIQUE,
  artist_name text NOT NULL,
  avatar_url  text,
  cover_url   text,
  bio         text NOT NULL DEFAULT '',
  location    text NOT NULL DEFAULT '',
  styles      text[] NOT NULL DEFAULT '{}',
  techniques  text[] NOT NULL DEFAULT '{}',
  specializations text[] NOT NULL DEFAULT '{}',
  price_range_min  numeric(10,2) NOT NULL DEFAULT 0,
  price_range_max  numeric(10,2) NOT NULL DEFAULT 0,
  average_delivery_days int NOT NULL DEFAULT 0,
  approval_status text NOT NULL DEFAULT 'pending'
                CHECK (approval_status IN ('pending','approved','rejected')),
  is_verified boolean NOT NULL DEFAULT false,
  years_experience int NOT NULL DEFAULT 0,
  website     text,
  instagram   text,
  completed_projects int NOT NULL DEFAULT 0,
  average_rating numeric(3,2) NOT NULL DEFAULT 0,
  review_count int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- 4. artist_portfolio_items - portfolio gallery images
CREATE TABLE IF NOT EXISTS artist_portfolio_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id   uuid NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
  title       text NOT NULL,
  image_url   text NOT NULL,
  technique   text NOT NULL DEFAULT '',
  year        text NOT NULL DEFAULT '',
  width_cm    numeric(10,2) NOT NULL DEFAULT 0,
  height_cm   numeric(10,2) NOT NULL DEFAULT 0,
  is_public   boolean NOT NULL DEFAULT true,
  is_for_sale boolean NOT NULL DEFAULT false,
  price       numeric(10,2),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 5. commission_requests - the core "zlecenie" listing
CREATE TABLE IF NOT EXISTS commission_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,
  title       text NOT NULL,
  client_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_name text NOT NULL DEFAULT '',
  status      text NOT NULL DEFAULT 'open'
                CHECK (status IN ('open','in_progress','completed','cancelled','closed')),
  public_summary    text NOT NULL DEFAULT '',
  private_description text NOT NULL DEFAULT '',
  room_type   text,
  intended_use text,
  style       text NOT NULL DEFAULT '',
  mood        text NOT NULL DEFAULT '',
  preferred_colors  text[] NOT NULL DEFAULT '{}',
  colors_to_avoid    text[] NOT NULL DEFAULT '{}',
  width_cm    numeric(10,2) NOT NULL DEFAULT 0,
  height_cm   numeric(10,2) NOT NULL DEFAULT 0,
  orientation text NOT NULL DEFAULT 'custom'
                CHECK (orientation IN ('portrait','landscape','square','custom')),
  budget_min  numeric(10,2) NOT NULL DEFAULT 0,
  budget_max  numeric(10,2) NOT NULL DEFAULT 0,
  deadline    date,
  location    text,
  frame_required    boolean NOT NULL DEFAULT false,
  delivery_required boolean NOT NULL DEFAULT false,
  inspiration_images text[] NOT NULL DEFAULT '{}',
  tags        text[] NOT NULL DEFAULT '{}',
  medium      text NOT NULL DEFAULT '',
  views       int NOT NULL DEFAULT 0,
  comments_count int NOT NULL DEFAULT 0,
  offers_count   int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 6. commission_attachments - files on a commission request
CREATE TABLE IF NOT EXISTS commission_attachments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_request_id uuid NOT NULL REFERENCES commission_requests(id) ON DELETE CASCADE,
  url         text NOT NULL,
  filename    text NOT NULL,
  mime_type   text NOT NULL DEFAULT '',
  size_bytes  bigint NOT NULL DEFAULT 0,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

-- 7. commission_comments - public/private discussion
CREATE TABLE IF NOT EXISTS commission_comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_request_id uuid NOT NULL REFERENCES commission_requests(id) ON DELETE CASCADE,
  author_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  author_name text NOT NULL DEFAULT '',
  author_role text NOT NULL DEFAULT 'guest',
  author_avatar_url text,
  body        text NOT NULL,
  is_public   boolean NOT NULL DEFAULT true,
  is_hidden   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 8. commission_comment_attachments - files on a comment
CREATE TABLE IF NOT EXISTS commission_comment_attachments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id  uuid NOT NULL REFERENCES commission_comments(id) ON DELETE CASCADE,
  url         text NOT NULL,
  filename    text NOT NULL,
  mime_type   text NOT NULL DEFAULT ''
);

-- 9. commission_offers - artist proposals
CREATE TABLE IF NOT EXISTS commission_offers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_request_id uuid NOT NULL REFERENCES commission_requests(id) ON DELETE CASCADE,
  artist_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  artist_name text NOT NULL DEFAULT '',
  artist_avatar_url text,
  artist_slug text,
  message     text NOT NULL DEFAULT '',
  price       numeric(10,2) NOT NULL DEFAULT 0,
  estimated_days int NOT NULL DEFAULT 0,
  includes_materials boolean NOT NULL DEFAULT false,
  includes_shipping  boolean NOT NULL DEFAULT false,
  includes_frame     boolean NOT NULL DEFAULT false,
  deposit_percent int NOT NULL DEFAULT 30
                CHECK (deposit_percent >= 0 AND deposit_percent <= 100),
  portfolio_refs text[] NOT NULL DEFAULT '{}',
  status      text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','accepted','rejected','withdrawn','expired')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 10. commission_projects - active engagement after offer accepted
CREATE TABLE IF NOT EXISTS commission_projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_request_id uuid NOT NULL REFERENCES commission_requests(id) ON DELETE CASCADE,
  commission_title text NOT NULL DEFAULT '',
  client_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_name text NOT NULL DEFAULT '',
  artist_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  artist_name text NOT NULL DEFAULT '',
  artist_avatar_url text,
  artist_slug text,
  status      text NOT NULL DEFAULT 'in_progress'
                CHECK (status IN ('in_progress','on_hold','completed','cancelled','disputed')),
  accepted_offer_id uuid REFERENCES commission_offers(id) ON DELETE SET NULL,
  total_price     numeric(10,2) NOT NULL DEFAULT 0,
  deposit_amount  numeric(10,2) NOT NULL DEFAULT 0,
  deposit_paid    boolean NOT NULL DEFAULT false,
  final_amount    numeric(10,2) NOT NULL DEFAULT 0,
  final_paid      boolean NOT NULL DEFAULT false,
  stripe_payment_intent_id text,
  start_date      date,
  estimated_completion date,
  completed_at    timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 11. conversations - chat threads (direct or project-scoped)
CREATE TABLE IF NOT EXISTS conversations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type        text NOT NULL DEFAULT 'direct'
                CHECK (type IN ('direct','project','support')),
  client_id   uuid REFERENCES profiles(id) ON DELETE CASCADE,
  artist_id   uuid REFERENCES profiles(id) ON DELETE CASCADE,
  commission_request_id uuid REFERENCES commission_requests(id) ON DELETE CASCADE,
  commission_project_id uuid REFERENCES commission_projects(id) ON DELETE CASCADE,
  project_title    text,
  commission_title text,
  last_message_body text,
  last_message_at  timestamptz,
  unread_count int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 12. messages - individual chat messages
CREATE TABLE IF NOT EXISTS messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_name text NOT NULL DEFAULT '',
  sender_role text NOT NULL DEFAULT 'guest',
  body        text NOT NULL,
  read_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 13. message_attachments - files on a message
CREATE TABLE IF NOT EXISTS message_attachments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id  uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  url         text NOT NULL,
  filename    text NOT NULL,
  mime_type   text NOT NULL DEFAULT ''
);

-- 14. commission_milestones - ordered delivery steps
CREATE TABLE IF NOT EXISTS commission_milestones (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_project_id uuid NOT NULL REFERENCES commission_projects(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order  int NOT NULL DEFAULT 0,
  status      text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','in_progress','completed','approved')),
  due_date    date,
  completed_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 15. milestone_attachments - progress images per milestone
CREATE TABLE IF NOT EXISTS milestone_attachments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id uuid NOT NULL REFERENCES commission_milestones(id) ON DELETE CASCADE,
  url         text NOT NULL,
  filename    text NOT NULL,
  mime_type   text NOT NULL DEFAULT '',
  caption     text,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

-- 16. commission_payments - deposit / milestone / final
CREATE TABLE IF NOT EXISTS commission_payments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_project_id uuid NOT NULL REFERENCES commission_projects(id) ON DELETE CASCADE,
  type        text NOT NULL DEFAULT 'deposit'
                CHECK (type IN ('deposit','milestone','final')),
  amount      numeric(10,2) NOT NULL DEFAULT 0,
  percent_of_total numeric(5,2) NOT NULL DEFAULT 0,
  status      text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','paid','failed','refunded')),
  due_date    date,
  paid_at     timestamptz,
  stripe_payment_intent_id text,
  invoice_url text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 17. commission_status_history - audit trail of status changes
CREATE TABLE IF NOT EXISTS commission_status_history (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL
                CHECK (entity_type IN ('commission','project','offer','milestone','payment')),
  entity_id   uuid NOT NULL,
  from_status text,
  to_status   text NOT NULL,
  changed_by  uuid REFERENCES profiles(id) ON DELETE SET NULL,
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 18. moderation_reports - user-submitted reports
CREATE TABLE IF NOT EXISTS moderation_reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL
                CHECK (target_type IN ('comment','commission','project','message','profile','portfolio_item')),
  target_id   uuid NOT NULL,
  reported_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reported_by_name text NOT NULL DEFAULT '',
  reason      text NOT NULL,
  description text NOT NULL DEFAULT '',
  status      text NOT NULL DEFAULT 'open'
                CHECK (status IN ('open','investigating','resolved','dismissed')),
  resolved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  resolution_note text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 19. moderation_events - moderator action log per report
CREATE TABLE IF NOT EXISTS moderation_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id   uuid REFERENCES moderation_reports(id) ON DELETE CASCADE,
  moderator_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action      text NOT NULL
                CHECK (action IN ('opened','assigned','warned','hidden','restored','banned','resolved','dismissed')),
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 20. admin_audit_logs - admin action audit trail
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  admin_name  text NOT NULL DEFAULT '',
  action      text NOT NULL,
  target_type text NOT NULL,
  target_id   uuid,
  details     text NOT NULL DEFAULT '',
  ip_address  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 21. consent_records - GDPR consent tracking
CREATE TABLE IF NOT EXISTS consent_records (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  consent_type text NOT NULL
                CHECK (consent_type IN ('terms','privacy','marketing','cookies','data_processing')),
  version     text NOT NULL,
  granted     boolean NOT NULL DEFAULT true,
  ip_address  text,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 22. platform_settings - key/value app configuration
CREATE TABLE IF NOT EXISTS platform_settings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text NOT NULL UNIQUE,
  value       jsonb NOT NULL DEFAULT '{}',
  description text,
  is_public   boolean NOT NULL DEFAULT false,
  updated_by  uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────
-- 3. updated_at trigger function + triggers
-- ──────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Attach trigger to every table that has updated_at
DO $$
DECLARE
  t text;
  tables_with_updated_at text[] := ARRAY[
    'profiles','client_profiles','artist_profiles','artist_portfolio_items',
    'commission_requests','commission_comments','commission_offers',
    'commission_projects','conversations','commission_milestones',
    'commission_payments','moderation_reports','platform_settings'
  ];
BEGIN
  FOREACH t IN ARRAY tables_with_updated_at LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON %I; '
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I '
      'FOR EACH ROW EXECUTE FUNCTION update_updated_at();',
      t, t
    );
  END LOOP;
END;
$$;

-- ──────────────────────────────────────────────
-- 4. Indexes
-- ──────────────────────────────────────────────

-- Required indexes (per spec)
CREATE INDEX IF NOT EXISTS idx_commission_requests_status     ON commission_requests (status);
CREATE INDEX IF NOT EXISTS idx_commission_requests_slug       ON commission_requests (slug);
CREATE INDEX IF NOT EXISTS idx_commission_requests_client_id  ON commission_requests (client_id);
CREATE INDEX IF NOT EXISTS idx_commission_offers_request_id   ON commission_offers (commission_request_id);
CREATE INDEX IF NOT EXISTS idx_commission_offers_artist_id    ON commission_offers (artist_id);
CREATE INDEX IF NOT EXISTS idx_commission_comments_request_id ON commission_comments (commission_request_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_approval       ON artist_profiles (approval_status);
CREATE INDEX IF NOT EXISTS idx_conversations_client_id        ON conversations (client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_artist_id        ON conversations (artist_id);
CREATE INDEX IF NOT EXISTS idx_commission_projects_client_id  ON commission_projects (client_id);
CREATE INDEX IF NOT EXISTS idx_commission_projects_artist_id  ON commission_projects (artist_id);

-- Partial unique index: one active offer per artist per commission
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_offer_per_artist
  ON commission_offers (commission_request_id, artist_id)
  WHERE status IN ('pending', 'accepted');

-- Additional helpful indexes
CREATE INDEX IF NOT EXISTS idx_artist_portfolio_items_artist_id ON artist_portfolio_items (artist_id);
CREATE INDEX IF NOT EXISTS idx_commission_attachments_request_id ON commission_attachments (commission_request_id);
CREATE INDEX IF NOT EXISTS idx_commission_projects_request_id   ON commission_projects (commission_request_id);
CREATE INDEX IF NOT EXISTS idx_commission_milestones_project_id ON commission_milestones (commission_project_id);
CREATE INDEX IF NOT EXISTS idx_commission_payments_project_id   ON commission_payments (commission_project_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id         ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_user_id          ON consent_records (user_id);
CREATE INDEX IF NOT EXISTS idx_moderation_reports_status        ON moderation_reports (status);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at      ON admin_audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_commission_status_history_entity ON commission_status_history (entity_type, entity_id);

-- ──────────────────────────────────────────────
-- 5. Enable RLS on all tables (policies in separate migration)
-- ──────────────────────────────────────────────

ALTER TABLE profiles                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_profiles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_portfolio_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_requests            ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_attachments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_comments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_comment_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_offers              ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_projects            ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_milestones          ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_attachments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_payments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_status_history      ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_reports             ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_events              ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs               ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records                ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings              ENABLE ROW LEVEL SECURITY;