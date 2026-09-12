import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStaticSeo } from '@/hooks/useSeo';
import { OrganizationJsonLd, FaqJsonLd } from '@/components/seo/JsonLd';
import {
  ArrowRight, ArrowUpRight, Palette, FileText, MessageCircle, Briefcase, Wallet,
  Shield, Sparkles, Check, Ruler, Eye, Send, Image as ImageIcon,
  Home, Building2, Hotel, Building, PenTool, Users, Paintbrush,
  CircleDollarSign, Inbox, Layers, MessageSquare, FolderOpen,
  UserCircle, Grid3x3, ListChecks, Coins, TrendingUp, ChevronDown,
} from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Timeline } from '@/components/ui/Timeline';
import { CommissionCard } from '@/components/features/CommissionCard';
import { OfferCard } from '@/components/features/OfferCard';
import { CommentCard } from '@/components/features/CommentCard';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { mockCommissions, mockArtistProfiles, mockOffers, mockComments, mockProjects } from '@/lib/mockData';
import { SeoImage, HeroImage } from '@/components/ui/SeoImage';
import { commissionInspirationAlt, portfolioAlt, sectionImageAlt } from '@/lib/seo/alt-text';
import { formatCurrency, formatDate, timeAgo, truncate } from '@/lib/utils';
import { HOMEPAGE_FAQS } from '@/lib/seo/metadata';
import { useArtists } from '@/hooks/useArtists';
import { usePublicCommissions } from '@/hooks/usePublicCommissions';
import type { CommissionRequest } from '@/types';

const audienceImages = {
  individual: 'https://images.pexels.com/photos/13141770/pexels-photo-13141770.jpeg?auto=compress&cs=tinysrgb&w=800',
  architect: 'https://images.pexels.com/photos/9616959/pexels-photo-9616959.jpeg?auto=compress&cs=tinysrgb&w=800',
  developer: 'https://images.pexels.com/photos/14998334/pexels-photo-14998334.jpeg?auto=compress&cs=tinysrgb&w=800',
  office: 'https://images.pexels.com/photos/518244/pexels-photo-518244.jpeg?auto=compress&cs=tinysrgb&w=800',
  hotel: 'https://images.pexels.com/photos/34607320/pexels-photo-34607320.jpeg?auto=compress&cs=tinysrgb&w=800',
  artist: 'https://images.pexels.com/photos/3777875/pexels-photo-3777875.jpeg?auto=compress&cs=tinysrgb&w=800',
};

export function LandingPage() {
  useStaticSeo('/');
  const { commissions: publicCommissions } = usePublicCommissions();
  const sampleCommission = mockCommissions[0];
  const sampleOffers = mockOffers.filter((o) => o.commissionId === sampleCommission.id);
  const sampleComments = mockComments.filter((c) => c.commissionId === sampleCommission.id);
  const sampleProject = mockProjects[0];
  const openCommissions = mockCommissions.filter((c) => c.status === 'offers_open' || c.status === 'published');
  const showcaseCommissions = publicCommissions.slice(0, 6);

  return (
    <div>
      <OrganizationJsonLd />
      <FaqJsonLd faqs={[...HOMEPAGE_FAQS]} />
      <HeroSection />
      <div className="cv-auto">
      <InteriorDopasowanieSection />
      <HowItWorksSection />
      <ZnajdzArtysteSection />
      <SampleCommissionsSection commissions={showcaseCommissions} />
      <PlatformPreviewSection />
      <SampleCommissionSection
        commission={sampleCommission}
        offers={sampleOffers}
        comments={sampleComments}
      />
      <DlaKogoSection />
      <PublishingEaseSection />
      <ClientPanelSection />
      <ArtistPanelSection />
      <BlogTeaserSection />
      <FaqSection />
      <FinalCTASection />
      </div>

      <ProjectDashboardPreview project={sampleProject} />
    </div>
  );
}

/* ──────────────────────────────── Section 1: Hero ──────────────────────────────── */

