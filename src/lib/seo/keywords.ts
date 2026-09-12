import { CORE_INTENTS } from './seo-config';

/**
 * Keyword clusters mapped to page types.
 * Each page gets a unique set of supporting keywords, never an identical list.
 */

export const KEYWORDS = {
  home: [
    ...CORE_INTENTS,
    'platforma dla artystów',
    'malarstwo na zamówienie',
    'obraz dopasowany do wnętrza',
  ],
  dlaZlecajacych: [
    'zleć obraz',
    'jak zlecić obraz',
    'obraz na zamówienie do domu',
    'obraz dopasowany do wnętrza',
    'znajdź artystę malarza',
  ],
  dlaArtystow: [
    'zlecenia dla artystów',
    'zlecenia malarskie',
    'malarz zlecenia',
    'oferty zleceń na obrazy',
    'portfolio artysty',
  ],
  zleceniaListing: [
    'zlecenia na obrazy',
    'aktualne zlecenia malarskie',
    'zlecenia dla artystów',
    'obrazy na zamówienie zlecenia',
    'marketplace zleceń artystycznych',
  ],
  artysciListing: [
    'artyści malarze',
    'malarze na zamówienie',
    'portfolio artystów malarzy',
    'znajdź artystę malarza',
    'artyści na zamówienie',
  ],
  jakToDziala: [
    'jak zlecić obraz',
    'jak zamówić obraz',
    'proces zlecania obrazu',
    'przewodnik zlecania',
    'krok po kroku obraz na zamówienie',
  ],
  cennik: [
    'ceny obrazów na zamówienie',
    'ile kosztuje obraz na zamówienie',
    'cennik zleceń malarskich',
    'opłaty platformy',
    'prowizje artysta',
  ],
  faq: [
    'faq obrazy na zamówienie',
    'pytania zlecanie obrazów',
    'pomoc platforma artystyczna',
    'często zadawane pytania',
  ],
  kontakt: [
    'kontakt platforma obrazy',
    'pomoc zlecanie obrazu',
    'wsparcie artysta zlecający',
    'zapytanie',
  ],
  regulamin: [
    'regulamin platformy',
    'warunki korzystania',
    'zasady marketplace',
  ],
  politykaPrywatnosci: [
    'polityka prywatności',
    'RODO',
    'ochrona danych osobowych',
  ],
  zasadyDlaArtystow: [
    'zasady dla artystów',
    'reguły artysta malarz',
    'weryfikacja artysty',
  ],
  zasadyDlaZlecajacych: [
    'zasady dla zlecających',
    'reguły zlecanie obrazu',
    'prawa zlecającego',
  ],
  kategoria: [
    'obrazy na zamówienie',
    'zleć obraz',
    'malarstwo na zamówienie',
  ],
  obrazyNaZamowienie: [
    'obrazy ręcznie malowane na zamówienie',
    'ręcznie malowane obrazy na zamówienie',
    'obraz na zamówienie',
    'zamów obraz',
    'obraz malowany na zamówienie',
    'malarstwo na zamówienie',
  ],
  zamowObraz: [
    'zamów obraz',
    'zamów obraz ręcznie malowany',
    'jak zamówić obraz',
    'obraz na zamówienie formularz',
    'zleć obraz online',
  ],
  zlecObraz: [
    'zleć obraz',
    'zleć wykonanie obrazu',
    'jak zlecić obraz',
    'proces zlecania obrazu',
    'zlecanie obrazu krok po kroku',
  ],
  zleceniaDlaArtystow: [
    'zlecenia dla artystów',
    'zlecenia malarskie',
    'zlecenia na obrazy dla artystów',
    'oferty zleceń malarstwo',
    'marketplace zleceń dla artystów',
  ],
  obrazyDoSalonu: [
    'obraz do salonu na zamówienie',
    'obraz do salonu',
    'obraz nad kanapę',
    'malarstwo do salonu',
  ],
  obrazyDoSypialni: [
    'obraz do sypialni na zamówienie',
    'obraz do sypialni',
    'obraz nad łóżko',
    'spokojny obraz do sypialni',
  ],
  obrazyDoBiura: [
    'obraz do biura na zamówienie',
    'sztuka do biura',
    'obraz do gabinetu',
    'malarstwo do biura',
  ],
  obrazyDoHotelu: [
    'obrazy do hotelu',
    'sztuka hotelowa',
    'obrazy do lobby hotelu',
    'serie obrazów hotel',
  ],
  blog: [
    'obrazy na zamówienie blog',
    'porady zlecanie obrazów',
    'inspiracje wnętrza obraz',
  ],
  blogKategoria: [
    'blog obrazy',
    'poradniki',
    'artykuły sztuka malarstwo',
  ],
} as const;

export type KeywordGroup = keyof typeof KEYWORDS;
