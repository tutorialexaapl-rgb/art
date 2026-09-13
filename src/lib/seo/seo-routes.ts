/**
 * Central catalog of all public SEO routes.
 * Single source of truth for URL paths, labels, and SEO metadata keys.
 *
 * Route conventions (no duplicates):
 *   /                          Landing - „obrazy ręcznie malowane na zamówienie"
 *   /obrazy-na-zamowienie      Main SEO cluster - obrazy na zamówienie
 *   /zamow-obraz               Conversion - prowadzi do formularza zlecenia
 *   /zlec-obraz                Explainer - jak działa zlecanie
 *   /zlecenia                  Listing zleceń
 *   /zlecenia-dla-artystow     SEO strona dla artystów
 *   /zlecenia/:slug            Detail zlecenia
 *   /artysci                   Katalog artystów
 *   /artysci/:slug             Profil artysty
 *   /obrazy/:kategoria         Kategoria obrazów wg stylu
 *   /obrazy-do-salonu          Obrazy do wnętrz - salon
 *   /obrazy-do-sypialni        Obrazy do wnętrz - sypialnia
 *   /obrazy-do-biura           Obrazy do wnętrz - biuro
 *   /obrazy-do-hotelu          Obrazy do wnętrz - hotel
 *   /blog                      Blog - listing
 *   /blog/:slug                Artykuł bloga
 *   /blog/kategoria/:slug      Kategoria bloga
 *   /jak-to-dziala             Jak to działa
 *   /cennik                    Cennik
 *   /faq                       FAQ
 *   /kontakt                   Kontakt
 *   /dla-zlecajacych           Dla zlecających
 *   /dla-artystow              Dla artystów
 *   /regulamin                 Legal
 *   /polityka-prywatnosci      Legal
 *   /zasady-dla-artystow       Legal
 *   /zasady-dla-zlecajacych    Legal
 */

export interface RouteEntry {
  path: string;
  label: string;
  seoKey: string;
  noindex?: boolean;
}

/** Static public routes that are indexable. */
export const PUBLIC_ROUTES: RouteEntry[] = [
  { path: '/', label: 'Strona główna', seoKey: '/' },
  { path: '/obrazy-na-zamowienie', label: 'Obrazy na zamówienie', seoKey: '/obrazy-na-zamowienie' },
  { path: '/zamow-obraz', label: 'Zamów obraz', seoKey: '/zamow-obraz' },
  { path: '/zlec-obraz', label: 'Zleć obraz', seoKey: '/zlec-obraz' },
  { path: '/zlecenia', label: 'Zlecenia', seoKey: '/zlecenia' },
  { path: '/zlecenia-dla-artystow', label: 'Zlecenia dla artystów', seoKey: '/zlecenia-dla-artystow' },
  { path: '/artysci', label: 'Artyści', seoKey: '/artysci' },
  { path: '/obrazy-do-salonu', label: 'Obrazy do salonu', seoKey: '/obrazy-do-salonu' },
  { path: '/obrazy-do-sypialni', label: 'Obrazy do sypialni', seoKey: '/obrazy-do-sypialni' },
  { path: '/obrazy-do-biura', label: 'Obrazy do biura', seoKey: '/obrazy-do-biura' },
  { path: '/obrazy-do-hotelu', label: 'Obrazy do hotelu', seoKey: '/obrazy-do-hotelu' },
  { path: '/blog', label: 'Blog', seoKey: '/blog' },
  { path: '/jak-to-dziala', label: 'Jak to działa', seoKey: '/jak-to-dziala' },
  { path: '/cennik', label: 'Cennik', seoKey: '/cennik' },
  { path: '/faq', label: 'FAQ', seoKey: '/faq' },
  { path: '/kontakt', label: 'Kontakt', seoKey: '/kontakt' },
  { path: '/dla-zlecajacych', label: 'Dla zlecających', seoKey: '/dla-zlecajacych' },
  { path: '/dla-artystow', label: 'Dla artystów', seoKey: '/dla-artystow' },
  { path: '/regulamin', label: 'Regulamin', seoKey: '/regulamin' },
  { path: '/polityka-prywatnosci', label: 'Polityka prywatności', seoKey: '/polityka-prywatnosci' },
  { path: '/zasady-dla-artystow', label: 'Zasady dla artystów', seoKey: '/zasady-dla-artystow' },
  { path: '/zasady-dla-zlecajacych', label: 'Zasady dla zlecających', seoKey: '/zasady-dla-zlecajacych' },
];

/** Routes that must NOT be indexed. */
export const NOINDEX_ROUTES: RouteEntry[] = [
  { path: '/login', label: 'Logowanie', seoKey: '/login', noindex: true },
  { path: '/register', label: 'Rejestracja', seoKey: '/register', noindex: true },
  { path: '/forgot-password', label: 'Reset hasła', seoKey: '/forgot-password', noindex: true },
  { path: '/onboarding', label: 'Onboarding', seoKey: '/onboarding', noindex: true },
  { path: '/suspended', label: 'Zawieszenie', seoKey: '/suspended', noindex: true },
  { path: '/dashboard', label: 'Panel', seoKey: '/dashboard', noindex: true },
  { path: '/admin', label: 'Admin', seoKey: '/admin', noindex: true },
];

