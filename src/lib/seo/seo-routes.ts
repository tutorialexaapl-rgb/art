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
    description: 'Zleć obraz abstrakcyjny ręcznie malowany - dopasowany do Twojego wnętrza. Wybierz artystę, określ paletę i wymiary.',
    keywords: ['obrazy abstrakcyjne na zamówienie', 'abstrakcja malarstwo', 'obraz abstrakcyjny do salonu', 'malarstwo abstrakcyjne'],
    intro: 'Obrazy abstrakcyjne to forma sztuki, która nie odtwarza rzeczywistości, lecz pracuje z kolorem, kształtem i kompozycją. Na platformie znajdziesz artystów specjalizujących się w malarstwie abstrakcyjnym - od geometrii, przez liryczną abstrakcję, po ekspresyjne impasto.',
  },
  {
    slug: 'pejzaze',
    name: 'Obrazy pejzaże',
    h1: 'Pejzaże na Zamówienie — Obrazy Ręcznie Malowane',
    description: 'Zleć pejzaż ręcznie malowany - górski, morski, miejski. Wybierz artystę, określ scenerię i wymiary obrazu.',
    keywords: ['pejzaż na zamówienie', 'obrazy pejzaże', 'malarstwo pejzażowe', 'krajobraz malowany na zamówienie'],
    intro: 'Pejzaż to jeden z najstarszych motywów w malarstwie. Od romantycznych górskich widoków po miejskie sceny i morskie horyzonty - artyści na platformie tworzą pejzaże dopasowane do Twojej wizji i wnętrza.',
  },
  {
    slug: 'portrety',
    name: 'Portrety na zamówienie',
    h1: 'Portrety na Zamówienie — Ręcznie Malowane',
    description: 'Zleć portret ręcznie malowany - portret rodziny, dziecka, zwierzęcia. Wybierz artystę portrecistę i technikę.',
    keywords: ['portret na zamówienie', 'portret malowany', 'portret olejny', 'portret rodzinny na zamówienie'],
    intro: 'Portret to osobisty i unikatowy prezent lub pamiątka. Artyści na platformie specjalizują się w portretach olejnych, akrylowych i ołówkowych - od klasycznych po współczesne interpretacje.',
  },
  {
    slug: 'nowoczesne',
    name: 'Obrazy nowoczesne',
    h1: 'Obrazy Nowoczesne na Zamówienie',
    description: 'Zleć nowoczesny obraz ręcznie malowany - dopasowany do współczesnego wnętrza. Geometryczne, minimalne, graficzne.',
    keywords: ['obrazy nowoczesne na zamówienie', 'malarstwo współczesne', 'obraz nowoczesny do salonu', 'sztuka współczesna na zamówienie'],
    intro: 'Obrazy nowoczesne łączą współczesną estetykę z tradycyjnym rzemiosłem. Czyste linie, geometryczne formy, stonowane palety - idealne do nowoczesnych i minimalistycznych wnętrz.',
  },
  {
    slug: 'minimalistyczne',
    name: 'Obrazy minimalistyczne',
    h1: 'Obrazy Minimalistyczne na Zamówienie',
    description: 'Zleć minimalistyczny obraz ręcznie malowany - stonowana paleta, prosta kompozycja. Idealne do skandynawskiego wnętrza.',
    keywords: ['obrazy minimalistyczne na zamówienie', 'minimalizm w malarstwie', 'obraz minimalistyczny do salonu', 'proste obrazy'],
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
    description: 'Zleć obraz do salonu ręcznie malowany - dopasowany do stylu, kolorów i wymiarów wnętrza. Otrzymaj oferty od artystów.',
    keywords: ['obraz do salonu na zamówienie', 'obraz do salonu', 'obraz nad kanapę', 'malarstwo do salonu'],
    intro: 'Salon to serce domu - miejsce, w którym obraz powinien pasować do stylu wnętrza, palety kolorów i skali ścian. Artyści na platformie tworzą obrazy dopasowane do konkretnych przestrzeni.',
  },
  {
    slug: 'sypialnia',
    path: '/obrazy-do-sypialni',
    name: 'Obrazy do sypialni',
    h1: 'Obrazy do Sypialni na Zamówienie',
    description: 'Zleć obraz do sypialni ręcznie malowany - spokojna paleta, intymna atmosfera. Dopasowany do przestrzeni i nastroju.',
    keywords: ['obraz do sypialni na zamówienie', 'obraz do sypialni', 'obraz nad łóżko', 'spokojny obraz'],
    intro: 'Sypialnia wymaga spokojnej i harmonijnej sztuki. Stonowane palety, miękkie faktury i abstrakcyjne kompozycje tworzą atmosferę relaksu. Artyści dopasują obraz do przestrzeni nad łóżkiem lub komodą.',
  },
  {
    slug: 'biuro',
    path: '/obrazy-do-biura',
    name: 'Obrazy do biura',
    h1: 'Obrazy do Biura na Zamówienie',
    description: 'Zleć obraz do biura ręcznie malowany - profesjonalny, inspirujący. Dopasowany do przestrzeni pracy i wizerunku firmy.',
    keywords: ['obraz do biura na zamówienie', 'sztuka do biura', 'obraz do gabinetu', 'malarstwo do biura'],
    intro: 'Obraz w biurze buduje wizerunek i atmosferę. Artyści na platformie tworzą prace dopasowane do przestruli pracy - od stonowanych kompozycji do recepcji, po inspirujące abstrakcje do sal spotkań.',
  },
  {
    slug: 'hotel',
    path: '/obrazy-do-hotelu',
    name: 'Obrazy do hotelu',
    h1: 'Obrazy do Hotelu na Zamówienie',
    description: 'Zleć obrazy do hotelu - serie dopasowane do pokoi, lobby i stref gastronomicznych. Ręcznie malowane, unikatowe.',
    keywords: ['obrazy do hotelu', 'sztuka hotelowa', 'obrazy do lobby hotelu', 'serie obrazów hotel'],
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
    title: 'Obrazy na Zamówienie — Przewodniki i Poradniki',
    description: 'Wszystko o obrazach na zamówienie: jak zlecić, ile kosztują, jak wybrać artystę i jak ustalić budżet na ręcznie malowane dzieło.',
    keywords: ['obrazy na zamówienie', 'obraz na zamówienie', 'jak zlecić obraz', 'cena obrazu na zamówienie', 'ręcznie malowane obrazy'],
  },
  {
    slug: 'obrazy-do-wnetrz',
    name: 'Obrazy do wnętrz',
    title: 'Obrazy do Wnętrz — Jak Dopasować Obraz do Przestrzeni',
    description: 'Jak dobrać obraz do salonu, sypialni, biura lub hotelu. Skala, paleta, kompozycja i styl - poradniki dla zlecających i architektów wnętrz.',
    keywords: ['obrazy do wnętrz', 'obraz do salonu', 'obraz do sypialni', 'obraz do biura', 'dobór obrazu do wnętrza', 'obraz do hotelu'],
  },
  {
    slug: 'style-malarskie',
    name: 'Style malarskie',
    title: 'Style Malarskie — Przewodnik po Technikach i Kierunkach',
    description: 'Abstrakcja, realizm, impresjonizm, minimalizm - poznaj style malarskie i wybierz technikę odpowiednią dla Twojego obrazu.',
    keywords: ['style malarskie', 'abstrakcja', 'realizm', 'impresjonizm', 'minimalizm', 'malarstwo olejne', 'malarstwo akrylowe', 'techniki malarskie'],
  },
  {
    slug: 'jak-zamowic-obraz',
    name: 'Jak zamówić obraz',
    title: 'Jak Zamówić Obraz — Przewodnik Krok po Kroku',
    description: 'Kompletny przewodnik: od pomysłu, przez opis zlecenia, wybór artysty, płatność zaliczki, po odbiór gotowego obrazu.',
    keywords: ['jak zamówić obraz', 'jak zlecić obraz', 'zamów obraz', 'zleć obraz', 'przewodnik zlecanie obrazu', 'krok po kroku obraz na zamówienie'],
  },
  {
    slug: 'zlecenia-dla-artystow',
    name: 'Zlecenia dla artystów',
    title: 'Zlecenia dla Artystów — Jak Znaleźć i Realizować Zlecenia Malarskie',
    description: 'Marketplace zleceń dla artystów malarzy: jak przeglądać zlecenia, składać oferty, komunikować się ze zlecającymi i realizować projekty.',
    keywords: ['zlecenia dla artystów', 'zlecenia malarskie', 'marketplace zleceń', 'oferty artysta', 'zlecenia obrazy', 'praca dla artysty'],
  },
  {
    slug: 'poradniki-dla-artystow',
    name: 'Poradniki dla artystów',
    title: 'Poradniki dla Artystów — Portfolio, Wycena, Kariera',
    description: 'Praktyczne porady dla artystów malarzy: budowanie portfolio, wycena prac, komunikacja ze zlecającymi, budowanie marki osobistej.',
    keywords: ['poradniki dla artystów', 'portfolio artysty', 'wycena obrazów', 'kariera artysty', 'marka osobista artysty', 'komunikacja z klientem'],
  },
];

export function getObrazKategoria(slug: string): ObrazKategoria | undefined {
  return OBRAZY_KATEGORIE.find((k) => k.slug === slug);
}

export function getObrazyWnetrz(path: string): ObrazyWnetrz | undefined {
  return OBRAZY_WNETRZ.find((w) => w.path === path);
}

export function getBlogKategoria(slug: string): BlogKategoria | undefined {
  return BLOG_KATEGORIE.find((k) => k.slug === slug);
}
