import { Scale, AlertTriangle } from 'lucide-react';
import { ContentPage } from './ContentPage';

function LegalNotice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gold-300/40 bg-gold-50 p-5">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
      <div>
        <p className="text-sm font-medium text-graphite-600">Wymaga konsultacji prawnej</p>
        <p className="mt-1 text-xs text-graphite-400 leading-relaxed">
          Poniższa treść jest szkicem roboczym (placeholder) i nie stanowi wiążącej regulacji.
          Przed publikacją platformy dokument musi zostać zweryfikowany przez prawnika,
          dostosowany do wymogów RODO, Ustawy o prawach konsumenta oraz specyfiki działalności marketplace.
        </p>
      </div>
    </div>
  );
}

export function RegulaminPage() {
  return (
    <ContentPage eyebrow="Dokument prawny" title="Regulamin" description="Warunki korzystania z platformy Atelier.">
      <div className="prose prose-stone max-w-none">
        <div className="space-y-8 text-graphite-500 leading-relaxed">
          <LegalNotice />

          <section>
            <h2 className="font-display text-xl text-graphite-600">1. Postanowienia ogólne</h2>
            <p className="mt-3 text-sm">Atelier (dalej „Platforma”) jest platformą marketplace łączącą zlecających z artystami malarzami. Platforma nie jest sklepem internetowych. Artyści nie prowadzą własnych sklepów - mają profile i portfolio.</p>
            <p className="mt-2 text-sm">Korzystanie z Platformy oznacza akceptację niniejszego regulaminu.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-graphite-600">2. Definicje</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><strong>Zlecający</strong> - użytkownik publikujący zlecenie na obraz.</li>
              <li><strong>Artysta</strong> - użytkownik tworzący oferty i realizujący zlecenia.</li>
              <li><strong>Zlecenie</strong> - publiczny post opisujący zapotrzebowanie na obraz.</li>
              <li><strong>Oferta</strong> - formalna propozycja realizacji zawierająca cenę, termin i zakres.</li>
              <li><strong>Projekt</strong> - realizacja zlecenia po akceptacji oferty.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-graphite-600">3. Zlecenia</h2>
            <p className="mt-3 text-sm">Zlecający publikuje zlecenie na obraz, dodając opis, zdjęcia inspiracyjne, wymiary, styl, kolorystykę, budżet i termin. Zlecenie działa jak post marketplace.</p>
            <p className="mt-2 text-sm">Publiczny skrót zlecenia (tytuł, krótki opis, styl, wymiary, budżet, termin, miniatury inspiracji) jest widoczny dla wszystkich odwiedzających. Pełny opis i inspiracje są widoczne dla zalogowanych artystów. Dane kontaktowe nie są publiczne.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-graphite-600">4. Oferty i realizacja</h2>
            <p className="mt-3 text-sm">Zalogowani i zatwierdzeni artyści mogą komentować zlecenia, dodawać zdjęcia i wysyłać formalne oferty. Komentarz nie jest formalną ofertą - służy wyłącznie zadawaniu pytań i dzieleniu się sugestiami.</p>
            <p className="mt-2 text-sm">Po akceptacji oferty powstaje dashboard realizacji projektu.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-graphite-600">5. Płatności</h2>
            <p className="mt-3 text-sm">Płatności odbywają się przez Stripe: najpierw zaliczka po wyborze artysty, potem płatność końcowa po ukończeniu dzieła. Platforma pełni rolę technicznego operatora płatności.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-graphite-600">6. Odpowiedzialność</h2>
            <p className="mt-3 text-sm">Platforma pełni rolę marketplace, narzędzia komunikacji i technicznej obsługi płatności. Odpowiedzialność za ustalenia artystyczne, zakres pracy, jakość, termin i dostawę leży po stronie artysty i zlecającego zgodnie z regulaminem.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-graphite-600">7. Prywatność danych</h2>
            <p className="mt-3 text-sm">Publiczne zlecenia nie pokazują prywatnego opisu, danych kontaktowych, pełnych załączników ani ofert. Komentarze i zdjęcia pod zleceniem są tylko dla zalogowanych użytkowników. Szczegóły w <a href="/polityka-prywatnosci" className="text-graphite-600 underline">polityce prywatności</a>.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-graphite-600">8. Zawieszenie i blokada konta</h2>
            <p className="mt-3 text-sm">Platforma zastrzega sobie prawo do zawieszenia lub zablokowania konta w przypadku naruszenia regulaminu, prób ominięcia płatności, przesyłania danych kontaktowych w komentarzach lub innego nadużycia.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-graphite-600">9. Zmiany regulaminu</h2>
            <p className="mt-3 text-sm">Platforma zastrzega sobie prawo do zmiany regulaminu. Użytkownicy zostaną powiadomieni o istotnych zmianach. Kontynuacja korzystania z Platformy po zmianach oznacza akceptację nowej wersji.</p>
          </section>
        </div>
      </div>
    </ContentPage>
  );
}

