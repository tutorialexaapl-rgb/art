import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getPostLoginRedirect } from '@/lib/authRedirect';
import type { UserRole } from '@/types';

/** Requires authentication. Redirects to /login if not logged in. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-graphite-300">Ładowanie...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.status === 'suspended') {
    return <Navigate to="/suspended" replace />;
  }

  return <>{children}</>;
}

/** Redirects to dashboard if already logged in. Used on auth pages.
 *  If a ?redirect= query param is present, that takes priority (after onboarding if needed). */
export function RoleRedirect({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-graphite-300">Ładowanie...</p>
      </div>
    );
  }

  if (user) {
    if (user.status === 'suspended') return <Navigate to="/suspended" replace />;
    if (redirect && redirect.startsWith('/')) {
      if (!user.onboardingCompleted) {
        return <Navigate to={getPostLoginRedirect(user)} replace state={{ from: redirect }} />;
      }
      return <Navigate to={redirect} replace />;
    }
    return <Navigate to={getPostLoginRedirect(user)} replace />;
  }

  return <>{children}</>;
}

/** Requires specific role(s). Use inside ProtectedRoute. */
export function RequireRole({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    const redirectRole = user?.role ?? 'guest';
    const fallback = redirectRole === 'guest' ? '/login' : getPostLoginRedirect(user!);
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}

/** Requires that the logged-in user does NOT already have a different role
 *  AND has not yet completed onboarding.
 *  Prevents cross-role onboarding (e.g. a client visiting /onboarding/artist)
 *  and prevents already-onboarded users from re-entering the onboarding flow. */
export function RequireOnboardingRole({ expectedRole, children }: { expectedRole: UserRole; children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-graphite-300">Ładowanie...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.onboardingCompleted) {
    return <Navigate to={getPostLoginRedirect(user)} replace />;
  }

  if (user.role !== expectedRole) {
    return <Navigate to={getPostLoginRedirect(user)} replace />;
  }

  return <>{children}</>;
}
