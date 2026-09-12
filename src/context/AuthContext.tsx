import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { UserRole, UserStatus } from '@/types';
import { mockUsers } from '@/lib/mockData';
import { checkAccountAvailability, translateAuthError, getAvailabilityMessage } from '@/lib/accountUtils';
import { getPostLoginRedirect } from '@/lib/authRedirect';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  displayName: string;
  avatarUrl?: string;
  onboardingCompleted?: boolean;
  onboardingCompletedAt?: string;
  isDemo?: boolean;
}

interface OnboardingData {
  displayName?: string;
  location?: string;
  phone?: string;
  bio?: string;
  clientType?: string;
  company?: string;
  nip?: string;
  artistName?: string;
  styles?: string[];
  techniques?: string[];
  yearsExperience?: number;
  priceRangeMin?: number;
  priceRangeMax?: number;
  averageDeliveryDays?: number;
  website?: string;
  instagram?: string;
  avatarUrl?: string;
  artistSlug?: string;
  portfolioItems?: { title: string; imageUrl: string; technique: string; year: string; widthCm: number; heightCm: number }[];
}

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null; user?: AuthUser }>;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  signInAsDemo: (role: UserRole) => Promise<{ success: boolean; error?: string }>;
  completeOnboarding: (data: OnboardingData) => Promise<{ error: string | null }>;
  updateProfile: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const DEMO_STORAGE_KEY = 'artiors-demo-user';

