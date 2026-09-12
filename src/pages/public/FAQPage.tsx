import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { useStaticSeo } from '@/hooks/useSeo';
import { FaqJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

type FAQCategory = 'all' | 'zlecajacy' | 'artysci' | 'architekci' | 'platnosci' | 'prywatnosc';

interface FAQItem {
  category: FAQCategory[];
  q: string;
  a: string;
}

const categoryLabels: Record<FAQCategory, string> = {
  all: 'Wszystkie',
  zlecajacy: 'Dla zlecających',
  artysci: 'Dla artystów',
  architekci: 'Architekci i deweloperzy',
  platnosci: 'Płatności i zaliczki',
  prywatnosc: 'Prywatność i odpowiedzialność',
};

const faqs: FAQItem[] = [
  // Dla zlecających
  {
    category: ['zlecajacy'],
    q: 'Czy Atelier jest sklepem internetowym?',
    a: 'Nie. Atelier to marketplace zleceń na obrazy. Artyści nie prowadzą własnych sklepów - mają profile i portfolio. Zlecający publikuje zlecenie, a artyści wysyłają oferty.',
  },
  {
    category: ['zlecajacy'],
    q: 'Ile kosztuje opublikowanie zlecenia?',
    a: 'Na początku publikacja zleceń jest darmowa. Rejestracja również jest darmowa. Docelowo planujemy płatne wyróżnienia zleceń i opcjonalne pakiety premium.',
  },
  {
    category: ['zlecajacy'],
    q: 'Jakie informacje warto podać w zleceniu?',
    a: 'Im precyzyjniej opiszesz zlecenie, tym lepsze oferty otrzymasz. Podaj: tytuł, styl, wymiary, preferowane kolory (i kolory do uniknięcia), nastrój, pomieszczenie, budżet (zakres od-do), termin, oraz załącz zdjęcia inspiracyjne (wnętrze, paleta, obrazy, które Ci się podobają).',
  },
  {
    category: ['zlecajacy'],
    q: 'Czy mogę załączyć zdjęcia inspiracyjne?',
    a: 'Tak. Możesz dodać do 6 zdjęć w formacie PNG lub JPG. Mogą to być zdjęcia wnętrza, palety kolorów, obrazów i stylów, które Ci się podobają, moodboardy i renderowane wizualizacje. Inspiracje są widoczne dla zalogowanych artystów.',
  },
  {
    category: ['zlecajacy'],
    q: 'Jak wybieram artystę?',
    a: 'Po opublikowaniu zlecenia artyści komentują i wysyłają formalne oferty. Porównaj portfolio, wyceny, terminy, zakres (materiały, oprawa, transport) i opinie. Akceptuj ofertę, która najbardziej Ci odpowiada.',
  },
  {
    category: ['zlecajacy'],
    q: 'Co jeśli nie dostanę żadnej oferty?',
    a: 'Spróbuj poszerzyć budżet, wydłużyć termin lub doprecyzować opis. Możesz też bezpośrednio zaprosić artystów z ich profili. Im bardziej szczegółowe zlecenie, tym większa szansa na oferty.',
  },

  // Dla artystów
  {
    category: ['artysci'],
    q: 'Jak zostać zweryfikowanym artystą?',
    a: 'Po rejestracji jako artysta, Twoje konto przechodzi weryfikację przez admina. Po zatwierdzeniu możesz komentować pod zleceniami, dodawać zdjęcia i wysyłać formalne oferty. Weryfikacja buduje zaufanie zlecających.',
  },
  {
    category: ['artysci'],
    q: 'Czy muszę prowadzić sklep na platformie?',
    a: 'Nie. Atelier nie jest sklepem. Artysta ma profil i portfolio, a zlecający publikują zlecenia. Artyści aplikują do zleceń przez komentarze i formalne oferty - nie sprzedają gotowych prac z półki.',
  },
  {
    category: ['artysci'],
    q: 'Ile kosztuje korzystanie z platformy jako artysta?',
    a: 'Na początku wszystkie funkcje są darmowe - profil, portfolio, komentarze, oferty, projekty. Docelowo planujemy opcjonalne pakiety i subskrypcje (wyróżnienie profilu, priorytetowe powiadomienia, nielimitowane oferty). Podstawowe funkcje pozostaną dostępne dla wszystkich.',
  },
  {
    category: ['artysci'],
    q: 'Jakie informacje powinienem umieścić w portfolio?',
    a: 'Każda praca powinna mieć tytuł, technikę (np. olej na płótnie), wymiary w centymetrach, rok i opcjonalnie cenę. Portfolio jest publiczne - widzą je zlecający. Pokazuj prace, które najlepiej reprezentują Twój styl i umiejętności.',
  },
  {
    category: ['artysci'],
    q: 'Czy mogę komentować pod zleceniem przed wysłaniem oferty?',
    a: 'Tak. Zalogowani i zatwierdzeni artyści mogą komentować i dodawać zdjęcia pod zleceniem. To zachęcane - zadawaj pytania, dodawaj zdjęcia próbek i buduj relację z zlecającym przed formalną ofertą.',
  },

  // Architekci i deweloperzy
  {
    category: ['architekci'],
    q: 'Czy mogę zlecać serie obrazów dla całego projektu?',
    a: 'Tak. Architekci i deweloperzy mogą zlecać serie obrazów - np. do pokoi hotelowych, apartamentów pokazowych, biur. Opisz w zleceniu liczbę prac, spójność palety i kompozycji oraz wymagania techniczne (np. werniks UV-odporny dla oświetlenia hotelowego).',
  },
  {
    category: ['architekci'],
    q: 'Czy mogę wystawić fakturę VAT jako firma?',
    a: 'Tak. Przy rejestracji jako zlecający możesz podać dane firmy (nazwa, NIP). Płatności przez platformę będą dokumentowane fakturą. Skontaktuj się z nami w sprawie rozliczeń B2B.',
  },
  {
    category: ['architekci'],
    q: 'Czy artyści mogą dostarczyć materiały marketingowe?',
    a: 'Tak. Wiele zleceń deweloperskich i architektonicznych wymaga zdjęć obrazu do materiałów marketingowych. Uwzględnij to w opisie zlecenia - artyści mogą dostarczyć zdjęcia high-res, certyfikaty autentyczności i wizualizacje.',
  },
  {
    category: ['architekci'],
    q: 'Czy mogę zlecić próbki przed pełną realizacją?',
    a: 'Tak. W opisie zlecenia możesz zaznaczyć, że oczekujesz próbek (np. 3 próbki 30×30 cm) przed akceptacją pełnej realizacji. Wielu artystów oferuje próbki jako część oferty.',
  },

  // Płatności i zaliczki
  {
    category: ['platnosci'],
    q: 'Jak działają płatności?',
    a: 'Płatność odbywa się w dwóch etapach. Po akceptacji oferty zlecający płaci zaliczkę (zwykle 40%). Po ukończeniu obrazu i akceptacji następuje płatność końcowa (60%). Docelowo płatności odbywają się przez Stripe.',
  },
  {
    category: ['platnosci'],
    q: 'Czy zaliczka jest zabezpieczona?',
    a: 'Zaliczka potwierdza zobowiązanie zlecającego i rozpoczyna realizację. Warunki zwrotu zaliczki zależą od ustaleń między artystą a zlecającym zgodnie z regulaminem. W razie sporu platforma może pośredniczyć w rozwiązaniu.',
  },
  {
    category: ['platnosci'],
    q: 'Kto ustala wysokość zaliczki?',
    a: 'Artysta określa procent zaliczki w ofercie (zwykle 30–50%). Zlecający akceptuje wariki oferty, w tym wysokość zaliczki, przy wyborze artysty.',
  },
  {
    category: ['platnosci'],
    q: 'Czy mogę negocjować cenę z artystą?',
    a: 'Cena jest określona w formalnej ofercie artysty. Zlecający może komentować i zadawać pytania przed akceptacją. Ostateczna cena jest ta, która figuruje w zaakceptowanej ofercie.',
  },
  {
    category: ['platnosci'],
    q: 'Co z kosztami materiałów, oprawy i transportu?',
    a: 'Każda oferta określa, czy materiały, oprawa (rama) i transport są wliczone w cenę czy stanowią koszty dodatkowe. Zlecający widzi pełny zakres oferty przed akceptacją.',
  },

  // Prywatność i odpowiedzialność
  {
    category: ['prywatnosc'],
    q: 'Kto widzi oferty złożone pod zleceniem?',
    a: 'Formalne oferty są widoczne tylko dla właściciela zlecenia, danego artysty i admina. Inni użytkownicy nie widzą ofert - ani kwoty, ani treści, ani danych artysty.',
  },
  {
    category: ['prywatnosc'],
    q: 'Co widzi gość publiczny?',
    a: 'Gość widzi tylko ograniczony podgląd zlecenia - krótki opis, wymiary, budżet, tagi. Nie widzi pełnego opisu, zdjęć inspiracyjnych, danych kontaktowych, komentarzy ani ofert.',
  },
  {
    category: ['prywatnosc'],
    q: 'Kto odpowiada za wykonanie obrazu?',
    a: 'Platforma jest marketplace i narzędziem komunikacji/płatności. Odpowiedzialność za wykonanie obrazu i wzajemne ustalenia leży po stronie artysty i zlecającego zgodnie z regulaminem. Platforma pośredniczy w komunikacji i płatnościach, ale nie jest stroną umowy między artystą a zlecającym.',
  },
  {
    category: ['prywatnosc'],
    q: 'Czy moje dane osobowe są bezpieczne?',
    a: 'Tak. Dane osobowe są przetwarzane zgodnie z polityką prywatności i RODO. Nie udostępniamy danych kontaktowych publicznie - komunikacja odbywa się przez platformę. Dane są przechowywane bezpiecznie i nie są sprzedawane osobom trzecim.',
  },
  {
    category: ['prywatnosc'],
    q: 'Czy zdjęcia inspiracyjne są publiczne?',
    a: 'Zdjęcia inspiracyjne są widoczne dla zalogowanych użytkowników (artystów). Gość widzi tylko ograniczony podgląd. Jeśli zdjęcia zawierają wrażliwe treści (np. wnętrze prywatne), możesz ograniczyć ich widoczność w ustawieniach zlecenia.',
  },
  {
    category: ['prywatnosc'],
    q: 'Co zrobić w przypadku sporu z artystą lub zlecającym?',
    a: 'Najpierw spróbuj rozwiązać spor poprzez komunikację na platformie. Jeśli to nie pomaga, skontaktuj się z supportem Atelier. Platforma może pośredniczyć w rozwiązaniu, ale ostateczna odpowiedzialność leży po stronach zgodnie z regulaminem.',
  },
];

export function FAQPage() {
  useStaticSeo('/faq');
  const [open, setOpen] = useState<number | null>(0);
  const [category, setCategory] = useState<FAQCategory>('all');

  const filtered = category === 'all' ? faqs : faqs.filter((f) => f.category.includes(category));
  const categories: FAQCategory[] = ['all', 'zlecajacy', 'artysci', 'architekci', 'platnosci', 'prywatnosc'];

  return (
    <div>
      <FaqJsonLd faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <BreadcrumbJsonLd items={[{ name: 'Strona główna', path: '/' }, { name: 'FAQ', path: '/faq' }]} />
      <section className="bg-ivory-100 pt-20 pb-16 lg:pt-28 lg:pb-20">
        <div className="container-narrow">
          <Reveal>
            <div className="text-center">
              <Badge color="gold"><Sparkles className="h-3 w-3" /> Pomoc</Badge>
              <h1 className="mt-6 font-display text-hero text-graphite-600 text-balance">Często zadawane pytania</h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-graphite-400 text-pretty">
                Odpowiedzi na pytania zlecających, artystów, architektów i deweloperów. Wybierz kategorię lub przeglądaj wszystkie.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 bg-ivory-50">
        <div className="container-narrow">
          <Reveal>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setOpen(null); }}
                  className={cn(
                    'rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300',
                    category === cat
                      ? 'bg-graphite-600 text-ivory-100 shadow-lg shadow-graphite-600/10'
                      : 'border border-graphite-400/20 text-graphite-400 hover:border-graphite-400/40 hover:text-graphite-600'
                  )}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="mt-10 divide-y divide-graphite-400/10 border-y border-graphite-400/10">
              {filtered.map((faq, i) => (
                <div key={`${category}-${i}`}>
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-6 text-left"
                  >
                    <span className={cn('font-display text-lg transition-colors', open === i ? 'text-graphite-700' : 'text-graphite-600')}>{faq.q}</span>
                    <ChevronDown className={cn('h-5 w-5 shrink-0 text-graphite-300 transition-transform', open === i && 'rotate-180')} />
                  </button>
                  {open === i && (
                    <p className="pb-6 text-sm text-graphite-400 text-pretty leading-relaxed animate-fade-in">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="mt-16 rounded-2xl bg-graphite-600 p-10 text-center">
              <h2 className="font-display text-2xl text-ivory-100">Nie znalazłeś odpowiedzi?</h2>
              <p className="mx-auto mt-4 max-w-md text-graphite-200">Skontaktuj się z nami - chętnie pomożemy.</p>
              <Link to="/kontakt" className="mt-6 inline-flex">
                <Button variant="gold" size="lg">Napisz do nas <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
