import { CORE_INTENTS } from './seo-config';

/**
 * Keyword clusters mapped to page types.
 * Each page gets a unique set of supporting keywords, never an identical list.
 * Core SEO terms: ręcznie malowane, malarstwo, rękodzieło, obrazy na zamówienie.
 */

export const KEYWORDS = {
  home: [
    ...CORE_INTENTS,
    'platforma dla artystów',
    'malarstwo na zamówienie',
    'obraz dopasowany do wnętrza',
    'rękodzieło malarstwo',
  ],
  dlaZlecajacych: [
    'zleć obraz',
    'jak zlecić obraz',
    'obraz na zamówienie do domu',
    'obraz dopasowany do wnętrza',
    'znajdź artystę malarza',
    'ręcznie malowane obrazy',
  ],
  dlaArtystow: [
    'zlecenia dla artystów',
    'zlecenia malarskie',
    'malarz zlecenia',
    'oferty zleceń na obrazy',
    'portfolio artysty',
    'malarstwo rękodzieło',
  ],
  zleceniaListing: [
    'zlecenia na obrazy',
    'aktualne zlecenia malarskie',
    'zlecenia dla artystów',
    'obrazy na zamówienie zlecenia',
    'marketplace zleceń artystycznych',
    'ręcznie malowane obrazy na zamówienie',
  ],
  artysciListing: [
    'artyści malarze',
    'malarze na zamówienie',
    'portfolio artystów malarzy',
    'znajdź artystę malarza',
    'artyści na zamówienie',
    'malarstwo rękodzieło',
  ],
  jakToDziala: [
    'jak zlecić obraz',
    'jak zamówić obraz',
    'proces zlecania obrazu',
    'przewodnik zlecania',
    'krok po kroku obraz na zamówienie',
    'malarstwo na zamówienie',
  ],
  cennik: [
    'ceny obrazów na zamówienie',
    'ile kosztuje obraz na zamówienie',
    'cennik zleceń malarskich',
    'opłaty platformy',
    'prowizje artysta',
    'cena ręcznie malowanego obrazu',
  ],
  faq: [
    'faq obrazy na zamówienie',
    'pytania zlecanie obrazów',
    'pomoc platforma artystyczna',
    'często zadawane pytania',
    'malarstwo na zamówienie',
  ],
  kontakt: [
    'kontakt platforma obrazy',
    'pomoc zlecanie obrazu',
    'wsparcie artysta zlecający',
    'zapytanie',
    'obrazy na zamówienie kontakt',
  ],
  regulamin: [
    'regulamin platformy',
    'warunki korzystania',
    'zasady marketplace',
    'obrazy na zamówienie regulamin',
  ],
  politykaPrywatnosci: [
    'polityka prywatności',
    'RODO',
    'ochrona danych osobowych',
    'platforma obrazy prywatność',
  ],
  zasadyDlaArtystow: [
    'zasady dla artystów',
    'reguły artysta malarz',
    'weryfikacja artysty',
    'malarstwo zasady platforma',
  ],
  zasadyDlaZlecajacych: [
    'zasady dla zlecających',
    'reguły zlecanie obrazu',
    'prawa zlecającego',
    'obrazy na zamówienie zasady',
  ],
  kategoria: [
    'obrazy na zamówienie',
    'zleć obraz',
    'malarstwo na zamówienie',
    'ręcznie malowane obrazy',
  ],
  obrazyNaZamowienie: [
    'obrazy ręcznie malowane na zamówienie',
    'ręcznie malowane obrazy na zamówienie',
    'obraz na zamówienie',
    'zamów obraz',
    'obraz malowany na zamówienie',
    'malarstwo na zamówienie',
    'rękodzieło malarstwo',
  ],
  zamowObraz: [
    'zamów obraz',
    'zamów obraz ręcznie malowany',
    'jak zamówić obraz',
    'obraz na zamówienie formularz',
    'zleć obraz online',
    'ręcznie malowane obrazy',
  ],
  zlecObraz: [
    'zleć obraz',
    'zleć wykonanie obrazu',
    'jak zlecić obraz',
    'proces zlecania obrazu',
    'zlecanie obrazu krok po kroku',
    'malarstwo na zamówienie',
  ],
  zleceniaDlaArtystow: [
    'zlecenia dla artystów',
    'zlecenia malarskie',
    'zlecenia na obrazy dla artystów',
    'oferty zleceń malarstwo',
    'marketplace zleceń dla artystów',
    'malarstwo rękodzieło zlecenia',
  ],
  obrazyDoSalonu: [
    'obraz do salonu na zamówienie',
    'obraz do salonu',
    'obraz nad kanapę',
    'malarstwo do salonu',
    'ręcznie malowany obraz do salonu',
  ],
  obrazyDoSypialni: [
    'obraz do sypialni na zamówienie',
    'obraz do sypialni',
    'obraz nad łóżko',
    'spokojny obraz do sypialni',
    'ręcznie malowany obraz do sypialni',
  ],
  obrazyDoBiura: [
    'obraz do biura na zamówienie',
    'sztuka do biura',
    'obraz do gabinetu',
    'malarstwo do biura',
    'ręcznie malowany obraz do biura',
  ],
  obrazyDoHotelu: [
    'obrazy do hotelu',
    'sztuka hotelowa',
    'obrazy do lobby hotelu',
    'serie obrazów hotel',
    'ręcznie malowane obrazy do hotelu',
  ],
  blog: [
    'obrazy na zamówienie blog',
    'porady zlecanie obrazów',
    'inspiracje wnętrza obraz',
    'malarstwo rękodzieło blog',
  ],
  blogKategoria: [
    'blog obrazy',
    'poradniki',
    'artykuły sztuka malarstwo',
    'obrazy na zamówienie poradniki',
  ],
} as const;

export type KeywordGroup = keyof typeof KEYWORDS;
