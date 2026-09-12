import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ProtectedRoute, RoleRedirect, RequireRole, RequireOnboardingRole } from '@/components/auth/Guards';

import { PublicLayout } from '@/layouts/PublicLayout';
import { ClientDashboardLayout } from '@/layouts/ClientDashboardLayout';
import { ArtistDashboardLayout } from '@/layouts/ArtistDashboardLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

// ─── Critical: loaded eagerly (homepage = LCP page) ──────────────────────────
import { LandingPage } from '@/pages/public/LandingPage';

// ─── Public SEO pages: lazy-loaded, split from dashboard/admin ───────────────
const DlaZlecajacychPage = lazy(() => import('@/pages/public/DlaZlecajacychPage').then(m => ({ default: m.DlaZlecajacychPage })));
const DlaArtystowPage = lazy(() => import('@/pages/public/DlaArtystowPage').then(m => ({ default: m.DlaArtystowPage })));
const ZleceniaPage = lazy(() => import('@/pages/public/ZleceniaPage').then(m => ({ default: m.ZleceniaPage })));
const ZlecenieDetailPage = lazy(() => import('@/pages/public/ZlecenieDetailPage').then(m => ({ default: m.ZlecenieDetailPage })));
const ArtysciPage = lazy(() => import('@/pages/public/ArtysciPage').then(m => ({ default: m.ArtysciPage })));
const ArtystaDetailPage = lazy(() => import('@/pages/public/ArtystaDetailPage').then(m => ({ default: m.ArtystaDetailPage })));
const JakToDzialaPage = lazy(() => import('@/pages/public/JakToDzialaPage').then(m => ({ default: m.JakToDzialaPage })));
const CennikPage = lazy(() => import('@/pages/public/CennikPage').then(m => ({ default: m.CennikPage })));
const FAQPage = lazy(() => import('@/pages/public/FAQPage').then(m => ({ default: m.FAQPage })));
const KontaktPage = lazy(() => import('@/pages/public/KontaktPage').then(m => ({ default: m.KontaktPage })));
const RegulaminPage = lazy(() => import('@/pages/public/LegalPages').then(m => ({ default: m.RegulaminPage })));
const PolitykaPrywatnosciPage = lazy(() => import('@/pages/public/LegalPages').then(m => ({ default: m.PolitykaPrywatnosciPage })));
const ZasadyDlaArtystowPage = lazy(() => import('@/pages/public/LegalPages').then(m => ({ default: m.ZasadyDlaArtystowPage })));
const ZasadyDlaZlecajacychPage = lazy(() => import('@/pages/public/LegalPages').then(m => ({ default: m.ZasadyDlaZlecajacychPage })));
const ObrazyNaZamowieniePage = lazy(() => import('@/pages/public/ObrazyNaZamowieniePage').then(m => ({ default: m.ObrazyNaZamowieniePage })));
const ZamowObrazPage = lazy(() => import('@/pages/public/ZamowObrazPage').then(m => ({ default: m.ZamowObrazPage })));
const ZlecObrazPage = lazy(() => import('@/pages/public/ZlecObrazPage').then(m => ({ default: m.ZlecObrazPage })));
const ZleceniaDlaArtystowPage = lazy(() => import('@/pages/public/ZleceniaDlaArtystowPage').then(m => ({ default: m.ZleceniaDlaArtystowPage })));
const ObrazyKategoriaPage = lazy(() => import('@/pages/public/ObrazyKategoriaPage').then(m => ({ default: m.ObrazyKategoriaPage })));
const ObrazyWnetrzPage = lazy(() => import('@/pages/public/ObrazyWnetrzPage').then(m => ({ default: m.ObrazyWnetrzPage })));
const BlogPage = lazy(() => import('@/pages/public/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('@/pages/public/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const BlogKategoriaPage = lazy(() => import('@/pages/public/BlogKategoriaPage').then(m => ({ default: m.BlogKategoriaPage })));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// ─── Auth pages: lazy ────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const OnboardingClientPage = lazy(() => import('@/pages/auth/OnboardingPages').then(m => ({ default: m.OnboardingClientPage })));
const OnboardingArtistPage = lazy(() => import('@/pages/auth/OnboardingPages').then(m => ({ default: m.OnboardingArtistPage })));
const SuspendedPage = lazy(() => import('@/pages/auth/SuspendedPage').then(m => ({ default: m.SuspendedPage })));

// ─── Client dashboard: lazy ──────────────────────────────────────────────────
const ClientDashboardPage = lazy(() => import('@/pages/dashboard/client/ClientDashboardPage').then(m => ({ default: m.ClientDashboardPage })));
const ClientZleceniaPage = lazy(() => import('@/pages/dashboard/client/ClientZleceniaPage').then(m => ({ default: m.ClientZleceniaPage })));
const ClientNoweZleceniePage = lazy(() => import('@/pages/dashboard/client/ClientNoweZleceniePage').then(m => ({ default: m.ClientNoweZleceniePage })));
const ClientZlecenieDetailPage = lazy(() => import('@/pages/dashboard/client/ClientZlecenieDetailPage').then(m => ({ default: m.ClientZlecenieDetailPage })));
const ClientOfertyPage = lazy(() => import('@/pages/dashboard/client/ClientOfertyPage').then(m => ({ default: m.ClientOfertyPage })));
const ClientProjektyPage = lazy(() => import('@/pages/dashboard/client/ClientProjektyPage').then(m => ({ default: m.ClientProjektyPage })));
const ClientProjektDetailPage = lazy(() => import('@/pages/dashboard/client/ClientProjektDetailPage').then(m => ({ default: m.ClientProjektDetailPage })));
const ClientMarketplacePage = lazy(() => import('@/pages/dashboard/client/ClientMarketplacePage').then(m => ({ default: m.ClientMarketplacePage })));
const ClientMarketplaceDetailPage = lazy(() => import('@/pages/dashboard/client/ClientMarketplaceDetailPage').then(m => ({ default: m.ClientMarketplaceDetailPage })));
const ClientArtysciPage = lazy(() => import('@/pages/dashboard/client/ClientArtysciPage').then(m => ({ default: m.ClientArtysciPage })));
const ClientArtystaDetailPage = lazy(() => import('@/pages/dashboard/client/ClientArtystaDetailPage').then(m => ({ default: m.ClientArtystaDetailPage })));
const WiadomosciPage = lazy(() => import('@/pages/dashboard/shared/WiadomosciPage').then(m => ({ default: m.WiadomosciPage })));
const UstawieniaPage = lazy(() => import('@/pages/dashboard/shared/UstawieniaPage').then(m => ({ default: m.UstawieniaPage })));

// ─── Artist dashboard: lazy ──────────────────────────────────────────────────
const ArtistDashboardPage = lazy(() => import('@/pages/dashboard/artist/ArtistDashboardPage').then(m => ({ default: m.ArtistDashboardPage })));
const ArtistProfilPage = lazy(() => import('@/pages/dashboard/artist/ArtistProfilPage').then(m => ({ default: m.ArtistProfilPage })));
const ArtistPortfolioPage = lazy(() => import('@/pages/dashboard/artist/ArtistPortfolioPage').then(m => ({ default: m.ArtistPortfolioPage })));
const ArtistZleceniaPage = lazy(() => import('@/pages/dashboard/artist/ArtistZleceniaPage').then(m => ({ default: m.ArtistZleceniaPage })));
const ArtistZlecenieDetailPage = lazy(() => import('@/pages/dashboard/artist/ArtistZlecenieDetailPage').then(m => ({ default: m.ArtistZlecenieDetailPage })));
const ArtistOfertyPage = lazy(() => import('@/pages/dashboard/artist/ArtistOfertyPage').then(m => ({ default: m.ArtistOfertyPage })));
const ArtistProjektyPage = lazy(() => import('@/pages/dashboard/artist/ArtistProjektyPage').then(m => ({ default: m.ArtistProjektyPage })));
const ArtistProjektDetailPage = lazy(() => import('@/pages/dashboard/artist/ArtistProjektDetailPage').then(m => ({ default: m.ArtistProjektDetailPage })));
const ArtistBillingPage = lazy(() => import('@/pages/dashboard/artist/ArtistBillingPage').then(m => ({ default: m.ArtistBillingPage })));
const ArtistArtysciPage = lazy(() => import('@/pages/dashboard/artist/ArtistArtysciPage').then(m => ({ default: m.ArtistArtysciPage })));
const ArtistArtystaDetailPage = lazy(() => import('@/pages/dashboard/artist/ArtistArtystaDetailPage').then(m => ({ default: m.ArtistArtystaDetailPage })));

// ─── Admin: lazy ─────────────────────────────────────────────────────────────
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminArtistsPage = lazy(() => import('@/pages/admin/AdminArtistsPage').then(m => ({ default: m.AdminArtistsPage })));
const AdminCreateArtistPage = lazy(() => import('@/pages/admin/AdminCreateArtistPage').then(m => ({ default: m.AdminCreateArtistPage })));
const AdminEditArtistPage = lazy(() => import('@/pages/admin/AdminEditArtistPage').then(m => ({ default: m.AdminEditArtistPage })));
const AdminClientsPage = lazy(() => import('@/pages/admin/AdminPages').then(m => ({ default: m.AdminClientsPage })));
const AdminCommissionsPage = lazy(() => import('@/pages/admin/AdminPages').then(m => ({ default: m.AdminCommissionsPage })));
const AdminCommentsPage = lazy(() => import('@/pages/admin/AdminPages').then(m => ({ default: m.AdminCommentsPage })));
const AdminOffersPage = lazy(() => import('@/pages/admin/AdminPages').then(m => ({ default: m.AdminOffersPage })));
const AdminProjectsPage = lazy(() => import('@/pages/admin/AdminPages').then(m => ({ default: m.AdminProjectsPage })));
const AdminPaymentsPage = lazy(() => import('@/pages/admin/AdminPages').then(m => ({ default: m.AdminPaymentsPage })));
const AdminModerationPage = lazy(() => import('@/pages/admin/AdminPages').then(m => ({ default: m.AdminModerationPage })));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminPages').then(m => ({ default: m.AdminSettingsPage })));
const AdminSEOPage = lazy(() => import('@/pages/admin/AdminPages').then(m => ({ default: m.AdminSEOPage })));
const AdminQAChecklistPage = lazy(() => import('@/pages/admin/AdminQAChecklistPage').then(m => ({ default: m.AdminQAChecklistPage })));

/** Wraps children with ProtectedRoute + RequireRole. */
function ProtectedRoleRoute({ roles, children }: { roles: import('@/types').UserRole[]; children: ReactNode }) {
  return (
    <ProtectedRoute>
      <RequireRole roles={roles}>{children}</RequireRole>
    </ProtectedRoute>
  );
}

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory-100">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-graphite-200 border-t-gold-400" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
    <ScrollToTop />
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/obrazy-na-zamowienie" element={<ObrazyNaZamowieniePage />} />
        <Route path="/zamow-obraz" element={<ZamowObrazPage />} />
        <Route path="/zlec-obraz" element={<ZlecObrazPage />} />
        <Route path="/dla-zlecajacych" element={<DlaZlecajacychPage />} />
        <Route path="/dla-artystow" element={<DlaArtystowPage />} />
        <Route path="/zlecenia" element={<ZleceniaPage />} />
        <Route path="/zlecenia-dla-artystow" element={<ZleceniaDlaArtystowPage />} />
        <Route path="/zlecenia/:slug" element={<ZlecenieDetailPage />} />
        <Route path="/artysci" element={<ArtysciPage />} />
        <Route path="/artysci/:slug" element={<ArtystaDetailPage />} />
        <Route path="/obrazy/:kategoria" element={<ObrazyKategoriaPage />} />
        <Route path="/obrazy-do-salonu" element={<ObrazyWnetrzPage />} />
        <Route path="/obrazy-do-sypialni" element={<ObrazyWnetrzPage />} />
        <Route path="/obrazy-do-biura" element={<ObrazyWnetrzPage />} />
        <Route path="/obrazy-do-hotelu" element={<ObrazyWnetrzPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/kategoria/:slug" element={<BlogKategoriaPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/jak-to-dziala" element={<JakToDzialaPage />} />
        <Route path="/cennik" element={<CennikPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/kontakt" element={<KontaktPage />} />
        <Route path="/regulamin" element={<RegulaminPage />} />
        <Route path="/polityka-prywatnosci" element={<PolitykaPrywatnosciPage />} />
        <Route path="/zasady-dla-artystow" element={<ZasadyDlaArtystowPage />} />
        <Route path="/zasady-dla-zlecajacych" element={<ZasadyDlaZlecajacychPage />} />
      </Route>

      {/* Auth (redirect to dashboard if already logged in) */}
      <Route path="/login" element={<RoleRedirect><LoginPage /></RoleRedirect>} />
      <Route path="/register" element={<RoleRedirect><RegisterPage /></RoleRedirect>} />
      <Route path="/forgot-password" element={<RoleRedirect><ForgotPasswordPage /></RoleRedirect>} />
      <Route path="/reset-password" element={<RoleRedirect><ResetPasswordPage /></RoleRedirect>} />

      {/* Onboarding (requires auth, not yet completed) */}
      <Route path="/onboarding" element={<ProtectedRoute><Navigate to="/onboarding/client" replace /></ProtectedRoute>} />
      <Route path="/onboarding/client" element={<ProtectedRoute><RequireOnboardingRole expectedRole="client"><OnboardingClientPage /></RequireOnboardingRole></ProtectedRoute>} />
      <Route path="/onboarding/artist" element={<ProtectedRoute><RequireOnboardingRole expectedRole="artist"><OnboardingArtistPage /></RequireOnboardingRole></ProtectedRoute>} />

      {/* Suspended */}
      <Route path="/suspended" element={<SuspendedPage />} />

      {/* Client dashboard */}
      <Route path="/dashboard/client" element={<ProtectedRoleRoute roles={['client', 'admin']}><ClientDashboardLayout /></ProtectedRoleRoute>}>
        <Route index element={<ClientDashboardPage />} />
        <Route path="zlecenia" element={<ClientZleceniaPage />} />
        <Route path="zlecenia/nowe" element={<ClientNoweZleceniePage />} />
        <Route path="zlecenia/:id/edytuj" element={<ClientNoweZleceniePage />} />
        <Route path="zlecenia/:id" element={<ClientZlecenieDetailPage />} />
        <Route path="marketplace" element={<ClientMarketplacePage />} />
        <Route path="marketplace/:slug" element={<ClientMarketplaceDetailPage />} />
        <Route path="artysci" element={<ClientArtysciPage />} />
        <Route path="artysci/:slug" element={<ClientArtystaDetailPage />} />
        <Route path="oferty" element={<ClientOfertyPage />} />
        <Route path="projekty" element={<ClientProjektyPage />} />
        <Route path="projekty/:id" element={<ClientProjektDetailPage />} />
        <Route path="wiadomosci" element={<WiadomosciPage />} />
        <Route path="ustawienia" element={<UstawieniaPage />} />
      </Route>

      {/* Artist dashboard */}
      <Route path="/dashboard/artist" element={<ProtectedRoleRoute roles={['artist', 'admin']}><ArtistDashboardLayout /></ProtectedRoleRoute>}>
        <Route index element={<ArtistDashboardPage />} />
        <Route path="artysci" element={<ArtistArtysciPage />} />
        <Route path="artysci/:slug" element={<ArtistArtystaDetailPage />} />
        <Route path="profil" element={<ArtistProfilPage />} />
        <Route path="portfolio" element={<ArtistPortfolioPage />} />
        <Route path="zlecenia" element={<ArtistZleceniaPage />} />
        <Route path="zlecenia/:id" element={<ArtistZlecenieDetailPage />} />
        <Route path="oferty" element={<ArtistOfertyPage />} />
        <Route path="projekty" element={<ArtistProjektyPage />} />
        <Route path="projekty/:id" element={<ArtistProjektDetailPage />} />
        <Route path="wiadomosci" element={<WiadomosciPage />} />
        <Route path="billing" element={<ArtistBillingPage />} />
        <Route path="ustawienia" element={<UstawieniaPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoleRoute roles={['admin']}><AdminLayout /></ProtectedRoleRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="artists" element={<AdminArtistsPage />} />
        <Route path="artysci/nowy" element={<AdminCreateArtistPage />} />
        <Route path="artysci/:id" element={<AdminEditArtistPage />} />
        <Route path="clients" element={<AdminClientsPage />} />
        <Route path="commissions" element={<AdminCommissionsPage />} />
        <Route path="comments" element={<AdminCommentsPage />} />
        <Route path="offers" element={<AdminOffersPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="moderation" element={<AdminModerationPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="seo" element={<AdminSEOPage />} />
        <Route path="qa-checklist" element={<AdminQAChecklistPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
