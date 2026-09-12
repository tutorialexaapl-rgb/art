import { Link } from 'react-router-dom';
import { useStaticSeo } from '@/hooks/useSeo';
import {
  ArrowRight, Home, Building, Hotel, Building2, PenTool, Ruler, Palette,
  Image as ImageIcon, MessageCircle, Users, Wallet, Shield, Lock, Check,
  Eye, Send, FileText, Sparkles, CircleDollarSign, MessageSquare,
} from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SeoImage, HeroImage } from '@/components/ui/SeoImage';
import { sectionImageAlt } from '@/lib/seo/alt-text';

const audienceImages: Record<string, string> = {
  home: 'https://images.pexels.com/photos/13141770/pexels-photo-13141770.jpeg?auto=compress&cs=tinysrgb&w=800',
  apartment: 'https://images.pexels.com/photos/6434618/pexels-photo-6434618.jpeg?auto=compress&cs=tinysrgb&w=800',
  office: 'https://images.pexels.com/photos/518244/pexels-photo-518244.jpeg?auto=compress&cs=tinysrgb&w=800',
  hotel: 'https://images.pexels.com/photos/34607320/pexels-photo-34607320.jpeg?auto=compress&cs=tinysrgb&w=800',
  developer: 'https://images.pexels.com/photos/14998334/pexels-photo-14998334.jpeg?auto=compress&cs=tinysrgb&w=800',
  architect: 'https://images.pexels.com/photos/9616959/pexels-photo-9616959.jpeg?auto=compress&cs=tinysrgb&w=800',
};

const inspirationImages = [
  'https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1145720/pexels-photo-1145720.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1697750/pexels-photo-1697750.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/161154/stained-glass-spiral-circle-pattern-161154.jpeg?auto=compress&cs=tinysrgb&w=600',
];

