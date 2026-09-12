import { Wallet, TrendingUp, Download, Check, Clock } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { DashboardStatCard } from '@/components/ui/Dashboard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockProjects } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';

export function ArtistBillingPage() {
  const myProjects = mockProjects.filter((p) => p.artistId === 'u-artist-1');
  const totalEarned = myProjects.reduce((s, p) => s + (p.depositPaid ? p.depositAmount : 0) + (p.finalPaid ? p.finalAmount : 0), 0);
  const pending = myProjects.reduce((s, p) => s + (p.finalPaid ? 0 : p.finalAmount), 0);

  return (
    <div className="space-y-8">
      <PageHeader title="Rozliczenia" description="Przegląd zarobków i płatności." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard label="Zarobiono łącznie (zł)" value={totalEarned} icon={<Wallet className="h-5 w-5" />} />
        <DashboardStatCard label="Oczekujące (zł)" value={pending} icon={<Clock className="h-5 w-5" />} />
        <DashboardStatCard label="Aktywne projekty" value={myProjects.length} icon={<TrendingUp className="h-5 w-5" />} />
        <DashboardStatCard label="Wypłacono (zł)" value={totalEarned} icon={<Check className="h-5 w-5" />} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-graphite-600">Historia płatności</h3>
            <Button variant="ghost" size="sm"><Download className="h-4 w-4" /> Eksportuj</Button>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-graphite-400/10 text-graphite-300">
                  <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wide">Projekt</th>
                  <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wide">Klient</th>
                  <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wide">Kwota</th>
                  <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wide">Data</th>
                </tr>
              </thead>
              <tbody>
                {myProjects.map((p) => (
                  <tr key={p.id} className="border-b border-graphite-400/5 last:border-0">
                    <td className="px-6 py-4 text-graphite-600">{p.commissionTitle}</td>
                    <td className="px-6 py-4 text-graphite-400">{p.clientName}</td>
                    <td className="px-6 py-4 text-graphite-600">{formatCurrency(p.totalPrice)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.depositPaid ? 'bg-success/10 text-success-dark' : 'bg-warning/10 text-warning-dark'}`}>
                        {p.depositPaid ? 'Zaliczka opłacona' : 'Oczekuje'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-graphite-300">{formatDate(p.startDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