// ─── Obrazy - kategorie stylów ─────────────────────────────────────────────

export interface ObrazKategoria {
  slug: string;
  name: string;
  h1: string;
  description: string;
  keywords: string[];
  intro: string;
}

export const OBRAZY_KATEGORIE: ObrazKategoria[] = [
  {
    slug: 'abstrakcyjne',
    name: 'Obrazy abstrakcyjne',
    h1: 'Obrazy Abstrakcyjne na Zamówienie',
    description: 'Zleć obraz abstrakcyjny ręcznie malowany na zamówienie - dopasowany do Twojego wnętrza. Wybierz artystę malarza, określ paletę i wymiary.',
    keywords: ['obrazy abstrakcyjne na zamówienie', 'abstrakcja malarstwo', 'obraz abstrakcyjny do salonu', 'malarstwo abstrakcyjne', 'ręcznie malowane obrazy abstrakcyjne'],
    intro: 'Obrazy abstrakcyjne to forma sztuki, która nie odtwarza rzeczywistości, lecz pracuje z kolorem, kształtem i kompozycją. Na platformie znajdziesz artystów specjalizujących się w malarstwie abstrakcyjnym - od geometrii, przez liryczną abstrakcję, po ekspresyjne impasto.',
  },
  {
    slug: 'pejzaze',
    name: 'Obrazy pejzaże',
    h1: 'Pejzaże na Zamówienie - Obrazy Ręcznie Malowane',
    description: 'Zleć pejzaż ręcznie malowany na zamówienie - górski, morski, miejski. Wybierz artystę malarza, określ scenerię i wymiary obrazu.',
    keywords: ['pejzaż na zamówienie', 'obrazy pejzaże', 'malarstwo pejzażowe', 'krajobraz malowany na zamówienie', 'ręcznie malowany pejzaż'],
    intro: 'Pejzaż to jeden z najstarszych motywów w malarstwie. Od romantycznych górskich widoków po miejskie sceny i morskie horyzonty - artyści na platformie tworzą pejzaże dopasowane do Twojej wizji i wnętrza.',
  },
  {
    slug: 'portrety',
    name: 'Portrety na zamówienie',
    h1: 'Portrety na Zamówienie - Ręcznie Malowane',
    description: 'Zleć portret ręcznie malowany na zamówienie - portret rodziny, dziecka, zwierzęcia. Wybierz artystę portrecistę i technikę malarską.',
    keywords: ['portret na zamówienie', 'portret malowany', 'portret olejny', 'portret rodzinny na zamówienie', 'ręcznie malowany portret'],
    intro: 'Portret to osobisty i unikatowy prezent lub pamiątka. Artyści na platformie specjalizują się w portretach olejnych, akrylowych i ołówkowych - od klasycznych po współczesne interpretacje.',
  },
  {
    slug: 'nowoczesne',
    name: 'Obrazy nowoczesne',
    h1: 'Obrazy Nowoczesne na Zamówienie',
    description: 'Zleć nowoczesny obraz ręcznie malowany na zamówienie - dopasowany do współczesnego wnętrza. Geometryczne, minimalne, graficzne formy.',
    keywords: ['obrazy nowoczesne na zamówienie', 'malarstwo współczesne', 'obraz nowoczesny do salonu', 'sztuka współczesna na zamówienie', 'ręcznie malowane obrazy nowoczesne'],
    intro: 'Obrazy nowoczesne łączą współczesną estetykę z tradycyjnym rzemiosłem. Czyste linie, geometryczne formy, stonowane palety - idealne do nowoczesnych i minimalistycznych wnętrz.',
  },
  {
    slug: 'minimalistyczne',
    name: 'Obrazy minimalistyczne',
    h1: 'Obrazy Minimalistyczne na Zamówienie',
    description: 'Zleć minimalistyczny obraz ręcznie malowany na zamówienie - stonowana paleta, prosta kompozycja. Idealne do skandynawskiego wnętrza.',
    keywords: ['obrazy minimalistyczne na zamówienie', 'minimalizm w malarstwie', 'obraz minimalistyczny do salonu', 'proste obrazy', 'ręcznie malowane obrazy minimalistyczne'],
    intro: 'Minimalizm w malarstwie oznacza ograniczenie środków wyrazu - kilka kolorów, prosta kompozycja, przestrzeń. Obrazy minimalistyczne pasują do wnętrz skandynawskich, japandi i nowoczesnych.',
  },
];

// ─── Obrazy do wnętrz ──────────────────────────────────────────────────────

export interface ObrazyWnetrz {
  slug: string;
  path: string;
  name: string;
  h1: string;
  description: string;
  keywords: string[];
  intro: string;
}

