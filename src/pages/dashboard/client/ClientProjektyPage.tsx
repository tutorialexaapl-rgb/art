import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { useClientData } from '@/hooks/useClientData';
import { formatCurrency, formatDate } from '@/lib/utils';

export function ClientProjektyPage() {
  const { projects } = useClientData();

  return (
    <div className="space-y-8">
      <PageHeader title="Projekty" description="Realizowane i zakończone projekty obrazów." />

      {projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((p) => {
            const progress = p.milestones.length > 0
              ? (p.milestones.filter((m) => m.status === 'done').length / p.milestones.length) * 100
              : 0;
            return (
              <Link key={p.id} to={`/dashboard/client/projekty/${p.id}`}>
                <Card>
                  <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar name={p.artistName} src={p.artistAvatarUrl} size="md" />
                      <div>
                        <h3 className="font-display text-lg text-graphite-600">{p.commissionTitle}</h3>
                        <p className="text-sm text-graphite-300">Artysta: {p.artistName}</p>
                        <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-ivory-300">
                          <div className="h-full rounded-full bg-gold-400 transition-all duration-700" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-mono text-xs uppercase text-graphite-300">Wartość</p>
                        <p className="font-display text-lg text-graphite-600">{formatCurrency(p.totalPrice)}</p>
                      </div>
                      <div className="hidden text-right sm:block">
                        <p className="font-mono text-xs uppercase text-graphite-300">Ukończenie</p>
                        <p className="text-sm text-graphite-500">{formatDate(p.estimatedCompletion)}</p>
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
        <EmptyState title="Brak projektów" description="Projekty pojawiają się po akceptacji oferty." action={<Link to="/dashboard/client/zlecenia"><Button variant="primary">Moje zlecenia</Button></Link>} />
      )}
    </div>
  );
}
