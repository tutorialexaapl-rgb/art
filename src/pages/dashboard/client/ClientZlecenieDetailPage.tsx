import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, FileText, ExternalLink, XCircle, Check, X, ArrowUpDown, Send, Pencil } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { CommissionComments } from '@/components/features/CommissionComments';
import { OfferCard } from '@/components/features/OfferCard';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { useClientData } from '@/hooks/useClientData';
import { useMessaging } from '@/hooks/useMessaging';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils';
import type { CommissionCommentAttachment } from '@/types';

export function ClientZlecenieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getCommission, getOffersForCommission, getCommentsForCommission,
    acceptOffer, declineOffer, closeCommission, publishCommission, addComment, deleteComment, hideComment, reportComment, allOffers, loading: dataLoading, offersError, refetch,
  } = useClientData();
  const { user } = useAuth();
  const { notify } = useToast();
  const { startCommissionConversation } = useMessaging(user?.id);

  const [acceptTarget, setAcceptTarget] = useState<string | null>(null);
  const [declineTarget, setDeclineTarget] = useState<string | null>(null);
  const [publishConfirm, setPublishConfirm] = useState(false);
  const [closeConfirm, setCloseConfirm] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'days_asc'>('newest');

  const commission = getCommission(id ?? '');
  const allCommissionOffers = commission ? getOffersForCommission(commission.id) : [];

  const sortedOffers = useMemo(() => {
    const sorted = [...allCommissionOffers];
    switch (sortBy) {
      case 'price_asc': return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc': return sorted.sort((a, b) => b.price - a.price);
      case 'days_asc': return sorted.sort((a, b) => a.estimatedDays - b.estimatedDays);
      default: return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [allCommissionOffers, sortBy]);

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-graphite-300 border-t-graphite-600" />
      </div>
    );
  }

  if (!commission) {
    return (
      <div className="text-center py-20">
        <h1 className="font-display text-2xl text-graphite-600">Zlecenie nie znalezione</h1>
        <Link to="/dashboard/client/zlecenia" className="mt-4 inline-flex"><Button variant="secondary">Wróć</Button></Link>
      </div>
    );
  }

  const comments = getCommentsForCommission(commission.id);

  const acceptOfferObj = allOffers.find((o) => o.id === acceptTarget);

  function handleSendComment(_commissionId: string, body: string, attachments: CommissionCommentAttachment[], commentType: 'question' | 'suggestion' | 'general') {
    if (!commission) return;
    addComment(commission.id, body, attachments, commentType);
    notify('success', 'Komentarz dodany.');
  }

  function handleDeleteComment(commentId: string) {
    deleteComment(commentId);
    notify('info', 'Komentarz usunięty.');
  }

  function handleReportComment(commentId: string, _reason: string) {
    reportComment(commentId, _reason);
    notify('success', 'Komentarz zgłoszony do moderacji.');
  }

  function handleHideComment(commentId: string) {
    hideComment(commentId);
    notify('info', 'Komentarz ukryty.');
  }

  async function handleMessageToArtist(artistId: string, artistName: string, artistAvatarUrl?: string) {
    if (!user || !commission) return;
    try {
      const convId = await startCommissionConversation({
        commissionId: commission.id,
        commissionTitle: commission.title,
        otherUserId: artistId,
        otherUserName: artistName,
        otherAvatarUrl: artistAvatarUrl,
        otherUserRole: 'artist',
      });
      if (convId) {
        navigate(`/dashboard/client/wiadomosci?conv=${convId}`);
      } else {
        notify('error', 'Nie udało się otworzyć rozmowy. Spróbuj ponownie.');
      }
    } catch {
      notify('error', 'Nie udało się otworzyć rozmowy. Spróbuj ponownie.');
    }
  }

  async function handleAccept() {
    if (!acceptTarget) return;
    const project = await acceptOffer(acceptTarget);
    setAcceptTarget(null);
    if (project) {
      notify('success', 'Artysta wybrany! Projekt utworzony — możesz go znaleźć w sekcji Projekty.');
      navigate(`/dashboard/client/projekty/${project.id}`);
    }
  }

  async function handleDecline() {
    if (!declineTarget) return;
    await declineOffer(declineTarget);
    setDeclineTarget(null);
    notify('info', 'Oferta odrzucona.');
  }

  async function handlePublish() {
    if (!commission) return;
    try {
      await publishCommission(commission.id);
      notify('success', 'Zlecenie opublikowane! Jest teraz widoczne dla artystów.');
    } catch {
      notify('error', 'Nie udało się opublikować zlecenia. Spróbuj ponownie.');
    }
  }

  async function handleClose() {
    if (!commission) return;
    await closeCommission(commission.id);
    notify('success', 'Zlecenie zamknięte.');
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link to="/dashboard/client/zlecenia" className="inline-flex items-center gap-2 text-sm text-graphite-400 hover:text-graphite-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Moje zlecenia
        </Link>
        <div className="flex items-center gap-3">
          <Link to={`/zlecenia/${commission.slug}`} target="_blank" className="flex items-center gap-1.5 text-sm text-graphite-400 hover:text-graphite-600 transition-colors">
            <ExternalLink className="h-4 w-4" /> Publiczny podgląd
          </Link>
          {commission.status === 'draft' && (
            <Button variant="gold" size="sm" onClick={() => setPublishConfirm(true)}>
              <Send className="h-4 w-4" /> Opublikuj zlecenie
            </Button>
          )}
          {allCommissionOffers.filter((o) => o.status !== 'withdrawn').length === 0 && (commission.status === 'draft' || commission.status === 'offers_open') && (
            <Link to={`/dashboard/client/zlecenia/${commission.id}/edytuj`}>
              <Button variant="secondary" size="sm">
                <Pencil className="h-4 w-4" /> Edytuj
              </Button>
            </Link>
          )}
          {(commission.status === 'offers_open' || commission.status === 'artist_selected' || commission.status === 'in_progress') && (
            <Button variant="ghost" size="sm" onClick={() => setCloseConfirm(true)}>
              <XCircle className="h-4 w-4" /> Zamknij zlecenie
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge status={commission.status} type="commission" />
        <span className="flex items-center gap-1 text-xs text-graphite-300"><Eye className="h-3.5 w-3.5" /> {commission.views} wyświetleń</span>
        <span className="text-xs text-graphite-300">{timeAgo(commission.createdAt)}</span>
      </div>

      <h1 className="font-display text-display text-graphite-600 text-balance">{commission.title}</h1>
      <p className="text-graphite-400 text-pretty">{commission.privateDescription}</p>

      {commission.inspirationImages.length > 0 && (
        <div>
          <h2 className="font-display text-lg text-graphite-600 mb-3">Zdjęcia inspiracyjne</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {commission.inspirationImages.map((img, i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl">
                <img src={img} alt={`Inspiracja ${i + 1} dla zlecenia`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      )}

      {commission.interiorImages.length > 0 && (
        <div>
          <h2 className="font-display text-lg text-graphite-600 mb-3">Zdjęcia wnętrza</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {commission.interiorImages.map((img, i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl">
                <img src={img} alt={`Zdjęcie wnętrza ${i + 1} dla zlecenia`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-graphite-400/10 sm:grid-cols-4">
        {[
          { label: 'Wymiary', value: `${commission.widthCm}×${commission.heightCm} cm` },
          { label: 'Styl', value: commission.style },
          { label: 'Budżet', value: `${formatCurrency(commission.budgetMin)} - ${formatCurrency(commission.budgetMax)}` },
          { label: 'Termin', value: formatDate(commission.deadline) },
        ].map((item) => (
          <div key={item.label} className="bg-ivory-50 p-5">
            <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">{item.label}</p>
            <p className="mt-1 text-sm text-graphite-600">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {commission.preferredColors.map((c) => <Badge key={c} color="clay">{c}</Badge>)}
        {commission.tags.map((t) => <Badge key={t} color="neutral">{t}</Badge>)}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Comments */}
        <div>
          <CommissionComments
            commissionId={commission.id}
            comments={comments}
            currentUser={user ? { id: user.id, displayName: user.displayName, avatarUrl: user.avatarUrl, role: user.role, status: user.status } : null}
            onAddComment={handleSendComment}
            onDeleteComment={handleDeleteComment}
            onReportComment={handleReportComment}
            onHideComment={handleHideComment}
          />
        </div>

        {/* Offers */}
        <div>
          <div className="mb-5 rounded-2xl border border-graphite-400/10 bg-ivory-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl text-graphite-600 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-graphite-300" /> Oferty artystów
                </h2>
                <p className="mt-1 text-sm text-graphite-400">
                  {sortedOffers.length > 0
                    ? `${sortedOffers.length} ${sortedOffers.length === 1 ? 'artysta odpowiedział' : sortedOffers.length < 5 ? 'artystów odpowiedziało' : 'artystów odpowiedziało'} na Twoje zlecenie`
                    : 'Gdy artyści odpowiedzą na Twoje zlecenie, ich oferty pojawią się tutaj.'}
                </p>
              </div>
              {sortedOffers.length > 1 && (
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-3.5 w-3.5 text-graphite-300" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="rounded-lg border border-graphite-400/20 bg-ivory-50 px-2 py-1 text-xs text-graphite-500"
                  >
                    <option value="newest">Najnowsze</option>
                    <option value="price_asc">Cena rosnąco</option>
                    <option value="price_desc">Cena malejąco</option>
                    <option value="days_asc">Najszybszy termin</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          {dataLoading ? (
            <LoadingState label="Ładowanie ofert..." />
          ) : offersError ? (
            <ErrorState
              title="Nie udało się pobrać ofert"
              description="Spróbuj ponownie za chwilę."
              onRetry={refetch}
            />
          ) : sortedOffers.length > 0 ? (
            <div className="space-y-4">
              {sortedOffers.map((o) => (
                <OfferCard
                  key={o.id}
                  offer={o}
                  viewer="client"
                  canAccept={commission.status === 'offers_open'}
                  onAccept={() => setAcceptTarget(o.id)}
                  onDecline={() => setDeclineTarget(o.id)}
                  onMessage={() => handleMessageToArtist(o.artistId, o.artistName, o.artistAvatarUrl)}
                  commissionId={commission.id}
                  commissionTitle={commission.title}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-graphite-400/15 bg-ivory-50/50 p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-graphite-400/5">
                <FileText className="h-5 w-5 text-graphite-300" />
              </div>
              <p className="mt-4 font-display text-base text-graphite-500">Brak ofert</p>
              <p className="mt-1.5 text-sm text-graphite-400 text-pretty max-w-sm mx-auto">
                Gdy artyści odpowiedzą na Twoje zlecenie, ich oferty pojawią się tutaj. Możesz porównać ceny, terminy i portfolio.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Accept confirmation */}
      <ConfirmDialog
        open={!!acceptTarget}
        onClose={() => setAcceptTarget(null)}
        onConfirm={handleAccept}
        title="Wybrać tego artystę?"
        description={acceptOfferObj ? `${acceptOfferObj.artistName} zostanie wybrany(a) do realizacji zlecenia za ${formatCurrency(acceptOfferObj.price)}. Pozostałe oferty zostaną odrzucone. Zostanie utworzony projekt i rozmowa z artystą.` : ''}
        confirmLabel="Wybierz artystę"
      />

      {/* Decline confirmation */}
      <ConfirmDialog
        open={!!declineTarget}
        onClose={() => setDeclineTarget(null)}
        onConfirm={handleDecline}
        title="Odrzucić ofertę?"
        description="Oferta tego artysty zostanie odrzucona. Pozostałe oferty pozostaną aktywne."
        confirmLabel="Odrzuć"
        danger
      />

      {/* Publish confirmation */}
      <ConfirmDialog
        open={publishConfirm}
        onClose={() => setPublishConfirm(false)}
        onConfirm={handlePublish}
        title="Opublikować zlecenie?"
        description="Zlecenie będzie widoczne dla artystów, którzy będą mogli składać oferty. Pełny opis zlecenia będzie dostępny dla zalogowanych artystów."
        confirmLabel="Opublikuj"
      />

      {/* Close commission confirmation */}
      <ConfirmDialog
        open={closeConfirm}
        onClose={() => setCloseConfirm(false)}
        onConfirm={handleClose}
        title="Zamknąć zlecenie?"
        description="Zlecenie zostanie zamknięte. Nie będzie widoczne w marketplace i nie przyjmie nowych ofert."
        confirmLabel="Zamknij zlecenie"
        danger
      />
    </div>
  );
}