export const OBRAZY_WNETRZ: ObrazyWnetrz[] = [
  {
    slug: 'salon',
    path: '/obrazy-do-salonu',
    name: 'Obrazy do salonu',
    h1: 'Obrazy do Salonu na Zamówienie',
    description: 'Zleć ręcznie malowany obraz do salonu na zamówienie - dopasowany do stylu, kolorów i wymiarów wnętrza. Otrzymaj oferty od zweryfikowanych artystów malarzy.',
    keywords: ['obraz do salonu na zamówienie', 'obraz do salonu', 'obraz nad kanapę', 'malarstwo do salonu', 'ręcznie malowany obraz do salonu'],
    intro: 'Salon to serce domu - miejsce, w którym obraz powinien pasować do stylu wnętrza, palety kolorów i skali ścian. Artyści na platformie tworzą obrazy dopasowane do konkretnych przestrzeni.',
  },
  {
    slug: 'sypialnia',
    path: '/obrazy-do-sypialni',
    name: 'Obrazy do sypialni',
    h1: 'Obrazy do Sypialni na Zamówienie',
    description: 'Zleć ręcznie malowany obraz do sypialni na zamówienie - spokojna paleta, intymna atmosfera. Dopasowany do przestrzeni i nastroju przez artystę malarza.',
    keywords: ['obraz do sypialni na zamówienie', 'obraz do sypialni', 'obraz nad łóżko', 'spokojny obraz', 'ręcznie malowany obraz do sypialni'],
    intro: 'Sypialnia wymaga spokojnej i harmonijnej sztuki. Stonowane palety, miękkie faktury i abstrakcyjne kompozycje tworzą atmosferę relaksu. Artyści dopasują obraz do przestrzeni nad łóżkiem lub komodą.',
  },
  {
    slug: 'biuro',
    path: '/obrazy-do-biura',
    name: 'Obrazy do biura',
    h1: 'Obrazy do Biura na Zamówienie',
    description: 'Zleć ręcznie malowany obraz do biura na zamówienie - profesjonalny, inspirujący. Dopasowany do przestrzeni pracy i wizerunku firmy przez artystę malarza.',
    keywords: ['obraz do biura na zamówienie', 'sztuka do biura', 'obraz do gabinetu', 'malarstwo do biura', 'ręcznie malowany obraz do biura'],
    intro: 'Obraz w biurze buduje wizerunek i atmosferę. Artyści na platformie tworzą prace dopasowane do przestruli pracy - od stonowanych kompozycji do recepcji, po inspirujące abstrakcje do sal spotkań.',
  },
  {
    slug: 'hotel',
    path: '/obrazy-do-hotelu',
    name: 'Obrazy do hotelu',
    h1: 'Obrazy do Hotelu na Zamówienie',
    description: 'Zleć ręcznie malowane obrazy do hotelu na zamówienie - serie dopasowane do pokoi, lobby i stref gastronomicznych. Unikatowe rękodzieło od artystów malarzy.',
    keywords: ['obrazy do hotelu', 'sztuka hotelowa', 'obrazy do lobby hotelu', 'serie obrazów hotel', 'ręcznie malowane obrazy do hotelu'],
    intro: 'Hotele wymagają spójnej sztuki - seria obrazów w pokojach, centerpiece w lobby, prace w strefach gastronomicznych. Artyści na platformie realizują zlecenia hotelowe w seriach dopasowanych do koncepcji wnętrza.',
  },
];

// ─── Blog - kategorie ──────────────────────────────────────────────────────

export interface BlogKategoria {
  slug: string;
  name: string;
  title: string;
  description: string;
  keywords: string[];
}

export const BLOG_KATEGORIE: BlogKategoria[] = [
  {
    slug: 'obrazy-na-zamowienie',
    name: 'Obrazy na zamówienie',
    title: 'Obrazy na Zamówienie - Przewodniki i Poradniki',
    description: 'Wszystko o ręcznie malowanych obrazach na zamówienie: jak zlecić, ile kosztują, jak wybrać artystę malarza i jak ustalić budżet na malowane dzieło.',
    keywords: ['obrazy na zamówienie', 'obraz na zamówienie', 'jak zlecić obraz', 'cena obrazu na zamówienie', 'ręcznie malowane obrazy', 'malarstwo na zamówienie'],
  },
  {
    slug: 'obrazy-do-wnetrz',
    name: 'Obrazy do wnętrz',
    title: 'Obrazy do Wnętrz - Jak Dopasować Obraz do Przestrzeni',
    description: 'Jak dobrać ręcznie malowany obraz do salonu, sypialni, biura lub hotelu. Skala, paleta, kompozycja i styl - poradniki dla zlecających i architektów wnętrz.',
    keywords: ['obrazy do wnętrz', 'obraz do salonu', 'obraz do sypialni', 'obraz do biura', 'dobór obrazu do wnętrza', 'obraz do hotelu', 'malarstwo do wnętrz'],
  },
  {
    slug: 'style-malarskie',
    name: 'Style malarskie',
    title: 'Style Malarskie - Przewodnik po Technikach i Kierunkach',
    description: 'Abstrakcja, realizm, impresjonizm, minimalizm - poznaj style malarskie i wybierz technikę odpowiednią dla Twojego ręcznie malowanego obrazu na zamówienie.',
    keywords: ['style malarskie', 'abstrakcja', 'realizm', 'impresjonizm', 'minimalizm', 'malarstwo olejne', 'malarstwo akrylowe', 'techniki malarskie', 'ręcznie malowane obrazy'],
  },
  {
    slug: 'jak-zamowic-obraz',
    name: 'Jak zamówić obraz',
    title: 'Jak Zamówić Obraz - Przewodnik Krok po Kroku',
    description: 'Kompletny przewodnik: od pomysłu, przez opis zlecenia, wybór artysty malarza, płatność zaliczki, po odbiór gotowego ręcznie malowanego obrazu.',
    keywords: ['jak zamówić obraz', 'jak zlecić obraz', 'zamów obraz', 'zleć obraz', 'przewodnik zlecanie obrazu', 'krok po kroku obraz na zamówienie', 'malarstwo na zamówienie'],
  },
  {
    slug: 'zlecenia-dla-artystow',
    name: 'Zlecenia dla artystów',
    title: 'Zlecenia dla Artystów - Jak Znaleźć i Realizować Zlecenia Malarskie',
    description: 'Marketplace zleceń dla artystów malarzy: jak przeglądać zlecenia na ręcznie malowane obrazy, składać oferty, komunikować się ze zlecającymi i realizować projekty.',
    keywords: ['zlecenia dla artystów', 'zlecenia malarskie', 'marketplace zleceń', 'oferty artysta', 'zlecenia obrazy', 'praca dla artysty', 'malarstwo rękodzieło'],
  },
  {
    slug: 'poradniki-dla-artystow',
    name: 'Poradniki dla artystów',
    title: 'Poradniki dla Artystów - Portfolio, Wycena, Kariera',
    description: 'Praktyczne porady dla artystów malarzy: budowanie portfolio, wycena ręcznie malowanych prac, komunikacja ze zlecającymi, budowanie marki osobistej.',
    keywords: ['poradniki dla artystów', 'portfolio artysty', 'wycena obrazów', 'kariera artysty', 'marka osobista artysty', 'komunikacja z klientem', 'malarstwo rękodzieło'],
  },
];