export function DlaZlecajacychPage() {
  useStaticSeo('/dla-zlecajacych');
  return (
    <div>
      <HeroSection />
      <AudienceSection />
      <HowToAddSection />
      <WhatToDescribeSection />
      <InspirationPhotosSection />
      <HowArtistsRespondSection />
      <HowToChooseSection />
      <PaymentSection />
      <SecuritySection />
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
              <Badge color="gold"><Sparkles className="h-3 w-3" /> Dla zlecających</Badge>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="mt-6 font-display text-hero text-graphite-600 text-balance">
                Znajdź artystę do obrazu<br />
                <span className="italic text-gold-500">stworzonego specjalnie dla Ciebie</span>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-8 max-w-lg text-lg text-graphite-400 text-pretty leading-relaxed">
                Opisz, jakiego obrazu szukasz, dodaj inspiracje i otrzymaj propozycje od zweryfikowanych artystów. Rejestracja i publikacja zleceń są darmowe.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/dashboard/client/zlecenia/nowe">
                  <Button variant="primary" size="lg">Opublikuj zlecenie <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link to="/artysci">
                  <Button variant="secondary" size="lg">Przeglądaj artystów</Button>
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                <HeroImage src={audienceImages.home} alt={sectionImageAlt('Obraz w nowoczesnym salonu - przykład aranżacji')} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-square overflow-hidden rounded-2xl shadow-lg">
                  <HeroImage src={audienceImages.apartment} alt={sectionImageAlt('Obraz w mieszkaniu - przykład dopasowania do wnętrza')} className="h-full w-full object-cover" />
                </div>
                <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-5 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success"><Check className="h-4 w-4" /></span>
                    <span className="text-sm font-medium text-graphite-600">3 oferty od artystów</span>
                  </div>
                  <p className="mt-2 text-xs text-graphite-300">Średni czas odpowiedzi: 2 dni</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AudienceSection() {
  const audiences = [
    { img: audienceImages.home, icon: <Home className="h-5 w-5" />, title: 'Dom', desc: 'Obraz do salonu, sypialni, jadalni - dopasowany do wnętrza i nastrój.' },
    { img: audienceImages.apartment, icon: <Building className="h-5 w-5" />, title: 'Mieszkanie', desc: 'Unikatowa praca, która stanie się sercem przestrzeni.' },
    { img: audienceImages.office, icon: <Building2 className="h-5 w-5" />, title: 'Biuro', desc: 'Obrazy do recepcji i przestrzeni spotkań - budują wizerunek.' },
    { img: audienceImages.hotel, icon: <Hotel className="h-5 w-5" />, title: 'Hotel', desc: 'Spójne serie do pokoi, lobby i stref gastronomicznych.' },
    { img: audienceImages.developer, icon: <Building2 className="h-5 w-5" />, title: 'Apartament pokazowy', desc: 'Autorskie obrazy, które wyróżnią ofertę dewelopera.' },
    { img: audienceImages.architect, icon: <PenTool className="h-5 w-5" />, title: 'Projekt architekta', desc: 'Skompletuj obrazy dla klientów, koordynuj paletę i styl.' },
  ];

  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">01 - Dla kogo</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Dla każdej przestrzeni i każdego celu</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Niezależnie od tego, czy urządzasz dom, projektujesz wnętrze klienta, czy wyposażasz hotel - Atelier łączy Cię z artystami.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <div className="card-elegant group overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <SeoImage src={a.img} fallbackSrc="/abstract-painting-inspiration.webp" alt={sectionImageAlt(`${a.title} - obraz do ${a.title.toLowerCase()}`)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite-700/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-graphite-700/60 text-ivory-100 backdrop-blur-sm">{a.icon}</span>
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

function HowToAddSection() {
  const steps = [
    { icon: <FileText className="h-5 w-5" />, title: 'Zarejestruj się', desc: 'Załóż darmowe konto zlecającego. Bez zobowiązań.' },
    { icon: <PenTool className="h-5 w-5" />, title: 'Opisz obraz', desc: 'Tytuł, styl, wymiary, paleta, nastrój, pomieszczenie.' },
    { icon: <ImageIcon className="h-5 w-5" />, title: 'Dodaj inspiracje', desc: 'Załącz zdjęcia wnętrza, palety i obrazów, które Ci się podobają.' },
    { icon: <Wallet className="h-5 w-5" />, title: 'Ustaw budżet i termin', desc: 'Podaj zakres cenowy i termin realizacji.' },
    { icon: <Send className="h-5 w-5" />, title: 'Opublikuj', desc: 'Zlecenie jest live - artyści dostają powiadomienie.' },
  ];

  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">02 - Publikacja</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Jak dodać zlecenie</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Proces zajmuje kilka minut. Formularz prowadzi krok po kroku.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
              <div className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-10 top-6 hidden h-px w-[calc(100%-2.5rem)] bg-gradient-to-r from-graphite-400/20 to-transparent lg:block" />
                )}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-graphite-600 text-ivory-100">{step.icon}</div>
                <p className="mt-4 font-mono text-xs text-gold-500">Krok {i + 1}</p>
                <h3 className="mt-1 font-display text-lg text-graphite-600">{step.title}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatToDescribeSection() {
  const items = [
    { icon: <Ruler className="h-4 w-4" />, label: 'Wymiary', desc: 'Szerokość i wysokość w centymetrach. Orientacja: pozioma, pionowa, kwadrat.' },
    { icon: <Palette className="h-4 w-4" />, label: 'Styl i kolory', desc: 'Abstrakcja, realizm, minimalizm... Preferowane kolory i kolory do uniknięcia.' },
    { icon: <Home className="h-4 w-4" />, label: 'Pomieszczenie', desc: 'Salon, sypialnia, biuro, lobby. Kontekst pomaga artyście dopasować pracę.' },
    { icon: <Sparkles className="h-4 w-4" />, label: 'Nastrój', desc: 'Spokojny, energiczny, elegancki, romantyczny. Nastrój określa ton obrazu.' },
    { icon: <Wallet className="h-4 w-4" />, label: 'Budżet', desc: 'Zakres od-do. Artyści dopasują ofertę do Twoich możliwości.' },
    { icon: <FileText className="h-4 w-4" />, label: 'Termin', desc: 'Data, do której obraz ma być gotowy. Realistyczny termin = lepsze oferty.' },
    { icon: <PenTool className="h-4 w-4" />, label: 'Oprawa i transport', desc: 'Czy potrzebujesz oprawy (rama) i transportu? Artyści mogą to wliczyć.' },
    { icon: <ImageIcon className="h-4 w-4" />, label: 'Inspiracje', desc: 'Zdjęcia wnętrza, palety, obrazów. Im więcej kontekstu, tym lepsza oferta.' },
  ];

  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">03 - Opis</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Jakie informacje warto podać</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Im precyzyjniej opiszesz zlecenie, tym lepsze oferty otrzymasz. Oto co warto uwzględnić.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.label} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="card-elegant p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ivory-300 text-graphite-500">{item.icon}</div>
                <h3 className="mt-4 font-display text-lg text-graphite-600">{item.label}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function InspirationPhotosSection() {
  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal>
            <div>
              <p className="section-label">04 - Inspiracje</p>
              <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Zdjęcia inspiracyjne</h2>
              <p className="mt-4 text-graphite-400 text-pretty leading-relaxed">
                Załącz zdjęcia, które pomogą artyście zrozumieć Twoją wizję. Mogą to być:
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Zdjęcia wnętrza, w którym obraz będzie wisiał',
                  'Palety kolorów i materiałów',
                  'Obrazy i style, które Ci się podobają',
                  'Detale: tekstura, kompozycja, technika',
                  'Moodboardy i renderowane wizualizacje',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-graphite-500">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600"><Check className="h-3 w-3" /></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-graphite-400 text-pretty">Możesz dodać do 6 zdjęć w formacie PNG lub JPG. Inspiracje są widoczne dla zalogowanych artystów.</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="grid grid-cols-2 gap-4">
              {inspirationImages.map((img, i) => (
                <div
                  key={img}
                  className={`overflow-hidden rounded-2xl shadow-lg ${i % 2 === 0 ? '' : 'pt-8'}`}
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                    <SeoImage src={img} fallbackSrc="/abstract-painting-inspiration.webp" alt={sectionImageAlt('Przykładowa inspiracja do zlecenia obrazu')} className="h-full w-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HowArtistsRespondSection() {
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">05 - Odpowiedź artystów</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Jak artyści odpowiadają</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Zweryfikowani artyści mogą odpowiadać na dwa sposoby - komentarze i formalne oferty.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="card-elegant p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-graphite-600 text-ivory-100">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl text-graphite-600">Komentarze pod zleceniem</h3>
              <p className="mt-2 text-sm text-graphite-400 text-pretty">Artyści mogą zadawać pytania, dodawać zdjęcia próbek i proponować podejście - zanim złożą formalną ofertę. Komentarze są widoczne publicznie pod zleceniem.</p>
              <div className="mt-6 rounded-xl border border-graphite-400/10 bg-ivory-100 p-5">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-100 text-xs font-medium text-gold-600">AL</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-graphite-600">Artur Lewandowski</span>
                      <Badge color="gold" className="!px-1.5 !py-0">Artysta</Badge>
                    </div>
                    <p className="mt-1 text-xs text-graphite-400 text-pretty">Cześć, czy płótno ma być naciągnięte na krosno gallery wrap? I czy preferujesz werniks satynowy czy matowy?</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="card-elegant p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400 text-graphite-700">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl text-graphite-600">Formalne oferty</h3>
              <p className="mt-2 text-sm text-graphite-400 text-pretty">Artyści składają formalne oferty z wyceną, terminem, zakresem materiałów, oprawy i transportu. Oferty są prywatne - widzi je tylko właściciel zlecenia, dany artysta i admin.</p>
              <div className="mt-6 rounded-xl border border-graphite-400/10 bg-ivory-100 p-5">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-gold-500" />
                  <span className="font-mono text-xs uppercase tracking-wide text-gold-500">Widoczne tylko dla właściciela</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="font-display text-lg text-graphite-600">6 800 zł</p>
                    <p className="text-xs text-graphite-300">Cena</p>
                  </div>
                  <div>
                    <p className="font-display text-lg text-graphite-600">70 dni</p>
                    <p className="text-xs text-graphite-300">Termin</p>
                  </div>
                  <div>
                    <p className="font-display text-lg text-graphite-600">40%</p>
                    <p className="text-xs text-graphite-300">Zaliczka</p>
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

function HowToChooseSection() {
  const criteria = [
    { icon: <Eye className="h-5 w-5" />, title: 'Portfolio', desc: 'Przeglądaj prace artysty - styl, technika, skala, paleta.' },
    { icon: <Users className="h-5 w-5" />, title: 'Opinie i oceny', desc: 'Sprawdź oceny i opinie od poprzednich zlecających.' },
    { icon: <Wallet className="h-5 w-5" />, title: 'Wycena', desc: 'Porównaj cenę, termin i zakres (materiały, oprawa, transport).' },
    { icon: <MessageSquare className="h-5 w-5" />, title: 'Komunikacja', desc: 'Oceń, jak artysta odpowiada na pytania i komentarze.' },
    { icon: <Check className="h-5 w-5" />, title: 'Weryfikacja', desc: 'Zweryfikowani artyści mają plakietkę zaufania.' },
    { icon: <Sparkles className="h-5 w-5" />, title: 'Dopasowanie', desc: 'Wybierz artystę, którego styl i podejście najbardziej pasują.' },
  ];

  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">06 - Wybór</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Jak wybrać artystę</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Porównaj oferty, portfolio i opinie. Akceptuj ofertę, która najbardziej Ci odpowiada.</p>
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
      </div>
    </section>
  );
}

function PaymentSection() {
  return (
    <section className="py-22 bg-ivory-50">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">07 - Płatności</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Zaliczka i płatność końcowa</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Płatność w dwóch etapach - zaliczka rozpoczyna realizację, płatność końcowa po ukończeniu obrazu.</p>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-graphite-400/10 bg-ivory-100 p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-600">
                  <CircleDollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-gold-500">Etap 1</p>
                  <h3 className="font-display text-xl text-graphite-600">Zaliczka (40%)</h3>
                </div>
              </div>
              <p className="mt-4 text-sm text-graphite-400 text-pretty">Po akceptacji oferty płacisz zaliczkę - zwykle 40% ceny. Artysta rozpoczyna pracę: szkice, studia kolorystyczne, grunt.</p>
              <ul className="mt-4 space-y-2">
                {['Artysta rozpoczyna pracę', 'Powstają szkice i studia', 'Zaliczka zabezpiecza termin'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-graphite-500">
                    <Check className="h-4 w-4 text-success" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-graphite-400/10 bg-ivory-100 p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-success">Etap 2</p>
                  <h3 className="font-display text-xl text-graphite-600">Płatność końcowa (60%)</h3>
                </div>
              </div>
              <p className="mt-4 text-sm text-graphite-400 text-pretty">Po ukończeniu obrazu i akceptacji zlecającego następuje płatność końcowa - 60% ceny. Artysta przekazuje obraz z certyfikatem autentyczności.</p>
              <ul className="mt-4 space-y-2">
                {['Akceptacja ukończonego obrazu', 'Certyfikat autentyczności', 'Przekazanie i transport'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-graphite-500">
                    <Check className="h-4 w-4 text-success" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SecuritySection() {
  const items = [
    { icon: <Shield className="h-5 w-5" />, title: 'Komunikacja przez platformę', desc: 'Wszystkie wiadomości i komentarze odbywają się przez Atelier. Nie udostępniamy danych kontaktowych publicznie.' },
    { icon: <Lock className="h-5 w-5" />, title: 'Prywatność ofert', desc: 'Formalne oferty są widoczne tylko dla właściciela zlecenia, danego artysty i admina.' },
    { icon: <Eye className="h-5 w-5" />, title: 'Publiczny podgląd ograniczony', desc: 'Gość widzi tylko krótki opis, wymiary, budżet i tagi. Pełny opis i inspiracje są dla zalogowanych.' },
    { icon: <Check className="h-5 w-5" />, title: 'Zweryfikowani artyści', desc: 'Każdy artysta przechodzi weryfikację przez admina przed publikacją komentarzy i ofert.' },
  ];

  return (
    <section className="py-22 bg-ivory-100">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <p className="section-label">08 - Bezpieczeństwo</p>
            <h2 className="mt-4 font-display text-display text-graphite-600 text-balance">Bezpieczeństwo i komunikacja</h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Komunikuj się przez platformę. Twoje dane i oferty są chronione.</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="card-elegant p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-graphite-600 text-ivory-100">{item.icon}</div>
                <h3 className="mt-4 font-display text-lg text-graphite-600">{item.title}</h3>
                <p className="mt-2 text-sm text-graphite-400 text-pretty">{item.desc}</p>
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
      <div className="container-narrow text-center">
        <Reveal>
          <Badge color="gold"><Sparkles className="h-3 w-3" /> Darmowe na start</Badge>
          <h2 className="mt-6 font-display text-display text-ivory-100 text-balance">Opublikuj swoje pierwsze zlecenie</h2>
          <p className="mx-auto mt-6 max-w-lg text-graphite-200 text-pretty leading-relaxed">
            Rejestracja i publikacja są darmowe. Opisz obraz, dodaj inspiracje i otrzymaj oferty od artystów.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/dashboard/client/zlecenia/nowe">
              <Button variant="gold" size="lg">Opublikuj zlecenie <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/register?role=client">
              <Button variant="secondary" size="lg" className="!border-graphite-500/40 !text-ivory-100 hover:!border-graphite-400 hover:!bg-graphite-700 hover:!text-ivory-100">
                Załóż konto
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
