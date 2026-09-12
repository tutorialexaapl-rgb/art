/*
# Create commissions, comments, and offers tables

## Overview
This migration creates the core marketplace tables: commissions (the painting
requests posted by clients), comments (public/private discussions under commissions),
and formal offers (private proposals from artists to commission owners).

## New Tables

### 1. commissions
- A painting commission request posted by a client.
- `client_id` references profiles(id) - the owner.
- `slug` - unique URL slug for public commission pages.
- `status` - draft | open | in_progress | completed | cancelled | closed
- Contains public_summary (visible to guests), private_description (logged-in only),
  room_type, intended_use, style, mood, preferred_colors[], colors_to_avoid[],
  dimensions, orientation, budget_min/max, deadline, location,
  frame_required, delivery_required, tags[], medium.
- `inspiration_images` text[] - URLs of inspiration photos.
- Denormalized counters: views, comments_count, offers_count.

### 2. commission_attachments
- File attachments uploaded by the commission owner.
- `commission_id` references commissions(id) ON DELETE CASCADE.

### 3. commission_comments
- Comments under a commission (artists asking questions, clients answering).
- `commission_id` references commissions(id) ON DELETE CASCADE.
- `author_id` references profiles(id).
- `is_public` - whether the comment is visible to guests.

### 4. commission_comment_attachments
- Image attachments on comments (artists adding sample photos).
- `comment_id` references commission_comments(id) ON DELETE CASCADE.

### 5. offers
- Formal, private offers from artists to commission owners.
- `commission_id` references commissions(id) ON DELETE CASCADE.
- `artist_id` references profiles(id).
- `status` - pending | accepted | declined | withdrawn
- Contains message, price, estimated_days, includes_* flags, deposit_percent,
  portfolio_refs text[].

## Security (RLS)
- commissions: SELECT public (all authenticated); INSERT/UPDATE/DELETE for owner only.
  The app layer distinguishes public_summary (guest-visible) from private_description (owner-only).
- commission_attachments: owner-scoped SELECT/INSERT/DELETE.
- commission_comments: SELECT for public comments, commission owner, or comment author;
  INSERT for any authenticated user; UPDATE/DELETE for comment author.
- commission_comment_attachments: follows comment ownership.
- offers: SELECT for commission owner or offer author only (private);
  INSERT for authenticated artists; UPDATE for offer author or commission owner.

## Indexes
- commissions: slug (unique), client_id, status, created_at
- commission_attachments: commission_id
- commission_comments: commission_id, author_id
- offers: commission_id, artist_id, status
*/

-- ────────────────────────────── commissions ──────────────────────────────

CREATE TABLE IF NOT EXISTS commissions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           text NOT NULL,
  title          text NOT NULL DEFAULT '',
  client_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_name    text NOT NULL DEFAULT '',
  status         text NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft','open','in_progress','completed','cancelled','closed')),
  public_summary text NOT NULL DEFAULT '',
  private_description text NOT NULL DEFAULT '',
  room_type      text NOT NULL DEFAULT 'inne'
                 CHECK (room_type IN ('salon','sypialnia','jadalnia','kuchnia','biuro','lobby','restauracja','hotel','korytarz','balkon','inne')),
  intended_use   text NOT NULL DEFAULT 'mieszkalne'
                 CHECK (intended_use IN ('mieszkalne','komercyjne','prezent','kolekcja','investycja')),
  style          text NOT NULL DEFAULT '',
  mood           text NOT NULL DEFAULT '',
  preferred_colors text[] NOT NULL DEFAULT '{}',
  colors_to_avoid text[] NOT NULL DEFAULT '{}',
  width_cm       integer NOT NULL DEFAULT 0,
  height_cm      integer NOT NULL DEFAULT 0,
  orientation    text NOT NULL DEFAULT 'landscape'
                 CHECK (orientation IN ('landscape','portrait','square')),
  budget_min     integer NOT NULL DEFAULT 0,
  budget_max     integer NOT NULL DEFAULT 0,
  deadline       date,
  location       text,
  frame_required boolean NOT NULL DEFAULT false,
  delivery_required boolean NOT NULL DEFAULT false,
  inspiration_images text[] NOT NULL DEFAULT '{}',
  tags           text[] NOT NULL DEFAULT '{}',
  medium         text NOT NULL DEFAULT '',
  views          integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  offers_count   integer NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_commissions" ON commissions;
CREATE POLICY "select_commissions" ON commissions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_commissions" ON commissions;
CREATE POLICY "insert_own_commissions" ON commissions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "update_own_commissions" ON commissions;
CREATE POLICY "update_own_commissions" ON commissions FOR UPDATE
  TO authenticated USING (auth.uid() = client_id) WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "delete_own_commissions" ON commissions;
