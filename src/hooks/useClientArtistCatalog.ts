import { useCallback, useEffect, useState } from 'react';
import { artistsService } from '@/services/artistsService';
import type { ArtistProfile } from '@/types';

interface UseClientArtistCatalogState {
  artists: ArtistProfile[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useClientArtistCatalog(): UseClientArtistCatalogState {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchFlag, setRefetchFlag] = useState(0);

  const refetch = useCallback(() => setRefetchFlag((f) => f + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    artistsService
      .getApprovedArtists()
      .then((data) => { if (!cancelled) { setArtists(data); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Wystąpił błąd'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refetchFlag]);

  return { artists, loading, error, refetch };
}

interface UseClientArtistDetailState {
  artist: ArtistProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useClientArtistDetail(slug: string | undefined): UseClientArtistDetailState {
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
      .getApprovedArtistBySlug(slug)
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
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug, refetchFlag]);

  return { artist, loading, error, refetch };
}
