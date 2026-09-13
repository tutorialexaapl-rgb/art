import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStaticSeo } from '@/hooks/useSeo';
import {
  ArrowRight, ArrowUpRight, Sparkles, Palette, Ruler, Wallet, Clock, Check,
  Image as ImageIcon, PenTool, MessageSquare, Users, Shield, ChevronDown,
  Home, Building2, Hotel, Building, Eye, Layers, Send, Coins, CircleDollarSign,
} from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { OBRAZY_KATEGORIE, OBRAZY_WNETRZ } from '@/lib/seo';
import { OBRAZY_NA_ZAMOWIENIE_FAQS } from '@/lib/seo/metadata';
import { SeoImage, HeroImage } from '@/components/ui/SeoImage';

const HERO_IMAGE = '/hero-painting-detail.webp';
const SECTION_IMAGE_1 = '/section-painting-blue.webp';
const SECTION_IMAGE_2 = '/artist-with-painting-alt.webp';

const BLOG_TEASERS = [
  { slug: 'jak-zlecic-obraz-przewodnik', title: 'Jak zlecić obraz - kompletny przewodnik', category: 'poradniki' },
  { slug: 'ile-kosztuje-obraz-na-zamowienie', title: 'Ile kosztuje obraz na zamówienie?', category: 'obrazy-na-zamowienie' },
  { slug: 'obraz-do-salonu-jak-wybrac', title: 'Obraz do salonu - jak wybrać', category: 'wnetrza' },
  { slug: 'techniki-malarskie-olej-akryl', title: 'Olej czy akryl - którą technikę wybrać?', category: 'malarstwo' },
];

