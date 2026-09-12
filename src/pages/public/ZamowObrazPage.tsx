import { Link, Navigate } from 'react-router-dom';
import { useStaticSeo } from '@/hooks/useSeo';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Sparkles, FileText, Image as ImageIcon, Wallet, Send, Check, Users, Layers } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';

export function ZamowObrazPage() {
  useStaticSeo('/zamow-obraz');
  const { user } = useAuth();

  // If already logged in as client, go straight to the form
  if (user?.role === 'client') {
    return <Navigate to="/dashboard/client/zlecenia/nowe" replace />;
  }

  return (
    <div>
      <HeroSection />
      <StepsSection />
      <InternalLinksSection />
      <CTASection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ivory-100 pt-20 pb-20 lg:pt-28 lg:pb-28">
      <div className="container-gallery">
        <Reveal>
          <Badge color="gold"><Sparkles className="h-3 w-3" /> Zamów obraz</Badge>
        </Reveal>
        <Reveal delay={1}>
          <h1 className="mt-6 max-w-3xl font-display text-hero text-graphite-600 text-balance">
            Zamów obraz <span className="italic text-gold-500">ręcznie malowany</span>
          </h1>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-8 max-w-xl text-lg text-graphite-400 text-pretty leading-relaxed">
            Opisz obraz swoich marzeń, dodaj inspiracje i opublikuj zlecenie. Zweryfikowani artyści odpowiedzą ofertami dopasowanymi do Twojego budżetu.
          </p>
        </Reveal>
        <Reveal delay={3}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/register?role=client">
              <Button variant="primary" size="lg">Zacznij - załóż konto <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/zlec-obraz">
              <Button variant="secondary" size="lg">Jak to działa?</Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StepsSection() {
  const steps = [
    { icon: <FileText className="h-5 w-5" />, title: 'Załóż konto zlecającego', desc: 'Rejestracja jest darmowa i zajmuje minutę. Bez zobowiązań.' },
    { icon: <ImageIcon className="h-5 w-5" />, title: 'Opisz obraz i dodaj inspiracje', desc: 'Styl, wymiary, paleta, nastrój, pomieszczenie. Załącz zdjęcia.' },
    { icon: <Wallet className="h-5 w-5" />, title: 'Ustaw budżet i termin', desc: 'Podaj zakres cenowy i datę, do której obraz ma być gotowy.' },
    { icon: <Send className="h-5 w-5" />, title: 'Opublikuj zlecenie', desc: 'Artyści dostają powiadomienie i składają oferty.' },
    { icon: <Check className="h-5 w-5" />, title: 'Wybierz artystę', desc: 'Porównaj oferty, portfolio i opinie. Akceptuj najlepszą propozycję.' },
  ];
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">Krok po kroku</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Od pomysłu do obrazu</h2>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
              <div className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-10 top-6 hidden h-px w-[calc(100%-2.5rem)] bg-gradient-to-r from-graphite-400/20 to-transparent lg:block" />
                )}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-graphite-600 text-ivory-100">{s.icon}</div>
                <p className="mt-4 font-mono text-xs text-gold-500">Krok {i + 1}</p>
                <h3 className="mt-1 font-display text-lg text-graphite-600">{s.title}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function InternalLinksSection() {
  return (
    <InternalLinksGrid
      label="Powiązane strony"
      title="Zobacz też"
      links={[
        { href: '/obrazy-na-zamowienie', label: 'Obrazy na zamówienie', description: 'Style, wnętrza, proces zlecania i FAQ.', icon: ImageIcon },
        { href: '/artysci', label: 'Artyści malarze', description: 'Poznaj zweryfikowanych artystów z portfolio i specjalizacjami.', icon: Users },
        { href: '/zlecenia', label: 'Otwarte zlecenia', description: 'Zobacz przykładowe zlecenia na obrazy na zamówienie.', icon: Layers },
        { href: '/zlec-obraz', label: 'Jak zlecić obraz', description: 'Przewodnik krok po kroku - od pomysłu do realizacji.', icon: FileText },
      ]}
    />
  );
}

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-graphite-600 py-20 lg:py-28">
      <div className="container-narrow text-center">
        <Reveal>
          <h2 className="font-display text-display text-ivory-100 text-balance">Gotowy, by zamówić obraz?</h2>
          <p className="mx-auto mt-6 max-w-lg text-graphite-200 text-pretty leading-relaxed">
            Załóż darmowe konto i opublikuj pierwsze zlecenie. Rejestracja trwa minutę.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register?role=client">
              <Button variant="gold" size="lg">Załóż konto zlecającego <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/artysci">
              <Button variant="secondary" size="lg" className="!border-graphite-500/40 !text-ivory-100 hover:!border-graphite-400 hover:!bg-graphite-700 hover:!text-ivory-100">
                Przeglądaj artystów
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
