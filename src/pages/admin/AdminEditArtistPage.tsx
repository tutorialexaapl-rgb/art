import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Trash2, Loader2, Plus, ImageIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AvatarUploader } from '@/components/features/AvatarUploader';
import { CoverUploader } from '@/components/features/CoverUploader';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { artistsService } from '@/services/artistsService';
import { storageService } from '@/services/storageService';
import { supabase } from '@/lib/supabase';
import type { ArtistProfile, ArtistPortfolioItem } from '@/types';

export function AdminEditArtistPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notify } = useToast();

  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [portfolio, setPortfolio] = useState<ArtistPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [artistName, setArtistName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [styles, setStyles] = useState('');
  const [techniques, setTechniques] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [instagram, setInstagram] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [saving, setSaving] = useState(false);

  // New portfolio item form
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemTechnique, setNewItemTechnique] = useState('');
  const [newItemYear, setNewItemYear] = useState(String(new Date().getFullYear()));
  const [newItemWidth, setNewItemWidth] = useState('');
  const [newItemHeight, setNewItemHeight] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemIsPublic, setNewItemIsPublic] = useState(true);
  const [newItemIsForSale, setNewItemIsForSale] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [addingItem, setAddingItem] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      let p = await artistsService.getArtistProfile(id);

      if (!p) {
        const { data: profileRow } = await supabase
          .from('profiles')
          .select('id, display_name, email')
          .eq('id', id)
          .maybeSingle();

        if (profileRow) {
          p = await artistsService.createArtistProfileForUser(
            (profileRow as { id: string; display_name: string; email: string }).id,
            (profileRow as { id: string; display_name: string; email: string }).display_name || 'Nowy artysta',
          );
          notify('info', 'Profil artysty nie istniał — utworzono nowy. Uzupełnij dane i zapisz.');
        }
      }

      if (!p) {
        notify('error', 'Nie znaleziono profilu artysty.');
        navigate('/admin/artists');
        return;
      }
      setProfile(p);
      setPortfolio(p.portfolio);
      setArtistName(p.artistName ?? '');
      setBio(p.bio ?? '');
      setLocation(p.location ?? '');
      setStyles(p.styles.join(', '));
      setTechniques(p.techniques.join(', '));
      setSpecializations((p.specializations ?? []).join(', '));
      setPriceMin(String(p.priceRangeMin ?? ''));
      setPriceMax(String(p.priceRangeMax ?? ''));
      setDeliveryDays(String(p.averageDeliveryDays ?? ''));
      setYearsExperience(String(p.yearsExperience ?? ''));
      setInstagram(p.instagram ?? '');
      setWebsite(p.website ?? '');
      setAvatarUrl(p.avatarUrl ?? '');
      setCoverUrl(p.coverUrl ?? '');
    } catch {
      notify('error', 'Nie udało się załadować profilu.');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, notify]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await artistsService.updateArtistProfile(id, {
        artistName,
        bio,
        location,
        styles: styles.split(',').map((s) => s.trim()).filter(Boolean),
        techniques: techniques.split(',').map((t) => t.trim()).filter(Boolean),
        specializations: specializations.split(',').map((s) => s.trim()).filter(Boolean),
        priceRangeMin: parseInt(priceMin) || 0,
        priceRangeMax: parseInt(priceMax) || 0,
        averageDeliveryDays: parseInt(deliveryDays) || 0,
        instagram: instagram || undefined,
        website: website || undefined,
        avatarUrl,
        coverUrl,
      });
      notify('success', 'Profil zapisany.');
    } catch {
      notify('error', 'Nie udało się zapisać profilu.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUploadPortfolioImage(file: File) {
    if (!profile) return;
    setUploadingImage(true);
    try {
      const result = await storageService.uploadPortfolioImage(file, profile.userId);
      setPendingImageUrl(result.url);
      notify('success', 'Zdjęcie wgrane. Uzupełnij dane i kliknij "Dodaj pracę".');
    } catch {
      notify('error', 'Nie udało się wgrać zdjęcia.');
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleAddPortfolioItem(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !pendingImageUrl) {
      notify('error', 'Najpierw wgraj zdjęcie.');
      return;
    }
    setAddingItem(true);
    try {
      const item = await artistsService.addPortfolioItem({
        artistId: id,
        title: newItemTitle || 'Bez tytułu',
        imageUrl: pendingImageUrl,
        technique: newItemTechnique,
        year: newItemYear,
        widthCm: parseInt(newItemWidth) || 0,
        heightCm: parseInt(newItemHeight) || 0,
        isPublic: newItemIsPublic,
        isForSale: newItemIsForSale,
        price: newItemIsForSale && newItemPrice ? parseInt(newItemPrice) : undefined,
      });
      if (item) {
        setPortfolio((prev) => [item, ...prev]);
        notify('success', 'Praca dodana do portfolio.');
      }
      setPendingImageUrl(null);
      setNewItemTitle('');
      setNewItemTechnique('');
      setNewItemYear(String(new Date().getFullYear()));
      setNewItemWidth('');
      setNewItemHeight('');
      setNewItemPrice('');
      setNewItemIsPublic(true);
      setNewItemIsForSale(false);
    } catch {
      notify('error', 'Nie udało się dodać pracy.');
    } finally {
      setAddingItem(false);
    }
  }

  async function handleDeletePortfolioItem(itemId: string, imageUrl: string) {
    try {
      await artistsService.deletePortfolioItem(itemId);
      if (imageUrl) {
        await storageService.deleteFile('artist-portfolio', imageUrl).catch(() => {});
      }
      setPortfolio((prev) => prev.filter((p) => p.id !== itemId));
      notify('success', 'Praca usunięta.');
    } catch {
      notify('error', 'Nie udało się usunąć pracy.');
    }
  }

  async function handleTogglePublic(item: ArtistPortfolioItem) {
    try {
      await artistsService.updatePortfolioItem(item.id, { isPublic: !item.isPublic });
      setPortfolio((prev) => prev.map((p) => p.id === item.id ? { ...p, isPublic: !p.isPublic } : p));
    } catch {
      notify('error', 'Nie udało się zmienić widoczności.');
    }
  }

  async function handleToggleForSale(item: ArtistPortfolioItem) {
    try {
      await artistsService.updatePortfolioItem(item.id, { isForSale: !item.isForSale });
      setPortfolio((prev) => prev.map((p) => p.id === item.id ? { ...p, isForSale: !p.isForSale } : p));
    } catch {
      notify('error', 'Nie udało się zmienić statusu sprzedaży.');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        title={`Edycja: ${profile.artistName}`}
        description="Pełna edycja profilu i portfolio artysty."
        action={
          <div className="flex items-center gap-3">
            <Link to={`/artysci/${profile.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-500 transition-colors hover:text-gold-600">
              Profil publiczny <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button onClick={() => navigate('/admin/artists')} className="inline-flex items-center gap-1.5 text-sm font-medium text-graphite-400 transition-colors hover:text-graphite-600">
              <ArrowLeft className="h-4 w-4" /> Wróć
            </button>
          </div>
        }
      />

      <Card>
        <CardHeader><h3 className="font-display text-lg text-graphite-600">Avatar</h3></CardHeader>
        <CardBody className="space-y-5">
          <div className="flex items-center gap-4">
            <AvatarUploader
              currentUrl={avatarUrl}
              userName={artistName}
              userId={profile.userId}
              onUpload={(url) => { setAvatarUrl(url); notify('success', 'Avatar przesłany. Kliknij "Zapisz zmiany".'); }}
            />
            <p className="text-sm text-graphite-400">Avatar profilowy.</p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><h3 className="font-display text-lg text-graphite-600">Zdjęcie tła</h3></CardHeader>
        <CardBody className="space-y-5">
          <CoverUploader
            currentUrl={coverUrl}
            userId={profile.userId}
            onUpload={(url) => { setCoverUrl(url); notify('success', 'Zdjęcie tła przesłane. Kliknij "Zapisz zmiany".'); }}
          />
        </CardBody>
      </Card>

      <form onSubmit={handleSaveProfile}>
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
              {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </Button>
          </CardBody>
        </Card>
      </form>

      {/* Portfolio management */}
      <Card>
        <CardHeader><h3 className="font-display text-lg text-graphite-600">Portfolio ({portfolio.length})</h3></CardHeader>
        <CardBody className="space-y-6">
          {/* Existing portfolio items */}
          {portfolio.length === 0 && (
            <p className="text-sm text-graphite-400">Brak prac w portfolio.</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {portfolio.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-xl border border-graphite-400/10">
                <div className="aspect-square overflow-hidden bg-beige-100">
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                </div>
                <div className="space-y-2 p-3">
                  <p className="text-sm font-medium text-graphite-600">{item.title}</p>
                  <p className="text-xs text-graphite-400">{item.technique} · {item.year} · {item.widthCm}×{item.heightCm} cm</p>
                  {item.isForSale && item.price && (
                    <p className="text-xs font-medium text-gold-600">{item.price} PLN</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTogglePublic(item)}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${item.isPublic ? 'bg-success/20 text-success-light' : 'bg-graphite-500/20 text-graphite-300'}`}
                    >
                      {item.isPublic ? 'Publiczne' : 'Prywatne'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleForSale(item)}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${item.isForSale ? 'bg-gold-400/20 text-gold-600' : 'bg-graphite-500/20 text-graphite-300'}`}
                    >
                      {item.isForSale ? 'Na sprzedaż' : 'Niesprzedawane'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePortfolioItem(item.id, item.imageUrl)}
                      className="ml-auto flex items-center gap-1 rounded-full bg-error/10 px-2.5 py-1 text-[10px] font-medium text-error transition-colors hover:bg-error/20"
                    >
                      <Trash2 className="h-3 w-3" /> Usuń
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add new portfolio item */}
          <div className="border-t border-graphite-400/10 pt-6">
            <h4 className="mb-4 font-display text-base text-graphite-600">Dodaj nową pracę</h4>

            {/* Upload image */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Zdjęcie pracy</label>
              {pendingImageUrl ? (
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-lg border border-graphite-400/10">
                    <img src={pendingImageUrl} alt="Podgląd" className="h-full w-full object-cover" />
                  </div>
                  <button type="button" onClick={() => setPendingImageUrl(null)} className="text-xs text-error hover:underline">Usuń podgląd</button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-graphite-400/20 bg-beige-50 px-6 py-8 text-center transition-colors hover:border-gold-400 hover:bg-gold-50">
                  {uploadingImage ? <Loader2 className="h-6 w-6 animate-spin text-gold-500" /> : <ImageIcon className="h-6 w-6 text-graphite-300" />}
                  <span className="text-sm text-graphite-400">{uploadingImage ? 'Wgrywanie...' : 'Kliknij, aby wgrać zdjęcie'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadPortfolioImage(f); e.target.value = ''; }}
                  />
                </label>
              )}
            </div>

            <form onSubmit={handleAddPortfolioItem} className="space-y-4">
              <Input label="Tytuł" value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)} placeholder="np. Pejzaż jesieni" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Technika" value={newItemTechnique} onChange={(e) => setNewItemTechnique(e.target.value)} placeholder="np. Olej na płótnie" />
                <Input label="Rok" value={newItemYear} onChange={(e) => setNewItemYear(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Szerokość (cm)" type="number" min={0} value={newItemWidth} onChange={(e) => setNewItemWidth(e.target.value)} />
                <Input label="Wysokość (cm)" type="number" min={0} value={newItemHeight} onChange={(e) => setNewItemHeight(e.target.value)} />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-graphite-600">
                  <input type="checkbox" checked={newItemIsPublic} onChange={(e) => setNewItemIsPublic(e.target.checked)} className="rounded border-graphite-400 text-gold-500 focus:ring-gold-400" />
                  Publiczne
                </label>
                <label className="flex items-center gap-2 text-sm text-graphite-600">
                  <input type="checkbox" checked={newItemIsForSale} onChange={(e) => setNewItemIsForSale(e.target.checked)} className="rounded border-graphite-400 text-gold-500 focus:ring-gold-400" />
                  Na sprzedaż
                </label>
                {newItemIsForSale && (
                  <Input label="Cena (PLN)" type="number" min={0} value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} className="w-40" />
                )}
              </div>
              <Button type="submit" variant="primary" disabled={!pendingImageUrl || addingItem}>
                {addingItem ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Dodawanie...</span> : <span className="flex items-center gap-2"><Plus className="h-4 w-4" /> Dodaj pracę</span>}
              </Button>
            </form>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
