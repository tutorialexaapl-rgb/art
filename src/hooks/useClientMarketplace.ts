import { useCallback, useEffect, useState } from 'react';
import { commissionsService } from '@/services/commissionsService';
import { useAuth } from '@/context/AuthContext';
import type { CommissionRequest } from '@/types';

interface UseClientMarketplaceState {
  commissions: CommissionRequest[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useClientMarketplace(): UseClientMarketplaceState {
  const [commissions, setCommissions] = useState<CommissionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchFlag, setRefetchFlag] = useState(0);

  const refetch = useCallback(() => setRefetchFlag((f) => f + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    commissionsService
      .getClientMarketplaceCommissions()
      .then((data) => { if (!cancelled) { setCommissions(data); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Wystąpił błąd'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refetchFlag]);

  return { commissions, loading, error, refetch };
}

interface UseClientMarketplaceDetailState {
  commission: CommissionRequest | null;
  fullCommission: CommissionRequest | null;
  isOwner: boolean;
  similar: CommissionRequest[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useClientMarketplaceDetail(slug: string | undefined): UseClientMarketplaceDetailState {
  const { user } = useAuth();
  const [commission, setCommission] = useState<CommissionRequest | null>(null);
  const [fullCommission, setFullCommission] = useState<CommissionRequest | null>(null);
  const [similar, setSimilar] = useState<CommissionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchFlag, setRefetchFlag] = useState(0);

  const refetch = useCallback(() => setRefetchFlag((f) => f + 1), []);

  useEffect(() => {
    if (!slug) {
      setCommission(null);
      setFullCommission(null);
      setSimilar([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    commissionsService
      .getClientMarketplaceCommissionBySlug(slug)
      .then(async (data) => {
        if (cancelled) return;
        setCommission(data);
        setError(null);

        if (data) {
          // Fetch full commission to determine ownership and show full view for owner
          try {
            const full = await commissionsService.getBySlug(slug);
            if (cancelled) return;
            setFullCommission(full);
          } catch { /* non-critical */ }

          try {
            const sim = await commissionsService.getSimilarCommissions(data.id, 3);
            if (!cancelled) setSimilar(sim);
          } catch { /* non-critical */ }
        }
      })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Wystąpił błąd'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug, refetchFlag]);

  const isOwner = Boolean(user && fullCommission && fullCommission.clientId === user.id);

  // When the viewer is the owner, use the full commission (with private description,
  // interior images, clientId, etc.) instead of the stripped marketplace version.
  const effectiveCommission = isOwner && fullCommission ? fullCommission : commission;

  return {
    commission: effectiveCommission,
    fullCommission,
    isOwner,
    similar,
    loading,
    error,
    refetch,
  };
}
