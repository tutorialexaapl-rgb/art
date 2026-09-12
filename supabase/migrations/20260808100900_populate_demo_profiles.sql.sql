/*
# Fully populate demo login accounts with complete profiles

## Purpose
The two demo login accounts (demo.klient1, demo.art1) were re-created via
Supabase signup, which created empty profiles with onboarding_completed=false.
This migration:
1. Fixes profiles (correct role, display_name, avatar, onboarding_completed=true)
2. Creates artist_profiles row for the artist demo (Lena Wojcik)
3. Creates client_profiles row for the client demo (Julia Wisniewska)

Demo accounts should skip onboarding and land directly in the dashboard
with a fully filled-out profile.
*/

-- Artist demo: fix profiles row
UPDATE profiles
SET role = 'artist',
    display_name = 'Lena Wojcik',
    avatar_url = '/avatar-lena-wojcik.webp',
    onboarding_completed = true,
    onboarding_completed_at = now(),
    updated_at = now()
WHERE email = 'demo.art1@atelier-demo.pl';

-- Client demo: fix profiles row
UPDATE profiles
SET role = 'client',
    display_name = 'Julia Wiśniewska',
    onboarding_completed = true,
    onboarding_completed_at = now(),
    updated_at = now()
WHERE email = 'demo.klient1@atelier-demo.pl';

-- Artist demo: create artist_profiles row
INSERT INTO artist_profiles (
  user_id, slug, artist_name, avatar_url, cover_url, bio, location,
  styles, techniques, specializations,
  price_range_min, price_range_max, average_delivery_days,
  approval_status, is_verified, years_experience, website, instagram,
  completed_projects, average_rating, review_count
) VALUES (
  'f2c00248-62db-415c-8730-79db07211a72',
  'lena-wojcik',
  'Lena Wojcik',
  '/avatar-lena-wojcik.webp',
  'https://images.pexels.com/photos/1000366/pexels-photo-1000366.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'Tworzę abstrakcje strukturalne premium dla wnętrz salonów, apartamentów i pracowni architektonicznych. Pracuję z akrylem, szpachlą, pastą strukturalną i złoceniami.',
  'Warszawa',
  ARRAY['Abstrakcja strukturalna', 'Wnętrza premium', 'Złocenia']::text[],
  ARRAY['Akryl', 'Szpachla', 'Pasta strukturalna', 'Złocenia']::text[],
  ARRAY['Abstrakcja strukturalna', 'Złocenia', 'Wnętrza premium']::text[],
  5000.00, 20000.00, 45,
  'approved', true, 11, 'lenawojcik.studio', 'lenawojcik.art',
  42, 4.90, 31
) ON CONFLICT (user_id) DO UPDATE SET
  slug = EXCLUDED.slug,
  artist_name = EXCLUDED.artist_name,
  avatar_url = EXCLUDED.avatar_url,
  cover_url = EXCLUDED.cover_url,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  styles = EXCLUDED.styles,
  techniques = EXCLUDED.techniques,
  specializations = EXCLUDED.specializations,
  price_range_min = EXCLUDED.price_range_min,
  price_range_max = EXCLUDED.price_range_max,
  average_delivery_days = EXCLUDED.average_delivery_days,
  approval_status = EXCLUDED.approval_status,
  is_verified = EXCLUDED.is_verified,
  years_experience = EXCLUDED.years_experience,
  website = EXCLUDED.website,
  instagram = EXCLUDED.instagram,
  completed_projects = EXCLUDED.completed_projects,
  average_rating = EXCLUDED.average_rating,
  review_count = EXCLUDED.review_count,
  updated_at = now();

-- Client demo: create client_profiles row
INSERT INTO client_profiles (
  user_id, display_name, avatar_url, bio, location, phone,
  client_type, company, nip, preferred_styles
) VALUES (
  '1bd44a8d-8f5b-46a8-a9fb-ad440603a12e',
  'Julia Wiśniewska',
  null,
  'Urzędzam nowy apartament - szukam obrazów do salonu i sypialni.',
  'Warszawa',
  null,
  'individual',
  null,
  null,
  ARRAY['Abstrakcja strukturalna', 'Minimalizm']::text[]
) ON CONFLICT (user_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  client_type = EXCLUDED.client_type,
  preferred_styles = EXCLUDED.preferred_styles,
  updated_at = now();