export function PolitykaPrywatnosciPage() {
  return (
    <ContentPage eyebrow="Dokument prawny" title="Polityka prywatności" description="Jak przetwarzamy Twoje dane osobowe.">
      <div className="space-y-8 text-graphite-500 leading-relaxed">
        <LegalNotice />

        <section>
          <h2 className="font-display text-xl text-graphite-600">1. Administrator danych</h2>
          <p className="mt-3 text-sm">Administratorem danych osobowych jest Atelier. Dane przetwarzane są zgodnie z Rozporządzeniem o Ochronie Danych Osobowych (RODO).</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">2. Zakres przetwarzanych danych</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><strong>Dane konta:</strong> imię i nazwisko / nazwa, adres e-mail, hasło (hashowane).</li>
            <li><strong>Dane artysty:</strong> nazwa artystyczna, bio, style, techniki, lokalizacja, portfolio.</li>
            <li><strong>Dane zlecenia:</strong> opis, inspiracje, wymiary, budżet, termin, lokalizacja.</li>
            <li><strong>Dane płatności:</strong> kwoty, statusy płatności (przetwarzane przez Stripe).</li>
            <li><strong>Dane komunikacji:</strong> wiadomości w projektach, komentarze pod zleceniami.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">3. Widoczność danych</h2>
          <p className="mt-3 text-sm">Publiczne zlecenia nie pokazują prywatnego opisu, danych kontaktowych ani ofert. Dane kontaktowe są widoczne tylko po zaakceptowaniu oferty i utworzeniu projektu.</p>
          <p className="mt-2 text-sm">Profile artystów są publiczne - zawierają nazwę artystyczną, bio, style, portfolio. Adres e-mail artysty nie jest publiczny.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">4. Cel przetwarzania</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Umożliwienie rejestracji i logowania.</li>
            <li>Publikacja i przeglądanie zleceń.</li>
            <li>Komunikacja między zlecającymi a artystami.</li>
            <li>Realizacja płatności przez Stripe.</li>
            <li>Moderacja i bezpieczeństwo platformy.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">5. Podstawy prawne</h2>
          <p className="mt-3 text-sm">Dane przetwarzane są na podstawie: zgody użytkownika (art. 6 ust. 1 lit. a RODO), wykonania umowy (lit. b), obowiązków prawnych (lit. c) oraz prawnie uzasadnionych interesów administratora (lit. f).</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">6. Prawa użytkownika</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Prawo dostępu do swoich danych.</li>
            <li>Prawo sprostowania (poprawiania) danych.</li>
            <li>Prawo usunięcia danych („prawo do bycia zapomnianym”).</li>
            <li>Prawo ograniczenia przetwarzania.</li>
            <li>Prawo przenoszenia danych.</li>
            <li>Prawo wniesienia sprzeciwu.</li>
            <li>Prawo cofnięcia zgody w dowolnym momencie.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">7. Okres przechowywania</h2>
          <p className="mt-3 text-sm">Dane przechowywane są przez okres niezbędny do świadczenia usług oraz przez czas wymagany przez przepisy prawa (np. dla celów podatkowych i księgowych).</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">8. Zgody (consent records)</h2>
          <p className="mt-3 text-sm">Platforma rejestruje wszystkie zgody udzielone przez użytkownika (akceptacja regulaminu, polityki prywatności, zasad, zgody na publikację) w systemie rekordów zgod. Każda zgoda zawiera typ, wersję dokumentu, datę oraz kontekst.</p>
        </section>
      </div>
    </ContentPage>
  );
}

