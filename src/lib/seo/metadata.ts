import { SEO_CONFIG } from './seo-config';
import { canonicalUrl, absoluteUrl } from './canonical';
import { KEYWORDS, type KeywordGroup } from './keywords';
import { buildOpenGraph, buildTwitterCard, absoluteDefaultOgImage } from './open-graph';
import {
  type Schema,
  organizationSchema, websiteSchema, faqSchema,
  breadcrumbSchema, imageObjectSchema, serviceSchema,
} from './schema';

/** FAQ entries for the homepage FAQPage schema. */
export const HOMEPAGE_FAQS = [
  {
    question: 'Ile kosztuje obraz ręcznie malowany na zamówienie?',
    answer: 'Cena zależy od wielkości, techniki, stylu i doświadczenia artysty. Na platformie ustalasz zakres cenowy, a artyści dopasowują ofertę do Twojego budżetu. Obrazy na zamówienie zaczynają się od około 1000 zł za mniejsze prace.',
  },
  {
    question: 'Jak zlecić obraz na platformie?',
    answer: 'Rejestrujesz się jako zlecający, opisujesz obraz (styl, wymiary, paleta, nastrój, pomieszczenie), dodajesz inspiracje, ustalasz budżet i termin, a następnie publikujesz zlecenie. Artyści odpowiedzą ofertami - Ty wybierasz tę, która najbardziej Ci odpowiada.',
  },
  {
    question: 'Czy rejestracja i publikacja zleceń są darmowe?',
    answer: 'Tak. Rejestracja i publikacja zleceń są darmowe. Płacisz tylko za obraz, gdy akceptujesz ofertę artysty - w dwóch etapach: zaliczka 40% rozpoczyna realizację, płatność końcowa 60% po ukończeniu.',
  },
  {
    question: 'Jak wybrać odpowiedniego artystę?',
    answer: 'Porównaj portfolio, opinie, wycenę i termin realizacji. Każdy zweryfikowany artysta ma profil z biografią, specjalizacjami, technikami i galerią prac. Artyści mogą też komentować pod zleceniem, co pomaga ocenić ich podejście.',
  },
  {
    question: 'Ile trwa realizacja obrazu na zamówienie?',
    answer: 'Czas realizacji zależy od wielkości, techniki i złożoności obrazu. Mniejsze prace akrylowe mogą być gotowe w 4-6 tygodni, większe obrazy olejne wymagają 8-12 tygodni. Ustalisz termin z artystą przed akceptacją oferty.',
  },
  {
    question: 'Czy obraz jest unikatowy?',
    answer: 'Tak. Każdy obraz jest ręcznie malowany i unikatowy. Po ukończeniu artysta przekazuje obraz z certyfikatem autentyczności potwierdzającym autorski charakter pracy.',
  },
] as const;

