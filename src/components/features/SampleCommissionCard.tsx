import { Link } from 'react-router-dom';
import { Ruler, Palette, Wallet, Calendar, Eye, MessageCircle, FileText, ArrowRight, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { SeoImage } from '@/components/ui/SeoImage';
import type { SampleCommission } from '@/lib/seo';

interface SampleCommissionCardProps {
  commission: SampleCommission;
}

export function SampleCommissionCard({ commission }: SampleCommissionCardProps) {
  return (
    <Link to="/zamow-obraz" className="card-elegant group block overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden">
        <SeoImage
          src={commission.image}
          alt={`Przykładowe zlecenie: ${commission.title}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 rounded-full bg-graphite-700/70 px-3 py-1 text-xs font-medium text-ivory-100 backdrop-blur-sm">
          Przykładowe zlecenie
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between text-xs text-graphite-300">
          <span>{commission.postedAgo}</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {Math.floor(Math.random() * 200) + 50}</span>
        </div>
        <h3 className="mt-3 font-display text-xl text-graphite-600 group-hover:text-graphite-700 transition-colors text-balance">
          {commission.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-graphite-400 text-pretty">
          {commission.summary}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-graphite-400">
            <Ruler className="h-4 w-4 text-graphite-200" />
            <span className="text-xs">{commission.dimensions}</span>
          </div>
          <div className="flex items-center gap-2 text-graphite-400">
            <Palette className="h-4 w-4 text-graphite-200" />
            <span className="text-xs truncate">{commission.style}</span>
          </div>
          <div className="flex items-center gap-2 text-graphite-400">
            <Wallet className="h-4 w-4 text-graphite-200" />
            <span className="text-xs">{commission.budget}</span>
          </div>
          <div className="flex items-center gap-2 text-graphite-400">
            <Calendar className="h-4 w-4 text-graphite-200" />
            <span className="text-xs">{commission.deadline}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {commission.colors.map((c) => (
            <Badge key={c} color="clay">{c}</Badge>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-graphite-300">
          <MapPin className="h-3.5 w-3.5" /> {commission.location}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-graphite-400/10 pt-4">
          <div className="flex items-center gap-4 text-xs text-graphite-300">
            <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {commission.comments}</span>
            <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {commission.offers} ofert</span>
          </div>
          <span className="flex items-center gap-1 font-mono text-xs text-gold-500 transition-colors group-hover:text-gold-600">
            Zobacz zlecenie
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
