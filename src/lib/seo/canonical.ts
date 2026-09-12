import { SEO_CONFIG, STRIPPED_PARAMS } from './seo-config';

/** Build an absolute URL from a path, ensuring a leading slash. */
export function absoluteUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONFIG.siteUrl}${clean}`;
}

/**
 * Normalize a canonical path: strip trailing slash (except root),
 * remove query parameters and hash fragments, remove tracking params.
 */
export function normalizePath(path: string): string {
  // Remove hash
  const withoutHash = path.split('#')[0];
  // Split path and query
  const [rawPath, query] = withoutHash.split('?');

  // Normalize trailing slash (root stays root)
  let normalized = rawPath;
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.replace(/\/+$/, '');
  }
  // Collapse duplicate slashes
  normalized = normalized.replace(/\/{2,}/g, '/');

  // Rebuild query without tracking params
  if (query) {
    const params = new URLSearchParams(query);
    for (const key of STRIPPED_PARAMS) {
      params.delete(key);
    }
    const qs = params.toString();
    if (qs) {
      normalized += `?${qs}`;
    }
  }

  return normalized;
}

/** Build a canonical absolute URL from a path, with normalization applied. */
export function canonicalUrl(path: string): string {
  return absoluteUrl(normalizePath(path));
}

/**
 * Get a self-referential canonical for the current browser location,
 * with query params and hash stripped. Used by noindex pages.
 */
export function selfCanonical(): string {
  if (typeof window === 'undefined') return SEO_CONFIG.siteUrl;
  return canonicalUrl(window.location.pathname);
}
