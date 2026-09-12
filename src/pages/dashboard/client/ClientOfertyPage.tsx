import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/Dashboard';
import { OfferCard } from '@/components/features/OfferCard';
import { EmptyState } from '@/components/ui/States';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { useClientData } from '@/hooks/useClientData';
import { useMessaging } from '@/hooks/useMessaging';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useState } from 'react';

export function ClientOfertyPage() {
  const { offers, acceptOffer, declineOffer, commissions, getCommission } = useClientData();
  const { notify } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startCommissionConversation, conversations } = useMessaging(user?.id);
  const [messagingOfferId, setMessagingOfferId] = useState<string | null>(null);

  const pending = offers.filter((o) => o.status === 'submitted' || o.status === 'pending' || o.status === 'viewed' || o.status === 'shortlisted');
  const accepted = offers.filter((o) => o.status === 'accepted');
  const declined = offers.filter((o) => o.status === 'rejected' || o.status === 'withdrawn');

  function handleAccept(offerId: string) {
    const project = acceptOffer(offerId);
    if (project) {
      notify('success', 'Oferta zaakceptowana! Projekt utworzony.');
      navigate(`/dashboard/client/projekty/${project.id}`);
    }
  }

  function handleDecline(offerId: string) {
    declineOffer(offerId);
    notify('info', 'Oferta odrzucona.');
  }

  async function handleMessage(o: typeof offers[number]) {
    if (!user) return;
    const commission = getCommission(o.commissionId);
    if (!commission) return;
    setMessagingOfferId(o.id);
    try {
      const convId = await startCommissionConversation({
        commissionId: commission.id,
        commissionTitle: commission.title,
        otherUserId: o.artistId,
        otherUserName: o.artistName,
        otherAvatarUrl: o.artistAvatarUrl,
        otherUserRole: 'artist',
      });
      if (convId) {
        navigate(`/dashboard/client/wiadomosci?conv=${convId}`);
      } else {
        notify('error', 'Nie udało się otworzyć rozmowy. Spróbuj ponownie.');
      }
    } catch {
      notify('error', 'Nie udało się otworzyć rozmowy. Spróbuj ponownie.');
    } finally {
      setMessagingOfferId(null);
    }
  }

  function renderOfferList(list: typeof offers, canAccept: boolean) {
    if (list.length === 0) {
      return (
        <EmptyState
          title="Brak ofert"
          description="Oferty od artystów pojawią się tutaj, gdy zlecenia będą widoczne w marketplace."
          action={<Link to="/dashboard/client/zlecenia"><Button variant="secondary">Moje zlecenia</Button></Link>}
        />
      );
    }
    return (
      <div className="space-y-4">
        {list.map((o) => (
          <OfferCard
            key={o.id}
            offer={o}
            viewer="client"
            canAccept={canAccept}
            onAccept={() => handleAccept(o.id)}
            onDecline={() => handleDecline(o.id)}
            onMessage={() => handleMessage(o)}
            commissionId={o.commissionId}
            commissionTitle={getCommission(o.commissionId)?.title}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Oferty" description="Wszystkie oferty otrzymane na Twoje zlecenia." />

      <Tabs
        defaultTab="pending"
        tabs={[
          {
            id: 'pending', label: 'Oczekujące', badge: pending.length,
            content: renderOfferList(pending, true),
          },
          {
            id: 'accepted', label: 'Zaakceptowane', badge: accepted.length,
            content: renderOfferList(accepted, false),
          },
          {
            id: 'declined', label: 'Odrzucone/Wycofane', badge: declined.length,
            content: renderOfferList(declined, false),
          },
        ]}
      />
    </div>
  );
}
