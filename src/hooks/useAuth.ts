import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

export function useCurrentUser() {
  const { user } = useAuth();
  return user;
}

export function useRole(): UserRole {
  const { user } = useAuth();
  return user?.role ?? 'guest';
}

export function useIsApprovedArtist(): boolean {
  const { user } = useAuth();
  return user?.role === 'artist' && user?.status === 'approved';
}

export function useIsPendingArtist(): boolean {
  const { user } = useAuth();
  return user?.role === 'artist' && user?.status === 'pending';
}

export function useCanCreateCommission(): boolean {
  const { user } = useAuth();
  return (user?.role === 'client' || user?.role === 'admin') && user?.status !== 'suspended';
}

export function useCanMakeOffer(): boolean {
  const { user } = useAuth();
  return user?.role === 'artist' && user?.status === 'approved';
}

export function useCanComment(): boolean {
  const { user } = useAuth();
  if (!user) return false;
  if (user.status === 'suspended') return false;
  if (user.role === 'artist') return user.status === 'approved';
  return true;
}

export function useIsSuspended(): boolean {
  const { user } = useAuth();
  return user?.status === 'suspended';
}
