import type { UserRole, UserStatus } from '@/types';

export interface RedirectUser {
  role: UserRole;
  status: UserStatus;
  onboardingCompleted?: boolean;
}

export function getPostLoginRedirect(user: RedirectUser): string {
  if (user.status === 'suspended') return '/suspended';

  if (!user.onboardingCompleted) {
    return user.role === 'artist' ? '/onboarding/artist' : '/onboarding/client';
  }

  if (user.role === 'artist') return '/dashboard/artist';
  if (user.role === 'client') return '/dashboard/client';
  if (user.role === 'admin') return '/admin';

  return '/';
}
