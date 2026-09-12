import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AvatarUploader } from '@/components/features/AvatarUploader';
import { CoverUploader } from '@/components/features/CoverUploader';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';

interface CreateArtistResult {
  success: boolean;
  userId?: string;
  artistProfileId?: string;
  slug?: string;
  generatedPassword?: string;
  error?: string;
}

export function AdminCreateArtistPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notify } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [artistName, setArtistName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [styles, setStyles] = useState('');
  const [techniques, setTechniques] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('14');
  const [yearsExperience, setYearsExperience] = useState('0');
  const [instagram, setInstagram] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<CreateArtistResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setResult(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        notify('error', 'Brak sesji. Zaloguj się ponownie.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-artist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          password: password || undefined,
          artistName,
          bio,
          location,
          styles: styles.split(',').map((s) => s.trim()).filter(Boolean),
          techniques: techniques.split(',').map((t) => t.trim()).filter(Boolean),
          specializations: specializations.split(',').map((s) => s.trim()).filter(Boolean),
          priceRangeMin: parseInt(priceMin) || 0,
          priceRangeMax: parseInt(priceMax) || 0,
          averageDeliveryDays: parseInt(deliveryDays) || 14,
          yearsExperience: parseInt(yearsExperience) || 0,
          instagram,
          website,
          avatarUrl: avatarUrl || null,
          coverUrl: coverUrl || null,
        }),
      });

      const data: CreateArtistResult = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Nie udało się utworzyć artysty.');
      }

      setResult(data);
      notify('success', `Artysta "${artistName}" utworzony pomyślnie.`);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Wystąpił błąd.');
    } finally {
      setSaving(false);
    }
  }

  if (result) {
    return (
      <div className="max-w-2xl space-y-6">
        <PageHeader title="Artysta utworzony" description="Konto zostało pomyślnie założone." />
        <Card>
          <CardBody className="space-y-5">
            <div className="rounded-xl bg-success/10 p-5">
              <h3 className="font-display text-lg text-graphite-600">{artistName}</h3>
              <p className="text-sm text-graphite-400">{email}</p>
            </div>

            {result.generatedPassword && (
              <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
                <p className="mb-2 text-sm font-medium text-graphite-600">Wygenerowane hasło (przekaż artyście):</p>
                <div className="flex items-center gap-3">
                  <code className="rounded-lg bg-graphite-600 px-4 py-2 font-mono text-lg text-gold-400">{result.generatedPassword}</code>
                  <button
                    type="button"
                    onClick={() => { navigator.clipboard.writeText(result.generatedPassword!); notify('success', 'Hasło skopiowane.'); }}
                    className="rounded-lg bg-graphite-500 px-3 py-2 text-xs font-medium text-ivory-100 transition-colors hover:bg-graphite-400"
                  >
                    Kopiuj
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {result.slug && (
                <a
                  href={`/artysci/${result.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-5 py-2.5 text-sm font-medium text-graphite-700 transition-colors hover:bg-gold-500"
                >
                  Zobacz profil publiczny
                </a>
              )}
              {result.artistProfileId && (
                <Button variant="secondary" onClick={() => navigate(`/admin/artysci/${result.artistProfileId}`)}>
                  Edytuj profil i portfolio
                </Button>
              )}
              <Button variant="secondary" onClick={() => { setResult(null); setEmail(''); setPassword(''); setArtistName(''); setBio(''); setLocation(''); setStyles(''); setTechniques(''); setSpecializations(''); setPriceMin(''); setPriceMax(''); setDeliveryDays('14'); setYearsExperience('0'); setInstagram(''); setWebsite(''); setAvatarUrl(''); setCoverUrl(''); }}>
                Dodaj kolejnego
              </Button>
              <Button variant="secondary" onClick={() => navigate('/admin/artists')}>
                Wróć do listy
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        title="Nowy artysta"
        description="Utwórz konto artysty bez rejestracji i onboardingu."
        action={
          <button onClick={() => navigate('/admin/artists')} className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-500 transition-colors hover:text-gold-600">
            <ArrowLeft className="h-4 w-4" /> Wróć
          </button>
        }
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><h3 className="font-display text-lg text-graphite-600">Dane konta</h3></CardHeader>
          <CardBody className="space-y-5">
            <Input label="E-mail artysty" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="artysta@example.com" />
            <Input label="Hasło (zostaw puste, aby wygenerować)" type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Wygenerowane automatycznie" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h3 className="font-display text-lg text-graphite-600">Zdjęcia</h3></CardHeader>
          <CardBody className="space-y-5">
            <div className="flex items-center gap-4">
              <AvatarUploader
                currentUrl={avatarUrl}
                userName={artistName || 'Nowy artysta'}
                userId={user?.id ?? ''}
                onUpload={(url) => { setAvatarUrl(url); notify('success', 'Avatar przesłany.'); }}
              />
              <p className="text-sm text-graphite-400">Avatar profilowy artysty.</p>
            </div>
            <CoverUploader
              currentUrl={coverUrl}
              userId={user?.id ?? ''}
              onUpload={(url) => { setCoverUrl(url); notify('success', 'Zdjęcie tła przesłane.'); }}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h3 className="font-display text-lg text-graphite-600">Dane profilu</h3></CardHeader>
          <CardBody className="space-y-5">
            <Input label="Nazwa artystyczna" value={artistName} onChange={(e) => setArtistName(e.target.value)} required />
            <Textarea label="Bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
            <Input label="Lokalizacja" value={location} onChange={(e) => setLocation(e.target.value)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Style (oddzielone przecinkami)" value={styles} onChange={(e) => setStyles(e.target.value)} />
              <Input label="Techniki (oddzielone przecinkami)" value={techniques} onChange={(e) => setTechniques(e.target.value)} />
            </div>
            <Input label="Specjalizacje (oddzielone przecinkami)" value={specializations} onChange={(e) => setSpecializations(e.target.value)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Cena od (PLN)" type="number" min={0} value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
              <Input label="Cena do (PLN)" type="number" min={0} value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Czas realizacji (dni)" type="number" min={1} value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} />
              <Input label="Lata doświadczenia" type="number" min={0} value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Instagram" placeholder="@artysta.art" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              <Input label="Strona WWW" placeholder="artysta.art" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Tworzenie...</span> : 'Utwórz artystę'}
            </Button>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}
