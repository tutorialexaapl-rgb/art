import { useState } from 'react';
import { cn } from '@/lib/utils';

type LoadingPriority = 'high' | 'low' | 'auto';
type FetchPriority = 'high' | 'low' | 'auto';

const DEFAULT_FALLBACK = '/abstract-painting-inspiration.webp';

interface SeoImageProps {
  src: string;
  alt: string;
  /** Tailwind classes for sizing/layout (e.g. 'h-full w-full object-cover'). */
  className?: string;
  /** Intrinsic pixel dimensions - prevents CLS by reserving space. */
  width?: number;
  height?: number;
  /** loading attribute. Hero images should use 'eager'. Default: 'lazy'. */
  loading?: 'lazy' | 'eager';
  /** fetchpriority attribute. Hero images should use 'high'. Default: 'auto'. */
  fetchPriority?: FetchPriority;
  /** decoding hint. Default: 'async'. */
  decoding?: 'async' | 'sync' | 'auto';
  /** Optional srcset for responsive images. */
  srcSet?: string;
  /** Optional sizes attribute to pair with srcSet. */
  sizes?: string;
  /** Fallback image URL when the primary src fails to load. */
  fallbackSrc?: string;
}

/**
 * SEO-optimized image component.
 *
 * - Always requires a descriptive alt (never empty for content images).
 * - Defaults to lazy loading + async decoding (non-hero images).
 * - Renders width/height attributes to prevent CLS.
 * - Auto-generates responsive srcset for Pexels images.
 * - Pass fetchPriority="high" + loading="eager" for above-the-fold hero images.
 */
export function SeoImage({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  srcSet,
  sizes,
  fallbackSrc = DEFAULT_FALLBACK,
}: SeoImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [errored, setErrored] = useState(false);

  // Auto-generate responsive srcset for Pexels images if not explicitly provided
  const autoSrcSet = srcSet ?? pexelsSrcSet(imgSrc);
  const autoSizes = sizes ?? autoSrcSet ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : undefined;

  const handleError = () => {
    if (!errored && imgSrc !== fallbackSrc) {
      setErrored(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn('bg-graphite-400/10', className)}
      loading={loading}
      decoding={decoding}
      {...(width !== undefined ? { width } : {})}
      {...(height !== undefined ? { height } : {})}
      {...(autoSrcSet ? { srcSet: autoSrcSet } : {})}
      {...(autoSizes ? { sizes: autoSizes } : {})}
      {...(fetchPriority !== 'auto' ? { fetchpriority: fetchPriority } : {})}
      onError={handleError}
    />
  );
}

/**
 * Generate responsive srcset for Pexels CDN images.
 * Pexels supports dynamic width via the `w` query parameter.
 * Returns undefined for non-Pexels URLs.
 */
function pexelsSrcSet(src: string): string | undefined {
  if (!src || !src.includes('images.pexels.com')) return undefined;
  const widths = [400, 600, 800, 1200];
  const url = new URL(src);
  const hasAuto = url.searchParams.has('auto');
  const hasCs = url.searchParams.has('cs');
  return widths
    .map((w) => {
      const u = new URL(src);
      u.searchParams.set('w', String(w));
      if (!hasAuto) u.searchParams.set('auto', 'compress');
      if (!hasCs) u.searchParams.set('cs', 'tinysrgb');
      return `${u.toString()} ${w}w`;
    })
    .join(', ');
}

/**
 * Hero image variant - eager loading + high fetch priority for fast LCP.
 * Use only for the single most prominent above-the-fold image on a page.
 */
export function HeroImage(props: Omit<SeoImageProps, 'loading' | 'fetchPriority' | 'decoding'>) {
  return (
    <SeoImage
      {...props}
      loading="eager"
      fetchPriority="high"
      decoding="sync"
    />
  );
}
