import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStaticSeo } from '@/hooks/useSeo';
import {
  ArrowRight, ArrowUpRight, FileText, Image as ImageIcon, MessageCircle, Send,
  Eye, Check, Wallet, Palette, Ruler, Sparkles, Shield, Clock, ChevronDown,
  Users, PenTool, Layers, CircleDollarSign, Coins,
} from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SeoImage, HeroImage } from '@/components/ui/SeoImage';
import { sectionImageAlt } from '@/lib/seo/alt-text';
import { ZLEC_OBRAZ_FAQS } from '@/lib/seo/metadata';

const INSPIRATION_IMAGES = [
  'https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/1145720/pexels-photo-1145720.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/1697750/pexels-photo-1697750.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/161154/stained-glass-spiral-circle-pattern-161154.jpeg?auto=compress&cs=tinysrgb&w=300',
];

export function ZlecObrazPage() {
  useStaticSeo('/zlec-obraz');
  return (
    <div>
      <HeroSection />
      <ProcessSection />
      <InspirationsSection />
      <ArtistsApplySection />
      <ChooseArtistSection />
      <RealizationSection />
      <InternalLinksSection />
      <FaqSection />
      <CTASection />
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
              <Badge color="gold"><FileText className="h-3 w-3" /> Zleć obraz</Badge>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="mt-6 max-w-3xl font-display text-hero text-graphite-600 text-balance leading-[1.1]">
                Zleć wykonanie obrazu <span className="italic text-gold-500">artyście</span>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-8 max-w-xl text-lg text-graphite-400 text-pretty leading-relaxed">
                Nie wiesz, jak zlecić artyście wykonanie obrazu? Przeprowadzimy Cię przez cały proces - od opisu zlecenia, przez oferty artystów, po realizację i odbiór.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/zamow-obraz">
                  <Button variant="gold" size="lg">Zamów obraz <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link to="/obrazy-na-zamowienie">
                  <Button variant="secondary" size="lg">Obrazy na zamówienie</Button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={4}>
              <div className="mt-12 flex flex-wrap items-center gap-8">
                {[
                  { num: '12 kroków', label: 'Od pomysłu do realizacji' },
                  { num: '0 zł', label: 'Rejestracja i publikacja' },
                  { num: '40/60%', label: 'Płatność w dwóch etapach' },
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                    <HeroImage src={INSPIRATION_IMAGES[0]} alt={sectionImageAlt('Inspiracja do zlecenia obrazu - przykład kompozycji')} className="h-full w-full object-cover" />
                  </div>
                  <div className="aspect-square overflow-hidden rounded-2xl shadow-lg">
                    <HeroImage src={INSPIRATION_IMAGES[1]} alt={sectionImageAlt('Referencyjny obraz do zlecenia - przykład stylu')} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="aspect-square overflow-hidden rounded-2xl shadow-lg">
                    <HeroImage src={INSPIRATION_IMAGES[2]} alt={sectionImageAlt('Paleta kolorów do zlecenia obrazu')} className="h-full w-full object-cover" />
                  </div>
                  <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-5 shadow-xl">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-success" />
                      <span className="font-mono text-xs uppercase tracking-ultra-wide text-success">Bezpiecznie</span>
                    </div>
                    <p className="mt-2 text-xs text-graphite-400 text-pretty">Zaliczka 40% start, 60% po ukończeniu. Płatności przez platformę.</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Process: 12 steps ──────────────────────────────── */

function ProcessSection() {
  const steps = [
    { icon: <PenTool className="h-5 w-5" />, title: 'Opisz, czego szukasz', desc: 'Tytuł i opis obrazu - styl, nastrój, pomieszczenie. Im precyzyjniej, tym lepsze oferty.' },
    { icon: <Ruler className="h-5 w-5" />, title: 'Podaj wymiary', desc: 'Szerokość i wysokość w centymetrach. Orientacja: pozioma, pionowa lub kwadrat.' },
    { icon: <Palette className="h-5 w-5" />, title: 'Wybierz kolorystykę', desc: 'Preferowane kolory i kolory do uniknięcia. Paleta dopasowana do wnętrza.' },
    { icon: <Sparkles className="h-5 w-5" />, title: 'Opisz styl i charakter', desc: 'Abstrakcja, realizm, minimalizm? Spokojny, energiczny, elegancki? Określ nastrój.' },
    { icon: <ImageIcon className="h-5 w-5" />, title: 'Dodaj zdjęcia inspiracyjne', desc: 'Załącz zdjęcia wnętrza, palety i obrazów referencyjnych. Do 6 zdjęć.' },
    { icon: <Clock className="h-5 w-5" />, title: 'Określ termin', desc: 'Podaj datę, do której obraz ma być gotowy. Artyści dopasują harmonogram.' },
    { icon: <Send className="h-5 w-5" />, title: 'Opublikuj zlecenie', desc: 'Kliknij „Opublikuj" i zlecenie jest live. Artyści dostają powiadomienie.' },
    { icon: <MessageCircle className="h-5 w-5" />, title: 'Artyści aplikują', desc: 'Artyści komentują pod zleceniem i składają formalne oferty z wyceną i terminem.' },
    { icon: <Eye className="h-5 w-5" />, title: 'Porównaj artystów i portfolio', desc: 'Przeglądaj profile, galerie prac, opinie i wyceny. Każdy artysta ma zweryfikowany profil.' },
    { icon: <Users className="h-5 w-5" />, title: 'Wybierz artystę', desc: 'Akceptuj ofertę, która najbardziej Ci odpowiada - po portfolio, cenie i terminie.' },
    { icon: <MessageCircle className="h-5 w-5" />, title: 'Ustal szczegóły realizacji', desc: 'Po akceptacji komunikujesz się z artystą w panelu projektu. Doprecyzuj kompozycję i detale.' },
    { icon: <Palette className="h-5 w-5" />, title: 'Rozpocznij realizację', desc: 'Zaliczka 40% uruchamia realizację. Artysta maluje obraz, wysyłając zdjęcia postępu.' },
  ];

  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">01 - Proces</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Jak zlecić artyście wykonanie obrazu?</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">
              12 kroków - od opisu zlecenia do rozpoczęcia realizacji. Każdy krok jest prosty i prowadzi Cię dalej.
            </p>
          </div>
        </Reveal>
        <div className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-graphite-600 text-ivory-100">
                  {step.icon}
                </div>
                <p className="mt-5 font-mono text-xs text-gold-500">Krok {i + 1}</p>
                <h3 className="mt-2 font-display text-lg text-graphite-600">{step.title}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={2}>
          <div className="mt-12 text-center">
            <Link to="/zamow-obraz">
              <Button variant="gold" size="lg">Zamów obraz <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Inspirations ──────────────────────────────── */

function InspirationsSection() {
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal>
            <div>
              <p className="section-label">02 - Inspiracje</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Zdjęcia inspiracyjne pomagają artystom</h2>
              <ul className="mt-6 space-y-3">
                {[
                  'Zdjęcia wnętrza, w którym obraz będzie wisiał',
                  'Palety kolorów i materiałów wykończeniowych',
                  'Obrazy i style, które Ci się podobają',
                  'Moodboardy i wizualizacje kompozycji',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-graphite-500">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600"><Check className="h-3 w-3" /></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-graphite-400 text-pretty">
                Możesz dodać do 6 zdjęć w PNG lub JPG. Inspiracje są widoczne dla zalogowanych artystów i pomagają dopasować ofertę do Twojej wizji.
              </p>
              <div className="mt-8">
                <Link to="/zamow-obraz">
                  <Button variant="primary">Dodaj inspiracje <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-8 shadow-lg">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-gold-500" />
                <span className="font-mono text-xs uppercase tracking-ultra-wide text-gold-500">Przykładowe inspiracje</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {INSPIRATION_IMAGES.map((src) => (
                  <div key={src} className="aspect-square overflow-hidden rounded-xl">
                    <SeoImage src={src} fallbackSrc="/abstract-painting-inspiration.webp" alt={sectionImageAlt('Przykładowa inspiracja do zlecenia obrazu')} className="h-full w-full object-cover" />
                  </div>
                ))}
                <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-graphite-400/20">
                <span className="text-xs text-graphite-200">+1</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Artists apply ──────────────────────────────── */

function ArtistsApplySection() {
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">03 - Aplikacje artystów</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Artyści aplikują do Twojego zlecenia</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">
              Po publikacji zlecenia zweryfikowani artyści mogą odpowiadać na dwa sposoby.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="card-elegant p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-graphite-600 text-ivory-100">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl text-graphite-600">Komentarze pod zleceniem</h3>
              <p className="mt-2 text-sm text-graphite-400 text-pretty">
                Artyści zadają pytania, dodają zdjęcia próbek i proponują podejście - zanim złożą formalną ofertę. Komentarze są publiczne pod zleceniem.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="card-elegant p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400 text-graphite-700">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl text-graphite-600">Formalne oferty</h3>
              <p className="mt-2 text-sm text-graphite-400 text-pretty">
                Artyści składają oferty z wyceną, terminem i zakresem materiałów. Oferty są prywatne - widzi je tylko właściciel zlecenia.
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={2}>
          <div className="mt-8 text-center">
            <Link to="/artysci" className="link-underline inline-flex items-center gap-1 text-sm text-graphite-500">
              Przeglądaj artystów <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Choose artist ──────────────────────────────── */

function ChooseArtistSection() {
  const criteria = [
    { icon: <Eye className="h-5 w-5" />, title: 'Portfolio', desc: 'Przeglądaj prace artysty - styl, technika, skala, paleta.' },
    { icon: <Wallet className="h-5 w-5" />, title: 'Wycena', desc: 'Porównaj cenę, termin i zakres materiałów w ofercie.' },
    { icon: <Shield className="h-5 w-5" />, title: 'Opinie i weryfikacja', desc: 'Zweryfikowani artyści mają plakietkę i opinie od zlecających.' },
  ];
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">04 - Wybór artysty</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Porównaj artystów i wybierz</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">
              Każdy artysta ma profil z portfolio, specjalizacjami i opiniami. Porównaj i wybierz tego, którego wizja najbardziej Ci odpowiada.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {criteria.map((c, i) => (
            <Reveal key={c.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <div className="card-elegant p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ivory-300 text-graphite-500">{c.icon}</div>
                <h3 className="mt-4 font-display text-lg text-graphite-600">{c.title}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={2}>
          <div className="mt-8 text-center">
            <Link to="/artysci">
              <Button variant="secondary">Przeglądaj artystów <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Realization ──────────────────────────────── */

function RealizationSection() {
  const phases = [
    { icon: <CircleDollarSign className="h-5 w-5" />, title: 'Zaliczka 40%', desc: 'Akceptujesz ofertę i płacisz zaliczkę. Artysta rozpoczyna pracę: szkice, studia, grunt.' },
    { icon: <Palette className="h-5 w-5" />, title: 'Realizacja', desc: 'Artysta maluje obraz, uploadując zdjęcia postępu na każdym etapie w panelu projektu.' },
    { icon: <Eye className="h-5 w-5" />, title: 'Podgląd i akceptacja', desc: 'Otrzymujesz zdjęcie ukończonego obrazu. Akceptujesz lub prosisz o poprawki.' },
    { icon: <Coins className="h-5 w-5" />, title: 'Płatność końcowa 60%', desc: 'Płacisz pozostałą kwotę. Artysta przekazuje obraz z certyfikatem autentyczności.' },
  ];
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">05 - Realizacja</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Ustal szczegóły i rozpocznij realizację</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">
              Po wyborze artysty doprecyzujesz detale i uruchamiasz realizację. Płatność w dwóch bezpiecznych etapach.
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

/* ──────────────────────────────── Internal links ──────────────────────────────── */

function InternalLinksSection() {
  const links = [
    { icon: <Layers className="h-5 w-5" />, title: 'Przeglądaj zlecenia', desc: 'Zobacz, jak wyglądają zleceń na obrazy na zamówienie.', path: '/zlecenia' },
    { icon: <Users className="h-5 w-5" />, title: 'Przeglądaj artystów', desc: 'Profile zweryfikowanych artystów malarzy z portfolio.', path: '/artysci' },
    { icon: <ImageIcon className="h-5 w-5" />, title: 'Obrazy na zamówienie', desc: 'Główna strona kategorii - style, wnętrza, FAQ.', path: '/obrazy-na-zamowienie' },
  ];
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">06 - Zobacz też</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Przydatne strony</h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {links.map((l, i) => (
            <Reveal key={l.path} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <Link to={l.path} className="card-elegant group block p-6 transition-shadow hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-600">{l.icon}</div>
                <h3 className="mt-4 font-display text-lg text-graphite-600 group-hover:text-gold-600 transition-colors">{l.title}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">{l.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-gold-600">
                  Przejdź <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── FAQ ──────────────────────────────── */

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-narrow">
        <Reveal>
          <div className="text-center">
            <p className="section-label">07 - FAQ</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Najczęściej zadawane pytania</h2>
          </div>
        </Reveal>
        <div className="mt-12 space-y-3">
          {ZLEC_OBRAZ_FAQS.map((faq, i) => (
            <Reveal key={faq.question} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="overflow-hidden rounded-2xl border border-graphite-400/10 bg-ivory-100">
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
                  <div className="px-5 pb-5 text-sm text-graphite-400 text-pretty leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={2}>
          <div className="mt-8 text-center">
            <Link to="/faq" className="link-underline inline-flex items-center gap-1 text-sm text-graphite-500">
              Wszystkie pytania <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
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
            Zleć swój obraz<br />
            <span className="italic text-gold-300">krok po kroku</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-graphite-200 text-pretty leading-relaxed">
            Rejestracja i publikacja zleceń są darmowe. Opisz obraz, dodaj inspiracje i otrzymaj oferty od artystów.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/zamow-obraz">
              <Button variant="gold" size="lg">Zamów obraz <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/zlecenia">
              <Button variant="secondary" size="lg" className="!border-graphite-500/40 !text-ivory-100 hover:!border-graphite-400 hover:!bg-graphite-700 hover:!text-ivory-100">
                Przeglądaj zlecenia
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
