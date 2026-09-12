import { Link } from 'react-router-dom';
import { MapPin, BadgeCheck, Star, ArrowRight, Wallet, Clock } from 'lucide-react';
import type { ArtistProfile } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { SeoImage } from '@/components/ui/SeoImage';
import { formatCurrency } from '@/lib/utils';

interface ArtistCardProps {
  artist: ArtistProfile;
  to?: string;
}

export function ArtistCard({ artist, to }: ArtistCardProps) {
  const portfolioThumbs = artist.portfolio?.slice(0, 3) ?? [];
  const linkTarget = to ?? `/artysci/${artist.slug}`;

  return (
    <Link to={linkTarget} className="card-elegant group block overflow-hidden">
      {/* Portfolio thumbnails strip */}
      <div className="relative grid grid-cols-3 gap-px overflow-hidden bg-graphite-400/5">
        {portfolioThumbs.length > 0 ? (
          portfolioThumbs.map((item) => (
            <div key={item.id} className="relative aspect-square overflow-hidden">
              <SeoImage
                src={item.imageUrl}
                alt={`Praca artysty ${artist.artistName}: ${item.title}`}
                width={200}
                height={200}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))
        ) : (
          <div className="col-span-3 aspect-[3/1] bg-ivory-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-graphite-700/40 via-transparent to-transparent" />
        {artist.isVerified && (
          <div className="absolute top-3 left-3">
            <Badge color="gold"><BadgeCheck className="h-3 w-3" /> Zweryfikowany</Badge>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Name + avatar + rating */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={artist.artistName} src={artist.avatarUrl} size="sm" />
            <div>
              <h3 className="font-display text-lg text-graphite-600 group-hover:text-graphite-700 transition-colors">
                {artist.artistName}
              </h3>
              <div className="flex items-center gap-1 text-xs text-graphite-300">
                <MapPin className="h-3 w-3" />
                {artist.location}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-gold-300 text-gold-300" />
            <span className="font-medium text-graphite-500">{artist.stats.averageRating}</span>
          </div>
        </div>

        {/* Styles */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {artist.styles.slice(0, 3).map((s) => (
            <Badge key={s} color="clay">{s}</Badge>
          ))}
        </div>

        {/* Techniques */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {artist.techniques.slice(0, 3).map((t) => (
            <Badge key={t} color="stone">{t}</Badge>
          ))}
        </div>

        {/* Price range + delivery time */}
        <div className="mt-5 flex items-center justify-between border-t border-graphite-400/10 pt-4 text-xs text-graphite-400">
          <span className="flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-graphite-200" />
            {formatCurrency(artist.priceRangeMin)} - {formatCurrency(artist.priceRangeMax)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-graphite-200" />
            ~{artist.averageDeliveryDays} dni
          </span>
        </div>

        {/* CTA */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-graphite-300">{artist.stats.completedProjects} realizacji</span>
          <span className="flex items-center gap-1 font-mono text-xs text-gold-500 transition-colors group-hover:text-gold-600">
            Zobacz profil
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