function slugifyFallback(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ż/g, 'z').replace(/ź/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'artist';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored) as AuthUser);
        } catch {
          localStorage.removeItem(DEMO_STORAGE_KEY);
        }
      }
      setLoading(false);
      return;
    }

    // Real Supabase mode: NEVER load demo-user from localStorage.
    // The database is the single source of truth.
    localStorage.removeItem(DEMO_STORAGE_KEY);

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session) {
        const dbUser = await loadUserFromDatabase(data.session);
        if (dbUser) {
          setUser(dbUser);
        } else {
          setAuthError('Nie udało się załadować profilu z bazy danych.');
        }
      }
      setLoading(false);
    }).catch((err) => {
      console.error('[AUTH] getSession failed:', err);
      setAuthError('Nie udało się połączyć z serwerem autoryzacji.');
      setLoading(false);
    });

    let listener: { subscription: { unsubscribe: () => void } } | null = null;
    try {
      const result = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        if (newSession) {
          (async () => {
            setLoading(true);
            const dbUser = await loadUserFromDatabase(newSession);
            if (dbUser) {
              setUser(dbUser);
              setAuthError(null);
            } else {
              setAuthError('Nie udało się załadować profilu z bazy danych.');
            }
            setLoading(false);
          })();
        } else {
          setUser(null);
          setAuthError(null);
        }
      });
      listener = result.data;
    } catch (err) {
      console.error('[AUTH] onAuthStateChange failed:', err);
    }

    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  async function loadUserFromDatabase(s: Session): Promise<AuthUser | null> {
    const userId = s.user.id;
    console.log('[AUTH DEBUG] session user id:', userId);

    // Fetch the profiles row
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role, status, display_name, avatar_url, onboarding_completed, onboarding_completed_at')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('[AUTH DEBUG] profiles query error:', profileError);
      return null;
    }

    console.log('[AUTH DEBUG] profile from DB:', profile);

    // No profile row yet - the user registered but hasn't completed onboarding.
    // Return a minimal user object from auth metadata so they can be redirected
    // to the onboarding page. The profile row is created only in completeOnboarding().
    if (!profile) {
      const meta = s.user.user_metadata as Record<string, unknown>;
      const role = (meta.role as UserRole) ?? 'client';
      const displayName = (meta.displayName as string) ?? s.user.email ?? '';

      return {
        id: userId,
        email: s.user.email ?? '',
        role,
        status: 'approved',
        displayName,
        onboardingCompleted: false,
      };
    }

    // Profile exists - check if a role-specific profile also exists.
    // If it does and onboarding_completed is false, auto-fix the flag.
    let roleProfileExists = false;
    if (profile.role === 'client') {
      const { data: clientProfile } = await supabase
        .from('client_profiles')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();
      console.log('[AUTH DEBUG] client profile exists:', !!clientProfile);
      roleProfileExists = !!clientProfile;
    } else if (profile.role === 'artist') {
      const { data: artistProfile } = await supabase
        .from('artist_profiles')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();
      console.log('[AUTH DEBUG] artist profile exists:', !!artistProfile);
      roleProfileExists = !!artistProfile;
    }

    let onboardingCompleted = profile.onboarding_completed;
    let onboardingCompletedAt = profile.onboarding_completed_at ?? undefined;

    // Auto-repair: role profile exists but flag is false
    if (roleProfileExists && !onboardingCompleted) {
      console.log('[AUTH DEBUG] auto-repairing onboarding_completed flag');
      const { error: repairError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true, onboarding_completed_at: new Date().toISOString() })
        .eq('id', userId);
      if (repairError) {
        console.error('[AUTH DEBUG] auto-repair error:', repairError);
      } else {
        onboardingCompleted = true;
        onboardingCompletedAt = new Date().toISOString();
      }
    }

    const isDemo = Boolean(s.user.user_metadata?.is_demo) || profile.email.endsWith('@atelier-demo.pl');

    const resolvedUser: AuthUser = {
      id: profile.id,
      email: profile.email,
      role: profile.role as UserRole,
      status: profile.status as UserStatus,
      displayName: profile.display_name,
      avatarUrl: profile.avatar_url ?? undefined,
      onboardingCompleted,
      onboardingCompletedAt,
      isDemo,
    };

    console.log('[AUTH DEBUG] redirect target:', getPostLoginRedirect(resolvedUser));
    return resolvedUser;
  }

  async function signIn(email: string, password: string): Promise<{ error: string | null; user?: AuthUser }> {
    if (!isSupabaseConfigured) {
      const mockUser = mockUsers.find((u) => u.email === email);
      if (!mockUser) return { error: 'Nieprawidłowy email lub hasło.' };
      const demoUser: AuthUser = {
        id: mockUser.id, email: mockUser.email, role: mockUser.role,
        status: mockUser.status, displayName: mockUser.displayName,
        avatarUrl: mockUser.avatarUrl,
        onboardingCompleted: true,
      };
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return { error: null, user: demoUser };
    }

    // Clear any stale demo storage before real Supabase login
    localStorage.removeItem(DEMO_STORAGE_KEY);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    // Load the full user from the database immediately
    if (data.session) {
      const dbUser = await loadUserFromDatabase(data.session);
      if (dbUser) {
        setUser(dbUser);
        setAuthError(null);
        return { error: null, user: dbUser };
      }
      setAuthError('Nie udało się załadować profilu z bazy danych po zalogowaniu.');
      return { error: 'Nie udało się załadować profilu z bazy danych.' };
    }

    return { error: 'Logowanie nie powiodło się - brak sesji.' };
  }

  async function signUp(email: string, password: string, displayName: string, role: UserRole) {
    if (!isSupabaseConfigured) {
      const newId = `u-new-${Date.now()}`;
      const newUser: AuthUser = {
        id: newId, email, role,
        status: 'approved',
        displayName,
        onboardingCompleted: false,
      };
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return { error: null };
    }

    const check = await checkAccountAvailability(email, undefined, role);
    if (check.status !== 'available') {
      return { error: getAvailabilityMessage(check.status) };
    }

    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { displayName, role, status: 'approved' } },
    });
    if (error) return { error: translateAuthError(error.message) };

    // Profile row is NOT created here - it is created only when the user
    // completes onboarding via completeOnboarding(). This ensures that
    // abandoning onboarding does not leave a half-created account.

    return { error: null };
  }

  async function completeOnboarding(data: OnboardingData) {
    if (!user) return { error: 'Nie jesteś zalogowany.' };

    if (!isSupabaseConfigured || !session) {
      // Mock mode
      const updatedUser: AuthUser = {
        ...user,
        displayName: data.displayName ?? user.displayName,
        avatarUrl: data.avatarUrl ?? user.avatarUrl,
        onboardingCompleted: true,
      };
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { error: null };
    }

    const nowIso = new Date().toISOString();

    // 1. Upsert profiles with onboarding_completed = true
    const profilePayload = {
      id: user.id,
      email: user.email,
      email_normalized: user.email.toLowerCase().trim(),
      role: user.role,
      status: 'approved',
      display_name: data.displayName ?? user.displayName,
      avatar_url: data.avatarUrl ?? null,
      bio: data.bio ?? null,
      location: data.location ?? null,
      website: data.website ?? null,
      instagram: data.instagram ?? null,
      phone: data.phone ?? null,
      onboarding_completed: true,
      onboarding_completed_at: nowIso,
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' });

    console.log('[ONBOARDING DEBUG] profile update result:', { error: profileError });

    if (profileError) {
      console.error('[ONBOARDING DEBUG] profile upsert failed:', profileError);
      return { error: `Błąd zapisu profilu: ${profileError.message}` };
    }

    // 2. Upsert role-specific profile
    if (user.role === 'client') {
      const { error: clientError } = await supabase.from('client_profiles').upsert({
        user_id: user.id,
        display_name: data.displayName ?? user.displayName,
        avatar_url: data.avatarUrl ?? null,
        bio: data.bio ?? null,
        location: data.location ?? null,
        phone: data.phone ?? null,
        client_type: data.clientType ?? null,
        company: data.company ?? null,
        nip: data.nip ?? null,
      }, { onConflict: 'user_id' });

      console.log('[ONBOARDING DEBUG] client profile upsert result:', { error: clientError });

      if (clientError) {
        console.error('[ONBOARDING DEBUG] client_profiles upsert failed:', clientError);
        return { error: `Błąd zapisu profilu klienta: ${clientError.message}` };
      }
    } else if (user.role === 'artist') {
      const { error: artistError } = await supabase.from('artist_profiles').upsert({
        user_id: user.id,
        slug: data.artistSlug ? `${data.artistSlug}-${user.id.slice(0, 8)}` : slugifyFallback(data.artistName ?? data.displayName ?? user.id),
        artist_name: data.artistName ?? data.displayName ?? user.displayName,
        avatar_url: data.avatarUrl ?? null,
        bio: data.bio ?? null,
        location: data.location ?? null,
        website: data.website ?? null,
        instagram: data.instagram ?? null,
        styles: data.styles ?? [],
        techniques: data.techniques ?? [],
        years_experience: data.yearsExperience ?? 0,
        price_range_min: data.priceRangeMin ?? 0,
        price_range_max: data.priceRangeMax ?? 0,
        average_delivery_days: data.averageDeliveryDays ?? 0,
        approval_status: 'approved',
      }, { onConflict: 'user_id' });

      console.log('[ONBOARDING DEBUG] artist profile upsert result:', { error: artistError });

      if (artistError) {
        console.error('[ONBOARDING DEBUG] artist_profiles upsert failed:', artistError);
        return { error: `Błąd zapisu profilu artysty: ${artistError.message}` };
      }
    }

    // 3. Verify the save by reading back from the database
    const { data: finalProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('onboarding_completed, onboarding_completed_at')
      .eq('id', user.id)
      .maybeSingle();

    console.log('[ONBOARDING DEBUG] final profile after save:', finalProfile, 'verify error:', verifyError);

    if (verifyError || !finalProfile || !finalProfile.onboarding_completed) {
      console.error('[ONBOARDING DEBUG] verification failed:', verifyError, finalProfile);
      return { error: 'Zapis nie został potwierdzony w bazie. Spróbuj ponownie.' };
    }

    // 4. Only now update local state - the database confirmed the write
    const updatedUser: AuthUser = {
      ...user,
      displayName: data.displayName ?? user.displayName,
      avatarUrl: data.avatarUrl ?? user.avatarUrl,
      onboardingCompleted: true,
      onboardingCompletedAt: finalProfile.onboarding_completed_at ?? nowIso,
    };
    setUser(updatedUser);

    return { error: null };
  }

  const updateProfile = useCallback((data: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...data };
    });
  }, []);

  async function signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setUser(null);
    setAuthError(null);
  }

  async function signInAsDemo(role: UserRole): Promise<{ success: boolean; error?: string }> {
    if (role === 'admin' || role === 'guest') return { success: false };

    if (!isSupabaseConfigured) {
      const mockUser = mockUsers.find((u) => u.role === role && u.status === 'approved');
      if (!mockUser) return { success: false, error: 'Brak konta demo.' };
      const demoUser: AuthUser = {
        id: mockUser.id, email: mockUser.email, role: mockUser.role,
        status: mockUser.status, displayName: mockUser.displayName,
        avatarUrl: mockUser.avatarUrl,
        onboardingCompleted: true,
        isDemo: true,
      };
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return { success: true };
    }

    const email = role === 'client' ? 'demo.klient1@atelier-demo.pl' : 'demo.art1@atelier-demo.pl';
    const password = 'AtelierDemo2025';

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const msg = `Logowanie demo nie powiodło się: ${error.message}`;
      setAuthError(msg);
      return { success: false, error: msg };
    }

    if (data.session) {
      const dbUser = await loadUserFromDatabase(data.session);
      if (dbUser) {
        setUser({ ...dbUser, isDemo: true });
        setAuthError(null);
        return { success: true };
      }
      return { success: false, error: 'Nie udało się załadować profilu demo.' };
    }

    return { success: false, error: 'Brak sesji po logowaniu demo.' };
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, authError, signIn, signUp, signOut, signInAsDemo, completeOnboarding, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
