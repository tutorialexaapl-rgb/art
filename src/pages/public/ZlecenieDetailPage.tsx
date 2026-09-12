import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Eye, Lock, FileText, Send, Shield,
  Ruler, Palette, Wallet, Calendar, MapPin, Check, X, LogIn, UserPlus,
  Sparkles, Users, AlertCircle, ChevronDown, ChevronUp, Home as HomeIcon,
  RotateCcw, CheckCircle2, Info,
} from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CommissionComments } from '@/components/features/CommissionComments';
import { OfferForm, type OfferFormData } from '@/components/features/OfferForm';
import { Textarea } from '@/components/ui/Input';
import { ErrorState, LoadingSkeleton } from '@/components/ui/States';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useCommissionDetails } from '@/hooks/useCommissionDetails';
import { commentsService } from '@/services/commentsService';
import { offersService } from '@/services/offersService';
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils';
import type { CommissionCommentAttachment } from '@/types';
import { ReportButton } from '@/components/features/ReportButton';
import { useSeo } from '@/hooks/useSeo';
import { generateCommissionMetadata, getStaticMetadata } from '@/lib/seo';
import { SeoImage } from '@/components/ui/SeoImage';
import { commissionInspirationAlt } from '@/lib/seo/alt-text';

const INDEXABLE_STATUSES = ['published', 'offers_open', 'in_progress', 'completed'];

