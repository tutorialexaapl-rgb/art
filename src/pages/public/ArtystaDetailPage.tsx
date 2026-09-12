import { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, BadgeCheck, Star, Globe, Instagram, Clock, Wallet,
  Calendar, Sparkles, FileText, ImageIcon, Mail, UserPlus, Palette, Layers, BookOpen, Send,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { commissionsService } from '@/services/commissionsService';
import { invitationsService } from '@/services/invitationsService';
import { useToast } from '@/context/ToastContext';
import type { CommissionRequest } from '@/types';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/ui/States';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { useAuth } from '@/context/AuthContext';
import { useArtist } from '@/hooks/useArtist';
import { usePublicCommissions } from '@/hooks/usePublicCommissions';
import { formatCurrency } from '@/lib/utils';
import { ReportButton } from '@/components/features/ReportButton';
import { useSeo } from '@/hooks/useSeo';
import { generateArtistMetadata, generateAltText, getStaticMetadata } from '@/lib/seo';
import { OBRAZY_KATEGORIE } from '@/lib/seo';
import { SeoImage } from '@/components/ui/SeoImage';
import { artistCoverAlt, portfolioAlt, lightboxAlt } from '@/lib/seo/alt-text';

export function ArtystaDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { artist, loading, error, refetch } = useArtist(slug);
  const { commissions: openCommissions } = usePublicCommissions();
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [clientCommissions, setClientCommissions] = useState<CommissionRequest[]>([]);
  const [selectedCommissionId, setSelectedCommissionId] = useState<string | null>(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    if (!user || user.role !== 'client') return;
    commissionsService
      .getClientCommissions(user.id)
      .then((data) => setClientCommissions(data))
      .catch((err) => console.error('Failed to load client commissions:', err));
  }, [user]);

  const activeCommissions = clientCommissions.filter(
    (c) => c.status === 'offers_open' || c.status === 'published' || c.status === 'artist_selected' || c.status === 'in_progress'
  );

  const handleInvite = async () => {
    if (!selectedCommissionId || !user || !artist) {
      notify('error', 'Wybierz zlecenie, do którego chcesz zaprosić artystę.');
      return;
    }
    setSubmitting(true);
    try {
      await invitationsService.create({
        commissionRequestId: selectedCommissionId,
        artistId: artist.id,
        clientId: user.id,
        message: inviteMessage.trim() || undefined,
      });
      notify('success', `Zaproszenie wysłane do artysty ${artist.artistName}.`);
      setInviteModalOpen(false);
      setSelectedCommissionId(null);
      setInviteMessage('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Nie udało się wysłać zaproszenia.';
      notify('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const seoData = useMemo(
    () => artist ? generateArtistMetadata(artist) : getStaticMetadata('/artysci'),
    [artist]
  );
  useSeo(seoData);

  if (loading) {
    return (
      <div>
        <div className="relative h-[300px] overflow-hidden lg:h-[400px]">
          <LoadingSkeleton className="h-full w-full rounded-none" />
        </div>
        <div className="container-content -mt-20 relative z-10">
          <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-8 shadow-lg">
            <div className="flex items-end gap-5">
              <LoadingSkeleton className="h-24 w-24 rounded-full" />
              <div className="flex-1 space-y-3 pb-1">
                <LoadingSkeleton className="h-7 w-48" />
                <LoadingSkeleton className="h-4 w-32" />
              </div>
              <div className="flex gap-3">
                <LoadingSkeleton className="h-10 w-28" />
                <LoadingSkeleton className="h-10 w-28" />
              </div>
            </div>
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <LoadingSkeleton className="h-6 w-32" />
              <LoadingSkeleton className="h-4 w-full" />
              <LoadingSkeleton className="h-4 w-3/4" />
              <LoadingSkeleton className="h-4 w-2/3" />
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <LoadingSkeleton key={i} className="aspect-[4/5]" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <LoadingSkeleton className="h-64 w-full rounded-2xl" />
              <LoadingSkeleton className="h-48 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-30 text-center">
        <ErrorState title="Nie udało się pobrać profilu artysty" description={error} onRetry={refetch} />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="py-30 text-center">
        <h1 className="font-display text-2xl text-graphite-600">Artysta nie został znaleziony</h1>
        <Link to="/artysci" className="mt-4 inline-flex">
          <Button variant="secondary"><ArrowLeft className="h-4 w-4" /> Wróć do artystów</Button>
        </Link>
      </div>
    );
  }

  const isSelf = user?.id === artist.userId;
  const isClient = user?.role === 'client';
  const isGuest = !user;
  const portfolioItems = artist.portfolio ?? [];

  return (
    <div>
      {/* Cover */}
      <div className="relative h-[300px] overflow-hidden lg:h-[400px]">
        <SeoImage src={artist.coverUrl} fallbackSrc="/abstract-painting-inspiration.webp" alt={artistCoverAlt(artist)} className="h-full w-full object-cover" loading="eager" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite-700/80 via-graphite-700/20 to-transparent" />
      </div>

      <div className="container-content -mt-20 relative z-10">
        {/* Profile header card */}
        <Reveal>
          <div className="flex flex-col gap-6 rounded-2xl border border-graphite-400/10 bg-ivory-50 p-8 shadow-lg sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-5">
              <Avatar name={artist.artistName} src={artist.avatarUrl} size="xl" className="border-4 border-ivory-50 shadow-lg" />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-3xl text-graphite-600">{artist.artistName}</h1>
                  {artist.isVerified && <BadgeCheck className="h-6 w-6 text-gold-500" />}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-graphite-400">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {artist.location}</span>
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-gold-300 text-gold-300" /> {artist.stats.averageRating} ({artist.stats.reviewCount})</span>
                  <span>{artist.stats.completedProjects} realizacji</span>
                  <span>{artist.yearsExperience} lat doświadczenia</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {isSelf ? (
                <Link to="/dashboard/artist/profil"><Button variant="secondary">Edytuj profil</Button></Link>
              ) : isClient ? (
                <Button variant="primary" onClick={() => setInviteModalOpen(true)}><Mail className="h-4 w-4" /> Zaproś do zlecenia</Button>
              ) : (
                <>
                  <Link to="/register"><Button variant="primary"><UserPlus className="h-4 w-4" /> Zarejestruj się jako zlecający</Button></Link>
                </>
              )}
              {!isSelf && (
                <ReportButton targetType="profile" targetId={artist.id} variant="text" />
              )}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* ──────────────── Main column ──────────────── */}
          <div>
            {/* About */}
            <Reveal>
              <h2 className="font-display text-xl text-graphite-600">O artyście</h2>
              <p className="mt-3 text-graphite-500 text-pretty leading-relaxed">{artist.bio}</p>

              {/* Specializations */}
              {artist.specializations && artist.specializations.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-mono text-xs uppercase tracking-wide text-graphite-300">Specjalizacje</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {artist.specializations.map((s) => <Badge key={s} color="stone">{s}</Badge>)}
                  </div>
                </div>
              )}

              {/* Styles */}
              <div className="mt-4">
                <h3 className="font-mono text-xs uppercase tracking-wide text-graphite-300">Style</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {artist.styles.map((s) => <Badge key={s} color="clay">{s}</Badge>)}
                </div>
              </div>

              {/* Techniques */}
              <div className="mt-4">
                <h3 className="font-mono text-xs uppercase tracking-wide text-graphite-300">Techniki</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {artist.techniques.map((t) => <Badge key={t} color="gold">{t}</Badge>)}
                </div>
              </div>
            </Reveal>

            {/* Portfolio gallery */}
            <Reveal delay={1}>
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl text-graphite-600 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-graphite-300" /> Portfolio
                  </h2>
                  {portfolioItems.length > 0 && (
                    <span className="text-xs text-graphite-300">{portfolioItems.length} prac</span>
                  )}
                </div>

                {portfolioItems.length > 0 ? (
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {portfolioItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setLightbox(item.imageUrl)}
                        className="group cursor-pointer text-left"
                      >
                        <div className="aspect-[4/5] overflow-hidden rounded-xl border border-graphite-400/10">
                          <SeoImage
                            src={item.imageUrl}
                            fallbackSrc="/abstract-painting-inspiration.webp"
                            alt={portfolioAlt(artist, item)}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="mt-3">
                          <h3 className="font-display text-base text-graphite-600 group-hover:text-graphite-700 transition-colors">{item.title}</h3>
                          <p className="text-xs text-graphite-300">
                            {item.technique} · {item.year} · {item.widthCm}×{item.heightCm} cm
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6">
                    <EmptyState
                      icon={<ImageIcon className="h-7 w-7" />}
                      title="Brak prac w portfolio"
                      description="Ten artysta nie dodał jeszcze prac do portfolio. Skontaktuj się bezpośrednio, aby zobaczyć przykłady realizacji."
                    />
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* ──────────────── Sidebar ──────────────── */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-4">
            {/* Pricing & timing */}
            <Reveal delay={2}>
              <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
                <h3 className="font-display text-lg text-graphite-600">Orientacyjne warunki</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-graphite-400/5 pb-3">
                    <span className="flex items-center gap-2 text-sm text-graphite-400">
                      <Wallet className="h-4 w-4 text-graphite-200" /> Zakres cenowy
                    </span>
                    <span className="text-sm font-medium text-graphite-600">
                      {formatCurrency(artist.priceRangeMin)} - {formatCurrency(artist.priceRangeMax)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-graphite-400/5 pb-3">
                    <span className="flex items-center gap-2 text-sm text-graphite-400">
                      <Clock className="h-4 w-4 text-graphite-200" /> Średni czas realizacji
                    </span>
                    <span className="text-sm font-medium text-graphite-600">~{artist.averageDeliveryDays} dni</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-graphite-400/5 pb-3">
                    <span className="flex items-center gap-2 text-sm text-graphite-400">
                      <Calendar className="h-4 w-4 text-graphite-200" /> Doświadczenie
                    </span>
                    <span className="text-sm font-medium text-graphite-600">{artist.yearsExperience} lat</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-graphite-400/5 pb-3">
                    <span className="flex items-center gap-2 text-sm text-graphite-400">
                      <FileText className="h-4 w-4 text-graphite-200" /> Ukończone projekty
                    </span>
                    <span className="text-sm font-medium text-graphite-600">{artist.stats.completedProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-graphite-400">
                      <Star className="h-4 w-4 text-graphite-200" /> Średnia ocena
                    </span>
                    <span className="text-sm font-medium text-graphite-600">
                      {artist.stats.averageRating} ({artist.stats.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Social links */}
            <Reveal delay={2}>
              <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
                <h3 className="font-display text-lg text-graphite-600">Kontakt i social media</h3>
                <div className="mt-4 space-y-3">
                  {artist.website && (
                    <a
                      href={`https://${artist.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-graphite-400 hover:text-graphite-600 transition-colors link-underline"
                    >
                      <Globe className="h-4 w-4 text-graphite-200" /> {artist.website}
                    </a>
                  )}
                  {artist.instagram && (
                    <a
                      href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-graphite-400 hover:text-graphite-600 transition-colors link-underline"
                    >
                      <Instagram className="h-4 w-4 text-graphite-200" /> {artist.instagram}
                    </a>
                  )}
                  {!artist.website && !artist.instagram && (
                    <p className="text-sm text-graphite-300">Artysta nie dodał linków do social mediów.</p>
                  )}
                </div>

                {artist.isVerified && (
                  <div className="mt-5 rounded-xl bg-gold-50 p-4">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-5 w-5 text-gold-500" />
                      <span className="text-sm font-medium text-gold-600">Zweryfikowany artysta</span>
                    </div>
                    <p className="mt-2 text-xs text-graphite-400">
                      Tożsamość i portfolio zostały zweryfikowane przez zespół Atelier.
                    </p>
                  </div>
                )}
              </div>
            </Reveal>

            {/* CTA card */}
            <Reveal delay={3}>
              <div className="rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-50 to-ivory-100 p-6">
                <Sparkles className="h-6 w-6 text-gold-500" />
                <h3 className="mt-3 font-display text-lg text-graphite-600">
                  {isSelf ? 'Zarządzaj profilem' : isClient ? 'Chcesz zlecić obraz?' : isGuest ? 'Zainteresowany współpracą?' : 'Zainteresowany zleceniem?'}
                </h3>
                <p className="mt-2 text-sm text-graphite-400">
                  {isSelf
                    ? 'Aktualizuj portfolio, bio i warunki, aby przyciągnąć więcej zleceń.'
                    : isClient
                    ? 'Zaproś tego artystę do swojego zlecenia.'
                    : isGuest
                    ? 'Zarejestruj się jako zlecający, aby wysłać zlecenie temu artyście.'
                    : 'Zobacz otwarte zlecenia w marketplace i złóż swoją ofertę.'}
                </p>
                <div className="mt-5 space-y-3">
                  {isSelf && (
                    <Link to="/dashboard/artist/profil"><Button variant="primary" className="w-full">Edytuj profil</Button></Link>
                  )}
                  {isClient && (
                    <Button variant="gold" className="w-full" onClick={() => setInviteModalOpen(true)}><Mail className="h-4 w-4" /> Zaproś do mojego zlecenia</Button>
                  )}
                  {isGuest && (
                    <Link to="/register?role=client"><Button variant="gold" className="w-full"><UserPlus className="h-4 w-4" /> Dołącz jako zlecający</Button></Link>
                  )}
                  {!isSelf && !isClient && !isGuest && (
                    <Link to="/zlecenia"><Button variant="gold" className="w-full"><FileText className="h-4 w-4" /> Zobacz dostępne zlecenia</Button></Link>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite-700/90 p-6 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <SeoImage src={lightbox} fallbackSrc="/abstract-painting-inspiration.webp" alt={lightboxAlt('Powiększona praca z portfolio artysty', artist.artistName)} className="max-h-[90vh] max-w-full rounded-xl shadow-2xl" />
          <button
            className="absolute top-6 right-6 rounded-full bg-ivory-50/10 p-2 text-ivory-100 hover:bg-ivory-50/20 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <span className="sr-only">Zamknij</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
      {/* Invite modal */}
      <Modal
        open={inviteModalOpen}
        onClose={() => { setInviteModalOpen(false); setSelectedCommissionId(null); setInviteMessage(''); }}
        title={`Zaproś ${artist.artistName} do zlecenia`}
      >
        <div className="space-y-4">
          {activeCommissions.length > 0 ? (
            <>
              <p className="text-sm text-graphite-400">Wybierz jedno ze swoich aktywnych zleceń, do którego chcesz zaprosić tego artystę.</p>
              <div className="space-y-2">
                {activeCommissions.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCommissionId(c.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                      selectedCommissionId === c.id
                        ? 'border-gold-400 bg-gold-50'
                        : 'border-graphite-400/10 bg-ivory-50 hover:border-graphite-400/20'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-graphite-600">{c.title}</p>
                      <p className="text-xs text-graphite-300">{c.style} · {formatCurrency(c.budgetMin)} - {formatCurrency(c.budgetMax)}</p>
                    </div>
                    {selectedCommissionId === c.id && <BadgeCheck className="h-5 w-5 text-gold-500" />}
                  </button>
                ))}
              </div>
              <div>
                <label className="label-elegant" htmlFor="invite-message">Wiadomość do artysty (opcjonalnie)</label>
                <textarea
                  id="invite-message"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={3}
                  placeholder="Napisz kilka słów o swoim zleceniu..."
                  className="input-elegant resize-none"
                />
              </div>
              <Button variant="primary" className="w-full" onClick={handleInvite} disabled={submitting || !selectedCommissionId}>
                <Send className="h-4 w-4" /> {submitting ? 'Wysyłanie...' : 'Wyślij zaproszenie'}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-graphite-400">Nie masz obecnie aktywnych zleceń, do których możesz zaprosić artystę.</p>
              <Link to="/dashboard/client/zlecenia/nowe" onClick={() => setInviteModalOpen(false)}>
                <Button variant="gold" className="w-full">
                  <Sparkles className="h-4 w-4" /> Opublikuj nowe zlecenie
                </Button>
              </Link>
            </>
          )}
        </div>
      </Modal>

      <InternalLinksGrid
        label="Powiązane strony"
        title="Zobacz też"
        links={[
          { href: '/zlecenia', label: 'Otwarte zlecenia', description: 'Przeglądaj zlecenia na obrazy i znajdź inspiracje.', icon: FileText },
          { href: '/obrazy-na-zamowienie', label: 'Obrazy na zamówienie', description: 'Style, wnętrza i proces zlecania obrazów.', icon: ImageIcon },
          { href: '/blog/kategoria/poradniki-dla-artystow', label: 'Poradniki dla artystów', description: 'Portfolio, wycena prac i budowanie marki artysty.', icon: BookOpen },
        ]}
      />
    </div>
  );
}