export interface SampleImage {
  src: string;
  alt: string;
}

export const KATEGORIA_IMAGES: Record<string, SampleImage[]> = {
  pejzaze: [
    { src: '/sample-pejzaze-1.webp', alt: 'Górski pejzaż o świcie, mgliste szczyty w odcieniach błękitu i zieleni, ręcznie malowany obraz olejny' },
    { src: '/sample-pejzaze-2.webp', alt: 'Nadmorski pejzaż z klifami o zachodzie słońca, obraz olejny w ciepłych tonach' },
    { src: '/sample-pejzaze-3.webp', alt: 'Wiejska łąka z polnymi kwiatami i odległym domem, pejzaż akrylowy w stylu impresjonistycznym' },
  ],
  abstrakcyjne: [
    { src: '/sample-abstrakcyjne-1.webp', alt: 'Abstrakcja geometryczna w odcieniach piasku i terakoty, obraz z fakturą impasto' },
    { src: '/sample-abstrakcyjne-2.webp', alt: 'Liryczna abstrakcja w błękicie i złocie, obraz techniką mieszaną na płótnie' },
    { src: '/sample-abstrakcyjne-3.webp', alt: 'Abstrakcja ekspresyjna w karmazynie i czerni, obraz z energetycznymi pociągnięciami pędzla' },
  ],
  portrety: [
    { src: '/sample-portrety-1.webp', alt: 'Klasyczny portret olejny kobiety w miękkim świetle naturalnym, styl renesansowy' },
    { src: '/sample-portrety-2.webp', alt: 'Współczesny portret dziecka w swobodnej technice akrylowej, ciepła paleta' },
    { src: '/sample-portrety-3.webp', alt: 'Portret psa golden retrievera w technice olejnej, szczegółowa faktura sierści' },
  ],
  nowoczesne: [
    { src: '/sample-nowoczesne-1.webp', alt: 'Nowoczesny obraz geometryczny w granacie, bieli i musztardzie, kompozycja akrylowa' },
    { src: '/sample-nowoczesne-2.webp', alt: 'Abstrakcja architektoniczna w szarości i morskim błękicie ze złotymi akcentami, obraz współczesny' },
    { src: '/sample-nowoczesne-3.webp', alt: 'Graficzna kompozycja ukośnych form w monochromie z czerwonym akcentem, styl Bauhaus' },
  ],
  minimalistyczne: [
    { src: '/sample-minimalistyczne-1.webp', alt: 'Minimalistyczny obraz z cienką linią na kremowym płótnie, estetyka japońska' },
    { src: '/sample-minimalistyczne-2.webp', alt: 'Minimalizm, dwa miękkie koła w odcieniu szałwii na kremowym tle, styl skandynawski' },
    { src: '/sample-minimalistyczne-3.webp', alt: 'Minimalistyczny obraz z subtelnym gradientem od szarości do bieli, estetyka wabi-sabi' },
  ],
};

