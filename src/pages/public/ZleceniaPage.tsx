import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ArrowDownWideNarrow, Users, Image as ImageIcon, FileText, Palette, ChevronDown, Wallet, Clock } from 'lucide-react';
import { useStaticSeo } from '@/hooks/useSeo';
import { CommissionCard } from '@/components/features/CommissionCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/ui/States';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { usePublicCommissions } from '@/hooks/usePublicCommissions';
import { formatCurrency } from '@/lib/utils';
import { PAINTING_STYLES } from '@/lib/seo';

const allClientTypes = ['Klient indywidualny', 'Architekt wnętrz', 'Firma / Hotel'];

const STATUS_OPTIONS = [
  { value: 'published', label: 'Opublikowane' },
  { value: 'offers_open', label: 'Otwarte na oferty' },
  { value: 'in_progress', label: 'W realizacji' },
  { value: 'completed', label: 'Zakończone' },
];

const ORIENTATION_OPTIONS = [
  { value: 'landscape', label: 'Pozioma' },
  { value: 'portrait', label: 'Pionowa' },
  { value: 'square', label: 'Kwadratowa' },
];

const BUDGET_PRESETS = [
  { label: 'Poniżej 1 000 zł', min: '0', max: '1000' },
  { label: '1 000 – 3 000 zł', min: '1000', max: '3000' },
  { label: '3 000 – 5 000 zł', min: '3000', max: '5000' },
  { label: '5 000 – 10 000 zł', min: '5000', max: '10000' },
  { label: 'Powyżej 10 000 zł', min: '10000', max: '' },
];

type SortKey = 'newest' | 'deadline' | 'budget_high' | 'offers' | 'comments';
type FilterState = {
  query: string;
  statuses: string[];
  styles: string[];
  budgetMin: string;
  budgetMax: string;
  deadline: string;
  orientations: string[];
  clientTypes: string[];
  locations: string[];
};

const initialFilters: FilterState = {
  query: '', statuses: [], styles: [], budgetMin: '', budgetMax: '',
  deadline: '', orientations: [], clientTypes: [], locations: [],
};

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-graphite-400/10 pb-5">
      <button onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between text-left">
        <span className="font-display text-sm font-medium uppercase tracking-wide text-graphite-500">{title}</span>
        <ChevronDown className={`h-4 w-4 text-graphite-300 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'mt-3 max-h-[500px] opacity-100' : 'mt-0 max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}

function CheckboxOption({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-graphite-400 transition-colors hover:text-graphite-600">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
          checked
            ? 'border-gold-400 bg-gold-400'
            : 'border-graphite-300 bg-transparent hover:border-graphite-400'
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
            <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-graphite-200">{count}</span>}
    </label>
  );
}

function RadioOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-graphite-400 transition-colors hover:text-graphite-600">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
          checked ? 'border-gold-400 bg-gold-400' : 'border-graphite-300 bg-transparent hover:border-graphite-400'
        }`}
      >
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}

