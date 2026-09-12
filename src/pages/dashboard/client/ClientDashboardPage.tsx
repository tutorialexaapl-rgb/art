import { Link } from 'react-router-dom';
import { FileText, Inbox, MessageCircle, Briefcase, Plus, ArrowRight, Mail, Store, Palette, Sparkles } from 'lucide-react';
import { DashboardStatCard, PageHeader } from '@/components/ui/Dashboard';
import { CommissionCard } from '@/components/features/CommissionCard';
import { OfferCard } from '@/components/features/OfferCard';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/States';
import { useClientData } from '@/hooks/useClientData';
import { timeAgo } from '@/lib/utils';

export function ClientDashboardPage() {
  const { commissions, offers, projects, conversations } = useClientData();

  const activeCommissions = commissions.filter((c) => c.status === 'offers_open' || c.status === 'artist_selected' || c.status === 'in_progress');
  const pendingOffers = offers.filter((o) => o.status === 'submitted' || o.status === 'pending' || o.status === 'viewed' || o.status === 'shortlisted');
  const activeProjects = projects.filter((p) => p.status !== 'completed' && p.status !== 'cancelled' && p.status !== 'disputed');
  const totalComments = commissions.reduce((s, c) => s + c.commentsCount, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pulpit zlecającego"
        description="Przegląd Twoich zleceń, ofert i projektów."
        action={<Link to="/dashboard/client/zlecenia/nowe"><Button variant="primary"><Plus className="h-4 w-4" /> Nowe zlecenie</Button></Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard to="/dashboard/client/zlecenia" label="Aktywne zlecenia" value={activeCommissions.length} icon={<FileText className="h-5 w-5" />} />
        <DashboardStatCard to="/dashboard/client/oferty" label="Otrzymane oferty" value={offers.length} icon={<Inbox className="h-5 w-5" />} trend={pendingOffers.length > 0 ? { value: `${pendingOffers.length} oczekuje`, positive: true } : undefined} />
        <DashboardStatCard to="/dashboard/client/wiadomosci" label="Komentarze" value={totalComments} icon={<MessageCircle className="h-5 w-5" />} />
        <DashboardStatCard to="/dashboard/client/projekty" label="Projekty w realizacji" value={activeProjects.length} icon={<Briefcase className="h-5 w-5" />} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-graphite-600">Aktywne zlecenia</h2>
          <Link to="/dashboard/client/zlecenia" className="text-sm text-graphite-400 hover:text-graphite-600 transition-colors link-underline">Zobacz wszystkie</Link>
        </div>
        {activeCommissions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeCommissions.slice(0, 3).map((c) => (
              <CommissionCard key={c.id} commission={c} to={`/dashboard/client/zlecenia/${c.id}`} />
            ))}
          </div>
        ) : (
          <EmptyState title="Brak aktywnych zleceń" description="Opublikuj swoje pierwsze zlecenie, aby otrzymać oferty od artystów." action={<Link to="/dashboard/client/zlecenia/nowe"><Button variant="primary">Nowe zlecenie</Button></Link>} />
        )}
      </div>

      {/* Inspiration cards: Marketplace + Artists */}
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/dashboard/client/marketplace"
          className="group rounded-2xl border border-graphite-400/10 bg-gradient-to-br from-ivory-50 to-ivory-100 p-6 transition-colors hover:border-gold-400/20"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-gold-50 p-3">
              <Store className="h-6 w-6 text-gold-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg text-graphite-600 group-hover:text-graphite-700 transition-colors">Marketplace zleceń</h3>
              <p className="mt-1 text-sm text-graphite-400">Zobacz przykładowe potrzeby innych zlecających i zainspiruj się przed publikacją własnego briefu.</p>
              <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-gold-500 group-hover:text-gold-600 transition-colors">
                Przeglądaj zlecenia <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </Link>
        <Link
          to="/dashboard/client/artysci"
          className="group rounded-2xl border border-graphite-400/10 bg-gradient-to-br from-ivory-50 to-ivory-100 p-6 transition-colors hover:border-gold-400/20"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-gold-50 p-3">
              <Palette className="h-6 w-6 text-gold-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg text-graphite-600 group-hover:text-graphite-700 transition-colors">Artyści</h3>
              <p className="mt-1 text-sm text-graphite-400">Przeglądaj profile artystów, portfolio i style, aby znaleźć twórcę pasującego do Twojego zlecenia.</p>
              <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-gold-500 group-hover:text-gold-600 transition-colors">
                Zobacz artystów <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent offers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-graphite-600">Ostatnie oferty</h2>
            <Link to="/dashboard/client/oferty" className="text-sm text-graphite-400 hover:text-graphite-600 transition-colors link-underline">Wszystkie</Link>
          </div>
          {pendingOffers.length > 0 ? (
            <div className="space-y-4">
              {pendingOffers.slice(0, 2).map((o) => <OfferCard key={o.id} offer={o} viewer="client" />)}
            </div>
          ) : (
            <EmptyState title="Brak nowych ofert" description="Oferty od artystów pojawią się tutaj." />
          )}
        </div>

        {/* Recent messages */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-graphite-600">Ostatnie wiadomości</h2>
            <Link to="/dashboard/client/wiadomosci" className="text-sm text-graphite-400 hover:text-graphite-600 transition-colors link-underline">Wszystkie</Link>
          </div>
          {conversations.length > 0 ? (
            <div className="space-y-3">
              {conversations.slice(0, 4).map((conv) => (
                <Link
                  key={conv.id}
                  to="/dashboard/client/wiadomosci"
                  className="flex items-center gap-3 rounded-xl border border-graphite-400/10 bg-ivory-50 p-4 transition-colors hover:border-graphite-400/20"
                >
                  <Avatar
                    name={conv.participantNames.find((_, i) => conv.participantIds[i] !== conv.participantIds[0]) ?? conv.participantNames[0]}
                    src={conv.participantAvatarUrls?.find((_, i) => i !== 0)}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-graphite-600 truncate">
                      {conv.participantNames.find((_, i) => conv.participantIds[i] !== conv.participantIds[0]) ?? conv.participantNames[0]}
                    </p>
                    <p className="text-xs text-graphite-300 truncate">{conv.lastMessageBody}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-graphite-200">{conv.lastMessageAt ? timeAgo(conv.lastMessageAt) : ''}</span>
                    {conv.unreadCount > 0 && <span className="h-2 w-2 rounded-full bg-gold-400" />}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="Brak wiadomości" description="Rozmowy z artystami pojawią się po akceptacji oferty." />
          )}
        </div>
      </div>

      {projects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-graphite-600">Projekty w realizacji</h2>
            <Link to="/dashboard/client/projekty" className="text-sm text-graphite-400 hover:text-graphite-600 transition-colors link-underline">Zobacz wszystkie</Link>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 2).map((p) => (
              <Link key={p.id} to={`/dashboard/client/projekty/${p.id}`} className="flex items-center justify-between rounded-xl border border-graphite-400/10 bg-ivory-50 p-4 transition-colors hover:border-graphite-400/20">
                <div className="flex items-center gap-3">
                  <Avatar name={p.artistName} src={p.artistAvatarUrl} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-graphite-600">{p.commissionTitle}</p>
                    <p className="text-xs text-graphite-300">{p.artistName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gold-500">
                  <Mail className="h-4 w-4" />
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
