import { Link } from 'react-router-dom';
import { useStaticSeo } from '@/hooks/useSeo';
import {
  FileText, Image as ImageIcon, MessageCircle, Users, Wallet, Briefcase,
  Eye, Check, ArrowRight, Sparkles, Send, PenTool, UserCircle, Grid3x3,
  Clock, Shield,
} from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function JakToDzialaPage() {
  useStaticSeo('/jak-to-dziala');
  return (
    <div>
      <HeroSection />
      <DualPathsSection />
      <PrinciplesSection />
      <CTASection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ivory-100 pt-20 pb-16 lg:pt-28 lg:pb-20">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <Badge color="gold"><Sparkles className="h-3 w-3" /> Przewodnik</Badge>
            <h1 className="mt-6 font-display text-hero text-graphite-600 text-balance">Jak działa Atelier</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-400 text-pretty">
              Platforma łączy zlecających z artystami malarzami. Nie jest sklepem - to marketplace zleceń na ręcznie malowane obrazy. Poznaj dwie ścieżki.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DualPathsSection() {
  const clientSteps = [
    { icon: <FileText className="h-5 w-5" />, title: 'Dodaje zlecenie', desc: 'Opisuje obraz - styl, wymiary, paletę, nastrój, pomieszczenie, budżet i termin.' },
    { icon: <ImageIcon className="h-5 w-5" />, title: 'Dodaje zdjęcia inspiracyjne', desc: 'Załącz zdjęcia wnętrza, palety i obrazów, które pomogą artyście zrozumieć wizję.' },
    { icon: <MessageCircle className="h-5 w-5" />, title: 'Artyści komentują i składają oferty', desc: 'Zweryfikowani artyści zadają pytania, dodają próbki i wysyłają formalne oferty.' },
    { icon: <Users className="h-5 w-5" />, title: 'Wybiera artystę', desc: 'Porównuje portfolio, wyceny, terminy i opinie. Akceptuje ofertę jednym kliknięciem.' },
    { icon: <Wallet className="h-5 w-5" />, title: 'Opłaca zaliczkę', desc: 'Płaci zaliczkę (zwykle 40%) - artysta rozpoczyna pracę: szkice, studia, grunt.' },
    { icon: <Eye className="h-5 w-5" />, title: 'Śledzi realizację', desc: 'Dashboard z etapami, zdjęciami postępu i wiadomościami od artysty.' },
    { icon: <Check className="h-5 w-5" />, title: 'Akceptuje finalny obraz', desc: 'Ocenia ukończoną pracę na podstawie zdjęć lub odbioru osobistego.' },
    { icon: <Wallet className="h-5 w-5" />, title: 'Opłaca resztę', desc: 'Płatność końcowa (60%) po akceptacji. Certyfikat autentyczności i przekazanie.' },
  ];

  const artistSteps = [
    { icon: <UserCircle className="h-5 w-5" />, title: 'Tworzy profil', desc: 'Rejestruje się jako artysta, wypełnia biografię, specjalizacje i techniki.' },
    { icon: <Grid3x3 className="h-5 w-5" />, title: 'Dodaje portfolio', desc: 'Uploaduje prace z tytułem, techniką, wymiarami i opcjonalnie ceną.' },
    { icon: <Clock className="h-5 w-5" />, title: 'Czeka na akceptację', desc: 'Admin weryfikuje konto. Po zatwierdzeniu artysta może komentować i wysyłać oferty.' },
    { icon: <FileText className="h-5 w-5" />, title: 'Przegląda zlecenia', desc: 'Filtruje otwarte zlecenia po stylu, technice, budżecie i lokalizacji.' },
    { icon: <MessageCircle className="h-5 w-5" />, title: 'Komentuje i dodaje zdjęcia', desc: 'Zadaje pytania, dodaje zdjęcia próbek i proponuje podejście pod zleceniem.' },
    { icon: <Send className="h-5 w-5" />, title: 'Wysyła ofertę', desc: 'Składa formalną ofertę z wyceną, terminem, zakresem materiałów, oprawy i transportu.' },
    { icon: <Briefcase className="h-5 w-5" />, title: 'Realizuje projekt', desc: 'Po akceptacji oferty i zaliczce rozpoczyna pracę wg etapów z dashboardu.' },
    { icon: <ImageIcon className="h-5 w-5" />, title: 'Dodaje zdjęcia postępu', desc: 'Uploaduje zdjęcia na każdym etapie - zlecający śledzi pracę na żywo.' },
  ];

  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-gallery">
        <Reveal>
          <div className="text-center">
            <p className="section-label">01 - Dwie ścieżki</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Ścieżka zlecającego i artysty</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Obie ścieżki spotykają się przy akceptacji oferty - od tego momentu współpracują w panelu projektu.</p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Client path */}
          <Reveal>
            <div className="rounded-2xl border border-graphite-400/10 bg-ivory-100 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-graphite-600 text-ivory-100">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">Ścieżka</p>
                  <h3 className="font-display text-2xl text-graphite-600">Zlecający</h3>
                </div>
              </div>
              <div className="mt-8 space-y-0">
                {clientSteps.map((step, i) => (
                  <div key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                    {i < clientSteps.length - 1 && (
                      <div className="absolute left-[18px] top-10 h-[calc(100%-2rem)] w-0.5 bg-graphite-400/15" />
                    )}
                    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-graphite-600 bg-graphite-600 text-ivory-100">
                      <span className="text-xs font-medium">{i + 1}</span>
                    </div>
                    <div className="pt-1">
                      <h4 className="font-display text-base text-graphite-600">{step.title}</h4>
                      <p className="mt-1 text-sm text-graphite-400 text-pretty">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Artist path */}
          <Reveal delay={1}>
            <div className="rounded-2xl border border-graphite-400/10 bg-ivory-100 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400 text-graphite-700">
                  <PenTool className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">Ścieżka</p>
                  <h3 className="font-display text-2xl text-graphite-600">Artysta</h3>
                </div>
              </div>
              <div className="mt-8 space-y-0">
                {artistSteps.map((step, i) => (
                  <div key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                    {i < artistSteps.length - 1 && (
                      <div className="absolute left-[18px] top-10 h-[calc(100%-2rem)] w-0.5 bg-gold-200" />
                    )}
                    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gold-400 bg-gold-400 text-graphite-700">
                      <span className="text-xs font-medium">{i + 1}</span>
                    </div>
                    <div className="pt-1">
                      <h4 className="font-display text-base text-graphite-600">{step.title}</h4>
                      <p className="mt-1 text-sm text-graphite-400 text-pretty">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PrinciplesSection() {
  const principles = [
    { icon: <FileText className="h-5 w-5" />, title: 'Zlecenie jako post marketplace', desc: 'Zlecający opisuje, czego szuka. Zlecenie działa jak elegancki post z inspiracjami, wymiarami, paletą i budżetem.' },
    { icon: <Eye className="h-5 w-5" />, title: 'Publiczny podgląd ograniczony', desc: 'Gość widzi tylko krótki opis, wymiary, budżet i tagi. Pełny opis, inspiracje, dane kontaktowe i oferty są dla zalogowanych.' },
    { icon: <Shield className="h-5 w-5" />, title: 'Prywatność ofert', desc: 'Formalne oferty są widoczne tylko dla właściciela zlecenia, danego artysty i admina.' },
    { icon: <MessageCircle className="h-5 w-5" />, title: 'Komentarze i zdjęcia', desc: 'Zalogowani i zatwierdzeni artyści mogą komentować i dodawać zdjęcia pod zleceniem.' },
    { icon: <Briefcase className="h-5 w-5" />, title: 'Dashboard realizacji', desc: 'Po akceptacji oferty powstaje panel z etapami, wyceną, zaliczką, płatnością końcową, zdjęciami i wiadomościami.' },
    { icon: <Wallet className="h-5 w-5" />, title: 'Płatności w dwóch etapach', desc: 'Zaliczka po wyborze artysty (40%), płatność końcowa po ukończeniu (60%). Docelowo przez Stripe.' },
  ];

  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">02 - Zasady</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Kluczowe zasady platformy</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Sześć zasad, które definiują jak działa Atelier.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <div className="card-elegant p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-graphite-600 text-ivory-100">{p.icon}</div>
                <h3 className="mt-4 font-display text-lg text-graphite-600">{p.title}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-graphite-600 py-20 lg:py-28">
      <div className="container-content text-center">
        <Reveal>
          <Badge color="gold"><Sparkles className="h-3 w-3" /> Darmowe na start</Badge>
          <h2 className="mt-6 font-display text-display text-ivory-100 text-balance">Zacznij już dziś</h2>
          <p className="mx-auto mt-6 max-w-lg text-graphite-200 text-pretty leading-relaxed">
            Rejestracja i publikacja są darmowe. Wybierz swoją ścieżkę.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/dashboard/client/zlecenia/nowe">
              <Button variant="gold" size="lg">Opublikuj zlecenie <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/register?role=artist">
              <Button variant="secondary" size="lg" className="!border-graphite-500/40 !text-ivory-100 hover:!border-graphite-400 hover:!bg-graphite-700 hover:!text-ivory-100">
                Dołącz jako artysta
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