/** FAQ entries for the /obrazy-na-zamowienie page FAQPage schema. */
export const OBRAZY_NA_ZAMOWIENIE_FAQS = [
  {
    question: 'Czym są obrazy ręcznie malowane na zamówienie?',
    answer: 'Obrazy ręcznie malowane na zamówienie to unikatowe dzieła sztuki tworzone przez artystów malarzy na podstawie Twojego opisu i inspiracji. W przeciwieństwie do reprodukcji lub plakatów, każdy obraz jest autorskim, oryginalnym dziełem malowanym tradycyjnymi technikami - olej, akryl, akwarela lub media mieszane.',
  },
  {
    question: 'Ile kosztuje obraz malowany na zamówienie?',
    answer: 'Cena zależy od wielkości, techniki, stylu i doświadczenia artysty. Mniejsze prace akrylowe zaczynają się od około 1000 zł, większe obrazy olejne mogą kosztować od 5000 do 20000 zł i więcej. Na platformie ustalasz zakres cenowy, a artyści dopasowują ofertę do Twojego budżetu.',
  },
  {
    question: 'Jak długo trwa realizacja obrazu na zamówienie?',
    answer: 'Czas realizacji zależy od wielkości, techniki i złożoności. Mniejsze prace akrylowe mogą być gotowe w 4–6 tygodni, większe obrazy olejne wymagają 8–12 tygodni ze względu na czas schnięcia warstw farby. Ustalisz termin z artystą przed akceptacją oferty.',
  },
  {
    question: 'Czy obraz jest unikatowy?',
    answer: 'Tak. Każdy obraz jest ręcznie malowany i unikatowy - nie ma dwóch identycznych egzemplarzy. Po ukończeniu artysta przekazuje obraz z certyfikatem autentyczności potwierdzającym autorski charakter pracy.',
  },
  {
    question: 'Jakie style obrazów mogę zamówić?',
    answer: 'Artyści na platformie specjalizują się w różnych stylach: abstrakcja, pejzaż, portret, malarstwo nowoczesne, minimalizm, surrealizm, malarstwo figuratywne i inne. Wybierz styl w formularzu zlecenia lub przeglądaj kategorie obrazów, aby znaleźć inspirację.',
  },
  {
    question: 'Czy mogę zobaczyć portfolio artysty przed wyborem?',
    answer: 'Tak. Każdy zweryfikowany artysta ma profil z galerią prac, biografią, specjalizacjami, technikami i opiniami od poprzednich zlecających. Porównaj portfolio, wyceny i terminy, zanim akceptujesz ofertę.',
  },
  {
    question: 'Jak działa płatność za obraz na zamówienie?',
    answer: 'Płatność odbywa się w dwóch etapach: zaliczka 40% po akceptacji oferty rozpoczyna realizację, płatność końcowa 60% po ukończeniu i akceptacji obrazu. Płatności są obsługiwane bezpiecznie przez platformę.',
  },
  {
    question: 'Czy rejestracja i publikacja zlecenia są darmowe?',
    answer: 'Tak. Rejestracja i publikacja zleceń są całkowicie darmowe. Płacisz tylko za obraz, gdy akceptujesz ofertę artysty. Nie ma ukrytych opłat za przeglądanie zleceń, komunikację z artystami ani publikację.',
  },
] as const;

/** FAQ entries for the /zlec-obraz page FAQPage schema. */
export const ZLEC_OBRAZ_FAQS = [
  {
    question: 'Ile kosztuje obraz na zamówienie?',
    answer: 'Cena zależy od wielkości, techniki, stylu i doświadczenia artysty. Mniejsze prace akrylowe zaczynają się od około 1000 zł, większe obrazy olejne mogą kosztować od 5000 do 20000 zł i więcej. Na platformie ustalasz zakres cenowy, a artyści dopasowują ofertę do Twojego budżetu.',
  },
  {
    question: 'Jak długo trwa wykonanie obrazu?',
    answer: 'Czas realizacji zależy od wielkości, techniki i złożoności. Mniejsze prace akrylowe mogą być gotowe w 4–6 tygodni, większe obrazy olejne wymagają 8–12 tygodni ze względu na czas schnięcia warstw farby. Ustalisz termin z artystą przed akceptacją oferty.',
  },
  {
    question: 'Czy mogę wysłać inspiracje?',
    answer: 'Tak. W formularzu zlecenia możesz dodać do 6 zdjęć inspiracyjnych - zdjęcia wnętrza, palety kolorów, obrazów referencyjnych i moodboardów. Inspiracje pomagają artystom dopasować ofertę do Twojej wizji.',
  },
  {
    question: 'Czy mogę wybrać konkretnego artystę?',
    answer: 'Tak. Możesz przeglądać profile artystów, ich portfolio i opinie, a następnie zaprosić wybranego twórcę do zlecenia. Artyści mogą też sami aplikować do otwartych zleceń - Ty decydujesz, czyją ofertę akceptujesz.',
  },
  {
    question: 'Jak działa płatność za obraz na zamówienie?',
    answer: 'Płatność odbywa się w dwóch etapach: zaliczka 40% po akceptacji oferty rozpoczyna realizację, płatność końcowa 60% po ukończeniu i akceptacji obrazu. Płatności są obsługiwane bezpiecznie przez platformę. Rejestracja i publikacja zleceń są darmowe.',
  },
] as const;

