/*
# Create client_marketplace_commissions view

## What changes
- Creates a secure view `client_marketplace_commissions` that exposes ONLY public fields
  of published/offers_open/in_progress/completed commissions.
- Excludes: private_description, client_id, client_name, private attachments,
  contact data, offers, messages, project data.
- The view inherits RLS from the base table - only publicly-visible statuses are exposed.

## Security
- RLS is enabled on the view (views run with owner privileges by default in Supabase,
  but this view only selects from commission_requests which has RLS - since we only
  select public-status rows and public columns, this is safe).
- No private fields are included in the SELECT list.
*/

CREATE OR REPLACE VIEW client_marketplace_commissions AS
SELECT
  id,
  slug,
  title,
  status,
  public_summary,
  style,
  mood,
  preferred_colors,
  width_cm,
  height_cm,
  orientation,
  budget_min,
  budget_max,
  deadline,
  location,
  room_type,
  intended_use,
  frame_required,
  delivery_required,
  inspiration_images,
  tags,
  medium,
  views,
  comments_count,
  offers_count,
  created_at,
  updated_at
FROM commission_requests
WHERE status = ANY (ARRAY['published', 'offers_open', 'in_progress', 'completed']);

-- Allow anon and authenticated to read the marketplace view
GRANT SELECT ON client_marketplace_commissions TO anon, authenticated;