import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AvatarUploader } from '@/components/features/AvatarUploader';
import { CoverUploader } from '@/components/features/CoverUploader';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrentProfile } from '@/hooks/useCurrentProfile';
import { artistsService } from '@/services/artistsService';

export function ArtistProfilPage() {
  const { notify } = useToast();
  const { user } = useAuth();
  const { artistProfile, loading, refetch } = useCurrentProfile();

  const [artistName, setArtistName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [styles, setStyles] = useState('');
  const [techniques, setTechniques] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [instagram, setInstagram] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!artistProfile) return;
    setArtistName(artistProfile.artistName ?? '');
    setBio(artistProfile.bio ?? '');
    setLocation(artistProfile.location ?? '');
    setStyles(artistProfile.styles.join(', '));
    setTechniques(artistProfile.techniques.join(', '));
    setPriceMin(String(artistProfile.priceRangeMin ?? ''));
    setPriceMax(String(artistProfile.priceRangeMax ?? ''));
    setDeliveryDays(String(artistProfile.averageDeliveryDays ?? ''));
    setYearsExperience(String(artistProfile.yearsExperience ?? ''));
    setInstagram(artistProfile.instagram ?? '');
    setWebsite(artistProfile.website ?? '');
    setAvatarUrl(artistProfile.avatarUrl ?? '');
    setCoverUrl(artistProfile.coverUrl ?? '');
  }, [artistProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
      </div>
    );
  }

  if (!artistProfile) {
    return (
      <div className="max-w-2xl">
        <PageHeader title="Mój profil" description="Zarządzaj swoim profilem publicznym." />
        <Card>
          <CardBody>
            <p className="text-graphite-400">Nie udało się załadować profilu artysty. Spróbuj odświeżyć stronę.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!artistProfile) return;
    setSaving(true);
    try {
      await artistsService.updateArtistProfile(artistProfile.id, {
        artistName,
        bio,
        location,
        styles: styles.split(',').map((s) => s.trim()).filter(Boolean),
        techniques: techniques.split(',').map((t) => t.trim()).filter(Boolean),
        priceRangeMin: parseInt(priceMin) || 0,
        priceRangeMax: parseInt(priceMax) || 0,
        averageDeliveryDays: parseInt(deliveryDays) || 0,
        instagram: instagram || undefined,
        website: website || undefined,
        avatarUrl,
        coverUrl,
      });
      notify('success', 'Profil zapisany.');
      refetch();
    } catch {
      notify('error', 'Nie udało się zapisać profilu. Spróbuj ponownie.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        title="Mój profil"
        description="Zarządzaj swoim profilem publicznym."
        action={
          <Link
            to={`/artysci/${artistProfile.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-500 transition-colors hover:text-gold-600"
          >
            Zobacz profil publiczny <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      />

      <Card>
        <CardHeader><h3 className="font-display text-lg text-graphite-600">Avatar</h3></CardHeader>
        <CardBody className="space-y-5">
          <div className="flex items-center gap-4">
            <AvatarUploader
              currentUrl={avatarUrl}
              userName={artistName}
              userId={user?.id ?? ''}
              onUpload={(url) => {
                setAvatarUrl(url);
                notify('success', 'Avatar przesłany. Kliknij „Zapisz zmiany", aby potwierdzić.');
              }}
            />
            <div className="flex-1 space-y-2">
              <p className="text-sm text-graphite-400">Kliknij ikonę aparatu, aby przesłać nowe zdjęcie profilowe.</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><h3 className="font-display text-lg text-graphite-600">Zdjęcie tła</h3></CardHeader>
        <CardBody className="space-y-5">
          <CoverUploader
            currentUrl={coverUrl}
            userId={user?.id ?? ''}
            onUpload={(url) => {
              setCoverUrl(url);
              notify('success', 'Zdjęcie tła przesłane. Kliknij „Zapisz zmiany”, aby potwierdzić.');
            }}
          />
          <p className="text-sm text-graphite-400">To zdjęcie pojawia się na górze Twojej strony publicznej. Użyj szerokiego, panoramicznego ujęcia — np. Twojej pracowni lub wybranego obrazu.</p>
        </CardBody>
      </Card>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader><h3 className="font-display text-lg text-graphite-600">Dane profilu</h3></CardHeader>
          <CardBody className="space-y-5">
            <Input label="Nazwa artystyczna" value={artistName} onChange={(e) => setArtistName(e.target.value)} required />
            <Textarea label="Bio" rows={5} value={bio} onChange={(e) => setBio(e.target.value)} />
            <Input label="Lokalizacja" value={location} onChange={(e) => setLocation(e.target.value)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Style (oddzielone przecinkami)" value={styles} onChange={(e) => setStyles(e.target.value)} />
              <Input label="Techniki (oddzielone przecinkami)" value={techniques} onChange={(e) => setTechniques(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Cena od (PLN)" type="number" min={0} value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
              <Input label="Cena do (PLN)" type="number" min={0} value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Orientacyjny czas realizacji (dni)" type="number" min={1} value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} />
              <Input label="Lata doświadczenia" type="number" min={0} value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Instagram" placeholder="@artysta.art" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              <Input label="Strona WWW" placeholder="artysta.art" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              {artistProfile.isVerified && <Badge color="gold">Zweryfikowany</Badge>}
              <Badge color="neutral">{artistProfile.stats.completedProjects} realizacji</Badge>
              <Badge color="clay">{artistProfile.stats.averageRating.toFixed(1)} ocena</Badge>
            </div>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </Button>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}