CREATE POLICY "delete_own_commissions" ON commissions FOR DELETE
  TO authenticated USING (auth.uid() = client_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_commissions_slug ON commissions(slug);
CREATE INDEX IF NOT EXISTS idx_commissions_client_id ON commissions(client_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_commissions_created_at ON commissions(created_at DESC);

-- ───────────────────────── commission_attachments ─────────────────────────

CREATE TABLE IF NOT EXISTS commission_attachments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id uuid NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
  url           text NOT NULL,
  filename      text NOT NULL DEFAULT '',
  mime_type     text NOT NULL DEFAULT '',
  size_bytes    integer NOT NULL DEFAULT 0,
  uploaded_by   uuid REFERENCES profiles(id),
  uploaded_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE commission_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_commission_attachments_owner" ON commission_attachments;
CREATE POLICY "select_commission_attachments_owner" ON commission_attachments FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commissions c
      WHERE c.id = commission_attachments.commission_id
      AND c.client_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_commission_attachments_owner" ON commission_attachments;
CREATE POLICY "insert_commission_attachments_owner" ON commission_attachments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM commissions c
      WHERE c.id = commission_attachments.commission_id
      AND c.client_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_commission_attachments_owner" ON commission_attachments;
CREATE POLICY "delete_commission_attachments_owner" ON commission_attachments FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commissions c
      WHERE c.id = commission_attachments.commission_id
      AND c.client_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_commission_attachments_commission_id ON commission_attachments(commission_id);

-- ───────────────────────── commission_comments ─────────────────────────

CREATE TABLE IF NOT EXISTS commission_comments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id uuid NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
  author_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  author_name   text NOT NULL DEFAULT '',
  author_role   text NOT NULL DEFAULT 'guest'
                CHECK (author_role IN ('guest','client','artist','admin')),
  author_avatar_url text,
  body          text NOT NULL DEFAULT '',
  is_public     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE commission_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_commission_comments" ON commission_comments;
CREATE POLICY "select_commission_comments" ON commission_comments FOR SELECT
  TO authenticated USING (
    is_public = true
    OR EXISTS (
      SELECT 1 FROM commissions c
      WHERE c.id = commission_comments.commission_id
      AND c.client_id = auth.uid()
    )
    OR auth.uid() = author_id
  );

DROP POLICY IF EXISTS "insert_commission_comments" ON commission_comments;
CREATE POLICY "insert_commission_comments" ON commission_comments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "update_own_commission_comments" ON commission_comments;
CREATE POLICY "update_own_commission_comments" ON commission_comments FOR UPDATE
  TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "delete_own_commission_comments" ON commission_comments;
CREATE POLICY "delete_own_commission_comments" ON commission_comments FOR DELETE
  TO authenticated USING (auth.uid() = author_id);

CREATE INDEX IF NOT EXISTS idx_commission_comments_commission_id ON commission_comments(commission_id);
CREATE INDEX IF NOT EXISTS idx_commission_comments_author_id ON commission_comments(author_id);

-- ──────────────────────── commission_comment_attachments ────────────────────────

CREATE TABLE IF NOT EXISTS commission_comment_attachments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id  uuid NOT NULL REFERENCES commission_comments(id) ON DELETE CASCADE,
  url         text NOT NULL,
  filename    text NOT NULL DEFAULT '',
  mime_type   text NOT NULL DEFAULT ''
);

ALTER TABLE commission_comment_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_comment_attachments" ON commission_comment_attachments;
CREATE POLICY "select_comment_attachments" ON commission_comment_attachments FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commission_comments cc
      WHERE cc.id = commission_comment_attachments.comment_id
      AND (
        cc.is_public = true
        OR EXISTS (
          SELECT 1 FROM commissions c
          WHERE c.id = cc.commission_id
          AND c.client_id = auth.uid()
        )
        OR auth.uid() = cc.author_id
      )
    )
  );

DROP POLICY IF EXISTS "insert_comment_attachments" ON commission_comment_attachments;
CREATE POLICY "insert_comment_attachments" ON commission_comment_attachments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM commission_comments cc
      WHERE cc.id = commission_comment_attachments.comment_id
      AND auth.uid() = cc.author_id
    )
  );

DROP POLICY IF EXISTS "delete_comment_attachments" ON commission_comment_attachments;
CREATE POLICY "delete_comment_attachments" ON commission_comment_attachments FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commission_comments cc
      WHERE cc.id = commission_comment_attachments.comment_id
      AND auth.uid() = cc.author_id
    )
  );

CREATE INDEX IF NOT EXISTS idx_comment_attachments_comment_id ON commission_comment_attachments(comment_id);

-- ─────────────────────────────── offers ───────────────────────────────

CREATE TABLE IF NOT EXISTS offers (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id    uuid NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
  artist_id        uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  artist_name      text NOT NULL DEFAULT '',
  artist_avatar_url text,
  artist_slug      text,
  message          text NOT NULL DEFAULT '',
  price            integer NOT NULL DEFAULT 0,
  estimated_days   integer NOT NULL DEFAULT 0,
  includes_materials boolean NOT NULL DEFAULT false,
  includes_shipping boolean NOT NULL DEFAULT false,
  includes_frame   boolean NOT NULL DEFAULT false,
  deposit_percent  integer NOT NULL DEFAULT 40,
  portfolio_refs   text[] NOT NULL DEFAULT '{}',
  status           text NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','accepted','declined','withdrawn')),
  created_at       timestamptz NOT NULL DEFAULT now(),
  responded_at     timestamptz
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_offers" ON offers;
CREATE POLICY "select_offers" ON offers FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM commissions c
      WHERE c.id = offers.commission_id
      AND c.client_id = auth.uid()
    )
    OR auth.uid() = artist_id
  );

DROP POLICY IF EXISTS "insert_offers" ON offers;
CREATE POLICY "insert_offers" ON offers FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = artist_id);

DROP POLICY IF EXISTS "update_offers" ON offers;
CREATE POLICY "update_offers" ON offers FOR UPDATE
  TO authenticated USING (
    auth.uid() = artist_id
    OR EXISTS (
      SELECT 1 FROM commissions c
      WHERE c.id = offers.commission_id
      AND c.client_id = auth.uid()
    )
  ) WITH CHECK (
    auth.uid() = artist_id
    OR EXISTS (
      SELECT 1 FROM commissions c
      WHERE c.id = offers.commission_id
      AND c.client_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_offers_commission_id ON offers(commission_id);
CREATE INDEX IF NOT EXISTS idx_offers_artist_id ON offers(artist_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