export const WNETRZE_IMAGES: Record<string, SampleImage[]> = {
  salon: [
    { src: '/sample-salon-1.webp', alt: 'Abstrakcyjny obraz w odcieniach piasku nad nowoczesną kanapą w jasnym salonie' },
    { src: '/sample-salon-2.webp', alt: 'Pejzaż w oprawie drewnianej nad kominkiem w eleganckim salonie' },
    { src: '/sample-salon-3.webp', alt: 'Współczesna abstrakcja w błękicie i szarości na białej ścianie w nowoczesnym salonie' },
  ],
  sypialnia: [
    { src: '/sample-sypialnia-1.webp', alt: 'Spokojny abstrakcyjny obraz w pastelowych odcieniach nad wezgłowiem łóżka w minimalistycznej sypialni' },
    { src: '/sample-sypialnia-2.webp', alt: 'Delikatny pejzaż w stonowanych błękitech nad szafką nocną w przytulnej sypialni' },
    { src: '/sample-sypialnia-3.webp', alt: 'Subtelny abstrakcyjny obraz florystyczny przy oknie w sypialni w porannym świetle' },
  ],
  biuro: [
    { src: '/sample-biuro-1.webp', alt: 'Geometryczny obraz abstrakcyjny w granacie i bieli na białej ścianie w nowoczesnym biurze' },
    { src: '/sample-biuro-2.webp', alt: 'Inspirujący obraz abstrakcyjny w złocie i szarości w sali konferencyjnej z przeszklonym wnętrzem' },
    { src: '/sample-biuro-3.webp', alt: 'Spokojny pejzaż górski w chłodnych tonach w recepcji biura, profesjonalne wnętrze' },
  ],
  hotel: [
    { src: '/sample-hotel-1.webp', alt: 'Seria abstrakcyjnych obrazów w złocie i kremie na ścianie korytarza hotelowego' },
    { src: '/sample-hotel-2.webp', alt: 'Duży obraz centerpiece w błękicie i brązie w lobby hotelu z marmurową podłogą' },
    { src: '/sample-hotel-3.webp', alt: 'Pejzaż nadmorski w pastelowych błękitech nad łóżkiem w butikowym pokoju hotelowym' },
  ],
};

export interface SampleCommission {
  title: string;
  image: string;
  summary: string;
  style: string;
  dimensions: string;
  budget: string;
  deadline: string;
  colors: string[];
  location: string;
  offers: number;
  comments: number;
  postedAgo: string;
}

