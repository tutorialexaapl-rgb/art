import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStaticSeo } from '@/hooks/useSeo';
import {
  ArrowRight, ArrowUpRight, Search, SlidersHorizontal, ArrowDownWideNarrow,
  Store, Layers, Users, MessageCircle, Palette, Wallet, Shield, Eye,
  ChevronDown, Sparkles, Check, PenTool, Clock, Coins, CircleDollarSign, Send,
} from 'lucide-react';
import { CommissionCard } from '@/components/features/CommissionCard';
import { ArtistCard } from '@/components/features/ArtistCard';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/ui/States';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { usePublicCommissions } from '@/hooks/usePublicCommissions';
import { useArtists } from '@/hooks/useArtists';
import { ZLECENIA_DLA_ARTYSTOW_FAQS } from '@/lib/seo/metadata';

type SortKey = 'newest' | 'deadline' | 'budget_high' | 'offers' | 'comments';

export function ZleceniaDlaArtystowPage() {
  useStaticSeo('/zlecenia-dla-artystow');
  return (
    <div>
      <HeroSection />
      <MarketplaceSection />
      <HowItWorksSection />
      <PortfolioSection />
      <CommunicationSection />
      <RealizationSection />
      <PaymentSection />
      <ArtistsLinksSection />
      <PoradnikiLinksSection />
      <FaqSection />
      <CTASection />
      <CommissionsBrowserSection />
    </div>
  );
}

/* ──────────────────────────────── Hero ──────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ivory-100 pt-24 pb-20 lg:pt-32 lg:pb-28">
      <div className="container-gallery">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <Reveal>
              <Badge color="gold"><Store className="h-3 w-3" /> Dla artystów</Badge>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="mt-6 max-w-3xl font-display text-hero text-graphite-600 text-balance leading-[1.1]">
                Zlecenia dla artystów <span className="italic text-gold-500">i malarzy</span>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-8 max-w-xl text-lg text-graphite-400 text-pretty leading-relaxed">
                Marketplace zleceń malarskich. Przeglądaj otwarte zlecenia od klientów szukających artystów, składaj oferty i realizuj obrazy na zamówienie.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/zlecenia">
                  <Button variant="gold" size="lg">Zobacz zlecenia <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link to="/register?role=artist">
                  <Button variant="primary" size="lg">Dołącz jako artysta <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={4}>
              <div className="mt-12 flex flex-wrap items-center gap-8">
                {[
                  { num: '0 zł', label: 'Rejestracja i oferty' },
                  { num: '40/60%', label: 'Płatność w dwóch etapach' },
                  { num: 'Portfolio', label: 'Zweryfikowane profile' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-2xl text-graphite-600">{s.num}</p>
                    <p className="mt-1 text-xs text-graphite-300">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <div className="relative">
              <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-ultra-wide text-gold-500">Przykładowe zlecenie</span>
                  <Badge color="success">Otwarte</Badge>
                </div>
                <h3 className="mt-4 font-display text-lg text-graphite-600">Abstrakcja do salonu 120×80</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">Szukam artysty do namalowania abstrakcyjnego obrazu w tonach ziemi. Inspiracje w załączniku.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge color="neutral">Abstrakcja</Badge>
                  <Badge color="neutral">120×80 cm</Badge>
                  <Badge color="neutral">Olej</Badge>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-graphite-400/10 pt-4">
                  <span className="font-display text-lg text-graphite-600">4000–6000 zł</span>
                  <span className="text-xs text-graphite-300">Termin: 8 tyg.</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-graphite-400/10 bg-graphite-600 p-4 shadow-xl">
                <Send className="h-5 w-5 text-gold-300" />
                <p className="text-xs text-ivory-100 text-pretty">Artyści aplikują ofertami z wyceną i terminem.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Marketplace ──────────────────────────────── */

