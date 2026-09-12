/*
# Create user profiles and artist portfolio tables

## Overview
This migration creates the foundational user-related tables for the Atelier platform:
a marketplace connecting clients who commission paintings with artists who paint them.

## New Tables

### 1. profiles
- Extension of auth.users with app-specific data (role, status, display info).
- `id` references auth.users(id) ON DELETE CASCADE.
- `role` - guest | client | artist | admin
- `status` - pending | approved | suspended
- Includes display_name, avatar_url, bio, location, website, instagram.

### 2. client_profiles
- Extended profile for clients (individuals, architects, developers, companies).
- `user_id` references profiles(id).
- Includes client_type, company, nip (VAT number), preferred_styles array.

### 3. artist_profiles
- Extended profile for artists seeking commissions.
- `user_id` references profiles(id).
- `slug` - unique URL slug for public artist pages.
- Includes artist_name, bio, location, styles/techniques/specializations arrays,
  price_range_min/max, average_delivery_days, approval_status, is_verified,
  years_experience, website, instagram.
- Stats columns: completed_projects, average_rating, review_count (denormalized).

### 4. portfolio_items
- Individual artworks in an artist's portfolio.
- `artist_id` references artist_profiles(id) ON DELETE CASCADE.
- Includes title, image_url, technique, year, dimensions, is_public, is_for_sale, price.

## Security (RLS)
- profiles: owner-scoped SELECT/INSERT/UPDATE.
- client_profiles: owner-scoped CRUD.
- artist_profiles: public SELECT (artists are visible to all); owner-scoped INSERT/UPDATE/DELETE.
- portfolio_items: public SELECT for is_public=true OR owner; owner-scoped INSERT/UPDATE/DELETE.

## Indexes
- profiles: email (lookup)
- client_profiles: user_id
- artist_profiles: slug (unique), user_id, approval_status
- portfolio_items: artist_id, is_public
*/

-- ────────────────────────────── profiles ──────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
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

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ─────────────────────────── client_profiles ───────────────────────────

CREATE TABLE IF NOT EXISTS client_profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_url  text,
  bio         text,
  location    text,
  phone       text,
  client_type text,
  company     text,
  nip         text,
  preferred_styles text[] NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_client_profile" ON client_profiles;
CREATE POLICY "select_own_client_profile" ON client_profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_client_profile" ON client_profiles;
CREATE POLICY "insert_own_client_profile" ON client_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_client_profile" ON client_profiles;
CREATE POLICY "update_own_client_profile" ON client_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_client_profile" ON client_profiles;
CREATE POLICY "delete_own_client_profile" ON client_profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_client_profiles_user_id ON client_profiles(user_id);

-- ─────────────────────────── artist_profiles ───────────────────────────

CREATE TABLE IF NOT EXISTS artist_profiles (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug           text NOT NULL,
  artist_name    text NOT NULL DEFAULT '',
  avatar_url     text,
  cover_url      text,
  bio            text NOT NULL DEFAULT '',
  location       text NOT NULL DEFAULT '',
  styles         text[] NOT NULL DEFAULT '{}',
  techniques     text[] NOT NULL DEFAULT '{}',
  specializations text[] NOT NULL DEFAULT '{}',
  price_range_min integer NOT NULL DEFAULT 0,
  price_range_max integer NOT NULL DEFAULT 0,
  average_delivery_days integer NOT NULL DEFAULT 0,
  approval_status text NOT NULL DEFAULT 'pending'
                  CHECK (approval_status IN ('pending','approved','suspended','rejected')),
  is_verified    boolean NOT NULL DEFAULT false,
  years_experience integer NOT NULL DEFAULT 0,
  website        text,
  instagram      text,
  completed_projects integer NOT NULL DEFAULT 0,
  average_rating numeric(3,1) NOT NULL DEFAULT 0.0,
  review_count   integer NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;

-- Public read: artist profiles are visible to all authenticated users (marketplace)
DROP POLICY IF EXISTS "select_artist_profiles" ON artist_profiles;
CREATE POLICY "select_artist_profiles" ON artist_profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_artist_profile" ON artist_profiles;
CREATE POLICY "insert_own_artist_profile" ON artist_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_artist_profile" ON artist_profiles;
CREATE POLICY "update_own_artist_profile" ON artist_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_artist_profile" ON artist_profiles;
CREATE POLICY "delete_own_artist_profile" ON artist_profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_artist_profiles_slug ON artist_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_user_id ON artist_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_approval_status ON artist_profiles(approval_status);

-- ─────────────────────────── portfolio_items ───────────────────────────

CREATE TABLE IF NOT EXISTS portfolio_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id   uuid NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
  title       text NOT NULL DEFAULT '',
  image_url   text NOT NULL,
  technique   text NOT NULL DEFAULT '',
  year        text NOT NULL DEFAULT '',
  width_cm    integer NOT NULL DEFAULT 0,
  height_cm   integer NOT NULL DEFAULT 0,
  is_public   boolean NOT NULL DEFAULT true,
  is_for_sale boolean NOT NULL DEFAULT false,
  price       integer,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public can see public portfolio items; owner can see all their items
DROP POLICY IF EXISTS "select_portfolio_items" ON portfolio_items;
CREATE POLICY "select_portfolio_items" ON portfolio_items FOR SELECT
  TO authenticated USING (
    is_public = true
    OR EXISTS (
      SELECT 1 FROM artist_profiles ap
      WHERE ap.id = portfolio_items.artist_id
      AND ap.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_own_portfolio_items" ON portfolio_items;
CREATE POLICY "insert_own_portfolio_items" ON portfolio_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM artist_profiles ap
      WHERE ap.id = portfolio_items.artist_id
      AND ap.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "update_own_portfolio_items" ON portfolio_items;
CREATE POLICY "update_own_portfolio_items" ON portfolio_items FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM artist_profiles ap
      WHERE ap.id = portfolio_items.artist_id
      AND ap.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM artist_profiles ap
      WHERE ap.id = portfolio_items.artist_id
      AND ap.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_own_portfolio_items" ON portfolio_items;
CREATE POLICY "delete_own_portfolio_items" ON portfolio_items FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM artist_profiles ap
      WHERE ap.id = portfolio_items.artist_id
      AND ap.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_portfolio_items_artist_id ON portfolio_items(artist_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_public ON portfolio_items(is_public);
