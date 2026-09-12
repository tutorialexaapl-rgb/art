import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import type { LucideIcon } from 'lucide-react';

export interface InternalLinkItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface InternalLinksGridProps {
  links: InternalLinkItem[];
  title?: string;
  label?: string;
}

export function InternalLinksGrid({ links, title = 'Powiązane strony', label = 'Zobacz też' }: InternalLinksGridProps) {
  if (links.length === 0) return null;

  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">{label}</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">{title}</h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l, i) => {
            const Icon = l.icon;
            return (
              <Reveal key={l.href} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <Link to={l.href} className="card-elegant group block p-6 transition-shadow hover:shadow-lg">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-graphite-600 group-hover:text-gold-600 transition-colors">{l.label}</h3>
                  <p className="mt-2 text-sm text-graphite-400 text-pretty">{l.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs text-gold-600">
                    Przejdź <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
