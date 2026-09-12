import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Sparkles, Shield, Eye, MessageCircle, FileText,
  Ruler, Palette, Wallet, Calendar, MapPin, Lock, CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CommissionCard } from '@/components/features/CommissionCard';
import { ErrorState, LoadingSkeleton } from '@/components/ui/States';
import { useClientMarketplaceDetail } from '@/hooks/useClientMarketplace';
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils';

export function ClientMarketplaceDetailPage() {
  const { slug } = useParams();
  const { commission, isOwner, similar, loading, error, refetch } = useClientMarketplaceDetail(slug);

  if (loading) {
    return (
      <div className="space-y-8">
        <LoadingSkeleton className="h-4 w-32" />
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
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
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <ErrorState title="Nie udało się pobrać zlecenia" description={error} onRetry={refetch} />
      </div>
    );
  }

  if (!commission) {
    return (
      <div className="space-y-6">
        <Link to="/dashboard/client/marketplace" className="inline-flex items-center gap-2 text-sm text-graphite-400 hover:text-graphite-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Wróć do marketplace
        </Link>
        <div className="py-20 text-center">
          <h1 className="font-display text-2xl text-graphite-600">Zlecenie nie zostało znalezione</h1>
          <p className="mt-2 text-sm text-graphite-400">To zlecenie może nie być już opublikowane lub zostało usunięte.</p>
          <Link to="/dashboard/client/marketplace" className="mt-4 inline-flex">
            <Button variant="secondary"><ArrowLeft className="h-4 w-4" /> Wróć do marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const detailItems = [
    { label: 'Wymiary', value: `${commission.widthCm}×${commission.heightCm} cm`, icon: Ruler },
    { label: 'Styl', value: commission.style, icon: Palette },
    { label: 'Budżet', value: `${formatCurrency(commission.budgetMin)} - ${formatCurrency(commission.budgetMax)}`, icon: Wallet },
    { label: 'Termin', value: formatDate(commission.deadline), icon: Calendar },
    { label: 'Orientacja', value: commission.orientation === 'landscape' ? 'Pozioma' : commission.orientation === 'portrait' ? 'Pionowa' : 'Kwadratowa', icon: Ruler },
    { label: 'Pomieszczenie', value: commission.roomType, icon: MapPin },
  ];

  return (
    <div className="space-y-8">
      <Link to="/dashboard/client/marketplace" className="inline-flex items-center gap-2 text-sm text-graphite-400 hover:text-graphite-600 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Wróć do marketplace
      </Link>

      {isOwner ? (
        <div className="flex items-center gap-3 rounded-xl border border-success/20 bg-success/5 px-5 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
          <p className="text-sm text-graphite-600">
            To jest Twoje zlecenie. Widzisz pełny widok - opis prywatny, wszystkie zdjęcia i dane.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-graphite-400/10 bg-ivory-100 px-5 py-3">
          <Shield className="h-5 w-5 shrink-0 text-graphite-300" />
          <p className="text-sm text-graphite-400">
            To jest zlecenie innego użytkownika. Widzisz tylko informacje publiczne - opis prywatny, oferty i dane kontaktowe nie są widoczne.
          </p>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* Main content */}
        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3">
              <StatusBadge status={commission.status} type="commission" />
              <span className="flex items-center gap-1 text-xs text-graphite-300"><Eye className="h-3.5 w-3.5" /> {commission.views} wyświetleń</span>
              <span className="text-xs text-graphite-300">{timeAgo(commission.createdAt)}</span>
            </div>
            <h1 className="mt-4 font-display text-display text-graphite-600 text-balance">{commission.title}</h1>
            <p className="mt-4 text-graphite-400 text-pretty">{commission.publicSummary}</p>
          </div>

          {/* Inspiration gallery - full for owner, limited for others */}
          {commission.inspirationImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 overflow-hidden rounded-2xl">
              {(isOwner ? commission.inspirationImages : commission.inspirationImages.slice(0, 4)).map((img, i) => (
                <div key={img} className={`overflow-hidden ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-[4/3]'}`}>
                  <img src={img} alt={`Inspiracja ${i + 1} dla zlecenia`} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          )}

          {/* Interior images - owner only */}
          {isOwner && commission.interiorImages.length > 0 && (
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wide text-graphite-300">Zdjęcia wnętrza</h3>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {commission.interiorImages.map((img, i) => (
                  <div key={img} className="overflow-hidden rounded-xl aspect-[4/3]">
                    <img src={img} alt={`Wnętrze ${i + 1} jako referencja`} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description - full for owner, locked for others */}
          {isOwner ? (
            <div>
              <h2 className="font-display text-xl text-graphite-600">Opis zlecenia</h2>
              <p className="mt-3 text-graphite-500 text-pretty leading-relaxed">{commission.privateDescription || 'Brak prywatnego opisu.'}</p>
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
            </div>
          ) : (
            <div className="rounded-xl border border-graphite-400/10 bg-ivory-100 p-6 text-center">
              <Lock className="mx-auto h-5 w-5 text-graphite-300" />
              <p className="mt-2 text-sm text-graphite-400">Pełny opis zlecenia jest prywatny - widoczny tylko dla autora i artystów zaproszonych do współpracy.</p>
            </div>
          )}

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-graphite-400/10 sm:grid-cols-3">
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

          {/* Colors */}
          {commission.preferredColors.length > 0 && (
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wide text-graphite-300">Preferowane kolory</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {commission.preferredColors.map((c) => <Badge key={c} color="clay">{c}</Badge>)}
              </div>
            </div>
          )}

          {/* Tags */}
          {commission.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {commission.tags.map((t) => <Badge key={t} color="neutral">{t}</Badge>)}
            </div>
          )}

          {/* Similar commissions */}
          {similar.length > 0 && (
            <div className="border-t border-graphite-400/10 pt-8">
              <h2 className="font-display text-xl text-graphite-600">Podobne zlecenia</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {similar.map((c) => (
                  <CommissionCard key={c.id} commission={c} isPublicPreview to={`/dashboard/client/marketplace/${c.slug}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-28 lg:self-start space-y-4">
          {isOwner ? (
            <>
              {/* Owner actions */}
              <div className="rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-50 to-ivory-100 p-6">
                <h3 className="font-display text-lg text-graphite-600">Twoje zlecenie</h3>
                <p className="mt-2 text-sm text-graphite-400">
                  Zarządzaj tym zleceniem w panelu zleceń, gdzie znajdziesz oferty, komentarze i opcje edycji.
                </p>
                <Link to={`/dashboard/client/zlecenia/${commission.slug}`} className="mt-5 block">
                  <Button variant="gold" className="w-full">
                    <FileText className="h-4 w-4" /> Otwórz w panelu zleceń
                  </Button>
                </Link>
                <Link to={`/dashboard/client/zlecenia/${commission.id}/edytuj`} className="mt-3 block">
                  <Button variant="secondary" className="w-full">
                    Edytuj zlecenie
                  </Button>
                </Link>
              </div>

              {/* Owner: full offers + comments overview */}
              <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg text-graphite-600 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-graphite-300" /> Oferty
                  </h3>
                  <Badge color="gold">{commission.offersCount}</Badge>
                </div>
                <p className="mt-3 text-xs text-graphite-400">
                  {commission.offersCount > 0
                    ? `Masz ${commission.offersCount} ${commission.offersCount === 1 ? 'ofertę' : 'ofert'} na to zlecenie.`
                    : 'Brak ofert na to zlecenie.'}
                </p>
                <Link to={`/dashboard/client/zlecenia/${commission.slug}`} className="mt-3 block">
                  <Button variant="ghost" className="w-full">Zobacz oferty</Button>
                </Link>
              </div>

              <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg text-graphite-600 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-graphite-300" /> Komentarze
                  </h3>
                  <Badge color="neutral">{commission.commentsCount}</Badge>
                </div>
                <p className="mt-3 text-xs text-graphite-400">
                  {commission.commentsCount > 0
                    ? `${commission.commentsCount} ${commission.commentsCount === 1 ? 'odpowiedź' : 'odpowiedzi'} od artystów.`
                    : 'Brak odpowiedzi od artystów.'}
                </p>
                <Link to={`/dashboard/client/zlecenia/${commission.slug}`} className="mt-3 block">
                  <Button variant="ghost" className="w-full">Zobacz komentarze</Button>
                </Link>
              </div>

              {/* Owner: own contact data visible */}
              {commission.clientName && (
                <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
                  <h3 className="font-display text-lg text-graphite-600 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-graphite-300" /> Dane zlecającego
                  </h3>
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar name={commission.clientName} size="md" />
                    <div>
                      <p className="text-sm font-medium text-graphite-600">{commission.clientName}</p>
                      {commission.location && <p className="text-xs text-graphite-300 flex items-center gap-1"><MapPin className="h-3 w-3" /> {commission.location}</p>}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Non-owner: CTA card */}
              <div className="rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-50 to-ivory-100 p-6">
                <Sparkles className="h-6 w-6 text-gold-500" />
                <h3 className="mt-3 font-display text-lg text-graphite-600">Zainspiruj się tym briefem</h3>
                <p className="mt-2 text-sm text-graphite-400">
                  Podoba Ci się to zlecenie? Opublikuj podobne, dopasowane do swoich potrzeb i otrzymaj oferty od artystów.
                </p>
                <Link to="/dashboard/client/zlecenia/nowe" className="mt-5 block">
                  <Button variant="gold" className="w-full">
                    <Sparkles className="h-4 w-4" /> Opublikuj podobne zlecenie
                  </Button>
                </Link>
                <Link to="/dashboard/client/marketplace" className="mt-3 block">
                  <Button variant="secondary" className="w-full">
                    <ArrowLeft className="h-4 w-4" /> Wróć do marketplace
                  </Button>
                </Link>
              </div>

              {/* Hidden info cards */}
              <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg text-graphite-600 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-graphite-300" /> Oferty
                  </h3>
                  <Shield className="h-4 w-4 text-graphite-200" />
                </div>
                <p className="mt-3 text-xs text-graphite-400">
                  Oferty artystów są widoczne tylko dla właściciela zlecenia i administratora.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-graphite-300">
                  <FileText className="h-3.5 w-3.5" /> {commission.offersCount} ofert
                </div>
              </div>

              <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg text-graphite-600 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-graphite-300" /> Komentarze
                  </h3>
                  <Shield className="h-4 w-4 text-graphite-200" />
                </div>
                <p className="mt-3 text-xs text-graphite-400">
                  Komentarze są widoczne tylko dla właściciela zlecenia, zatwierdzonych artystów i administratora.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-graphite-300">
                  <MessageCircle className="h-3.5 w-3.5" /> {commission.commentsCount} odpowiedzi artystów
                </div>
              </div>

              {/* Hidden contact data */}
              <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
                <h3 className="font-display text-lg text-graphite-600 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-graphite-300" /> Dane zlecającego
                </h3>
                <div className="mt-4 rounded-lg bg-ivory-200 p-4 text-center">
                  <Lock className="mx-auto h-5 w-5 text-graphite-300" />
                  <p className="mt-2 text-xs text-graphite-400">Dane kontaktowe autora zlecenia nie są widoczne dla innych zlecających.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
