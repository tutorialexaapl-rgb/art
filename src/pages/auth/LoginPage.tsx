import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getPostLoginRedirect } from '@/lib/authRedirect';
import type { UserRole } from '@/types';

const DEMO_DASHBOARDS: Record<UserRole, string> = {
  client: '/dashboard/client',
  artist: '/dashboard/artist',
  admin: '/admin',
  guest: '/login',
};

export function LoginPage() {
  const { signIn, signInAsDemo, authError } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError, user } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError(signInError);
    } else if (user) {
      notify('success', 'Zalogowano pomyślnie.');
      if (!isSupabaseConfigured) {
        const dest = redirect && redirect.startsWith('/') && user.onboardingCompleted ? redirect : DEMO_DASHBOARDS[user.role] ?? '/dashboard/client';
        window.location.href = dest;
      } else if (redirect && redirect.startsWith('/') && user.onboardingCompleted) {
        navigate(redirect, { replace: true });
      }
      // For real Supabase without redirect: RoleRedirect handles it automatically.
    }
  }

  async function handleDemo(role: UserRole) {
    setLoading(true);
    const result = await signInAsDemo(role);
    setLoading(false);
    if (result.success) {
      notify('info', `Zalogowano jako demo: ${role === 'artist' ? 'Artysta' : 'Zlecający'}. Tryb tylko do odczytu.`);
      window.location.href = DEMO_DASHBOARDS[role];
    } else {
      notify('error', result.error ?? 'Logowanie demo nie powiodło się.');
    }
  }

  return (
    <AuthLayout title="Zaloguj się" description="Witaj z powrotem w Atelier.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Email" type="email" placeholder="jan@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="h-4 w-4" />} required />
        <Input label="Hasło" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="h-4 w-4" />} required />
        {error && <p className="text-sm text-error">{error}</p>}
        {authError && !error && <p className="text-sm text-error">{authError}</p>}
        <div className="flex items-center justify-between">
          <Link to="/forgot-password" className="text-sm text-graphite-400 hover:text-graphite-600 transition-colors link-underline">Zapomniałeś hasła?</Link>
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Logowanie...' : 'Zaloguj się'} <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-graphite-400/10" />
        <span className="text-xs text-graphite-300">lub wejdź bez rejestracji</span>
        <div className="h-px flex-1 bg-graphite-400/10" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" size="sm" onClick={() => handleDemo('client')} disabled={loading}>
          <Eye className="h-3.5 w-3.5" /> Zlecający
        </Button>
        <Button variant="gold" size="sm" onClick={() => handleDemo('artist')} disabled={loading}>
          <Eye className="h-3.5 w-3.5" /> Artysta
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-graphite-300">
        Konta testowe pokazują pełny panel bez możliwości edycji.
      </p>

      <p className="mt-8 text-center text-sm text-graphite-400">
        Nie masz konta? <Link to="/register" className="text-graphite-600 font-medium hover:text-graphite-700 transition-colors link-underline">Załóż konto</Link>
      </p>
    </AuthLayout>
  );
}