/** FAQ entries for the /zlecenia-dla-artystow page FAQPage schema. */
export const ZLECENIA_DLA_ARTYSTOW_FAQS = [
  {
    question: 'Czy dołączenie do platformy i przeglądanie zleceń jest darmowe?',
    answer: 'Tak. Rejestracja konta artysty, przeglądanie zleceń, komentowanie i składanie ofert są darmowe. Platforma pobiera prowizję tylko od zrealizowanych projektów - nie ma opłat abonamentowych ani ukrytych kosztów.',
  },
  {
    question: 'Jakie zlecenia pojawiają się na platformie?',
    answer: 'Zlecający publikują zlecenia na ręcznie malowane obrazy - portrety, pejzaże, abstrakcje, obrazy do wnętrz (salon, sypialnia, biuro, hotel), kompozycjefiguratywne i inne. Każde zlecenie zawiera opis, wymiary, styl, budżet i inspiracje.',
  },
  {
    question: 'Czy mogę wybrać, do których zleceń aplikuję?',
    answer: 'Tak. Przeglądasz otwarte zlecenia, filtrujesz po stylu i budżecie, i decydujesz, do których zleceń chcesz złożyć ofertę. Nie ma obowiązku aplikowania - wybierasz zlecenia dopasowane do Twojej specjalizacji.',
  },
  {
    question: 'Czy muszę mieć portfolio, żeby założyć konto?',
    answer: 'Nie, ale profil z portfolio prac zwiększa szanse na akceptację Twoich ofert. Zlecający porównują portfolio, style i opinie przed wyborem artysty. Możesz dodawać prace po rejestracji, w panelu artysty.',
  },
  {
    question: 'Jak wygląda płatność za zrealizowany obraz?',
    answer: 'Płatność odbywa się w dwóch etapach: zaliczka 40% po akceptacji Twojej oferty rozpoczyna realizację, płatność końcowa 60% po ukończeniu i akceptacji obrazu przez zlecającego. Płatności są obsługiwane przez platformę, co zapewnia bezpieczeństwo obu stronom.',
  },
  {
    question: 'Czy platforma gwarantuje zlecenia?',
    answer: 'Nie. Platforma udostępnia zlecenia publikowane przez zlecających, ale to od artysty zależy, czy jego oferta zostanie zaakceptowana. Zależy to od portfolio, wyceny, terminu i dopasowania do wizji zlecającego.',
  },
] as const;

/**
 * Central PageMetadata type - every page produces this shape.
 * This is the single contract between pages and the useSeo hook.
 */
export interface PageMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  robots: 'index, follow' | 'noindex, nofollow';
  ogType: 'website' | 'article' | 'profile';
  ogImage?: string;
  keywords: string[];
  /** JSON-LD schema objects to inject. */
  schema?: Schema[];
}

/** Brand suffix appended to all titles. */
function withBrand(title: string): string {
  return `${title} | ${SEO_CONFIG.brand}`;
}

/** Clamp description to 155 chars with ellipsis. */
function clampDesc(text: string, max = 155): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + '…';
}

/** Clamp title to ~60 chars. */
function clampTitle(text: string, max = 60): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + '…';
}

/**
 * Build a complete PageMetadata object from partial input.
 * Fills in robots, OG, Twitter, and keywords automatically.
 */
export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  keywordGroup?: KeywordGroup;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  noindex?: boolean;
  schema?: Schema[];
}): PageMetadata {
  const keywords = opts.keywords ?? (opts.keywordGroup ? [...KEYWORDS[opts.keywordGroup]] : []);
  const robots: PageMetadata['robots'] = opts.noindex ? 'noindex, nofollow' : 'index, follow';

  return {
    title: clampTitle(opts.title),
    description: clampDesc(opts.description),
    canonicalPath: opts.path,
    robots,
    ogType: opts.ogType ?? 'website',
    ogImage: opts.ogImage ?? absoluteDefaultOgImage(),
    keywords,
    schema: opts.schema,
  };
}

/** Helper to add brand suffix and build metadata in one call. */
export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  keywordGroup?: KeywordGroup;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  noindex?: boolean;
  schema?: Schema[];
}): PageMetadata {
  return buildMetadata({
    ...opts,
    title: withBrand(opts.title),
  });
}

// ─── Static page metadata ──────────────────────────────────────────────────

