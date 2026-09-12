import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Phone, MapPin, User, Building2, Loader2 } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Input, Select, Checkbox } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AvatarUploader } from '@/components/features/AvatarUploader';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { recordConsent } from '@/lib/consent';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ż/g, 'z').replace(/ź/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const CLIENT_TYPES: { value: string; label: string }[] = [
  { value: 'individual', label: 'Klient indywidualny' },
  { value: 'architect', label: 'Architekt wnętrz' },
  { value: 'developer', label: 'Deweloper' },
  { value: 'company', label: 'Firma' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'restaurant', label: 'Restauracja' },
  { value: 'other', label: 'Inne' },
];

export function OnboardingClientPage() {
  const { user, completeOnboarding } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.displayName ?? '');
  const [clientType, setClientType] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = fullName.trim().length >= 2 && clientType && city.trim().length >= 2 && agreeTerms && agreePrivacy;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      setError('Uzupełnij wymagane pola i zaakceptuj zgody.');
      return;
    }
    setError(null);
    setLoading(true);
    const { error } = await completeOnboarding({
      displayName: fullName,
      location: city,
      phone: phone || undefined,
      clientType,
    });
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      recordConsent('terms');
      recordConsent('privacy_policy');
      notify('success', 'Profil zlecającego utworzony. Witaj w Atelier!');
      navigate('/dashboard/client');
    }
  }

  return (
    <AuthLayout title="Witaj w Atelier" description="Uzupełnij swój profil zlecającego, aby zacząć zlecać obrazy.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl bg-gold-50 p-4">
          <p className="text-sm text-graphite-500">Zalogowano jako: <strong>{user?.email}</strong></p>
        </div>

        <Input
          label="Imię i nazwisko / Nazwa firmy"
          placeholder="np. Anna Kowalska lub Studio MK"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          icon={<User className="h-4 w-4" />}
          required
        />

        <Select
          label="Typ klienta"
          value={clientType}
          onChange={(e) => setClientType(e.target.value)}
          required
        >
          <option value="" disabled>Wybierz typ...</option>
          {CLIENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </Select>

        <Input
          label="Miasto"
          placeholder="np. Warszawa"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          icon={<MapPin className="h-4 w-4" />}
          required
        />

        <Input
          label="Telefon (opcjonalnie)"
          type="tel"
          placeholder="+48 600 000 000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon={<Phone className="h-4 w-4" />}
        />

        <div className="space-y-3 rounded-xl border border-graphite-400/10 bg-ivory-100 p-4">
          <Checkbox
            id="terms"
            label={<span>Akceptuję <Link to="/regulamin" className="text-graphite-600 underline">regulamin</Link></span>}
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          <Checkbox
            id="privacy"
            label={<span>Akceptuję <Link to="/polityka-prywatnosci" className="text-graphite-600 underline">politykę prywatności</Link></span>}
            checked={agreePrivacy}
            onChange={(e) => setAgreePrivacy(e.target.checked)}
          />
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <Button type="submit" variant="primary" className="w-full" disabled={!valid || loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Zapisywanie...</> : <>Zakończ onboarding <ArrowRight className="h-4 w-4" /></>}
        </Button>
      </form>
    </AuthLayout>
  );
}

