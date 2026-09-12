import { useCallback, useEffect, useState } from 'react';
import { artistsService } from '@/services/artistsService';
import type { ArtistProfile } from '@/types';

interface UseArtistsState {
  artists: ArtistProfile[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useArtists(): UseArtistsState {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchFlag, setRefetchFlag] = useState(0);

  const refetch = useCallback(() => setRefetchFlag((f) => f + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    artistsService
      .getAll()
      .then((data) => { if (!cancelled) { setArtists(data); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Wystąpił błąd'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refetchFlag]);

  return { artists, loading, error, refetch };
}