export function ZasadyDlaArtystowPage() {
  return (
    <ContentPage eyebrow="Dla artystów" title="Zasady dla artystów" description="Reguły obowiązujące artystów na platformie.">
      <div className="space-y-8 text-graphite-500 leading-relaxed">
        <LegalNotice />

        <section>
          <h2 className="font-display text-xl text-graphite-600">1. Weryfikacja</h2>
          <p className="mt-3 text-sm">Po rejestracji konto artysty przechodzi weryfikację przez administratora. Po zatwierdzeniu możesz komentować, dodawać zdjęcia i wysyłać oferty.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">2. Profil i portfolio</h2>
          <p className="mt-3 text-sm">Artyści mają profil i portfolio. Nie prowadzą własnych sklepów. Portfolio pokazuje wcześniejsze prace - stanowią one wizytówkę artysty dla zlecających.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">3. Komentarze i komunikacja</h2>
          <p className="mt-3 text-sm">Komentarze pod zleceniem służą do zadawania pytań i dzielenia się sugestiami. Komentarz <strong>nie jest formalną ofertą</strong>. Formalna cena, termin i zakres muszą zostać przekazane przez formularz oferty.</p>
          <p className="mt-2 text-sm">Przekazywanie danych kontaktowych (e-mail, telefon, linki zewnętrzne) w komentarzach jest zabronione. Próba ominięcia komunikacji przez platformę skutkuje moderacją i potencjalnym zawieszeniem konta.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">4. Oferty</h2>
          <p className="mt-3 text-sm">Oferty powinny zawierać wycenę, termin i opis zakresu. Oferty są widoczne tylko dla właściciela zlecenia, danego artysty i admina.</p>
          <p className="mt-2 text-sm">Składając ofertę akceptujesz zasady składania ofert oraz rozumiesz, że docelowo aplikowanie na zlecenia może być płatne (wymagać pakietu lub subskrypcji). Na start aplikowanie jest darmowe.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">5. Realizacja</h2>
          <p className="mt-3 text-sm">Po akceptacji oferty artyści aktualizują etapy, dodają zdjęcia postępu i komunikują się przez dashboard projektu. Odpowiedzialność za wykonanie obrazu, jakość, termin i dostawę leży po stronie artysty i zlecającego.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">6. Płatności</h2>
          <p className="mt-3 text-sm">Zaliczka jest pobierana przez platformę po akceptacji oferty. Płatność końcowa po ukończeniu dzieła. Platforma pełni rolę technicznego operatora płatności przez Stripe.</p>
        </section>
      </div>
    </ContentPage>
  );
}

export function ZasadyDlaZlecajacychPage() {
  return (
    <ContentPage eyebrow="Dla zlecających" title="Zasady dla zlecających" description="Reguły obowiązujące zlecających na platformie.">
      <div className="space-y-8 text-graphite-500 leading-relaxed">
        <LegalNotice />

        <section>
          <h2 className="font-display text-xl text-graphite-600">1. Zlecenia</h2>
          <p className="mt-3 text-sm">Zlecający publikuje zlecenia z opisem, inspiracjami, wymiarami, stylem, kolorystyką, budżetem i terminem. Zlecenie działa jak post marketplace.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">2. Publiczny podgląd i prywatność</h2>
          <p className="mt-3 text-sm">Gość publiczny widzi tylko ograniczony podgląd zlecenia (tytuł, krótki opis, styl, wymiary, budżet, termin, miniatury inspiracji). Pełne szczegóły są dostępne dla zalogowanych artystów.</p>
          <p className="mt-2 text-sm">Dane kontaktowe zlecającego nie są publiczne i nie są widoczne w komentarzach ani w publicznym podglądzie zlecenia.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">3. Prawa do zdjęć inspiracyjnych</h2>
          <p className="mt-3 text-sm">Zlecający potwierdza, że ma prawo użyć przesłanych zdjęć jako inspiracji (są jego autorstwa lub pochodzą ze źródeł pozwalających na takie użycie). Platforma nie ponosi odpowiedzialności za naruszenie praw autorskich przez zlecającego.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">4. Oferty i wybór artysty</h2>
          <p className="mt-3 text-sm">Artyści składają formalne oferty zawierające cenę, termin i zakres. Zlecający wybiera ofertę i akceptuje ją. Po akceptacji powstaje projekt z dashboardem realizacji.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">5. Płatności</h2>
          <p className="mt-3 text-sm">Po akceptacji oferty zlecający płaci zaliczkę przez platformę (Stripe). Płatność końcowa po ukończeniu obrazu i akceptacji podglądu pracy.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-graphite-600">6. Odpowiedzialność</h2>
          <p className="mt-3 text-sm">Platforma pełni rolę marketplace, narzędzia komunikacji i technicznej obsługi płatności. Odpowiedzialność za ustalenia artystyczne, zakres pracy, jakość, termin i dostawę leży po stronie artysty i zlecającego zgodnie z regulaminem.</p>
        </section>
      </div>
    </ContentPage>
  );
}
