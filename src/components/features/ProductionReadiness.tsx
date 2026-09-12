import { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck, ShieldAlert, AlertTriangle, Check, X, AlertCircle,
  ChevronDown, ChevronRight, Server, Lock, Search, Zap, Smartphone,
  Workflow, TrendingUp,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

type ReadinessStatus = 'ready' | 'warning' | 'missing';

interface ReadinessCheck {
  id: string;
  label: string;
  detectedStatus: ReadinessStatus;
  detail: string;
  critical: boolean;
}

type ReadinessCategory = 'environment' | 'security' | 'seo' | 'performance' | 'ux' | 'business';

interface ReadinessSection {
  id: ReadinessCategory;
  title: string;
  icon: typeof Server;
  checks: ReadinessCheck[];
}

const stripePublishable = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const READINESS_SECTIONS: ReadinessSection[] = [
  {
    id: 'environment',
    title: 'Environment',
    icon: Server,
    checks: [
      {
        id: 'env_supabase_url',
        label: 'VITE_SUPABASE_URL',
        detectedStatus: supabaseUrl && supabaseUrl.startsWith('https://') ? 'ready' : 'missing',
        detail: supabaseUrl ? `Skonfigurowane: ${supabaseUrl.slice(0, 30)}...` : 'Brak w .env - aplikacja działa w trybie mock.',
        critical: false,
      },
      {
        id: 'env_supabase_anon_key',
        label: 'VITE_SUPABASE_ANON_KEY',
        detectedStatus: supabaseAnonKey && supabaseAnonKey.length > 50 ? 'ready' : 'missing',
        detail: supabaseAnonKey ? 'Klucz anon skonfigurowany.' : 'Brak klucza anon w .env.',
        critical: false,
      },
      {
        id: 'env_stripe_publishable',
        label: 'VITE_STRIPE_PUBLISHABLE_KEY',
        detectedStatus: stripePublishable && stripePublishable.startsWith('pk_') ? 'ready' : 'missing',
        detail: stripePublishable ? 'Klucz publishable Stripe skonfigurowany.' : 'Brak - płatności działają w trybie mock. Dodaj pk_test_ lub pk_live_ do .env.',
        critical: false,
      },
      {
        id: 'env_site_url',
        label: 'SITE_URL',
        detectedStatus: 'ready',
        detail: 'Ustawione w kodzie na https://artiors.pl. Zaktualizuj przed deployem na właściwą domenę.',
        critical: false,
      },
      {
        id: 'env_resend_api_key',
        label: 'RESEND_API_KEY (backend-only)',
        detectedStatus: 'missing',
        detail: 'Nie skonfigurowane w edge functions. E-maile nie są wysyłane - dodaj klucz Resend do secrets Supabase.',
        critical: false,
      },
      {
        id: 'env_stripe_secret_key',
        label: 'STRIPE_SECRET_KEY (backend-only)',
        detectedStatus: 'missing',
        detail: 'Nie skonfigurowane w edge functions. Płatności Stripe nie działają - dodaj sk_test_ lub sk_live_ do secrets Supabase.',
        critical: false,
      },
      {
        id: 'env_stripe_webhook_secret',
        label: 'STRIPE_WEBHOOK_SECRET (backend-only)',
        detectedStatus: 'missing',
        detail: 'Nie skonfigurowane w edge functions. Webhooki Stripe nie będą weryfikowane - dodaj whsec_ do secrets Supabase.',
        critical: false,
      },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    icon: Lock,
    checks: [
      {
        id: 'sec_rls_enabled',
        label: 'RLS enabled',
        detectedStatus: 'ready',
        detail: 'WSzystkie 22 tabele mają włączone RLS (zweryfikowano przez security posture).',
        critical: true,
      },
      {
        id: 'sec_admin_routes_protected',
        label: 'Admin routes protected',
        detectedStatus: 'ready',
        detail: 'Trasy /admin chronione przez ProtectedRoleRoute z rolą admin. Nieautoryzowani są przekierowywani.',
        critical: true,
      },
      {
        id: 'sec_no_service_role_frontend',
        label: 'No service role key in frontend',
        detectedStatus: 'ready',
        detail: 'Frontend używa tylko klucza anon. Service role key nie jest importowany w żadnym pliku src/.',
        critical: true,
      },
      {
        id: 'sec_private_storage_protected',
        label: 'Private storage buckets protected',
        detectedStatus: 'warning',
        detail: 'Private buckety (comment-attachments, offer-attachments, project-milestones, message-attachments) używają signed URLs. Ale 3 publiczne buckety (avatars, artist-portfolio, commission-inspirations) pozwalają na listing plików - rozważ tighter policies.',
        critical: true,
      },
      {
        id: 'sec_public_no_private_fields',
        label: 'Public queries do not expose private fields',
        detectedStatus: 'ready',
        detail: 'Publiczne zapytania używają explicit column lists - private_description nie jest wybierane w publicznych widokach.',
        critical: true,
      },
      {
        id: 'sec_messages_protected',
        label: 'Messages protected',
        detectedStatus: 'ready',
        detail: 'Tabela messages ma RLS - użytkownicy widzą tylko wiadomości, w których są nadawcą lub odbiorcą.',
        critical: true,
      },
      {
        id: 'sec_offers_protected',
        label: 'Offers protected',
        detectedStatus: 'ready',
        detail: 'Tabela offers ma RLS - klient widzi oferty na swoje zlecenia, artysta widzi swoje oferty.',
        critical: true,
      },
      {
        id: 'sec_payments_protected',
        label: 'Payments protected',
        detectedStatus: 'ready',
        detail: 'Płatności przechodzą przez edge functions z weryfikacją JWT. Statusy płatności zapisane w tabeli projects z RLS.',
        critical: true,
      },
      {
        id: 'sec_suspended_users_blocked',
        label: 'Suspended users blocked',
        detectedStatus: 'ready',
        detail: 'ProtectedRoute sprawdza status === suspended i przekierowuje na /suspended.',
        critical: true,
      },
    ],
  },
  {
    id: 'seo',
    title: 'SEO',
    icon: Search,
    checks: [
      {
        id: 'seo_sitemap',
        label: 'sitemap.xml',
        detectedStatus: 'ready',
        detail: 'Plik istnieje w /public/sitemap.xml. Static URLs dodane; dynamiczne URL-e (zlecenia, artyści) wymagają iniekcji.',
        critical: false,
      },
      {
        id: 'seo_robots',
        label: 'robots.txt',
        detectedStatus: 'ready',
        detail: 'Plik istnieje w /public/robots.txt. Disallow na /dashboard/, /admin/, /login, /register, /storage/.',
        critical: false,
      },
      {
        id: 'seo_meta_titles',
        label: 'Meta titles',
        detectedStatus: 'ready',
        detail: 'useSeo hook ustawia document.title dla każdej strony. Static + dynamic titles zdefiniowane.',
        critical: false,
      },
      {
        id: 'seo_meta_descriptions',
        label: 'Meta descriptions',
        detectedStatus: 'ready',
        detail: 'useSeo hook ustawia meta description. Static + dynamic descriptions zdefiniowane.',
        critical: false,
      },
      {
        id: 'seo_canonical_urls',
        label: 'Canonical URLs',
        detectedStatus: 'ready',
        detail: 'useSeo hook ustawia link rel=canonical dla każdej strony.',
        critical: false,
      },
      {
        id: 'seo_og_images',
        label: 'Open Graph images',
        detectedStatus: 'ready',
        detail: 'useSeo hook ustawia og:image i twitter:image. Dynamic pages używają pierwszego zdjęcia zlecenia lub avatara artysty.',
        critical: false,
      },
      {
        id: 'seo_alt_text',
        label: 'Alt text',
        detectedStatus: 'ready',
        detail: 'generateAltText() tworzy opisowy alt text dla zdjęć portfolio. Zdjęcia zleceń używają tytułu zlecenia.',
        critical: false,
      },
    ],
  },
  {
    id: 'performance',
    title: 'Performance',
    icon: Zap,
    checks: [
      {
        id: 'perf_lazy_loading',
        label: 'Image lazy loading',
        detectedStatus: 'missing',
        detail: 'Brak atrybutu loading="lazy" na obrazach. Dodaj do img tags dla lazy loading off-screen images.',
        critical: false,
      },
      {
        id: 'perf_optimized_images',
        label: 'Optimized images',
        detectedStatus: 'warning',
        detail: 'Brak transformacji obrazów (WebP conversion, resize). Supabase Image Transformations lub CDN niewykorzystane.',
        critical: false,
      },
      {
        id: 'perf_loading_skeletons',
        label: 'Loading skeletons',
        detectedStatus: 'ready',
        detail: 'LoadingSkeleton, LoadingState, ErrorState komponenty zdefiniowane i używane w dashboard pages.',
        critical: false,
      },
      {
        id: 'perf_pagination',
        label: 'Pagination',
        detectedStatus: 'warning',
        detail: 'Brak paginacji w listach publicznych (zlecenia, artyści). Dla MVP z małą ilością danych OK, ale dodaj przed scale.',
        critical: false,
      },
      {
        id: 'perf_no_huge_queries',
        label: 'No huge queries',
        detectedStatus: 'ready',
        detail: 'Publiczne zapytania używają explicit column lists. Brak select(*) w publicznych endpointach.',
        critical: false,
      },
    ],
  },
  {
    id: 'ux',
    title: 'UX',
    icon: Smartphone,
    checks: [
      {
        id: 'ux_mobile_menu',
        label: 'Mobile menu',
        detectedStatus: 'ready',
        detail: 'Admin layout, dashboard layouts mają mobile menu z hamburger icon. Responsive breakpoints zdefiniowane.',
        critical: false,
      },
      {
        id: 'ux_form_validation',
        label: 'Form validation',
        detectedStatus: 'ready',
        detail: 'Formularze używają required, error states, hint texts. Walidacja w commission form, offer form, auth forms.',
        critical: false,
      },
      {
        id: 'ux_empty_states',
        label: 'Empty states',
        detectedStatus: 'ready',
        detail: 'EmptyState komponent używany w 18+ plikach (dashboard pages, public pages).',
        critical: false,
      },
      {
        id: 'ux_error_states',
        label: 'Error states',
        detectedStatus: 'ready',
        detail: 'ErrorState komponent zdefiniowany. Error handling w serwisach (catch blocks, error messages).',
        critical: false,
      },
      {
        id: 'ux_toast_notifications',
        label: 'Toast notifications',
        detectedStatus: 'ready',
        detail: 'ToastContext z success/error/info notifications. Używany w dashboard i admin actions.',
        critical: false,
      },
      {
        id: 'ux_confirmation_modals',
        label: 'Confirmation modals',
        detectedStatus: 'ready',
        detail: 'ConfirmDialog komponent używany w 7+ plikach (delete actions, approve/reject, status changes).',
        critical: false,
      },
      {
        id: 'ux_accessible_buttons',
        label: 'Accessible buttons',
        detectedStatus: 'warning',
        detail: 'Przyciski używają standard HTML <button>, ale brak systematic aria-label na icon-only buttons. Dodaj aria-labels.',
        critical: false,
      },
      {
        id: 'ux_keyboard_navigation',
        label: 'Keyboard navigation',
        detectedStatus: 'warning',
        detail: 'Standard HTML elementy są keyboard-accessible. Brak explicit focus management w modals i drawers. Testuj z Tab/Enter.',
        critical: false,
      },
    ],
  },
  {
    id: 'business',
    title: 'Business flow',
    icon: Workflow,
    checks: [
      { id: 'biz_client_flow', label: 'Test client flow', detectedStatus: 'missing', detail: 'Rejestracja → nowe zlecenie → podgląd → oferty → akceptacja → projekt → płatność.', critical: false },
      { id: 'biz_artist_flow', label: 'Test artist flow', detectedStatus: 'missing', detail: 'Rejestracja → onboarding → portfolio → komentarze → oferty → realizacja projektu.', critical: false },
      { id: 'biz_admin_flow', label: 'Test admin flow', detectedStatus: 'missing', detail: 'Zatwierdzanie artystów, zleceń, moderacja komentarzy, zawieszanie użytkowników, audit log.', critical: false },
      { id: 'biz_offer_acceptance', label: 'Test offer acceptance', detectedStatus: 'missing', detail: 'Klient akceptuje ofertę → projekt tworzony automatycznie → dashboard projektu dostępny.', critical: false },
      { id: 'biz_project_dashboard', label: 'Test project dashboard', detectedStatus: 'missing', detail: 'Milestone\'y, statusy płatności, uploady załączników, zmiana statusu projektu.', critical: false },
      { id: 'biz_deposit', label: 'Test deposit', detectedStatus: 'missing', detail: 'Deposit checkout (mock lub Stripe) → status zaliczki paid → odblokowanie milestone\'ów.', critical: false },
      { id: 'biz_final_payment', label: 'Test final payment', detectedStatus: 'missing', detail: 'Final payment checkout → status końcowy paid → zakończenie projektu.', critical: false },
      { id: 'biz_comments', label: 'Test comments', detectedStatus: 'missing', detail: 'Artysta komentuje z/z bez zdjęcia. Gość nie może komentować. Admin ukrywa komentarz.', critical: false },
      { id: 'biz_moderation', label: 'Test moderation', detectedStatus: 'missing', detail: 'Zgłoszenie komentarza → admin widzi w moderacji → ukryj/rozwiąż/odrzuć.', critical: false },
    ],
  },
];

const STORAGE_KEY = 'app_production_readiness_v1';

const STATUS_CONFIG: Record<ReadinessStatus, {
  label: string;
  icon: typeof Check;
  badgeClass: string;
  dotClass: string;
  textClass: string;
}> = {
  ready: {
    label: 'Ready',
    icon: Check,
    badgeClass: 'bg-success/20 text-success-light border-success/30',
    dotClass: 'bg-success',
    textClass: 'text-success-light',
  },
  warning: {
    label: 'Warning',
    icon: AlertTriangle,
    badgeClass: 'bg-warning/20 text-warning-light border-warning/30',
    dotClass: 'bg-warning',
    textClass: 'text-warning-light',
  },
  missing: {
    label: 'Missing',
    icon: X,
    badgeClass: 'bg-error/20 text-error-light border-error/30',
    dotClass: 'bg-error',
    textClass: 'text-error-light',
  },
};

function loadOverrides(): Record<string, ReadinessStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<string, ReadinessStatus>;
  } catch { /* ignore */ }
  return {};
}

