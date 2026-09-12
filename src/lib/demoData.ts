/**
 * Demo marketplace data - 10 diverse artist profiles + 10 realistic commission requests.
 * Fictitious, Polish, hand-painted-art oriented. No real personal data.
 * Images are license-free Pexels photos used as portfolio/inspiration placeholders.
 */
import type {
  ArtistPortfolioItem, ArtistProfile, ClientProfile, CommissionComment,
  CommissionOffer, CommissionRequest, Profile, User,
} from '@/types';

/* ----------------------------- Demo users ----------------------------- */

export const demoUsers: User[] = [
  // Demo clients (fictional)
  { id: 'demo-c-1', email: 'demo.klient1@atelier-demo.pl', role: 'client', status: 'approved', displayName: 'Julia Wiśniewska', location: 'Warszawa', bio: 'Urzędzam nowy apartament - szukam obrazów do salonu i sypialni.', createdAt: '2025-05-10T09:00:00Z' },
  { id: 'demo-c-2', email: 'demo.klient2@atelier-demo.pl', role: 'client', status: 'approved', displayName: 'Tomasz Lewicki - Loft Development', location: 'Wrocław', bio: 'Deweloper loftów i apartamentów premium.', createdAt: '2025-04-15T09:00:00Z' },
  { id: 'demo-c-3', email: 'demo.klient3@atelier-demo.pl', role: 'client', status: 'approved', displayName: 'Hotel Sosnowy - Recepcja', location: 'Zakopane', bio: 'Butikowy hotel górski. Kompleksowa aranżacja sztuki.', createdAt: '2025-03-20T09:00:00Z' },
  { id: 'demo-c-4', email: 'demo.klient4@atelier-demo.pl', role: 'client', status: 'approved', displayName: 'Klara Zielińska', location: 'Poznań', bio: 'Wnętrza prywatne - sypialnia, gabinet.', createdAt: '2025-06-01T09:00:00Z' },
  { id: 'demo-c-5', email: 'demo.klient5@atelier-demo.pl', role: 'client', status: 'approved', displayName: 'Kancelaria Ostrołęcka i Wspólnicy', location: 'Warszawa', bio: 'Kancelaria prawna - aranżacja recepcji i sal konferencyjnych.', createdAt: '2025-05-25T09:00:00Z' },
  { id: 'demo-c-6', email: 'demo.klient6@atelier-demo.pl', role: 'client', status: 'approved', displayName: 'Michał Orzechowski', location: 'Gdańsk', bio: 'Prezent ślubny dla przyjaciół.', createdAt: '2025-07-01T09:00:00Z' },
  { id: 'demo-c-7', email: 'demo.klient7@atelier-demo.pl', role: 'client', status: 'approved', displayName: 'Pracownia WN - Anna Radziejewska', location: 'Kraków', bio: 'Architekt wnętrz. Realizacje dla klientów indywidualnych i komercyjnych.', createdAt: '2025-02-10T09:00:00Z' },
  { id: 'demo-c-8', email: 'demo.klient8@atelier-demo.pl', role: 'client', status: 'approved', displayName: 'Restauracja Brunatna', location: 'Łódź', bio: 'Restauracja autorska. Szukamy obrazu do sali głównej.', createdAt: '2025-06-15T09:00:00Z' },
  { id: 'demo-c-9', email: 'demo.klient9@atelier-demo.pl', role: 'client', status: 'approved', displayName: 'Gabinet Terapii Cisza', location: 'Sopot', bio: 'Gabinet psychoterapii - spokojne, medytacyjne wnętrze.', createdAt: '2025-05-05T09:00:00Z' },
  { id: 'demo-c-10', email: 'demo.klient10@atelier-demo.pl', role: 'client', status: 'approved', displayName: 'Filip Dąbrowski', location: 'Warszawa', bio: 'Loft industrialny - szukam wyrazistego obrazu do głównej ściany.', createdAt: '2025-07-10T09:00:00Z' },

  // Demo artists (fictional) - ids a-demo-1..10
  { id: 'a-demo-1', email: 'demo.art1@atelier-demo.pl', role: 'artist', status: 'approved', displayName: 'Lena Wojcik', avatarUrl: '/avatar-lena-wojcik.webp', bio: 'Abstrakcja strukturalna premium. Akryl, szpachla, pasta strukturalna, złocenia.', location: 'Warszawa', specializations: ['Abstrakcja strukturalna', 'Złocenia', 'Wnętrza premium'], yearsExperience: 11, isVerifiedArtist: true, createdAt: '2025-01-15T09:00:00Z' },
  { id: 'a-demo-2', email: 'demo.art2@atelier-demo.pl', role: 'artist', status: 'approved', displayName: 'Nikodem Halicki', avatarUrl: 'https://images.pexels.com/photos/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Duże obrazy minimalistyczne. Akryl, pigment, płótno lniane.', location: 'Kraków', specializations: ['Minimalizm', 'Monochrom', 'Duży format'], yearsExperience: 9, isVerifiedArtist: true, createdAt: '2025-01-20T09:00:00Z' },
  { id: 'a-demo-3', email: 'demo.art3@atelier-demo.pl', role: 'artist', status: 'approved', displayName: 'Irena Falska', avatarUrl: 'https://images.pexels.com/photos/8036832/pexels-photo-8036832.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Pejzaż i natura. Olej, laserunki, światło i mgła.', location: 'Bieszczady', specializations: ['Pejzaż', 'Las', 'Mgła', 'Olej'], yearsExperience: 14, isVerifiedArtist: true, createdAt: '2025-02-01T09:00:00Z' },
  { id: 'a-demo-4', email: 'demo.art4@atelier-demo.pl', role: 'artist', status: 'approved', displayName: 'Oskar Reński', avatarUrl: 'https://images.pexels.com/photos/18888491/pexels-photo-18888491.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Ekspresyjna abstrakcja kolorystyczna. Akryl, media mieszane.', location: 'Gdynia', specializations: ['Abstrakcja ekspresyjna', 'Kolor', 'Kontrast'], yearsExperience: 7, isVerifiedArtist: true, createdAt: '2025-02-10T09:00:00Z' },
  { id: 'a-demo-5', email: 'demo.art5@atelier-demo.pl', role: 'artist', status: 'approved', displayName: 'Honorata Czech', avatarUrl: 'https://images.pexels.com/photos/6816588/pexels-photo-6816588.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Portrety i obrazy personalizowane. Olej, akryl, emocjonalne malarstwo.', location: 'Lublin', specializations: ['Portret', 'Figuracja', 'Personalizacja'], yearsExperience: 10, isVerifiedArtist: true, createdAt: '2025-02-18T09:00:00Z' },
  { id: 'a-demo-6', email: 'demo.art6@atelier-demo.pl', role: 'artist', status: 'approved', displayName: 'Witold Kruszyński', avatarUrl: 'https://images.pexels.com/photos/16762319/pexels-photo-16762319.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Obrazy do hoteli i inwestycji. Serie, spójne kolekcje, wielkoformatowe płótna.', location: 'Poznań', specializations: ['Kolekcje hotelowe', 'Serie', 'Wielki format'], yearsExperience: 16, isVerifiedArtist: true, createdAt: '2025-01-05T09:00:00Z' },
  { id: 'a-demo-7', email: 'demo.art7@atelier-demo.pl', role: 'artist', status: 'approved', displayName: 'Maja Sokołowska', avatarUrl: '/avatar-maja-sokolowska.webp', bio: 'Subtelne obrazy do wnętrz kobiecych. Pastel, beże, róże, miękkie formy.', location: 'Wrocław', specializations: ['Pastel', 'Delikatność', 'Wnętrza kobiece'], yearsExperience: 8, isVerifiedArtist: true, createdAt: '2025-03-01T09:00:00Z' },
  { id: 'a-demo-8', email: 'demo.art8@atelier-demo.pl', role: 'artist', status: 'approved', displayName: 'Gustaw Linke', avatarUrl: 'https://images.pexels.com/photos/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Geometria i architektura. Akryl, taśma, pigment, precyzyjne krawędzie.', location: 'Warszawa', specializations: ['Geometria', 'Architektura', 'Wnętrza modernistyczne'], yearsExperience: 12, isVerifiedArtist: true, createdAt: '2025-01-28T09:00:00Z' },
  { id: 'a-demo-9', email: 'demo.art9@atelier-demo.pl', role: 'artist', status: 'approved', displayName: 'Yuki Nakamura', avatarUrl: '/avatar-maja-sokolowska.webp', bio: 'Wabi-sabi, organiczne faktury, neutralne kolory. Pigment, struktura, piasek.', location: 'Kraków', specializations: ['Wabi-sabi', 'Faktury organiczne', 'Minimalizm japoński'], yearsExperience: 13, isVerifiedArtist: true, createdAt: '2025-02-22T09:00:00Z' },
  { id: 'a-demo-10', email: 'demo.art10@atelier-demo.pl', role: 'artist', status: 'approved', displayName: 'Brunon Dracz', avatarUrl: 'https://images.pexels.com/photos/18888491/pexels-photo-18888491.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Surrealizm i obrazy narracyjne. Olej, detal, warstwowe malarstwo.', location: 'Sopot', specializations: ['Surrealizm', 'Symbolika', 'Storytelling'], yearsExperience: 15, isVerifiedArtist: true, createdAt: '2025-01-10T09:00:00Z' },
];

export const demoProfiles: Profile[] = demoUsers.map((u) => ({
  id: `pf-${u.id}`, userId: u.id, role: u.role, displayName: u.displayName,
  avatarUrl: u.avatarUrl, bio: u.bio, location: u.location,
  createdAt: u.createdAt, updatedAt: u.createdAt,
}));

export const demoClientProfiles: ClientProfile[] = demoUsers
  .filter((u) => u.role === 'client')
  .map((u) => ({
    id: `dcp-${u.id}`, userId: u.id, displayName: u.displayName,
    avatarUrl: u.avatarUrl, bio: u.bio, location: u.location,
    clientType: 'Klient demo', createdAt: u.createdAt,
  }));

/* --------------------------- Portfolio items --------------------------- */

const P = 'https://images.pexels.com/photos';