/** Pre-built metadata for all static public pages. No duplicates. */
export const STATIC_METADATA: Record<string, () => PageMetadata> = {
  '/': () => buildPageMetadata({
    title: 'Obrazy Ręcznie Malowane na Zamówienie',
    description: 'Zamów ręcznie malowany obraz od artysty. Opisz wizję, dodaj inspiracje i otrzymaj oferty od zweryfikowanych malarzy. Rejestracja i publikacja darmowe.',
    path: '/',
    keywordGroup: 'home',
    schema: [
      organizationSchema(),
      websiteSchema(),
      faqSchema(HOMEPAGE_FAQS),
    ],
  }),
  '/dla-zlecajacych': () => buildPageMetadata({
    title: 'Zleć Obraz Artyście',
    description: 'Zleć obraz odpowiadający Twojej wizji. Opublikuj zlecenie, otrzymaj oferty od sprawdzonych artystów i wybierz idealnego twórcę.',
    path: '/dla-zlecajacych',
    keywordGroup: 'dlaZlecajacych',
  }),
  '/dla-artystow': () => buildPageMetadata({
    title: 'Zlecenia dla Artystów Malarzy',
    description: 'Znajdź zlecenia na obrazy dopasowane do Twojego stylu. Otrzymuj zlecenia, składaj oferty i buduj portfolio na platformie.',
    path: '/dla-artystow',
    keywordGroup: 'dlaArtystow',
  }),
  '/zlecenia': () => buildPageMetadata({
    title: 'Aktualne Zlecenia na Obrazy',
    description: 'Przeglądaj aktualne zlecenia na obrazy ręcznie malowane. Znajdź zlecenie dopasowane do Twojego stylu i złóż ofertę.',
    path: '/zlecenia',
    keywordGroup: 'zleceniaListing',
  }),
  '/artysci': () => buildPageMetadata({
    title: 'Artyści Malarze na Zamówienie',
    description: 'Przeglądaj profile artystów malarzy. Zobacz portfolio, style i techniki, i zleć obraz u wybranego twórcy.',
    path: '/artysci',
    keywordGroup: 'artysciListing',
  }),
  '/jak-to-dziala': () => buildPageMetadata({
    title: 'Jak Zlecić Obraz - Przewodnik Krok po Kroku',
    description: 'Dowiedz się, jak działa platforma. Od publikacji zlecenia, przez oferty artystów, po realizację projektu i płatności.',
    path: '/jak-to-dziala',
    keywordGroup: 'jakToDziala',
  }),
  '/cennik': () => buildPageMetadata({
    title: 'Cennik - Ile Kosztuje Obraz na Zamówienie',
    description: 'Zobacz opłaty i prowizje platformy. Przejrzyste ceny dla zlecających i artystów. Rejestracja i publikacja zleceń są darmowe.',
    path: '/cennik',
    keywordGroup: 'cennik',
  }),
  '/faq': () => buildPageMetadata({
    title: 'FAQ - Najczęstsze Pytania o Obrazy na Zamówienie',
    description: 'Najczęściej zadawane pytania o zlecanie obrazów, oferty, płatności i bezpieczeństwo na platformie.',
    path: '/faq',
    keywordGroup: 'faq',
  }),
  '/kontakt': () => buildPageMetadata({
    title: 'Kontakt',
    description: 'Skontaktuj się z zespołem platformy. Masz pytania, propozycje lub potrzebujesz pomoc? Napisz do nas.',
    path: '/kontakt',
    keywordGroup: 'kontakt',
  }),
  '/regulamin': () => buildPageMetadata({
    title: 'Regulamin',
    description: 'Warunki korzystania z platformy - zasady publikacji zleceń, składania ofert, płatności i realizacji projektów.',
    path: '/regulamin',
    keywordGroup: 'regulamin',
  }),
  '/polityka-prywatnosci': () => buildPageMetadata({
    title: 'Polityka Prywatności',
    description: 'Jak przetwarzamy Twoje dane osobowe zgodnie z RODO. Zakres danych, cele przetwarzania i prawa użytkownika.',
    path: '/polityka-prywatnosci',
    keywordGroup: 'politykaPrywatnosci',
  }),
  '/zasady-dla-artystow': () => buildPageMetadata({
    title: 'Zasady dla Artystów',
    description: 'Reguły obowiązujące artystów - weryfikacja, komentarze, oferty, realizacja i płatności na platformie.',
    path: '/zasady-dla-artystow',
    keywordGroup: 'zasadyDlaArtystow',
  }),
  '/zasady-dla-zlecajacych': () => buildPageMetadata({
    title: 'Zasady dla Zlecających',
    description: 'Reguły obowiązujące zlecających - publikacja zleceń, prywatność, oferty, płatności i odpowiedzialność.',
    path: '/zasady-dla-zlecajacych',
    keywordGroup: 'zasadyDlaZlecajacych',
  }),
  '/obrazy-na-zamowienie': () => buildPageMetadata({
    title: 'Obrazy Ręcznie Malowane na Zamówienie',
    description: 'Obrazy Ręcznie Malowane na Zamówienie - zleć obraz dopasowany do wnętrza. Opisz pomysł, dodaj inspiracje, wybierz artystę. Rejestracja i publikacja darmowe.',
    path: '/obrazy-na-zamowienie',
    keywordGroup: 'obrazyNaZamowienie',
    schema: [
      breadcrumbSchema([
        { name: 'Strona główna', path: '/' },
        { name: 'Obrazy na zamówienie', path: '/obrazy-na-zamowienie' },
      ]),
      faqSchema(OBRAZY_NA_ZAMOWIENIE_FAQS),
      imageObjectSchema({
        url: absoluteUrl('/og-default.jpg'),
        caption: 'Obrazy ręcznie malowane na zamówienie - galeria prac artystów z platformy Artiors',
        width: 1200,
        height: 630,
      }),
    ],
  }),
  '/zamow-obraz': () => buildPageMetadata({
    title: 'Zamów Obraz Ręcznie Malowany',
    description: 'Zamów obraz ręcznie malowany - opisz swoje potrzeby, dodaj inspiracje i opublikuj zlecenie. Artyści odpowiedzą ofertami.',
    path: '/zamow-obraz',
    keywordGroup: 'zamowObraz',
  }),
  '/zlec-obraz': () => buildPageMetadata({
    title: 'Zleć Wykonanie Obrazu Artyście - Jak Zlecić Obraz Krok po Kroku',
    description: 'Zleć obraz artyście - krok po kroku: opisz zlecenie, podaj wymiary, wybierz kolory, dodaj inspiracje, wybierz artystę. FAQ: cena, czas, płatność. Rejestracja darmowa.',
    path: '/zlec-obraz',
    keywordGroup: 'zlecObraz',
    schema: [
      breadcrumbSchema([
        { name: 'Strona główna', path: '/' },
        { name: 'Obrazy na zamówienie', path: '/obrazy-na-zamowienie' },
        { name: 'Zleć obraz', path: '/zlec-obraz' },
      ]),
      faqSchema(ZLEC_OBRAZ_FAQS),
    ],
  }),
  '/zlecenia-dla-artystow': () => buildPageMetadata({
    title: 'Zlecenia dla Artystów i Malarzy - Zlecenia Malarskie Online',
    description: 'Zlecenia dla artystów malarzy: przeglądaj otwarte zlecenia malarskie, składaj oferty, komunikuj się ze zlecającymi i realizuj obrazy na zamówienie. Rejestracja darmowa.',
    path: '/zlecenia-dla-artystow',
    keywordGroup: 'zleceniaDlaArtystow',
    schema: [
      breadcrumbSchema([
        { name: 'Strona główna', path: '/' },
        { name: 'Dla artystów', path: '/dla-artystow' },
        { name: 'Zlecenia dla artystów', path: '/zlecenia-dla-artystow' },
      ]),
      serviceSchema({
        name: 'Zlecenia dla artystów i malarzy',
        description: 'Marketplace zleceń malarskich - artyści przeglądają otwarte zlecenia na obrazy na zamówienie, składają oferty i realizują projekty dla klientów w Polsce.',
        path: '/zlecenia-dla-artystow',
        serviceType: 'Zlecenia malarskie dla artystów',
      }),
      organizationSchema(),
      faqSchema(ZLECENIA_DLA_ARTYSTOW_FAQS),
    ],
  }),
  '/obrazy-do-salonu': () => buildPageMetadata({
    title: 'Obrazy do Salonu na Zamówienie',
    description: 'Zleć obraz do salonu ręcznie malowany - dopasowany do stylu, kolorów i wymiarów wnętrza. Otrzymaj oferty od artystów.',
    path: '/obrazy-do-salonu',
    keywordGroup: 'obrazyDoSalonu',
  }),
  '/obrazy-do-sypialni': () => buildPageMetadata({
    title: 'Obrazy do Sypialni na Zamówienie',
    description: 'Zleć obraz do sypialni ręcznie malowany - spokojna paleta, intymna atmosfera. Dopasowany do przestrzeni i nastroju.',
    path: '/obrazy-do-sypialni',
    keywordGroup: 'obrazyDoSypialni',
  }),
  '/obrazy-do-biura': () => buildPageMetadata({
    title: 'Obrazy do Biura na Zamówienie',
    description: 'Zleć obraz do biura ręcznie malowany - profesjonalny, inspirujący. Dopasowany do przestrzeni pracy i wizerunku firmy.',
    path: '/obrazy-do-biura',
    keywordGroup: 'obrazyDoBiura',
  }),
  '/obrazy-do-hotelu': () => buildPageMetadata({
    title: 'Obrazy do Hotelu na Zamówienie',
    description: 'Zleć obrazy do hotelu - serie dopasowane do pokoi, lobby i stref gastronomicznych. Ręcznie malowane, unikatowe.',
    path: '/obrazy-do-hotelu',
    keywordGroup: 'obrazyDoHotelu',
  }),
  '/blog': () => buildPageMetadata({
    title: 'Blog - Porady i Inspiracje',
    description: 'Porady, inspiracje i przewodniki o obrazach ręcznie malowanych na zamówienie. Dowiedz się, jak zlecić obraz i wybrać artystę.',
    path: '/blog',
    keywordGroup: 'blog',
  }),
  '/404': () => buildMetadata({
    title: 'Strona Nie Znaleziona (404)',
    description: 'Strona, której szukasz, nie istnieje. Wróć do strony głównej platformy Artiors.',
    path: '/404',
    noindex: true,
  }),
};

