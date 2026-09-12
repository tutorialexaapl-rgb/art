/*
# Create project execution, messaging, moderation, and audit tables

## Overview
This migration creates the tables for the post-offer phase: project dashboards
(milestones, payments, progress images, messages), standalone messaging
(conversations + messages), moderation (reports), and admin audit logs.

## New Tables

### 1. projects
- A commission project created when an offer is accepted.
- `commission_id` references commissions(id).
- `client_id` / `artist_id` reference profiles(id).
- `accepted_offer_id` references offers(id).
- `status` - awaiting_deposit | in_progress | review | awaiting_final_payment | completed | cancelled
- Contains total_price, deposit_amount, deposit_paid, final_amount, final_paid,
  start_date, estimated_completion, completed_at.

### 2. milestones
- Ordered execution stages within a project.
- `project_id` references projects(id) ON DELETE CASCADE.
- `status` - pending | in_progress | done | skipped

### 3. payments
- Payment records (deposit, final, additional) tied to a project.
- `project_id` references projects(id) ON DELETE CASCADE.
- `type` - deposit | final | additional
- `status` - pending | paid | refunded | failed
- Contains amount, percent_of_total, due_date, paid_at, stripe_payment_intent_id.

### 4. progress_images
- Photos uploaded by the artist to show painting progress.
- `project_id` references projects(id) ON DELETE CASCADE.
- `uploaded_by` text - name of uploader.

### 5. project_messages
- Messages exchanged within a project dashboard.
- `project_id` references projects(id) ON DELETE CASCADE.
- `sender_id` references profiles(id).

### 6. conversations
- Standalone conversation threads (project, commission, or direct).
- `type` - project | commission | direct
- `participant_ids` uuid[] - the two participants.
- Contains last_message_body, last_message_at, unread_count.

### 7. messages
- Individual messages within a conversation.
- `conversation_id` references conversations(id) ON DELETE CASCADE.
- `sender_id` references profiles(id).

### 8. moderation_reports
- Reports filed by admin for content moderation.
- `target_type` - commission | comment | offer | portfolio_item | profile | message
- `status` - open | reviewing | resolved | dismissed

### 9. audit_logs
- Admin action audit trail.
- `admin_id` references profiles(id).
- Contains action, target_type, target_id, details, ip_address.

## Security (RLS)
- projects: SELECT for client or artist of the project; INSERT/UPDATE for client or artist.
- milestones: SELECT for project participants; INSERT/UPDATE/DELETE for project participants.
- payments: SELECT for project participants; INSERT/UPDATE for project participants.
- progress_images: SELECT for project participants; INSERT for project participants.
- project_messages: SELECT for project participants; INSERT for authenticated sender.
- conversations: SELECT for participants; INSERT/UPDATE/DELETE for participants.
- messages: SELECT for conversation participants; INSERT for authenticated sender.
- moderation_reports: admin-only (SELECT/INSERT/UPDATE via admin role check on profiles).
- audit_logs: admin-only SELECT.

## Indexes
- projects: commission_id, client_id, artist_id, status
- milestones: project_id, sort_order
- payments: project_id, status
- progress_images: project_id
- project_messages: project_id, created_at
- conversations: participant_ids (GIN), last_message_at
- messages: conversation_id, created_at
- moderation_reports: status, target_type
- audit_logs: admin_id, created_at
*/

-- ────────────────────────────── projects ──────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id  uuid NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
  commission_title text NOT NULL DEFAULT '',
  client_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_name    text NOT NULL DEFAULT '',
  artist_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  artist_name    text NOT NULL DEFAULT '',
  artist_avatar_url text,
  artist_slug    text,
  status         text NOT NULL DEFAULT 'awaiting_deposit'
                 CHECK (status IN ('awaiting_deposit','in_progress','review','awaiting_final_payment','completed','cancelled')),
  accepted_offer_id uuid REFERENCES offers(id) ON DELETE SET NULL,
  total_price    integer NOT NULL DEFAULT 0,
  deposit_amount integer NOT NULL DEFAULT 0,
  deposit_paid   boolean NOT NULL DEFAULT false,
  final_amount   integer NOT NULL DEFAULT 0,
  final_paid     boolean NOT NULL DEFAULT false,
  start_date     date,
  estimated_completion date,
  completed_at   timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_projects" ON projects;
CREATE POLICY "select_projects" ON projects FOR SELECT
  TO authenticated USING (auth.uid() = client_id OR auth.uid() = artist_id);