function HeroSection() {
  const heroCommission = mockCommissions[0];
  const heroComments = mockComments.filter((c) => c.commissionId === heroCommission.id).slice(0, 2);
  const heroOffers = mockOffers.filter((o) => o.commissionId === heroCommission.id);

  return (
    <section className="relative overflow-hidden bg-ivory-100 pt-20 pb-30">
      <div className="container-gallery">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          {/* Left: copy + CTAs */}
          <div>
            <Reveal>
              <Badge color="gold"><Sparkles className="h-3 w-3" /> Marketplace ręcznie malowanych obrazów</Badge>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="mt-6 font-display text-hero text-graphite-600 text-balance">
                Obrazy ręcznie malowane na zamówienie<br />
                <span className="italic text-gold-500">od zweryfikowanych artystów</span>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-8 max-w-lg text-lg text-graphite-400 text-pretty leading-relaxed">
                Opisz, jakiego obrazu szukasz, dodaj inspiracje i otrzymaj propozycje od artystów malarzy. Rejestracja i publikacja zleceń są darmowe.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/zamow-obraz">
                  <Button variant="primary" size="lg">Zamów obraz <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link to="/obrazy-na-zamowienie">
                  <Button variant="secondary" size="lg">Obrazy na zamówienie</Button>
                </Link>
                <Link to="/zlecenia">
                  <Button variant="ghost" size="lg">Zobacz zlecenia</Button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={4}>
              <div className="mt-12 flex flex-wrap items-center gap-8">
                {[
                  { num: '120+', label: 'Zweryfikowanych artystów' },
                  { num: '450+', label: 'Zrealizowanych obrazów' },
                  { num: '0 zł', label: 'Rejestracja i publikacja' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-3xl text-graphite-600">{stat.num}</p>
                    <p className="mt-1 text-xs text-graphite-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: platform mockup */}
          <Reveal delay={2}>
            <HeroMockup
              commission={heroCommission}
              comments={heroComments}
              offerCount={heroOffers.length}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HeroMockup({
  commission,
  comments,
  offerCount,
}: {
  commission: typeof mockCommissions[0];
  comments: typeof mockComments;
  offerCount: number;
}) {
  return (
    <div className="relative">
      {/* Inspiration photos collage */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
            <HeroImage src="/hero-inspiration-1.png" alt={commissionInspirationAlt(commission, 0)} className="h-full w-full object-cover" />
          </div>
          <div className="aspect-square overflow-hidden rounded-2xl shadow-lg">
            <HeroImage src="/abstract-painting-inspiration.webp" alt={commissionInspirationAlt(commission, 1)} className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="space-y-4 pt-12">
          <div className="aspect-square overflow-hidden rounded-2xl shadow-lg">
            <img
              src="/hero-inspiration-2.png"
              alt={commissionInspirationAlt(commission, 2)}
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              onError={(e) => { if (e.currentTarget.src !== '/abstract-painting-inspiration.webp') { e.currentTarget.onerror = null; e.currentTarget.src = '/abstract-painting-inspiration.webp'; } }}
            />
          </div>
          <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-ultra-wide text-success">Otwarte</span>
              <span className="flex items-center gap-1 text-xs text-graphite-300"><Eye className="h-3 w-3" /> {commission.views}</span>
            </div>
            <h3 className="mt-2 font-display text-lg text-graphite-600 leading-tight">{truncate(commission.title, 48)}</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {commission.preferredColors.slice(0, 4).map((c) => (
                <span key={c} className="rounded-full bg-ivory-200 px-2.5 py-0.5 text-xs text-graphite-400">{c}</span>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-graphite-400">
                <Ruler className="h-3.5 w-3.5 text-graphite-200" />
                {commission.widthCm}×{commission.heightCm} cm
              </div>
              <div className="flex items-center gap-1.5 text-graphite-400">
                <Wallet className="h-3.5 w-3.5 text-graphite-200" />
                {formatCurrency(commission.budgetMin)}–{formatCurrency(commission.budgetMax)}
              </div>
            </div>
            <div className="mt-4 border-t border-graphite-400/10 pt-3">
              <p className="font-mono text-xs uppercase tracking-wide text-gold-500">{offerCount} oferty od artystów</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating: artist comments */}
      <div className="absolute -bottom-6 -left-4 max-w-[280px] rounded-2xl border border-graphite-400/10 bg-ivory-50 p-4 shadow-2xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-ultra-wide text-graphite-300">Komentarze artystów</p>
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2.5">
              <Avatar name={c.authorName} src={c.authorName === 'Hanna Nowak' ? '/avatar-maja-sokolowska.webp' : c.authorAvatarUrl} size="xs" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-graphite-600">{c.authorName}</span>
                  <Badge color="gold" className="!px-1.5 !py-0">Artysta</Badge>
                </div>
                <p className="mt-0.5 text-xs text-graphite-400 text-pretty leading-snug">{truncate(c.body, 90)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating: applying artists */}
      <div className="absolute top-0 -right-4 rounded-2xl border border-graphite-400/10 bg-graphite-600 px-5 py-4 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {mockArtistProfiles.slice(0, 3).map((a, idx) => (
              <Avatar key={a.userId} name={a.artistName} src={['/artist-with-painting-alt.png', '/avatar-lena-wojcik.webp', '/avatar-maja-sokolowska.webp'][idx]} size="xs" className="border-2 border-graphite-600" />
            ))}
          </div>
          <div>
            <p className="text-sm font-medium text-ivory-100">{offerCount} artystów</p>
            <p className="text-xs text-graphite-200">aplikuje teraz</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────── Section 2: Zamów obraz dopasowany do wnętrza ──────────────────── */

function InteriorDopasowanieSection() {
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal>
            <div>
              <p className="section-label">01 - Dopasowanie</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">
                Zamów obraz dopasowany do Twojego wnętrza
              </h2>
              <p className="mt-4 text-graphite-400 text-pretty leading-relaxed">
                Każdy obraz powstaje na podstawie Twojego opisu i inspiracji. Artyści dopasowują styl, paletę i kompozycję do przestrzeni - salonu, sypialni, biura lub hotelu.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Określasz wymiary, styl i paletę kolorów',
                  'Dodajesz zdjęcia wnętrza i obrazów referencyjnych',
                  'Artyści dopasowują ofertę do Twojego budżetu i terminu',
                  'Otrzymujesz unikatowy, ręcznie malowany obraz z certyfikatem',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-graphite-500">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600"><Check className="h-3 w-3" /></span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/zamow-obraz">
                  <Button variant="primary">Zamów obraz <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link to="/zlec-obraz" className="link-underline inline-flex items-center gap-1 text-sm text-graphite-500">
                  Jak działa zlecenie? <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { img: '/section-painting-warm.png', label: 'Salon', path: '/obrazy-do-salonu' },
                { img: audienceImages.office, label: 'Biuro', path: '/obrazy-do-biura' },
                { img: audienceImages.hotel, label: 'Hotel', path: '/obrazy-do-hotelu' },
              ].map((item, i) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`group relative overflow-hidden rounded-2xl shadow-lg ${i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-[4/5]'}`}
                >
                  <SeoImage src={item.img} fallbackSrc="/abstract-painting-inspiration.webp" alt={sectionImageAlt(`Obrazy do ${item.label.toLowerCase()} - inspiracje do zlecenia`)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite-700/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="font-display text-lg text-ivory-100">Obrazy do {item.label === 'Salon' ? 'salonu' : item.label === 'Biuro' ? 'biur' : 'hoteli'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── Section 3: Jak działa zlecenie obrazu? ──────────────────── */

function HowItWorksSection() {
  const steps = [
    { icon: <PenTool className="h-6 w-6" />, title: 'Opisz obraz', desc: 'Tytuł, styl, nastrój, pomieszczenie - opisz, jakiego obrazu szukasz.' },
    { icon: <ImageIcon className="h-6 w-6" />, title: 'Dodaj zdjęcia inspiracyjne', desc: 'Załącz inspiracje - wnętrze, paletę, obrazy, które Ci się podobają.' },
    { icon: <MessageSquare className="h-6 w-6" />, title: 'Artyści komentują i wysyłają oferty', desc: 'Zweryfikowani artyści zadają pytania, dodają prace i składają formalne oferty.' },
    { icon: <Users className="h-6 w-6" />, title: 'Wybierasz artystę', desc: 'Porównaj portfolio, wyceny i terminy. Akceptuj ofertę, która Ci odpowiada.' },
    { icon: <Wallet className="h-6 w-6" />, title: 'Śledzisz realizację i płatności', desc: 'Dashboard z etapami, zdjęciami postępu, zaliczką i płatnością końcową.' },
  ];

  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">02 - Proces</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Jak działa zlecenie obrazu?</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Od opisu zlecenia do zawieszenia na ścianie - pięć kroków.</p>
          </div>
        </Reveal>
        <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
              <div className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-12 top-6 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-graphite-400/20 to-transparent lg:block" />
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-graphite-600 text-ivory-100">
                  {step.icon}
                </div>
                <p className="mt-5 font-mono text-xs text-gold-500">Krok {i + 1}</p>
                <h3 className="mt-2 font-display text-xl text-graphite-600">{step.title}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={2}>
          <div className="mt-10 text-center">
            <Link to="/zlec-obraz" className="link-underline inline-flex items-center gap-1 text-sm text-graphite-500">
              Dowiedz się więcej o procesie zlecania <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────── Section 4: Znajdź artystę ──────────────────── */

const FEATURED_ARTIST_NAMES = [
  'Oskar Renski',
  'Nikodem Halicki',
  'Irena Falska',
  'Honorata Czech',
];

function ZnajdzArtysteSection() {
  const { artists: databaseArtists } = useArtists();
  const artists = FEATURED_ARTIST_NAMES
    .map((name) => databaseArtists.find((artist) => artist.artistName === name))
    .filter((artist): artist is NonNullable<typeof artist> => Boolean(artist));
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="section-label">03 - Artyści</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Znajdź artystę</h2>
              <p className="mt-4 max-w-xl text-graphite-400 text-pretty">
                Zweryfikowani artyści malarze z portfolio, specjalizacjami i opiniami. Każdy tworzy ręcznie malowane obrazy na zamówienie.
              </p>
            </div>
            <Link to="/artysci" className="link-underline hidden items-center gap-1 text-sm text-graphite-500 sm:inline-flex">
              Wszyscy artyści <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {artists.map((a, i) => (
            <Reveal key={a.userId} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <Link to={`/artysci/${a.slug}`} className="card-elegant group block overflow-hidden transition-shadow hover:shadow-lg">
                <div className="grid grid-cols-3 gap-px bg-graphite-400/5">
                  {a.portfolio.slice(0, 3).map((item) => (
                    <div key={item.id} className="aspect-square overflow-hidden">
                      <SeoImage src={item.imageUrl} fallbackSrc="/abstract-painting-inspiration.webp" alt={portfolioAlt(a, item)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ))}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={a.artistName} src={a.avatarUrl} size="sm" />
                    <div>
                      <h3 className="font-display text-sm text-graphite-600 group-hover:text-gold-600 transition-colors">{a.artistName}</h3>
                      <p className="text-xs text-graphite-300">{a.location} · {a.yearsExperience} lat</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {a.specializations?.slice(0, 2).map((s) => (
                      <Badge key={s} color="stone" className="!px-2 !py-0.5">{s}</Badge>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-graphite-300">
                    <span>od {formatCurrency(a.priceRangeMin)}</span>
                    <span className="flex items-center gap-0.5">
                      <span className="text-gold-500">{a.stats.averageRating}</span>
                      <span>({a.stats.reviewCount})</span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={2}>
          <div className="mt-8 text-center lg:hidden">
            <Link to="/artysci">
              <Button variant="secondary">Wszyscy artyści <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────── Section 5: Zobacz przykładowe zlecenia ──────────────────── */

function SampleCommissionsSection({ commissions }: { commissions: CommissionRequest[] }) {
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="section-label">04 - Zlecenia</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Zobacz przykładowe zlecenia</h2>
              <p className="mt-4 max-w-xl text-graphite-400 text-pretty">
                Otwarte zlecenia na ręcznie malowane obrazy. Każde prowadzi do artystów, którzy aplikują z ofertami.
              </p>
            </div>
            <Link to="/zlecenia" className="link-underline hidden items-center gap-1 text-sm text-graphite-500 sm:inline-flex">
              Wszystkie zlecenia <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {commissions.slice(0, 3).map((c, i) => (
            <Reveal key={c.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <CommissionCard commission={c} isPublicPreview to="/zlecenia" />
            </Reveal>
          ))}
        </div>
        <Reveal delay={2}>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/zlecenia">
              <Button variant="secondary">Wszystkie zlecenia <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/zlecenia-dla-artystow">
              <Button variant="ghost">Zlecenia dla artystów <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────── Section 6: Platform preview after registration ──────────────────── */

const platformTabs = [
  { id: 'form', label: 'Formularz zlecenia', icon: <FileText className="h-4 w-4" /> },
  { id: 'commission', label: 'Zlecenie z inspiracjami', icon: <ImageIcon className="h-4 w-4" /> },
  { id: 'comments', label: 'Komentarze artystów', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'client', label: 'Panel zlecającego', icon: <Briefcase className="h-4 w-4" /> },
  { id: 'artist', label: 'Panel artysty', icon: <Paintbrush className="h-4 w-4" /> },
  { id: 'project', label: 'Dashboard realizacji', icon: <Layers className="h-4 w-4" /> },
] as const;

type PlatformTabId = typeof platformTabs[number]['id'];

function PlatformPreviewSection() {
  const [tab, setTab] = useState<PlatformTabId>('form');
  const sampleCommission = mockCommissions[0];
  const sampleComments = mockComments.filter((c) => c.commissionId === sampleCommission.id);
  const sampleOffers = mockOffers.filter((o) => o.commissionId === sampleCommission.id);

  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">05 - Platforma</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Zobacz, jak wygląda platforma po rejestracji</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Przełącz między widokami, aby zobaczyć każdy element serwisu - od formularza po dashboard realizacji.</p>
          </div>
        </Reveal>

        {/* Tab bar */}
        <Reveal delay={1}>
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {platformTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  tab === t.id
                    ? 'bg-graphite-600 text-ivory-100 shadow-lg shadow-graphite-600/10'
                    : 'border border-graphite-400/20 text-graphite-400 hover:border-graphite-400/40 hover:text-graphite-600'
                }`}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Tab content */}
        <Reveal delay={2}>
          <div className="mt-10 rounded-2xl border border-graphite-400/10 bg-ivory-100 p-6 shadow-lg sm:p-10">
            {tab === 'form' && <FormMockup />}
            {tab === 'commission' && <CommissionMockup commission={sampleCommission} />}
            {tab === 'comments' && <CommentsMockup comments={sampleComments} />}
            {tab === 'client' && <ClientPanelMockup offers={sampleOffers} />}
            {tab === 'artist' && <ArtistPanelMockup />}
            {tab === 'project' && <ProjectDashboardMockup />}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FormMockup() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
      <div className="lg:sticky lg:top-4">
        <h3 className="font-display text-2xl text-graphite-600">Formularz dodania zlecenia</h3>
        <p className="mt-3 text-sm text-graphite-400 text-pretty leading-relaxed">
          Zlecający opisuje, jakiego obrazu szuka. Każde zlecenie działa jak elegancki post marketplace - z inspiracjami, wymiarami, paletą i budżetem.
        </p>
        <ul className="mt-6 space-y-3">
          {['Tytuł i opis', 'Wymiary i orientacja', 'Styl, nastrój i kolory', 'Zdjęcia inspiracyjne', 'Budżet i termin', 'Oprawa i transport'].map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-graphite-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-100 text-gold-600"><Check className="h-3 w-3" /></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 sm:p-8">
        <div className="space-y-5">
          <Input label="Tytuł zlecenia" placeholder="np. Obraz abstrakcyjny do salonu 180×120" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Szerokość (cm)" placeholder="180" type="number" />
            <Input label="Wysokość (cm)" placeholder="120" type="number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Styl"><option>Abstrakcyjny</option><option>Realistyczny</option><option>Minimalistyczny</option><option>Strukturalny</option></Select>
            <Select label="Pomieszczenie"><option>Salon</option><option>Sypialnia</option><option>Biuro</option><option>Lobby hotelu</option></Select>
          </div>
          <Input label="Preferowane kolory (oddzielone przecinkami)" placeholder="Beżowy, Ivory, Złoty, Grafitowy" />
          <Textarea label="Opis" placeholder="Opisz, jakiego obrazu szukasz - styl, nastrój, kontekst wnętrza..." rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Budżet od (zł)" placeholder="4000" type="number" />
            <Input label="Budżet do (zł)" placeholder="8000" type="number" />
          </div>
          <div className="rounded-xl border border-dashed border-graphite-400/20 p-6 text-center">
            <ImageIcon className="mx-auto h-6 w-6 text-graphite-200" />
            <p className="mt-2 text-sm text-graphite-300">Dodaj zdjęcia inspiracyjne</p>
            <p className="text-xs text-graphite-200">PNG, JPG - max 6 zdjęć</p>
          </div>
          <Button variant="gold" className="w-full">Opublikuj zlecenie</Button>
        </div>
      </div>
    </div>
  );
}

function CommissionMockup({ commission }: { commission: typeof mockCommissions[0] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-graphite-400/10 bg-ivory-50">
      <div className="grid grid-cols-3 gap-1">
        {commission.inspirationImages.map((img, idx) => (
          <div key={img} className="aspect-[4/3] overflow-hidden">
            <SeoImage src={img} fallbackSrc="/abstract-painting-inspiration.webp" alt={commissionInspirationAlt(commission, idx)} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <Badge color="success">Otwarte</Badge>
          <span className="flex items-center gap-1 text-xs text-graphite-300"><Eye className="h-3 w-3" /> {commission.views} wyświetleń</span>
        </div>
        <h3 className="mt-4 font-display text-2xl text-graphite-600 text-balance">{commission.title}</h3>
        <p className="mt-3 text-sm text-graphite-400 text-pretty leading-relaxed">{commission.publicSummary}</p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Wymiary', value: `${commission.widthCm}×{commission.heightCm} cm` },
            { label: 'Styl', value: commission.style },
            { label: 'Budżet', value: `${formatCurrency(commission.budgetMin)} - ${formatCurrency(commission.budgetMax)}` },
            { label: 'Termin', value: formatDate(commission.deadline) },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">{item.label}</p>
              <p className="mt-1 text-sm text-graphite-600">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {commission.preferredColors.map((c) => <Badge key={c} color="clay">{c}</Badge>)}
        </div>
        <div className="mt-6 flex items-center gap-4 border-t border-graphite-400/10 pt-4 text-xs text-graphite-300">
          <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {commission.commentsCount} komentarzy</span>
          <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {commission.offersCount} ofert</span>
        </div>
      </div>
    </div>
  );
}

function CommentsMockup({ comments }: { comments: typeof mockComments }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <h3 className="font-display text-2xl text-graphite-600">Komentarze artystów</h3>
        <Badge color="neutral">{comments.length}</Badge>
      </div>
      <p className="mb-6 text-sm text-graphite-400 text-pretty">Artyści mogą zadawać pytania, dodawać zdjęcia próbek i proponować podejście - zanim złożą formalną ofertę.</p>
      <div className="divide-y divide-graphite-400/5 rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6">
        {comments.map((c) => <CommentCard key={c.id} comment={c} currentUserId="" onDelete={() => {}} onReport={() => {}} onHide={() => {}} />)}
      </div>
    </div>
  );
}

function ClientPanelMockup({ offers }: { offers: typeof mockOffers }) {
  return (
    <div>
      <h3 className="font-display text-2xl text-graphite-600">Panel zlecającego</h3>
      <p className="mt-3 text-sm text-graphite-400 text-pretty">Po rejestracji zlecający widzi swoje zlecenia, otrzymane oferty, komentarze i wiadomości w jednym miejscu.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Aktywne zlecenia', value: '3', icon: <FileText className="h-5 w-5" /> },
          { label: 'Otrzymane oferty', value: '8', icon: <Inbox className="h-5 w-5" /> },
          { label: 'Realizowane projekty', value: '2', icon: <Briefcase className="h-5 w-5" /> },
          { label: 'Wydano łącznie', value: formatCurrency(10600), icon: <Wallet className="h-5 w-5" /> },
        ].map((stat) => (
          <div key={stat.label} className="card-elegant p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ivory-300 text-graphite-400">{stat.icon}</div>
            <p className="mt-3 font-display text-2xl text-graphite-600">{stat.value}</p>
            <p className="mt-1 text-xs text-graphite-300">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-display text-lg text-graphite-600">Otrzymane oferty</h4>
          <Badge color="gold">Prywatne - widoczne tylko dla właściciela</Badge>
        </div>
        <div className="space-y-4">
          {offers.slice(0, 2).map((offer) => <OfferCard key={offer.id} offer={offer} viewer="public" />)}
        </div>
      </div>
    </div>
  );
}

function ArtistPanelMockup() {
  const artist = mockArtistProfiles[0];
  return (
    <div>
      <h3 className="font-display text-2xl text-graphite-600">Panel artysty</h3>
      <p className="mt-3 text-sm text-graphite-400 text-pretty">Artysta przegląda dostępne zlecenia, komentuje, buduje portfolio i zarządza projektami w realizacji.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Dostępne zlecenia', value: '8', icon: <FileText className="h-5 w-5" /> },
          { label: 'Wysłane oferty', value: '3', icon: <Send className="h-5 w-5" /> },
          { label: 'Aktywne projekty', value: '1', icon: <Briefcase className="h-5 w-5" /> },
          { label: 'Zarobki (łącznie)', value: formatCurrency(47600), icon: <Wallet className="h-5 w-5" /> },
        ].map((stat) => (
          <div key={stat.label} className="card-elegant p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-gold-600">{stat.icon}</div>
            <p className="mt-3 font-display text-2xl text-graphite-600">{stat.value}</p>
            <p className="mt-1 text-xs text-graphite-300">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6">
          <h4 className="font-display text-lg text-graphite-600">Dostępne zlecenia</h4>
          <div className="mt-4 space-y-3">
            {mockCommissions.slice(0, 3).map((c) => (
              <div key={c.id} className="rounded-xl border border-graphite-400/10 p-4 transition-colors hover:border-graphite-400/20">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm text-graphite-600">{truncate(c.title, 40)}</span>
                  <Badge color="success" className="!px-2 !py-0.5">Otwarte</Badge>
                </div>
                <p className="mt-1 text-xs text-graphite-300">{formatCurrency(c.budgetMin)}–{formatCurrency(c.budgetMax)} · {c.widthCm}×{c.heightCm} cm</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6">
          <h4 className="font-display text-lg text-graphite-600">Portfolio - {artist.artistName}</h4>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {artist.portfolio.map((item) => (
              <div key={item.id} className="group aspect-square overflow-hidden rounded-lg">
                <SeoImage src={item.imageUrl} fallbackSrc="/abstract-painting-inspiration.webp" alt={portfolioAlt(artist, item)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectDashboardMockup() {
  const project = mockProjects[0];
  return (
    <div className="rounded-2xl border border-graphite-500/30 bg-graphite-700 p-6 shadow-2xl sm:p-8">
      <div className="flex items-center gap-3">
        <Avatar name={project.artistName} src={project.artistAvatarUrl} size="md" />
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">Artysta</p>
          <p className="font-display text-lg text-ivory-100">{project.artistName}</p>
        </div>
      </div>
      <h3 className="mt-4 font-display text-xl text-ivory-100">{project.commissionTitle}</h3>
      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-graphite-600/50 sm:grid-cols-4">
        {[
          { label: 'Cena', value: formatCurrency(project.totalPrice), accent: 'text-gold-300' },
          { label: 'Zaliczka 40%', value: formatCurrency(project.depositAmount), sub: 'Opłacona', subColor: 'text-success-light' },
          { label: 'Płatność końcowa', value: formatCurrency(project.finalAmount), sub: 'Oczekuje', subColor: 'text-graphite-400' },
          { label: 'Ukończenie', value: formatDate(project.estimatedCompletion), sub: undefined, subColor: '' },
        ].map((item) => (
          <div key={item.label} className="bg-graphite-700 p-4">
            <p className="font-mono text-xs uppercase text-graphite-300">{item.label}</p>
            <p className={`mt-1 font-display text-lg ${item.accent ?? 'text-ivory-100'}`}>{item.value}</p>
            {item.sub && <p className={`mt-1 text-xs ${item.subColor}`}>{item.sub}</p>}
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">Etapy realizacji</p>
          <div className="mt-4 rounded-xl bg-graphite-600/30 p-5">
            <Timeline milestones={project.milestones} />
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">Zdjęcia postępu</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {project.progressImages.map((img) => (
              <div key={img.id} className="group aspect-square overflow-hidden rounded-lg border border-graphite-500/30">
                <SeoImage src={img.imageUrl} fallbackSrc="/abstract-painting-inspiration.webp" alt={img.caption} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────── Section 7: Sample commission (full) ──────────────────── */

function SampleCommissionSection({
  commission,
  offers,
  comments,
}: {
  commission: typeof mockCommissions[0];
  offers: typeof mockOffers;
  comments: typeof mockComments;
}) {
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">06 - Przykładowe zlecenie</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Zlecenie w pełnej krasie</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Gość widzi ograniczony podgląd. Zalogowani artyści widzą pełny opis, mogą komentować i wysyłać oferty.</p>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            {/* Left: commission detail */}
            <div className="overflow-hidden rounded-2xl border border-graphite-400/10 bg-ivory-50 shadow-sm">
              <div className="grid grid-cols-3 gap-1">
                {commission.inspirationImages.map((img, idx) => (
                  <div key={img} className="aspect-[4/3] overflow-hidden">
                    <SeoImage src={img} fallbackSrc="/abstract-painting-inspiration.webp" alt={commissionInspirationAlt(commission, idx)} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <Badge color="success">Otwarte</Badge>
                  <span className="flex items-center gap-1 text-xs text-graphite-300"><Eye className="h-3 w-3" /> {commission.views} wyświetleń</span>
                </div>
                <h3 className="mt-4 font-display text-2xl text-graphite-600 text-balance">{commission.title}</h3>
                <p className="mt-3 text-sm text-graphite-400 text-pretty leading-relaxed">{commission.privateDescription}</p>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: 'Wymiary', value: `${commission.widthCm}×${commission.heightCm} cm` },
                    { label: 'Styl', value: commission.style },
                    { label: 'Budżet', value: `${formatCurrency(commission.budgetMin)} - ${formatCurrency(commission.budgetMax)}` },
                    { label: 'Termin', value: formatDate(commission.deadline) },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">{item.label}</p>
                      <p className="mt-1 text-sm text-graphite-600">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {commission.preferredColors.map((c) => <Badge key={c} color="clay">{c}</Badge>)}
                </div>

                {/* Comments preview */}
                <div className="mt-8 border-t border-graphite-400/10 pt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-display text-lg text-graphite-600">Komentarze artystów</h4>
                    <Badge color="neutral">{comments.length}</Badge>
                  </div>
                  <div className="divide-y divide-graphite-400/5">
                    {comments.slice(0, 3).map((c) => <CommentCard key={c.id} comment={c} currentUserId="" onDelete={() => {}} onReport={() => {}} onHide={() => {}} />)}
                  </div>
                </div>

                <Link to={`/zlecenia/${commission.slug}`} className="mt-6 inline-flex">
                  <Button variant="gold">Zobacz przykład <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </div>

            {/* Right: offers (private) */}
            <div>
              <div className="rounded-2xl border border-graphite-400/10 bg-graphite-600 p-6 text-ivory-100">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gold-300" />
                  <span className="font-mono text-xs uppercase tracking-ultra-wide text-gold-300">Widoczne tylko dla właściciela</span>
                </div>
                <h3 className="mt-3 font-display text-xl text-ivory-100">Formalne oferty</h3>
                <p className="mt-2 text-sm text-graphite-200">Tylko zlecający, dany artysta i admin widzą oferty.</p>
              </div>
              <div className="mt-4 space-y-4">
                {offers.slice(0, 3).map((offer) => (
                  <OfferCard key={offer.id} offer={offer} viewer="public" />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────── Section 8: Dla kogo jest ArtHub? ──────────────────── */

function DlaKogoSection() {
  const audiences = [
    { img: audienceImages.individual, icon: <Home className="h-5 w-5" />, title: 'Klienci indywidualni', desc: 'Zamów unikatowy obraz do domu lub mieszkania - dopasowany do wnętrza, nastrój i budżetu.' },
    { img: audienceImages.architect, icon: <PenTool className="h-5 w-5" />, title: 'Architekci wnętrz', desc: 'Skompletuj obrazy dla klientów. Zlecaj seriami, koordynuj paletę i styl między pomieszczeniami.' },
    { img: audienceImages.developer, icon: <Building2 className="h-5 w-5" />, title: 'Deweloperzy', desc: 'Wyposaż apartamenty pokazowe w autorskie obrazy. Zdobywaj materiały marketingowe i wyróżnij ofertę.' },
    { img: audienceImages.office, icon: <Building className="h-5 w-5" />, title: 'Firmy i biura', desc: 'Obrazy do recepcji, biur i przestrzeni spotkań. Buduj wizerunek i atmosferę zaufania.' },
    { img: audienceImages.hotel, icon: <Hotel className="h-5 w-5" />, title: 'Hotele i restauracje', desc: 'Spójne serie obrazów do pokoi, lobby i stref gastronomicznych. Verniks UV i oprawa w ofercie.' },
    { img: audienceImages.artist, icon: <Palette className="h-5 w-5" />, title: 'Artyści malarze', desc: 'Zdobądź zlecenia, buduj portfolio i zarządzaj realizacjami. Dołącz za darmo i aplikuj do otwartych zleceń.' },
  ];

  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">07 - Odbiorcy</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Dla kogo jest Artiors?</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Atelier łączy wszystkich, którzy szukają unikatowych, ręcznie malowanych obrazów z artystami, którzy je tworzą.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <div className="card-elegant group overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <SeoImage src={a.img} fallbackSrc="/abstract-painting-inspiration.webp" alt={sectionImageAlt(a.title)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite-700/70 via-graphite-700/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-ivory-100">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-graphite-700/60 backdrop-blur-sm">{a.icon}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-graphite-600">{a.title}</h3>
                  <p className="mt-2 text-sm text-graphite-400 text-pretty">{a.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── Section 9: Dla artystów / Dla klientów ──────────────────── */

function PublishingEaseSection() {
  const steps = [
    { icon: <PenTool className="h-5 w-5" />, title: 'Opisz potrzebę', desc: 'Tytuł, styl, pomieszczenie, nastrój - czym bardziej precyzyjnie, tym lepsze oferty.' },
    { icon: <Ruler className="h-5 w-5" />, title: 'Wybierz wymiary', desc: 'Szerokość i wysokość w centymetrach. Orientacja pozioma, pionowa lub kwadrat.' },
    { icon: <Palette className="h-5 w-5" />, title: 'Wybierz styl i kolory', desc: 'Preferowane kolory i kolory do uniknięcia. Styl: abstrakcja, realizm, minimalizm...' },
    { icon: <ImageIcon className="h-5 w-5" />, title: 'Dodaj inspiracje', desc: 'Załącz zdjęcia wnętrza, palety, obrazów. Do 6 zdjęć w PNG lub JPG.' },
    { icon: <Wallet className="h-5 w-5" />, title: 'Ustaw budżet i termin', desc: 'Zakres cenowy i termin realizacji. Artyści dopasują ofertę do Twoich oczekiwań.' },
    { icon: <Send className="h-5 w-5" />, title: 'Opublikuj', desc: 'Kliknij i zlecenie jest live. Artyści dostają powiadomienie i zaczynają aplikować.' },
  ];

  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="section-label">08 - Dla klientów</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Dla klientów</h2>
              <p className="mt-4 text-graphite-400 text-pretty leading-relaxed">
                Cały proces zajmuje kilka minut. Formularz prowadzi krok po kroku - od opisu po publikację. Nie potrzebujesz doświadczenia w sztuce, wystarczy opisać, czego szukasz.
              </p>
              <div className="mt-8 rounded-2xl border border-gold-200/40 bg-gold-50 p-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-gold-600" />
                  <span className="font-mono text-xs uppercase tracking-wide text-gold-700">Darmowe na start</span>
                </div>
                <p className="mt-2 text-sm text-graphite-500 text-pretty">Rejestracja i publikacja zleceń są darmowe. Płacisz tylko za obraz, gdy akceptujesz ofertę artysty.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/zamow-obraz">
                  <Button variant="primary">Zamów obraz <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link to="/dla-zlecajacych">
                  <Button variant="secondary">Dla zlecających</Button>
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div className="card-elegant p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-graphite-600 text-ivory-100">{step.icon}</div>
                    <span className="font-mono text-2xl text-graphite-200">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg text-graphite-600">{step.title}</h3>
                  <p className="mt-2 text-sm text-graphite-400 text-pretty">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── Section 10: Client panel ──────────────────── */

function ClientPanelSection() {
  const features = [
    { icon: <FolderOpen className="h-5 w-5" />, title: 'Moje zlecenia', desc: 'Wszystkie zlecenia w jednym miejscu - szkice, otwarte, w realizacji i zakończone.' },
    { icon: <Inbox className="h-5 w-5" />, title: 'Otrzymane oferty', desc: 'Formalne oferty od artystów z ceną, terminem i zakresem materiałów.' },
    { icon: <MessageSquare className="h-5 w-5" />, title: 'Komentarze artystów', desc: 'Pytania, propozycje i próbki od artystów pod każdym zleceniem.' },
    { icon: <MessageCircle className="h-5 w-5" />, title: 'Wiadomości', desc: 'Bezpośrednia komunikacja z artystą w ramach projektu lub zlecenia.' },
    { icon: <Users className="h-5 w-5" />, title: 'Wybór artysty', desc: 'Porównaj portfolio, wyceny i opinie. Akceptuj ofertę jednym kliknięciem.' },
    { icon: <Layers className="h-5 w-5" />, title: 'Dashboard realizacji', desc: 'Etapowy podgląd prac, zdjęcia postępu i wiadomości w panelu projektu.' },
    { icon: <CircleDollarSign className="h-5 w-5" />, title: 'Zaliczka', desc: 'Bezpieczna płatność zaliczki po akceptacji oferty - artysta rozpoczyna pracę.' },
    { icon: <Coins className="h-5 w-5" />, title: 'Płatność końcowa', desc: 'Finałowa płatność po akceptacji ukończonego obrazu. Certyfikat autentyczności w cenie.' },
  ];

  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">09 - Panel zlecającego</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Wszystko, czego potrzebuje zlecający</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Od publikacji zlecenia po odbiór obrazu - każdy etap w jednym panelu.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="card-elegant p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ivory-300 text-graphite-400">{f.icon}</div>
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

/* ──────────────────── Section 11: Dla artystów ──────────────────── */

function ArtistPanelSection() {
  const features = [
    { icon: <UserCircle className="h-5 w-5" />, title: 'Profil artysty', desc: 'Zweryfikowany profil z biografią, specjalizacjami, technikami i zakresem cen.' },
    { icon: <Grid3x3 className="h-5 w-5" />, title: 'Portfolio', desc: 'Galeria prac z wymiarami, techniką i ceną. Pokazuj, co potrafisz.' },
    { icon: <ListChecks className="h-5 w-5" />, title: 'Dostępne zlecenia', desc: 'Przeglądaj otwarte zlecenia, filtruj po stylu, wymiarach i budżecie.' },
    { icon: <MessageSquare className="h-5 w-5" />, title: 'Komentarze pod zleceniem', desc: 'Zadawaj pytania, dodawaj zdjęcia próbek i buduj relację przed ofertą.' },
    { icon: <ImageIcon className="h-5 w-5" />, title: 'Dodawanie zdjęć', desc: 'Załączaj zdjęcia próbek, studiów i prac w toku do komentarzy i projektu.' },
    { icon: <Send className="h-5 w-5" />, title: 'Formalne oferty', desc: 'Składaj oferty z ceną, terminem, zakresem materiałów, oprawy i transportu.' },
    { icon: <Briefcase className="h-5 w-5" />, title: 'Projekty w realizacji', desc: 'Zarządzaj etapami, uploaduj zdjęcia postępu i komunikuj się z klientem.' },
    { icon: <TrendingUp className="h-5 w-5" />, title: 'Rozliczenia', desc: 'Przejrzyste rozliczenia zaliczek i płatności końcowych w panelu billingowym.' },
  ];

  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">10 - Dla artystów</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Dla artystów</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Znajdź zlecenia, aplikuj, realizuj projekty i rozlicz się - w jednym miejscu.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="card-elegant p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-600">{f.icon}</div>
                <h3 className="mt-4 font-display text-lg text-graphite-600">{f.title}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={2}>
          <div className="mt-10 text-center">
            <Link to="/zlecenia-dla-artystow">
              <Button variant="secondary">Zlecenia dla artystów <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/dla-artystow" className="ml-4 link-underline inline-flex items-center gap-1 text-sm text-graphite-500">
              Dowiedz się więcej <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────── Section 13: Blog teaser ──────────────────── */

function BlogTeaserSection() {
  const posts = [
    { slug: 'jak-zlecic-obraz-przewodnik', title: 'Jak zlecić obraz - kompletny przewodnik', category: 'poradniki' },
    { slug: 'ile-kosztuje-obraz-na-zamowienie', title: 'Ile kosztuje obraz na zamówienie?', category: 'obrazy-na-zamowienie' },
    { slug: 'obraz-do-salonu-jak-wybrac', title: 'Obraz do salonu - jak wybrać', category: 'wnetrza' },
  ];
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="section-label">12 - Blog</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Porady i inspiracje</h2>
            </div>
            <Link to="/blog" className="link-underline hidden items-center gap-1 text-sm text-graphite-500 sm:inline-flex">
              Wszystkie artykuły <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <Link to={`/blog/${p.slug}`} className="card-elegant group block p-6 transition-shadow hover:shadow-lg">
                <Badge color="stone" className="!px-2 !py-0.5">{p.category}</Badge>
                <h3 className="mt-3 font-display text-lg text-graphite-600 group-hover:text-gold-600 transition-colors text-pretty">{p.title}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-gold-600">Czytaj <ArrowRight className="h-3 w-3" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── Section 14: FAQ ──────────────────── */

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-narrow">
        <Reveal>
          <div className="text-center">
            <p className="section-label">13 - FAQ</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Najczęściej zadawane pytania</h2>
          </div>
        </Reveal>
        <div className="mt-12 space-y-3">
          {HOMEPAGE_FAQS.map((faq, i) => (
            <Reveal key={faq.question} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="rounded-2xl border border-graphite-400/10 bg-ivory-100 overflow-hidden">
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

/* ──────────────────── Section 15: Final CTA ──────────────────── */

function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-graphite-600 py-30">
      <div className="container-narrow text-center">
        <Reveal>
          <Badge color="gold"><Sparkles className="h-3 w-3" /> Darmowe na start</Badge>
          <h2 className="mt-6 font-display text-display text-ivory-100 text-balance">
            Zamów ręcznie malowany obraz<br />
            <span className="italic text-gold-300">dopasowany do Ciebie</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-graphite-200 text-pretty leading-relaxed">
            Rejestracja i publikacja zleceń są darmowe. Zarejestruj się jako zlecający lub artysta i dołącz do Atelier.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/zamow-obraz">
              <Button variant="gold" size="lg">Zamów obraz <ArrowRight className="h-4 w-4" /></Button>
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

/* ──────────────────── Project dashboard full preview ──────────────────── */

function ProjectDashboardPreview({ project }: { project: typeof mockProjects[0] }) {
  return (
    <section className="py-22 bg-graphite-700">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label !text-gold-300">14 - Realizacja</p>
            <h2 className="mt-4 font-display text-display text-ivory-100 text-balance">Dashboard realizacji projektu</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-200 text-pretty">Po akceptacji oferty powstaje panel z etapami, wyceną, zaliczką, zdjęciami postępu i wiadomościami.</p>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="mt-12 rounded-2xl border border-graphite-500/30 bg-graphite-600 p-6 shadow-2xl sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
              {/* Left: project info */}
              <div>
                <div className="flex items-center gap-3">
                  <Avatar name={project.artistName} src={project.artistAvatarUrl} size="md" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">Artysta</p>
                    <p className="font-display text-lg text-ivory-100">{project.artistName}</p>
                  </div>
                </div>
                <h3 className="mt-6 font-display text-xl text-ivory-100">{project.commissionTitle}</h3>
                <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-graphite-600/50">
                  <div className="bg-graphite-700 p-4">
                    <p className="font-mono text-xs uppercase text-graphite-300">Cena całkowita</p>
                    <p className="mt-1 font-display text-xl text-gold-300">{formatCurrency(project.totalPrice)}</p>
                  </div>
                  <div className="bg-graphite-700 p-4">
                    <p className="font-mono text-xs uppercase text-graphite-300">Zaliczka 40%</p>
                    <p className="mt-1 font-display text-xl text-ivory-100">{formatCurrency(project.depositAmount)}</p>
                    <p className="mt-1 text-xs text-success-light">Opłacona</p>
                  </div>
                  <div className="bg-graphite-700 p-4">
                    <p className="font-mono text-xs uppercase text-graphite-300">Płatność końcowa</p>
                    <p className="mt-1 font-display text-xl text-ivory-100">{formatCurrency(project.finalAmount)}</p>
                    <p className="mt-1 text-xs text-graphite-400">Oczekuje</p>
                  </div>
                  <div className="bg-graphite-700 p-4">
                    <p className="font-mono text-xs uppercase text-graphite-300">Ukończenie</p>
                    <p className="mt-1 font-display text-xl text-ivory-100">{formatDate(project.estimatedCompletion)}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">Etapy realizacji</p>
                  <div className="mt-4 rounded-xl bg-graphite-600/30 p-5">
                    <Timeline milestones={project.milestones} />
                  </div>
                </div>
              </div>

              {/* Right: progress + messages */}
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">Zdjęcia postępu</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {project.progressImages.map((img) => (
                    <div key={img.id} className="group aspect-square overflow-hidden rounded-lg border border-graphite-500/30">
                      <SeoImage src={img.imageUrl} fallbackSrc="/abstract-painting-inspiration.webp" alt={img.caption} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ))}
                </div>

                <p className="mt-6 font-mono text-xs uppercase tracking-wide text-graphite-300">Wiadomości</p>
                <div className="mt-4 space-y-3 rounded-xl bg-graphite-600/30 p-5">
                  {project.messages.slice(-3).map((msg) => (
                    <div key={msg.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-ivory-100">{msg.senderName}</span>
                        <span className="text-xs text-graphite-400">{msg.senderRole === 'artist' ? 'Artysta' : 'Zlecający'}</span>
                      </div>
                      <p className="mt-1 text-sm text-graphite-200 text-pretty">{msg.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