/** Get static metadata by path, falling back to homepage. */
export function getStaticMetadata(path: string): PageMetadata {
  const factory = STATIC_METADATA[path] ?? STATIC_METADATA['/'];
  return factory();
}

// ─── Dynamic page metadata generators ──────────────────────────────────────

/** Metadata for a commission detail page. */
export function buildCommissionMetadata(opts: {
  title: string;
  slug: string;
  publicSummary: string;
  style: string;
  medium?: string;
  location?: string;
  widthCm: number;
  heightCm: number;
  budgetMin: number;
  budgetMax: number;
  inspirationImages?: string[];
  status: string;
  roomType?: string;
  mood?: string;
  deadline?: string;
  preferredColors?: string[];
  orientation?: string;
  currency?: string;
  schema?: Schema[];
}): PageMetadata {
  const dimensions = `${opts.widthCm}×${opts.heightCm} cm`;
  const budget = opts.budgetMin === opts.budgetMax
    ? `${opts.budgetMin} zł`
    : `${opts.budgetMin}–${opts.budgetMax} zł`;

  const roomLabel = opts.roomType
    ? opts.roomType.charAt(0).toUpperCase() + opts.roomType.slice(1)
    : '';

  const styleLower = opts.style.toLowerCase();
  const seoTitleParts = [
    opts.title,
    dimensions,
  ];
  if (roomLabel) seoTitleParts.push(`do ${opts.roomType}`);
  const seoTitle = `${seoTitleParts.join(' ')} - Zlecenie dla Artysty`;

  const descParts = [
    opts.publicSummary,
    `Styl: ${opts.style}.`,
    `Wymiary: ${dimensions}.`,
    `Budżet: ${budget}.`,
  ];
  if (opts.medium) descParts.push(`Technika: ${opts.medium}.`);
  if (opts.location) descParts.push(`Lokalizacja: ${opts.location}.`);
  if (opts.mood) descParts.push(`Nastrój: ${opts.mood}.`);
  if (opts.deadline) descParts.push(`Termin: ${opts.deadline}.`);
  if (opts.preferredColors && opts.preferredColors.length > 0) {
    descParts.push(`Kolory: ${opts.preferredColors.join(', ')}.`);
  }

  const indexableStatuses = ['published', 'offers_open', 'in_progress', 'completed'];
  const noindex = !indexableStatuses.includes(opts.status);

  const keywords = [
    opts.title,
    opts.style,
    opts.medium,
    'zlecenie na obraz',
    'zleć obraz',
    dimensions,
    roomLabel,
    opts.mood,
    styleLower.includes('abstrak') ? 'abstrakcyjny obraz' : null,
  ].filter(Boolean) as string[];

  return buildPageMetadata({
    title: seoTitle,
    description: descParts.join(' '),
    path: `/zlecenia/${opts.slug}`,
    keywords,
    ogType: 'article',
    ogImage: opts.inspirationImages?.[0],
    noindex,
    schema: opts.schema,
  });
}