export function ZlecenieDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { notify } = useToast();
  const { commission, comments, offers, loading, error, refetch } = useCommissionDetails(slug ?? '');
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [showPublicPreview, setShowPublicPreview] = useState(false);
  const [comment, setComment] = useState('');
  const [withdrawTarget, setWithdrawTarget] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);

  const seoData = useMemo(() => {
    if (!commission) {
      return { ...getStaticMetadata('/zlecenia'), robots: 'noindex, nofollow' };
    }
    const indexable = INDEXABLE_STATUSES.includes(commission.status);
    if (!indexable) {
      return { ...generateCommissionMetadata(commission), robots: 'noindex, nofollow' };
    }
    return generateCommissionMetadata(commission);
  }, [commission]);
  useSeo(seoData);

  if (loading) {
    return (
      <div className="py-12 lg:py-16">
        <div className="container-content">
          <LoadingSkeleton className="h-4 w-32" />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <LoadingSkeleton className="h-8 w-3/4" />
              <LoadingSkeleton className="h-4 w-full" />
              <LoadingSkeleton className="aspect-[16/9] w-full rounded-2xl" />
              <LoadingSkeleton className="h-32 w-full rounded-2xl" />
            </div>
            <div className="space-y-4">
              <LoadingSkeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-30 text-center">
        <ErrorState title="Nie udało się pobrać zlecenia" description={error} onRetry={refetch} />
      </div>
    );
  }

  if (!commission) {
    return (
      <div className="py-30 text-center">
        <h1 className="font-display text-2xl text-graphite-600">Zlecenie nie zostało znalezione</h1>
        <Link to="/zlecenia" className="mt-4 inline-flex"><Button variant="secondary">← Wróć do zleceń</Button></Link>
      </div>
    );
  }

  const isGuest = !user;
  const isArtist = user?.role === 'artist' && user?.status !== 'suspended';
  const isOwner = user?.id === commission.clientId;
  const isAdmin = user?.role === 'admin';
  const canSeeFullDetails = !isGuest;
  const canSeeComments = true;
  const canComment = isArtist || isOwner || isAdmin;
  const canSeeOffers = isOwner || isAdmin;
  const canMakeOffer = isArtist && !isOwner && (commission.status === 'published' || commission.status === 'offers_open');
  const canCloseCommission = isOwner && (commission.status === 'offers_open' || commission.status === 'artist_selected' || commission.status === 'in_progress');

  const commentsList = comments;
  const offersList = offers;

  const myOffer = isArtist ? offers.find((o) => o.artistId === user?.id) : undefined;
  const hasActiveOffer = !!myOffer && myOffer.status !== 'withdrawn';
  const hasWithdrawnOffer = !!myOffer && myOffer.status === 'withdrawn';
  const withdrawOfferObj = withdrawTarget ? offers.find((o) => o.id === withdrawTarget) : null;

  const handleWithdrawConfirm = async () => {
    if (!withdrawTarget) return;
    setWithdrawing(true);
    try {
      await offersService.updateStatus(withdrawTarget, 'withdrawn');
      setWithdrawTarget(null);
      refetch();
      notify('info', 'Oferta wycofana. Możesz ponownie złożyć ofertę, jeśli zlecenie jest nadal otwarte.');
    } catch (err) {
      console.error('Withdraw failed:', err);
      notify('error', 'Nie udało się wycofać oferty. Spróbuj ponownie.');
    } finally {
      setWithdrawing(false);
    }
  };

  const handleOfferSubmit = async (data: OfferFormData) => {
    if (!user) return;
    try {
      await offersService.createOffer({
        commissionId: commission.id,
        artistId: user.id,
        artistName: user.displayName,
        artistAvatarUrl: user.avatarUrl,
        message: data.message,
        price: data.price,
        estimatedDays: data.estimatedDays,
        includesMaterials: data.includesMaterials,
        includesShipping: data.includesShipping,
        includesFrame: data.includesFrame,
        depositPercent: data.depositPercent,
        portfolioRefs: [],
      });
      setOfferSubmitted(true);
      setShowOfferForm(false);
      refetch();
    } catch (err) {
      console.error('Offer submission failed:', err);
    }
  };

  const handleCommentSubmit = async (_commissionId: string, body: string, _attachments: CommissionCommentAttachment[], _commentType: 'question' | 'suggestion' | 'general') => {
    if (!user) return;
    try {
      await commentsService.addCommissionComment({
        commissionId: commission.id,
        authorId: user.id,
        authorName: user.displayName,
        authorRole: user.role,
        authorAvatarUrl: user.avatarUrl,
        body,
        isPublic: true,
      });
      setComment('');
      refetch();
    } catch (err) {
      console.error('Comment submission failed:', err);
    }
  };

  const handleCommentDelete = (_commentId: string) => {};
  const handleCommentReport = (_commentId: string, _reason: string) => {};
  const handleCommentHide = (_commentId: string) => {};

  const detailItems = [
    { label: 'Wymiary', value: `${commission.widthCm}×${commission.heightCm} cm`, icon: Ruler },
    { label: 'Styl', value: commission.style, icon: Palette },
    { label: 'Budżet', value: `${formatCurrency(commission.budgetMin)} - ${formatCurrency(commission.budgetMax)}`, icon: Wallet },
    { label: 'Termin', value: formatDate(commission.deadline), icon: Calendar },
    { label: 'Orientacja', value: commission.orientation === 'landscape' ? 'Pozioma' : commission.orientation === 'portrait' ? 'Pionowa' : 'Kwadratowa', icon: Ruler },
    { label: 'Pomieszczenie', value: commission.roomType, icon: MapPin },
    ...(commission.medium ? [{ label: 'Technika', value: commission.medium, icon: Palette }] : []),
    ...(commission.mood ? [{ label: 'Nastrój', value: commission.mood, icon: Sparkles }] : []),
    ...(commission.location ? [{ label: 'Lokalizacja', value: commission.location, icon: MapPin }] : []),
  ];

  return (
    <div className="py-12 lg:py-16">
      <div className="container-content">
        {/* Breadcrumbs */}
        <nav className="mt-4 flex items-center gap-2 text-xs text-graphite-300">
          <Link to="/" className="hover:text-graphite-500 transition-colors">Strona główna</Link>
          <span className="text-graphite-200">/</span>
          <Link to="/zlecenia" className="hover:text-graphite-500 transition-colors">Zlecenia</Link>
          <span className="text-graphite-200">/</span>
          <span className="text-graphite-400 truncate max-w-[200px]">{commission.title}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* ──────────────── Main content ──────────────── */}
          <div>
            {/* Header */}
            <Reveal>
              <div className="flex items-center gap-3">
                <StatusBadge status={commission.status} type="commission" />
                <span className="flex items-center gap-1 text-xs text-graphite-300"><Eye className="h-3.5 w-3.5" /> {commission.views} wyświetleń</span>
                <span className="text-xs text-graphite-300">{timeAgo(commission.createdAt)}</span>
              </div>
              <h1 className="mt-4 font-display text-display text-graphite-600 text-balance">{commission.title}</h1>
              <p className="mt-4 text-graphite-400 text-pretty">{commission.publicSummary}</p>
              {user && !isOwner && (
                <div className="mt-3">
                  <ReportButton targetType="commission" targetId={commission.id} variant="text" />
                </div>
              )}
            </Reveal>

            {/* Inspiration gallery - first image for guest, full gallery for logged-in */}
            <Reveal delay={1}>
              <div className="mt-8">
                {isGuest ? (
                  <div className="grid grid-cols-3 gap-2 overflow-hidden rounded-2xl">
                    {commission.inspirationImages.slice(0, 3).map((img, i) => (
                      <div key={img} className={`overflow-hidden ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-[4/3]'}`}>
                        <SeoImage src={img} fallbackSrc="/abstract-painting-inspiration.webp" alt={commissionInspirationAlt(commission, i)} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                    ))}
                    {commission.inspirationImages.length > 3 && (
                      <div className="relative col-span-3 flex items-center justify-center rounded-xl bg-graphite-700/80 py-3 text-center">
                        <Lock className="h-4 w-4 text-ivory-200" />
                        <span className="ml-2 text-xs text-ivory-200">+{commission.inspirationImages.length - 3} więcej zdjęć po zalogowaniu</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 overflow-hidden rounded-2xl">
                    {commission.inspirationImages.map((img, i) => (
                      <div key={img} className={`overflow-hidden ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-[4/3]'}`}>
                        <SeoImage src={img} fallbackSrc="/abstract-painting-inspiration.webp" alt={commissionInspirationAlt(commission, i)} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>

            {/* Full description - gated for guest */}
            <Reveal delay={2}>
              <div className="mt-8">
                <h2 className="font-display text-xl text-graphite-600">Opis zlecenia</h2>
                {canSeeFullDetails ? (
                  <>
                    <p className="mt-3 text-graphite-500 text-pretty leading-relaxed">{commission.privateDescription}</p>
                    <div className="mt-6">
                      <h3 className="font-mono text-xs uppercase tracking-wide text-graphite-300">Preferowane kolory</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {commission.preferredColors.map((c) => <Badge key={c} color="clay">{c}</Badge>)}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-mono text-xs uppercase tracking-wide text-graphite-300">Kolory do unikania</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {commission.colorsToAvoid.map((c) => <Badge key={c} color="neutral">{c}</Badge>)}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-3 rounded-xl border border-graphite-400/10 bg-ivory-200 p-6 text-center">
                    <Lock className="mx-auto h-6 w-6 text-graphite-300" />
                    <p className="mt-3 text-sm text-graphite-400">Pełny opis zlecenia jest widoczny tylko dla zarejestrowanych artystów.</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                      <Link to="/login"><Button variant="primary" size="sm"><LogIn className="h-4 w-4" /> Zaloguj się</Button></Link>
                      <Link to="/register"><Button variant="secondary" size="sm"><UserPlus className="h-4 w-4" /> Dołącz jako artysta</Button></Link>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Detail grid - visible to all (basic params) */}
            <Reveal delay={3}>
              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-graphite-400/10 sm:grid-cols-3">
                {detailItems.map((item) => (
                  <div key={item.label} className="bg-ivory-50 p-5">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-graphite-200" />
                      <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">{item.label}</p>
                    </div>
                    <p className="mt-1 text-sm text-graphite-600">{item.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Tags */}
            <Reveal delay={3}>
              <div className="mt-6 flex flex-wrap gap-2">
                {commission.tags.map((t) => <Badge key={t} color="neutral">{t}</Badge>)}
              </div>
            </Reveal>

            {/* Kolorystyka (public) */}
            {(commission.preferredColors.length > 0 || commission.colorsToAvoid.length > 0) && (
              <Reveal delay={3}>
                <div className="mt-6 space-y-4">
                  {commission.preferredColors.length > 0 && (
                    <div>
                      <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">Preferowane kolory</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {commission.preferredColors.map((color) => <Badge key={color} color="success">{color}</Badge>)}
                      </div>
                    </div>
                  )}
                  {commission.colorsToAvoid.length > 0 && (
                    <div>
                      <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">Kolory do uniknięcia</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {commission.colorsToAvoid.map((color) => <Badge key={color} color="error">{color}</Badge>)}
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            )}

            {/* ──────────────── Guest CTA banner ──────────────── */}
            {isGuest && (
              <Reveal delay={4}>
                <div className="mt-8 rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-50 to-ivory-100 p-8 text-center">
                  <Sparkles className="mx-auto h-8 w-8 text-gold-500" />
                  <h3 className="mt-4 font-display text-xl text-graphite-600">Jesteś artystą malarzem?</h3>
                  <p className="mt-2 text-sm text-graphite-400 max-w-md mx-auto">
                    Zaloguj się jako artysta, aby zobaczyć pełny opis, wszystkie inspiracje i odpowiedzieć na to zlecenie.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link to="/login"><Button variant="primary"><LogIn className="h-4 w-4" /> Zaloguj się jako artysta</Button></Link>
                    <Link to="/register"><Button variant="gold"><UserPlus className="h-4 w-4" /> Dołącz jako artysta</Button></Link>
                  </div>
                </div>
              </Reveal>
            )}

            {isGuest && (
              <Reveal delay={4}>
                <div className="mt-4 rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 text-center">
                  <h3 className="font-display text-lg text-graphite-600">Chcesz opublikować podobne zlecenie?</h3>
                  <p className="mt-2 text-sm text-graphite-400">Zarejestruj się jako zlecający, aby dodać własne zlecenie.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    <Link to="/register"><Button variant="secondary"><UserPlus className="h-4 w-4" /> Zarejestruj się jako zlecający</Button></Link>
                  </div>
                </div>
              </Reveal>
            )}

            {/* ──────────────── Comments section ──────────────── */}
            <Reveal delay={4}>
              <div className="mt-10 border-t border-graphite-400/10 pt-8">
                <CommissionComments
                  commissionId={commission.id}
                  comments={commentsList}
                  currentUser={user ? { id: user.id, displayName: user.displayName, avatarUrl: user.avatarUrl, role: user.role, status: user.status } : null}
                  onAddComment={handleCommentSubmit}
                  onDeleteComment={handleCommentDelete}
                  onReportComment={handleCommentReport}
                  onHideComment={handleCommentHide}
                />
              </div>
            </Reveal>
          </div>

          {/* ──────────────── Sidebar ──────────────── */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-4">
            {/* Owner / Admin view: offers + close commission */}
            {canSeeOffers && (
              <Reveal delay={2}>
                <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg text-graphite-600 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-graphite-300" /> Oferty
                    </h3>
                    <Badge color="gold">{offersList.length}</Badge>
                  </div>

                  {offers.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {(showAllOffers ? offersList : offersList.slice(0, 3)).map((offer) => (
                        <div key={offer.id} className="rounded-xl border border-graphite-400/10 p-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={offer.artistName} src={offer.artistAvatarUrl} size="xs" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-graphite-600 truncate">{offer.artistName}</p>
                              <p className="text-xs text-graphite-300">{formatCurrency(offer.price)} · {offer.estimatedDays} dni</p>
                            </div>
                            <StatusBadge status={offer.status} type="offer" />
                          </div>
                        </div>
                      ))}
                      {offersList.length > 3 && (
                        <button
                          onClick={() => setShowAllOffers((s) => !s)}
                          className="flex w-full items-center justify-center gap-1 text-xs text-graphite-400 hover:text-graphite-600 transition-colors pt-1"
                        >
                          {showAllOffers ? <><ChevronUp className="h-3.5 w-3.5" /> Pokaż mniej</> : <><ChevronDown className="h-3.5 w-3.5" /> Pokaż wszystkie ({offersList.length})</>}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-graphite-300">Brak ofert na to zlecenie.</p>
                  )}

                  {isOwner && (
                    <div className="mt-5 space-y-3 border-t border-graphite-400/10 pt-4">
                      {canCloseCommission && (
                        <Button variant="ghost" className="w-full" onClick={() => {}}>
                          <X className="h-4 w-4" /> Zamknij zlecenie
                        </Button>
                      )}
                      <Button variant="secondary" className="w-full" onClick={() => setShowPublicPreview((s) => !s)}>
                        <Eye className="h-4 w-4" /> {showPublicPreview ? 'Ukryj podgląd publiczny' : 'Pokaż podgląd publiczny'}
                      </Button>
                    </div>
                  )}

                  {isOwner && showPublicPreview && (
                    <div className="mt-4 rounded-xl border border-graphite-400/10 bg-ivory-200 p-4">
                      <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">Podgląd publiczny</p>
                      <p className="mt-2 text-xs text-graphite-400">Goście widzą: tytuł, podsumowanie, podstawowe parametry, pierwsze zdjęcie.</p>
                      <p className="mt-1 text-xs text-graphite-400">Nie widzą: pełnego opisu, galerii, komentarzy, ofert, danych kontaktowych.</p>
                    </div>
                  )}
                </div>
              </Reveal>
            )}

            {/* Offers visibility note for non-owner logged-in */}
            {!canSeeOffers && !isGuest && (
              <Reveal delay={2}>
                <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg text-graphite-600 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-graphite-300" /> Oferty
                    </h3>
                    <Shield className="h-4 w-4 text-graphite-200" />
                  </div>
                  <p className="mt-3 text-xs text-graphite-400">
                    Oferty są widoczne tylko dla właściciela zlecenia, danego artysty i admina.
                  </p>
                </div>
              </Reveal>
            )}

            {/* Guest: offers hidden notice */}
            {isGuest && (
              <Reveal delay={2}>
                <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg text-graphite-600 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-graphite-300" /> Oferty
                    </h3>
                    <Shield className="h-4 w-4 text-graphite-200" />
                  </div>
                  <p className="mt-3 text-xs text-graphite-400">
                    Oferty są widoczne tylko dla właściciela zlecenia, danego artysty i admina.
                  </p>
                </div>
              </Reveal>
            )}

            {/* Artist's existing active offer */}
            {isArtist && hasActiveOffer && myOffer && (
              <Reveal delay={3}>
                <div className="rounded-2xl border border-success/20 bg-success/5 p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <h3 className="font-display text-lg text-graphite-600">Twoja oferta została wysłana</h3>
                  </div>
                  <div className="mt-3 rounded-xl border border-graphite-400/10 bg-ivory-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-graphite-600">{formatCurrency(myOffer.price)}</span>
                      <StatusBadge status={myOffer.status} type="offer" />
                    </div>
                    <p className="mt-1 text-xs text-graphite-300">Termin: {myOffer.estimatedDays} dni · Zaliczka: {myOffer.depositPercent}%</p>
                  </div>
                  <p className="mt-3 text-xs text-graphite-400">Zlecający otrzymał Twoją ofertę. Otrzymasz powiadomienie o odpowiedzi.</p>
                  {myOffer.status !== 'accepted' && (
                    <Button variant="ghost" className="mt-4 w-full" onClick={() => setWithdrawTarget(myOffer.id)}>
                      <RotateCcw className="h-4 w-4" /> Wycofaj ofertę
                    </Button>
                  )}
                </div>
              </Reveal>
            )}

            {/* Artist's withdrawn offer - can re-apply */}
            {isArtist && hasWithdrawnOffer && myOffer && (
              <Reveal delay={3}>
                <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-graphite-300" />
                    <h3 className="font-display text-lg text-graphite-600">Oferta wycofana</h3>
                  </div>
                  <p className="mt-2 text-sm text-graphite-400">Wycofałeś swoją ofertę z tego zlecenia.</p>
                  {canMakeOffer ? (
                    showOfferForm ? (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-medium text-graphite-500">Złóż nową ofertę</p>
                          <button onClick={() => setShowOfferForm(false)} className="text-graphite-300 hover:text-graphite-500 transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <OfferForm
                          commissionBudgetMin={commission.budgetMin}
                          commissionBudgetMax={commission.budgetMax}
                          onSubmit={handleOfferSubmit}
                        />
                      </div>
                    ) : (
                      <Button variant="gold" className="mt-4 w-full" onClick={() => setShowOfferForm(true)}>
                        <Send className="h-4 w-4" /> Złóż nową ofertę
                      </Button>
                    )
                  ) : (
                    <p className="mt-2 text-xs text-graphite-300">Zlecenie nie przyjmuje już nowych ofert.</p>
                  )}
                </div>
              </Reveal>
            )}

            {/* Offer form for artist who hasn't offered yet */}
            {canMakeOffer && !hasActiveOffer && !hasWithdrawnOffer && (
              <Reveal delay={3}>
                {offerSubmitted ? (
                  <div className="rounded-2xl border border-success/20 bg-success/5 p-6 text-center">
                    <Check className="mx-auto h-8 w-8 text-success-dark" />
                    <h3 className="mt-3 font-display text-lg text-graphite-600">Oferta wysłana!</h3>
                    <p className="mt-2 text-sm text-graphite-400">Zlecający otrzymał Twoją ofertę. Otrzymasz powiadomienie o odpowiedzi.</p>
                    <Button variant="ghost" className="mt-4 w-full" onClick={() => setOfferSubmitted(false)}>
                      Wyślij kolejną ofertę
                    </Button>
                  </div>
                ) : showOfferForm ? (
                  <div className="rounded-2xl border border-gold-400/20 bg-gold-50 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg text-graphite-600">Wyślij ofertę</h3>
                      <button onClick={() => setShowOfferForm(false)} className="text-graphite-300 hover:text-graphite-500 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-graphite-400">Wypełnij formularz formalnej oferty. Zlecający zobaczy cenę, termin i warunki.</p>
                    <div className="mt-5">
                      <OfferForm
                        commissionBudgetMin={commission.budgetMin}
                        commissionBudgetMax={commission.budgetMax}
                        onSubmit={handleOfferSubmit}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gold-400/20 bg-gold-50 p-6">
                    <h3 className="font-display text-lg text-graphite-600">Wyślij ofertę</h3>
                    <p className="mt-2 text-sm text-graphite-400">Jesteś zweryfikowanym artystą. Możesz wysłać formalną ofertę na to zlecenie.</p>
                    <Button variant="gold" className="w-full mt-4" onClick={() => setShowOfferForm(true)}>
                      <Send className="h-4 w-4" /> Składam ofertę
                    </Button>
                  </div>
                )}
              </Reveal>
            )}

            {/* Client info card - visible to logged-in non-guests, NO contact details publicly */}
            {!isGuest && commission.clientName && (
              <Reveal delay={3}>
                <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
                  <h3 className="font-display text-lg text-graphite-600 flex items-center gap-2">
                    <Users className="h-5 w-5 text-graphite-300" /> Zlecający
                  </h3>
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar name={commission.clientName} size="md" />
                    <div>
                      <p className="text-sm font-medium text-graphite-600">{commission.clientName}</p>
                      {commission.location && <p className="text-xs text-graphite-300 flex items-center gap-1"><MapPin className="h-3 w-3" /> {commission.location}</p>}
                    </div>
                  </div>
                  {!isOwner && (
                    <p className="mt-4 rounded-lg bg-ivory-200 p-3 text-xs text-graphite-300 flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5" /> Dane kontaktowe zlecającego nie są widoczne publicznie.
                    </p>
                  )}
                </div>
              </Reveal>
            )}

            {/* Guest: client info hidden */}
            {isGuest && (
              <Reveal delay={3}>
                <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
                  <h3 className="font-display text-lg text-graphite-600 flex items-center gap-2">
                    <Users className="h-5 w-5 text-graphite-300" /> Zlecający
                  </h3>
                  <div className="mt-4 rounded-lg bg-ivory-200 p-4 text-center">
                    <Shield className="mx-auto h-5 w-5 text-graphite-300" />
                    <p className="mt-2 text-xs text-graphite-400">Dane zlecającego są widoczne po zalogowaniu.</p>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>

        {/* Withdraw confirmation */}
        <ConfirmDialog
          open={!!withdrawTarget}
          onClose={() => setWithdrawTarget(null)}
          onConfirm={handleWithdrawConfirm}
          title="Wycofać ofertę?"
          description={withdrawOfferObj ? `Twoja oferta za ${formatCurrency(withdrawOfferObj.price)} zostanie wycofana z tego zlecenia. Będziesz mógł ponownie złożyć ofertę, jeśli zlecenie nadal będzie otwarte.` : ''}
          confirmLabel="Wycofaj ofertę"
          danger
          loading={withdrawing}
        />

        <InternalLinksGrid
          label="Powiązane strony"
          title="Zobacz też"
          links={[
            { href: '/artysci', label: 'Artyści malarze', description: 'Poznaj zweryfikowanych artystów z portfolio i specjalizacjami.', icon: Users },
            { href: '/obrazy-na-zamowienie', label: 'Obrazy na zamówienie', description: 'Style, wnętrza, proces zlecania i FAQ.', icon: FileText },
            { href: '/zlec-obraz', label: 'Jak zlecić obraz', description: 'Przewodnik krok po kroku - od pomysłu do realizacji.', icon: Send },
            { href: '/blog/kategoria/jak-zamowic-obraz', label: 'Poradniki zlecania', description: 'Jak opisać zlecenie, wybrać artystę i ustalić budżet.', icon: Palette },
          ]}
        />
      </div>
    </div>
  );
}
