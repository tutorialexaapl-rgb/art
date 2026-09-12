import { Link } from 'react-router-dom';
import { Ruler, Palette, Wallet, Calendar, Eye, MessageCircle, FileText, ArrowRight, MapPin, Check } from 'lucide-react';
import type { Commission } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { SeoImage } from '@/components/ui/SeoImage';
import { formatCurrency, formatDate, timeAgo, truncate } from '@/lib/utils';

interface CommissionCardProps {
  commission: Commission;
  isPublicPreview?: boolean;
  to?: string;
  applied?: boolean;
}

export function CommissionCard({ commission, isPublicPreview = false, to, applied }: CommissionCardProps) {
  const linkTarget = to ?? `/zlecenia/${commission.slug}`;
  return (
    <Link to={linkTarget} className="card-elegant group block overflow-hidden">
      {commission.inspirationImages.length > 0 && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <SeoImage
            src={commission.inspirationImages[0]}
            fallbackSrc="/abstract-painting-inspiration.webp"
            alt={`Zlecenie na obraz: ${commission.title} - ${commission.style}`}
            width={400}
            height={225}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {commission.inspirationImages.length > 1 && (
            <div className="absolute bottom-3 right-3 rounded-full bg-graphite-700/70 px-3 py-1 text-xs font-medium text-ivory-100 backdrop-blur-sm">
              +{commission.inspirationImages.length - 1} zdjęć
            </div>
          )}
          <div className="absolute top-3 left-3">
            <StatusBadge status={commission.status} type="commission" />
          </div>
          {applied && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-success/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Check className="h-3 w-3" /> Aplikowano
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between text-xs text-graphite-300">
          <span>{timeAgo(commission.createdAt)}</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {commission.views}</span>
        </div>
        <h3 className="mt-3 font-display text-xl text-graphite-600 group-hover:text-graphite-700 transition-colors text-balance">
          {commission.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-graphite-400 text-pretty">
          {truncate(commission.publicSummary, 140)}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-graphite-400">
            <Ruler className="h-4 w-4 text-graphite-200" />
            <span className="text-xs">{commission.widthCm}×{commission.heightCm} cm</span>
          </div>
          <div className="flex items-center gap-2 text-graphite-400">
            <Palette className="h-4 w-4 text-graphite-200" />
            <span className="text-xs truncate">{commission.style}</span>
          </div>
          <div className="flex items-center gap-2 text-graphite-400">
            <Wallet className="h-4 w-4 text-graphite-200" />
            <span className="text-xs">{formatCurrency(commission.budgetMin)} - {formatCurrency(commission.budgetMax)}</span>
          </div>
          <div className="flex items-center gap-2 text-graphite-400">
            <Calendar className="h-4 w-4 text-graphite-200" />
            <span className="text-xs">{formatDate(commission.deadline)}</span>
          </div>
        </div>

        {/* Preferred colors */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {commission.preferredColors.slice(0, 4).map((c) => (
            <Badge key={c} color="clay">{c}</Badge>
          ))}
        </div>

        {commission.location && (
          <div className="mt-4 flex items-center gap-2 text-xs text-graphite-300">
            <MapPin className="h-3.5 w-3.5" /> {commission.location}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-graphite-400/10 pt-4">
          <div className="flex items-center gap-4 text-xs text-graphite-300">
            <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {commission.commentsCount}</span>
            <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {commission.offersCount} ofert</span>
          </div>
          <span className="flex items-center gap-1 font-mono text-xs text-gold-500 transition-colors group-hover:text-gold-600">
            {isPublicPreview ? 'Zobacz zlecenie' : 'Zobacz zlecenie'}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
