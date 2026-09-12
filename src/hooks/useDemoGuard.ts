import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

/** Returns a guard function that blocks mutations when the logged-in user
 *  is on a demo account. The guard shows a toast and returns true (blocked)
 *  if the user is a demo user, false otherwise. */
export function useDemoGuard() {
  const { user } = useAuth();
  const { notify } = useToast();

  const check = useCallback((): boolean => {
    if (user?.isDemo) {
      notify('error', 'To konto demo jest tylko do oglądania. Zarejestruj się, aby wprowadzać zmiany.');
      return true;
    }
    return false;
  }, [user, notify]);

  return check;
}
