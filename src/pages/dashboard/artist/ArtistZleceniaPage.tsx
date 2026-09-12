import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { CommissionCard } from '@/components/features/CommissionCard';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { useArtistData } from '@/hooks/useArtistData';

const STYLE_OPTIONS = [
  'Abstrakcyjny', 'Ekspresyjny', 'Minimalistyczny', 'Klasyczny', 'Realistyczny',
  'Figuratywny', 'Impresjonistyczny', 'Geometryczny', 'Strukturalny', 'Botaniczny',
];

export function ArtistZleceniaPage() {
  const { openCommissions, hasOffered } = useArtistData();

  const [search, setSearch] = useState('');
  const [style, setStyle] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [deadline, setDeadline] = useState('');
  const [maxWidth, setMaxWidth] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return openCommissions.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (style && !c.style.toLowerCase().includes(style.toLowerCase())) return false;
      if (budgetMin && c.budgetMax < parseInt(budgetMin)) return false;
      if (budgetMax && c.budgetMin > parseInt(budgetMax)) return false;
      if (deadline && new Date(c.deadline) > new Date(deadline)) return false;
      if (maxWidth && c.widthCm > parseInt(maxWidth)) return false;
      return true;
    });
  }, [openCommissions, search, style, budgetMin, budgetMax, deadline, maxWidth]);

  function resetFilters() {
    setSearch(''); setStyle(''); setBudgetMin(''); setBudgetMax(''); setDeadline(''); setMaxWidth('');
  }

  const activeFilters = [style, budgetMin, budgetMax, deadline, maxWidth].filter(Boolean).length;

  return (
    <div className="space-y-8">
      <PageHeader title="Dostępne zlecenia" description="Przeglądaj otwarte zlecenia i aplikuj." />

      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Input
            placeholder="Szukaj zleceń..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="flex-1"
          />
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtry
            {activeFilters > 0 && (
              <span className="ml-1.5 rounded-full bg-gold-100 px-2 py-0.5 text-xs text-gold-600">{activeFilters}</span>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Select label="Styl" value={style} onChange={(e) => setStyle(e.target.value)}>
                <option value="">Wszystkie</option>
                {STYLE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              <Input label="Budżet od (PLN)" type="number" placeholder="0" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} />
              <Input label="Budżet do (PLN)" type="number" placeholder="99999" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} />
              <Input label="Termin do" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              <Input label="Max. szerokość (cm)" type="number" placeholder="200" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} />
            </div>
            {activeFilters > 0 && (
              <button onClick={resetFilters} className="mt-3 text-sm text-graphite-400 hover:text-graphite-600 transition-colors link-underline">
                Wyczyść filtry ({activeFilters})
              </button>
            )}
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => <CommissionCard key={c.id} commission={c} to={`/dashboard/artist/zlecenia/${c.slug ?? c.id}`} applied={hasOffered(c.id)} />)}
        </div>
      ) : (
        <EmptyState
          title={search || activeFilters > 0 ? 'Brak wyników' : 'Brak otwartych zleceń'}
          description={search || activeFilters > 0 ? 'Spróbuj zmienić filtry.' : 'Sprawdź później.'}
          action={activeFilters > 0 ? <Button variant="secondary" onClick={resetFilters}>Wyczyść filtry</Button> : undefined}
        />
      )}
    </div>
  );
}
