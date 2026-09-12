import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Palette, Briefcase, Eye } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Input, Checkbox } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { checkAccountAvailability, getAvailabilityMessage, type AccountAvailabilityStatus } from '@/lib/accountUtils';
import type { UserRole } from '@/types';
import { recordConsent } from '@/lib/consent';

const DEMO_DASHBOARDS: Record<string, string> = {
  client: '/dashboard/client',
  artist: '/dashboard/artist',
};

export function RegisterPage() {
  const { signUp, signInAsDemo } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<UserRole | null>(
    searchParams.get('role') === 'artist' ? 'artist' : searchParams.get('role') === 'client' ? 'client' : null
  );
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const [emailCheck, setEmailCheck] = useState<AccountAvailabilityStatus | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  async function handleDemo(demoRole: UserRole) {
    setDemoLoading(true);
    const result = await signInAsDemo(demoRole);
    setDemoLoading(false);
    if (result.success) {
      notify('info', `Zalogowano jako demo: ${demoRole === 'artist' ? 'Artysta' : 'Zlecający'}. Tryb tylko do odczytu.`);
      window.location.href = DEMO_DASHBOARDS[demoRole];
    } else {
      notify('error', result.error ?? 'Logowanie demo nie powiodło się.');
    }
  }

  async function handleEmailBlur() {
    if (!email || !role) return;
    setCheckingEmail(true);
    const result = await checkAccountAvailability(email, undefined, role);
    setEmailCheck(result.status);
    setCheckingEmail(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) {
      setError('Wybierz typ konta.');
      return;
    }
    if (!consentTerms || !consentPrivacy) {
      setError('Musisz zaakceptować regulamin i politykę prywatności.');
      return;
    }
    setLoading(true);
    setError(null);

    if (emailCheck && emailCheck !== 'available') {
      setError(getAvailabilityMessage(emailCheck));
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, displayName, role);
    setLoading(false);
    if (error) {
      setError(error);
      if (error.includes('istnieje już konto')) {
        setEmailCheck('email_already_used');
      }
    } else {
      recordConsent('terms', { form: 'register' });
      recordConsent('privacy_policy', { form: 'register' });
      notify('success', 'Konto utworzone. Przekierowujemy do onboardingu.');
      navigate(role === 'artist' ? '/onboarding/artist' : '/onboarding/client');
    }
  }

  return (
    <AuthLayout title="Dołącz do Atelier" description="Wybierz typ konta i zacznij swoją przygodę.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Account type selector */}
        <div>
          <span className="label-elegant">Typ konta</span>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center transition-all ${
                role === 'client'
                  ? 'border-gold-400 bg-gold-50 text-graphite-600'
                  : 'border-graphite-400/10 bg-ivory-50 text-graphite-400 hover:border-graphite-400/20'
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                role === 'client' ? 'bg-gold-400 text-graphite-700' : 'bg-ivory-200 text-graphite-300'
              }`}>
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-base">Zlecający</p>
                <p className="text-xs text-graphite-300 mt-0.5">Chcę zlecić obraz</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('artist')}
              className={`flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center transition-all ${
                role === 'artist'
                  ? 'border-gold-400 bg-gold-50 text-graphite-600'
                  : 'border-graphite-400/10 bg-ivory-50 text-graphite-400 hover:border-graphite-400/20'
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                role === 'artist' ? 'bg-gold-400 text-graphite-700' : 'bg-ivory-200 text-graphite-300'
              }`}>
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-base">Artysta</p>
                <p className="text-xs text-graphite-300 mt-0.5">Chcę tworzyć na zamówienie</p>
              </div>
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gold-400/20 bg-gold-50/50 p-3">
          <p className="text-xs text-graphite-400 leading-relaxed">
            Jeden adres e-mail może być przypisany tylko do jednego typu konta. Po rejestracji nie będzie można założyć drugiego konta na ten sam e-mail.
          </p>
        </div>

        <Input label="Imię i nazwisko / Nazwa" placeholder="np. Anna Kowalska" value={displayName} onChange={(e) => setDisplayName(e.target.value)} icon={<User className="h-4 w-4" />} required />
        <Input label="Email" type="email" placeholder="jan@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setEmailCheck(null); }} onBlur={handleEmailBlur} icon={<Mail className="h-4 w-4" />} required />
        {checkingEmail && <p className="-mt-2 text-xs text-graphite-300">Sprawdzanie dostępności...</p>}
        {emailCheck && emailCheck !== 'available' && !checkingEmail && (
          <p className="-mt-2 text-sm text-error">{getAvailabilityMessage(emailCheck)}</p>
        )}

        <Input label="Hasło" type="password" placeholder="min. 8 znaków" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="h-4 w-4" />} required minLength={8} />

        {error && <p className="text-sm text-error">{error}</p>}

        <div className="space-y-3">
          <Checkbox
            id="consentTerms"
            label={<>
              Akceptuję <Link to="/regulamin" className="text-graphite-400 hover:text-graphite-600 underline">regulamin</Link> platformy.
            </>}
            checked={consentTerms}
            onChange={(e) => setConsentTerms(e.target.checked)}
          />
          <Checkbox
            id="consentPrivacy"
            label={<>
              Zapoznałem/am się z <Link to="/polityka-prywatnosci" className="text-graphite-400 hover:text-graphite-600 underline">polityką prywatności</Link> i akceptuję zasady przetwarzania moich danych.
            </>}
            checked={consentPrivacy}
            onChange={(e) => setConsentPrivacy(e.target.checked)}
          />
        </div>

        <Button type="submit" variant="primary" className="w-full" disabled={loading || !role}>
          {loading ? 'Rejestracja...' : 'Załóż konto'} <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-graphite-400/10" />
        <span className="text-xs text-graphite-300">lub wejdź bez rejestracji</span>
        <div className="h-px flex-1 bg-graphite-400/10" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => handleDemo('client')} disabled={demoLoading}>
          <Eye className="h-3.5 w-3.5" /> Zlecający
        </Button>
        <Button type="button" variant="gold" size="sm" onClick={() => handleDemo('artist')} disabled={demoLoading}>
          <Eye className="h-3.5 w-3.5" /> Artysta
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-graphite-300">
        Konta testowe pokazują pełny panel bez możliwości edycji.
      </p>

      <p className="mt-8 text-center text-sm text-graphite-400">
        Masz już konto? <Link to="/login" className="text-graphite-600 font-medium hover:text-graphite-600 transition-colors link-underline">Zaloguj się</Link>
      </p>
    </AuthLayout>
  );
}
