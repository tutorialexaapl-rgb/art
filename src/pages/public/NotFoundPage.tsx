import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Palette } from 'lucide-react';
import { useStaticSeo } from '@/hooks/useSeo';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  useStaticSeo('/404');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory-50 px-4 py-24">
      <Reveal>
        <div className="text-center">
          <p className="font-mono text-sm uppercase tracking-ultra-wide text-gold-500">404</p>
          <h1 className="mt-4 font-display text-6xl text-graphite-600 sm:text-7xl">
            Strona nie znaleziona
          </h1>
          <p className="mx-auto mt-6 max-w-md text-graphite-400 text-pretty">
            Strona, której szukasz, nie istnieje lub została przeniesiona.
            Wróć do strony głównej lub przeszukaj naszą ofertę.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button variant="gold" size="lg">
                <Home className="h-4 w-4" /> Strona główna
              </Button>
            </Link>
            <Link to="/obrazy-na-zamowienie">
              <Button variant="secondary" size="lg">
                <Palette className="h-4 w-4" /> Obrazy na zamówienie
              </Button>
            </Link>
            <Link to="/artysci">
              <Button variant="secondary" size="lg">
                <Search className="h-4 w-4" /> Znajdź artystę
              </Button>
            </Link>
          </div>
          <div className="mt-8">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-graphite-300 hover:text-gold-600 transition-colors">
              <ArrowLeft className="h-3 w-3" /> Wróć do poprzedniej strony
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
