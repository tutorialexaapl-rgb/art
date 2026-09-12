import { useCallback, useEffect, useState } from 'react';
import { commissionsService } from '@/services/commissionsService';
import type { CommissionRequest } from '@/types';

interface UseCommissionsState {
  commissions: CommissionRequest[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCommissions(): UseCommissionsState {
  const [commissions, setCommissions] = useState<CommissionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchFlag, setRefetchFlag] = useState(0);

  const refetch = useCallback(() => setRefetchFlag((f) => f + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    commissionsService
      .getPublicCommissions()
      .then((data) => { if (!cancelled) { setCommissions(data); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Wystąpił błąd'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refetchFlag]);

  return { commissions, loading, error, refetch };
}