export const KATEGORIA_COMMISSIONS: Record<string, SampleCommission[]> = {
  pejzaze: [
    {
      title: 'Górski pejzaż o świcie do nad wejściem',
      image: '/sample-pejzaze-1.webp',
      summary: 'Szukam artysty, który namaluje górski pejzaż o świcie, mgliste szczyty w odcieniach błękitu i zieleni. Obraz nad wejście do domu, orientacja pozioma.',
      style: 'Pejzaż · Olej',
      dimensions: '120×80 cm',
      budget: '2 000 - 3 500 zł',
      deadline: 'Do 45 dni',
      colors: ['Błękit', 'Zieleń', 'Mglisty szary'],
      location: 'Kraków',
      offers: 4,
      comments: 7,
      postedAgo: '3 dni temu',
    },
    {
      title: 'Nadmorski klif o zachodzie słońca',
      image: '/sample-pejzaze-2.webp',
      summary: 'Obraz nadmorski z klifami o złotej godzinie, ciepłe światło odbijające się w falach. Akryl lub olej, paleta ciepła.',
      style: 'Pejzaż morski · Olej',
      dimensions: '100×70 cm',
      budget: '1 500 - 2 500 zł',
      deadline: 'Do 30 dni',
      colors: ['Terakota', 'Złoto', 'Granat'],
      location: 'Gdańsk',
      offers: 3,
      comments: 5,
      postedAgo: '5 dni temu',
    },
    {
      title: 'Wiejska łąka z polnymi kwiatami',
      image: '/sample-pejzaze-3.webp',
      summary: 'Impresjonistyczny pejzaż wiejskiej łąki z kwiatami i odległym domem. Kolory: zieleń, fiolet, żółty. Akryl na płótnie.',
      style: 'Pejzaż · Akryl',
      dimensions: '80×60 cm',
      budget: '900 - 1 600 zł',
      deadline: 'Do 21 dni',
      colors: ['Zieleń', 'Fiolet', 'Żółty'],
      location: 'Wrocław',
      offers: 6,
      comments: 9,
      postedAgo: '1 tydzień temu',
    },
  ],
  abstrakcyjne: [
    {
      title: 'Abstrakcja geometryczna w piasku i terakocie',
      image: '/sample-abstrakcyjne-1.webp',
      summary: 'Szukam artysty specjalizującego się w abstrakcji geometrycznej. Obraz z wyraźną fakturą impasto, paleta piasku, terakoty i kremu. Do nowoczesnego salonu.',
      style: 'Abstrakcja · Akryl',
      dimensions: '150×100 cm',
      budget: '2 500 - 4 000 zł',
      deadline: 'Do 40 dni',
      colors: ['Piasek', 'Terakota', 'Krem'],
      location: 'Warszawa',
      offers: 5,
      comments: 8,
      postedAgo: '2 dni temu',
    },
    {
      title: 'Liryczna abstrakcja w błękicie i złocie',
      image: '/sample-abstrakcyjne-2.webp',
      summary: 'Obraz abstrakcyjny z płynnymi, organicznymi formami. Głęboki błękit ze złotymi akcentami. Technika mieszana, płynne pociągnięcia pędzla.',
      style: 'Abstrakcja · Media mieszane',
      dimensions: '120×90 cm',
      budget: '1 800 - 3 000 zł',
      deadline: 'Do 35 dni',
      colors: ['Błękit', 'Złoto', 'Krem'],
      location: 'Poznań',
      offers: 4,
      comments: 6,
      postedAgo: '4 dni temu',
    },
    {
      title: 'Ekspresyjna abstrakcja w karmazynie',
      image: '/sample-abstrakcyjne-3.webp',
      summary: 'Energetyczny obraz abstrakcyjny w karmazynie, pomarańczu i czerni. Grube warstwy farby, dramatyczna kompozycja. Do loftu przemysłowego.',
      style: 'Abstrakcja ekspresyjna · Olej',
      dimensions: '140×100 cm',
      budget: '3 000 - 5 000 zł',
      deadline: 'Do 50 dni',
      colors: ['Karmazyn', 'Pomarańcz', 'Czerń'],
      location: 'Łódź',
      offers: 3,
      comments: 4,
      postedAgo: '6 dni temu',
    },
  ],
  portrety: [
    {
      title: 'Portret żony w stylu klasycznym',
      image: '/sample-portrety-1.webp',
      summary: 'Portret olejny żony w stylu klasycznym, miękkie światło naturalne. Format pionowy, tło stonowane. Prezent na rocznicę.',
      style: 'Portret · Olej',
      dimensions: '50×70 cm',
      budget: '1 500 - 2 800 zł',
      deadline: 'Do 60 dni',
      colors: ['Ciepłe brązy', 'Krem', 'Zieleń'],
      location: 'Warszawa',
      offers: 5,
      comments: 10,
      postedAgo: '1 dzień temu',
    },
    {
      title: 'Portret córki w technice akrylowej',
      image: '/sample-portrety-2.webp',
      summary: 'Współczesny portret córki (5 lat) w swobodnej technice akrylowej. Ciepła paleta, luźne pociągnięcia pędzla, naturalny uśmiech.',
      style: 'Portret · Akryl',
      dimensions: '40×50 cm',
      budget: '800 - 1 500 zł',
      deadline: 'Do 30 dni',
      colors: ['Brzoskwinia', 'Krem', 'Ciepły szary'],
      location: 'Katowice',
      offers: 7,
      comments: 12,
      postedAgo: '3 dni temu',
    },
    {
      title: 'Portret psa golden retrievera',
      image: '/sample-portrety-3.webp',
      summary: 'Portret ukochanego psa golden retrievera. Olej na płótnie, szczegółowa faktura sierści, ciepłe brązy i złoto. Pamiątka rodzinna.',
      style: 'Portret zwierzęcia · Olej',
      dimensions: '40×40 cm',
      budget: '600 - 1 200 zł',
      deadline: 'Do 25 dni',
      colors: ['Złoto', 'Brąz', 'Krem'],
      location: 'Bydgoszcz',
      offers: 4,
      comments: 6,
      postedAgo: '5 dni temu',
    },
  ],
  nowoczesne: [
    {
      title: 'Geometryczna kompozycja do biura',
      image: '/sample-nowoczesne-1.webp',
      summary: 'Nowoczesny obraz geometryczny w granacie, bieli i musztardzie. Czyste bloki koloru, ostre krawędzie. Akryl na płótnie, orientacja pozioma.',
      style: 'Nowoczesny · Akryl',
      dimensions: '160×90 cm',
      budget: '2 500 - 4 500 zł',
      deadline: 'Do 40 dni',
      colors: ['Granat', 'Biel', 'Musztarda'],
      location: 'Warszawa',
      offers: 4,
      comments: 6,
      postedAgo: '2 dni temu',
    },
    {
      title: 'Abstrakcja architektoniczna ze złotem',
      image: '/sample-nowoczesne-2.webp',
      summary: 'Współczesny obraz z liniami architektonicznymi, szarość i morski błękit ze złotymi akcentami. Do nowoczesnego apartamentu.',
      style: 'Nowoczesny · Akryl',
      dimensions: '120×80 cm',
      budget: '2 000 - 3 500 zł',
      deadline: 'Do 35 dni',
      colors: ['Szary', 'Morski błękit', 'Złoto'],
      location: 'Gdynia',
      offers: 3,
      comments: 5,
      postedAgo: '4 dni temu',
    },
    {
      title: 'Kompozycja ukośnych form w monochromie',
      image: '/sample-nowoczesne-3.webp',
      summary: 'Graficzny obraz w stylu Bauhaus, ukośne formy w monochromie z jednym czerwonym akcentem. Czyste linie, akryl na płótnie.',
      style: 'Nowoczesny · Akryl',
      dimensions: '100×100 cm',
      budget: '1 800 - 3 000 zł',
      deadline: 'Do 30 dni',
      colors: ['Czerń', 'Biel', 'Czerwień'],
      location: 'Wrocław',
      offers: 5,
      comments: 7,
      postedAgo: '1 tydzień temu',
    },
  ],
  minimalistyczne: [
    {
      title: 'Minimalistyczny obraz z cienką linią',
      image: '/sample-minimalistyczne-1.webp',
      summary: 'Ekstremalnie prosty obraz: jedna cienka pozioma linia na kremowym płótnie. Estetyka japońska, wabi-sabi. Do sypialni w stylu japandi.',
      style: 'Minimalizm · Akryl',
      dimensions: '80×120 cm',
      budget: '800 - 1 500 zł',
      deadline: 'Do 21 dni',
      colors: ['Krem', 'Szary'],
      location: 'Warszawa',
      offers: 4,
      comments: 5,
      postedAgo: '3 dni temu',
    },
    {
      title: 'Dwa koła w odcieniu szałwii',
      image: '/sample-minimalistyczne-2.webp',
      summary: 'Minimalistyczny obraz z dwoma miękkimi kołami w odcieniu szałwii na kremowym tle. Styl skandynawski, subtelna faktura.',
      style: 'Minimalizm · Akryl',
      dimensions: '60×90 cm',
      budget: '600 - 1 200 zł',
      deadline: 'Do 20 dni',
      colors: ['Szałwia', 'Krem'],
      location: 'Gdańsk',
      offers: 3,
      comments: 4,
      postedAgo: '5 dni temu',
    },
    {
      title: 'Subtelny gradient od szarości do bieli',
      image: '/sample-minimalistyczne-3.webp',
      summary: 'Minimalistyczny obraz z ledwo widocznym gradientem od jasnej szarości do bieli. Medytacyjny, spokojny. Do wnętrza w stylu wabi-sabi.',
      style: 'Minimalizm · Media mieszane',
      dimensions: '90×120 cm',
      budget: '900 - 1 800 zł',
      deadline: 'Do 25 dni',
      colors: ['Szary', 'Biel'],
      location: 'Kraków',
      offers: 2,
      comments: 3,
      postedAgo: '1 tydzień temu',
    },
  ],
};