/** Metadata for an artist profile page. */
export function buildArtistMetadata(opts: {
  artistName: string;
  slug: string;
  bio: string;
  styles: string[];
  techniques: string[];
  location: string;
  avatarUrl?: string;
  schema?: Schema[];
}): PageMetadata {
  const descParts = [
    opts.bio ? opts.bio.slice(0, 100) : '',
    opts.styles.length > 0 ? `Style: ${opts.styles.join(', ')}.` : '',
    opts.techniques.length > 0 ? `Techniki: ${opts.techniques.join(', ')}.` : '',
    opts.location ? `Lokalizacja: ${opts.location}.` : '',
  ].filter(Boolean);

  const description = descParts.join(' ') ||
    `${opts.artistName} to artysta malarz dostępny na platformie. Zleć obraz bezpośrednio u wybranego twórcy.`;

  return buildPageMetadata({
    title: `${opts.artistName} - Artysta Malarz`,
    description,
    path: `/artysci/${opts.slug}`,
    keywords: [opts.artistName, ...opts.styles, ...opts.techniques, 'artysta malarz', 'zleć obraz', opts.location].filter(Boolean) as string[],
    ogType: 'profile',
    ogImage: opts.avatarUrl,
    schema: opts.schema,
  });
}

/** Metadata for an obrazy category page (/obrazy/:kategoria). */
export function buildObrazKategoriaMetadata(opts: {
  name: string;
  h1: string;
  description: string;
  slug: string;
  keywords: string[];
  schema?: Schema[];
}): PageMetadata {
  return buildPageMetadata({
    title: opts.name,
    description: opts.description,
    path: `/obrazy/${opts.slug}`,
    keywords: opts.keywords,
    ogType: 'website',
    schema: opts.schema,
  });
}

