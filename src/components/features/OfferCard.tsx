import {
  Clock, Wallet, Package, Frame, MessageSquare, Check, X, ArrowRight,
  Eye, Star, RotateCcw, Image as ImageIcon, MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Offer, OfferStatus, ArtistProfile } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { ReportButton } from '@/components/features/ReportButton';
import { useAuth } from '@/context/AuthContext';
import { artistsService } from '@/services/artistsService';

interface OfferCardProps {
  offer: Offer;
  /** 'client' view (can accept/decline) or 'artist' view (can withdraw) or 'public' */
  viewer: 'client' | 'artist' | 'public';
  canAccept?: boolean;
  onAccept?: (offerId: string) => void;
  onDecline?: (offerId: string) => void;
  onWithdraw?: (offerId: string) => void;
  onMessage?: () => void;
  commissionId?: string;
  commissionTitle?: string;
}

const STATUSBadgeMap: Record<OfferStatus, string> = {
  pending: 'pending',
  submitted: 'submitted',
  viewed: 'viewed',
  shortlisted: 'shortlisted',
  accepted: 'accepted',
  rejected: 'rejected',
  withdrawn: 'withdrawn',
};

export function OfferCard({
  offer, viewer, canAccept, onAccept, onDecline, onWithdraw, onMessage, commissionId, commissionTitle,
}: OfferCardProps) {
  const { user } = useAuth();
  const isArtist = viewer === 'artist';
  const isClient = viewer === 'client';
  const canWithdraw = isArtist && offer.status !== 'accepted' && offer.status !== 'rejected' && offer.status !== 'withdrawn';
  const priceLabel = offer.priceMax
    ? `${formatCurrency(offer.price)} - ${formatCurrency(offer.priceMax)}`
    : formatCurrency(offer.price);

  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(null);

  useEffect(() => {
    if (!isClient || !offer.artistSlug) return;
    let cancelled = false;
    artistsService
      .getBySlug(offer.artistSlug)
      .then((p) => { if (!cancelled) setArtistProfile(p); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [offer.artistSlug, isClient]);

  return (
    <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-5 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar name={offer.artistName} src={offer.artistAvatarUrl} size="md" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-base text-graphite-600">{offer.artistName}</span>
            <StatusBadge status={STATUSBadgeMap[offer.status]} type="offer" />
            <span className="text-xs text-graphite-200">{timeAgo(offer.createdAt)}</span>
          </div>
          {artistProfile && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-graphite-300">
              {artistProfile.averageRating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-gold-500 fill-gold-500" />
                  {artistProfile.averageRating.toFixed(1)}
                  {artistProfile.reviewCount > 0 && <span className="text-graphite-200">({artistProfile.reviewCount})</span>}
                </span>
              )}
              {artistProfile.completedProjects > 0 && (
                <span>{artistProfile.completedProjects} realizacji</span>
              )}
              {artistProfile.location && (
                <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {artistProfile.location}</span>
              )}
              {artistProfile.styles.slice(0, 2).map((s) => (
                <Badge key={s} color="neutral">{s}</Badge>
              ))}
            </div>
          )}
          {offer.artistSlug && !isArtist && (
            <Link
              to={`/artysci/${offer.artistSlug}`}
              className="mt-2 inline-flex items-center gap-1 text-xs text-graphite-300 transition-colors hover:text-gold-500"
            >
              <Eye className="h-3 w-3" /> Zobacz profil i portfolio <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Price + time */}
      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-graphite-400/10 sm:grid-cols-4">
        <div className="bg-ivory-50 p-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-graphite-300">Cena</p>
          <p className="mt-0.5 text-sm font-semibold text-graphite-600">{priceLabel}</p>
        </div>
        <div className="bg-ivory-50 p-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-graphite-300">Termin</p>
          <p className="mt-0.5 text-sm font-semibold text-graphite-600">{offer.estimatedDays} dni</p>
        </div>
        <div className="bg-ivory-50 p-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-graphite-300">Zaliczka</p>
          <p className="mt-0.5 text-sm font-semibold text-graphite-600">{offer.depositPercent}%</p>
        </div>
        <div className="bg-ivory-50 p-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-graphite-300">Wliczone</p>
          <p className="mt-0.5 flex flex-wrap gap-1 text-xs text-graphite-500">
            {offer.includesMaterials && <span>Materiały</span>}
            {offer.includesFrame && <span>Rama</span>}
            {offer.includesShipping && <span>Transport</span>}
            {!offer.includesMaterials && !offer.includesFrame && !offer.includesShipping && <span className="text-graphite-200">-</span>}
          </p>
        </div>
      </div>

      {/* Message */}
      <div className="mt-4">
        <p className="flex items-center gap-1.5 text-xs font-medium text-graphite-400">
          <MessageSquare className="h-3.5 w-3.5" /> Wiadomość do zlecającego
        </p>
        <p className="mt-1.5 text-sm text-graphite-500 text-pretty leading-relaxed">{offer.message}</p>
      </div>

      {/* Scope */}
      {offer.scopeDescription && (
        <div className="mt-3">
          <p className="text-xs font-medium text-graphite-400">Zakres pracy</p>
          <p className="mt-1 text-sm text-graphite-400 text-pretty leading-relaxed">{offer.scopeDescription}</p>
        </div>
      )}

      {/* Additional notes */}
      {offer.additionalNotes && (
        <div className="mt-3">
          <p className="text-xs font-medium text-graphite-400">Dodatkowe uwagi</p>
          <p className="mt-1 text-sm text-graphite-400 text-pretty leading-relaxed">{offer.additionalNotes}</p>
        </div>
      )}

      {/* Attachments */}
      {offer.attachments && offer.attachments.length > 0 && (
        <div className="mt-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-graphite-400">
            <ImageIcon className="h-3.5 w-3.5" /> Załączniki ({offer.attachments.length})
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {offer.attachments.map((att) => (
              <a key={att.id} href={att.url} target="_blank" rel="noreferrer" className="overflow-hidden rounded-lg border border-graphite-400/10">
                <img src={att.url} alt={`Załącznik: ${att.filename}`} className="h-20 w-20 object-cover" loading="lazy" decoding="async" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio refs */}
      {offer.portfolioRefs.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {offer.portfolioRefs.slice(0, 4).map((ref) => (
            <Badge key={ref} color="neutral">Praca: {ref}</Badge>
          ))}
        </div>
      )}

      {/* Selected artist banner */}
      {offer.status === 'accepted' && isClient && artistProfile && (
        <div className="mt-4 rounded-xl border border-gold-200 bg-gold-50 p-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-gold-600 fill-gold-500" />
            <span className="font-display text-sm text-graphite-600">Wybrany artysta</span>
          </div>
          <p className="mt-1 text-xs text-graphite-400">
            {offer.artistName} został(a) wybrany(a) do realizacji tego zlecenia. Pozostałe oferty zostały odrzucone.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-graphite-400/5 pt-4">
        {isClient && canAccept && (offer.status === 'pending' || offer.status === 'submitted') && (
          <>
            <Button size="sm" variant="gold" onClick={() => onAccept?.(offer.id)}>
              <Check className="h-3.5 w-3.5" /> Wybierz artystę
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDecline?.(offer.id)}>
              <X className="h-3.5 w-3.5" /> Odrzuć
            </Button>
          </>
        )}
        {isClient && offer.status === 'accepted' && (
          <Badge color="gold">
            <Star className="h-3 w-3" /> Zaakceptowana
          </Badge>
        )}
        {isClient && offer.status === 'shortlisted' && (
          <Badge color="gold">W krótkiej liście</Badge>
        )}
        {isClient && offer.status === 'rejected' && (
          <Badge color="error">Odrzucona</Badge>
        )}
        {canWithdraw && (
          <Button size="sm" variant="ghost" onClick={() => onWithdraw?.(offer.id)}>
            <RotateCcw className="h-3.5 w-3.5" /> Wycofaj ofertę
          </Button>
        )}
        {isClient && onMessage && offer.status !== 'withdrawn' && offer.status !== 'rejected' && (
          <Button size="sm" variant="ghost" onClick={onMessage}>
            <MessageSquare className="h-3.5 w-3.5" /> Napisz do artysty
          </Button>
        )}
        {isArtist && onMessage && offer.status !== 'withdrawn' && (
          <Button size="sm" variant="ghost" onClick={onMessage}>
            <MessageSquare className="h-3.5 w-3.5" /> Wiadomości
          </Button>
        )}
        {user && !isArtist && (
          <ReportButton targetType="offer" targetId={offer.id} variant="text" />
        )}
      </div>
    </div>
  );
}