export function ObrazyNaZamowieniePage() {
  useStaticSeo('/obrazy-na-zamowienie');

  return (
    <div>
      <HeroSection />
      <CzymSaSection />
      <JakZamowicSection />
      <StyleSection />
      <WnetrzaSection />
      <ArtysciSection />
      <ZleceniaTeaserSection />
      <BlogTeaserSection />
      <FaqSection />
      <FinalCTASection />
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
              <Badge color="gold"><Sparkles className="h-3 w-3" /> Obrazy na zamówienie</Badge>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="mt-6 max-w-3xl font-display text-hero text-graphite-600 text-balance leading-[1.1]">
                Obrazy ręcznie malowane <span className="italic text-gold-500">na zamówienie</span>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-8 max-w-xl text-lg text-graphite-400 text-pretty leading-relaxed">
                Zleć obraz dopasowany do Twojego wnętrza i wizji. Opisz pomysł, dodaj inspiracje i otrzymaj oferty od zweryfikowanych artystów malarzy. Rejestracja i publikacja darmowe.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/zlec-obraz">
                  <Button variant="gold" size="lg">Zleć obraz <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link to="/artysci">
                  <Button variant="secondary" size="lg">Przeglądaj artystów</Button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={4}>
              <div className="mt-12 flex flex-wrap items-center gap-8">
                {[
                  { num: '120+', label: 'Artystów malarzy' },
                  { num: '450+', label: 'Zrealizowanych obrazów' },
                  { num: '0 zł', label: 'Rejestracja i publikacja' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-3xl text-graphite-600">{s.num}</p>
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
                    <HeroImage src={HERO_IMAGE} alt="Obraz ręcznie malowany na zamówienie - praca artysty malarza" className="h-full w-full object-cover" />
                  </div>
                  <div className="aspect-square overflow-hidden rounded-2xl shadow-lg">
                    <HeroImage src={SECTION_IMAGE_1} alt="Abstrakcyjny obraz ręcznie malowany na płótnie w odcieniach błękitu i terakoty" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="aspect-square overflow-hidden rounded-2xl shadow-lg">
                    <HeroImage src={SECTION_IMAGE_2} alt="Artysta trzymający własnoręcznie malowany obraz" className="h-full w-full object-cover" />
                  </div>
                  <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-5 shadow-xl">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-success" />
                      <span className="font-mono text-xs uppercase tracking-ultra-wide text-success">Bezpieczna płatność</span>
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

/* ──────────────────────────────── Czym są obrazy na zamówienie ──────────────────────────────── */

function CzymSaSection() {
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div>
              <p className="section-label">01 - Definicja</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">
                Czym są obrazy na zamówienie?
              </h2>
              <div className="mt-6 space-y-4 text-graphite-400 text-pretty leading-relaxed">
                <p>
                  Obrazy ręcznie malowane na zamówienie to unikatowe dzieła sztuki tworzone przez artystów malarzy na podstawie Twojego opisu i inspiracji. W przeciwieństwie do reprodukcji, plakatów czy wydruków, każdy obraz jest oryginalnym dziełem malowanym tradycyjnymi technikami - olejem, akrylem, akwarelą lub mediami mieszanymi.
                </p>
                <p>
                  Na Atelier zlecasz obraz opisując, jakiego efektu oczekujesz: styl, wymiary, paletę kolorów, nastrój i pomieszczenie. Artyści przeglądają Twoje zlecenie, zadają pytania i składają oferty. Ty wybierasz artystę, którego wizja najbardziej Ci odpowiada.
                </p>
                <p>
                  Każdy obraz na zamówienie jest jedyny w swoim rodzaju - nie ma dwóch identycznych egzemplarzy. Po ukończeniu otrzymujesz dzieło z certyfikatem autentyczności, potwierdzającym autorski charakter pracy.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/zlec-obraz">
                  <Button variant="primary">Zleć obraz <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link to="/zlecenia" className="link-underline inline-flex items-center gap-1 text-sm text-graphite-500">
                  Zobacz przykładowe zlecenia <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: <Palette className="h-5 w-5" />, title: 'Unikatowe dzieło', desc: 'Każdy obraz jest autorskim, niepowtarzalnym dziełem sztuki.' },
                { icon: <Ruler className="h-5 w-5" />, title: 'Dopasowane wymiary', desc: 'Określ dokładne wymiary i orientację - artysta dopasuje kompozycję.' },
                { icon: <Wallet className="h-5 w-5" />, title: 'Twój budżet', desc: 'Podaj zakres cenowy. Artyści dopasują ofertę do Twoich oczekiwań.' },
                { icon: <Clock className="h-5 w-5" />, title: 'Termin realizacji', desc: 'Wybierz datę, do której obraz ma być gotowy.' },
                { icon: <Shield className="h-5 w-5" />, title: 'Certyfikat autentyczności', desc: 'Każdy obraz jest sygnowany i opatrzony certyfikatem.' },
                { icon: <ImageIcon className="h-5 w-5" />, title: 'Inspiracje i referencje', desc: 'Załącz zdjęcia wnętrza, palety i obrazów referencyjnych.' },
              ].map((f, i) => (
                <div key={f.title} className="card-elegant p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-graphite-600 text-ivory-100">{f.icon}</div>
                  <h3 className="mt-4 font-display text-base text-graphite-600">{f.title}</h3>
                  <p className="mt-2 text-sm text-graphite-400 text-pretty">{f.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Jak zamówić obraz ──────────────────────────────── */

function JakZamowicSection() {
  const steps = [
    { icon: <PenTool className="h-5 w-5" />, title: 'Opisz swój pomysł', desc: 'Tytuł, styl, wymiary, nastrój, pomieszczenie - czym bardziej precyzyjnie opiszesz obraz, tym lepsze oferty otrzymasz.' },
    { icon: <ImageIcon className="h-5 w-5" />, title: 'Dodaj zdjęcia i inspiracje', desc: 'Załącz zdjęcia wnętrza, palety kolorów i obrazy referencyjne. Do 6 zdjęć w PNG lub JPG.' },
    { icon: <MessageSquare className="h-5 w-5" />, title: 'Artyści zgłaszają się do zlecenia', desc: 'Zweryfikowani artyści komentują pod zleceniem, zadają pytania i składają formalne oferty z wyceną i terminem.' },
    { icon: <Users className="h-5 w-5" />, title: 'Wybierz artystę', desc: 'Porównaj portfolio, opinie, wyceny i terminy. Akceptuj ofertę, która najbardziej Ci odpowiada.' },
    { icon: <MessageSquare className="h-5 w-5" />, title: 'Ustal szczegóły', desc: 'Po akceptacji oferty komunikujesz się z artystą w panelu projektu. Doprecyzuj kompozycję, paletę i detale.' },
    { icon: <Palette className="h-5 w-5" />, title: 'Realizacja obrazu', desc: 'Artysta maluje obraz, wysyłając zdjęcia postępu na każdym etapie. Śledzisz realizację w dashboardzie projektu.' },
    { icon: <CircleDollarSign className="h-5 w-5" />, title: 'Płatność zaliczki', desc: 'Zaliczka 40% po akceptacji oferty rozpoczyna realizację. Bezpieczna płatność przez platformę.' },
    { icon: <Coins className="h-5 w-5" />, title: 'Płatność końcowa', desc: 'Płatność końcowa 60% po ukończeniu i akceptacji obrazu. Odbiór z certyfikatem autentyczności.' },
  ];

  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">02 - Proces</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Jak zamówić obraz?</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">
              Od pomysłu do zawieszenia na ścianie - osiem kroków, które dzielą Cię od unikatowego obrazu.
            </p>
          </div>
        </Reveal>
        <div className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
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
            <Link to="/zlec-obraz">
              <Button variant="gold" size="lg">Zleć obraz <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Najpopularniejsze style ──────────────────────────────── */

function StyleSection() {
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">03 - Style</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Najpopularniejsze style</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">
              Od abstrakcji po realizm - wybierz styl, który odpowiada Twojemu wnętrzu i wizji.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {OBRAZY_KATEGORIE.map((kat, i) => (
            <Reveal key={kat.slug} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
              <Link to={`/obrazy/${kat.slug}`} className="card-elegant group block p-6 transition-shadow hover:shadow-lg">
                <h3 className="font-display text-lg text-graphite-600 group-hover:text-gold-600 transition-colors">{kat.name}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty line-clamp-3">{kat.intro}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-gold-600">
                  Zobacz kategorię <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Obrazy do różnych wnętrz ──────────────────────────────── */

function WnetrzaSection() {
  const icons: Record<string, React.ReactNode> = {
    salon: <Home className="h-5 w-5" />,
    sypialnia: <Building className="h-5 w-5" />,
    biuro: <Building2 className="h-5 w-5" />,
    hotel: <Hotel className="h-5 w-5" />,
  };

  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">04 - Wnętrza</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Obrazy do różnych wnętrz</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">
              Dopasuj obraz do pomieszczenia - od salonu, przez sypialnię, po hotel.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OBRAZY_WNETRZ.map((w, i) => (
            <Reveal key={w.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <Link to={w.path} className="card-elegant group block p-6 transition-shadow hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-600">
                  {icons[w.slug] ?? <Home className="h-5 w-5" />}
                </div>
                <h3 className="mt-4 font-display text-lg text-graphite-600 group-hover:text-gold-600 transition-colors">{w.name}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty line-clamp-3">{w.intro}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-gold-600">
                  Zobacz <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Artyści teaser ──────────────────────────────── */

function ArtysciSection() {
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal>
            <div>
              <p className="section-label">05 - Artyści</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">
                Zweryfikowani artyści malarze
              </h2>
              <p className="mt-4 text-graphite-400 text-pretty leading-relaxed">
                Każdy artysta na platformie przechodzi weryfikację. Przeglądaj profile z portfolio, specjalizacjami, technikami i opiniami od poprzednich zlecających. Porównaj wyceny i terminy, zanim zdecydujesz.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Profile z biografią, specjalizacjami i galerią prac',
                  'Opinie i oceny od poprzednich zlecających',
                  'Zakresy cenowe i terminy realizacji',
                  'Bezpośrednia komunikacja w panelu projektu',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-graphite-500">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600"><Check className="h-3 w-3" /></span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/artysci">
                  <Button variant="primary">Przeglądaj artystów <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="rounded-2xl border border-graphite-400/10 bg-ivory-100 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-graphite-600">Dlaczego warto zlecać artystom z platformy?</h3>
                <Badge color="gold">Zweryfikowani</Badge>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: <Eye className="h-5 w-5" />, title: 'Pełna przejrzystość', desc: 'Portfolio, ceny i opinie są publiczne. Wiesz, za co płacisz.' },
                  { icon: <Layers className="h-5 w-5" />, title: 'Różne techniki', desc: 'Olej, akryl, akwarela, media mieszane - wybierz technikę.' },
                  { icon: <MessageSquare className="h-5 w-5" />, title: 'Komunikacja', desc: 'Komentarze pod zleceniem i wiadomości w panelu projektu.' },
                  { icon: <Shield className="h-5 w-5" />, title: 'Bezpieczeństwo', desc: 'Płatność w dwóch etapach, certyfikat autentyczności.' },
                ].map((f) => (
                  <div key={f.title} className="rounded-xl border border-graphite-400/10 bg-ivory-50 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ivory-300 text-graphite-400">{f.icon}</div>
                    <h4 className="mt-3 font-display text-sm text-graphite-600">{f.title}</h4>
                    <p className="mt-1 text-xs text-graphite-400 text-pretty">{f.desc}</p>
                  </div>
                ))}
              </div>
              <Link to="/artysci" className="mt-6 link-underline inline-flex items-center gap-1 text-sm text-gold-600">
                Zobacz wszystkich artystów <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Zlecenia teaser ──────────────────────────────── */

function ZleceniaTeaserSection() {
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="section-label">06 - Zlecenia</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Przykładowe zlecenia</h2>
              <p className="mt-4 max-w-xl text-graphite-400 text-pretty">
                Zobacz, jak wyglądają zlecenia na obrazy na zamówienie. Każde prowadzi do artystów, którzy aplikują z ofertami.
              </p>
            </div>
            <Link to="/zlecenia" className="link-underline hidden items-center gap-1 text-sm text-graphite-500 sm:inline-flex">
              Wszystkie zlecenia <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="mt-12 rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-label">Przykładowe zlecenia</p>
                <h3 className="mt-3 font-display text-2xl text-graphite-600">Zobacz, czego szukają zlecający</h3>
              </div>
              <Link to="/zlecenia" className="link-underline inline-flex items-center gap-1 text-sm text-graphite-500">
                Wszystkie zlecenia <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {[
                { title: 'Abstrakcja w odcieniach piasku', meta: 'Salon · 100 × 70 cm', budget: '1 500–2 500 zł', time: 'Do 30 dni' },
                { title: 'Pejzaż nadmorski do sypialni', meta: 'Akryl · 80 × 60 cm', budget: '900–1 400 zł', time: 'Do 21 dni' },
                { title: 'Nowoczesny obraz do biura', meta: 'Minimalizm · 120 × 80 cm', budget: '2 000–3 500 zł', time: 'Do 45 dni' },
              ].map((commission) => (
                <Link key={commission.title} to="/zlecenia" className="group rounded-xl border border-graphite-400/10 bg-ivory-100 p-5 transition-all hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-display text-lg leading-tight text-graphite-600 transition-colors group-hover:text-gold-600">{commission.title}</h4>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-graphite-300 transition-colors group-hover:text-gold-600" />
                  </div>
                  <p className="mt-3 text-sm text-graphite-400">{commission.meta}</p>
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-graphite-400/10 pt-4 text-xs text-graphite-400">
                    <span>{commission.budget}</span>
                    <span>{commission.time}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link to="/zlec-obraz">
                <Button variant="gold">Zleć własny obraz <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link to="/zlecenia-dla-artystow">
                <Button variant="ghost">Zlecenia dla artystów <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Blog teaser ──────────────────────────────── */

function BlogTeaserSection() {
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="section-label">07 - Blog</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Porady i inspiracje</h2>
            </div>
            <Link to="/blog" className="link-underline hidden items-center gap-1 text-sm text-graphite-500 sm:inline-flex">
              Wszystkie artykuły <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {BLOG_TEASERS.map((p, i) => (
            <Reveal key={p.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <Link to={`/blog/${p.slug}`} className="card-elegant group block p-6 transition-shadow hover:shadow-lg">
                <Badge color="stone" className="!px-2 !py-0.5">{p.category}</Badge>
                <h3 className="mt-3 font-display text-base text-graphite-600 group-hover:text-gold-600 transition-colors text-pretty leading-snug">{p.title}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-gold-600">Czytaj <ArrowRight className="h-3 w-3" /></span>
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
    <section className="py-22 bg-ivory-100">
      <div className="container-narrow">
        <Reveal>
          <div className="text-center">
            <p className="section-label">08 - FAQ</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Najczęściej zadawane pytania</h2>
          </div>
        </Reveal>
        <div className="mt-12 space-y-3">
          {OBRAZY_NA_ZAMOWIENIE_FAQS.map((faq, i) => (
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

/* ──────────────────────────────── Final CTA ──────────────────────────────── */

function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-graphite-600 py-30">
      <div className="container-narrow text-center">
        <Reveal>
          <Badge color="gold"><Sparkles className="h-3 w-3" /> Darmowe na start</Badge>
          <h2 className="mt-6 font-display text-display text-ivory-100 text-balance">
            Zleć obraz ręcznie malowany<br />
            <span className="italic text-gold-300">dopasowany do Ciebie</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-graphite-200 text-pretty leading-relaxed">
            Rejestracja i publikacja zleceń są darmowe. Opisz obraz, dodaj inspiracje i otrzymaj oferty od artystów.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/zlec-obraz">
              <Button variant="gold" size="lg">Zleć obraz <ArrowRight className="h-4 w-4" /></Button>
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
