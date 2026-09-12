import { type ReactNode } from 'react';
import { Reveal } from '@/components/ui/Reveal';

interface ContentPageProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function ContentPage({ eyebrow, title, description, children }: ContentPageProps) {
  return (
    <div className="py-20 lg:py-30">
      <div className="container-content">
        <Reveal>
          {eyebrow && <p className="section-label">{eyebrow}</p>}
          <h1 className="mt-4 font-display text-display text-graphite-600 text-balance">{title}</h1>
          {description && <p className="mt-6 max-w-2xl text-lg text-graphite-400 text-pretty">{description}</p>}
        </Reveal>
        <div className="mt-12">
          {children}
        </div>
      </div>
    </div>
  );
}
