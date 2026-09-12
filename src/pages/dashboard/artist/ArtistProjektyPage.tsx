import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, ArrowRight, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { useArtistData } from '@/hooks/useArtistData';
import { formatCurrency, formatDate } from '@/lib/utils';

export function ArtistProjektyPage() {
  const { myProjects } = useArtistData();

  return (
    <div className="space-y-8">
      <PageHeader title="Moje projekty" description="Realizowane i zakończone projekty obrazów." />

      {myProjects.length > 0 ? (
        <div className="space-y-4">
          {myProjects.map((p) => {
            const progress = p.milestones.length > 0
              ? (p.milestones.filter((m) => m.status === 'done').length / p.milestones.length) * 100
              : 0;
            const nextMilestone = p.milestones.find((m) => m.status === 'pending' || m.status === 'in_progress');

            return (
              <Link key={p.id} to={`/dashboard/artist/projekty/${p.id}`}>
                <Card>
                  <CardBody className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar name={p.clientName} size="md" />
                      <div>
                        <h3 className="font-display text-lg text-graphite-600">{p.commissionTitle}</h3>
                        <p className="text-sm text-graphite-300">Klient: {p.clientName}</p>
                        <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-ivory-300">
                          <div className="h-full rounded-full bg-gold-400 transition-all duration-700" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      {/* Deposit status */}
                      <div className="text-right">
                        <div className="flex items-center gap-1.5">
                          {p.depositPaid
                            ? <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                            : <Clock className="h-3.5 w-3.5 text-warning" />}
                          <p className="font-mono text-xs uppercase text-graphite-300">Zaliczka</p>
                        </div>
                        <p className={`text-sm font-medium ${p.depositPaid ? 'text-success' : 'text-warning'}`}>
                          {p.depositPaid ? 'Opłacona' : 'Oczekuje'}
                        </p>
                      </div>

                      {/* Realization status */}
                      <div className="text-right">
                        <p className="font-mono text-xs uppercase text-graphite-300">Realizacja</p>
                        <p className="text-sm text-graphite-500">{Math.round(progress)}%</p>
                      </div>

                      {/* Next step */}
                      <div className="max-w-[180px] text-right">
                        <p className="font-mono text-xs uppercase text-graphite-300">Następny krok</p>
                        <p className="text-sm text-graphite-500 truncate">{nextMilestone?.title ?? 'Ukończono'}</p>
                        {nextMilestone && <p className="text-xs text-graphite-300">{formatDate(nextMilestone.dueDate)}</p>}
                      </div>

                      {/* Value + status */}
                      <div className="text-right">
                        <p className="font-mono text-xs uppercase text-graphite-300">Wartość</p>
                        <p className="font-display text-lg text-graphite-600">{formatCurrency(p.totalPrice)}</p>
                      </div>

                      <StatusBadge status={p.status} type="project" />
                    </div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Brak projektów"
          description="Projekty pojawiają się po akceptacji Twojej oferty przez zlecającego."
          action={<Link to="/dashboard/artist/zlecenia"><Button variant="primary"><Wallet className="h-4 w-4" /> Przeglądaj zlecenia</Button></Link>}
        />
      )}
    </div>
  );
}
