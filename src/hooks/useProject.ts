import { useCallback, useEffect, useState } from 'react';
import { projectsService } from '@/services/projectsService';
import type { CommissionProject } from '@/types';

interface UseProjectState {
  project: CommissionProject | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProject(projectId: string): UseProjectState {
  const [project, setProject] = useState<CommissionProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchFlag, setRefetchFlag] = useState(0);

  const refetch = useCallback(() => setRefetchFlag((f) => f + 1), []);

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    projectsService
      .getById(projectId)
      .then((data) => { if (!cancelled) { setProject(data); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Wystąpił błąd'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [projectId, refetchFlag]);

  return { project, loading, error, refetch };
}