const portfolioLena: ArtistPortfolioItem[] = [
  { id: 'dp-lena-1', artistId: 'a-demo-1', title: 'Złota cisza', imageUrl: `${P}/1000366/pexels-photo-1000366.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, pasta strukturalna, złocenia', year: '2025', widthCm: 150, heightCm: 100, isPublic: true, isForSale: false, description: 'Strukturalna abstrakcja w beżach i złoceniach.', style: 'Abstrakcja strukturalna' },
  { id: 'dp-lena-2', artistId: 'a-demo-1', title: 'Ivory Dreams III', imageUrl: `${P}/7233320/pexels-photo-7233320.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, szpachla, złoto płatkowe', year: '2024', widthCm: 120, heightCm: 80, isPublic: true, isForSale: false, description: 'Delikatna faktura w odcieniach ivory.', style: 'Abstrakcja strukturalna' },
  { id: 'dp-lena-3', artistId: 'a-demo-1', title: 'Beżowy nokturn', imageUrl: `${P}/37509007/pexels-photo-37509007.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, pasta strukturalna', year: '2024', widthCm: 100, heightCm: 70, isPublic: true, isForSale: false, description: 'Ciepła kompozycja w tonach beżu i brązu.', style: 'Abstrakcja strukturalna' },
  { id: 'dp-lena-4', artistId: 'a-demo-1', title: 'Złoty podział', imageUrl: `${P}/34661337/pexels-photo-34661337.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, złocenia, media mieszane', year: '2025', widthCm: 180, heightCm: 120, isPublic: true, isForSale: false, description: 'Duży format z subtelnymi złoceniami.', style: 'Abstrakcja strukturalna' },
];

const portfolioNikodem: ArtistPortfolioItem[] = [
  { id: 'dp-niko-1', artistId: 'a-demo-2', title: 'Organic I', imageUrl: `${P}/25857040/pexels-photo-25857040.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, pigment, płótno lniane', year: '2025', widthCm: 200, heightCm: 140, isPublic: true, isForSale: false, description: 'Monochromatyczny duży format.', style: 'Minimalizm' },
  { id: 'dp-niko-2', artistId: 'a-demo-2', title: 'Cisza II', imageUrl: `${P}/10532813/pexels-photo-10532813.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl na lnianym płótnie', year: '2024', widthCm: 160, heightCm: 120, isPublic: true, isForSale: false, description: 'Minimalistyczna kompozycja w bieli.', style: 'Minimalizm' },
  { id: 'dp-niko-3', artistId: 'a-demo-2', title: 'Grafit', imageUrl: `${P}/26066234/pexels-photo-26066234.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, pigment', year: '2024', widthCm: 140, heightCm: 100, isPublic: true, isForSale: false, description: 'Szaro-białe organiczne formy.', style: 'Minimalizm' },
  { id: 'dp-niko-4', artistId: 'a-demo-2', title: 'Czerń i biel', imageUrl: `${P}/3213977/pexels-photo-3213977.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl na płótnie', year: '2025', widthCm: 180, heightCm: 120, isPublic: true, isForSale: false, description: 'Kontrastowa kompozycja monochromatyczna.', style: 'Minimalizm' },
];

const portfolioIrena: ArtistPortfolioItem[] = [
  { id: 'dp-irena-1', artistId: 'a-demo-3', title: 'Las o świcie', imageUrl: `${P}/34169562/pexels-photo-34169562.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Olej, laserunki', year: '2025', widthCm: 120, heightCm: 80, isPublic: true, isForSale: false, description: 'Mglisty pejzaż leśny o porannym świetle.', style: 'Pejzaż' },
  { id: 'dp-irena-2', artistId: 'a-demo-3', title: 'Bieszczady - mgła', imageUrl: `${P}/5077838/pexels-photo-5077838.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Olej na płótnie', year: '2024', widthCm: 100, heightCm: 70, isPublic: true, isForSale: false, description: 'Górski pejzaż we mgle.', style: 'Pejzaż' },
  { id: 'dp-irena-3', artistId: 'a-demo-3', title: 'Poranne światło', imageUrl: `${P}/31612225/pexels-photo-31612225.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Olej, laserunki', year: '2024', widthCm: 90, heightCm: 60, isPublic: true, isForSale: false, description: 'Lśniące światło w lesie sosnowym.', style: 'Pejzaż' },
  { id: 'dp-irena-4', artistId: 'a-demo-3', title: 'Dolina', imageUrl: `${P}/31737036/pexels-photo-31737036.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Olej na płótnie', year: '2025', widthCm: 110, heightCm: 75, isPublic: true, isForSale: false, description: 'Spokojna dolina we porannej mgle.', style: 'Pejzaż' },
];

const portfolioOskar: ArtistPortfolioItem[] = [
  { id: 'dp-oskar-1', artistId: 'a-demo-4', title: 'Eksplozja', imageUrl: `${P}/30580211/pexels-photo-30580211.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, media mieszane', year: '2025', widthCm: 160, heightCm: 120, isPublic: true, isForSale: false, description: 'Dynamiczna abstrakcja kolorystyczna.', style: 'Abstrakcja ekspresyjna' },
  { id: 'dp-oskar-2', artistId: 'a-demo-4', title: 'Furia koloru', imageUrl: `${P}/35471717/pexels-photo-35471717.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, media mieszane', year: '2024', widthCm: 140, heightCm: 100, isPublic: true, isForSale: false, description: 'Wyraziste pędzle i kontrasty.', style: 'Abstrakcja ekspresyjna' },
  { id: 'dp-oskar-3', artistId: 'a-demo-4', title: 'Błękit i ogień', imageUrl: `${P}/14999204/pexels-photo-14999204.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl na płótnie', year: '2024', widthCm: 120, heightCm: 90, isPublic: true, isForSale: false, description: 'Niebiesko-czerwona kompozycja ekspresyjna.', style: 'Abstrakcja ekspresyjna' },
  { id: 'dp-oskar-4', artistId: 'a-demo-4', title: 'Rytm', imageUrl: `${P}/13344955/pexels-photo-13344955.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, media mieszane', year: '2025', widthCm: 150, heightCm: 110, isPublic: true, isForSale: false, description: 'Barwne pędzle w dynamicznym rytmie.', style: 'Abstrakcja ekspresyjna' },
];

const portfolioHonorata: ArtistPortfolioItem[] = [
  { id: 'dp-hono-1', artistId: 'a-demo-5', title: 'Portret w świetle', imageUrl: `${P}/14748101/pexels-photo-14748101.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Olej na płótnie', year: '2025', widthCm: 60, heightCm: 80, isPublic: true, isForSale: false, description: 'Emocjonalny portret w miękkim świetle.', style: 'Portret' },
  { id: 'dp-hono-2', artistId: 'a-demo-5', title: 'Studium ciszy', imageUrl: `${P}/14748091/pexels-photo-14748091.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Olej na desce', year: '2024', widthCm: 50, heightCm: 70, isPublic: true, isForSale: false, description: 'Klasyczne studium portretowe.', style: 'Portret' },
  { id: 'dp-hono-3', artistId: 'a-demo-5', title: 'Twarze', imageUrl: `${P}/17747085/pexels-photo-17747085.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Olej, akryl', year: '2024', widthCm: 80, heightCm: 100, isPublic: true, isForSale: false, description: 'Figuratywne studium postaci.', style: 'Portret' },
  { id: 'dp-hono-4', artistId: 'a-demo-5', title: 'Wspomnienie', imageUrl: `${P}/3389707/pexels-photo-3389707.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Olej na płótnie', year: '2025', widthCm: 90, heightCm: 120, isPublic: true, isForSale: false, description: 'Duży portret - praca nad detalami twarzy.', style: 'Portret' },
];

const portfolioWitoldH: ArtistPortfolioItem[] = [
  { id: 'dp-witoH-1', artistId: 'a-demo-6', title: 'Kolekcja Sosnowa I', imageUrl: `${P}/6876624/pexels-photo-6876624.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, mixed media', year: '2025', widthCm: 100, heightCm: 140, isPublic: true, isForSale: false, description: 'Elegancka abstrakcja do hotelowego lobby.', style: 'Elegancka abstrakcja' },
  { id: 'dp-witoH-2', artistId: 'a-demo-6', title: 'Kolekcja Sosnowa II', imageUrl: `${P}/28999490/pexels-photo-28999490.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, mixed media', year: '2025', widthCm: 100, heightCm: 140, isPublic: true, isForSale: false, description: 'Spójna praca z serii hotelowej.', style: 'Elegancka abstrakcja' },
  { id: 'dp-witoH-3', artistId: 'a-demo-6', title: 'Piasek i złoto', imageUrl: `${P}/14036246/pexels-photo-14036246.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, wielkoformatowe płótno', year: '2024', widthCm: 160, heightCm: 220, isPublic: true, isForSale: false, description: 'Wielki format do lobby hotelowego.', style: 'Elegancka abstrakcja' },
  { id: 'dp-witoH-4', artistId: 'a-demo-6', title: 'Ciepły szary', imageUrl: `${P}/14036249/pexels-photo-14036249.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, mixed media', year: '2024', widthCm: 120, heightCm: 160, isPublic: true, isForSale: false, description: 'Stonowana abstrakcja w szarościach i złocie.', style: 'Elegancka abstrakcja' },
];

const portfolioMaja: ArtistPortfolioItem[] = [
  { id: 'dp-maja-1', artistId: 'a-demo-7', title: 'Różany sen', imageUrl: `${P}/6725076/pexels-photo-6725076.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, akwarela, technika mieszana', year: '2025', widthCm: 80, heightCm: 100, isPublic: true, isForSale: false, description: 'Pastelowa kompozycja w różach i beżach.', style: 'Pastel' },
  { id: 'dp-maja-2', artistId: 'a-demo-7', title: 'Miękkość', imageUrl: `${P}/7431875/pexels-photo-7431875.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akwarela, akryl', year: '2024', widthCm: 60, heightCm: 80, isPublic: true, isForSale: false, description: 'Delikatne organiczne formy w pastelach.', style: 'Pastel' },
  { id: 'dp-maja-3', artistId: 'a-demo-7', title: 'Pudrowy świt', imageUrl: `${P}/9175996/pexels-photo-9175996.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, akwarela', year: '2024', widthCm: 70, heightCm: 90, isPublic: true, isForSale: false, description: 'Abstrakcja w pudrowym różu i brzoskwini.', style: 'Pastel' },
  { id: 'dp-maja-4', artistId: 'a-demo-7', title: 'Płatkowy wiatr', imageUrl: `${P}/6925162/pexels-photo-6925162.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akwarela, technika mieszana', year: '2025', widthCm: 50, heightCm: 70, isPublic: true, isForSale: false, description: 'Botaniczne formy w pastelowej palecie.', style: 'Pastel' },
];

const portfolioGustaw: ArtistPortfolioItem[] = [
  { id: 'dp-gust-1', artistId: 'a-demo-8', title: 'Równoległe', imageUrl: `${P}/15409966/pexels-photo-15409966.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, taśma, pigment', year: '2025', widthCm: 140, heightCm: 100, isPublic: true, isForSale: false, description: 'Geometryczna abstrakcja z precyzyjnymi krawędziami.', style: 'Geometria' },
  { id: 'dp-gust-2', artistId: 'a-demo-8', title: 'Architektura I', imageUrl: `${P}/12536340/pexels-photo-12536340.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl na płótnie', year: '2024', widthCm: 120, heightCm: 160, isPublic: true, isForSale: false, description: 'Rytm linii i brył w paecie graficznej.', style: 'Geometria' },
  { id: 'dp-gust-3', artistId: 'a-demo-8', title: 'Minimal III', imageUrl: `${P}/3137083/pexels-photo-3137083.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, pigment', year: '2024', widthCm: 100, heightCm: 140, isPublic: true, isForSale: false, description: 'Trójkątna kompozycja architektoniczna.', style: 'Geometria' },
  { id: 'dp-gust-4', artistId: 'a-demo-8', title: 'Kontrast', imageUrl: `${P}/20493161/pexels-photo-20493161.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Akryl, taśma', year: '2025', widthCm: 130, heightCm: 90, isPublic: true, isForSale: false, description: 'Geometryczne wzory w niebieskim i szarym.', style: 'Geometria' },
];

const portfolioYuki: ArtistPortfolioItem[] = [
  { id: 'dp-yuki-1', artistId: 'a-demo-9', title: 'Wabi I', imageUrl: `${P}/6569284/pexels-photo-6569284.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Pigment, struktura, akryl', year: '2025', widthCm: 90, heightCm: 120, isPublic: true, isForSale: false, description: 'Organiczna faktura w neutralnych tonach.', style: 'Wabi-sabi' },
  { id: 'dp-yuki-2', artistId: 'a-demo-9', title: 'SabI II', imageUrl: `${P}/6469140/pexels-photo-6469140.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Pigment, piasek, akryl', year: '2024', widthCm: 80, heightCm: 100, isPublic: true, isForSale: false, description: 'Minimalistyczna kompozycja z naturalnym materiałem.', style: 'Wabi-sabi' },
  { id: 'dp-yuki-3', artistId: 'a-demo-9', title: 'Kora', imageUrl: `${P}/5040744/pexels-photo-5040744.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Struktura, pigment', year: '2024', widthCm: 70, heightCm: 90, isPublic: true, isForSale: false, description: 'Inspiracja korą i organicznymi fakturami.', style: 'Wabi-sabi' },
  { id: 'dp-yuki-4', artistId: 'a-demo-9', title: 'Pampasowa cisza', imageUrl: `${P}/27359227/pexels-photo-27359227.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Pigment, akryl, piasek', year: '2025', widthCm: 60, heightCm: 80, isPublic: true, isForSale: false, description: 'Spokojna kompozycja w duchu japońskiego minimalizmu.', style: 'Wabi-sabi' },
];

const portfolioBrunon: ArtistPortfolioItem[] = [
  { id: 'dp-brun-1', artistId: 'a-demo-10', title: 'Opowieść I', imageUrl: `${P}/2778746/pexels-photo-2778746.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Olej, detal, warstwowe malarstwo', year: '2025', widthCm: 100, heightCm: 130, isPublic: true, isForSale: false, description: 'Surrealistyczna scena z symboliką.', style: 'Surrealizm' },
  { id: 'dp-brun-2', artistId: 'a-demo-10', title: 'Płynące znaki', imageUrl: `${P}/34253448/pexels-photo-34253448.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Olej na płótnie', year: '2024', widthCm: 80, heightCm: 110, isPublic: true, isForSale: false, description: 'Narracyjna kompozycja z floating elements.', style: 'Surrealizm' },
  { id: 'dp-brun-3', artistId: 'a-demo-10', title: 'Podwójne dno', imageUrl: `${P}/7127838/pexels-photo-7127838.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Olej, warstwy', year: '2024', widthCm: 70, heightCm: 90, isPublic: true, isForSale: false, description: 'Portret z efektem double exposure.', style: 'Surrealizm' },
  { id: 'dp-brun-4', artistId: 'a-demo-10', title: 'Kurtyna', imageUrl: `${P}/38587489/pexels-photo-38587489.jpeg?auto=compress&cs=tinysrgb&w=800`, technique: 'Olej na płótnie', year: '2025', widthCm: 90, heightCm: 120, isPublic: true, isForSale: false, description: 'Oniryczna scena z kurtyną i postacią.', style: 'Surrealizm' },
];

export const demoPortfolioItems: ArtistPortfolioItem[] = [
  ...portfolioLena, ...portfolioNikodem, ...portfolioIrena, ...portfolioOskar,
  ...portfolioHonorata, ...portfolioWitoldH, ...portfolioMaja, ...portfolioGustaw,
  ...portfolioYuki, ...portfolioBrunon,
];

/* --------------------------- Artist profiles --------------------------- */

export const demoArtistProfiles: ArtistProfile[] = [
  { id: 'dap-1', userId: 'a-demo-1', slug: 'lena-wojcik', artistName: 'Lena Wojcik', avatarUrl: '/avatar-lena-wojcik.webp', coverUrl: `${P}/1000366/pexels-photo-1000366.jpeg?auto=compress&cs=tinysrgb&w=1600`, bio: 'Tworzę abstrakcje strukturalne premium dla wnętrz salonów, apartamentów i pracowni architektonicznych. Pracuję z akrylem, szpachelką, pastą strukturalną i złoceniami od ponad dekady. Każdy obraz jest unikatową kompozycją warstw i faktur, które reagują na światło. Współpracuję z architektami i projektantami wnętrz przy realizacjach premium.', location: 'Warszawa', styles: ['Abstrakcja strukturalna', 'Tekstura', 'Złoto'], techniques: ['Akryl', 'Szpachla', 'Pasta strukturalna', 'Złocenia'], specializations: ['Salony', 'Apartamenty', 'Architekci'], priceRangeMin: 3500, priceRangeMax: 12000, averageDeliveryDays: 56, approvalStatus: 'approved', isVerified: true, yearsExperience: 11, website: 'lenawojcik.art', instagram: '@lena.wojcik.art', portfolio: portfolioLena, stats: { completedProjects: 43, averageRating: 4.9, reviewCount: 31 }, createdAt: '2025-01-15T09:00:00Z' },
  { id: 'dap-2', userId: 'a-demo-2', slug: 'nikodem-halicki', artistName: 'Nikodem Halicki', avatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=400`, coverUrl: `${P}/25857040/pexels-photo-25857040.jpeg?auto=compress&cs=tinysrgb&w=1600`, bio: 'Duże obrazy minimalistyczne dla nowoczesnych wnętrz, biur i galerii. Pracuję z akrylem, pigmentem i płótnem lnianym. Moje prace to organiczne formy w monochromatycznej palecie - spokój, przestrzeń, oddech. Formaty od 120 cm do 220 cm. Każdy obraz to studium proporcji i światła.', location: 'Kraków', styles: ['Minimalizm', 'Monochrom', 'Organiczne formy'], techniques: ['Akryl', 'Pigment', 'Płótno lniane'], specializations: ['Nowoczesne wnętrza', 'Biura', 'Galerie'], priceRangeMin: 4000, priceRangeMax: 14000, averageDeliveryDays: 63, approvalStatus: 'approved', isVerified: true, yearsExperience: 9, website: 'halicki.studio', portfolio: portfolioNikodem, stats: { completedProjects: 28, averageRating: 4.8, reviewCount: 19 }, createdAt: '2025-01-20T09:00:00Z' },
  { id: 'dap-3', userId: 'a-demo-3', slug: 'irena-falska', artistName: 'Irena Falska', avatarUrl: `${P}/8036832/pexels-photo-8036832.jpeg?auto=compress&cs=tinysrgb&w=400`, coverUrl: `${P}/34169562/pexels-photo-34169562.jpeg?auto=compress&cs=tinysrgb&w=1600`, bio: 'Pejzażystka. Maluję las, morze, światło i mgłę. Pracuję w technice olejnej z laserunkami, które dają głębię i luminancję. Maluję w plenerze w Bieszczadach i nad Bałtykiem. Moje obrazy trafiają do domów, sypialni i wnętrz, w których liczy się spokój i kontemplacja.', location: 'Bieszczady', styles: ['Pejzaż', 'Las', 'Morze', 'Światło'], techniques: ['Olej', 'Laserunki'], specializations: ['Domy', 'Sypialnie', 'Wnętrza spokojne'], priceRangeMin: 2500, priceRangeMax: 9000, averageDeliveryDays: 70, approvalStatus: 'approved', isVerified: true, yearsExperience: 14, website: 'irenafalska.art', instagram: '@irena.falska', portfolio: portfolioIrena, stats: { completedProjects: 51, averageRating: 5.0, reviewCount: 37 }, createdAt: '2025-02-01T09:00:00Z' },
  { id: 'dap-4', userId: 'a-demo-4', slug: 'oskar-renski', artistName: 'Oskar Reński', avatarUrl: `${P}/18888491/pexels-photo-18888491.jpeg?auto=compress&cs=tinysrgb&w=400`, coverUrl: `${P}/30580211/pexels-photo-30580211.jpeg?auto=compress&cs=tinysrgb&w=1600`, bio: 'Ekspresyjna abstrakcja kolorystyczna. Pracuję z akrylem i mediami mieszanymi - duże formaty, dynamiczne pędzle, kontrasty. Moje obrazy trafiają do biur kreatywnych, restauracji i apartamentów, które potrzebują energii i charakteru. Każda praca jest eksplozją emocji zapisaną na płótnie.', location: 'Gdynia', styles: ['Abstrakcja ekspresyjna', 'Kolor', 'Kontrast'], techniques: ['Akryl', 'Media mieszane'], specializations: ['Biura kreatywne', 'Restauracje', 'Apartamenty'], priceRangeMin: 3000, priceRangeMax: 11000, averageDeliveryDays: 49, approvalStatus: 'approved', isVerified: true, yearsExperience: 7, instagram: '@oskar.renski', portfolio: portfolioOskar, stats: { completedProjects: 22, averageRating: 4.7, reviewCount: 16 }, createdAt: '2025-02-10T09:00:00Z' },
  { id: 'dap-5', userId: 'a-demo-5', slug: 'honorata-czech', artistName: 'Honorata Czech', avatarUrl: `${P}/6816588/pexels-photo-6816588.jpeg?auto=compress&cs=tinysrgb&w=400`, coverUrl: `${P}/14748101/pexels-photo-14748101.jpeg?auto=compress&cs=tinysrgb&w=1600`, bio: 'Portrety i obrazy personalizowane. Maluję olejem i akrylem - od klasycznych studiów po współczesne interpretacje emocjonalne. Specjalizuję się w portretach na zamówienie: rodzina, wspomnienia, prezenty. Każdy portret zaczyna się od rozmowy i sesji referencyjnej.', location: 'Lublin', styles: ['Portret', 'Figuracja', 'Emocjonalne malarstwo'], techniques: ['Olej', 'Akryl'], specializations: ['Prezenty', 'Rodzinne zamówienia', 'Wnętrza prywatne'], priceRangeMin: 2000, priceRangeMax: 8500, averageDeliveryDays: 84, approvalStatus: 'approved', isVerified: true, yearsExperience: 10, website: 'honorataczech.art', portfolio: portfolioHonorata, stats: { completedProjects: 34, averageRating: 5.0, reviewCount: 28 }, createdAt: '2025-02-18T09:00:00Z' },
  { id: 'dap-6', userId: 'a-demo-6', slug: 'witold-kruszynski', artistName: 'Witold Kruszyński', avatarUrl: `${P}/16762319/pexels-photo-16762319.jpeg?auto=compress&cs=tinysrgb&w=400`, coverUrl: `${P}/6876624/pexels-photo-6876624.jpeg?auto=compress&cs=tinysrgb&w=1600`, bio: 'Obrazy do hoteli i inwestycji. Tworzę spójne kolekcje i serie w wielkim formacie. Moje prace trafiają do lobby hotelowych, apartamentów deweloperskich i przestrzeni komercyjnych. Pracuję z akrylem i mediami mieszanymi na płótnach do 220 cm. Realizuję kompletne aranżacje - od koncepcji przez próbki po montaż.', location: 'Poznań', styles: ['Elegancka abstrakcja', 'Serie', 'Kolekcje'], techniques: ['Akryl', 'Mixed media', 'Wielkoformatowe płótna'], specializations: ['Hotele', 'Deweloperzy', 'Architekci'], priceRangeMin: 5000, priceRangeMax: 25000, averageDeliveryDays: 98, approvalStatus: 'approved', isVerified: true, yearsExperience: 16, website: 'kruszynski.studio', portfolio: portfolioWitoldH, stats: { completedProjects: 19, averageRating: 4.9, reviewCount: 14 }, createdAt: '2025-01-05T09:00:00Z' },
  { id: 'dap-7', userId: 'a-demo-7', slug: 'maja-sokolowska', artistName: 'Maja Sokołowska', avatarUrl: '/avatar-maja-sokolowska.webp', coverUrl: `${P}/6725076/pexels-photo-6725076.jpeg?auto=compress&cs=tinysrgb&w=1600`, bio: 'Subtelne obrazy do wnętrz kobiecych. Pastel, beże, róże, miękkie formy. Pracuję z akrylem, akwarelą i techniką mieszaną. Moje obrazy trafiają do sypialni, gabinetów i wnętrz premium, w których liczy się delikatność i ciepło. Inspiruję się światem roślin i miękkimi przejściami światła.', location: 'Wrocław', styles: ['Pastel', 'Delikatność', 'Miękkie formy'], techniques: ['Akryl', 'Akwarela', 'Technika mieszana'], specializations: ['Sypialnie', 'Gabinety', 'Wnętrza premium'], priceRangeMin: 1800, priceRangeMax: 6500, averageDeliveryDays: 42, approvalStatus: 'approved', isVerified: true, yearsExperience: 8, instagram: '@maja.sokolowska.art', portfolio: portfolioMaja, stats: { completedProjects: 26, averageRating: 4.9, reviewCount: 21 }, createdAt: '2025-03-01T09:00:00Z' },
  { id: 'dap-8', userId: 'a-demo-8', slug: 'gustaw-linke', artistName: 'Gustaw Linke', avatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=400`, coverUrl: `${P}/15409966/pexels-photo-15409966.jpeg?auto=compress&cs=tinysrgb&w=1600`, bio: 'Geometria i architektura. Pracuję z akrylem, taśmą malarską i pigmentem - precyzyjne krawędzie, rytm linii i brył. Moje obrazy trafiają do biur, kancelarii i wnętrz modernistycznych, w których liczy się porządek i elegancja. Współpracuję z architektami przy dopasowaniu kompozycji do przestrzeni.', location: 'Warszawa', styles: ['Geometria', 'Architektura', 'Linie'], techniques: ['Akryl', 'Taśma', 'Pigment'], specializations: ['Biura', 'Kancelarie', 'Wnętrza modernistyczne'], priceRangeMin: 3000, priceRangeMax: 10000, averageDeliveryDays: 56, approvalStatus: 'approved', isVerified: true, yearsExperience: 12, website: 'linke.art', portfolio: portfolioGustaw, stats: { completedProjects: 31, averageRating: 4.8, reviewCount: 23 }, createdAt: '2025-01-28T09:00:00Z' },
  { id: 'dap-9', userId: 'a-demo-9', slug: 'yuki-nakamura', artistName: 'Yuki Nakamura', avatarUrl: '/avatar-maja-sokolowska.webp', coverUrl: `${P}/6569284/pexels-photo-6569284.jpeg?auto=compress&cs=tinysrgb&w=1600`, bio: 'Wabi-sabi i organiczne faktury. Inspiruję się japońską estetyką niedoskonałości i naturalnymi materiałami. Pracuję z pigmentem, strukturą, akrylem i piaskiem. Moje obrazy trafiają do spa, gabinetów terapeutycznych i domów minimalistycznych, w których liczy się spokój i autentyczność materiału.', location: 'Kraków', styles: ['Wabi-sabi', 'Faktury organiczne', 'Neutralne kolory'], techniques: ['Pigment', 'Struktura', 'Akryl', 'Piasek'], specializations: ['Spa', 'Gabinety', 'Domy minimalistyczne'], priceRangeMin: 2200, priceRangeMax: 8000, averageDeliveryDays: 63, approvalStatus: 'approved', isVerified: true, yearsExperience: 13, website: 'yuki.studio', portfolio: portfolioYuki, stats: { completedProjects: 24, averageRating: 4.9, reviewCount: 18 }, createdAt: '2025-02-22T09:00:00Z' },
  { id: 'dap-10', userId: 'a-demo-10', slug: 'brunon-dracz', artistName: 'Brunon Dracz', avatarUrl: `${P}/18888491/pexels-photo-18888491.jpeg?auto=compress&cs=tinysrgb&w=400`, coverUrl: `${P}/2778746/pexels-photo-2778746.jpeg?auto=compress&cs=tinysrgb&w=1600`, bio: 'Surrealizm i obrazy narracyjne. Pracuję z olejem w technice warstwowej z dbałością o detal. Moje obrazy to opowieści z ukrytą symboliką - dla kolekcjonerów i wnętrz artystycznych. Każda praca ma swoją narrację, którą odkrywa się powoli. Realizuję też zlecenia na obrazy narracyjne na podstawie historii klienta.', location: 'Sopot', styles: ['Surrealizm', 'Symbolika', 'Storytelling'], techniques: ['Olej', 'Detal', 'Warstwowe malarstwo'], specializations: ['Kolekcjonerzy', 'Nietypowe zlecenia', 'Wnętrza artystyczne'], priceRangeMin: 4000, priceRangeMax: 16000, averageDeliveryDays: 105, approvalStatus: 'approved', isVerified: true, yearsExperience: 15, website: 'brunondracz.art', portfolio: portfolioBrunon, stats: { completedProjects: 17, averageRating: 5.0, reviewCount: 12 }, createdAt: '2025-01-10T09:00:00Z' },
];

/* --------------------------- Commission requests --------------------------- */

export const demoCommissions: CommissionRequest[] = [
  {
    id: 'dc-1', slug: 'obraz-abstrakcyjny-do-jasnego-salonu', title: 'Obraz abstrakcyjny do jasnego salonu',
    clientId: 'demo-c-1', clientName: 'Julia Wiśniewska', status: 'offers_open',
    publicSummary: 'Szukam obrazu abstrakcyjnego w ciepłych, jasnych tonach do nowoczesnego salonu. Format poziomy 150×80 cm. Spokojna, elegancka kompozycja z subtelną strukturą - beże, biel, złoto, delikatny brąz.',
    privateDescription: 'Salon z jasnymi dębowymi podłogami, ścianami w warm white i meblami w lnie i grafitach. Obraz nad kominkiem. Chcę, by wprowadził ruch i głębię, ale nie dominował. Inspiruję się pracami Cy Twombly w lżejszej wersji. Zależy mi na unikatowej teksturze - impasto, warstwowanie, może złocenia widoczne pod światło.',
    roomType: 'salon', intendedUse: 'mieszkalne', style: 'Abstrakcja strukturalna', mood: 'Spokojny, elegancki, strukturalny',
    preferredColors: ['Biel', 'Beż', 'Złoto', 'Subtelny brąz'], colorsToAvoid: ['Czerwień', 'Neonowe', 'Zieleń'],
    widthCm: 150, heightCm: 80, orientation: 'landscape',
    budgetMin: 3500, budgetMax: 5000, deadline: '2025-10-15', location: 'Warszawa',
    frameRequired: false, deliveryRequired: true,
    attachments: [], interiorImages: [],
    inspirationImages: [
      `${P}/1000366/pexels-photo-1000366.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/7233320/pexels-photo-7233320.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/37509007/pexels-photo-37509007.jpeg?auto=compress&cs=tinysrgb&w=800`,
    ],
    tags: ['Abstrakcja', 'Salon', 'Struktura', 'Złoto', 'Jasne wnętrze'], medium: 'Akryl, pasta strukturalna, złocenia',
    createdAt: '2025-07-15T10:00:00Z', updatedAt: '2025-07-15T10:00:00Z',
    views: 342, commentsCount: 4, offersCount: 3,
  },
  {
    id: 'dc-2', slug: 'duzy-obraz-do-apartamentu-pokazowego', title: 'Duży obraz do apartamentu pokazowego',
    clientId: 'demo-c-2', clientName: 'Tomasz Lewicki - Loft Development', status: 'offers_open',
    publicSummary: 'Duży obraz 180×100 cm do apartamentu pokazowego w nowym projekcie deweloperskim. Premium abstract, nowoczesna paleta: ivory, taupe, graphite, muted gold. Obraz ma być wizytówką apartamentu.',
    privateDescription: 'Apartament pokazowy we Wrocławiu. Jasne podłogi, ściany warm white, kuchnia w antracycie i dębie. Obraz ma przyciągać kupujących, ale wpisywać się w estetykę premium. Inspiracja: Gerhard Richter w luźnej wersji. Potrzebuję zdjęć do materiałów marketingowych dewelopera.',
    roomType: 'salon', intendedUse: 'komercyjne', style: 'Premium abstract', mood: 'Elegancki, galeriowy, premium',
    preferredColors: ['Ivory', 'Taupe', 'Graphite', 'Muted gold'], colorsToAvoid: ['Zieleń', 'Błękit', 'Różowy'],
    widthCm: 180, heightCm: 100, orientation: 'landscape',
    budgetMin: 6000, budgetMax: 9000, deadline: '2025-09-20', location: 'Wrocław',
    frameRequired: false, deliveryRequired: true,
    attachments: [], interiorImages: [],
    inspirationImages: [
      `${P}/16397765/pexels-photo-16397765.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/34661337/pexels-photo-34661337.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/7233322/pexels-photo-7233322.jpeg?auto=compress&cs=tinysrgb&w=800`,
    ],
    tags: ['Duży format', 'Apartament', 'Premium', 'Deweloper'], medium: 'Akryl, mieszane media',
    createdAt: '2025-07-18T12:00:00Z', updatedAt: '2025-07-18T12:00:00Z',
    views: 521, commentsCount: 3, offersCount: 2,
  },
  {
    id: 'dc-3', slug: 'seria-trzech-obrazow-do-hotelowego-lobby', title: 'Seria trzech obrazów do hotelowego lobby',
    clientId: 'demo-c-3', clientName: 'Hotel Sosnowy - Recepcja', status: 'offers_open',
    publicSummary: 'Seria 3 obrazów (każdy ok. 100×140 cm) do hotelowego lobby. Spójna kolekcja, elegancka abstrakcja. Paleta: stone, sand, warm grey, gold. Werniks UV-odporny konieczny.',
    privateDescription: 'Butikowy hotel górski. Lobby z recepcją, strefą wypoczynkową i kominkiem. Podłogi w jasnym kamieniu, ściany w warm grey, drewniane akcenty. Seria ma budować spokojny, elegancki nastrój. Potrzebuję próbki 1 pracy przed pełną realizacją. Oświetlenie hotelowe ma wysokie UV - werniks UV-odporny konieczny.',
    roomType: 'lobby', intendedUse: 'komercyjne', style: 'Elegancka abstrakcja', mood: 'Spokojny, elegancki, hotelowy',
    preferredColors: ['Stone', 'Sand', 'Warm grey', 'Gold'], colorsToAvoid: ['Czerwień', 'Pomarańczowy', 'Neonowe'],
    widthCm: 100, heightCm: 140, orientation: 'portrait',
    budgetMin: 12000, budgetMax: 18000, deadline: '2025-11-01', location: 'Zakopane',
    frameRequired: true, deliveryRequired: true,
    attachments: [], interiorImages: [],
    inspirationImages: [
      `${P}/6876624/pexels-photo-6876624.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/14036246/pexels-photo-14036246.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/14036249/pexels-photo-14036249.jpeg?auto=compress&cs=tinysrgb&w=800`,
    ],
    tags: ['Seria', 'Hotel', 'Lobby', 'Kolekcja', 'Wielki format'], medium: 'Akryl, mixed media',
    createdAt: '2025-07-10T14:00:00Z', updatedAt: '2025-07-10T14:00:00Z',
    views: 687, commentsCount: 5, offersCount: 4,
  },
  {
    id: 'dc-4', slug: 'obraz-do-sypialni-w-delikatnych-kolorach', title: 'Obraz do sypialni w delikatnych kolorach',
    clientId: 'demo-c-4', clientName: 'Klara Zielińska', status: 'offers_open',
    publicSummary: 'Delikatny obraz do sypialni. Format 100×120 cm, spokojny, pastelowy. Kolory: beż, pudrowy róż, złamana biel. Atmosfera odpoczynku i ciepła.',
    privateDescription: 'Sypialnia z dębowym parkietem, ścianami w kości słoniowej, pościelą w lnie i pudrowym różu. Obraz nad łóżkiem. Chcę uniknąć ostrego kontrastu - obraz ma być tłem dla relaksu. Inspiruję się pracami Rothko w pastelowej wersji. Miękkie przejścia, może lekka tekstura impasto.',
    roomType: 'sypialnia', intendedUse: 'mieszkalne', style: 'Pastel, subtelny', mood: 'Spokojny, relaksujący, ciepły',
    preferredColors: ['Beż', 'Pudrowy róż', 'Złamana biel'], colorsToAvoid: ['Czerń', 'Czerwień', 'Neonowe'],
    widthCm: 100, heightCm: 120, orientation: 'portrait',
    budgetMin: 2500, budgetMax: 4000, deadline: '2025-10-01', location: 'Poznań',
    frameRequired: true, deliveryRequired: true,
    attachments: [], interiorImages: [],
    inspirationImages: [
      `${P}/6725076/pexels-photo-6725076.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/7431875/pexels-photo-7431875.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/9175996/pexels-photo-9175996.jpeg?auto=compress&cs=tinysrgb&w=800`,
    ],
    tags: ['Sypialnia', 'Pastel', 'Delikatny', 'Spokój'], medium: 'Akryl, akwarela, technika mieszana',
    createdAt: '2025-07-22T09:00:00Z', updatedAt: '2025-07-22T09:00:00Z',
    views: 298, commentsCount: 3, offersCount: 2,
  },
  {
    id: 'dc-5', slug: 'obraz-do-kancelarii-prawnej', title: 'Obraz do kancelarii prawnej',
    clientId: 'demo-c-5', clientName: 'Kancelaria Ostrołęcka i Wspólnicy', status: 'offers_open',
    publicSummary: 'Obraz do recepcji kancelarii prawnej. Format 120×160 cm, poważny, minimalistyczny, elegancki. Kolory: grafit, czerń, biel, delikatne złoto. Obraz ma budzić zaufanie i stabilność.',
    privateDescription: 'Recepcja kancelarii we Wrocławiu. Ciemne drewno, skóra, ściany warm white, podłoga w ciemnym kamieniu. Pierwsze wrażenie klientów. Obraz ma budzić zaufanie, stabilność i elegancję - bez agresji, ale z obecnością. Inspiracja: Pierre Soulages. Zależy mi na powierzchni reagującej na światło - werniks satynowy z elementami matowymi.',
    roomType: 'biuro', intendedUse: 'komercyjne', style: 'Minimalizm, geometria', mood: 'Poważny, stabilny, elegancki',
    preferredColors: ['Grafit', 'Czerń', 'Biel', 'Delikatne złoto'], colorsToAvoid: ['Zieleń', 'Błękit', 'Różowy'],
    widthCm: 120, heightCm: 160, orientation: 'portrait',
    budgetMin: 4500, budgetMax: 7000, deadline: '2025-09-25', location: 'Warszawa',
    frameRequired: true, deliveryRequired: true,
    attachments: [], interiorImages: [],
    inspirationImages: [
      `${P}/4165347/pexels-photo-4165347.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/8337529/pexels-photo-8337529.jpeg?auto=compress&cs=tinysrgb&w=800`,
    ],
    tags: ['Biuro', 'Kancelaria', 'Geometria', 'Elegancja'], medium: 'Akryl, taśma, pigment',
    createdAt: '2025-07-25T11:00:00Z', updatedAt: '2025-07-25T11:00:00Z',
    views: 234, commentsCount: 2, offersCount: 2,
  },
  {
    id: 'dc-6', slug: 'obraz-na-prezent-slubny', title: 'Obraz na prezent ślubny',
    clientId: 'demo-c-6', clientName: 'Michał Orzechowski', status: 'offers_open',
    publicSummary: 'Obraz na prezent ślubny dla pary młodej. Format 80×100 cm, symboliczny, emocjonalny, ale nie dosłowny. Kolory: ciepła biel, jasne złoto, oliwka. Pamiątka na całe życie.',
    privateDescription: 'Para ceni sztukę i wnętrza. Temat: abstrakcyjna kompozycja nawiązująca do relacji - dwa żywioły łączące się w jedną formę. Na odwrocie podpis i data ślubu. Inspiracja: Hilma af Klint w ciepłej palecie. Obraz ma być pamiątką, nie dekoracją.',
    roomType: 'inne', intendedUse: 'prezent', style: 'Abstrakcja symboliczna', mood: 'Romantyczny, emocjonalny, z głębią',
    preferredColors: ['Ciepła biel', 'Jasne złoto', 'Oliwka'], colorsToAvoid: ['Czerń', 'Neonowe', 'Czerwień'],
    widthCm: 80, heightCm: 100, orientation: 'portrait',
    budgetMin: 2000, budgetMax: 3500, deadline: '2025-09-05', location: 'Gdańsk',
    frameRequired: true, deliveryRequired: true,
    attachments: [], interiorImages: [],
    inspirationImages: [
      `${P}/7233322/pexels-photo-7233322.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/7233193/pexels-photo-7233193.jpeg?auto=compress&cs=tinysrgb&w=800`,
    ],
    tags: ['Prezent', 'Ślub', 'Symboliczny', 'Pamiątka'], medium: 'Akryl, złocenia',
    createdAt: '2025-07-28T08:00:00Z', updatedAt: '2025-07-28T08:00:00Z',
    views: 187, commentsCount: 2, offersCount: 2,
  },
  {
    id: 'dc-7', slug: 'obraz-do-projektu-architekta-wnetrz', title: 'Obraz do projektu architekta wnętrz',
    clientId: 'demo-c-7', clientName: 'Pracownia WN - Anna Radziejewska', status: 'offers_open',
    publicSummary: 'Obraz 140×100 cm do projektu architekta wnętrz. Styl dopasowany do moodboardu inwestycji. Kolory: terracotta, sand, black accents. Obraz ma wpisać się w spójną koncepcję wnętrza.',
    privateDescription: 'Realizuję projekt jadalni i salonu dla klienta. Wnętrze: jasne dębowe podłogi, ściany w warm white, meble w lnie i terrakocie, akcenty czerni. Obraz ma być dominantą jadalni. Moodboard dołączony w załącznikach. Potrzebuję współpracy przy doborze palety i kompozycji.',
    roomType: 'jadalnia', intendedUse: 'komercyjne', style: 'Dopasowany do moodboardu', mood: 'Spójny, elegancki, z akcentami',
    preferredColors: ['Terracotta', 'Sand', 'Black accents'], colorsToAvoid: ['Błękit', 'Zieleń', 'Różowy'],
    widthCm: 140, heightCm: 100, orientation: 'landscape',
    budgetMin: 4000, budgetMax: 6500, deadline: '2025-09-20', location: 'Kraków',
    frameRequired: false, deliveryRequired: true,
    attachments: [], interiorImages: [],
    inspirationImages: [
      `${P}/6109213/pexels-photo-6109213.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/16397765/pexels-photo-16397765.jpeg?auto=compress&cs=tinysrgb&w=800`,
    ],
    tags: ['Architekt wnętrz', 'Jadalnia', 'Moodboard', 'Terracotta'], medium: 'Akryl, mieszane media',
    createdAt: '2025-07-30T10:00:00Z', updatedAt: '2025-07-30T10:00:00Z',
    views: 256, commentsCount: 2, offersCount: 3,
  },
  {
    id: 'dc-8', slug: 'obraz-strukturalny-do-restauracji', title: 'Obraz strukturalny do restauracji',
    clientId: 'demo-c-8', clientName: 'Restauracja Brunatna', status: 'offers_open',
    publicSummary: 'Obraz strukturalny 160×120 cm do restauracji autorskiej. Organiczny, fakturowy, ciepły. Kolory: glina, beż, karmel, ciemny brąz. Obraz ma pasować do ciepłej atmosfery lokalu.',
    privateDescription: 'Restauracja autorska w Łodzi. Sala główna z cegłą, drewnem i mosiądzem. Oświetlenie ciepłe, intymne. Obraz ma mieć wyraźną teksturę - relief, warstwy, może elementy organiczne. Paleta nawiązująca do menu - glina, karmel, ciemny brąz. Inspiracja: Antoni Tàpies. Werniks matowy, obraz dotykalny.',
    roomType: 'restauracja', intendedUse: 'komercyjne', style: 'Strukturalny, organiczny', mood: 'Ciepły, fakturowy, organiczny',
    preferredColors: ['Glina', 'Beż', 'Karmel', 'Ciemny brąz'], colorsToAvoid: ['Błękit', 'Zieleń', 'Neonowe'],
    widthCm: 160, heightCm: 120, orientation: 'landscape',
    budgetMin: 5000, budgetMax: 8000, deadline: '2025-10-20', location: 'Łódź',
    frameRequired: false, deliveryRequired: true,
    attachments: [], interiorImages: [],
    inspirationImages: [
      `${P}/16397765/pexels-photo-16397765.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/12124902/pexels-photo-12124902.png?auto=compress&cs=tinysrgb&w=800`,
      `${P}/33118053/pexels-photo-33118053.jpeg?auto=compress&cs=tinysrgb&w=800`,
    ],
    tags: ['Restauracja', 'Strukturalny', 'Tekstura', 'Ciepły'], medium: 'Gips, pigment, mieszane media',
    createdAt: '2025-08-01T13:00:00Z', updatedAt: '2025-08-01T13:00:00Z',
    views: 312, commentsCount: 3, offersCount: 2,
  },
  {
    id: 'dc-9', slug: 'minimalistyczny-obraz-do-gabinetu-terapeutycznego', title: 'Minimalistyczny obraz do gabinetu terapeutycznego',
    clientId: 'demo-c-9', clientName: 'Gabinet Terapii Cisza', status: 'offers_open',
    publicSummary: 'Obraz 90×120 cm do gabinetu psychoterapii. Spokojny, medytacyjny, wabi-sabi. Kolory: off-white, grey beige, sage. Obraz ma sprzyjać kontemplacji i bezpieczeństwu.',
    privateDescription: 'Gabinet psychoterapii w Sopocie. Wnętrze minimalistyczne, jasne, z naturalnymi materiałami. Obraz naprzeciwko fotela pacjenta. Ma sprzyjać kontemplacji, nie rozpraszać. Inspiracja: wabi-sabi, organiczne faktury, neutralne kolory. Obraz ma być obecny, ale nie narzucający się.',
    roomType: 'biuro', intendedUse: 'komercyjne', style: 'Wabi-sabi, minimalistyczny', mood: 'Spokojny, medytacyjny, bezpieczny',
    preferredColors: ['Off-white', 'Grey beige', 'Sage'], colorsToAvoid: ['Czerwień', 'Czerń', 'Neonowe'],
    widthCm: 90, heightCm: 120, orientation: 'portrait',
    budgetMin: 2500, budgetMax: 4200, deadline: '2025-09-25', location: 'Sopot',
    frameRequired: false, deliveryRequired: true,
    attachments: [], interiorImages: [],
    inspirationImages: [
      `${P}/6569284/pexels-photo-6569284.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/5040744/pexels-photo-5040744.jpeg?auto=compress&cs=tinysrgb&w=800`,
    ],
    tags: ['Gabinet', 'Wabi-sabi', 'Minimalizm', 'Spokój', 'Terapia'], medium: 'Pigment, struktura, akryl',
    createdAt: '2025-08-03T09:00:00Z', updatedAt: '2025-08-03T09:00:00Z',
    views: 198, commentsCount: 2, offersCount: 2,
  },
  {
    id: 'dc-10', slug: 'wyrazista-abstrakcja-do-loftu', title: 'Wyrazista abstrakcja do loftu',
    clientId: 'demo-c-10', clientName: 'Filip Dąbrowski', status: 'offers_open',
    publicSummary: 'Wyrazista abstrakcja 120×180 cm do loftu industrialnego. Dynamiczny, kontrastowy, nowoczesny. Kolory: czerń, biel, kobalt, rdza. Obraz ma być dominantą głównej ściany.',
    privateDescription: 'Loft industrialny w Warszawie. Beton architecturalny, podłoga zającem, ściany w surowym betonie i cegle. Obraz na głównej ścianie salonu. Ma być dominantą - dynamiczny, kontrastowy, z energią. Kolory: czerń, biel, kobalt, rdza. Inspiracja: Anselm Kiefer, Franz Kline. Obraz ma wyglądać jak część architektury, nie dekoracja.',
    roomType: 'salon', intendedUse: 'mieszkalne', style: 'Abstrakcja ekspresyjna', mood: 'Dynamiczny, kontrastowy, industrialny',
    preferredColors: ['Czerń', 'Biel', 'Kobalt', 'Rdza'], colorsToAvoid: ['Pastel', 'Różowy', 'Zieleń'],
    widthCm: 120, heightCm: 180, orientation: 'portrait',
    budgetMin: 4000, budgetMax: 7000, deadline: '2025-10-10', location: 'Warszawa',
    frameRequired: false, deliveryRequired: true,
    attachments: [], interiorImages: [],
    inspirationImages: [
      `${P}/3213977/pexels-photo-3213977.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/30580211/pexels-photo-30580211.jpeg?auto=compress&cs=tinysrgb&w=800`,
      `${P}/14999204/pexels-photo-14999204.jpeg?auto=compress&cs=tinysrgb&w=800`,
    ],
    tags: ['Loft', 'Industrialny', 'Abstrakcja', 'Kontrast', 'Duży format'], medium: 'Akryl, media mieszane',
    createdAt: '2025-08-05T14:00:00Z', updatedAt: '2025-08-05T14:00:00Z',
    views: 423, commentsCount: 3, offersCount: 3,
  },
];

/* --------------------------- Comments --------------------------- */

export const demoComments: CommissionComment[] = [
  // dc-1
  { id: 'dcm-1', commissionId: 'dc-1', authorId: 'a-demo-1', authorName: 'Lena Wojcik', authorRole: 'artist', authorAvatarUrl: '/avatar-lena-wojcik.webp', body: 'Dzień dobry, przy takim formacie dobrze sprawdziłaby się technika akrylowa z delikatną strukturą. Czy złocenia mają być bardziej widoczne, czy raczej subtelne i widoczne tylko pod światło?', attachments: [], isPublic: true, isHidden: false, commentType: 'question', createdAt: '2025-07-16T10:30:00Z' },
  { id: 'dcm-2', commissionId: 'dc-1', authorId: 'demo-c-1', authorName: 'Julia Wiśniewska', authorRole: 'client', body: 'Subtelne - zależy mi na głębi bez ostrego błysku. Widoczne pod światło, nie z przodu.', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-07-16T14:15:00Z' },
  { id: 'dcm-3', commissionId: 'dc-1', authorId: 'a-demo-2', authorName: 'Nikodem Halicki', authorRole: 'artist', authorAvatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=200`, body: 'W jasnym salonie z dużą ilością światła天然 struturalna tekstura pięknie zagra. Proponuję płótno lniane z widocznym splotem - dodatkowa warstwa faktury.', attachments: [], isPublic: true, isHidden: false, commentType: 'suggestion', createdAt: '2025-07-17T09:00:00Z' },
  { id: 'dcm-4', commissionId: 'dc-1', authorId: 'a-demo-9', authorName: 'Yuki Nakamura', authorRole: 'artist', authorAvatarUrl: '/avatar-maja-sokolowska.webp', body: 'Mogę zaproponować organiczne faktury z piaskiem i pigmentem - w tej palecie beżu i bieli dają bardzo spokojny efekt. Czas realizacji ok. 6 tygodni.', attachments: [], isPublic: true, isHidden: false, commentType: 'general', createdAt: '2025-07-18T11:00:00Z' },

  // dc-2
  { id: 'dcm-5', commissionId: 'dc-2', authorId: 'a-demo-6', authorName: 'Witold Kruszyński', authorRole: 'artist', authorAvatarUrl: `${P}/16762319/pexels-photo-16762319.jpeg?auto=compress&cs=tinysrgb&w=200`, body: 'Mam doświadczenie z projektami deweloperskimi - mogę dostarczyć render 3D przed realizacją i zdjęcia do materiałów marketingowych. Czy paleta jest ostateczna?', attachments: [], isPublic: true, isHidden: false, commentType: 'general', createdAt: '2025-07-19T10:00:00Z' },
  { id: 'dcm-6', commissionId: 'dc-2', authorId: 'a-demo-8', authorName: 'Gustaw Linke', authorRole: 'artist', authorAvatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=200`, body: 'W tej palecie graphite/taupe/muted gold sprawdzi się geometria z precyzyjnymi krawędziami. Proponuję werniks satynowy - gra z światłem w apartamentowym oświetleniu.', attachments: [], isPublic: true, isHidden: false, commentType: 'suggestion', createdAt: '2025-07-20T14:00:00Z' },
  { id: 'dcm-7', commissionId: 'dc-2', authorId: 'demo-c-2', authorName: 'Tomasz Lewicki - Loft Development', authorRole: 'client', body: 'Paleta jest ostateczna. Render 3D bardzo mile widziany - pomoże w materiałach sprzedażowych.', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-07-21T09:30:00Z' },

  // dc-3
  { id: 'dcm-8', commissionId: 'dc-3', authorId: 'a-demo-6', authorName: 'Witold Kruszyński', authorRole: 'artist', authorAvatarUrl: `${P}/16762319/pexels-photo-16762319.jpeg?auto=compress&cs=tinysrgb&w=200`, body: 'Seria 3 obrazów do lobby to mój profil. Proponuję spójną kolekcję w palecie stone/sand/warm grey z akcentami złota. Werniks UV-odporny wliczony. Próbka 1 pracy przed pełną realizacją.', attachments: [], isPublic: true, isHidden: false, commentType: 'general', createdAt: '2025-07-11T09:00:00Z' },
  { id: 'dcm-9', commissionId: 'dc-3', authorId: 'a-demo-1', authorName: 'Lena Wojcik', authorRole: 'artist', authorAvatarUrl: '/avatar-lena-wojcik.webp', body: 'W hotelowym oświetleniu UV-odporny werniks to konieczność - mogę wliczyć. Czy seria ma mieć wspólny motyw, czy trzy spójne ale różne kompozycje?', attachments: [], isPublic: true, isHidden: false, commentType: 'question', createdAt: '2025-07-12T11:00:00Z' },
  { id: 'dcm-10', commissionId: 'dc-3', authorId: 'demo-c-3', authorName: 'Hotel Sosnowy - Recepcja', authorRole: 'client', body: 'Trzy spójne ale różne kompozycje - wspólna paleta i rytm, ale każda ma własną dominantę.', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-07-13T10:00:00Z' },
  { id: 'dcm-11', commissionId: 'dc-3', authorId: 'a-demo-3', authorName: 'Irena Falska', authorRole: 'artist', authorAvatarUrl: `${P}/8036832/pexels-photo-8036832.jpeg?auto=compress&cs=tinysrgb&w=200`, body: 'W górskim hotelu pięknie zagrałyby pejzaże abstrakcyjne w tej palecie - mgliste formy nawiązujące do krajobrazu. Mogę połączyć pejzaż z abstrakcją.', attachments: [], isPublic: true, isHidden: false, commentType: 'suggestion', createdAt: '2025-07-14T08:00:00Z' },
  { id: 'dcm-12', commissionId: 'dc-3', authorId: 'a-demo-2', authorName: 'Nikodem Halicki', authorRole: 'artist', authorAvatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=200`, body: 'Wielki format 100×140 w palecie stone/sand - mogę zrealizować w technice akryl + pigment na lnianym płótnie. Spójna seria, czas 10 tygodni.', attachments: [], isPublic: true, isHidden: false, commentType: 'general', createdAt: '2025-07-15T13:00:00Z' },

  // dc-4
  { id: 'dcm-13', commissionId: 'dc-4', authorId: 'a-demo-7', authorName: 'Maja Sokołowska', authorRole: 'artist', authorAvatarUrl: '/avatar-maja-sokolowska.webp', body: 'Sypialnia w pudrowym różu i beżach to mój klimat. Proponuję miękkie przejścia w akwareli i akrylu z delikatną teksturą. Format 100×120 pięknie zagra nad łóżkiem.', attachments: [], isPublic: true, isHidden: false, commentType: 'general', createdAt: '2025-07-23T10:00:00Z' },
  { id: 'dcm-14', commissionId: 'dc-4', authorId: 'a-demo-9', authorName: 'Yuki Nakamura', authorRole: 'artist', authorAvatarUrl: '/avatar-maja-sokolowska.webp', body: 'Wabi-sabi w tej palecie da bardzo spokojny, medytacyjny efekt. Organiczne faktury, miękkie krawędzie. Czy obraz ma być abstrakcją czy z elementami botanicznymi?', attachments: [], isPublic: true, isHidden: false, commentType: 'question', createdAt: '2025-07-24T09:00:00Z' },
  { id: 'dcm-15', commissionId: 'dc-4', authorId: 'demo-c-4', authorName: 'Klara Zielińska', authorRole: 'client', body: 'Abstrakcja, ale z delikatnymi organicznymi formami - niech sugerują naturę, nie pokazują jej dosłownie.', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-07-24T14:00:00Z' },

  // dc-5
  { id: 'dcm-16', commissionId: 'dc-5', authorId: 'a-demo-8', authorName: 'Gustaw Linke', authorRole: 'artist', authorAvatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=200`, body: 'Kancelaria i geometria to idealne połączenie. Proponuję kompozycję w duchu Soulages w palecie grafit/czerń/biel/złoto. Precyzyjne krawędzie, werniks z elementami matowymi - gra ze światłem buduje stabilność.', attachments: [], isPublic: true, isHidden: false, commentType: 'general', createdAt: '2025-07-26T10:00:00Z' },
  { id: 'dcm-17', commissionId: 'dc-5', authorId: 'a-demo-2', authorName: 'Nikodem Halicki', authorRole: 'artist', authorAvatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=200`, body: 'Minimalizm w tej palecie zadziała bardzo elegancko. Monochromatyczna kompozycja z akcentem złota - powaga z obecnością, nie agresją.', attachments: [], isPublic: true, isHidden: false, commentType: 'suggestion', createdAt: '2025-07-27T11:00:00Z' },

  // dc-6
  { id: 'dcm-18', commissionId: 'dc-6', authorId: 'a-demo-5', authorName: 'Honorata Czech', authorRole: 'artist', authorAvatarUrl: `${P}/6816588/pexels-photo-6816588.jpeg?auto=compress&cs=tinysrgb&w=200`, body: 'Obraz na prezent ślubny to piękny projekt. Mogę stworzyć symboliczną kompozycję - dwa organiczne formy łączące się, z personalizacją. Podpis i data na odwrocie oczywiście. W tej palecie ciepłej bieli i złota da bardzo emocjonalny efekt.', attachments: [], isPublic: true, isHidden: false, commentType: 'general', createdAt: '2025-07-29T10:00:00Z' },
  { id: 'dcm-19', commissionId: 'dc-6', authorId: 'a-demo-1', authorName: 'Lena Wojcik', authorRole: 'artist', authorAvatarUrl: '/avatar-lena-wojcik.webp', body: 'Złocenia jako symbol jedności - subtelne, widoczne pod światło. Mogę zaproponować kompozycję z delikatną strukturą i akcentem złota. Termin 4 tygodnie jest możliwy przy mniejszym formacie.', attachments: [], isPublic: true, isHidden: false, commentType: 'suggestion', createdAt: '2025-07-30T09:00:00Z' },

  // dc-7
  { id: 'dcm-20', commissionId: 'dc-7', authorId: 'a-demo-4', authorName: 'Oskar Reński', authorRole: 'artist', authorAvatarUrl: `${P}/18888491/pexels-photo-18888491.jpeg?auto=compress&cs=tinysrgb&w=200`, body: 'Terracotta i black accents - dynamiczna paleta. Mogę zaproponować ekspresyjną kompozycję z akcentami czerni. Czas realizacji 5 tygodni.', attachments: [], isPublic: true, isHidden: false, commentType: 'general', createdAt: '2025-07-31T10:00:00Z' },
  { id: 'dcm-21', commissionId: 'dc-7', authorId: 'a-demo-1', authorName: 'Lena Wojcik', authorRole: 'artist', authorAvatarUrl: '/avatar-lena-wojcik.webp', body: 'Pracuję z architektami - mogę dopasować kompozycję do moodboardu. Proponuję strukturę w terrakocie z subtelnymi akcentami. Próbka kolorystyczna do akceptacji.', attachments: [], isPublic: true, isHidden: false, commentType: 'general', createdAt: '2025-08-01T11:00:00Z' },
  { id: 'dcm-22', commissionId: 'dc-7', authorId: 'demo-c-7', authorName: 'Pracownia WN - Anna Radziejewska', authorRole: 'client', body: 'Próbka kolorystyczna bardzo mile widziana - współpraca przy palecie kluczowa. Moodboard prześlę w wiadomości prywatnej.', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-08-01T15:00:00Z' },

  // dc-8
  { id: 'dcm-23', commissionId: 'dc-8', authorId: 'a-demo-9', authorName: 'Yuki Nakamura', authorRole: 'artist', authorAvatarUrl: '/avatar-maja-sokolowska.webp', body: 'Organiczne faktury w palecie gliny i karmelu - to mój język. Piasek, pigment, struktura. W ciepłym oświetleniu restauracji relief pięknie zagra. Mogę zrobić próbkę 30×30 cm.', attachments: [], isPublic: true, isHidden: false, commentType: 'general', createdAt: '2025-08-02T10:00:00Z' },
  { id: 'dcm-24', commissionId: 'dc-8', authorId: 'a-demo-1', authorName: 'Lena Wojcik', authorRole: 'artist', authorAvatarUrl: '/avatar-lena-wojcik.webp', body: 'Struktura z pastą strukturalną w tonach karmelu i ciemnego brązu - relief dotykalny, werniks matowy. W restauracji sprawdzi się bardzo dobrze. Czas 8 tygodni.', attachments: [], isPublic: true, isHidden: false, commentType: 'suggestion', createdAt: '2025-08-03T09:00:00Z' },
  { id: 'dcm-25', commissionId: 'dc-8', authorId: 'demo-c-8', authorName: 'Restauracja Brunatna', authorRole: 'client', body: 'Próbka 30×30 cm świetny pomysł - chcemy zobaczyć teksturę przed pełną realizacją. Oświetlenie u nas ciepłe, intymne.', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-08-03T14:00:00Z' },

  // dc-9
  { id: 'dcm-26', commissionId: 'dc-9', authorId: 'a-demo-9', authorName: 'Yuki Nakamura', authorRole: 'artist', authorAvatarUrl: '/avatar-maja-sokolowska.webp', body: 'Gabinet terapeutyczny i wabi-sabi to idealne połączenie. Organiczne faktury w off-white i sage - obecne, ale nie narzucające się. Pacjent będzie mógł się w nich zgubić wzrokiem.', attachments: [], isPublic: true, isHidden: false, commentType: 'general', createdAt: '2025-08-04T10:00:00Z' },
  { id: 'dcm-27', commissionId: 'dc-9', authorId: 'a-demo-2', authorName: 'Nikodem Halicki', authorRole: 'artist', authorAvatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=200`, body: 'Minimalizm w grey beige i sage - bardzo spokojna kompozycja. Organiczne formy, miękkie krawędzie. Obraz, który sprzyja kontemplacji.', attachments: [], isPublic: true, isHidden: false, commentType: 'suggestion', createdAt: '2025-08-05T09:00:00Z' },

  // dc-10
  { id: 'dcm-28', commissionId: 'dc-10', authorId: 'a-demo-4', authorName: 'Oskar Reński', authorRole: 'artist', authorAvatarUrl: `${P}/18888491/pexels-photo-18888491.jpeg?auto=compress&cs=tinysrgb&w=200`, body: 'Loft industrialny i wyrazista abstrakcja - to mój teren. Czerń, biel, kobalt, rdza w dynamicznej kompozycji. Duży format 120×180, czas 7 tygodni. Obraz jako część architektury, nie dekoracja.', attachments: [], isPublic: true, isHidden: false, commentType: 'general', createdAt: '2025-08-06T10:00:00Z' },
  { id: 'dcm-29', commissionId: 'dc-10', authorId: 'a-demo-10', authorName: 'Brunon Dracz', authorRole: 'artist', authorAvatarUrl: `${P}/18888491/pexels-photo-18888491.jpeg?auto=compress&cs=tinysrgb&w=200`, body: 'W loftie z betonem świetnie zagra narracyjna abstrakcja z symboliką - warstwy, rdza, ślady. Mogę zaproponować kompozycję z elementami storytellingu. Czas 8 tygodni.', attachments: [], isPublic: true, isHidden: false, commentType: 'suggestion', createdAt: '2025-08-07T09:00:00Z' },
  { id: 'dcm-30', commissionId: 'dc-10', authorId: 'demo-c-10', authorName: 'Filip Dąbrowski', authorRole: 'client', body: 'Obraz jako część architektury - dokładnie to chcę. Rdza i kobalt jako akcenty, czerń i biel jako baza.', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-08-07T14:00:00Z' },
];

/* --------------------------- Offers --------------------------- */

export const demoOffers: CommissionOffer[] = [
  { id: 'do-1', commissionId: 'dc-1', artistId: 'a-demo-1', artistName: 'Lena Wojcik', artistAvatarUrl: '/avatar-lena-wojcik.webp', artistSlug: 'lena-wojcik', message: 'Mogę przygotować obraz w technice akryl + pasta strukturalna + subtelne złocenia widoczne pod światło. Kompozycja w trzech warstwach - grunt, środkowa impasto w beżach, wierzchnia ze złotem i brązem. W cenie: materiały, werniks UV, certyfikat, transport. Termin 6 tygodni.', price: 4200, priceMax: 4800, estimatedDays: 42, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-lena-1', 'dp-lena-2'], status: 'submitted', createdAt: '2025-07-17T12:00:00Z' },
  { id: 'do-2', commissionId: 'dc-1', artistId: 'a-demo-9', artistName: 'Yuki Nakamura', artistAvatarUrl: '/avatar-maja-sokolowska.webp', artistSlug: 'yuki-nakamura', message: 'Organiczne faktury z piaskiem i pigmentem w palecie beżu i bieli. Spokojny, medytacyjny efekt. Werniks matowy. Materiały i transport wliczone. Termin 6 tygodni.', price: 3800, estimatedDays: 42, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-yuki-1', 'dp-yuki-2'], status: 'submitted', createdAt: '2025-07-19T10:00:00Z' },
  { id: 'do-3', commissionId: 'dc-1', artistId: 'a-demo-2', artistName: 'Nikodem Halicki', artistAvatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=200`, artistSlug: 'nikodem-halicki', message: 'Minimalistyczna kompozycja na płótnie lnianym z widocznym splotem. Akryl i pigment w beżach i ivory z subtelnym brązem. Brak złota - czystość i światło. Termin 5 tygodni.', price: 4500, estimatedDays: 35, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-niko-1', 'dp-niko-2'], status: 'submitted', createdAt: '2025-07-19T14:00:00Z' },

  { id: 'do-4', commissionId: 'dc-2', artistId: 'a-demo-6', artistName: 'Witold Kruszyński', artistAvatarUrl: `${P}/16762319/pexels-photo-16762319.jpeg?auto=compress&cs=tinysrgb&w=200`, artistSlug: 'witold-kruszynski', message: 'Premium abstract 180×100 w palecie ivory/taupe/graphite/muted gold. Render 3D przed realizacją, zdjęcia do materiałów marketingowych dewelopera. Werniks UV. Termin 5 tygodni. Materiały, transport, instalacja wliczone.', price: 8500, estimatedDays: 35, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-witoH-1', 'dp-witoH-3'], status: 'submitted', createdAt: '2025-07-20T12:00:00Z' },
  { id: 'do-5', commissionId: 'dc-2', artistId: 'a-demo-8', artistName: 'Gustaw Linke', artistAvatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=200`, artistSlug: 'gustaw-linke', message: 'Geometria z precyzyjnymi krawędziami w palecie graphite/taupe/gold. Werniks satynowy - gra ze światłem w apartamentowym oświetleniu. Render przed realizacją. Termin 5 tygodni.', price: 7200, estimatedDays: 35, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-gust-1', 'dp-gust-2'], status: 'submitted', createdAt: '2025-07-21T10:00:00Z' },

  { id: 'do-6', commissionId: 'dc-3', artistId: 'a-demo-6', artistName: 'Witold Kruszyński', artistAvatarUrl: `${P}/16762319/pexels-photo-16762319.jpeg?auto=compress&cs=tinysrgb&w=200`, artistSlug: 'witold-kruszynski', message: 'Seria 3 obrazów 100×140 do hotelowego lobby. Spójna kolekcja w palecie stone/sand/warm grey/gold. Werniks UV-odporny. Próbka 1 pracy przed pełną realizacją. Transport i instalacja w Zakopanem wliczone. Termin 10 tygodni.', price: 16000, estimatedDays: 70, includesMaterials: true, includesShipping: true, includesFrame: true, depositPercent: 30, portfolioRefs: ['dp-witoH-1', 'dp-witoH-2', 'dp-witoH-4'], status: 'submitted', createdAt: '2025-07-12T14:00:00Z' },
  { id: 'do-7', commissionId: 'dc-3', artistId: 'a-demo-1', artistName: 'Lena Wojcik', artistAvatarUrl: '/avatar-lena-wojcik.webp', artistSlug: 'lena-wojcik', message: 'Seria 3 prac w technice akryl + pasta strukturalna + złocenia. Spójna kolekcja z akcentami złota. Werniks UV-odporny. Próbka przed realizacją. Termin 9 tygodni.', price: 14500, estimatedDays: 63, includesMaterials: true, includesShipping: true, includesFrame: true, depositPercent: 30, portfolioRefs: ['dp-lena-1', 'dp-lena-4'], status: 'submitted', createdAt: '2025-07-14T11:00:00Z' },
  { id: 'do-8', commissionId: 'dc-3', artistId: 'a-demo-3', artistName: 'Irena Falska', artistAvatarUrl: `${P}/8036832/pexels-photo-8036832.jpeg?auto=compress&cs=tinysrgb&w=200`, artistSlug: 'irena-falska', message: 'Mgliste pejzaże abstrakcyjne w palecie stone/sand/warm grey - nawiązanie do górskiego krajobrazu. Spójna seria 3 prac. Olej z laserunkami. Werniks UV. Termin 11 tygodni.', price: 13500, estimatedDays: 77, includesMaterials: true, includesShipping: true, includesFrame: true, depositPercent: 30, portfolioRefs: ['dp-irena-1', 'dp-irena-4'], status: 'submitted', createdAt: '2025-07-15T09:00:00Z' },
  { id: 'do-9', commissionId: 'dc-3', artistId: 'a-demo-2', artistName: 'Nikodem Halicki', artistAvatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=200`, artistSlug: 'nikodem-halicki', message: 'Minimalistyczna seria w palecie stone/sand/warm grey. Akryl i pigment na lnianym płótnie. Spójna, bardzo elegancka. Termin 10 tygodni.', price: 12500, estimatedDays: 70, includesMaterials: true, includesShipping: true, includesFrame: true, depositPercent: 30, portfolioRefs: ['dp-niko-1', 'dp-niko-3'], status: 'submitted', createdAt: '2025-07-16T13:00:00Z' },

  { id: 'do-10', commissionId: 'dc-4', artistId: 'a-demo-7', artistName: 'Maja Sokołowska', artistAvatarUrl: '/avatar-maja-sokolowska.webp', artistSlug: 'maja-sokolowska', message: 'Miękkie przejścia w akwareli i akrylu z delikatną teksturą. Pudrowy róż, beż, złamana biel - atmosfera odpoczynku. Oprawa wliczona. Termin 7 tygodni.', price: 3200, estimatedDays: 49, includesMaterials: true, includesShipping: true, includesFrame: true, depositPercent: 40, portfolioRefs: ['dp-maja-1', 'dp-maja-3'], status: 'submitted', createdAt: '2025-07-24T12:00:00Z' },
  { id: 'do-11', commissionId: 'dc-4', artistId: 'a-demo-9', artistName: 'Yuki Nakamura', artistAvatarUrl: '/avatar-maja-sokolowska.webp', artistSlug: 'yuki-nakamura', message: 'Wabi-sabi w palecie beżu i pudrowego różu - organiczne formy, miękkie krawędzie. Spokojny, medytacyjny. Termin 6 tygodni.', price: 2800, estimatedDays: 42, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-yuki-1', 'dp-yuki-4'], status: 'submitted', createdAt: '2025-07-25T10:00:00Z' },

  { id: 'do-12', commissionId: 'dc-5', artistId: 'a-demo-8', artistName: 'Gustaw Linke', artistAvatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=200`, artistSlug: 'gustaw-linke', message: 'Kompozycja w duchu Soulages - grafit, czerń, biel, akcent złota. Precyzyjne krawędzie, werniks z elementami matowymi. Gra ze światłem buduje stabilność i zaufanie. Oprawa wliczona. Termin 6 tygodni.', price: 6800, estimatedDays: 42, includesMaterials: true, includesShipping: true, includesFrame: true, depositPercent: 40, portfolioRefs: ['dp-gust-1', 'dp-gust-4'], status: 'submitted', createdAt: '2025-07-27T12:00:00Z' },
  { id: 'do-13', commissionId: 'dc-5', artistId: 'a-demo-2', artistName: 'Nikodem Halicki', artistAvatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=200`, artistSlug: 'nikodem-halicki', message: 'Monochromatyczny minimalizm w grafit/czerń/biel z akcentem złota. Powaga z obecnością. Termin 6 tygodni.', price: 5500, estimatedDays: 42, includesMaterials: true, includesShipping: true, includesFrame: true, depositPercent: 40, portfolioRefs: ['dp-niko-2', 'dp-niko-4'], status: 'submitted', createdAt: '2025-07-28T10:00:00Z' },

  { id: 'do-14', commissionId: 'dc-6', artistId: 'a-demo-5', artistName: 'Honorata Czech', artistAvatarUrl: `${P}/6816588/pexels-photo-6816588.jpeg?auto=compress&cs=tinysrgb&w=200`, artistSlug: 'honorata-czech', message: 'Symboliczna kompozycja - dwa organiczne formy łączące się, ciepła biel i złoto. Personalizacja: podpis i data na odwrocie. Oprawa wliczona. Termin 4 tygodnie.', price: 2800, estimatedDays: 28, includesMaterials: true, includesShipping: true, includesFrame: true, depositPercent: 50, portfolioRefs: ['dp-hono-1', 'dp-hono-3'], status: 'submitted', createdAt: '2025-07-30T12:00:00Z' },
  { id: 'do-15', commissionId: 'dc-6', artistId: 'a-demo-1', artistName: 'Lena Wojcik', artistAvatarUrl: '/avatar-lena-wojcik.webp', artistSlug: 'lena-wojcik', message: 'Subtelne złocenia jako symbol jedności - widoczne pod światło. Delikatna struktura, ciepła biel, oliwka. Termin 4 tygodnie.', price: 3200, estimatedDays: 28, includesMaterials: true, includesShipping: true, includesFrame: true, depositPercent: 50, portfolioRefs: ['dp-lena-2', 'dp-lena-3'], status: 'submitted', createdAt: '2025-07-31T10:00:00Z' },

  { id: 'do-16', commissionId: 'dc-7', artistId: 'a-demo-4', artistName: 'Oskar Reński', artistAvatarUrl: `${P}/18888491/pexels-photo-18888491.jpeg?auto=compress&cs=tinysrgb&w=200`, artistSlug: 'oskar-renski', message: 'Ekspresyjna kompozycja w terrakocie z akcentami czerni. Dynamiczna, ale spójna z moodboardem. Termin 5 tygodni.', price: 5500, estimatedDays: 35, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-oskar-1', 'dp-oskar-4'], status: 'submitted', createdAt: '2025-08-01T14:00:00Z' },
  { id: 'do-17', commissionId: 'dc-7', artistId: 'a-demo-1', artistName: 'Lena Wojcik', artistAvatarUrl: '/avatar-lena-wojcik.webp', artistSlug: 'lena-wojcik', message: 'Struktura w terrakocie z subtelnymi akcentami. Próbka kolorystyczna do akceptacji. Współpraca z architektem. Termin 5 tygodni.', price: 4800, estimatedDays: 35, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-lena-1', 'dp-lena-3'], status: 'submitted', createdAt: '2025-08-02T10:00:00Z' },
  { id: 'do-18', commissionId: 'dc-7', artistId: 'a-demo-8', artistName: 'Gustaw Linke', artistAvatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=200`, artistSlug: 'gustaw-linke', message: 'Geometria w terrakocie z black accents - precyzyjne krawędzie, rytm. Spójne z moodboardem. Termin 5 tygodni.', price: 5200, estimatedDays: 35, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-gust-1', 'dp-gust-2'], status: 'submitted', createdAt: '2025-08-02T14:00:00Z' },

  { id: 'do-19', commissionId: 'dc-8', artistId: 'a-demo-9', artistName: 'Yuki Nakamura', artistAvatarUrl: '/avatar-maja-sokolowska.webp', artistSlug: 'yuki-nakamura', message: 'Organiczne faktury w palecie gliny i karmelu. Piasek, pigment, struktura. Relief dotykalny, werniks matowy. Próbka 30×30 cm. Termin 8 tygodni.', price: 6500, estimatedDays: 56, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-yuki-1', 'dp-yuki-2'], status: 'submitted', createdAt: '2025-08-03T12:00:00Z' },
  { id: 'do-20', commissionId: 'dc-8', artistId: 'a-demo-1', artistName: 'Lena Wojcik', artistAvatarUrl: '/avatar-lena-wojcik.webp', artistSlug: 'lena-wojcik', message: 'Struktura z pastą strukturalną w karmelu i ciemnym brązie. Relief dotykalny, werniks matowy. Próbka przed realizacją. Termin 8 tygodni.', price: 7200, estimatedDays: 56, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-lena-1', 'dp-lena-3'], status: 'submitted', createdAt: '2025-08-04T10:00:00Z' },

  { id: 'do-21', commissionId: 'dc-9', artistId: 'a-demo-9', artistName: 'Yuki Nakamura', artistAvatarUrl: '/avatar-maja-sokolowska.webp', artistSlug: 'yuki-nakamura', message: 'Wabi-sabi w off-white i sage - organiczne faktury, obecne ale nie narzucające się. Pigment, struktura. Termin 6 tygodni.', price: 3400, estimatedDays: 42, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-yuki-1', 'dp-yuki-3'], status: 'submitted', createdAt: '2025-08-05T12:00:00Z' },
  { id: 'do-22', commissionId: 'dc-9', artistId: 'a-demo-2', artistName: 'Nikodem Halicki', artistAvatarUrl: `${P}/18888497/pexels-photo-18888497.jpeg?auto=compress&cs=tinysrgb&w=200`, artistSlug: 'nikodem-halicki', message: 'Minimalizm w grey beige i sage - organiczne formy, miękkie krawędzie. Spokojna kompozycja sprzyjająca kontemplacji. Termin 6 tygodni.', price: 3800, estimatedDays: 42, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-niko-2', 'dp-niko-3'], status: 'submitted', createdAt: '2025-08-06T10:00:00Z' },

  { id: 'do-23', commissionId: 'dc-10', artistId: 'a-demo-4', artistName: 'Oskar Reński', artistAvatarUrl: `${P}/18888491/pexels-photo-18888491.jpeg?auto=compress&cs=tinysrgb&w=200`, artistSlug: 'oskar-renski', message: 'Wyrazista abstrakcja 120×180 - czerń, biel, kobalt, rdza. Dynamiczna kompozycja, obraz jako część architektury. Termin 7 tygodni.', price: 6200, estimatedDays: 49, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-oskar-1', 'dp-oskar-3'], status: 'submitted', createdAt: '2025-08-07T12:00:00Z' },
  { id: 'do-24', commissionId: 'dc-10', artistId: 'a-demo-10', artistName: 'Brunon Dracz', artistAvatarUrl: `${P}/18888491/pexels-photo-18888491.jpeg?auto=compress&cs=tinysrgb&w=200`, artistSlug: 'brunon-dracz', message: 'Narracyjna abstrakcja z elementami storytellingu - warstwy, rdza, ślady. Olej w technice warstwowej. Termin 8 tygodni.', price: 6800, estimatedDays: 56, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-brun-1', 'dp-brun-2'], status: 'submitted', createdAt: '2025-08-08T10:00:00Z' },
  { id: 'do-25', commissionId: 'dc-10', artistId: 'a-demo-1', artistName: 'Lena Wojcik', artistAvatarUrl: '/avatar-lena-wojcik.webp', artistSlug: 'lena-wojcik', message: 'Strukturalna abstrakcja z akcentami rdzy i kobaltu. Pasta strukturalna, pigment, media mieszane. Obraz jako część betonowej ściany. Termin 7 tygodni.', price: 5800, estimatedDays: 49, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['dp-lena-1', 'dp-lena-4'], status: 'submitted', createdAt: '2025-08-08T14:00:00Z' },
];
