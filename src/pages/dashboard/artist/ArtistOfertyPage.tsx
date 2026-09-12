import { Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, ArrowLeft, Clock, Wallet, CheckCircle2, Calendar, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { Tabs } from '@/components/ui/Tabs';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useArtistData } from '@/hooks/useArtistData';
import { useMessaging } from '@/hooks/useMessaging';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useState } from 'react';
import type { CommissionOffer } from '@/types';
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils';

export function ArtistOfertyPage() {
  const { notify } = useToast();
  const { myOffers, getCommission, withdrawOffer } = useArtistData();
  const { user } = useAuth();
  const { startCommissionConversation } = useMessaging(user?.id);
  const navigate = useNavigate();
  const [withdrawTarget, setWithdrawTarget] = useState<CommissionOffer | null>(null);
  const [messagingOffer, setMessagingOffer] = useState<CommissionOffer | null>(null);

  const pending = myOffers.filter((o) => o.status === 'pending' || o.status === 'submitted' || o.status === 'viewed' || o.status === 'shortlisted');
  const accepted = myOffers.filter((o) => o.status === 'accepted');
  const declined = myOffers.filter((o) => o.status === 'rejected');
  const withdrawn = myOffers.filter((o) => o.status === 'withdrawn');

  function handleWithdraw() {
    if (!withdrawTarget) return;
    withdrawOffer(withdrawTarget.id);
    notify('info', 'Oferta wycofana.');
    setWithdrawTarget(null);
  }

  async function handleMessage(o: CommissionOffer) {
    if (!user) return;
    const commission = getCommission(o.commissionId);
    if (!commission) return;
    setMessagingOffer(o);
    try {
      const convId = await startCommissionConversation({
        commissionId: commission.id,
        commissionTitle: commission.title,
        otherUserId: commission.clientId,
        otherUserName: commission.clientName,
        otherUserRole: 'client',
      });
      if (convId) {
        navigate(`/dashboard/artist/wiadomosci?conv=${convId}`);
      } else {
        notify('error', 'Nie udało się otworzyć rozmowy. Spróbuj ponownie.');
      }
    } catch {
      notify('error', 'Nie udało się otworzyć rozmowy. Spróbuj ponownie.');
    } finally {
      setMessagingOffer(null);
    }
  }

  function renderOfferRow(o: CommissionOffer, canWithdraw: boolean) {
    const commission = getCommission(o.commissionId);
    return (
      <Card key={o.id}>
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <Link to={`/dashboard/artist/zlecenia/${o.commissionId}`} className="font-display text-lg text-graphite-600 hover:text-graphite-700 transition-colors">
              {commission?.title ?? 'Zlecenie'}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-graphite-400">
              <span className="flex items-center gap-1.5"><Wallet className="h-4 w-4 text-graphite-300" /> {formatCurrency(o.price)}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-graphite-300" /> {o.estimatedDays} dni</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-graphite-300" /> {formatDate(o.createdAt)}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-graphite-400 text-pretty">{o.message}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={o.status} type="offer" />
            {canWithdraw && (
              <Button variant="ghost" size="sm" onClick={() => setWithdrawTarget(o)}>Wycofaj</Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMessage(o)}
              disabled={messagingOffer?.id === o.id}
            >
              <MessageSquare className="h-3.5 w-3.5" /> Wiadomości
            </Button>
            <Link to={`/dashboard/artist/zlecenia/${o.commissionId}`}>
              <Button variant="secondary" size="sm">Zobacz <ArrowRight className="h-3.5 w-3.5" /></Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    );
  }

  function renderEmpty(label: string) {
    return (
      <EmptyState
        title={`Brak ofert ${label}`}
        description="Przeglądaj dostępne zlecenia i składaj oferty."
        action={<Link to="/dashboard/artist/zlecenia"><Button variant="primary">Przeglądaj zlecenia</Button></Link>}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Moje oferty" description="Oferty wysłane na zlecenia." />

      <Tabs
        defaultTab="pending"
        tabs={[
          {
            id: 'pending', label: 'Aktywne', badge: pending.length,
            content: pending.length > 0 ? <div className="space-y-4">{pending.map((o) => renderOfferRow(o, true))}</div> : renderEmpty('oczekujących'),
          },
          {
            id: 'accepted', label: 'Zaakceptowane', badge: accepted.length,
            content: accepted.length > 0 ? <div className="space-y-4">{accepted.map((o) => renderOfferRow(o, false))}</div> : renderEmpty('zaakceptowanych'),
          },
          {
            id: 'declined', label: 'Odrzucone',
            content: declined.length > 0 ? <div className="space-y-4">{declined.map((o) => renderOfferRow(o, false))}</div> : renderEmpty('odrzuconych'),
          },
          {
            id: 'withdrawn', label: 'Wycofane',
            content: withdrawn.length > 0 ? <div className="space-y-4">{withdrawn.map((o) => renderOfferRow(o, false))}</div> : renderEmpty('wycofanych'),
          },
        ]}
      />

      <ConfirmDialog
        open={!!withdrawTarget}
        onClose={() => setWithdrawTarget(null)}
        onConfirm={handleWithdraw}
        title="Wycofać ofertę?"
        description="Oferta zostanie wycofana. Zlecający nie będzie mógł jej zaakceptować."
        confirmLabel="Wycofaj"
        danger
      />
    </div>
  );
}
