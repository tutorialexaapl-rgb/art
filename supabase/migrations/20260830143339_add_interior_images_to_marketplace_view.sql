/*
# Add interior_images to client_marketplace_commissions view

## What changes
- Drops and recreates the `client_marketplace_commissions` view to include
  the `interior_images` column.
- The view previously included `inspiration_images` but was missing `interior_images`.
- No other columns, filters, or logic are changed.

## Security
- The view continues to expose only public fields of published commissions.
- SELECT granted to anon, authenticated (unchanged).
*/

DROP VIEW IF EXISTS client_marketplace_commissions;

CREATE VIEW client_marketplace_commissions AS
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
  interior_images,
  tags,
  medium,
  views,
  comments_count,
  offers_count,
  created_at,
  updated_at
FROM commission_requests
WHERE status = ANY (ARRAY['published', 'offers_open', 'in_progress', 'completed']);

GRANT SELECT ON client_marketplace_commissions TO anon, authenticated;
