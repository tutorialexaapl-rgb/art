import { Link } from 'react-router-dom';
import { FileText, Inbox, CheckCircle2, Briefcase, MessageCircle, ArrowRight, ArrowUpRight } from 'lucide-react';
import { DashboardStatCard, PageHeader } from '@/components/ui/Dashboard';
import { CommissionCard } from '@/components/features/CommissionCard';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/States';
import { useArtistData } from '@/hooks/useArtistData';
import { useCurrentProfile } from '@/hooks/useCurrentProfile';
import { timeAgo } from '@/lib/utils';

export function ArtistDashboardPage() {
  const { openCommissions, myOffers, acceptedOffers, myProjects, recentComments, myConversations } = useArtistData();
  const { artistProfile, loading: profileLoading } = useCurrentProfile();

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
      </div>
    );
  }
  if (!artistProfile) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pulpit artysty"
        description="Przegląd dostępnych zleceń, Twoich ofert i projektów."
        action={<Link to="/dashboard/artist/zlecenia"><Button variant="primary"><FileText className="h-4 w-4" /> Przeglądaj zlecenia</Button></Link>}
      />

      {/* Profile status banner */}
      <Card>
        <CardBody className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <Link
            to={`/artysci/${artistProfile.slug}`}
            className="flex min-w-0 flex-1 items-center gap-4 rounded-xl transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
            aria-label={`Zobacz publiczny profil ${artistProfile.artistName}`}
          >
            <Avatar name={artistProfile.artistName} src={artistProfile.avatarUrl} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-xl text-graphite-600">{artistProfile.artistName}</h2>
                <StatusBadge status={artistProfile.approvalStatus} type="user" />
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-graphite-400">
                <span>{artistProfile.stats.completedProjects} realizacji</span>
                <span>{artistProfile.location}</span>
                <span>{artistProfile.styles.join(', ')}</span>
              </div>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-gold-500">
                Zobacz profil publiczny <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
          <Link to="/dashboard/artist/profil" className="shrink-0">
            <Button variant="secondary" size="sm">Edytuj profil</Button>
          </Link>
        </CardBody>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard label="Dostępne zlecenia" value={openCommissions.length} icon={<FileText className="h-5 w-5" />} />
        <DashboardStatCard label="Wysłane oferty" value={myOffers.filter((o) => o.status === 'pending' || o.status === 'submitted').length} icon={<Inbox className="h-5 w-5" />} />
        <DashboardStatCard label="Zaakceptowane oferty" value={acceptedOffers.length} icon={<CheckCircle2 className="h-5 w-5" />} />
        <DashboardStatCard label="Projekty w realizacji" value={myProjects.filter((p) => p.status === 'painting_in_progress' || p.status === 'concept_stage' || p.status === 'concept_accepted').length} icon={<Briefcase className="h-5 w-5" />} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Available commissions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-graphite-600">Najnowsze zlecenia</h2>
            <Link to="/dashboard/artist/zlecenia" className="text-sm text-graphite-400 hover:text-graphite-600 transition-colors link-underline">
              Zobacz wszystkie <ArrowRight className="h-4 w-4 inline" />
            </Link>
          </div>
          {openCommissions.length > 0 ? (
            <div className="space-y-4">
              {openCommissions.slice(0, 3).map((c) => <CommissionCard key={c.id} commission={c} to={`/dashboard/artist/zlecenia/${c.slug ?? c.id}`} />)}
            </div>
          ) : (
            <EmptyState title="Brak otwartych zleceń" description="Sprawdź później." />
          )}
        </div>

        {/* Recent activity */}
        <div className="space-y-6">
          {/* Recent comments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-graphite-600 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-graphite-300" /> Ostatnie komentarze
              </h2>
              <Link to="/dashboard/artist/zlecenia" className="text-sm text-graphite-400 hover:text-graphite-600 transition-colors link-underline">Zlecenia</Link>
            </div>
            {recentComments.length > 0 ? (
              <div className="space-y-3">
                {recentComments.slice(0, 3).map((c) => {
                  const commission = openCommissions.find((co) => co.id === c.commissionId);
                  return (
                    <Link
                      key={c.id}
                      to={`/dashboard/artist/zlecenia/${c.commissionId}`}
                      className="block rounded-xl border border-graphite-400/10 bg-ivory-50 p-4 transition-colors hover:border-graphite-400/20"
                    >
                      <p className="text-sm text-graphite-500 line-clamp-2">{c.body}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-graphite-300">
                        <span>{commission?.title ?? 'Zlecenie'}</span>
                        <span>·</span>
                        <span>{timeAgo(c.createdAt)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState title="Brak komentarzy" description="Twoje komentarze do zleceń pojawią się tutaj." />
            )}
          </div>

          {/* Recent messages */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-graphite-600">Ostatnie wiadomości</h2>
              <Link to="/dashboard/artist/wiadomosci" className="text-sm text-graphite-400 hover:text-graphite-600 transition-colors link-underline">Wszystkie</Link>
            </div>
            {myConversations.length > 0 ? (
              <div className="space-y-3">
                {myConversations.slice(0, 3).map((conv) => {
                  const otherName = conv.participantNames.find((_, i) => conv.participantIds[i] !== artistProfile.userId) ?? conv.participantNames[0];
                  return (
                    <Link
                      key={conv.id}
                      to="/dashboard/artist/wiadomosci"
                      className="flex items-center gap-3 rounded-xl border border-graphite-400/10 bg-ivory-50 p-4 transition-colors hover:border-graphite-400/20"
                    >
                      <Avatar name={otherName} src={conv.participantAvatarUrls?.find((_, i) => i !== 0)} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-graphite-600 truncate">{otherName}</p>
                        <p className="text-xs text-graphite-300 truncate">{conv.lastMessageBody}</p>
                      </div>
                      {conv.unreadCount > 0 && <span className="h-2 w-2 rounded-full bg-gold-400" />}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState title="Brak wiadomości" description="Rozmowy pojawią się po akceptacji oferty." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
