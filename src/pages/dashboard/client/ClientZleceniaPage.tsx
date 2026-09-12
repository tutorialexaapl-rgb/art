import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil, XCircle, MessageCircle, FileText, Search } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/States';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useClientData } from '@/hooks/useClientData';
import { useToast } from '@/context/ToastContext';
import { formatCurrency, formatDateShort, timeAgo } from '@/lib/utils';
import type { Commission } from '@/types';

export function ClientZleceniaPage() {
  const { commissions, closeCommission, allOffers } = useClientData();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [closeTarget, setCloseTarget] = useState<Commission | null>(null);

  const filtered = commissions.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  async function handleClose() {
    if (!closeTarget) return;
    await closeCommission(closeTarget.id);
    notify('success', 'Zlecenie zostało zamknięte.');
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Moje zlecenia"
        description="Zarządzaj swoimi zleceniami na obrazy."
        action={<Link to="/dashboard/client/zlecenia/nowe"><Button variant="primary"><Plus className="h-4 w-4" /> Nowe zlecenie</Button></Link>}
      />

      {commissions.length > 0 && (
        <Input
          placeholder="Szukaj zleceń..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />
      )}

      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-graphite-400/10">
          <table className="w-full text-sm">
            <thead className="bg-ivory-100">
              <tr className="text-left">
                <th className="px-5 py-4 font-mono text-xs uppercase tracking-wide text-graphite-300">Tytuł</th>
                <th className="px-5 py-4 font-mono text-xs uppercase tracking-wide text-graphite-300">Status</th>
                <th className="hidden px-5 py-4 font-mono text-xs uppercase tracking-wide text-graphite-300 sm:table-cell">Budżet</th>
                <th className="hidden px-5 py-4 font-mono text-xs uppercase tracking-wide text-graphite-300 md:table-cell">Termin</th>
                <th className="hidden px-5 py-4 font-mono text-xs uppercase tracking-wide text-graphite-300 lg:table-cell">Komentarze</th>
                <th className="hidden px-5 py-4 font-mono text-xs uppercase tracking-wide text-graphite-300 lg:table-cell">Oferty</th>
                <th className="px-5 py-4 text-right font-mono text-xs uppercase tracking-wide text-graphite-300">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-400/5 bg-ivory-50">
              {filtered.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-ivory-100/50 cursor-pointer" onClick={() => navigate(`/dashboard/client/zlecenia/${c.id}`)}>
                  <td className="px-5 py-4">
                    <span className="font-display text-base text-graphite-600 hover:text-graphite-700 transition-colors">
                      {c.title}
                    </span>
                    <p className="text-xs text-graphite-300 mt-0.5">Opublikowano {timeAgo(c.createdAt)}</p>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={c.status} type="commission" /></td>
                  <td className="hidden px-5 py-4 text-graphite-500 sm:table-cell">{formatCurrency(c.budgetMin)} - {formatCurrency(c.budgetMax)}</td>
                  <td className="hidden px-5 py-4 text-graphite-400 md:table-cell">{formatDateShort(c.deadline)}</td>
                  <td className="hidden px-5 py-4 lg:table-cell">
                    <span className="flex items-center gap-1 text-graphite-400"><MessageCircle className="h-3.5 w-3.5" /> {c.commentsCount}</span>
                  </td>
                  <td className="hidden px-5 py-4 lg:table-cell">
                    <span className="flex items-center gap-1 text-graphite-400"><FileText className="h-3.5 w-3.5" /> {allOffers.filter((o) => o.commissionId === c.id && o.status !== 'withdrawn').length}</span>
                  </td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <Link to={`/dashboard/client/zlecenia/${c.id}`} title="Zobacz" className="rounded-lg p-2 text-graphite-300 hover:bg-ivory-200 hover:text-graphite-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </Link>
                      {c.status === 'offers_open' && allOffers.filter((o) => o.commissionId === c.id && o.status !== 'withdrawn').length === 0 && (
                        <Link to={`/dashboard/client/zlecenia/${c.id}/edytuj`} title="Edytuj" className="rounded-lg p-2 text-graphite-300 hover:bg-ivory-200 hover:text-graphite-600 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      )}
                      {c.status === 'draft' && (
                        <Link to={`/dashboard/client/zlecenia/${c.id}/edytuj`} title="Edytuj" className="rounded-lg p-2 text-graphite-300 hover:bg-ivory-200 hover:text-graphite-600 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      )}
                      {(c.status === 'offers_open' || c.status === 'in_progress') && (
                        <button
                          onClick={() => setCloseTarget(c)}
                          title="Zamknij zlecenie"
                          className="rounded-lg p-2 text-graphite-300 hover:bg-error/5 hover:text-error transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title={search ? 'Brak wyników' : 'Brak zleceń'}
          description={search ? 'Spróbuj zmienić wyszukiwanie.' : 'Opublikuj swoje pierwsze zlecenie, aby otrzymać oferty od artystów.'}
          action={!search && <Link to="/dashboard/client/zlecenia/nowe"><Button variant="primary">Nowe zlecenie</Button></Link>}
        />
      )}

      <ConfirmDialog
        open={!!closeTarget}
        onClose={() => setCloseTarget(null)}
        onConfirm={handleClose}
        title="Zamknąć zlecenie?"
        description={closeTarget ? `Zlecenie „${closeTarget.title}" zostanie zamknięte. Nie będzie widoczne w marketplace i nie przyjmie nowych ofert.` : ''}
        confirmLabel="Zamknij zlecenie"
        danger
      />
    </div>
  );
}
