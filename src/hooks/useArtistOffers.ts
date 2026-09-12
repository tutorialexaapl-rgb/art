import { useCallback, useEffect, useState } from 'react';
import { offersService } from '@/services/offersService';
import { mockOffers } from '@/lib/mockData';
import type { CommissionOffer } from '@/types';

interface UseArtistOffersState {
  offers: CommissionOffer[];
  loading: boolean;
  error: string | null;
}

export function useArtistOffers(artistId: string | undefined, limit?: number): UseArtistOffersState {
  const [offers, setOffers] = useState<CommissionOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artistId) {
      setOffers([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    offersService
      .getByArtist(artistId)
      .then((data) => {
        if (cancelled) return;
        const visible = data.filter(
          (o) => o.status === 'pending' || o.status === 'accepted' || o.status === 'submitted' || o.status === 'viewed' || o.status === 'shortlisted'
        );
        const examples = mockOffers.filter(
          (o) => o.artistId === artistId && (o.status === 'pending' || o.status === 'accepted' || o.status === 'submitted' || o.status === 'viewed' || o.status === 'shortlisted')
        );
        const combined = visible.length > 0 ? visible : examples;
        setOffers(limit ? combined.slice(0, limit) : combined);
        setError(null);
      })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Wystąpił błąd'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [artistId, limit]);

  return { offers, loading, error };
}
