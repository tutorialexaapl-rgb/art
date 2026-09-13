import type {
  AdminAuditLog, ArtistPortfolioItem, ArtistProfile, ClientProfile, CommissionAttachment,
  CommissionComment, CommissionCommentAttachment, CommissionMilestone, CommissionOffer,
  CommissionPayment, CommissionProject, CommissionRequest, Conversation, Message,
  ModerationReport, PlatformSettings, ContactBypassAttempt, Profile, User,
} from '@/types';
export const mockUsers: User[] = [
  { id: 'u-client-1', email: 'anna.kowalska@example.com', role: 'client', status: 'approved', displayName: 'Anna Kowalska', location: 'Warszawa', createdAt: '2025-03-12T10:00:00Z' },
  { id: 'u-client-2', email: 'studio.mk@example.com', role: 'client', status: 'approved', displayName: 'Marek Kaczmarek - Studio MK', location: 'Wrocław', bio: 'Architekt wnętrz. Realizuję projekty dla klientów indywidualnych i komercyjnych.', createdAt: '2025-01-08T10:00:00Z' },
  { id: 'u-client-3', email: 'hotel.tatry@example.com', role: 'client', status: 'approved', displayName: 'Hotel Tatry Boutique', location: 'Zakopane', bio: 'Butikowy hotel w sercu Tatr.', createdAt: '2025-02-15T10:00:00Z' },
  { id: 'u-client-4', email: 'magdalena.b@example.com', role: 'client', status: 'approved', displayName: 'Magdalena Borkowska', location: 'Poznań', bio: 'Kolekcjonerka sztuki i architekt wnętrz.', createdAt: '2025-04-03T10:00:00Z' },
  { id: 'u-artist-1', email: 'artur@atelier-art.pl', role: 'artist', status: 'approved', displayName: 'Artur Lewandowski', avatarUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Malarz abstrakcyjny. Pracuję z akrylem i mieszanką mediów od 12 lat.', location: 'Kraków', specializations: ['Abstrakcja', 'Akryl', 'Mieszane media'], yearsExperience: 12, isVerifiedArtist: true, createdAt: '2024-11-20T10:00:00Z' },
  { id: 'u-artist-2', email: 'hanna@hanna-art.pl', role: 'artist', status: 'approved', displayName: 'Hanna Nowak', avatarUrl: 'https://images.pexels.com/photos/1239351/pexels-photo-1239351.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Specjalizuję się w portretach olejnych i malarstwie figuratywnym.', location: 'Gdańsk', specializations: ['Portret', 'Olej', 'Figuratywne'], yearsExperience: 8, isVerifiedArtist: true, createdAt: '2024-12-05T10:00:00Z' },
  { id: 'u-artist-3', email: 'kazik@kazik-art.pl', role: 'artist', status: 'pending', displayName: 'Kazimierz Wójcik', avatarUrl: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Pejzaże i sceny miejskie. Akwarela i olej.', location: 'Poznań', specializations: ['Pejzaż', 'Akwarela', 'Olej'], yearsExperience: 5, isVerifiedArtist: false, createdAt: '2025-06-01T10:00:00Z' },
  { id: 'u-artist-4', email: 'elzbieta@elart.pl', role: 'artist', status: 'approved', displayName: 'Elżbieta Sokołowska', avatarUrl: 'https://images.pexels.com/photos/268489/pexels-photo-268489.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Malarz strukturalny i teksturalny. Pracuję z gipsem, piaskiem i pigmentami naturalnymi.', location: 'Łódź', specializations: ['Strukturalne', 'Tekstura', 'Mieszane media'], yearsExperience: 15, isVerifiedArtist: true, createdAt: '2024-10-15T10:00:00Z' },
  { id: 'u-artist-5', email: 'piotr@piotrzalewski.art', role: 'artist', status: 'approved', displayName: 'Piotr Zalewski', avatarUrl: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Malarz wnętrz. Abstrakcja geometryczna i minimalizm.', location: 'Warszawa', specializations: ['Geometria', 'Minimalizm', 'Akryl'], yearsExperience: 10, isVerifiedArtist: true, createdAt: '2024-09-10T10:00:00Z' },
  { id: 'u-artist-6', email: 'zofia@zofia-art.pl', role: 'artist', status: 'approved', displayName: 'Zofia Kamińska', avatarUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Botaniczne i organiczne kompozycje. Akwarela i tusz.', location: 'Kraków', specializations: ['Botaniczne', 'Akwarela', 'Tusz'], yearsExperience: 7, isVerifiedArtist: true, createdAt: '2025-01-20T10:00:00Z' },
  { id: 'u-artist-7', email: 'tomasz@tomaszwolski.art', role: 'artist', status: 'pending', displayName: 'Tomasz Wolski', avatarUrl: 'https://images.pexels.com/photos/1145720/pexels-photo-1145720.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Malarz hiperrealistyczny. Pracuję z olejem i akrylem w dużej skali.', location: 'Sopot', specializations: ['Hiperrealizm', 'Olej', 'Duży format'], yearsExperience: 18, isVerifiedArtist: false, createdAt: '2025-05-12T10:00:00Z' },
  { id: 'u-artist-8', email: 'krzysztof@kmac.art', role: 'artist', status: 'approved', displayName: 'Krzysztof Marek', avatarUrl: 'https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Malarz pejzażysta. Olej i enkaustyka. Inspiruję się polskim krajobrazem.', location: 'Toruń', specializations: ['Pejzaż', 'Olej', 'Enkaustyka'], yearsExperience: 20, isVerifiedArtist: true, createdAt: '2024-08-05T10:00:00Z' },
  { id: 'u-admin-1', email: 'admin@atelier.pl', role: 'admin', status: 'approved', displayName: 'Administrator', createdAt: '2024-10-01T10:00:00Z' },
];

export const mockClientProfiles: ClientProfile[] = [
  { id: 'cp-1', userId: 'u-client-1', displayName: 'Anna Kowalska', avatarUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Kolekcjonerka sztuki. Urządzam nowy apartament w Warszawie.', location: 'Warszawa', clientType: 'Klient indywidualny', preferredStyles: ['Abstrakcja', 'Współczesny'], createdAt: '2025-03-12T10:00:00Z' },
  { id: 'cp-2', userId: 'u-client-2', displayName: 'Marek Kaczmarek - Studio MK', avatarUrl: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Architekt wnętrz. Realizuję projekty dla klientów indywidualnych i komercyjnych.', location: 'Wrocław', clientType: 'Architekt wnętrz', company: 'Studio MK', nip: '894-123-45-67', preferredStyles: ['Minimalizm', 'Współczesny', 'Abstrakcja'], createdAt: '2025-01-08T10:00:00Z' },
  { id: 'cp-3', userId: 'u-client-3', displayName: 'Hotel Tatry Boutique', avatarUrl: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Butikowy hotel w sercu Tatr. 24 pokoje, lobby, restauracja.', location: 'Zakopane', clientType: 'Firma / Hotel', company: 'Hotel Tatry Boutique Sp. z o.o.', nip: '536-789-01-23', preferredStyles: ['Pejzaż', 'Impresjonistyczny'], createdAt: '2025-02-15T10:00:00Z' },
  { id: 'cp-4', userId: 'u-client-4', displayName: 'Magdalena Borkowska', avatarUrl: 'https://images.pexels.com/photos/1239351/pexels-photo-1239351.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Kolekcjonerka sztuki i architekt wnętrz. Szukam unikatowych prac dla klientów.', location: 'Poznań', clientType: 'Architekt wnętrz', preferredStyles: ['Strukturalne', 'Abstrakcja', 'Tekstura'], createdAt: '2025-04-03T10:00:00Z' },
];

export const mockProfiles: Profile[] = [
  ...mockUsers.map((u) => ({
    id: `pf-${u.id}`,
    userId: u.id,
    role: u.role,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
    bio: u.bio,
    location: u.location,
    createdAt: u.createdAt,
    updatedAt: u.createdAt,
  })),
];

const portfolioArtur: ArtistPortfolioItem[] = [
  { id: 'pa-1', artistId: 'u-artist-1', title: 'Cisza poranka', imageUrl: 'https://images.pexels.com/photos/161154/stained-glass-spiral-circle-pattern-161154.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Akryl na płótnie', year: '2024', widthCm: 120, heightCm: 90, isPublic: true, isForSale: true, price: 4500 },
  { id: 'pa-2', artistId: 'u-artist-1', title: 'Nokturn III', imageUrl: 'https://images.pexels.com/photos/326311/pexels-photo-326311.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Akryl, mieszane media', year: '2024', widthCm: 150, heightCm: 100, isPublic: true, isForSale: false },
  { id: 'pa-3', artistId: 'u-artist-1', title: 'Złoty podział', imageUrl: 'https://images.pexels.com/photos/1145720/pexels-photo-1145720.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Akryl na płótnie', year: '2023', widthCm: 80, heightCm: 80, isPublic: true, isForSale: true, price: 3200 },
];

const portfolioHanna: ArtistPortfolioItem[] = [
  { id: 'ph-1', artistId: 'u-artist-2', title: 'Portret w świetle', imageUrl: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Olej na płótnie', year: '2024', widthCm: 60, heightCm: 80, isPublic: true, isForSale: false },
  { id: 'ph-2', artistId: 'u-artist-2', title: 'Studium dłoni', imageUrl: 'https://images.pexels.com/photos/1192103/pexels-photo-1192103.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Olej na desce', year: '2024', widthCm: 40, heightCm: 50, isPublic: true, isForSale: true, price: 2800 },
  { id: 'ph-3', artistId: 'u-artist-2', title: 'Dziewczyna z kwiatem', imageUrl: 'https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Olej na płótnie', year: '2023', widthCm: 90, heightCm: 110, isPublic: true, isForSale: false },
];

const portfolioKazik: ArtistPortfolioItem[] = [
  { id: 'pk-1', artistId: 'u-artist-3', title: 'Rzeka o świcie', imageUrl: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Akwarela', year: '2024', widthCm: 56, heightCm: 38, isPublic: true, isForSale: true, price: 1200 },
  { id: 'pk-2', artistId: 'u-artist-3', title: 'Stare miasto', imageUrl: 'https://images.pexels.com/photos/466686/pexels-photo-466686.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Olej na płótnie', year: '2024', widthCm: 70, heightCm: 50, isPublic: true, isForSale: false },
  { id: 'pk-3', artistId: 'u-artist-3', title: 'We mgle', imageUrl: 'https://images.pexels.com/photos/268489/pexels-photo-268489.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Akwarela', year: '2023', widthCm: 42, heightCm: 30, isPublic: true, isForSale: true, price: 800 },
];

const portfolioElzbieta: ArtistPortfolioItem[] = [
  { id: 'pe-1', artistId: 'u-artist-4', title: 'Skorupa', imageUrl: 'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Gips, piasek, pigment', year: '2024', widthCm: 100, heightCm: 120, isPublic: true, isForSale: false },
  { id: 'pe-2', artistId: 'u-artist-4', title: 'Warstwy ziemi', imageUrl: 'https://images.pexels.com/photos/1697750/pexels-photo-1697750.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Mieszane media, relief', year: '2024', widthCm: 80, heightCm: 100, isPublic: true, isForSale: true, price: 5500 },
  { id: 'pe-3', artistId: 'u-artist-4', title: 'Kora', imageUrl: 'https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Gips, pigment naturalny', year: '2023', widthCm: 60, heightCm: 80, isPublic: true, isForSale: false },
];

const portfolioPiotr: ArtistPortfolioItem[] = [
  { id: 'pp-1', artistId: 'u-artist-5', title: 'Równoległe', imageUrl: 'https://images.pexels.com/photos/161154/stained-glass-spiral-circle-pattern-161154.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Akryl na płótnie', year: '2024', widthCm: 120, heightCm: 90, isPublic: true, isForSale: true, price: 3800 },
  { id: 'pp-2', artistId: 'u-artist-5', title: 'Minimal IV', imageUrl: 'https://images.pexels.com/photos/326311/pexels-photo-326311.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Akryl na płótnie', year: '2023', widthCm: 100, heightCm: 70, isPublic: true, isForSale: false },
  { id: 'pp-3', artistId: 'u-artist-5', title: 'Geometria ciszy', imageUrl: 'https://images.pexels.com/photos/1145720/pexels-photo-1145720.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Akryl na płótnie', year: '2024', widthCm: 80, heightCm: 80, isPublic: true, isForSale: true, price: 2900 },
];

const portfolioZofia: ArtistPortfolioItem[] = [
  { id: 'pz-1', artistId: 'u-artist-6', title: 'Paproć', imageUrl: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Akwarela', year: '2024', widthCm: 50, heightCm: 70, isPublic: true, isForSale: true, price: 1500 },
  { id: 'pz-2', artistId: 'u-artist-6', title: 'Mchy', imageUrl: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Tusz, akwarela', year: '2024', widthCm: 42, heightCm: 60, isPublic: true, isForSale: false },
  { id: 'pz-3', artistId: 'u-artist-6', title: 'Kalosze', imageUrl: 'https://images.pexels.com/photos/2425567/pexels-photo-2425567.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Akwarela', year: '2023', widthCm: 38, heightCm: 56, isPublic: true, isForSale: true, price: 900 },
];

const portfolioTomasz: ArtistPortfolioItem[] = [
  { id: 'pt-1', artistId: 'u-artist-7', title: 'Fala', imageUrl: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Olej na płótnie', year: '2024', widthCm: 200, heightCm: 150, isPublic: true, isForSale: true, price: 12000 },
  { id: 'pt-2', artistId: 'u-artist-7', title: 'Lustro wody', imageUrl: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Olej na płótnie', year: '2023', widthCm: 180, heightCm: 120, isPublic: true, isForSale: false },
];

const portfolioKrzysztof: ArtistPortfolioItem[] = [
  { id: 'pm-1', artistId: 'u-artist-8', title: 'Wisła o zmierzchu', imageUrl: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Olej, enkaustyka', year: '2024', widthCm: 120, heightCm: 80, isPublic: true, isForSale: true, price: 6800 },
  { id: 'pm-2', artistId: 'u-artist-8', title: 'Bory tucholskie', imageUrl: 'https://images.pexels.com/photos/268489/pexels-photo-268489.jpeg?auto=compress&cs=tinysrgb&w=800', technique: 'Olej na płótnie', year: '2023', widthCm: 100, heightCm: 70, isPublic: true, isForSale: false },
];

const allPortfolio: ArtistPortfolioItem[] = [
  ...portfolioArtur, ...portfolioHanna, ...portfolioKazik, ...portfolioElzbieta,
  ...portfolioPiotr, ...portfolioZofia, ...portfolioTomasz, ...portfolioKrzysztof,
];

export const mockArtistProfiles: ArtistProfile[] = [
  { id: 'ap-1', userId: 'u-artist-1', slug: 'artur-lewandowski', artistName: 'Artur Lewandowski', avatarUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400', coverUrl: 'https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=1600', bio: 'Malarz abstrakcyjny z Krakowa. Pracuję z akrylem i mieszanką mediów od ponad dekady. Moje prace łączą ekspresję koloru z rygorem kompozycji.', location: 'Kraków', styles: ['Abstrakcyjny', 'Ekspresyjny', 'Minimalistyczny'], techniques: ['Akryl', 'Mieszane media', 'Złoto płatkowe'], specializations: ['Abstrakcja', 'Wnętrza', 'Duży format'], priceRangeMin: 3000, priceRangeMax: 12000, averageDeliveryDays: 70, approvalStatus: 'approved', isVerified: true, yearsExperience: 12, website: 'arturlewandowski.art', instagram: '@artur.lewandowski', portfolio: portfolioArtur, stats: { completedProjects: 47, averageRating: 4.9, reviewCount: 38 }, createdAt: '2024-11-20T10:00:00Z' },
  { id: 'ap-2', userId: 'u-artist-2', slug: 'hanna-nowak', artistName: 'Hanna Nowak', avatarUrl: 'https://images.pexels.com/photos/1239351/pexels-photo-1239351.jpeg?auto=compress&cs=tinysrgb&w=400', coverUrl: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=1600', bio: 'Portrecistka i malarz figuratywny. Ukończyłam ASP w Gdańsku. Maluję portrety na zamówienie - od klasycznych studiów po współczesne interpretacje.', location: 'Gdańsk', styles: ['Klasyczny', 'Realistyczny', 'Figuratywny'], techniques: ['Olej', 'Akryl'], specializations: ['Portret', 'Studium postaci', 'Figuratywne'], priceRangeMin: 2500, priceRangeMax: 9000, averageDeliveryDays: 84, approvalStatus: 'approved', isVerified: true, yearsExperience: 8, instagram: '@hanna.nowak.art', portfolio: portfolioHanna, stats: { completedProjects: 31, averageRating: 5.0, reviewCount: 27 }, createdAt: '2024-12-05T10:00:00Z' },
  { id: 'ap-3', userId: 'u-artist-3', slug: 'kazimierz-wojcik', artistName: 'Kazimierz Wójcik', avatarUrl: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=400', coverUrl: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1600', bio: 'Pejzażysta. Akwarela i olej. Maluję w plenerze i w pracowni. Inspiruję się polskim krajobrazem i architekturą miast.', location: 'Poznań', styles: ['Realistyczny', 'Impresjonistyczny'], techniques: ['Akwarela', 'Olej'], specializations: ['Pejzaż', 'Miejskie sceny'], priceRangeMin: 800, priceRangeMax: 4000, averageDeliveryDays: 56, approvalStatus: 'pending', isVerified: false, yearsExperience: 5, portfolio: portfolioKazik, stats: { completedProjects: 12, averageRating: 4.7, reviewCount: 9 }, createdAt: '2025-06-01T10:00:00Z' },
  { id: 'ap-4', userId: 'u-artist-4', slug: 'elzbieta-sokolowska', artistName: 'Elżbieta Sokołowska', avatarUrl: 'https://images.pexels.com/photos/268489/pexels-photo-268489.jpeg?auto=compress&cs=tinysrgb&w=400', coverUrl: 'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=1600', bio: 'Malarz strukturalny i teksturalny. Pracuję z gipsem, piaskiem i pigmentami naturalnymi. Tworzę reliefy i obrazy przestrzenne.', location: 'Łódź', styles: ['Strukturalny', 'Abstrakcyjny', 'Teksturalny'], techniques: ['Gips', 'Piasek', 'Pigment naturalny', 'Mieszane media'], specializations: ['Strukturalne', 'Tekstura', 'Relief'], priceRangeMin: 3500, priceRangeMax: 14000, averageDeliveryDays: 90, approvalStatus: 'approved', isVerified: true, yearsExperience: 15, website: 'elzbieta-sokolowska.art', portfolio: portfolioElzbieta, stats: { completedProjects: 52, averageRating: 4.8, reviewCount: 41 }, createdAt: '2024-10-15T10:00:00Z' },
  { id: 'ap-5', userId: 'u-artist-5', slug: 'piotr-zalewski', artistName: 'Piotr Zalewski', avatarUrl: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=400', coverUrl: 'https://images.pexels.com/photos/161154/stained-glass-spiral-circle-pattern-161154.jpeg?auto=compress&cs=tinysrgb&w=1600', bio: 'Malarz wnętrz. Abstrakcja geometryczna i minimalizm. Pracuję z architektami i projektantami wnętrz.', location: 'Warszawa', styles: ['Geometryczny', 'Minimalistyczny', 'Abstrakcyjny'], techniques: ['Akryl', 'Tusz'], specializations: ['Geometria', 'Minimalizm', 'Wnętrza komercyjne'], priceRangeMin: 2500, priceRangeMax: 8000, averageDeliveryDays: 60, approvalStatus: 'approved', isVerified: true, yearsExperience: 10, website: 'piotrzalewski.art', portfolio: portfolioPiotr, stats: { completedProjects: 39, averageRating: 4.9, reviewCount: 31 }, createdAt: '2024-09-10T10:00:00Z' },
  { id: 'ap-6', userId: 'u-artist-6', slug: 'zofia-kaminska', artistName: 'Zofia Kamińska', avatarUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400', coverUrl: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=1600', bio: 'Botaniczne i organiczne kompozycje. Akwarela i tusz. Inspiruję się światem roślin i mikrokrajobrazami.', location: 'Kraków', styles: ['Botaniczny', 'Organiczny', 'Ilustracyjny'], techniques: ['Akwarela', 'Tusz'], specializations: ['Botaniczne', 'Organiczne', 'Miniatura'], priceRangeMin: 600, priceRangeMax: 3000, averageDeliveryDays: 42, approvalStatus: 'approved', isVerified: true, yearsExperience: 7, instagram: '@zofia.kaminska.art', portfolio: portfolioZofia, stats: { completedProjects: 28, averageRating: 4.9, reviewCount: 22 }, createdAt: '2025-01-20T10:00:00Z' },
  { id: 'ap-7', userId: 'u-artist-7', slug: 'tomasz-wolski', artistName: 'Tomasz Wolski', avatarUrl: 'https://images.pexels.com/photos/1145720/pexels-photo-1145720.jpeg?auto=compress&cs=tinysrgb&w=400', coverUrl: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=1600', bio: 'Malarz hiperrealistyczny. Pracuję z olejem i akrylem w dużej skali. Tematyka: woda, szkło, metal.', location: 'Sopot', styles: ['Hiperrealistyczny', 'Fotorealizmus'], techniques: ['Olej', 'Akryl'], specializations: ['Hiperrealizm', 'Duży format'], priceRangeMin: 8000, priceRangeMax: 30000, averageDeliveryDays: 120, approvalStatus: 'pending', isVerified: false, yearsExperience: 18, portfolio: portfolioTomasz, stats: { completedProjects: 19, averageRating: 5.0, reviewCount: 14 }, createdAt: '2025-05-12T10:00:00Z' },
  { id: 'ap-8', userId: 'u-artist-8', slug: 'krzysztof-marek', artistName: 'Krzysztof Marek', avatarUrl: 'https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg?auto=compress&cs=tinysrgb&w=400', coverUrl: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1600', bio: 'Malarz pejzażysta. Olej i enkaustyka. Inspiruję się polskim krajobrazem - od Bałtyku po Tatry.', location: 'Toruń', styles: ['Realistyczny', 'Impresjonistyczny', 'Klasyczny'], techniques: ['Olej', 'Enkaustyka'], specializations: ['Pejzaż', 'Krajobraz polski'], priceRangeMin: 3000, priceRangeMax: 12000, averageDeliveryDays: 75, approvalStatus: 'approved', isVerified: true, yearsExperience: 20, website: 'krzysztofmarek.art', portfolio: portfolioKrzysztof, stats: { completedProjects: 63, averageRating: 4.8, reviewCount: 52 }, createdAt: '2024-08-05T10:00:00Z' },
];

export const mockArtistPortfolioItems: ArtistPortfolioItem[] = [...allPortfolio];

export const mockCommissions: CommissionRequest[] = [
  {
    id: 'c-1', slug: 'obraz-abstrakcyjny-do-salonu', title: 'Obraz abstrakcyjny do salonu 180×120',
    clientId: 'u-client-1', clientName: 'Anna Kowalska', status: 'offers_open',
    publicSummary: 'Szukam dużego obrazu abstrakcyjnego w ciepłych tonach do nowoczesnego salonu. Płótno 180×120 cm, akryl lub mieszane media.',
    privateDescription: 'Urzekam obrazu, który stanie się sercem salonu - kompozycja abstrakcyjna w ciepłych tonach beżu, złamanej bieli, złota i grafitu. Płótno ma 180×120 cm i będzie wisieć nad kominkiem. Wnętrze: jasne dębowe podłogi, ściany w kolorze ivory, meble w odcieniach ciepłego grafitu i naturalnego lnu. Chciałabym, aby obraz wprowadził ruch i głębię, ale nie dominował przestrzeni. Inspiruję się pracami Cy Twombly i Anselma Kiefera - ale w lżejszej, bardziej wnętrzarskiej wersji. Zależy mi na unikatowej teksturze - impasto, warstwowanie. Obraz ma być jedyny w swoim rodzaju.',
    roomType: 'salon', intendedUse: 'mieszkalne', style: 'Abstrakcyjny', mood: 'Ciepły, spokojny, z ruchem',
    preferredColors: ['Beżowy', 'Ivory', 'Złoty', 'Grafitowy'], colorsToAvoid: ['Czerwień', 'Neonowe'],
    widthCm: 180, heightCm: 120, orientation: 'landscape',
    budgetMin: 4000, budgetMax: 8000, deadline: '2025-12-15', location: 'Warszawa',
    frameRequired: false, deliveryRequired: true,
    attachments: [],
    interiorImages: [],
    inspirationImages: [
      '/abstract-painting-inspiration.webp',
      '/hero-inspiration-1.webp',
      '/hero-inspiration-2.webp',
    ],
    tags: ['Abstrakcja', 'Wnętrza', 'Duży format', 'Tekstura'], medium: 'Akryl, mieszane media',
    createdAt: '2025-07-20T14:00:00Z', updatedAt: '2025-07-20T14:00:00Z',
    views: 234, commentsCount: 4, offersCount: 3,
  },
  {
    id: 'c-2', slug: 'obraz-do-sypialni-bez-i-blekit', title: 'Obraz do sypialni w kolorach beż i błękit',
    clientId: 'u-client-1', clientName: 'Anna Kowalska', status: 'offers_open',
    publicSummary: 'Delikatny obraz do sypialni w beżach i błękitach. Format 100×80 cm, spokojna atmosfera.',
    privateDescription: 'Szukam obrazu, który stworzy w sypialni atmosferę odpoczynku - beże, piaskowe tony, delikatny błękit, może mgliście białe przejścia. Format 100×80 cm, orientacja pionowa. Wnętrze: dębowy parkiet, ściany w kolorze kości słoniowej, pościel w odcieniach lnu i błękitu. Chciałabym uniknąć ostrego kontrastu - obraz ma być tłem dla relaksu, nie dominować. Inspiruję się pracami Marka Rothko, ale w pastelowej wersji. Zależy mi na miękkich przejściach, może lekka tekstura impasto. Obraz nad łóżkiem.',
    roomType: 'sypialnia', intendedUse: 'mieszkalne', style: 'Abstrakcyjny, minimalistyczny', mood: 'Spokojny, relaksujący, mglisty',
    preferredColors: ['Beżowy', 'Błękitny', 'Piaskowy', 'Ivory'], colorsToAvoid: ['Czerń', 'Czerwień', 'Żółty'],
    widthCm: 100, heightCm: 80, orientation: 'portrait',
    budgetMin: 2000, budgetMax: 5000, deadline: '2025-11-01', location: 'Warszawa',
    frameRequired: true, deliveryRequired: true,
    attachments: [],
    interiorImages: [],
    inspirationImages: [
      'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/326311/pexels-photo-326311.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['Sypialnia', 'Abstrakcja', 'Pastel', 'Minimalizm'], medium: 'Akryl, olej',
    createdAt: '2025-07-22T11:00:00Z', updatedAt: '2025-07-22T11:00:00Z',
    views: 156, commentsCount: 2, offersCount: 2,
  },
  {
    id: 'c-3', slug: 'duzy-obraz-do-apartamentu-pokazowego', title: 'Duży obraz do apartamentu pokazowego',
    clientId: 'u-client-2', clientName: 'Marek Kaczmarek - Studio MK', status: 'offers_open',
    publicSummary: 'Duży format 200×150 cm do apartamentu pokazowego. Abstrakcja lub pół-abstrakcja, elegancka paleta.',
    privateDescription: 'Zlecam duży obraz (200×150 cm) do apartamentu pokazowego w nowym deweloperskim projekcie we Wrocławiu. Obraz ma być wizytówką apartamentu - przyciągać uwagę kupujących, ale jednocześnie wpisywać się w estetykę premium. Wnętrze: jasne podłogi, ściany w kolorze warm white, kuchnia w antracycie i dębie, meble w grafitach i lnie. Paleta: grafit, antracyt, ciepły beż, złamana biel, ewentualnie akcent miedzi. Abstrakcja lub pół-abstrakcja z elementami geometrii. Obraz ma wyglądać jak w galerii sztuki. Inspiracja: Gerhard Richter, PIet Mondrian w luźnej wersji. Potrzebuję zdjęć do materiałów marketingowych dewelopera.',
    roomType: 'salon', intendedUse: 'komercyjne', style: 'Abstrakcja, geometria', mood: 'Elegancki, galeriowy, premium',
    preferredColors: ['Grafitowy', 'Antracyt', 'Ciepły beż', 'Złamana biel', 'Miedź'], colorsToAvoid: ['Zieleń', 'Niebieski', 'Różowy'],
    widthCm: 200, heightCm: 150, orientation: 'landscape',
    budgetMin: 8000, budgetMax: 18000, deadline: '2026-01-31', location: 'Wrocław',
    frameRequired: false, deliveryRequired: true,
    attachments: [],
    interiorImages: [],
    inspirationImages: [
      'https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/161154/stained-glass-spiral-circle-pattern-161154.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['Duży format', 'Apartament', 'Premium', 'Geometria', 'Deweloper'], medium: 'Akryl, mieszane media',
    createdAt: '2025-07-25T09:00:00Z', updatedAt: '2025-07-25T09:00:00Z',
    views: 289, commentsCount: 3, offersCount: 2,
  },
  {
    id: 'c-4', slug: 'seria-obrazow-do-hotelu', title: 'Seria obrazów do hotelu - 24 pokoje',
    clientId: 'u-client-3', clientName: 'Hotel Tatry Boutique', status: 'published',
    publicSummary: 'Seria 24 obrazów (60×80 cm każdy) do pokoi butikowego hotelu. Tematyka górska, spójna paleta.',
    privateDescription: 'Dla butikowego hotelu w Zakopanem potrzebuję serii 24 obrazów - każdy 60×80 cm, do pokoi gościnnych. Tematyka: Tatry - szczyty, doliny, mgły, lasy, potoki. Każdy obraz inny, ale seria musi być spójna kompozycyjnie i kolorystycznie - gość nie powinien czuć, że obrazy są przypadkowe. Paleta: szarości, zgaszona zieleń, mgliście białe tła, ewentualnie delikatne złoto w wybranych pracach. Technika: olej lub akryl. Werniks UV-odporny konieczny ze względu na oświetlenie hotelowe. Obrazy mają budować spokojny, górski nastrój. Inspiracja: malarstwo norweskie XIX w. we współczesnym wydaniu. Potrzebuję próbki 3 prac przed pełną realizacją.',
    roomType: 'hotel', intendedUse: 'komercyjne', style: 'Pejzaż, impresjonistyczny', mood: 'Spokojny, górski, kontemplatywny',
    preferredColors: ['Szary', 'Zgaszona zieleń', 'Mglista biel', 'Złoto'], colorsToAvoid: ['Czerwień', 'Pomarańczowy', 'Żółty'],
    widthCm: 60, heightCm: 80, orientation: 'portrait',
    budgetMin: 18000, budgetMax: 36000, deadline: '2026-04-30', location: 'Zakopane',
    frameRequired: true, deliveryRequired: true,
    attachments: [],
    interiorImages: [],
    inspirationImages: [
      'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/268489/pexels-photo-268489.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/466686/pexels-photo-466686.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['Pejzaż', 'Seria', 'Hotel', 'Góry', 'Duży projekt'], medium: 'Olej lub akryl',
    createdAt: '2025-07-28T16:00:00Z', updatedAt: '2025-07-28T16:00:00Z',
    views: 412, commentsCount: 7, offersCount: 5,
  },
  {
    id: 'c-5', slug: 'obraz-do-biura-kancelarii', title: 'Obraz do biura kancelarii prawnej',
    clientId: 'u-client-2', clientName: 'Marek Kaczmarek - Studio MK', status: 'offers_open',
    publicSummary: 'Obraz do recepcji kancelarii prawnej. Format 150×100 cm, elegancki, stonowany, budzący zaufanie.',
    privateDescription: 'Kancelaria prawna we Wrocławiu potrzebuje obrazu do recepcji - pierwsze wrażenie klientów. Format 150×100 cm, orientacja pozioma. Wnętrze: ciemne drewno, skóra, ściany w warm white, podłoga w ciemnym kamieniu. Obraz ma budzić zaufanie, stabilność i elegancję - bez agresji, ale z obecnością. Paleta: ciemny grafit, stalowy szary, złamana biel, akcent ciemnego złota lub miedzi. Abstrakcja geometryczna lub strukturalna. Inspiracja: Sean Scully, Pierre Soulages. Zależy mi na powierzchni, która reaguje na światło - może werniks satynowy z elementami matowymi.',
    roomType: 'biuro', intendedUse: 'komercyjne', style: 'Abstrakcja, geometryczny', mood: 'Elegancki, stabilny, budzący zaufanie',
    preferredColors: ['Ciemny grafit', 'Stalowy szary', 'Złamana biel', 'Złoto', 'Miedź'], colorsToAvoid: ['Zieleń', 'Błękit', 'Różowy'],
    widthCm: 150, heightCm: 100, orientation: 'landscape',
    budgetMin: 5000, budgetMax: 12000, deadline: '2026-02-15', location: 'Wrocław',
    frameRequired: true, deliveryRequired: true,
    attachments: [],
    interiorImages: [],
    inspirationImages: [
      'https://images.pexels.com/photos/326311/pexels-photo-326311.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/161154/stained-glass-spiral-circle-pattern-161154.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['Biuro', 'Kancelaria', 'Abstrakcja', 'Geometria', 'Premium'], medium: 'Akryl, mieszane media',
    createdAt: '2025-07-30T10:00:00Z', updatedAt: '2025-07-30T10:00:00Z',
    views: 178, commentsCount: 1, offersCount: 2,
  },
  {
    id: 'c-6', slug: 'obraz-dla-architekta-wnetrz', title: 'Obraz dla architekta wnętrz - projekt loft',
    clientId: 'u-client-4', clientName: 'Magdalena Borkowska', status: 'offers_open',
    publicSummary: 'Obraz do projektu loftu industrialnego. Format 120×160 cm, surowa tekstura, graficzna paleta.',
    privateDescription: 'Realizuję projekt loftu industrialnego dla klienta i potrzebuję obrazu, który wpisze się w estetykę surowego betonu, stali i drewna. Format 120×160 cm, orientacja pionowa. Wnętrze: beton architecturalny, podłoga zającem, ściany w surowym betonie i cegle, meble w stalowym szarym i czarnym. Obraz ma nawiązywać do surowości materiałów - tekstura betonu, ślady, faktura, może elementy graficzne lub typograficzne. Paleta: grafit, czerń, rdzawy brąz, stalowy szary, złamana biel. Technika: mieszane media, gips, może pigmenty. Inspiracja: Anselm Kiefer, Antoni Tàpies. Obraz ma wyglądać jakby był częścią ściany, nie obrazem na ścianie.',
    roomType: 'salon', intendedUse: 'komercyjne', style: 'Strukturalny, industrialny', mood: 'Surowy, graficzny, industrialny',
    preferredColors: ['Grafit', 'Czerń', 'Rdzawy brąz', 'Stalowy szary', 'Złamana biel'], colorsToAvoid: ['Błękit', 'Zieleń', 'Różowy'],
    widthCm: 120, heightCm: 160, orientation: 'portrait',
    budgetMin: 4000, budgetMax: 10000, deadline: '2026-03-15', location: 'Poznań',
    frameRequired: false, deliveryRequired: true,
    attachments: [],
    interiorImages: [],
    inspirationImages: [
      'https://images.pexels.com/photos/1697750/pexels-photo-1697750.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['Loft', 'Industrialny', 'Strukturalny', 'Tekstura', 'Architekt'], medium: 'Mieszane media, gips',
    createdAt: '2025-08-01T12:00:00Z', updatedAt: '2025-08-01T12:00:00Z',
    views: 203, commentsCount: 2, offersCount: 3,
  },
  {
    id: 'c-7', slug: 'obraz-na-prezent-slubny', title: 'Obraz na prezent ślubny - para',
    clientId: 'u-client-1', clientName: 'Anna Kowalska', status: 'offers_open',
    publicSummary: 'Obraz na prezent ślubny dla pary młodej. Format 50×70 cm, romantyczny, spersonalizowany.',
    privateDescription: 'Szukam obrazu na prezent ślubny dla przyjaciółki. Para ceni sztukę i wnętrza. Format 50×70 cm, orientacja pionowa. Temat: abstrakcyjna kompozycja nawiązująca do relacji - dwa żywioły łączące się w jedną formę. Paleta: ciepłe tony - beż, złamana róż, złoto, ivory. Mood: romantyczny, delikatny, ale z głębią. Chciałabym, aby na odwrocie był podpis i data ślubu. Inspiracja: abstrakcje Hilmy af Klint, ale w ciepłej palecie. Obraz ma być pamiątką na całe życie, nie dekoracją. Budget: mniejszy, bo to prezent.',
    roomType: 'inne', intendedUse: 'prezent', style: 'Abstrakcyjny, romantyczny', mood: 'Romantyczny, delikatny, z głębią',
    preferredColors: ['Beżowy', 'Złamana róż', 'Złoto', 'Ivory'], colorsToAvoid: ['Czerń', 'Neonowe', 'Czerwień'],
    widthCm: 50, heightCm: 70, orientation: 'portrait',
    budgetMin: 1000, budgetMax: 2500, deadline: '2025-10-20', location: 'Warszawa',
    frameRequired: true, deliveryRequired: true,
    attachments: [],
    interiorImages: [],
    inspirationImages: [
      'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['Prezent', 'Ślub', 'Romantyczny', 'Abstrakcja', 'Mały format'], medium: 'Akryl, akwarela',
    createdAt: '2025-08-02T08:00:00Z', updatedAt: '2025-08-02T08:00:00Z',
    views: 134, commentsCount: 1, offersCount: 2,
  },
  {
    id: 'c-8', slug: 'obraz-strukturalny-do-nowoczesnego-wnetrza', title: 'Obraz strukturalny do nowoczesnego wnętrza',
    clientId: 'u-client-4', clientName: 'Magdalena Borkowska', status: 'offers_open',
    publicSummary: 'Obraz strukturalny 100×120 cm do nowoczesnego wnętrza. Tekstura, relief, naturalne pigmenty.',
    privateDescription: 'Dla klientki projektującej nowoczesny dom potrzebuję obrazu strukturalnego, który stanie się dominantą jadalni. Format 100×120 cm. Wnętrze: jasne dębowe podłogi, ściany w warm white, stół z litego dębu, krzesła w czerni i lnie. Obraz ma mieć wyraźną teksturę - relief, warstwy, może elementy organiczne (kora, piasek, pigmenty naturalne). Paleta: naturalne tony - beż, piaskowy, brąz, złamana biel, ewentualnie akcent złota. Technika: gips, piasek, pigment, mieszane media. Inspiracja: Antoni Tàpies, Anselm Kiefer, ale w lżejszej palecie. Obraz ma być dotykalny - chcę, by tekstura była zaproszeniem do interakcji. Werniks matowy.',
    roomType: 'jadalnia', intendedUse: 'mieszkalne', style: 'Strukturalny, teksturalny', mood: 'Naturalny, organiczny, dotykalny',
    preferredColors: ['Beżowy', 'Piaskowy', 'Brąz', 'Złamana biel', 'Złoto'], colorsToAvoid: ['Czerwień', 'Błękit', 'Zieleń'],
    widthCm: 100, heightCm: 120, orientation: 'portrait',
    budgetMin: 3500, budgetMax: 8000, deadline: '2026-01-15', location: 'Poznań',
    frameRequired: false, deliveryRequired: true,
    attachments: [],
    interiorImages: [],
    inspirationImages: [
      'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1697750/pexels-photo-1697750.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['Strukturalny', 'Tekstura', 'Relief', 'Jadalnia', 'Naturalne'], medium: 'Gips, piasek, pigment, mieszane media',
    createdAt: '2025-08-03T14:00:00Z', updatedAt: '2025-08-03T14:00:00Z',
    views: 167, commentsCount: 0, offersCount: 1,
  },
];

export const mockCommissionAttachments: CommissionAttachment[] = [];

export const mockComments: CommissionComment[] = [
  { id: 'cm-1', commissionId: 'c-1', authorId: 'u-artist-1', authorName: 'Artur Lewandowski', authorRole: 'artist', authorAvatarUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200', body: 'Cześć Anna, czy płótno ma być naciągnięte na krosno standardowe czy grube (gallery wrap)? I czy preferujesz werniks satynowy czy matowy?', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-07-21T10:30:00Z' },
  { id: 'cm-2', commissionId: 'c-1', authorId: 'u-client-1', authorName: 'Anna Kowalska', authorRole: 'client', body: 'Gallery wrap, werniks satynowy. Chciałabym uniknąć wysokiego połysku - zależy mi na głębi bez refleksów.', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-07-21T14:15:00Z' },
  { id: 'cm-3', commissionId: 'c-1', authorId: 'u-artist-2', authorName: 'Hanna Nowak', authorRole: 'artist', authorAvatarUrl: 'https://images.pexels.com/photos/1239351/pexels-photo-1239351.jpeg?auto=compress&cs=tinysrgb&w=200', body: 'Czy jesteś otwarta na złoto płatkowe jako akcent? Mogę zacytować podobną pracę z mojego portfolio.', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-07-22T09:00:00Z' },
  { id: 'cm-4', commissionId: 'c-1', authorId: 'u-artist-1', authorName: 'Artur Lewandowski', authorRole: 'artist', authorAvatarUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200', body: 'Dodałem zdjęcie próbki tekstury, którą proponuję dla tej skali.', attachments: [{ id: 'cma-1', commentId: 'cm-4', url: 'https://images.pexels.com/photos/326311/pexels-photo-326311.jpeg?auto=compress&cs=tinysrgb&w=600', filename: 'probka-textury.jpg', mimeType: 'image/jpeg' }], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-07-22T16:45:00Z' },
  { id: 'cm-5', commissionId: 'c-4', authorId: 'u-artist-3', authorName: 'Kazimierz Wójcik', authorRole: 'artist', authorAvatarUrl: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=200', body: 'Mam doświadczenie z Tatrami - maluję w plenerze. Czy byłaby otwartość do pracy z autentycznych szkiców w terenie?', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-07-29T08:20:00Z' },
  { id: 'cm-6', commissionId: 'c-4', authorId: 'u-client-3', authorName: 'Hotel Tatry Boutique', authorRole: 'client', body: 'Tak, plener bardzo mile widziany. To dodatkowo podniesie autentyczność dla gości hotelu.', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-07-29T13:00:00Z' },
  { id: 'cm-7', commissionId: 'c-4', authorId: 'u-artist-1', authorName: 'Artur Lewandowski', authorRole: 'artist', authorAvatarUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200', body: 'Dla lobby tego formatu proponowałbym dodatkowo werniks UV-odporny - hotelowe oświetlenie ma wysokie UV. Mogę wliczyć to w ofertę.', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-07-30T11:10:00Z' },
  { id: 'cm-8', commissionId: 'c-3', authorId: 'u-artist-5', authorName: 'Piotr Zalewski', authorRole: 'artist', authorAvatarUrl: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=200', body: 'Geometria w tej palecie to moje pole. Mam doświadczenie z projektami deweloperskimi - mogę dostarczyć render 3D przed realizacją.', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-07-26T10:00:00Z' },
  { id: 'cm-9', commissionId: 'c-6', authorId: 'u-artist-4', authorName: 'Elżbieta Sokołowska', authorRole: 'artist', authorAvatarUrl: 'https://images.pexels.com/photos/268489/pexels-photo-268489.jpeg?auto=compress&cs=tinysrgb&w=200', body: 'Loft industrialny i tekstura to moje główne pole. Proponuję gips z pigmentem i elementami stali. Mogę zrobić próbkę 30×30 cm do akceptacji.', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-08-02T09:00:00Z' },
  { id: 'cm-10', commissionId: 'c-7', authorId: 'u-artist-6', authorName: 'Zofia Kamińska', authorRole: 'artist', authorAvatarUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200', body: 'Obraz na prezent ślubny to piękny projekt. Pracuję w akwareli i tuszu - mogę stworzyć organiczną kompozycję z personalizacją. Podpis i data na odwrocie oczywiste.', attachments: [], isPublic: false, isHidden: false, commentType: 'general', createdAt: '2025-08-02T15:00:00Z' },
];

export const mockOffers: CommissionOffer[] = [
  { id: 'o-1', commissionId: 'c-1', artistId: 'u-artist-1', artistName: 'Artur Lewandowski', artistAvatarUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200', artistSlug: 'artur-lewandowski', message: 'Zaproponuję kompozycję w trzech warstwach - grunt teksturalny, środkowa warstwa impasto w beżach i ivory, a wierzchnia warstwa złota płatkowego i grafitowych linii. Pracuję nad formatem 180×120 od szkicu przez 3 studia kolorystyczne do finalnej realizacji. W cenie: materiały, werniks UV, certyfikat autentyczności. Termin: 10 tygodni od zaliczki. Współpracuję z ramiarzem w Krakowie - mogę zorganizować oprawę i transport.', price: 6800, estimatedDays: 70, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['pa-1', 'pa-2', 'pa-3'], status: 'submitted', createdAt: '2025-07-23T10:00:00Z' },
  { id: 'o-2', commissionId: 'c-1', artistId: 'u-artist-2', artistName: 'Hanna Nowak', artistAvatarUrl: 'https://images.pexels.com/photos/1239351/pexels-photo-1239351.jpeg?auto=compress&cs=tinysrgb&w=200', artistSlug: 'hanna-nowak', message: 'Chętnie podejmę się tego zlecenia. Pracuję z akrylem i złotem płatkowym - w portfolio mam serię, która pokazuje moje podejście do tekstury. Zaproponuję lżejszą, bardziej przestrzenną kompozycję. Termin 8 tygodni. Materiały wliczone, transport do ustalenia.', price: 5200, estimatedDays: 56, includesMaterials: true, includesShipping: false, includesFrame: false, depositPercent: 40, portfolioRefs: ['ph-1', 'ph-3'], status: 'submitted', createdAt: '2025-07-24T12:00:00Z' },
  { id: 'o-3', commissionId: 'c-1', artistId: 'u-artist-3', artistName: 'Kazimierz Wójcik', artistAvatarUrl: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=200', artistSlug: 'kazimierz-wojcik', message: 'Moja specjalizacja to pejzaż i akwarela, ale chętnie podejmę wyzwanie abstrakcji w większym formacie. Pracę zrealizuję w akrylu z elementami akwarelowymi. Cena zawiera materiały. Termin 9 tygodni.', price: 4200, estimatedDays: 63, includesMaterials: true, includesShipping: false, includesFrame: false, depositPercent: 40, portfolioRefs: ['pk-1', 'pk-2'], status: 'submitted', createdAt: '2025-07-25T15:00:00Z' },
  { id: 'o-4', commissionId: 'c-2', artistId: 'u-artist-2', artistName: 'Hanna Nowak', artistAvatarUrl: 'https://images.pexels.com/photos/1239351/pexels-photo-1239351.jpeg?auto=compress&cs=tinysrgb&w=200', artistSlug: 'hanna-nowak', message: 'Sypialnia w beżach i błękitach - to mój klimat. Pracuję olejnie z miękkimi przejściami. Zaproponuję kompozycję w duchu Rothko w pastelowej wersji. Termin 6 tygodni, oprawa wliczona.', price: 3800, estimatedDays: 42, includesMaterials: true, includesShipping: true, includesFrame: true, depositPercent: 40, portfolioRefs: ['ph-1', 'ph-3'], status: 'submitted', createdAt: '2025-07-23T11:00:00Z' },
  { id: 'o-5', commissionId: 'c-3', artistId: 'u-artist-1', artistName: 'Artur Lewandowski', artistAvatarUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200', artistSlug: 'artur-lewandowski', message: 'Format 200×150 do apartamentu pokazowego to wyzwanie, które podejmę z energią. Geometria i abstrakcja w palecie grafit/antracyt/beż/miedź. W cenie: materiały, werniks UV, certyfikaty, transport i instalacja. Termin 12 tygodni.', price: 14500, estimatedDays: 84, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['pa-1', 'pa-2', 'pa-3'], status: 'submitted', createdAt: '2025-07-26T10:00:00Z' },
  { id: 'o-6', commissionId: 'c-3', artistId: 'u-artist-5', artistName: 'Piotr Zalewski', artistAvatarUrl: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=200', artistSlug: 'piotr-zalewski', message: 'Abstrakcja geometryczna w tej palecie to moje główne pole. Mam doświadczenie z projektami deweloperskimi - dostarczę render 3D przed realizacją. W cenie: materiały, werniks UV, transport. Termin 10 tygodni.', price: 12000, estimatedDays: 70, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['pp-1', 'pp-3'], status: 'submitted', createdAt: '2025-07-27T14:00:00Z' },
  { id: 'o-7', commissionId: 'c-4', artistId: 'u-artist-1', artistName: 'Artur Lewandowski', artistAvatarUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200', artistSlug: 'artur-lewandowski', message: 'Seria 24 obrazów do hotelu to ambitny projekt. Proponuję spójną serię pół-abstrakcyjnych pejzaży górskich. 3 próbki przed pełną realizacją. Werniks UV-odporny wliczony. Termin 16 tygodni. Transport i instalacja w Zakopanem wliczone.', price: 32000, estimatedDays: 112, includesMaterials: true, includesShipping: true, includesFrame: true, depositPercent: 30, portfolioRefs: ['pa-1', 'pa-2'], status: 'submitted', createdAt: '2025-07-30T10:00:00Z' },
  { id: 'o-8', commissionId: 'c-4', artistId: 'u-artist-8', artistName: 'Krzysztof Marek', artistAvatarUrl: 'https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg?auto=compress&cs=tinysrgb&w=200', artistSlug: 'krzysztof-marek', message: 'Tatry to moja specjalność. Maluję w plenerze i w pracowni. Seria 24 prac w oleju z enkaustyczną. Spójna paleta, każdy obraz inny ale rozpoznawalnie z tej serii. Termin 18 tygodni. Próbki 3 prac w cenie.', price: 28000, estimatedDays: 126, includesMaterials: true, includesShipping: true, includesFrame: true, depositPercent: 30, portfolioRefs: ['pm-1', 'pm-2'], status: 'submitted', createdAt: '2025-07-31T09:00:00Z' },
  { id: 'o-9', commissionId: 'c-5', artistId: 'u-artist-5', artistName: 'Piotr Zalewski', artistAvatarUrl: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=200', artistSlug: 'piotr-zalewski', message: 'Kancelaria prawna - geometria budująca zaufanie. Proponuję kompozycję w duchu Soulages w palecie grafit/stalowy/miedź. Werniks z elementami matowymi dla gry światłem. Termin 10 tygodni, oprawa wliczona.', price: 8500, estimatedDays: 70, includesMaterials: true, includesShipping: true, includesFrame: true, depositPercent: 40, portfolioRefs: ['pp-1', 'pp-2'], status: 'submitted', createdAt: '2025-07-31T14:00:00Z' },
  { id: 'o-10', commissionId: 'c-6', artistId: 'u-artist-4', artistName: 'Elżbieta Sokołowska', artistAvatarUrl: 'https://images.pexels.com/photos/268489/pexels-photo-268489.jpeg?auto=compress&cs=tinysrgb&w=200', artistSlug: 'elzbieta-sokolowska', message: 'Loft industrialny i tekstura - to moje pole. Proponuję gips z pigmentem, elementami stali i śladami. Obraz jako część ściany, nie na ścianie. Próbka 30×30 cm do akceptacji przed realizacją. Termin 12 tygodni.', price: 7500, estimatedDays: 84, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['pe-1', 'pe-2'], status: 'submitted', createdAt: '2025-08-02T10:00:00Z' },
  { id: 'o-11', commissionId: 'c-7', artistId: 'u-artist-6', artistName: 'Zofia Kamińska', artistAvatarUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200', artistSlug: 'zofia-kaminska', message: 'Obraz na prezent ślubny - to piękły projekt. Organiczna kompozycja akwarela + tusz, dwa żywioły łączące się. Personalizacja: podpis i data na odwrocie. Termin 5 tygodni. Oprawa wliczona.', price: 1800, estimatedDays: 35, includesMaterials: true, includesShipping: true, includesFrame: true, depositPercent: 50, portfolioRefs: ['pz-1', 'pz-2'], status: 'submitted', createdAt: '2025-08-02T16:00:00Z' },
  { id: 'o-12', commissionId: 'c-8', artistId: 'u-artist-4', artistName: 'Elżbieta Sokołowska', artistAvatarUrl: 'https://images.pexels.com/photos/268489/pexels-photo-268489.jpeg?auto=compress&cs=tinysrgb&w=200', artistSlug: 'elzbieta-sokolowska', message: 'Obraz strukturalny do jadalni - naturalne pigmenty, gips, piasek. Relief dotykalny, werniks matowy. Próbka 30×30 cm do akceptacji. Termin 10 tygodni.', price: 5800, estimatedDays: 70, includesMaterials: true, includesShipping: true, includesFrame: false, depositPercent: 40, portfolioRefs: ['pe-1', 'pe-2', 'pe-3'], status: 'submitted', createdAt: '2025-08-03T16:00:00Z' },
];

const milestonesP1: CommissionMilestone[] = [
  { id: 'm-1', projectId: 'p-1', title: 'Szkice kompozycyjne', description: '3 warianty kompozycji do wyboru przez zlecającego', sortOrder: 1, status: 'done', dueDate: '2025-08-10', completedAt: '2025-08-09' },
  { id: 'm-2', projectId: 'p-1', title: 'Studium kolorystyczne', description: 'Próbki palety i tekstury na małych formatach', sortOrder: 2, status: 'done', dueDate: '2025-08-20', completedAt: '2025-08-18' },
  { id: 'm-3', projectId: 'p-1', title: 'Warstwa gruntowa', description: 'Nałożenie gruntu teksturalnego na płótno', sortOrder: 3, status: 'in_progress', dueDate: '2025-08-30' },
  { id: 'm-4', projectId: 'p-1', title: 'Warstwa środkowa - impasto', description: 'Główna kompozycja w beżach i ivory', sortOrder: 4, status: 'pending', dueDate: '2025-09-20' },
  { id: 'm-5', projectId: 'p-1', title: 'Warstwa wierzchnia - złoto i grafit', description: 'Akcenty złota płatkowego i linie grafitowe', sortOrder: 5, status: 'pending', dueDate: '2025-10-01' },
  { id: 'm-6', projectId: 'p-1', title: 'Werniks i certyfikat', description: 'Nałożenie werniksu UV, certyfikat autentyczności', sortOrder: 6, status: 'pending', dueDate: '2025-10-08' },
];

const paymentsP1: CommissionPayment[] = [
  { id: 'pay-1', projectId: 'p-1', type: 'deposit', amount: 2720, percentOfTotal: 40, status: 'paid', dueDate: '2025-08-01', paidAt: '2025-08-01T12:00:00Z' },
  { id: 'pay-2', projectId: 'p-1', type: 'final', amount: 4080, percentOfTotal: 60, status: 'pending', dueDate: '2025-10-10' },
];

const milestonesP2: CommissionMilestone[] = [
  { id: 'm-7', projectId: 'p-2', title: 'Sesja referencyjna', description: 'Sesja fotograficzna pary - referencje dla portretu', sortOrder: 1, status: 'done', dueDate: '2025-08-05', completedAt: '2025-08-04' },
  { id: 'm-8', projectId: 'p-2', title: 'Studium wstępne', description: '2 studia kompozycyjne do akceptacji', sortOrder: 2, status: 'in_progress', dueDate: '2025-08-20' },
  { id: 'm-9', projectId: 'p-2', title: 'Podmalowanie', description: 'Podmalowanie w tonach ziemi', sortOrder: 3, status: 'pending', dueDate: '2025-09-10' },
  { id: 'm-10', projectId: 'p-2', title: 'Warstwy olejne', description: 'Główna realizacja w warstwach olejnych', sortOrder: 4, status: 'pending', dueDate: '2025-10-15' },
  { id: 'm-11', projectId: 'p-2', title: 'Detale i światło', description: 'Punkty światła, impasto, detale twarzy', sortOrder: 5, status: 'pending', dueDate: '2025-11-01' },
  { id: 'm-12', projectId: 'p-2', title: 'Werniks i przekazanie', description: 'Werniks końcowy, certyfikat, przekazanie', sortOrder: 6, status: 'pending', dueDate: '2025-11-15' },
];

const paymentsP2: CommissionPayment[] = [
  { id: 'pay-3', projectId: 'p-2', type: 'deposit', amount: 3000, percentOfTotal: 40, status: 'paid', dueDate: '2025-08-03', paidAt: '2025-08-03T14:00:00Z' },
  { id: 'pay-4', projectId: 'p-2', type: 'final', amount: 4500, percentOfTotal: 60, status: 'pending', dueDate: '2025-11-15' },
];

export const mockProjects: CommissionProject[] = [
  {
    id: 'p-1', commissionId: 'c-1', commissionTitle: 'Obraz abstrakcyjny do salonu 180×120',
    clientId: 'u-client-1', clientName: 'Anna Kowalska',
    artistId: 'u-artist-1', artistName: 'Artur Lewandowski',
    artistAvatarUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200',
    artistSlug: 'artur-lewandowski',
    status: 'painting_in_progress', acceptedOfferId: 'o-1', acceptedOffer: mockOffers.find(o => o.id === 'o-1'),
    totalPrice: 6800, depositAmount: 2720, depositPaid: true, finalAmount: 4080, finalPaid: false,
    startDate: '2025-08-01', estimatedCompletion: '2025-10-10',
    conversationId: 'conv-1',
    milestones: milestonesP1, payments: paymentsP1,
    progressImages: [
      { id: 'pi-1', projectId: 'p-1', imageUrl: 'https://images.pexels.com/photos/1145720/pexels-photo-1145720.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Szkic kompozycji - wariant A', uploadedAt: '2025-08-09T14:00:00Z', uploadedBy: 'Artur Lewandowski' },
      { id: 'pi-2', projectId: 'p-1', imageUrl: 'https://images.pexels.com/photos/1697750/pexels-photo-1697750.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Studium kolorystyczne - paleta beż/złoto/grafit', uploadedAt: '2025-08-18T16:00:00Z', uploadedBy: 'Artur Lewandowski' },
      { id: 'pi-3', projectId: 'p-1', imageUrl: 'https://images.pexels.com/photos/326311/pexels-photo-326311.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Grunt teksturalny - pierwsza warstwa na płótnie', uploadedAt: '2025-08-25T10:00:00Z', uploadedBy: 'Artur Lewandowski' },
    ],
    messages: [
      { id: 'msg-1', projectId: 'p-1', senderId: 'u-artist-1', senderName: 'Artur Lewandowski', senderRole: 'artist', body: 'Zaczynam od trzech wariantów szkicu - prześlę je w niedzielę.', createdAt: '2025-08-02T09:00:00Z' },
      { id: 'msg-2', projectId: 'p-1', senderId: 'u-client-1', senderName: 'Anna Kowalska', senderRole: 'client', body: 'Czekam z niecierpliwością. Wolę wariant z ruchem pionowym, jeśli można.', createdAt: '2025-08-02T11:30:00Z' },
      { id: 'msg-3', projectId: 'p-1', senderId: 'u-artist-1', senderName: 'Artur Lewandowski', senderRole: 'artist', body: 'Studia kolorystyczne gotowe - paleta beż/ivory/złoto/grafit sprawdza się na płótnie. Przesyłam zdjęcia.', createdAt: '2025-08-18T16:00:00Z' },
      { id: 'msg-4', projectId: 'p-1', senderId: 'u-client-1', senderName: 'Anna Kowalska', senderRole: 'client', body: 'Wspaniałe. Złoto akcentuje ruch pionowy dokładnie tak jak chciałam.', createdAt: '2025-08-19T08:15:00Z' },
    ],
  },
  {
    id: 'p-2', commissionId: 'c-2', commissionTitle: 'Obraz do sypialni w kolorach beż i błękit',
    clientId: 'u-client-1', clientName: 'Anna Kowalska',
    artistId: 'u-artist-2', artistName: 'Hanna Nowak',
    artistAvatarUrl: 'https://images.pexels.com/photos/1239351/pexels-photo-1239351.jpeg?auto=compress&cs=tinysrgb&w=200',
    artistSlug: 'hanna-nowak',
    status: 'concept_stage', acceptedOfferId: 'o-4', acceptedOffer: mockOffers.find(o => o.id === 'o-4'),
    totalPrice: 3800, depositAmount: 1520, depositPaid: true, finalAmount: 2280, finalPaid: false,
    startDate: '2025-08-03', estimatedCompletion: '2025-09-14',
    conversationId: 'conv-2',
    milestones: milestonesP2, payments: paymentsP2,
    progressImages: [
      { id: 'pi-4', projectId: 'p-2', imageUrl: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Sesja referencyjna - referencje dla palety', uploadedAt: '2025-08-04T15:00:00Z', uploadedBy: 'Hanna Nowak' },
      { id: 'pi-5', projectId: 'p-2', imageUrl: 'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=600', caption: 'Studium wstępne - wariant A', uploadedAt: '2025-08-12T11:00:00Z', uploadedBy: 'Hanna Nowak' },
    ],
    messages: [
      { id: 'msg-5', projectId: 'p-2', senderId: 'u-artist-2', senderName: 'Hanna Nowak', senderRole: 'artist', body: 'Sesja referencyjna za nami. Prześlę dwa studia wstępne w przyszłym tygodniu.', createdAt: '2025-08-05T10:00:00Z' },
      { id: 'msg-6', projectId: 'p-2', senderId: 'u-client-1', senderName: 'Anna Kowalska', senderRole: 'client', body: 'Super. Czekam na studia.', createdAt: '2025-08-05T12:00:00Z' },
    ],
  },
  {
    id: 'p-3', commissionId: 'c-4', commissionTitle: 'Portret olejny - mama na 60. urodziny',
    clientId: 'u-client-1', clientName: 'Anna Kowalska',
    artistId: 'u-artist-3', artistName: 'Kazimierz Wójcik',
    artistAvatarUrl: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=200',
    artistSlug: 'kazimierz-wojcik',
    status: 'deposit_pending', acceptedOfferId: 'o-6', acceptedOffer: mockOffers.find(o => o.id === 'o-6'),
    totalPrice: 2400, depositAmount: 960, depositPaid: false, finalAmount: 1440, finalPaid: false,
    startDate: '2025-08-10', estimatedCompletion: '2025-10-20',
    conversationId: 'conv-3',
    milestones: [
      { id: 'm-3a', projectId: 'p-3', title: 'Wybrano artystę', description: 'Oferta zaakceptowana, projekt utworzony', sortOrder: 0, status: 'done', dueDate: '2025-08-10' },
      { id: 'm-3b', projectId: 'p-3', title: 'Oczekiwanie na zaliczkę', description: 'Zlecający musi opłacić zaliczkę', sortOrder: 1, status: 'in_progress', dueDate: '2025-08-15' },
      { id: 'm-3c', projectId: 'p-3', title: 'Realizacja obrazu', description: 'Praca nad portretem', sortOrder: 2, status: 'pending', dueDate: '2025-09-20' },
      { id: 'm-3d', projectId: 'p-3', title: 'Podgląd pracy', description: 'Zdjęcia gotowe do akceptacji', sortOrder: 3, status: 'pending', dueDate: '2025-09-25' },
      { id: 'm-3e', projectId: 'p-3', title: 'Płatność końcowa', description: 'Opłata pozostałej kwoty', sortOrder: 4, status: 'pending', dueDate: '2025-10-01' },
      { id: 'm-3f', projectId: 'p-3', title: 'Wysyłka lub odbiór', description: 'Przekazanie dzieła', sortOrder: 5, status: 'pending', dueDate: '2025-10-15' },
      { id: 'm-3g', projectId: 'p-3', title: 'Zakończone', description: 'Projekt zamknięty', sortOrder: 6, status: 'pending', dueDate: '2025-10-20' },
    ],
    payments: [
      { id: 'pay-3a', projectId: 'p-3', type: 'deposit', amount: 960, percentOfTotal: 40, status: 'pending', dueDate: '2025-08-15' },
    ],
    progressImages: [],
    messages: [
      { id: 'msg-7', projectId: 'p-3', senderId: 'u-client-1', senderName: 'Anna Kowalska', senderRole: 'client', body: 'Cieszę się, że będziesz malować portret mojej mamy. Prześlę referencje po weekendzie.', createdAt: '2025-08-10T09:00:00Z' },
    ],
  },
];

export const mockConversations: Conversation[] = [
  { id: 'conv-1', type: 'project', participantIds: ['u-client-1', 'u-artist-1'], participantNames: ['Anna Kowalska', 'Artur Lewandowski'], participantAvatarUrls: [undefined, 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200'], projectTitle: 'Obraz abstrakcyjny do salonu 180×120', lastMessageBody: 'Studia kolorystyczne gotowe - paleta beż/ivory/złoto/grafit sprawdza się na płótnie.', lastMessageAt: '2025-08-18T16:00:00Z', unreadCount: 2, createdAt: '2025-08-01T10:00:00Z' },
  { id: 'conv-2', type: 'project', participantIds: ['u-client-1', 'u-artist-2'], participantNames: ['Anna Kowalska', 'Hanna Nowak'], participantAvatarUrls: [undefined, 'https://images.pexels.com/photos/1239351/pexels-photo-1239351.jpeg?auto=compress&cs=tinysrgb&w=200'], projectTitle: 'Obraz do sypialni w kolorach beż i błękit', lastMessageBody: 'Sesja referencyjna za nami. Prześlę dwa studia wstępne w przyszłym tygodniu.', lastMessageAt: '2025-08-05T10:00:00Z', unreadCount: 0, createdAt: '2025-08-03T10:00:00Z' },
  { id: 'conv-3', type: 'commission', participantIds: ['u-client-2', 'u-artist-5'], participantNames: ['Marek Kaczmarek - Studio MK', 'Piotr Zalewski'], participantAvatarUrls: [undefined, 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=200'], commissionTitle: 'Duży obraz do apartamentu pokazowego', lastMessageBody: 'Geometria w tej palecie to moje pole. Mam doświadczenie z projektami deweloperskimi.', lastMessageAt: '2025-07-26T10:00:00Z', unreadCount: 1, createdAt: '2025-07-25T10:00:00Z' },
];

export const mockMessages: Message[] = [
  { id: 'm-msg-1', conversationId: 'conv-1', senderId: 'u-artist-1', senderName: 'Artur Lewandowski', senderRole: 'artist', body: 'Zaczynam od trzech wariantów szkicu - prześlę je w niedzielę.', createdAt: '2025-08-02T09:00:00Z' },
  { id: 'm-msg-2', conversationId: 'conv-1', senderId: 'u-client-1', senderName: 'Anna Kowalska', senderRole: 'client', body: 'Czekam z niecierpliwością. Wolę wariant z ruchem pionowym, jeśli można.', createdAt: '2025-08-02T11:30:00Z' },
  { id: 'm-msg-3', conversationId: 'conv-1', senderId: 'u-artist-1', senderName: 'Artur Lewandowski', senderRole: 'artist', body: 'Studia kolorystyczne gotowe - paleta beż/ivory/złoto/grafit sprawdza się na płótnie. Przesyłam zdjęcia.', createdAt: '2025-08-18T16:00:00Z' },
  { id: 'm-msg-4', conversationId: 'conv-1', senderId: 'u-client-1', senderName: 'Anna Kowalska', senderRole: 'client', body: 'Wspaniałe. Złoto akcentuje ruch pionowy dokładnie tak jak chciałam.', readAt: '2025-08-19T08:00:00Z', createdAt: '2025-08-19T08:15:00Z' },
  { id: 'm-msg-5', conversationId: 'conv-2', senderId: 'u-artist-2', senderName: 'Hanna Nowak', senderRole: 'artist', body: 'Dziękuję za zaufanie. Zbieram materiały referencyjne - prześlę moodboard w tym tygodniu.', createdAt: '2025-08-03T11:00:00Z' },
  { id: 'm-msg-6', conversationId: 'conv-2', senderId: 'u-client-1', senderName: 'Anna Kowalska', senderRole: 'client', body: 'Brzmi świetnie. Czekam na moodboard.', createdAt: '2025-08-03T14:00:00Z' },
  { id: 'm-msg-7', conversationId: 'conv-2', senderId: 'u-artist-2', senderName: 'Hanna Nowak', senderRole: 'artist', body: 'Sesja referencyjna za nami. Prześlę dwa studia wstępne w przyszłym tygodniu.', createdAt: '2025-08-05T10:00:00Z' },
  { id: 'm-msg-8', conversationId: 'conv-3', senderId: 'u-artist-5', senderName: 'Piotr Zalewski', senderRole: 'artist', body: 'Geometria w tej palecie to moje pole. Mam doświadczenie z projektami deweloperskimi.', createdAt: '2025-07-26T10:00:00Z' },
];

export const mockModerationReports: ModerationReport[] = [
  { id: 'mr-1', targetId: 'cm-5', targetType: 'comment', reportedBy: 'u-admin-1', reportedByName: 'Administrator', reason: 'Spam', description: 'Komentarz może być spamem - powielona treść.', status: 'open', createdAt: '2025-07-30T12:00:00Z' },
  { id: 'mr-2', targetId: 'pa-2', targetType: 'portfolio_item', reportedBy: 'u-admin-1', reportedByName: 'Administrator', reason: 'Prawa autorskie', description: 'Zdjęcie może naruszać prawa autorskie.', status: 'reviewing', createdAt: '2025-07-28T10:00:00Z' },
  { id: 'mr-3', targetId: 'c-7', targetType: 'commission', reportedBy: 'u-admin-1', reportedByName: 'Administrator', reason: 'Nieodpowiednia treść', description: 'Zlecenie wymaga weryfikacji treści.', status: 'open', createdAt: '2025-08-02T18:00:00Z' },
  { id: 'mr-4', targetId: 'cm-9', targetType: 'comment', reportedBy: 'u-admin-1', reportedByName: 'Administrator', reason: 'Próba kontaktu poza platformą', description: 'Komentarz zawiera podejrzaną treść - możliwe dane kontaktowe.', status: 'open', createdAt: '2025-08-03T10:00:00Z' },
  { id: 'mr-5', targetId: 'c-8', targetType: 'commission', reportedBy: 'u-admin-1', reportedByName: 'Administrator', reason: 'Spam', description: 'Zlecenie może być duplikatem.', status: 'open', createdAt: '2025-08-03T16:00:00Z' },
];

export const mockAuditLogs: AdminAuditLog[] = [
  { id: 'al-1', adminId: 'u-admin-1', adminName: 'Administrator', action: 'approve_artist', entityType: 'user', entity_id: 'u-artist-1', old_value: 'pending', new_value: 'approved', reason: 'Weryfikacja portfolio pozytywna', date: '2024-11-21T10:00:00Z' },
  { id: 'al-2', adminId: 'u-admin-1', adminName: 'Administrator', action: 'approve_artist', entityType: 'user', entity_id: 'u-artist-2', old_value: 'pending', new_value: 'approved', reason: 'Weryfikacja portfolio pozytywna', date: '2024-12-06T10:00:00Z' },
  { id: 'al-3', adminId: 'u-admin-1', adminName: 'Administrator', action: 'feature_commission', entityType: 'commission', entity_id: 'c-4', old_value: 'published', new_value: 'published', reason: 'Wyróżnienie zlecenia', date: '2025-07-29T10:00:00Z' },
  { id: 'al-4', adminId: 'u-admin-1', adminName: 'Administrator', action: 'resolve_report', entityType: 'portfolio_item', entity_id: 'pa-2', old_value: 'reviewing', new_value: 'resolved', reason: 'Brak naruszenia praw autorskich', date: '2025-07-28T14:00:00Z' },
];

export const mockSettings: PlatformSettings = {
  artistApprovalRequired: true,
  commissionModerationRequired: true,
  depositPercent: 40,
  applicationFree: true,
  platformMessage: 'Witamy na platformie Atelier - łączymy artystów z zleceniającymi od 2024.',
  ownerEmail: 'admin@atelier.pl',
};

export const mockContactBypassAttempts: ContactBypassAttempt[] = [
  { id: 'cba-1', userId: 'u-artist-3', userName: 'Kazimierz Wójcik', conversationId: 'conv-3', messageBody: 'Zadzwoń do mnie: 600-123-456', detectedType: 'phone', status: 'open', createdAt: '2025-07-27T09:00:00Z' },
  { id: 'cba-2', userId: 'u-client-1', userName: 'Anna Kowalska', conversationId: 'conv-1', messageBody: 'Możesz podesłać na anna.kowalska@example.com?', detectedType: 'email', status: 'open', createdAt: '2025-08-19T09:00:00Z' },
  { id: 'cba-3', userId: 'u-artist-5', userName: 'Piotr Zalewski', conversationId: 'conv-3', messageBody: 'Zobacz moje prace: https://piotrzalewski.art', detectedType: 'link', status: 'resolved', createdAt: '2025-07-26T11:00:00Z' },
];

export const commissionStatusLabels: Record<string, string> = {
  draft: 'Szkic', pending_review: 'W weryfikacji', published: 'Opublikowane', offers_open: 'Otwarte na oferty', artist_selected: 'Wybrano artystę', in_progress: 'W realizacji', completed: 'Zakończone', cancelled: 'Anulowane', closed: 'Zamknięte',
};

export const offerStatusLabels: Record<string, string> = {
  submitted: 'Złożona', viewed: 'Wyświetlona', shortlisted: 'W krótkiej liście', accepted: 'Zaakceptowana', rejected: 'Odrzucona', withdrawn: 'Wycofana',
};

export const projectStatusLabels: Record<string, string> = {
  artist_selected: 'Wybrano artystę', deposit_pending: 'Oczekuje na zaliczkę', deposit_paid: 'Zaliczka opłacona',
  concept_stage: 'Etap koncepcji', concept_accepted: 'Koncepcja zaakceptowana', painting_in_progress: 'Malowanie w toku',
  preview_uploaded: 'Podgląd gotowy', revision_requested: 'Wymagane poprawki', final_accepted: 'Praca zaakceptowana',
  final_payment_pending: 'Oczekuje na płatność końcową', fully_paid: 'W pełni opłacone', delivery_preparation: 'Przygotowanie wysyłki',
  delivered: 'Dostarczono', completed: 'Zakończony', cancelled: 'Anulowany', disputed: 'Spór',
};

export const milestoneStatusLabels: Record<string, string> = {
  pending: 'Oczekuje', in_progress: 'W trakcie', done: 'Ukończony', skipped: 'Pominięty',
};

export const paymentStatusLabels: Record<string, string> = {
  pending: 'Oczekuje', paid: 'Opłacono', refunded: 'Zwrócono', failed: 'Błąd',
};

export const paymentTypeLabels: Record<string, string> = {
  deposit: 'Zaliczka', final: 'Płatność końcowa', additional: 'Dodatkowa',
};

export const moderationStatusLabels: Record<string, string> = {
  open: 'Otwarte', reviewing: 'W przeglądzie', resolved: 'Rozwiązane', dismissed: 'Odrzucone',
};

export const approvalStatusLabels: Record<string, string> = {
  pending: 'Oczekuje', approved: 'Zatwierdzony', suspended: 'Zawieszony', rejected: 'Odrzucony',
};