function MarketplaceSection() {
  const types = [
    { icon: <Palette className="h-5 w-5" />, title: 'Obrazy do wnętrz', desc: 'Salon, sypialnia, biuro, hotel - zlecający szukają obrazów dopasowanych do przestrzeni.' },
    { icon: <PenTool className="h-5 w-5" />, title: 'Portrety', desc: 'Portrety osób i zwierząt od zdjęcia, w różnych technikach i stylach.' },
    { icon: <Layers className="h-5 w-5" />, title: 'Pejzaże i abstrakcje', desc: 'Krajobrazy, kompozycje abstrakcyjne, minimalizm - różne formaty i palety.' },
    { icon: <Sparkles className="h-5 w-5" />, title: 'Obrazy na zamówienie', desc: 'Kopie i interpretacje, obrazy ślubne, pamiątkowe, dedykowane na okazje.' },
  ];
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">01 - Marketplace</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Czym jest marketplace zleceń malarskich?</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">
              Platforma łączy zlecających szukających artystów z artystami malarzami. Zlecający publikują zlecenia, artyści przeglądają je i składają oferty.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {types.map((t, i) => (
            <Reveal key={t.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="card-elegant p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-graphite-600 text-ivory-100">{t.icon}</div>
                <h3 className="mt-4 font-display text-lg text-graphite-600">{t.title}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">{t.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── How it works ──────────────────────────────── */

function HowItWorksSection() {
  const steps = [
    { icon: <Search className="h-5 w-5" />, title: 'Przeglądaj zlecenia', desc: 'Filtruj po stylu, budżecie i terminie. Wybieraj zlecenia dopasowane do Twojej specjalizacji.' },
    { icon: <MessageCircle className="h-5 w-5" />, title: 'Komentuj i pytaj', desc: 'Zadawaj pytania pod zleceniem, dodawaj zdjęcia próbek, doprecyzuj wizję zlecającego.' },
    { icon: <Send className="h-5 w-5" />, title: 'Składaj oferty', desc: 'Złóż formalną ofertę z wyceną, terminem i zakresem materiałów. Oferty są prywatne.' },
    { icon: <Users className="h-5 w-5" />, title: 'Zlecający wybiera', desc: 'Zlecający porównuje portfolio, wyceny i opinie, a następnie akceptuje jedną ofertę.' },
  ];
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">02 - Jak artysta znajduje klienta</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Od zlecenia do akceptacji oferty</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">
              Artyści nie czekają biernie - aktywnie aplikują do zleceń, które pasują do ich stylu i możliwości.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-graphite-600 text-ivory-100">{step.icon}</div>
                <p className="mt-5 font-mono text-xs text-gold-500">Krok {i + 1}</p>
                <h3 className="mt-2 font-display text-lg text-graphite-600">{step.title}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Portfolio ──────────────────────────────── */

function PortfolioSection() {
  const features = [
    { icon: <Eye className="h-5 w-5" />, title: 'Galeria prac', desc: 'Dodawaj zdjęcia ukończonych obrazów. Zlecający przeglądają galerię przed wyborem.' },
    { icon: <Palette className="h-5 w-5" />, title: 'Style i techniki', desc: 'Oznacz swoje specjalizacje: olej, akryl, akwarela, realizm, abstrakcja, portret.' },
    { icon: <Shield className="h-5 w-5" />, title: 'Weryfikacja', desc: 'Zweryfikowani artyści mają plakietkę na profilu, co buduje zaufanie zlecających.' },
  ];
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">03 - Portfolio</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Profil artysty i portfolio</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">
              Twój profil to Twoja wizytówka. Im więcej prac i informacji, tym łatwiej zlecającym podjąć decyzję.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <div className="card-elegant p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ivory-300 text-graphite-500">{f.icon}</div>
                <h3 className="mt-4 font-display text-lg text-graphite-600">{f.title}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Communication ──────────────────────────────── */

function CommunicationSection() {
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal>
            <div>
              <p className="section-label">04 - Komunikacja</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Jak wygląda komunikacja ze zlecającym?</h2>
              <p className="mt-6 text-graphite-400 text-pretty">
                Komunikacja odbywa się w trzech etapach - od publicznych komentarzy, przez wiadomości po akceptacji oferty, po regularne aktualizacje podczas realizacji.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Komentarze pod zleceniem - publiczne pytania i propozycje przed ofertą',
                  'Wiadomości prywatne - po akceptacji oferty, w panelu projektu',
                  'Aktualizacje realizacji - artysta wysyła zdjęcia postępu na każdym etapie',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-graphite-500">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600"><Check className="h-3 w-3" /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="space-y-4">
              <div className="card-elegant p-5">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-gold-500" />
                  <span className="font-mono text-xs uppercase tracking-ultra-wide text-gold-500">Komentarz publiczny</span>
                </div>
                <p className="mt-3 text-sm text-graphite-500 text-pretty">„Czy inspiracje w załączniku są przykładowe, czy docelowe? Mogę zaproponować własną interpretację palety."</p>
              </div>
              <div className="card-elegant p-5">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-success" />
                  <span className="font-mono text-xs uppercase tracking-ultra-wide text-success">Wiadomość prywatna</span>
                </div>
                <p className="mt-3 text-sm text-graphite-500 text-pretty">„Dziękuję za akceptację oferty. Zaczynam od przygotowania trzech szkiców kompozycji - wyślę je do końca tygodnia."</p>
              </div>
              <div className="card-elegant p-5">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-gold-500" />
                  <span className="font-mono text-xs uppercase tracking-ultra-wide text-gold-500">Aktualizacja realizacji</span>
                </div>
                <p className="mt-3 text-sm text-graphite-500 text-pretty">„Warstwa podmalówki gotowa. Przechodzę do pierwszej warstwy kolorów - zdjęcie w załączniku."</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Realization ──────────────────────────────── */

function RealizationSection() {
  const phases = [
    { icon: <CircleDollarSign className="h-5 w-5" />, title: 'Zaliczka 40%', desc: 'Zlecający akceptuje ofertę i płaci zaliczkę. Ty rozpoczynasz pracę: szkice, studia, grunt.' },
    { icon: <Palette className="h-5 w-5" />, title: 'Malowanie', desc: 'Malujesz obraz, wysyłając zdjęcia postępu na każdym etapie w panelu projektu.' },
    { icon: <Eye className="h-5 w-5" />, title: 'Podgląd i poprawki', desc: 'Zlecający widzi zdjęcie ukończonego obrazu. Akceptuje lub prosi o poprawki.' },
    { icon: <Coins className="h-5 w-5" />, title: 'Płatność 60%', desc: 'Zlecający płaci pozostałą kwotę. Ty przekazujesz obraz z certyfikatem autentyczności.' },
  ];
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">05 - Realizacja</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Jak wygląda realizacja obrazu?</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">
              Po akceptacji oferty przechodzisz przez cztery etapy - od zaliczki po przekazanie ukończonego obrazu.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((p, i) => (
            <Reveal key={p.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="card-elegant p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-graphite-600 text-ivory-100">{p.icon}</div>
                <p className="mt-4 font-mono text-xs text-gold-500">Etap {i + 1}</p>
                <h3 className="mt-2 font-display text-lg text-graphite-600">{p.title}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Payment ──────────────────────────────── */

function PaymentSection() {
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal>
            <div>
              <p className="section-label">06 - Płatność</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Jak działa płatność za zrealizowany obraz?</h2>
              <p className="mt-6 text-graphite-400 text-pretty">
                Płatność w dwóch etapach chroni zarówno artystę, jak i zlecającego. Platforma obsługuje transakcje - nie negocjujesz płatności bezpośrednio.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="card-elegant p-5">
                  <p className="font-mono text-xs text-gold-500">Etap 1</p>
                  <p className="mt-2 font-display text-2xl text-graphite-600">40%</p>
                  <p className="mt-1 text-sm text-graphite-400 text-pretty">Zaliczka po akceptacji oferty. Rozpoczyna realizację.</p>
                </div>
                <div className="card-elegant p-5">
                  <p className="font-mono text-xs text-gold-500">Etap 2</p>
                  <p className="mt-2 font-display text-2xl text-graphite-600">60%</p>
                  <p className="mt-1 text-sm text-graphite-400 text-pretty">Płatność końcowa po ukończeniu i akceptacji obrazu.</p>
                </div>
              </div>
              <p className="mt-6 text-sm text-graphite-300 text-pretty">
                Platforma pobiera prowizję od zrealizowanych projektów. Brak opłat abonamentowych i ukrytych kosztów.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="rounded-2xl border border-graphite-400/10 bg-graphite-600 p-8 shadow-xl">
              <Wallet className="h-8 w-8 text-gold-300" />
              <h3 className="mt-4 font-display text-xl text-ivory-100">Bezpieczne płatności</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Płatności obsługiwane przez platformę',
                  'Zaliczka uruchamia realizację',
                  'Płatność końcowa po akceptacji obrazu',
                  'Brak opłat za rejestrację i oferty',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ivory-100">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-gold-300"><Check className="h-3 w-3" /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Artists links ──────────────────────────────── */

function ArtistsLinksSection() {
  const { artists, loading, error } = useArtists();
  const featured = artists.slice(0, 3);
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">07 - Artyści</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Poznaj artystów na platformie</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">
              Zobacz profile artystów, ich portfolio i specjalizacje. Dołącz do nich i stwórz własny profil.
            </p>
          </div>
        </Reveal>
        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-graphite-400/10 bg-ivory-50">
                <LoadingSkeleton className="aspect-square rounded-none" />
                <div className="p-6 space-y-3">
                  <LoadingSkeleton className="h-5 w-1/2" />
                  <LoadingSkeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-12 text-center text-sm text-graphite-300">Nie udało się pobrać profili artystów.</div>
        ) : featured.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((artist, i) => (
              <Reveal key={artist.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <ArtistCard artist={artist} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center text-sm text-graphite-300">Profile artystów pojawią się wkrótce.</div>
        )}
        <Reveal delay={2}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/artysci">
              <Button variant="secondary">Wszyscy artyści <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/register?role=artist" className="link-underline inline-flex items-center gap-1 text-sm text-graphite-500">
              Dołącz jako artysta <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────── FAQ ──────────────────────────────── */

function PoradnikiLinksSection() {
  return (
    <InternalLinksGrid
      label="Poradniki"
      title="Pomoc dla artystów"
      links={[
        { href: '/blog/kategoria/poradniki-dla-artystow', label: 'Poradniki dla artystów', description: 'Portfolio, wycena prac, komunikacja ze zlecającymi i budowanie marki.', icon: Palette },
        { href: '/blog/kategoria/zlecenia-dla-artystow', label: 'Zlecenia dla artystów', description: 'Jak znaleźć zlecenia, składać oferty i realizować projekty malarskie.', icon: Store },
        { href: '/blog/kategoria/style-malarskie', label: 'Style malarskie', description: 'Techniki i kierunki - olej, akryl, akwarela, realizm, abstrakcja.', icon: Layers },
      ]}
    />
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-narrow">
        <Reveal>
          <div className="text-center">
            <p className="section-label">08 - FAQ</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Najczęściej zadawane pytania</h2>
          </div>
        </Reveal>
        <div className="mt-12 space-y-3">
          {ZLECENIA_DLA_ARTYSTOW_FAQS.map((faq, i) => (
            <Reveal key={faq.question} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="overflow-hidden rounded-2xl border border-graphite-400/10 bg-ivory-50">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="font-display text-base text-graphite-600 text-pretty pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-graphite-300 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-sm text-graphite-400 text-pretty leading-relaxed">{faq.answer}</div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── CTA ──────────────────────────────── */

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-graphite-600 py-30">
      <div className="container-narrow text-center">
        <Reveal>
          <Badge color="gold"><Sparkles className="h-3 w-3" /> Darmowe na start</Badge>
          <h2 className="mt-6 font-display text-display text-ivory-100 text-balance">
            Znajdź klienta<br />
            <span className="italic text-gold-300">na swój obraz</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-graphite-200 text-pretty leading-relaxed">
            Rejestracja i przeglądanie zleceń są darmowe. Składaj oferty do zleceń dopasowanych do Twojego stylu.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/zlecenia">
              <Button variant="gold" size="lg">Zobacz zlecenia <ArrowRight className="h-4 w-4" /></Button>
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

/* ──────────────────────────────── Commissions browser (interactive) ──────────────────────────────── */

function CommissionsBrowserSection() {
  const { commissions, loading, error, refetch } = usePublicCommissions();
  const [query, setQuery] = useState('');
  const [style, setStyle] = useState('all');
  const [sort, setSort] = useState<SortKey>('newest');

  const allStyles = useMemo(
    () => Array.from(new Set(commissions.map((c) => c.style).filter(Boolean))).sort(),
    [commissions],
  );

  const filtered = useMemo(() => {
    let result = commissions.filter((c) => {
      if (query) {
        const q = query.toLowerCase();
        if (!c.title.toLowerCase().includes(q) && !c.publicSummary.toLowerCase().includes(q)) return false;
      }
      if (style !== 'all' && !c.style.toLowerCase().includes(style.toLowerCase())) return false;
      return true;
    });
    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'deadline': return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'budget_high': return b.budgetMax - a.budgetMax;
        case 'offers': return b.offersCount - a.offersCount;
        case 'comments': return b.commentsCount - a.commentsCount;
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return result;
  }, [commissions, query, style, sort]);

  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">09 - Przeglądaj zlecenia</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Otwarte zlecenia malarskie</h2>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <Input
                placeholder="Szukaj zleceń..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <ArrowDownWideNarrow className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-graphite-200" />
                <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="min-w-[180px]">
                  <option value="newest">Najnowsze</option>
                  <option value="deadline">Najbliższy termin</option>
                  <option value="budget_high">Najwyższy budżet</option>
                  <option value="offers">Najwięcej ofert</option>
                </Select>
              </div>
              <Select value={style} onChange={(e) => setStyle(e.target.value)} className="min-w-[160px]">
                <option value="all">Wszystkie style</option>
                {allStyles.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 flex items-center gap-2 text-sm text-graphite-300">
          <SlidersHorizontal className="h-4 w-4" />
          {loading ? 'Ładowanie...' : `${filtered.length} ${filtered.length === 1 ? 'zlecenie' : 'zleceń'}`}
        </div>

        {loading ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-graphite-400/10 bg-ivory-50">
                <LoadingSkeleton className="aspect-[16/10] rounded-none" />
                <div className="p-6 space-y-3">
                  <LoadingSkeleton className="h-5 w-3/4" />
                  <LoadingSkeleton className="h-4 w-full" />
                  <LoadingSkeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState title="Nie udało się pobrać zleceń" description={error} onRetry={refetch} />
        ) : filtered.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <Reveal key={c.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <CommissionCard commission={c} isPublicPreview />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState title="Brak zleceń" description="Spróbuj zmienić kryteria wyszukiwania." />
        )}
      </div>
    </section>
  );
}
