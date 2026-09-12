import { Link } from 'react-router-dom';
import { useStaticSeo } from '@/hooks/useSeo';
import {
  ArrowRight, UserCircle, Grid3x3, FileText, MessageSquare, Image as ImageIcon,
  Send, Briefcase, Sparkles, Check, BadgeCheck, Eye, TrendingUp, Wallet,
  Paintbrush, Palette, Layers,
} from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { mockArtistProfiles, mockCommissions } from '@/lib/mockData';
import { formatCurrency, truncate } from '@/lib/utils';
import { SeoImage, HeroImage } from '@/components/ui/SeoImage';
import { sectionImageAlt, portfolioAlt } from '@/lib/seo/alt-text';

const heroImg = 'https://images.pexels.com/photos/4624252/pexels-photo-4624252.jpeg?auto=compress&cs=tinysrgb&w=800';
const paintingDetail = 'https://images.pexels.com/photos/7885473/pexels-photo-7885473.jpeg?auto=compress&cs=tinysrgb&w=800';

export function DlaArtystowPage() {
  useStaticSeo('/dla-artystow');
  return (
    <div>
      <HeroSection />
      <ProfileSection />
      <PortfolioSection />
      <MarketplaceSection />
      <CommentingSection />
      <OffersSection />
      <ProjectsSection />
      <MonetizationSection />
      <CTASection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ivory-100 pt-20 pb-20 lg:pt-28 lg:pb-28">
      <div className="container-gallery">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <Reveal>
              <Badge color="gold"><Paintbrush className="h-3 w-3" /> Dla artystów</Badge>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="mt-6 font-display text-hero text-graphite-600 text-balance">
                Otrzymuj dostęp do realnych zleceń<br />
                <span className="italic text-gold-500">na ręcznie malowane obrazy</span>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-8 max-w-lg text-lg text-graphite-400 text-pretty leading-relaxed">
                Zbuduj profil i portfolio, przeglądaj zlecenia, komentuj, dodawaj zdjęcia i wysyłaj formalne oferty. To nie sklep - to marketplace zleceń. Dołącz za darmo.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/register?role=artist">
                  <Button variant="primary" size="lg">Dołącz jako artysta <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link to="/zlecenia">
                  <Button variant="secondary" size="lg">Przeglądaj zlecenia</Button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={4}>
              <div className="mt-12 flex flex-wrap items-center gap-8">
                {[
                  { num: '8', label: 'Otwartych zleceń' },
                  { num: '120+', label: 'Artystów w społeczności' },
                  { num: '0 zł', label: 'Rejestracja i aplikowanie' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-3xl text-graphite-600">{stat.num}</p>
                    <p className="mt-1 text-xs text-graphite-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                <HeroImage src={heroImg} alt={sectionImageAlt('Artysta malarz przy pracy w pracowni')} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-square overflow-hidden rounded-2xl shadow-lg">
                  <HeroImage src={paintingDetail} alt={sectionImageAlt('Detal ręcznie malowanego obrazu - tekstura farby')} className="h-full w-full object-cover" />
                </div>
                <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-5 shadow-xl">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-gold-500" />
                    <span className="text-sm font-medium text-graphite-600">Zweryfikowany artysta</span>
                  </div>
                  <p className="mt-2 text-xs text-graphite-300">Po akceptacji profilu możesz komentować i wysyłać oferty</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ProfileSection() {
  const artist = mockArtistProfiles[0];
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal>
            <div>
              <p className="section-label">01 - Profil</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Profil artysty</h2>
              <p className="mt-4 text-graphite-400 text-pretty leading-relaxed">
                Zbuduj elegancki profil z biografią, specjalizacjami, technikami, zakresem cen i statystykami. Zweryfikowany profil buduje zaufanie zlecających.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Imię i nazwisko lub pseudonim artystyczny',
                  'Biografia i opis podejścia do malarstwa',
                  'Specjalizacje: abstrakcja, portret, pejzaż...',
                  'Techniki: olej, akryl, akwarela, mieszane media...',
                  'Lokalizacja, kontakt, linki do Instagrama i strony',
                  'Zakres cen i średni czas realizacji',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-graphite-500">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600"><Check className="h-3 w-3" /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="rounded-2xl border border-graphite-400/10 bg-ivory-100 p-6 shadow-lg sm:p-8">
              <div className="flex items-center gap-4">
                <Avatar name={artist.artistName} src={artist.avatarUrl} size="xl" className="border-4 border-ivory-50 shadow-lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-2xl text-graphite-600">{artist.artistName}</h3>
                    <Badge color="gold"><BadgeCheck className="h-3 w-3" /> Zweryfikowany</Badge>
                  </div>
                  <p className="mt-1 text-sm text-graphite-400">{artist.location} · {artist.yearsExperience} lat doświadczenia</p>
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-sm font-medium text-gold-500">{artist.stats.averageRating}</span>
                    <span className="text-xs text-graphite-300">({artist.stats.reviewCount} opinii)</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-graphite-400 text-pretty">{artist.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {artist.specializations?.map((s) => <Badge key={s} color="stone">{s}</Badge>)}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-graphite-400/10 pt-6 text-center">
                <div>
                  <p className="font-display text-xl text-graphite-600">{artist.stats.completedProjects}</p>
                  <p className="mt-1 text-xs text-graphite-300">Realizacji</p>
                </div>
                <div>
                  <p className="font-display text-xl text-graphite-600">{formatCurrency(artist.priceRangeMin)}</p>
                  <p className="mt-1 text-xs text-graphite-300">Cena od</p>
                </div>
                <div>
                  <p className="font-display text-xl text-graphite-600">{artist.averageDeliveryDays} dni</p>
                  <p className="mt-1 text-xs text-graphite-300">Średni czas</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PortfolioSection() {
  const artist = mockArtistProfiles[0];
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">02 - Portfolio</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Portfolio</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Pokaż, co potrafisz. Każda praca ma tytuł, technikę, wymiary i opcjonalnie cenę. Portfolio jest publiczne - widzą je zlecający.</p>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {mockArtistProfiles.slice(0, 4).flatMap((a) => a.portfolio.slice(0, 2)).slice(0, 8).map((item) => (
              <div key={item.id} className="group overflow-hidden rounded-2xl border border-graphite-400/10 shadow-sm">
                <div className="aspect-square overflow-hidden">
                  <SeoImage src={item.imageUrl} fallbackSrc="/abstract-painting-inspiration.webp" alt={portfolioAlt(mockArtistProfiles[0], item)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h4 className="font-display text-sm text-graphite-600">{item.title}</h4>
                  <p className="mt-1 text-xs text-graphite-300">{item.technique} · {item.widthCm}×{item.heightCm} cm</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MarketplaceSection() {
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">03 - Zlecenia</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Marketplace zleceń</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Przeglądaj otwarte zlecenia od klientów indywidualnych, architektów, deweloperów i hoteli. Filtruj po stylu, wymiarach, budżecie i lokalizacji.</p>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockCommissions.slice(0, 6).map((c) => (
              <div key={c.id} className="card-elegant p-6">
                <div className="flex items-center justify-between">
                  <Badge color="success" className="!px-2 !py-0.5">Otwarte</Badge>
                  <span className="text-xs text-graphite-300">{c.offersCount} ofert</span>
                </div>
                <h3 className="mt-3 font-display text-lg text-graphite-600">{truncate(c.title, 42)}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-graphite-400 text-pretty">{c.publicSummary}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-graphite-300">
                  <span>{c.widthCm}×{c.heightCm} cm</span>
                  <span>{formatCurrency(c.budgetMin)} - {formatCurrency(c.budgetMax)}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={2}>
          <div className="mt-8 text-center">
            <Link to="/zlecenia" className="link-underline inline-flex items-center gap-1 text-sm text-graphite-500">
              Zobacz wszystkie zlecenia <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CommentingSection() {
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal>
            <div>
              <p className="section-label">04 - Komentarze</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Komentowanie i dodawanie zdjęć</h2>
              <p className="mt-4 text-graphite-400 text-pretty leading-relaxed">
                Zalogowani i zatwierdzeni artyści mogą komentować pod zleceniami - zadawać pytania, proponować podejście i dodawać zdjęcia próbek. To buduje relację z zlecającym przed złożeniem formalnej oferty.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Zadawaj pytania techniczne i kompozycyjne',
                  'Proponuj podejście i technikę',
                  'Dodawaj zdjęcia próbek tekstury i palety',
                  'Pokaż zlecającemu, że rozumiesz jego wizję',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-graphite-500">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600"><Check className="h-3 w-3" /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-lg">
              <p className="mb-4 font-mono text-xs uppercase tracking-ultra-wide text-graphite-300">Komentarze pod zleceniem</p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Avatar name="Artur Lewandowski" src="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200" size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-graphite-600">Artur Lewandowski</span>
                      <Badge color="gold" className="!px-1.5 !py-0">Artysta</Badge>
                    </div>
                    <p className="mt-1 text-sm text-graphite-400 text-pretty">Cześć, czy płótno ma być naciągnięte na krosno gallery wrap? I czy preferujesz werniks satynowy czy matowy?</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Avatar name="Hanna Nowak" src="https://images.pexels.com/photos/1239351/pexels-photo-1239351.jpeg?auto=compress&cs=tinysrgb&w=200" size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-graphite-600">Hanna Nowak</span>
                      <Badge color="gold" className="!px-1.5 !py-0">Artysta</Badge>
                    </div>
                    <p className="mt-1 text-sm text-graphite-400 text-pretty">Czy jesteś otwarta na złoto płatkowe jako akcent? Mogę zacytować podobną pracę z mojego portfolio.</p>
                    <div className="mt-2 flex gap-2">
                      <div className="h-16 w-16 overflow-hidden rounded-lg border border-graphite-400/10">
                        <SeoImage src="https://images.pexels.com/photos/326311/pexels-photo-326311.jpeg?auto=compress&cs=tinysrgb&w=200" fallbackSrc="/abstract-painting-inspiration.webp" alt={sectionImageAlt('Próbka tekstury farby olejnej')} className="h-full w-full object-cover" />
                      </div>
                    </div>
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

function OffersSection() {
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">05 - Oferty</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Formalne aplikacje i oferty</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Składaj formalne oferty z wyceną, terminem i zakresem. Oferty są prywatne - widzi je tylko właściciel zlecenia i admin.</p>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="mt-12 rounded-2xl border border-graphite-400/10 bg-ivory-100 p-6 shadow-lg sm:p-8">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-gold-500" />
              <span className="font-mono text-xs uppercase tracking-ultra-wide text-gold-500">Przykładowa oferta</span>
            </div>
            <p className="mt-4 text-sm text-graphite-500 text-pretty leading-relaxed">
              Zaproponuję kompozycję w trzech warstwach - grunt teksturalny, środkowa warstwa impasto w beżach i ivory, a wierzchnia warstwa złota płatkowego i grafitowych linii. W cenie: materiały, werniks UV, certyfikat autentyczności.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-graphite-400/10 sm:grid-cols-5">
              {[
                { label: 'Cena', value: '6 800 zł' },
                { label: 'Termin', value: '70 dni' },
                { label: 'Materiały', value: 'Wliczone' },
                { label: 'Transport', value: 'Wliczony' },
                { label: 'Zaliczka', value: '40%' },
              ].map((item) => (
                <div key={item.label} className="bg-ivory-50 p-4 text-center">
                  <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">{item.label}</p>
                  <p className="mt-1 font-display text-base text-graphite-600">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">06 - Realizacja</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Projekty w realizacji</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Po akceptacji oferty powstaje panel projektu z etapami, wyceną, zaliczką, zdjęciami postępu i wiadomościami.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Layers className="h-5 w-5" />, title: 'Etapy realizacji', desc: 'Szkice, studia, warstwy, werniks. Każdy etap ma termin i status.' },
            { icon: <ImageIcon className="h-5 w-5" />, title: 'Zdjęcia postępu', desc: 'Uploaduj zdjęcia na każdym etapie - zlecający śledzi pracę.' },
            { icon: <MessageSquare className="h-5 w-5" />, title: 'Wiadomości', desc: 'Komunikuj się z zlecającym w ramach projektu.' },
            { icon: <Wallet className="h-5 w-5" />, title: 'Rozliczenia', desc: 'Zaliczka po starcie, płatność końcowa po ukończeniu.' },
          ].map((f, i) => (
            <Reveal key={f.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="card-elegant p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-600">{f.icon}</div>
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

function MonetizationSection() {
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">07 - Monetyzacja</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Przyszła monetyzacja</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Na start wszystkie funkcje są darmowe. W przyszłości planujemy opcjonalne pakiety i subskrypcje.</p>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border-2 border-gold-300 bg-ivory-100 p-8 shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold-500" />
                <span className="font-mono text-xs uppercase tracking-wide text-gold-600">Teraz</span>
              </div>
              <h3 className="mt-4 font-display text-2xl text-graphite-600">Darmowe</h3>
              <p className="mt-2 text-sm text-graphite-400 text-pretty">Wszystkie funkcje są darmowe - profil, portfolio, komentarze, oferty, projekty. Bez limitów.</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="font-display text-4xl text-graphite-600">0 zł</span>
                <span className="mb-1 text-sm text-graphite-300">/ mies.</span>
              </div>
              <ul className="mt-6 space-y-2">
                {['Profil i portfolio', 'Komentarze i zdjęcia', 'Formalne oferty', 'Projekty w realizacji'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-graphite-500">
                    <Check className="h-4 w-4 text-success" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-graphite-400/10 bg-ivory-100 p-8">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-graphite-400" />
                <span className="font-mono text-xs uppercase tracking-wide text-graphite-400">Przyszłość</span>
              </div>
              <h3 className="mt-4 font-display text-2xl text-graphite-600">Pakiety</h3>
              <p className="mt-2 text-sm text-graphite-400 text-pretty">Opcjonalne pakiety z wyróżnieniem profilu, priorytetowym powiadomieniem o zleceniach i większymi limitami portfolio.</p>
              <ul className="mt-6 space-y-2">
                {['Wyróżnienie profilu w wyszukiwarce', 'Priorytetowe powiadomienia o zleceniach', 'Większe limity portfolio', 'Statystyki i analityka'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-graphite-300">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-graphite-400/20" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-graphite-400/10 bg-ivory-100 p-8">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-graphite-400" />
                <span className="font-mono text-xs uppercase tracking-wide text-graphite-400">Przyszłość</span>
              </div>
              <h3 className="mt-4 font-display text-2xl text-graphite-600">Subskrypcje</h3>
              <p className="mt-2 text-sm text-graphite-400 text-pretty">Miesięczna subskrypcja dla artystów aktywnych - pełen dostęp do premium, nielimitowanych ofert i narzędzi promocji.</p>
              <ul className="mt-6 space-y-2">
                {['Nielimitowane oferty', 'Promocja w social mediach', 'Niestandardowe portfolio', 'Wsparcie priorytetowe'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-graphite-300">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-graphite-400/20" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-8 text-center text-xs text-graphite-300">Monetyzacja jest opcjonalna. Podstawowe funkcje pozostaną dostępne dla wszystkich artystów.</p>
        </Reveal>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-graphite-600 py-20 lg:py-28">
      <div className="container-narrow text-center">
        <Reveal>
          <Badge color="gold"><Sparkles className="h-3 w-3" /> Darmowe na start</Badge>
          <h2 className="mt-6 font-display text-display text-ivory-100 text-balance">Dołącz jako artysta</h2>
          <p className="mx-auto mt-6 max-w-lg text-graphite-200 text-pretty leading-relaxed">
            Rejestracja jest darmowa. Zbuduj profil, dodaj portfolio i zacznij aplikować do zleceń.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register?role=artist">
              <Button variant="gold" size="lg">Dołącz jako artysta za darmo <ArrowRight className="h-4 w-4" /></Button>
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