function CommissionFilters({
  filters,
  setFilters,
  allStyles,
  allLocations,
  commissions,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  allStyles: string[];
  allLocations: string[];
  commissions: ReturnType<typeof usePublicCommissions>['commissions'];
}) {
  const toggleArray = (key: 'statuses' | 'styles' | 'orientations' | 'clientTypes' | 'locations', value: string) => {
    setFilters((prev) => {
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const activeBudgetPreset = BUDGET_PRESETS.find(
    (p) => p.min === filters.budgetMin && p.max === filters.budgetMax
  );

  const countByStatus = (status: string) => commissions.filter((c) => c.status === status).length;
  const countByStyle = (style: string) => commissions.filter((c) => c.style.toLowerCase().includes(style.toLowerCase())).length;
  const countByLocation = (loc: string) => commissions.filter((c) => c.location === loc).length;

  return (
    <div className="space-y-5">
      <FilterSection title="Status">
        <div className="space-y-0.5">
          {STATUS_OPTIONS.map((s) => (
            <CheckboxOption
              key={s.value}
              label={s.label}
              checked={filters.statuses.includes(s.value)}
              onChange={() => toggleArray('statuses', s.value)}
              count={countByStatus(s.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Styl obrazu">
        <div className="space-y-0.5">
          {allStyles.map((s) => (
            <CheckboxOption
              key={s}
              label={s}
              checked={filters.styles.includes(s)}
              onChange={() => toggleArray('styles', s)}
              count={countByStyle(s)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Budżet">
        <div className="space-y-1">
          {BUDGET_PRESETS.map((p) => {
            const isActive = activeBudgetPreset?.label === p.label;
            return (
              <RadioOption
                key={p.label}
                label={p.label}
                checked={isActive}
                onChange={() => setFilters((prev) => ({ ...prev, budgetMin: p.min, budgetMax: p.max }))}
              />
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="od"
            value={filters.budgetMin}
            onChange={(e) => setFilters((prev) => ({ ...prev, budgetMin: e.target.value }))}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="do"
            value={filters.budgetMax}
            onChange={(e) => setFilters((prev) => ({ ...prev, budgetMax: e.target.value }))}
            className="text-sm"
          />
        </div>
      </FilterSection>

      <FilterSection title="Format i termin">
        <div className="space-y-2">
          <div>
            <label className="text-xs text-graphite-300">Orientacja</label>
            <div className="mt-1 space-y-0.5">
              {ORIENTATION_OPTIONS.map((o) => (
                <CheckboxOption
                  key={o.value}
                  label={o.label}
                  checked={filters.orientations.includes(o.value)}
                  onChange={() => toggleArray('orientations', o.value)}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-graphite-300">Termin do</label>
            <Input
              type="date"
              value={filters.deadline}
              onChange={(e) => setFilters((prev) => ({ ...prev, deadline: e.target.value }))}
              className="mt-1 text-sm"
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Zlecający" defaultOpen={false}>
        <div className="space-y-0.5">
          {allClientTypes.map((type) => (
            <CheckboxOption
              key={type}
              label={type}
              checked={filters.clientTypes.includes(type)}
              onChange={() => toggleArray('clientTypes', type)}
            />
          ))}
        </div>
      </FilterSection>

      {allLocations.length > 0 && (
        <FilterSection title="Lokalizacja" defaultOpen={false}>
          <div className="space-y-0.5">
            {allLocations.map((loc) => (
              <CheckboxOption
                key={loc}
                label={loc}
                checked={filters.locations.includes(loc)}
                onChange={() => toggleArray('locations', loc)}
                count={countByLocation(loc)}
              />
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );
}

// (removed unused placeholder)

export function ZleceniaPage() {
  useStaticSeo('/zlecenia');
  const { commissions, loading, error, refetch } = usePublicCommissions();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortKey>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const allStyles = useMemo(() => Array.from(new Set([...PAINTING_STYLES, ...commissions.map((c) => c.style).filter(Boolean)])).sort(), [commissions]);
  const allLocations = useMemo(() => Array.from(new Set(commissions.map((c) => c.location).filter(Boolean) as string[])).sort(), [commissions]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += filters.statuses.length;
    count += filters.styles.length;
    count += filters.orientations.length;
    count += filters.clientTypes.length;
    count += filters.locations.length;
    if (filters.budgetMin) count++;
    if (filters.budgetMax) count++;
    if (filters.deadline) count++;
    return count;
  }, [filters]);

  const filtered = useMemo(() => {
    let result = commissions.filter((c) => {
      if (filters.query) {
        const query = filters.query.toLowerCase();
        if (!c.title.toLowerCase().includes(query) && !c.publicSummary.toLowerCase().includes(query)) return false;
      }
      if (filters.statuses.length > 0 && !filters.statuses.includes(c.status)) return false;
      if (filters.styles.length > 0 && !filters.styles.some((s) => c.style.toLowerCase().includes(s.toLowerCase()))) return false;
      if (filters.orientations.length > 0 && !filters.orientations.includes(c.orientation)) return false;
      if (filters.locations.length > 0 && !filters.locations.includes(c.location)) return false;
      if (filters.clientTypes.length > 0 && !filters.clientTypes.some((t) => c.clientName?.toLowerCase().includes(t.toLowerCase()))) return false;
      if (filters.budgetMin && c.budgetMax < parseInt(filters.budgetMin)) return false;
      if (filters.budgetMax && c.budgetMin > parseInt(filters.budgetMax)) return false;
      if (filters.deadline && new Date(c.deadline) > new Date(filters.deadline)) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'deadline': return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'budget_high': return b.budgetMax - a.budgetMax;
        case 'offers': return b.offersCount - a.offersCount;
        case 'comments': return b.commentsCount - a.commentsCount;
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return result;
  }, [commissions, filters, sort]);

  const clearAll = () => { setFilters(initialFilters); setSort('newest'); };
  const sidebarProps = { filters, setFilters, allStyles, allLocations, commissions };

  const removeFilter = (key: 'statuses' | 'styles' | 'orientations' | 'clientTypes' | 'locations', value: string) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key].filter((v) => v !== value) }));
  };

  return (
    <div className="py-16 lg:py-20">
      <div className="container-content">
        <Reveal>
          <p className="section-label">Marketplace</p>
          <h1 className="mt-4 font-display text-display text-graphite-600">Otwarte zlecenia</h1>
          <p className="mt-4 max-w-xl text-graphite-400 text-pretty">Przeglądaj zlecenia na ręcznie malowane obrazy. Zalogowani artyści widzą pełne szczegóły i mogą aplikować.</p>
        </Reveal>

        <div className="mt-10 flex gap-8">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-5">
                <h3 className="flex items-center gap-2 font-display text-lg text-graphite-600"><SlidersHorizontal className="h-4 w-4 text-gold-500" />Filtry</h3>
                {activeFilterCount > 0 && <button onClick={clearAll} className="flex items-center gap-1 text-xs text-graphite-300 transition-colors hover:text-error"><X className="h-3.5 w-3.5" /> Wyczyść</button>}
              </div>
              <CommissionFilters {...sidebarProps} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <Reveal delay={1}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1"><Input placeholder="Szukaj zleceń..." value={filters.query} onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))} icon={<Search className="h-4 w-4" />} /></div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ArrowDownWideNarrow className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-200" />
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortKey)}
                      className="min-w-[180px] rounded-xl border border-graphite-400/15 bg-ivory-50 py-2.5 pl-10 pr-4 text-sm text-graphite-600 transition-colors focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                    >
                      <option value="newest">Najnowsze</option>
                      <option value="deadline">Najbliższy termin</option>
                      <option value="budget_high">Najwyższy budżet</option>
                      <option value="offers">Najwięcej ofert</option>
                      <option value="comments">Najwięcej komentarzy</option>
                    </select>
                  </div>
                  <Button variant="secondary" onClick={() => setMobileFiltersOpen(true)} className="whitespace-nowrap lg:hidden"><SlidersHorizontal className="h-4 w-4" />Filtry{activeFilterCount > 0 && <span className="ml-1 rounded-full bg-gold-400 px-1.5 py-0.5 text-xs font-bold text-white">{activeFilterCount}</span>}</Button>
                </div>
              </div>
            </Reveal>

            {activeFilterCount > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {filters.statuses.map((s) => {
                  const opt = STATUS_OPTIONS.find((o) => o.value === s);
                  return (
                    <button key={s} onClick={() => removeFilter('statuses', s)} className="flex items-center gap-1.5 rounded-full border border-graphite-400/15 bg-ivory-50 px-3 py-1 text-xs text-graphite-400 transition-colors hover:border-error/30 hover:text-error">
                      {opt?.label ?? s} <X className="h-3 w-3" />
                    </button>
                  );
                })}
                {filters.styles.map((s) => (
                  <button key={s} onClick={() => removeFilter('styles', s)} className="flex items-center gap-1.5 rounded-full border border-graphite-400/15 bg-ivory-50 px-3 py-1 text-xs text-graphite-400 transition-colors hover:border-error/30 hover:text-error">
                    {s} <X className="h-3 w-3" />
                  </button>
                ))}
                {filters.orientations.map((o) => {
                  const opt = ORIENTATION_OPTIONS.find((or) => or.value === o);
                  return (
                    <button key={o} onClick={() => removeFilter('orientations', o)} className="flex items-center gap-1.5 rounded-full border border-graphite-400/15 bg-ivory-50 px-3 py-1 text-xs text-graphite-400 transition-colors hover:border-error/30 hover:text-error">
                      {opt?.label ?? o} <X className="h-3 w-3" />
                    </button>
                  );
                })}
                {filters.clientTypes.map((t) => (
                  <button key={t} onClick={() => removeFilter('clientTypes', t)} className="flex items-center gap-1.5 rounded-full border border-graphite-400/15 bg-ivory-50 px-3 py-1 text-xs text-graphite-400 transition-colors hover:border-error/30 hover:text-error">
                    {t} <X className="h-3 w-3" />
                  </button>
                ))}
                {filters.locations.map((l) => (
                  <button key={l} onClick={() => removeFilter('locations', l)} className="flex items-center gap-1.5 rounded-full border border-graphite-400/15 bg-ivory-50 px-3 py-1 text-xs text-graphite-400 transition-colors hover:border-error/30 hover:text-error">
                    {l} <X className="h-3 w-3" />
                  </button>
                ))}
                {(filters.budgetMin || filters.budgetMax) && (
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, budgetMin: '', budgetMax: '' }))}
                    className="flex items-center gap-1.5 rounded-full border border-graphite-400/15 bg-ivory-50 px-3 py-1 text-xs text-graphite-400 transition-colors hover:border-error/30 hover:text-error"
                  >
                    {filters.budgetMin && filters.budgetMax
                      ? `${formatCurrency(parseInt(filters.budgetMin))} – ${formatCurrency(parseInt(filters.budgetMax))}`
                      : filters.budgetMin
                        ? `od ${formatCurrency(parseInt(filters.budgetMin))}`
                        : `do ${formatCurrency(parseInt(filters.budgetMax))}`}
                    <X className="h-3 w-3" />
                  </button>
                )}
                {filters.deadline && (
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, deadline: '' }))}
                    className="flex items-center gap-1.5 rounded-full border border-graphite-400/15 bg-ivory-50 px-3 py-1 text-xs text-graphite-400 transition-colors hover:border-error/30 hover:text-error"
                  >
                    <Clock className="h-3 w-3" /> do {filters.deadline} <X className="h-3 w-3" />
                  </button>
                )}
                <button onClick={clearAll} className="text-xs text-graphite-300 underline transition-colors hover:text-error">
                  Wyczyść wszystkie
                </button>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 text-sm text-graphite-300"><Wallet className="h-4 w-4" />{loading ? 'Ładowanie...' : `${filtered.length} ${filtered.length === 1 ? 'zlecenie' : 'zleceń'}`}</div>

            {loading ? (
              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="overflow-hidden rounded-2xl border border-graphite-400/10 bg-ivory-50"><LoadingSkeleton className="aspect-[16/10] rounded-none" /><div className="space-y-3 p-6"><LoadingSkeleton className="h-5 w-3/4" /><LoadingSkeleton className="h-4 w-full" /><LoadingSkeleton className="h-4 w-2/3" /><div className="flex gap-2 pt-2"><LoadingSkeleton className="h-6 w-16 rounded-full" /><LoadingSkeleton className="h-6 w-20 rounded-full" /></div></div></div>)}</div>
            ) : error ? (
              <ErrorState title="Nie udało się pobrać zleceń" description={error} onRetry={refetch} />
            ) : filtered.length > 0 ? (
              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filtered.map((c, i) => <Reveal key={c.id} delay={((i % 3) + 1) as 1 | 2 | 3}><CommissionCard commission={c} isPublicPreview /></Reveal>)}</div>
            ) : (
              <EmptyState title="Brak zleceń" description="Spróbuj zmienić kryteria wyszukiwania lub wyczyść filtry." action={activeFilterCount > 0 ? <Button variant="secondary" onClick={clearAll}>Wyczyść filtry</Button> : undefined} />
            )}
          </div>
        </div>
      </div>

      <Drawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} title="Filtry" side="left">
        <div className="flex items-center justify-between pb-4">{activeFilterCount > 0 && <button onClick={clearAll} className="flex items-center gap-1.5 text-xs text-graphite-300 transition-colors hover:text-error"><X className="h-3.5 w-3.5" /> Wyczyść wszystkie</button>}</div>
        <CommissionFilters {...sidebarProps} />
        <Button variant="primary" className="mt-6 w-full" onClick={() => setMobileFiltersOpen(false)}>Pokaż {filtered.length} {filtered.length === 1 ? 'zlecenie' : 'zleceń'}</Button>
      </Drawer>

      <InternalLinksGrid label="Powiązane strony" title="Zobacz też" links={[
        { href: '/artysci', label: 'Artyści malarze', description: 'Poznaj zweryfikowanych artystów z portfolio i specjalizacjami.', icon: Users },
        { href: '/obrazy-na-zamowienie', label: 'Obrazy na zamówienie', description: 'Główna strona - style, wnętrza, proces i FAQ.', icon: ImageIcon },
        { href: '/zamow-obraz', label: 'Zamów obraz', description: 'Załóż konto i opublikuj własne zlecenie na obraz.', icon: FileText },
        { href: '/zlec-obraz', label: 'Jak zlecić obraz', description: 'Przewodnik krok po kroku - od pomysłu do realizacji.', icon: Palette },
      ]} />
    </div>
  );
}
