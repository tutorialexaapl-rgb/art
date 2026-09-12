/**
 * Descriptive alt-text generation for images.
 *
 * Rules:
 * - Never use generic text (image1.jpg, photo, IMG_1234, "image").
 * - Describe what the image actually shows, in natural Polish.
 * - Don't stuff keywords - alt text is for accessibility first, SEO second.
 * - Keep under ~125 characters when possible.
 * - For decorative images in a lightbox, use a contextual description, not "".
 */

import type { ArtistProfile, ArtistPortfolioItem, CommissionRequest } from '@/types';

/** Truncate to a max length, cutting at the last word boundary. */
function clamp(text: string, max = 125): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd() + '…';
}

/** Build a readable dimensions string like "120×80 cm". */
function dimensions(w?: number, h?: number): string | null {
  if (!w || !h) return null;
  return `${w}×${h} cm`;
}

// ─── Portfolio / artwork images ─────────────────────────────────────────────

/**
 * Alt for a portfolio artwork image.
 * Example: "Abstrakcyjny obraz na zamówienie autorstwa Leny Wojcik - akryl na płótnie, 120×80 cm"
 */
export function portfolioAlt(
  artist: Pick<ArtistProfile, 'artistName' | 'styles'>,
  item: Pick<ArtistPortfolioItem, 'title' | 'technique' | 'widthCm' | 'heightCm' | 'style'>,
): string {
  const parts: string[] = [];

  const title = item.title?.trim();
  if (title && !isGeneric(title)) {
    parts.push(title);
  } else {
    const style = item.style?.trim();
    parts.push(style ? `${style} obraz` : 'Obraz');
  }

  parts.push(`autorstwa ${artist.artistName}`);

  const technique = item.technique?.trim();
  if (technique) parts.push(technique);

  const dims = dimensions(item.widthCm, item.heightCm);
  if (dims) parts.push(dims);

  // Include up to 2 styles for context if the title wasn't a style itself
  if (artist.styles.length > 0 && !parts[0].toLowerCase().includes(artist.styles[0].toLowerCase())) {
    parts.push(`(${artist.styles.slice(0, 2).join(', ')})`);
  }

  return clamp(parts.join(' - '));
}

// ─── Commission inspiration images ──────────────────────────────────────────

/**
 * Alt for a commission's inspiration image.
 * Example: "Inspiracja dla zlecenia obrazu do nowoczesnego salonu - styl abstrakcyjny, 120×80 cm"
 */
export function commissionInspirationAlt(
  commission: Pick<CommissionRequest, 'title' | 'style' | 'roomType' | 'widthCm' | 'heightCm'>,
  index: number,
): string {
  const roomPart = commission.roomType ? ` do ${commission.roomType.toLowerCase()}` : '';
  const stylePart = commission.style ? `, styl ${commission.style.toLowerCase()}` : '';
  const dims = dimensions(commission.widthCm, commission.heightCm);
  const dimsPart = dims ? `, ${dims}` : '';
  const indexPart = index > 0 ? ` (${index + 1})` : '';

  return clamp(`Inspiracja dla zlecenia obrazu${roomPart}${stylePart}${dimsPart}${indexPart}`);
}

// ─── Commission interior images ─────────────────────────────────────────────

/**
 * Alt for a commission's interior/reference room image.
 * Example: "Wnętrze pokoju salonu jako referencja dla zlecenia obrazu"
 */
export function commissionInteriorAlt(
  commission: Pick<CommissionRequest, 'roomType'>,
  index: number,
): string {
  const roomPart = commission.roomType ? ` ${commission.roomType.toLowerCase()}` : '';
  const indexPart = index > 0 ? ` (${index + 1})` : '';
  return clamp(`Wnętrze${roomPart} jako referencja dla zlecenia obrazu${indexPart}`);
}

// ─── Artist avatar ──────────────────────────────────────────────────────────

/**
 * Alt for an artist's avatar/profile photo.
 * Example: "Avatar artysty Lena Wojcik"
 */
export function artistAvatarAlt(artistName: string): string {
  return `Avatar artysty ${artistName}`;
}

// ─── Artist cover image ─────────────────────────────────────────────────────

/**
 * Alt for an artist's cover/hero banner image.
 * Example: "Okładka profilu artysty Leny Wojcik - malarstwo abstrakcyjne"
 */
export function artistCoverAlt(
  artist: Pick<ArtistProfile, 'artistName' | 'styles'>,
): string {
  const stylePart = artist.styles.length > 0
    ? ` - ${artist.styles.slice(0, 2).join(', ')}`
    : '';
  return clamp(`Okładka profilu artysty ${artist.artistName}${stylePart}`);
}

// ─── Blog post featured image ───────────────────────────────────────────────

/**
 * Alt for a blog post's featured image.
 * Example: "Obraz do nowoczesnego salonu - przewodnik po doborze sztuki do wnętrza"
 */
export function blogFeaturedAlt(title: string, excerpt?: string): string {
  const titlePart = title?.trim();
  if (titlePart && !isGeneric(titlePart)) {
    return clamp(titlePart);
  }
  if (excerpt && !isGeneric(excerpt)) {
    return clamp(excerpt);
  }
  return 'Artykuł o obrazach na zamówienie';
}

// ─── Blog post inline content images ────────────────────────────────────────

/**
 * Alt for an inline image within blog post content.
 * Example: "Przykład obrazu abstrakcyjnego w nowoczesnym wnętrzu - artykuł o doborze sztuki"
 */
export function blogInlineAlt(caption: string, postTitle: string): string {
  const captionPart = caption?.trim();
  if (captionPart && !isGeneric(captionPart)) {
    return clamp(`${captionPart} - ${postTitle}`);
  }
  return clamp(`Ilustracja w artykule: ${postTitle}`);
}

// ─── Static / decorative images ─────────────────────────────────────────────

/**
 * Alt for a static hero or section image on marketing pages.
 * Example: "Obraz ręcznie malowany na zamówienie - praca artysty malarza"
 */
export function sectionImageAlt(description: string): string {
  return clamp(description);
}

// ─── Lightbox images ────────────────────────────────────────────────────────

/**
 * Alt for a lightbox/enlarged image. Use a contextual description, not "".
 * Falls back to the source alt or a contextual description.
 */
export function lightboxAlt(fallbackAlt: string, context: string): string {
  if (fallbackAlt && !isGeneric(fallbackAlt)) return fallbackAlt;
  return clamp(`Powiększone zdjęcie: ${context}`);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Check if a string is a generic / non-descriptive alt.
 * Matches: image, photo, img, file, DSC, IMG_, image1, etc.
 */
export function isGeneric(text: string): boolean {
  const lower = text.toLowerCase().trim();
  if (!lower) return true;
  const generic = [
    'image', 'photo', 'img', 'obraz', 'zdjęcie', 'zdjecie',
    'file', 'plik', 'picture', 'zdjecie', 'untitled',
    'bez tytułu', 'bez tytulu',
  ];
  if (generic.includes(lower)) return true;
  // Check for patterns like IMG_1234, DSC001, image1.jpg, photo.png
  if (/^(img|dsc|image|photo|zdj|plik|file)[\s_-]*\d+/i.test(lower)) return true;
  if (/^(img|dsc|image|photo|zdj|plik|file)\.(jpg|jpeg|png|webp|gif)$/i.test(lower)) return true;
  if (/^\.(jpg|jpeg|png|webp|gif)$/i.test(lower)) return true;
  return false;
}
