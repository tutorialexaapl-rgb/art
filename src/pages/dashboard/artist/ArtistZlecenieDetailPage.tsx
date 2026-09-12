import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Eye, FileText, X, CheckCircle2, AlertTriangle, Info, RotateCcw, Loader2,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { CommissionComments } from '@/components/features/CommissionComments';
import { OfferForm, type OfferFormData } from '@/components/features/OfferForm';
import { OfferCard } from '@/components/features/OfferCard';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { useArtistData } from '@/hooks/useArtistData';
import { useAuth } from '@/context/AuthContext';
import { useMessaging } from '@/hooks/useMessaging';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils';
import type { CommissionCommentAttachment, OfferErrorCode } from '@/types';

export function ArtistZlecenieDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { notify } = useToast();
  const { startCommissionConversation } = useMessaging(user?.id);
  const navigate = useNavigate();
  const {
    profile, getCommission, getCommentsForCommission, getOffersForCommission,
    submitOffer, withdrawOffer, addComment, deleteComment, hideComment, reportComment,
  } = useArtistData();

  const [showOfferForm, setShowOfferForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawTarget, setWithdrawTarget] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);

  const commission = getCommission(id ?? '');

  if (!commission) {
    return (
      <div className="text-center py-20">
        <h1 className="font-display text-2xl text-graphite-600">Zlecenie nie znalezione</h1>
        <Link to="/dashboard/artist/zlecenia" className="mt-4 inline-flex"><Button variant="secondary">Wróć do zleceń</Button></Link>
      </div>
    );
  }

  const comments = getCommentsForCommission(commission.id);
  const offers = getOffersForCommission(commission.id);
  const myOffersForCommission = offers.filter((o) => o.artistId === profile?.userId);
  const myOffer = myOffersForCommission.find((o) => o.status !== 'withdrawn') ?? myOffersForCommission.find((o) => o.status === 'withdrawn');
  const hasActiveOffer = !!myOffer && myOffer.status !== 'withdrawn';
  const hasWithdrawnOffer = !!myOffer && myOffer.status === 'withdrawn';
  const commissionOpen = commission.status === 'published' || commission.status === 'offers_open';
  const isSuspended = user?.status === 'suspended';
  const withdrawOfferObj = withdrawTarget ? offers.find((o) => o.id === withdrawTarget) : null;

  async function handleMessageToClient() {
    if (!user || !commission) return;
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
    }
  }

  async function handleOfferSubmit(data: OfferFormData) {
    if (!commission) return;
    setSubmitting(true);
    try {
      await submitOffer(commission.id, {
        message: data.message,
        price: data.price,
        priceMax: data.priceMax,
        estimatedDays: data.estimatedDays,
        scopeDescription: data.scopeDescription,
        additionalNotes: data.additionalNotes,
        includesMaterials: data.includesMaterials,
        includesShipping: data.includesShipping,
        includesFrame: data.includesFrame,
        depositPercent: data.depositPercent,
      });
      setShowOfferForm(false);
      notify('success', 'Oferta wysłana!');
    } catch (err) {
      console.error('Offer submission failed:', err);
      notify('error', 'Nie udało się wysłać oferty. Spróbuj ponownie.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleOfferError(code: OfferErrorCode) {
    notify('error', `Błąd: ${code}`);
  }

  async function handleWithdrawConfirm() {
    if (!withdrawTarget) return;
    setWithdrawing(true);
    try {
      await withdrawOffer(withdrawTarget);
      setWithdrawTarget(null);
      notify('info', 'Oferta wycofana. Możesz ponownie złożyć ofertę, jeśli zlecenie jest nadal otwarte.');
    } catch (err) {
      console.error('Withdraw failed:', err);
      notify('error', 'Nie udało się wycofać oferty. Spróbuj ponownie.');
    } finally {
      setWithdrawing(false);
    }
  }

  function handleCommentAdd(_commissionId: string, body: string, attachments: CommissionCommentAttachment[], commentType: 'question' | 'suggestion' | 'general') {
    if (!commission) return;
    addComment(commission.id, body, attachments.map((a) => ({ url: a.url, filename: a.filename, mimeType: a.mimeType })), commentType);
    notify('success', 'Komentarz dodany.');
  }

  function handleCommentDelete(commentId: string) {
    deleteComment(commentId);
    notify('info', 'Komentarz usunięty.');
  }
  function handleCommentReport(commentId: string, _reason: string) {
    reportComment(commentId, _reason);
    notify('success', 'Komentarz zgłoszony.');
  }
  function handleCommentHide(commentId: string) {
    hideComment(commentId);
    notify('info', 'Komentarz ukryty.');
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link to="/dashboard/artist/zlecenia" className="inline-flex items-center gap-2 text-sm text-graphite-400 hover:text-graphite-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Dostępne zlecenia
        </Link>
        <Link to={`/zlecenia/${commission.slug}`} target="_blank" className="flex items-center gap-1.5 text-sm text-graphite-400 hover:text-graphite-600 transition-colors">
          <Eye className="h-4 w-4" /> Publiczny podgląd
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge status={commission.status} type="commission" />
        <span className="flex items-center gap-1 text-xs text-graphite-300"><Eye className="h-3.5 w-3.5" /> {commission.views} wyświetleń</span>
        <span className="text-xs text-graphite-300">{timeAgo(commission.createdAt)}</span>
      </div>

      <h1 className="font-display text-display text-graphite-600 text-balance">{commission.title}</h1>

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

      <div>
        <h2 className="font-display text-xl text-graphite-600 mb-3">Opis zlecenia</h2>
        <p className="text-graphite-500 text-pretty leading-relaxed">{commission.privateDescription}</p>
      </div>

      {commission.inspirationImages.length > 0 && (
        <div>
          <h2 className="font-display text-xl text-graphite-600 mb-3">Inspiracje</h2>
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
          <h2 className="font-display text-xl text-graphite-600 mb-3">Zdjęcia wnętrza</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {commission.interiorImages.map((img, i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl">
                <img src={img} alt={`Zdjęcie wnętrza ${i + 1} dla zlecenia`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Comments */}
        <div>
          <CommissionComments
            commissionId={commission.id}
            comments={comments}
            currentUser={user ? { id: user.id, displayName: user.displayName, avatarUrl: user.avatarUrl, role: user.role, status: user.status } : null}
            onAddComment={handleCommentAdd}
            onDeleteComment={handleCommentDelete}
            onReportComment={handleCommentReport}
            onHideComment={handleCommentHide}
          />
        </div>

        {/* Offer panel */}
        <div>
          <h2 className="font-display text-xl text-graphite-600 flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-graphite-300" /> Formalna oferta
          </h2>

          {/* Error states */}
          {isSuspended ? (
            <Card>
              <CardBody className="text-center py-8">
                <AlertTriangle className="mx-auto h-6 w-6 text-error" />
                <p className="mt-3 text-sm text-graphite-400">Twoje konto jest zawieszone. Nie możesz składać ofert.</p>
              </CardBody>
            </Card>
          ) : !commissionOpen ? (
            <Card>
              <CardBody className="text-center py-8">
                <Info className="mx-auto h-6 w-6 text-graphite-300" />
                <p className="mt-3 text-sm text-graphite-400">To zlecenie nie przyjmuje już nowych ofert.</p>
              </CardBody>
            </Card>
          ) : hasActiveOffer && myOffer ? (
            <div className="space-y-4">
              <Card>
                <CardBody className="py-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <h3 className="font-display text-base text-graphite-600">Twoja oferta</h3>
                  </div>
                  <OfferCard offer={myOffer} viewer="artist" onWithdraw={(offerId) => setWithdrawTarget(offerId)} onMessage={handleMessageToClient} commissionId={commission.id} commissionTitle={commission.title} />
                </CardBody>
              </Card>
            </div>
          ) : hasWithdrawnOffer && myOffer ? (
            <div className="space-y-4">
              <Card>
                <CardBody className="py-6">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-graphite-300" />
                    <h3 className="font-display text-base text-graphite-600">Oferta wycofana</h3>
                  </div>
                  <OfferCard offer={myOffer} viewer="artist" />
                  {commissionOpen && (showOfferForm ? (
                    <div className="mt-5 border-t border-graphite-400/10 pt-5">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="font-display text-base text-graphite-600">Nowa oferta</p>
                        <button onClick={() => setShowOfferForm(false)} className="text-graphite-300 hover:text-graphite-500">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <OfferForm
                        commissionBudgetMin={commission.budgetMin}
                        commissionBudgetMax={commission.budgetMax}
                        onSubmit={handleOfferSubmit}
                        onError={handleOfferError}
                      />
                    </div>
                  ) : (
                    <div className="mt-4">
                      <Button variant="gold" onClick={() => setShowOfferForm(true)}>
                        <RotateCcw className="h-4 w-4" /> Złóż nową ofertę
                      </Button>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </div>
          ) : showOfferForm ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base text-graphite-600">Formularz oferty</h3>
                  <button onClick={() => setShowOfferForm(false)} className="text-graphite-300 hover:text-graphite-500"><X className="h-4 w-4" /></button>
                </div>
              </CardHeader>
              <CardBody>
                <OfferForm
                  commissionBudgetMin={commission.budgetMin}
                  commissionBudgetMax={commission.budgetMax}
                  onSubmit={handleOfferSubmit}
                  onError={handleOfferError}
                />
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody className="text-center py-8">
                <p className="text-sm text-graphite-400 text-pretty">
                  Zaproponuj swoje podejście, cenę i termin realizacji. Zlecający otrzyma powiadomienie o nowej ofercie.
                </p>
                <Button variant="gold" className="mt-4" onClick={() => setShowOfferForm(true)}>
                  <FileText className="h-4 w-4" /> Złóż ofertę
                </Button>
              </CardBody>
            </Card>
          )}

          {offers.length > 0 && (
            <p className="mt-4 text-xs text-graphite-300">
              To zlecenie otrzymało {offers.length} {offers.length === 1 ? 'ofertę' : 'ofert'} od artystów.
            </p>
          )}
        </div>
      </div>

      {/* Withdraw confirmation */}
      <ConfirmDialog
        open={!!withdrawTarget}
        onClose={() => setWithdrawTarget(null)}
        onConfirm={handleWithdrawConfirm}
        title="Wycofać ofertę?"
        description={withdrawOfferObj ? `Twoja oferta za ${formatCurrency(withdrawOfferObj.price)} zostanie wycofana z tego zlecenia. Będziesz mógł ponownie złożyć ofertę, jeśli zlecenie nadal będzie otwarte.` : ''}
        confirmLabel="Wycofaj ofertę"
        danger
        loading={withdrawing}
      />
    </div>
  );
}