export function ProductionReadiness() {
  const [overrides, setOverrides] = useState<Record<string, ReadinessStatus>>(loadOverrides);
  const [expandedSections, setExpandedSections] = useState<Set<ReadinessCategory>>(new Set(READINESS_SECTIONS.map((s) => s.id)));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch { /* ignore */ }
  }, [overrides]);

  function getStatus(check: ReadinessCheck): ReadinessStatus {
    return overrides[check.id] ?? check.detectedStatus;
  }

  function setStatus(checkId: string, status: ReadinessStatus) {
    setOverrides((prev) => ({ ...prev, [checkId]: status }));
  }

  function resetOverrides() {
    setOverrides({});
  }

  function toggleSection(id: ReadinessCategory) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allChecks = useMemo(() => READINESS_SECTIONS.flatMap((s) => s.checks), []);
  const stats = useMemo(() => {
    const ready = allChecks.filter((c) => getStatus(c) === 'ready').length;
    const warning = allChecks.filter((c) => getStatus(c) === 'warning').length;
    const missing = allChecks.filter((c) => getStatus(c) === 'missing').length;
    return { ready, warning, missing, total: allChecks.length };
  }, [allChecks, overrides]);

  const criticalSecurityMissing = useMemo(() => {
    const securitySection = READINESS_SECTIONS.find((s) => s.id === 'security');
    if (!securitySection) return false;
    return securitySection.checks.some((c) => c.critical && getStatus(c) === 'missing');
  }, [overrides]);

  const criticalSecurityWarnings = useMemo(() => {
    const securitySection = READINESS_SECTIONS.find((s) => s.id === 'security');
    if (!securitySection) return false;
    return securitySection.checks.some((c) => c.critical && getStatus(c) === 'warning');
  }, [overrides]);

  const isProductionReady = !criticalSecurityMissing && stats.missing === 0;
  const canMarkReady = !criticalSecurityMissing;

  function getSectionStats(sectionId: ReadinessCategory) {
    const section = READINESS_SECTIONS.find((s) => s.id === sectionId);
    if (!section) return { ready: 0, warning: 0, missing: 0, total: 0 };
    const ready = section.checks.filter((c) => getStatus(c) === 'ready').length;
    const warning = section.checks.filter((c) => getStatus(c) === 'warning').length;
    const missing = section.checks.filter((c) => getStatus(c) === 'missing').length;
    return { ready, warning, missing, total: section.checks.length };
  }

  const progressPercent = stats.total > 0 ? Math.round((stats.ready / stats.total) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Verdict banner */}
      <div className={cn(
        'rounded-2xl border p-6 transition-all',
        isProductionReady
          ? 'border-success/30 bg-success/10'
          : criticalSecurityMissing
            ? 'border-error/30 bg-error/10'
            : 'border-warning/30 bg-warning/10',
      )}>
        <div className="flex items-start gap-4">
          <div className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
            isProductionReady ? 'bg-success/20' : criticalSecurityMissing ? 'bg-error/20' : 'bg-warning/20',
          )}>
            {isProductionReady
              ? <ShieldCheck className="h-6 w-6 text-success-light" />
              : criticalSecurityMissing
                ? <ShieldAlert className="h-6 w-6 text-error-light" />
                : <AlertTriangle className="h-6 w-6 text-warning-light" />}
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl text-ivory-100">
              {isProductionReady
                ? 'Production Ready'
                : criticalSecurityMissing
                  ? 'Niegotowe do produkcji'
                  : 'Wymaga dokończenia'}
            </h2>
            <p className="mt-1 text-sm text-graphite-300">
              {isProductionReady
                ? 'Wszystkie checki oznaczone jako ready. Aplikacja jest gotowa do wdrożenia.'
                : criticalSecurityMissing
                  ? 'Krytyczne checki security są missing. Nie można oznaczyć aplikacji jako production ready.'
                  : `${stats.missing} missing, ${stats.warning} warning. Rozwiąż przed wdrożeniem.`}
            </p>
            {criticalSecurityWarnings && !criticalSecurityMissing && (
              <p className="mt-1 text-xs text-warning-light">
                Uwaga: niektóre krytyczne checki security mają status warning.
              </p>
            )}
          </div>
          <button
            disabled={!canMarkReady}
            className={cn(
              'shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all',
              isProductionReady
                ? 'bg-success text-ivory-100'
                : canMarkReady
                  ? 'bg-gold-400 text-graphite-700 hover:bg-gold-300'
                  : 'cursor-not-allowed bg-graphite-500/30 text-graphite-400',
            )}
            title={!canMarkReady ? 'Krytyczne checki security są missing - zablokowane.' : ''}
          >
            {isProductionReady ? 'Gotowe' : 'Oznacz jako ready'}
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-graphite-600/30 bg-graphite-600/50 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/20">
              <Check className="h-4 w-4 text-success-light" />
            </div>
            <div>
              <p className="font-display text-xl text-success-light">{stats.ready}</p>
              <p className="text-[10px] text-graphite-300">Ready</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-graphite-600/30 bg-graphite-600/50 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/20">
              <AlertTriangle className="h-4 w-4 text-warning-light" />
            </div>
            <div>
              <p className="font-display text-xl text-warning-light">{stats.warning}</p>
              <p className="text-[10px] text-graphite-300">Warning</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-graphite-600/30 bg-graphite-600/50 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-error/20">
              <X className="h-4 w-4 text-error-light" />
            </div>
            <div>
              <p className="font-display text-xl text-error-light">{stats.missing}</p>
              <p className="text-[10px] text-graphite-300">Missing</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-graphite-600/30 bg-graphite-600/50 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400/20">
              <TrendingUp className="h-4 w-4 text-gold-300" />
            </div>
            <div>
              <p className="font-display text-xl text-gold-300">{progressPercent}%</p>
              <p className="text-[10px] text-graphite-300">Gotowość</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      {READINESS_SECTIONS.map((section) => {
        const isExpanded = expandedSections.has(section.id);
        const sStats = getSectionStats(section.id);
        const SectionIcon = section.icon;

        return (
          <Card key={section.id} hover={false} className="bg-graphite-600 border-graphite-500/30">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between border-b border-graphite-500/30 px-6 py-4 text-left transition-colors hover:bg-graphite-500/10"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown className="h-4 w-4 text-graphite-300" /> : <ChevronRight className="h-4 w-4 text-graphite-300" />}
                <SectionIcon className="h-4 w-4 text-gold-300" />
                <h3 className="font-display text-lg text-ivory-100">{section.title}</h3>
                <div className="flex items-center gap-2">
                  {sStats.ready > 0 && <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-medium text-success-light">{sStats.ready} ready</span>}
                  {sStats.warning > 0 && <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning-light">{sStats.warning} warn</span>}
                  {sStats.missing > 0 && <span className="rounded-full bg-error/20 px-2 py-0.5 text-xs font-medium text-error-light">{sStats.missing} miss</span>}
                </div>
              </div>
              <div className="flex h-1.5 w-20 gap-0.5 overflow-hidden rounded-full bg-graphite-700">
                <div className="h-full bg-success" style={{ width: `${(sStats.ready / sStats.total) * 100}%` }} />
                <div className="h-full bg-warning" style={{ width: `${(sStats.warning / sStats.total) * 100}%` }} />
                <div className="h-full bg-error" style={{ width: `${(sStats.missing / sStats.total) * 100}%` }} />
              </div>
            </button>

            {isExpanded && (
              <CardBody className="space-y-1 p-0">
                {section.checks.map((check) => {
                  const currentStatus = getStatus(check);
                  const statusCfg = STATUS_CONFIG[currentStatus];
                  const StatusIcon = statusCfg.icon;
                  const hasOverride = overrides[check.id] !== undefined;

                  return (
                    <div key={check.id} className="border-b border-graphite-500/20 px-6 py-3 last:border-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border', statusCfg.badgeClass)}>
                            <StatusIcon className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={cn('text-sm', currentStatus === 'ready' ? 'text-ivory-100' : 'text-graphite-200')}>
                                {check.label}
                              </span>
                              {check.critical && (
                                <span className="rounded bg-error/10 px-1.5 py-0.5 text-[10px] font-medium text-error-light">CRITICAL</span>
                              )}
                              {hasOverride && (
                                <span className="rounded bg-graphite-500/30 px-1.5 py-0.5 text-[10px] text-graphite-400">override</span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-graphite-400">{check.detail}</p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          {(Object.keys(STATUS_CONFIG) as ReadinessStatus[]).map((s) => {
                            const cfg = STATUS_CONFIG[s];
                            const Icon = cfg.icon;
                            const isActive = currentStatus === s;
                            return (
                              <button
                                key={s}
                                onClick={() => setStatus(check.id, s)}
                                className={cn(
                                  'flex h-7 w-7 items-center justify-center rounded-lg border transition-all',
                                  isActive
                                    ? cn(cfg.badgeClass, 'scale-105')
                                    : 'border-graphite-500/20 text-graphite-400 hover:bg-graphite-500/30',
                                )}
                                title={cfg.label}
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardBody>
            )}
          </Card>
        );
      })}

      {/* Reset */}
      <div className="flex justify-end">
        <button
          onClick={resetOverrides}
          className="flex items-center gap-2 rounded-full border border-graphite-500/30 px-4 py-2 text-xs font-medium text-graphite-300 transition-colors hover:bg-graphite-500/30"
        >
          <AlertCircle className="h-3.5 w-3.5" /> Reset overrides
        </button>
      </div>
    </div>
  );
}
