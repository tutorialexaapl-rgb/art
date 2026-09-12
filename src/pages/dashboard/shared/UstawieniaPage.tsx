import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AvatarUploader } from '@/components/features/AvatarUploader';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useCurrentProfile } from '@/hooks/useCurrentProfile';
import { Tabs } from '@/components/ui/Tabs';
import { profilesService } from '@/services/profilesService';
import { artistsService } from '@/services/artistsService';
import { supabase } from '@/lib/supabase';
import { useDemoGuard } from '@/hooks/useDemoGuard';

export function UstawieniaPage() {
  const { user, updateProfile: updateAuthUser } = useAuth();
  const { notify } = useToast();
  const { profile, clientProfile, artistProfile, refetch } = useCurrentProfile();
  const demoGuard = useDemoGuard();

  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [artistName, setArtistName] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [stylesText, setStylesText] = useState('');
  const [techniquesText, setTechniquesText] = useState('');
  const [savingArtist, setSavingArtist] = useState(false);

  const [clientType, setClientType] = useState('');
  const [company, setCompany] = useState('');
  const [nip, setNip] = useState('');
  const [savingClient, setSavingClient] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName ?? '');
    setAvatarUrl(profile.avatarUrl ?? '');
    setBio(profile.bio ?? '');
    setLocation(profile.location ?? '');
    setPhone(profile.phone ?? '');
    setWebsite(profile.website ?? '');
    setInstagram(profile.instagram ?? '');
  }, [profile]);

  useEffect(() => {
    if (!artistProfile) return;
    setArtistName(artistProfile.artistName ?? '');
    setPriceMin(String(artistProfile.priceRangeMin ?? ''));
    setPriceMax(String(artistProfile.priceRangeMax ?? ''));
    setDeliveryDays(String(artistProfile.averageDeliveryDays ?? ''));
    setStylesText(artistProfile.styles.join(', '));
    setTechniquesText(artistProfile.techniques.join(', '));
  }, [artistProfile]);

  useEffect(() => {
    if (!clientProfile) return;
    setClientType(clientProfile.clientType ?? '');
    setCompany(clientProfile.company ?? '');
    setNip(clientProfile.nip ?? '');
  }, [clientProfile]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (demoGuard()) return;
    setSavingProfile(true);
    try {
      await profilesService.updateOwnProfile(user.id, {
        displayName,
        avatarUrl,
        bio,
        location,
        phone,
        website,
        instagram,
      });
      updateAuthUser({ displayName, avatarUrl });
      notify('success', 'Profil zapisany.');
      refetch();
    } catch {
      notify('error', 'Nie udało się zapisać profilu.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSaveArtist(e: React.FormEvent) {
    e.preventDefault();
    if (!artistProfile) return;
    if (demoGuard()) return;
    setSavingArtist(true);
    try {
      await artistsService.updateArtistProfile(artistProfile.id, {
        artistName,
        priceRangeMin: parseInt(priceMin) || 0,
        priceRangeMax: parseInt(priceMax) || 0,
        averageDeliveryDays: parseInt(deliveryDays) || 0,
        styles: stylesText.split(',').map((s) => s.trim()).filter(Boolean),
        techniques: techniquesText.split(',').map((t) => t.trim()).filter(Boolean),
      });
      notify('success', 'Dane artysty zapisane.');
      refetch();
    } catch {
      notify('error', 'Nie udało się zapisać danych artysty.');
    } finally {
      setSavingArtist(false);
    }
  }

  async function handleSaveClient(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (demoGuard()) return;
    setSavingClient(true);
    try {
      await profilesService.updateClientProfile(user.id, {
        clientType,
        company,
        nip,
      });
      notify('success', 'Dane klienta zapisane.');
      refetch();
    } catch {
      notify('error', 'Nie udało się zapisać danych klienta.');
    } finally {
      setSavingClient(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (demoGuard()) return;
    if (newPassword !== confirmPassword) {
      notify('error', 'Nowe hasła nie są identyczne.');
      return;
    }
    if (newPassword.length < 8) {
      notify('error', 'Nowe hasło musi mieć minimum 8 znaków.');
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      notify('success', 'Hasło zmienione.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Nie udało się zmienić hasła.');
    } finally {
      setSavingPassword(false);
    }
  }

  const tabs = [
    {
      id: 'profile',
      label: 'Profil',
      content: (
        <form onSubmit={handleSaveProfile}>
          <Card>
            <CardHeader><h3 className="font-display text-lg text-graphite-600">Dane profilu</h3></CardHeader>
            <CardBody className="space-y-5">
              <div className="flex items-center gap-4">
                <AvatarUploader
                  currentUrl={avatarUrl}
                  userName={displayName}
                  userId={user?.id ?? ''}
                  onUpload={(url) => {
                    setAvatarUrl(url);
                    notify('success', 'Avatar przesłany. Kliknij „Zapisz zmiany", aby potwierdzić.');
                  }}
                  size="lg"
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-graphite-600">Zdjęcie profilowe</p>
                  <p className="text-xs text-graphite-300">Kliknij ikonę aparatu, aby zmienić zdjęcie. Nie zapomnij kliknąć „Zapisz zmiany" poniżej.</p>
                </div>
              </div>
              <Input label="Imię i nazwisko / Nazwa" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
              <Input label="Email" defaultValue={user?.email} disabled />
              <Input label="Lokalizacja" placeholder="np. Warszawa" value={location} onChange={(e) => setLocation(e.target.value)} />
              <Input label="Telefon" placeholder="+48 600 000 000" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Textarea label="Bio" rows={3} placeholder="Krótko o sobie..." value={bio} onChange={(e) => setBio(e.target.value)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Strona WWW" placeholder="twojastrona.pl" value={website} onChange={(e) => setWebsite(e.target.value)} />
                <Input label="Instagram" placeholder="@artysta" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              </div>
              <Button type="submit" variant="primary" disabled={savingProfile}>
                {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                {savingProfile ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </Button>
            </CardBody>
          </Card>
        </form>
      ),
    },
  ];

  if (user?.role === 'artist' && artistProfile) {
    tabs.push({
      id: 'artist',
      label: 'Dane artysty',
      content: (
        <form onSubmit={handleSaveArtist}>
          <Card>
            <CardHeader><h3 className="font-display text-lg text-graphite-600">Profil artysty</h3></CardHeader>
            <CardBody className="space-y-5">
              <Input label="Nazwa artystyczna" value={artistName} onChange={(e) => setArtistName(e.target.value)} required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Style (oddzielone przecinkami)" value={stylesText} onChange={(e) => setStylesText(e.target.value)} />
                <Input label="Techniki (oddzielone przecinkami)" value={techniquesText} onChange={(e) => setTechniquesText(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Cena od (PLN)" type="number" min={0} value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
                <Input label="Cena do (PLN)" type="number" min={0} value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Średni czas realizacji (dni)" type="number" min={1} value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} />
              </div>
              <Button type="submit" variant="primary" disabled={savingArtist}>
                {savingArtist && <Loader2 className="h-4 w-4 animate-spin" />}
                {savingArtist ? 'Zapisywanie...' : 'Zapisz dane artysty'}
              </Button>
            </CardBody>
          </Card>
        </form>
      ),
    });
  }

  if (user?.role === 'client' && clientProfile) {
    tabs.push({
      id: 'client',
      label: 'Dane klienta',
      content: (
        <form onSubmit={handleSaveClient}>
          <Card>
            <CardHeader><h3 className="font-display text-lg text-graphite-600">Profil klienta</h3></CardHeader>
            <CardBody className="space-y-5">
              <Input label="Typ klienta" placeholder="np. prywatny, firma" value={clientType} onChange={(e) => setClientType(e.target.value)} />
              <Input label="Firma" placeholder="Nazwa firmy" value={company} onChange={(e) => setCompany(e.target.value)} />
              <Input label="NIP" placeholder="0000000000" value={nip} onChange={(e) => setNip(e.target.value)} />
              <Button type="submit" variant="primary" disabled={savingClient}>
                {savingClient && <Loader2 className="h-4 w-4 animate-spin" />}
                {savingClient ? 'Zapisywanie...' : 'Zapisz dane klienta'}
              </Button>
            </CardBody>
          </Card>
        </form>
      ),
    });
  }

  tabs.push({
    id: 'security',
    label: 'Bezpieczeństwo',
    content: (
      <form onSubmit={handleChangePassword}>
        <Card>
          <CardHeader><h3 className="font-display text-lg text-graphite-600">Zmiana hasła</h3></CardHeader>
          <CardBody className="space-y-5">
            <Input label="Obecne hasło" type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <Input label="Nowe hasło" type="password" placeholder="min. 8 znaków" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <Input label="Powtórz nowe hasło" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <Button type="submit" variant="primary" disabled={savingPassword}>
              {savingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
              {savingPassword ? 'Zmiana...' : 'Zmień hasło'}
            </Button>
          </CardBody>
        </Card>
      </form>
    ),
  });

  tabs.push({
    id: 'notifications',
    label: 'Powiadomienia',
    content: (
      <Card>
        <CardHeader><h3 className="font-display text-lg text-graphite-600">Preferencje powiadomień</h3></CardHeader>
        <CardBody className="space-y-4">
          {['Email - nowa oferta', 'Email - nowy komentarz', 'Email - wiadomość w projekcie', 'Email - zmiana statusu projektu'].map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-graphite-400/30 text-gold-400 focus:ring-gold-400/30" />
              <span className="text-sm text-graphite-500">{item}</span>
            </label>
          ))}
          <Button variant="primary" onClick={() => notify('success', 'Ustawienia zapisane.')}>Zapisz</Button>
        </CardBody>
      </Card>
    ),
  });

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="Ustawienia" description="Zarządzaj swoim kontem i profilem." />
      <Tabs tabs={tabs} />
    </div>
  );
}