DROP POLICY IF EXISTS "insert_projects" ON projects;
CREATE POLICY "insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = client_id OR auth.uid() = artist_id);

DROP POLICY IF EXISTS "update_projects" ON projects;
CREATE POLICY "update_projects" ON projects FOR UPDATE
  TO authenticated USING (auth.uid() = client_id OR auth.uid() = artist_id)
  WITH CHECK (auth.uid() = client_id OR auth.uid() = artist_id);

CREATE INDEX IF NOT EXISTS idx_projects_commission_id ON projects(commission_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_artist_id ON projects(artist_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- ────────────────────────────── milestones ──────────────────────────────

CREATE TABLE IF NOT EXISTS milestones (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort_order  integer NOT NULL DEFAULT 0,
  status      text NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending','in_progress','done','skipped')),
  due_date    date,
  completed_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_milestones" ON milestones;
CREATE POLICY "select_milestones" ON milestones FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = milestones.project_id
      AND (p.client_id = auth.uid() OR p.artist_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "insert_milestones" ON milestones;
CREATE POLICY "insert_milestones" ON milestones FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = milestones.project_id
      AND (p.client_id = auth.uid() OR p.artist_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "update_milestones" ON milestones;
CREATE POLICY "update_milestones" ON milestones FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = milestones.project_id
      AND (p.client_id = auth.uid() OR p.artist_id = auth.uid())
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = milestones.project_id
      AND (p.client_id = auth.uid() OR p.artist_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "delete_milestones" ON milestones;
CREATE POLICY "delete_milestones" ON milestones FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = milestones.project_id
      AND (p.client_id = auth.uid() OR p.artist_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_sort_order ON milestones(sort_order);

-- ────────────────────────────── payments ──────────────────────────────

CREATE TABLE IF NOT EXISTS payments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type        text NOT NULL DEFAULT 'deposit'
              CHECK (type IN ('deposit','final','additional')),
  amount      integer NOT NULL DEFAULT 0,
  percent_of_total integer NOT NULL DEFAULT 0,
  status      text NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending','paid','refunded','failed')),
  due_date    date,
  paid_at     timestamptz,
  stripe_payment_intent_id text,
  invoice_url text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_payments" ON payments;
CREATE POLICY "select_payments" ON payments FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = payments.project_id
      AND (p.client_id = auth.uid() OR p.artist_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "insert_payments" ON payments;
CREATE POLICY "insert_payments" ON payments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = payments.project_id
      AND (p.client_id = auth.uid() OR p.artist_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "update_payments" ON payments;
CREATE POLICY "update_payments" ON payments FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = payments.project_id
      AND (p.client_id = auth.uid() OR p.artist_id = auth.uid())
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = payments.project_id
      AND (p.client_id = auth.uid() OR p.artist_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_payments_project_id ON payments(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ────────────────────────────── progress_images ──────────────────────────────

CREATE TABLE IF NOT EXISTS progress_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url   text NOT NULL,
  caption     text NOT NULL DEFAULT '',
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  uploaded_by text NOT NULL DEFAULT ''
);

ALTER TABLE progress_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_progress_images" ON progress_images;
CREATE POLICY "select_progress_images" ON progress_images FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = progress_images.project_id
      AND (p.client_id = auth.uid() OR p.artist_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "insert_progress_images" ON progress_images;
CREATE POLICY "insert_progress_images" ON progress_images FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = progress_images.project_id
      AND (p.client_id = auth.uid() OR p.artist_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "delete_progress_images" ON progress_images;
CREATE POLICY "delete_progress_images" ON progress_images FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = progress_images.project_id
      AND (p.artist_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_progress_images_project_id ON progress_images(project_id);

-- ────────────────────────────── project_messages ──────────────────────────────

CREATE TABLE IF NOT EXISTS project_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sender_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_name text NOT NULL DEFAULT '',
  sender_role text NOT NULL DEFAULT 'guest'
              CHECK (sender_role IN ('guest','client','artist','admin')),
  body        text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_project_messages" ON project_messages;
CREATE POLICY "select_project_messages" ON project_messages FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_messages.project_id
      AND (p.client_id = auth.uid() OR p.artist_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "insert_project_messages" ON project_messages;
CREATE POLICY "insert_project_messages" ON project_messages FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_messages.project_id
      AND (p.client_id = auth.uid() OR p.artist_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_project_messages_project_id ON project_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_project_messages_created_at ON project_messages(created_at);

-- ────────────────────────────── conversations ──────────────────────────────

CREATE TABLE IF NOT EXISTS conversations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type          text NOT NULL DEFAULT 'direct'
                CHECK (type IN ('project','commission','direct')),
  participant_ids uuid[] NOT NULL DEFAULT '{}',
  participant_names text[] NOT NULL DEFAULT '{}',
  participant_avatar_urls text[] NOT NULL DEFAULT '{}',
  project_title text,
  commission_title text,
  last_message_body text,
  last_message_at timestamptz,
  unread_count integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_conversations" ON conversations;
CREATE POLICY "select_conversations" ON conversations FOR SELECT
  TO authenticated USING (auth.uid() = ANY(participant_ids));

DROP POLICY IF EXISTS "insert_conversations" ON conversations;
CREATE POLICY "insert_conversations" ON conversations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = ANY(participant_ids));

DROP POLICY IF EXISTS "update_conversations" ON conversations;
CREATE POLICY "update_conversations" ON conversations FOR UPDATE
  TO authenticated USING (auth.uid() = ANY(participant_ids))
  WITH CHECK (auth.uid() = ANY(participant_ids));

DROP POLICY IF EXISTS "delete_conversations" ON conversations;
CREATE POLICY "delete_conversations" ON conversations FOR DELETE
  TO authenticated USING (auth.uid() = ANY(participant_ids));

CREATE INDEX IF NOT EXISTS idx_conversations_participant_ids ON conversations USING GIN(participant_ids);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- ────────────────────────────── messages ──────────────────────────────

CREATE TABLE IF NOT EXISTS messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_name     text NOT NULL DEFAULT '',
  sender_role     text NOT NULL DEFAULT 'guest'
                  CHECK (sender_role IN ('guest','client','artist','admin')),
  body            text NOT NULL DEFAULT '',
  read_at         timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_messages" ON messages;
CREATE POLICY "select_messages" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND auth.uid() = ANY(c.participant_ids)
    )
  );

DROP POLICY IF EXISTS "insert_messages" ON messages;
CREATE POLICY "insert_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND auth.uid() = ANY(c.participant_ids)
    )
  );

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- ────────────────────────────── moderation_reports ──────────────────────────────

CREATE TABLE IF NOT EXISTS moderation_reports (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id     uuid,
  target_type   text NOT NULL DEFAULT 'comment'
                CHECK (target_type IN ('commission','comment','offer','portfolio_item','profile','message')),
  reported_by   uuid REFERENCES profiles(id),
  reported_by_name text NOT NULL DEFAULT '',
  reason        text NOT NULL DEFAULT '',
  description   text NOT NULL DEFAULT '',
  status        text NOT NULL DEFAULT 'open'
                CHECK (status IN ('open','reviewing','resolved','dismissed')),
  resolved_by   uuid REFERENCES profiles(id),
  resolved_at   timestamptz,
  resolution_note text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE moderation_reports ENABLE ROW LEVEL SECURITY;

-- Admin-only access: check that the user's profile has role='admin'
DROP POLICY IF EXISTS "select_moderation_reports_admin" ON moderation_reports;
CREATE POLICY "select_moderation_reports_admin" ON moderation_reports FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_moderation_reports" ON moderation_reports;
CREATE POLICY "insert_moderation_reports" ON moderation_reports FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = reported_by);

DROP POLICY IF EXISTS "update_moderation_reports_admin" ON moderation_reports;
CREATE POLICY "update_moderation_reports_admin" ON moderation_reports FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE INDEX IF NOT EXISTS idx_moderation_reports_status ON moderation_reports(status);
CREATE INDEX IF NOT EXISTS idx_moderation_reports_target_type ON moderation_reports(target_type);

-- ────────────────────────────── audit_logs ──────────────────────────────

CREATE TABLE IF NOT EXISTS audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    uuid REFERENCES profiles(id),
  admin_name  text NOT NULL DEFAULT '',
  action      text NOT NULL DEFAULT '',
  target_type text NOT NULL DEFAULT '',
  target_id   text,
  details     text NOT NULL DEFAULT '',
  ip_address  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_audit_logs_admin" ON audit_logs;
CREATE POLICY "select_audit_logs_admin" ON audit_logs FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_audit_logs" ON audit_logs;
CREATE POLICY "insert_audit_logs" ON audit_logs FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