export function OnboardingArtistPage() {
  const { user, completeOnboarding } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [artistName, setArtistName] = useState(user?.displayName ?? '');
  const [step, setStep] = useState<1 | 2>(1);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [techniques, setTechniques] = useState('');
  const [styles, setStyles] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [instagram, setInstagram] = useState('');
  const [website, setWebsite] = useState('');
  const [agreeArtistRules, setAgreeArtistRules] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstStepValid =
    artistName.trim().length >= 2 &&
    bio.trim().length >= 10 &&
    location.trim().length >= 2;

  const secondStepValid =
    techniques.trim().length >= 2 &&
    styles.trim().length >= 2 &&
    yearsExperience && parseInt(yearsExperience) > 0 &&
    priceMin && parseInt(priceMin) > 0 &&
    priceMax && parseInt(priceMax) > parseInt(priceMin) &&
    deliveryDays && parseInt(deliveryDays) > 0 &&
    agreeArtistRules && agreeTerms;

  function handleNextStep() {
    if (!firstStepValid) {
      setError('Uzupełnij nazwę artystyczną, bio i lokalizację.');
      return;
    }
    setError(null);
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!secondStepValid) {
      setError('Uzupełnij wszystkie wymagane pola i zaakceptuj zgody.');
      return;
    }
    setError(null);
    setLoading(true);
    const { error } = await completeOnboarding({
      displayName: artistName,
      artistName,
      artistSlug: slugify(artistName),
      bio,
      location,
      techniques: techniques.split(',').map((t) => t.trim()).filter(Boolean),
      styles: styles.split(',').map((s) => s.trim()).filter(Boolean),
      yearsExperience: parseInt(yearsExperience),
      priceRangeMin: parseInt(priceMin),
      priceRangeMax: parseInt(priceMax),
      averageDeliveryDays: parseInt(deliveryDays),
      avatarUrl: avatarUrl || undefined,
      instagram: instagram || undefined,
      website: website || undefined,
    });
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      recordConsent('artist_rules');
      recordConsent('terms');
      notify('success', 'Profil artysty utworzony. Możesz już aplikować na zlecenia.');
      navigate('/dashboard/artist');
    }
  }

  return (
    <AuthLayout title="Witaj, artyście" description="Uzupełnij swój profil, aby rozpocząć i aplikować na zlecenia.">
      <form onSubmit={handleSubmit} className="space-y-5">

        {step === 1 ? (
          <>
            <Input
              label="Nazwa artystyczna"
              placeholder="np. Artur Lewandowski"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              icon={<User className="h-4 w-4" />}
              required
            />

            <AvatarUploader
              currentUrl={avatarUrl}
              userName={artistName || 'Artysta'}
              userId={user?.id ?? ''}
              onUpload={setAvatarUrl}
              size="xl"
            />

            <div>
              <label className="label-elegant">Bio</label>
              <textarea
                className="input-elegant resize-none"
                rows={4}
                placeholder="Opisz swoją twórczość, techniki, inspiracje..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
              {bio.length > 0 && bio.length < 10 && (
                <p className="mt-1.5 text-xs text-error">Minimum 10 znaków</p>
              )}
            </div>

            <Input
              label="Lokalizacja"
              placeholder="np. Kraków"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              icon={<MapPin className="h-4 w-4" />}
              required
            />

            {error && <p className="text-sm text-error">{error}</p>}

            <Button type="button" variant="primary" className="w-full" onClick={handleNextStep}>
              Dalej <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Input
              label="Techniki (oddzielone przecinkami)"
              placeholder="np. Akryl, Olej, Mieszane media"
              value={techniques}
              onChange={(e) => setTechniques(e.target.value)}
              required
            />

            <Input
              label="Style (oddzielone przecinkami)"
              placeholder="np. Abstrakcyjny, Minimalistyczny"
              value={styles}
              onChange={(e) => setStyles(e.target.value)}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Lata doświadczenia"
                type="number"
                min={0}
                placeholder="np. 12"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                required
              />
              <Input
                label="Orientacyjny czas realizacji (dni)"
                type="number"
                min={1}
                placeholder="np. 70"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Cena od (PLN)"
                type="number"
                min={0}
                placeholder="np. 3000"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                required
              />
              <Input
                label="Cena do (PLN)"
                type="number"
                min={0}
                placeholder="np. 12000"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                required
              />
            </div>

            <Input
              label="Instagram (opcjonalnie)"
              placeholder="@artysta.art"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />

            <Input
              label="Strona WWW (opcjonalnie)"
              placeholder="artysta.art"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />

            <div className="rounded-xl border border-dashed border-graphite-400/20 p-6 text-center">
              <p className="text-sm text-graphite-300">Portfolio startowe</p>
              <p className="mt-1 text-xs text-graphite-200">Możesz dodać prace do portfolio po ukończeniu onboardingu w panelu artysty.</p>
            </div>

            <div className="space-y-3 rounded-xl border border-graphite-400/10 bg-ivory-100 p-4">
              <Checkbox
                id="artist-rules"
                label={<span>Akceptuję <Link to="/zasady-dla-artystow" className="text-graphite-600 underline">zasady dla artystów</Link></span>}
                checked={agreeArtistRules}
                onChange={(e) => setAgreeArtistRules(e.target.checked)}
              />
              <Checkbox
                id="artist-terms"
                label={<span>Akceptuję <Link to="/regulamin" className="text-graphite-600 underline">regulamin</Link></span>}
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
            </div>

            {error && <p className="text-sm text-error">{error}</p>}

            <div className="flex gap-3">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => { setError(null); setStep(1); }}>
                Wstecz
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={!secondStepValid || loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Zapisywanie...</> : <>Zakończ onboarding <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </div>
          </>
        )}
      </form>
    </AuthLayout>
  );
}