export const WNETRZE_COMMISSIONS: Record<string, SampleCommission[]> = {
  salon: [
    {
      title: 'Abstrakcja nad kanapę w odcieniach piasku',
      image: '/sample-salon-1.webp',
      summary: 'Obraz nad nowoczesną kanapę, abstrakcja w odcieniach piasku i terakoty. Jasny salon, dużo światła naturalnego. Paleta ciepła, stonowana.',
      style: 'Abstrakcja · Akryl',
      dimensions: '150×100 cm',
      budget: '2 500 - 4 000 zł',
      deadline: 'Do 40 dni',
      colors: ['Piasek', 'Terakota', 'Krem'],
      location: 'Warszawa',
      offers: 5,
      comments: 8,
      postedAgo: '2 dni temu',
    },
    {
      title: 'Pejzaż nad kominek w oprawie drewnianej',
      image: '/sample-salon-2.webp',
      summary: 'Klasyczny pejzaż nad kominek, oprawa drewniana. Ciepłe złote światło, sceneria leśna. Obraz olejny, orientacja pozioma.',
      style: 'Pejzaż · Olej',
      dimensions: '120×60 cm',
      budget: '2 000 - 3 500 zł',
      deadline: 'Do 45 dni',
      colors: ['Złoto', 'Zieleń', 'Brąz'],
      location: 'Kraków',
      offers: 4,
      comments: 6,
      postedAgo: '4 dni temu',
    },
    {
      title: 'Współczesna abstrakcja w błękicie i szarości',
      image: '/sample-salon-3.webp',
      summary: 'Obraz na białą ścianę w nowoczesnym salonie. Abstrakcja w błękicie i szarości, chłodna paleta. Akryl na płótnie, duży format.',
      style: 'Abstrakcja · Akryl',
      dimensions: '160×100 cm',
      budget: '3 000 - 5 000 zł',
      deadline: 'Do 50 dni',
      colors: ['Błękit', 'Szary', 'Biel'],
      location: 'Wrocław',
      offers: 3,
      comments: 5,
      postedAgo: '6 dni temu',
    },
  ],
  sypialnia: [
    {
      title: 'Pastelowa abstrakcja nad łóżko',
      image: '/sample-sypialnia-1.webp',
      summary: 'Spokojny abstrakcyjny obraz nad wezgłowie łóżka w minimalistycznej sypialni. Pastelowe odcienie, puder i krem. Relaksujący nastrój.',
      style: 'Abstrakcja · Akryl',
      dimensions: '100×70 cm',
      budget: '1 200 - 2 200 zł',
      deadline: 'Do 30 dni',
      colors: ['Puder', 'Krem', 'Beż'],
      location: 'Poznań',
      offers: 4,
      comments: 6,
      postedAgo: '3 dni temu',
    },
    {
      title: 'Delikatny pejzaż nad szafkę nocną',
      image: '/sample-sypialnia-2.webp',
      summary: 'Stonowany pejzaż w błękicie i lawendzie nad szafkę nocną w przytulnej sypialni. Miękkie światło, relaksująca atmosfera. Akryl na płótnie.',
      style: 'Pejzaż · Akryl',
      dimensions: '50×70 cm',
      budget: '700 - 1 400 zł',
      deadline: 'Do 25 dni',
      colors: ['Błękit', 'Lawenda', 'Krem'],
      location: 'Gdańsk',
      offers: 5,
      comments: 7,
      postedAgo: '5 dni temu',
    },
    {
      title: 'Florystyczna abstrakcja przy oknie',
      image: '/sample-sypialnia-3.webp',
      summary: 'Subtelny abstrakcyjny obraz florystyczny przy oknie w sypialni. Poranne światło, intymny nastrój. Ciepłe odcienie różu i zieleni.',
      style: 'Abstrakcja florystyczna · Akryl',
      dimensions: '60×80 cm',
      budget: '900 - 1 600 zł',
      deadline: 'Do 28 dni',
      colors: ['Róż', 'Zieleń', 'Krem'],
      location: 'Warszawa',
      offers: 3,
      comments: 4,
      postedAgo: '1 tydzień temu',
    },
  ],
  biuro: [
    {
      title: 'Geometryczna abstrakcja do biura open space',
      image: '/sample-biuro-1.webp',
      summary: 'Profesjonalny obraz abstrakcyjny na białą ścianę w biurze open space. Geometryczna kompozycja w granacie i bieli. Akryl na płótnie, duży format.',
      style: 'Abstrakcja geometryczna · Akryl',
      dimensions: '180×120 cm',
      budget: '3 500 - 6 000 zł',
      deadline: 'Do 45 dni',
      colors: ['Granat', 'Biel', 'Szary'],
      location: 'Warszawa',
      offers: 4,
      comments: 7,
      postedAgo: '2 dni temu',
    },
    {
      title: 'Inspirujący obraz do sali konferencyjnej',
      image: '/sample-biuro-2.webp',
      summary: 'Obraz abstrakcyjny w złocie i szarości do przeszklonej sali konferencyjnej. Inspirujący, profesjonalny. Akryl z złotymi akcentami.',
      style: 'Abstrakcja · Akryl',
      dimensions: '140×90 cm',
      budget: '2 500 - 4 500 zł',
      deadline: 'Do 40 dni',
      colors: ['Złoto', 'Szary', 'Biel'],
      location: 'Kraków',
      offers: 3,
      comments: 5,
      postedAgo: '4 dni temu',
    },
    {
      title: 'Pejzaż górski do recepcji biura',
      image: '/sample-biuro-3.webp',
      summary: 'Spokojny pejzaż górski w chłodnych tonach do recepcji biura. Welcoming, profesjonalny. Olej na płótnie, orientacja pozioma.',
      style: 'Pejzaż · Olej',
      dimensions: '120×80 cm',
      budget: '2 000 - 3 500 zł',
      deadline: 'Do 35 dni',
      colors: ['Błękit', 'Szary', 'Biel'],
      location: 'Katowice',
      offers: 5,
      comments: 8,
      postedAgo: '1 tydzień temu',
    },
  ],
  hotel: [
    {
      title: 'Seria obrazów na korytarz hotelowy',
      image: '/sample-hotel-1.webp',
      summary: 'Seria 5 spójnych abstrakcyjnych obrazów na korytarz hotelowy. Koordynowana paleta złota i kremu. Każdy obraz 60×80 cm. Akryl na płótnie.',
      style: 'Abstrakcja · Akryl',
      dimensions: '5× 60×80 cm',
      budget: '6 000 - 12 000 zł',
      deadline: 'Do 60 dni',
      colors: ['Złoto', 'Krem', 'Brąz'],
      location: 'Sopot',
      offers: 3,
      comments: 9,
      postedAgo: '3 dni temu',
    },
    {
      title: 'Centerpiece do lobby hotelu',
      image: '/sample-hotel-2.webp',
      summary: 'Duży obraz centerpiece do lobby hotelu z marmurową podłogą. Abstrakcja w błękicie i brązie, luksusowy charakter. Format 200×120 cm.',
      style: 'Abstrakcja · Olej',
      dimensions: '200×120 cm',
      budget: '8 000 - 15 000 zł',
      deadline: 'Do 70 dni',
      colors: ['Błękit', 'Brąz', 'Złoto'],
      location: 'Warszawa',
      offers: 2,
      comments: 6,
      postedAgo: '5 dni temu',
    },
    {
      title: 'Pejzaż nadmorski do pokoi hotelowych',
      image: '/sample-hotel-3.webp',
      summary: 'Seria 12 pejzaży nadmorskich w pastelowych błękitech do pokoi butikowego hotelu. Spójna paleta, koordynowany styl. Każdy obraz 50×70 cm.',
      style: 'Pejzaż · Akryl',
      dimensions: '12× 50×70 cm',
      budget: '10 000 - 20 000 zł',
      deadline: 'Do 90 dni',
      colors: ['Błękit', 'Zieleń', 'Krem'],
      location: 'Kołobrzeg',
      offers: 4,
      comments: 11,
      postedAgo: '1 tydzień temu',
    },
  ],
};

export function getObrazKategoria(slug: string): ObrazKategoria | undefined {
  return OBRAZY_KATEGORIE.find((k) => k.slug === slug);
}

export function getObrazyWnetrz(path: string): ObrazyWnetrz | undefined {
  return OBRAZY_WNETRZ.find((w) => w.path === path);
}

export function getBlogKategoria(slug: string): BlogKategoria | undefined {
  return BLOG_KATEGORIE.find((k) => k.slug === slug);
}
