import { useCallback, useEffect, useState } from 'react';
import { profilesService } from '@/services/profilesService';
import { artistsService } from '@/services/artistsService';
import { useAuth } from '@/context/AuthContext';
import type { Profile, ClientProfile, ArtistProfile } from '@/types';

interface UseCurrentProfileState {
  profile: Profile | null;
  clientProfile: ClientProfile | null;
  artistProfile: ArtistProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCurrentProfile(): UseCurrentProfileState {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchFlag, setRefetchFlag] = useState(0);

  const refetch = useCallback(() => setRefetchFlag((f) => f + 1), []);

  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      setClientProfile(null);
      setArtistProfile(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const p = await profilesService.getCurrentProfile(user.id);
        if (cancelled) return;
        setProfile(p);
        setError(null);

        if (p?.role === 'client') {
          const cp = await profilesService.getClientProfile(user.id);
          if (!cancelled) setClientProfile(cp);
        }
        if (p?.role === 'artist') {
          const ap = await artistsService.getByUserId(user.id);
          if (!cancelled) setArtistProfile(ap);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Wystąpił błąd');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user?.id, refetchFlag]);

  return { profile, clientProfile, artistProfile, loading, error, refetch };
}
