import { useCallback, useEffect, useState } from 'react';
import { commissionsService } from '@/services/commissionsService';
import { commentsService } from '@/services/commentsService';
import { offersService } from '@/services/offersService';
import type { CommissionRequest, CommissionComment, CommissionOffer } from '@/types';

interface UseCommissionDetailsState {
  commission: CommissionRequest | null;
  comments: CommissionComment[];
  offers: CommissionOffer[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCommissionDetails(slugOrId: string): UseCommissionDetailsState {
  const [commission, setCommission] = useState<CommissionRequest | null>(null);
  const [comments, setComments] = useState<CommissionComment[]>([]);
  const [offers, setOffers] = useState<CommissionOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchFlag, setRefetchFlag] = useState(0);

  const refetch = useCallback(() => setRefetchFlag((f) => f + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const isUuid = slugOrId.length === 36 && slugOrId.includes('-');
        const c = isUuid
          ? await commissionsService.getById(slugOrId)
          : await commissionsService.getBySlug(slugOrId);
        if (cancelled) return;
        if (!c) { setError('Zlecenie nie zostało znalezione.'); return; }
        setCommission(c);
        setError(null);

        const cmts = await commentsService.getCommissionComments(c.id);
        if (cancelled) return;
        setComments(cmts);

        try {
          const ofrs = await offersService.getByCommission(c.id);
          if (!cancelled) setOffers(ofrs);
        } catch {
          if (!cancelled) setOffers([]);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Wystąpił błąd');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [slugOrId, refetchFlag]);

  return { commission, comments, offers, loading, error, refetch };
}