/** Metadata for an interior page (/obrazy-do-salonu etc.). */
export function buildObrazyWnetrzMetadata(opts: {
  name: string;
  h1: string;
  description: string;
  path: string;
  keywords: string[];
  schema?: Schema[];
}): PageMetadata {
  return buildPageMetadata({
    title: opts.name,
    description: opts.description,
    path: opts.path,
    keywords: opts.keywords,
    ogType: 'website',
    schema: opts.schema,
  });
}

/** Metadata for a blog category page (/blog/kategoria/:slug). */
export function buildBlogKategoriaMetadata(opts: {
  name: string;
  title: string;
  description: string;
  slug: string;
  keywords: string[];
  schema?: Schema[];
}): PageMetadata {
  return buildPageMetadata({
    title: opts.title,
    description: opts.description,
    path: `/blog/kategoria/${opts.slug}`,
    keywords: opts.keywords,
    ogType: 'website',
    schema: opts.schema,
  });
}

/** Metadata for a blog article. */
export function buildBlogPostMetadata(opts: {
  title: string;
  slug: string;
  description: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  keywords?: string[];
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;
  noindex?: boolean;
  schema?: Schema[];
}): PageMetadata {
  const title = opts.seoTitle ?? opts.title;
  const description = opts.seoDescription ?? opts.description;
  const canonicalPath = opts.canonical ?? `/blog/${opts.slug}`;

  return buildPageMetadata({
    title,
    description,
    path: canonicalPath,
    keywords: opts.keywords ?? [opts.title, 'obrazy na zamówienie', 'blog'],
    ogType: 'article',
    ogImage: opts.image,
    noindex: opts.noindex,
    schema: opts.schema,
  });
}

/** Metadata for a generic category page (legacy compatibility). */
export function buildCategoryMetadata(opts: {
  name: string;
  description: string;
  slug: string;
  keywords?: string[];
  schema?: Schema[];
}): PageMetadata {
  return buildPageMetadata({
    title: opts.name,
    description: opts.description,
    path: `/kategoria/${opts.slug}`,
    keywords: opts.keywords ?? [opts.name, 'obrazy na zamówienie', 'zleć obraz'],
    ogType: 'website',
    schema: opts.schema,
  });
}
