import { useCallback, useEffect, useState } from 'react';
import { artistsService } from '@/services/artistsService';
import { mockArtistProfiles } from '@/lib/mockData';
import type { ArtistProfile } from '@/types';

interface UseArtistState {
  artist: ArtistProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useArtist(slug: string | undefined): UseArtistState {
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchFlag, setRefetchFlag] = useState(0);

  const refetch = useCallback(() => setRefetchFlag((f) => f + 1), []);

  useEffect(() => {
    if (!slug) {
      setArtist(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    artistsService
      .getBySlug(slug)
      .then(async (data) => {
        if (cancelled) return;
        if (data) {
          setArtist(data);
          setError(null);
        } else {
          const fallback = await artistsService.getBySlugAnyStatus(slug);
          if (!cancelled) { setArtist(fallback); setError(null); }
        }
      })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Wystąpił błąd'); })
      .finally(() => { if (!cancelled) {
        setArtist((prev) => prev ?? mockArtistProfiles.find((a) => a.slug === slug) ?? null);
        setLoading(false);
      } });
    return () => { cancelled = true; };
  }, [slug, refetchFlag]);

  return { artist, loading, error, refetch };
}
