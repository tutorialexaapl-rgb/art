import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Wallet, Check, Clock, Send, ImagePlus, AlertTriangle,
  Info, Sparkles, Eye, Package, Star, MessageSquare, X, Loader2, CreditCard,
  Shield, ChevronRight, AlertCircle,
} from 'lucide-react';
import type { CommissionProject, ProjectStatus } from '@/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Timeline } from '@/components/ui/Timeline';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/States';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PaymentCard } from '@/components/features/PaymentCard';
import { useToast } from '@/context/ToastContext';
import { useProjectData } from '@/hooks/useProjectData';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils';

interface ProjectDashboardProps {
  project: CommissionProject;
  viewer: 'client' | 'artist' | 'admin';
}

const MVP_STEPS: { label: string; statuses: ProjectStatus[] }[] = [
  { label: 'Wybrano artystę', statuses: ['artist_selected', 'deposit_pending', 'deposit_paid', 'concept_stage', 'concept_accepted', 'painting_in_progress', 'preview_uploaded', 'revision_requested', 'final_accepted', 'final_payment_pending', 'fully_paid', 'delivery_preparation', 'delivered', 'completed'] },
  { label: 'Oczekiwanie na zaliczkę', statuses: ['deposit_pending', 'deposit_paid', 'concept_stage', 'concept_accepted', 'painting_in_progress', 'preview_uploaded', 'revision_requested', 'final_accepted', 'final_payment_pending', 'fully_paid', 'delivery_preparation', 'delivered', 'completed'] },
  { label: 'Zaliczka opłacona', statuses: ['deposit_paid', 'concept_stage', 'concept_accepted', 'painting_in_progress', 'preview_uploaded', 'revision_requested', 'final_accepted', 'final_payment_pending', 'fully_paid', 'delivery_preparation', 'delivered', 'completed'] },
  { label: 'Realizacja obrazu', statuses: ['painting_in_progress', 'preview_uploaded', 'revision_requested', 'final_accepted', 'final_payment_pending', 'fully_paid', 'delivery_preparation', 'delivered', 'completed'] },
  { label: 'Podgląd pracy', statuses: ['preview_uploaded', 'revision_requested', 'final_accepted', 'final_payment_pending', 'fully_paid', 'delivery_preparation', 'delivered', 'completed'] },
  { label: 'Akceptacja klienta', statuses: ['final_accepted', 'final_payment_pending', 'fully_paid', 'delivery_preparation', 'delivered', 'completed'] },
  { label: 'Płatność końcowa', statuses: ['final_payment_pending', 'fully_paid', 'delivery_preparation', 'delivered', 'completed'] },
  { label: 'Wysyłka lub odbiór', statuses: ['delivery_preparation', 'delivered', 'completed'] },
  { label: 'Zakończone', statuses: ['completed'] },
];

function getNextStep(project: CommissionProject, viewer: 'client' | 'artist' | 'admin'): { title: string; description: string; cta?: string } {
  switch (project.status) {
    case 'artist_selected':
    case 'deposit_pending':
      return viewer === 'client'
        ? { title: 'Opłać zaliczkę', description: `Realizacja formalnie rozpocznie się po opłaceniu zaliczki w wysokości ${formatCurrency(project.depositAmount)}.`, cta: 'Opłać zaliczkę' }
        : { title: 'Oczekiwanie na zaliczkę', description: 'Zlecający musi opłacić zaliczkę, aby rozpocząć realizację.' };
    case 'deposit_paid':
    case 'concept_stage':
      return viewer === 'artist'
        ? { title: 'Przygotuj koncepcję', description: 'Zaliczka opłacona. Prześlij studia koncepcyjne i oznacz etap jako gotowy do akceptacji.', cta: 'Oznacz koncepcję jako gotową' }
        : { title: 'Artysta przygotowuje koncepcję', description: 'Artysta pracuje nad studiami koncepcyjnymi.' };
    case 'concept_accepted':
      return viewer === 'artist'
        ? { title: 'Rozpocznij malowanie', description: 'Koncepcja zaakceptowana. Możesz rozpocząć realizację obrazu.', cta: 'Rozpocznij malowanie' }
        : { title: 'Artysta rozpoczyna malowanie', description: 'Koncepcja zaakceptowana. Artysta przystępuje do realizacji.' };
    case 'painting_in_progress':
      return viewer === 'artist'
        ? { title: 'Dodaj zdjęcia postępu', description: 'Wgraj zdjęcia pokazujące postęp prac. Gdy praca będzie gotowa do podglądu, oznacz to.', cta: 'Prześlij podgląd pracy' }
        : { title: 'Artysta maluje obraz', description: 'Artysta pracuje nad realizacją. Zdjęcia postępu pojawią się w panelu.' };
    case 'preview_uploaded':
      return viewer === 'client'
        ? { title: 'Zaakceptuj lub poproś o poprawki', description: 'Artysta przesłał podgląd pracy. Oceń i zaakceptuj, lub poproś o poprawki.', cta: 'Akceptuję' }
        : { title: 'Oczekiwanie na akceptację klienta', description: 'Klient przegląda przesłany podgląd pracy.' };
    case 'revision_requested':
      return viewer === 'artist'
        ? { title: 'Wprowadź poprawki', description: 'Klient poprosił o poprawki. Po naniesieniu zmian prześlij nowy podgląd.', cta: 'Prześlij poprawiony podgląd' }
        : { title: 'Artysta wprowadza poprawki', description: 'Artysta pracuje nad naniesieniem poprawek.' };
    case 'final_accepted':
      return viewer === 'client'
        ? { title: 'Opłać pozostałą kwotę', description: `Praca zaakceptowana. Opłać pozostałą kwotę: ${formatCurrency(project.finalAmount)}.`, cta: 'Opłać pozostałą kwotę' }
        : { title: 'Oczekiwanie na płatność końcową', description: 'Klient musi opłacić pozostałą kwotę.' };
    case 'final_payment_pending':
      return viewer === 'client'
        ? { title: 'Opłać pozostałą kwotę', description: `Opłać pozostałą kwotę: ${formatCurrency(project.finalAmount)}.`, cta: 'Opłać pozostałą kwotę' }
        : { title: 'Oczekiwanie na płatność końcową', description: 'Klient musi opłacić pozostałą kwotę.' };
    case 'fully_paid':
      return viewer === 'artist'
        ? { title: 'Przygotuj wysyłkę', description: 'Płatność otrzymana. Przygotuj pracę do wysyłki lub odbioru.', cta: 'Oznacz jako wysłane' }
        : { title: 'Artysta przygotowuje wysyłkę', description: 'Artysta przygotowuje pracę do wysyłki lub odbioru.' };
    case 'delivery_preparation':
      return viewer === 'artist'
        ? { title: 'Oznacz jako dostarczone', description: 'Praca została wysłana/odebrana. Oznacz jako dostarczone.', cta: 'Oznacz jako dostarczone' }
        : { title: 'Praca w drodze', description: 'Artysta przygotowuje pracę do wysyłki.' };
    case 'delivered':
      return viewer === 'artist'
        ? { title: 'Zakończ projekt', description: 'Praca dostarczona. Zamknij projekt.', cta: 'Zakończ projekt' }
        : { title: 'Praca dostarczona', description: 'Odebrałeś pracę. Projekt zostanie zamknięty przez artystę.' };
    case 'completed':
      return { title: 'Projekt zakończony', description: 'Realizacja została pomyślnie ukończona.' };
    case 'cancelled':
      return { title: 'Projekt anulowany', description: 'Realizacja została anulowana.' };
    case 'disputed':
      return { title: 'Spór otwarty', description: 'Projekt jest w stanie sporu. Administracja rozpatruje sprawę.' };
    default:
      return { title: '-', description: '' };
  }
}

export function ProjectDashboard({ project, viewer }: ProjectDashboardProps) {
  const { user } = useAuth();
  const { notify } = useToast();
  const {
    payDeposit, markConceptReady, startPainting, uploadPreview,
    acceptPreview, requestRevision, payFinal, markDelivered,
    completeProject, cancelProject, disputeProject, addMessage,
  } = useProjectData();

  const [showPayDeposit, setShowPayDeposit] = useState(false);
  const [showPayFinal, setShowPayFinal] = useState(false);
  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [showRevision, setShowRevision] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [showComplete, setShowComplete] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [messageText, setMessageText] = useState('');
  const [searchParams] = useSearchParams();

  const progress = (project.milestones.filter((m) => m.status === 'done').length / project.milestones.length) * 100;
  const nextStep = getNextStep(project, viewer);
  const mvpStepIndex = MVP_STEPS.findIndex((s) => s.statuses.includes(project.status));
  const isClient = viewer === 'client';
  const isArtist = viewer === 'artist';
  const isCancelled = project.status === 'cancelled';
  const isDisputed = project.status === 'disputed';

  // Handle Stripe redirect query params (success/cancel)
  const paymentStatus = searchParams.get('payment');
  const paymentPhase = searchParams.get('phase') as 'deposit' | 'final' | null;
  const sessionId = searchParams.get('session_id');
  useEffect(() => {
    if (paymentStatus === 'success' && paymentPhase && sessionId) {
      if (paymentPhase === 'deposit') {
        payDeposit(project.id);
      } else {
        payFinal(project.id);
      }
      notify('success', paymentPhase === 'deposit' ? 'Zaliczka opłacona! Realizacja rozpoczęta.' : 'Płatność końcowa zrealizowana!');
    } else if (paymentStatus === 'cancel' && paymentPhase) {
      notify('error', paymentPhase === 'deposit' ? 'Płatność zaliczki została anulowana.' : 'Płatność końcowa została anulowana.');
    }
  }, [paymentStatus, paymentPhase, sessionId, project.id, payDeposit, payFinal, notify]);

  function handleSendMessage() {
    if (!messageText.trim() || !user) return;
    addMessage(project.id, user.id, user.displayName, user.role === 'artist' ? 'artist' : 'client', messageText.trim());
    setMessageText('');
    notify('success', 'Wiadomość wysłana.');
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        to={isArtist ? '/dashboard/artist/projekty' : '/dashboard/client/projekty'}
        className="inline-flex items-center gap-2 text-sm text-graphite-400 hover:text-graphite-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> {isArtist ? 'Moje projekty' : 'Moje projekty'}
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={project.status} type="project" />
            <span className="text-sm text-graphite-300">{Math.round(progress)}% ukończono</span>
          </div>
          <h1 className="mt-3 font-display text-display text-graphite-600 text-balance">{project.commissionTitle}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Avatar name={isArtist ? project.clientName : project.artistName} src={isArtist ? undefined : project.artistAvatarUrl} size="md" />
          <div>
            <p className="font-mono text-xs uppercase text-graphite-300">{isArtist ? 'Klient' : 'Artysta'}</p>
            <p className="font-display text-lg text-graphite-600">{isArtist ? project.clientName : project.artistName}</p>
            {!isArtist && project.artistSlug && (
              <Link to={`/artysci/${project.artistSlug}`} className="text-xs text-graphite-300 hover:text-gold-500 transition-colors">
                Zobacz profil
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-graphite-400">Postęp realizacji</span>
          <span className="text-xs text-graphite-300">{MVP_STEPS[mvpStepIndex]?.label ?? '-'}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-ivory-300 overflow-hidden">
          <div className="h-full rounded-full bg-gold-400 transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        {/* MVP step pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {MVP_STEPS.map((step, i) => {
            const done = i < mvpStepIndex;
            const current = i === mvpStepIndex;
            return (
              <span
                key={step.label}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  done ? 'bg-gold-100 text-gold-600' :
                  current ? 'bg-graphite-600 text-ivory-100' :
                  'bg-ivory-200 text-graphite-200'
                }`}
              >
                {done && <Check className="mr-1 inline h-3 w-3" />}
                {i + 1}. {step.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Next step callout */}
      {!isCancelled && !isDisputed && (
        <div className={`rounded-2xl border p-5 ${
          nextStep.cta
            ? 'border-gold-300/40 bg-gold-50/50'
            : 'border-graphite-400/10 bg-ivory-100'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              nextStep.cta ? 'bg-gold-400 text-graphite-700' : 'bg-graphite-400/10 text-graphite-400'
            }`}>
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">Następny krok</p>
              <h3 className="mt-1 font-display text-lg text-graphite-600">{nextStep.title}</h3>
              <p className="mt-1 text-sm text-graphite-400 text-pretty">{nextStep.description}</p>
              {nextStep.cta && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {nextStep.cta === 'Opłać zaliczkę' && isClient && (
                    <Button variant="gold" size="sm" onClick={() => setShowPayDeposit(true)}>
                      <Wallet className="h-4 w-4" /> {nextStep.cta}
                    </Button>
                  )}
                  {nextStep.cta === 'Oznacz koncepcję jako gotową' && isArtist && (
                    <Button variant="gold" size="sm" onClick={() => { markConceptReady(project.id); notify('success', 'Koncepcja oznaczona jako gotowa.'); }}>
                      <Check className="h-4 w-4" /> {nextStep.cta}
                    </Button>
                  )}
                  {nextStep.cta === 'Rozpocznij malowanie' && isArtist && (
                    <Button variant="gold" size="sm" onClick={() => { startPainting(project.id); notify('success', 'Malowanie rozpoczęte.'); }}>
                      <ArrowRight className="h-4 w-4" /> {nextStep.cta}
                    </Button>
                  )}
                  {nextStep.cta === 'Prześlij podgląd pracy' && isArtist && (
                    <Button variant="gold" size="sm" onClick={() => setShowUploadPreview(true)}>
                      <ImagePlus className="h-4 w-4" /> {nextStep.cta}
                    </Button>
                  )}
                  {nextStep.cta === 'Prześlij poprawiony podgląd' && isArtist && (
                    <Button variant="gold" size="sm" onClick={() => setShowUploadPreview(true)}>
                      <ImagePlus className="h-4 w-4" /> {nextStep.cta}
                    </Button>
                  )}
                  {nextStep.cta === 'Akceptuję' && isClient && (
                    <>
                      <Button variant="gold" size="sm" onClick={() => { acceptPreview(project.id); notify('success', 'Praca zaakceptowana!'); }}>
                        <Check className="h-4 w-4" /> Akceptuję
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowRevision(true)}>
                        <AlertTriangle className="h-4 w-4" /> Poproś o poprawki
                      </Button>
                    </>
                  )}
                  {nextStep.cta === 'Opłać pozostałą kwotę' && isClient && (
                    <Button variant="gold" size="sm" onClick={() => setShowPayFinal(true)}>
                      <CreditCard className="h-4 w-4" /> {nextStep.cta}
                    </Button>
                  )}
                  {nextStep.cta === 'Oznacz jako wysłane' && isArtist && (
                    <Button variant="gold" size="sm" onClick={() => { markDelivered(project.id); notify('success', 'Oznaczono jako dostarczone.'); }}>
                      <Package className="h-4 w-4" /> {nextStep.cta}
                    </Button>
                  )}
                  {nextStep.cta === 'Oznacz jako dostarczone' && isArtist && (
                    <Button variant="gold" size="sm" onClick={() => { markDelivered(project.id); notify('success', 'Oznaczono jako dostarczone.'); }}>
                      <Package className="h-4 w-4" /> {nextStep.cta}
                    </Button>
                  )}
                  {nextStep.cta === 'Zakończ projekt' && isArtist && (
                    <Button variant="gold" size="sm" onClick={() => setShowComplete(true)}>
                      <Check className="h-4 w-4" /> {nextStep.cta}
                    </Button>
                  )}
                </div>
              )}
              {/* Artist waiting notice */}
              {isArtist && (project.status === 'artist_selected' || project.status === 'deposit_pending') && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-warning/5 px-3 py-2">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning-dark" />
                  <p className="text-xs text-graphite-400">Realizacja formalnie rozpocznie się po opłaceniu zaliczki.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="flex items-center gap-3 rounded-2xl border border-error/20 bg-error/5 p-5">
          <X className="h-5 w-5 text-error" />
          <p className="text-sm text-error">Ten projekt został anulowany.</p>
        </div>
      )}
      {isDisputed && (
        <div className="flex items-center gap-3 rounded-2xl border border-error/20 bg-error/5 p-5">
          <Shield className="h-5 w-5 text-error" />
          <p className="text-sm text-error">Projekt jest w stanie sporu. Administracja rozpatruje sprawę.</p>
        </div>
      )}

      {/* Marketplace disclaimer */}
      <div className="flex items-start gap-3 rounded-2xl border border-graphite-400/10 bg-ivory-100 p-5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-graphite-400" />
        <p className="text-xs text-graphite-400 leading-relaxed">
          Platforma pełni rolę marketplace, narzędzia komunikacji i technicznej obsługi płatności.
          Odpowiedzialność za ustalenia artystyczne, zakres pracy, jakość, termin i dostawę leży po stronie artysty i zlecającego zgodnie z <Link to="/regulamin" className="text-graphite-500 hover:text-graphite-600 underline">regulaminem</Link>.
        </p>
      </div>

      {/* Payment card */}
      <PaymentCard
        project={project}
        isClient={isClient}
        onPayDeposit={(pid) => { payDeposit(pid); notify('success', 'Zaliczka opłacona! Realizacja rozpoczęta.'); }}
        onPayFinal={(pid) => { payFinal(pid); notify('success', 'Płatność końcowa zrealizowana! Artysta przygotuje wysyłkę.'); }}
      />

      {/* Accepted offer details */}
      {project.acceptedOffer && (
        <Card>
          <CardHeader>
            <h2 className="font-display text-lg text-graphite-600">Szczegóły zaakceptowanej oferty</h2>
          </CardHeader>
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-mono text-xs uppercase text-graphite-300">Cena</p>
                <p className="mt-1 text-sm font-medium text-graphite-600">{formatCurrency(project.acceptedOffer.price)}</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase text-graphite-300">Termin</p>
                <p className="mt-1 text-sm font-medium text-graphite-600">{project.acceptedOffer.estimatedDays} dni</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase text-graphite-300">Zaliczka</p>
                <p className="mt-1 text-sm font-medium text-graphite-600">{project.acceptedOffer.depositPercent}%</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase text-graphite-300">Wliczone</p>
                <p className="mt-1 flex flex-wrap gap-1 text-xs text-graphite-500">
                  {project.acceptedOffer.includesMaterials && <span>Materiały</span>}
                  {project.acceptedOffer.includesFrame && <span>Rama</span>}
                  {project.acceptedOffer.includesShipping && <span>Transport</span>}
                </p>
              </div>
            </div>
            {project.acceptedOffer.message && (
              <div className="mt-4 border-t border-graphite-400/5 pt-4">
                <p className="text-xs font-medium text-graphite-400">Wiadomość artysty</p>
                <p className="mt-1 text-sm text-graphite-500 text-pretty leading-relaxed">{project.acceptedOffer.message}</p>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Timeline */}
        <Card>
          <CardBody>
            <h2 className="font-display text-xl text-graphite-600 mb-6">Etapy realizacji</h2>
            <Timeline milestones={project.milestones} />
          </CardBody>
        </Card>

        {/* Progress images */}
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-graphite-600">Zdjęcia postępu</h2>
              {isArtist && !isCancelled && !isDisputed && project.status !== 'completed' && (
                <Button variant="ghost" size="sm" onClick={() => setShowUploadPreview(true)}>
                  <ImagePlus className="h-4 w-4" /> Dodaj zdjęcia
                </Button>
              )}
            </div>
            {project.progressImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {project.progressImages.map((img) => (
                  <div key={img.id} className="group cursor-pointer">
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <img src={img.imageUrl} alt={img.caption} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" decoding="async" />
                    </div>
                    <p className="mt-2 text-xs text-graphite-300 line-clamp-2">{img.caption}</p>
                    {img.stage && <span className="mt-1 inline-block rounded-full bg-ivory-200 px-2 py-0.5 text-[10px] text-graphite-300">{img.stage}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Brak zdjęć" description={isArtist ? 'Dodaj zdjęcia postępu, aby klient mógł śledzić realizację.' : 'Artysta jeszcze nie dodał zdjęć postępu.'} />
            )}
          </CardBody>
        </Card>
      </div>

      {/* Messages */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-graphite-600">Wiadomości</h2>
            {project.conversationId && (
              <Link
                to={isArtist ? '/dashboard/artist/wiadomosci' : '/dashboard/client/wiadomosci'}
                className="flex items-center gap-1 text-xs text-graphite-300 hover:text-gold-500 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" /> Otwórz pełną rozmowę <ChevronRight className="h-3 w-3" />
              </Link>
            )}
          </div>
          <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
            {project.messages.length > 0 ? (
              project.messages.map((msg) => (
                <div key={msg.id} className="flex gap-4">
                  <Avatar name={msg.senderName} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-graphite-600">{msg.senderName}</span>
                      <span className="text-xs text-graphite-200">{msg.senderRole === 'artist' ? 'Artysta' : 'Zlecający'}</span>
                      <span className="text-xs text-graphite-200">{timeAgo(msg.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-graphite-500 text-pretty">{msg.body}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-graphite-300">Brak wiadomości w tym projekcie.</p>
            )}
          </div>
          {!isCancelled && !isDisputed && (
            <div className="flex gap-3 border-t border-graphite-400/10 pt-4">
              <Textarea
                placeholder="Napisz wiadomość..."
                rows={2}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <Button variant="primary" size="sm" className="self-end" onClick={handleSendMessage} disabled={!messageText.trim()}>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Danger zone */}
      {!isCancelled && !isDisputed && project.status !== 'completed' && (
        <div className="flex justify-end gap-2">
          {isClient && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowDispute(true)}>
                <Shield className="h-3.5 w-3.5" /> Otwórz spór
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowCancel(true)}>
                <X className="h-3.5 w-3.5" /> Anuluj projekt
              </Button>
            </>
          )}
        </div>
      )}

      {/* Modals */}
      {/* Upload preview */}
      <Modal open={showUploadPreview} onClose={() => setShowUploadPreview(false)} title="Prześlij zdjęcia postępu / podgląd pracy">
        <UploadPreviewForm
          onSubmit={(images) => {
            uploadPreview(project.id, images);
            setShowUploadPreview(false);
            notify('success', 'Zdjęcia przesłane. Klient otrzymał powiadomienie.');
          }}
          onCancel={() => setShowUploadPreview(false)}
        />
      </Modal>

      {/* Revision request */}
      <Modal open={showRevision} onClose={() => setShowRevision(false)} title="Poproś o poprawki" size="sm">
        <div className="space-y-4">
          <Textarea
            label="Opisz, co wymaga poprawek"
            placeholder="Np. kolor tła zbyt ciemny, proporcje postacji..."
            rows={4}
            value={revisionNote}
            onChange={(e) => setRevisionNote(e.target.value)}
          />
          <Button
            variant="primary"
            className="w-full"
            disabled={!revisionNote.trim()}
            onClick={() => { requestRevision(project.id, revisionNote.trim()); setShowRevision(false); setRevisionNote(''); notify('info', 'Poproszono o poprawki.'); }}
          >
            <Send className="h-4 w-4" /> Wyślij prośbę o poprawki
          </Button>
        </div>
      </Modal>

      {/* Complete project */}
      <ConfirmDialog
        open={showComplete}
        onClose={() => setShowComplete(false)}
        onConfirm={() => { completeProject(project.id); notify('success', 'Projekt zakończony.'); }}
        title="Zakończyć projekt?"
        description="Po zakończeniu projektu nie będzie można wprowadzać zmian. Upewnij się, że praca została dostarczona i zaakceptowana."
        confirmLabel="Zakończ projekt"
      />

      {/* Cancel project */}
      <ConfirmDialog
        open={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={() => { cancelProject(project.id); notify('info', 'Projekt anulowany.'); }}
        title="Anulować projekt?"
        description="Anulowanie projektu jest nieodwracalne. Zaliczka może zostać zwrócona zgodnie z warunkami."
        confirmLabel="Anuluj projekt"
        danger
      />

      {/* Dispute */}
      <Modal open={showDispute} onClose={() => setShowDispute(false)} title="Otwórz spór" size="sm">
        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded-lg bg-error/5 px-3 py-2.5">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-error" />
            <p className="text-xs text-graphite-400">
              Otwarcie sporu wstrzymuje realizację projektu do czasu interwencji administracji. Opisz szczegółowo problem.
            </p>
          </div>
          <Textarea
            label="Powód sporu"
            placeholder="Opisz problem, który wymagają interwencji..."
            rows={4}
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
          />
          <Button
            variant="primary"
            className="w-full !bg-error hover:!bg-error-dark"
            disabled={!disputeReason.trim()}
            onClick={() => { disputeProject(project.id, disputeReason.trim()); setShowDispute(false); setDisputeReason(''); notify('info', 'Spór otwarty. Administracja skontaktuje się z Tobą.'); }}
          >
            <Shield className="h-4 w-4" /> Otwórz spór
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function UploadPreviewForm({ onSubmit, onCancel }: { onSubmit: (images: { imageUrl: string; caption: string; stage?: string }[]) => void; onCancel: () => void }) {
  const [images, setImages] = useState<{ imageUrl: string; caption: string; stage?: string }[]>([
    { imageUrl: '', caption: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const sampleImages = [
    'https://images.pexels.com/photos/1145720/pexels-photo-1145720.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=600',
  ];

  function handleSubmit() {
    const valid = images.filter((i) => i.imageUrl && i.caption);
    if (valid.length === 0) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); onSubmit(valid); }, 500);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg bg-ivory-100 px-3 py-2.5">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-graphite-400" />
        <p className="text-xs text-graphite-400">
          Wybierz przykładowe zdjęcia lub wklej URL. W wersji produkcyjnej będzie można wgrać własne zdjęcia.
        </p>
      </div>

      {images.map((img, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-graphite-400/10 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-graphite-400">Zdjęcie {i + 1}</span>
            {images.length > 1 && (
              <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="text-graphite-300 hover:text-error">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {sampleImages.map((sample) => (
              <button
                key={sample}
                onClick={() => setImages(images.map((im, idx) => idx === i ? { ...im, imageUrl: sample } : im))}
                className={`aspect-video overflow-hidden rounded-lg border-2 transition-colors ${
                  img.imageUrl === sample ? 'border-gold-400' : 'border-graphite-400/10 hover:border-graphite-400/20'
                }`}
              >
                <img src={sample} alt="Przykładowe zdjęcie postępu" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
          <Input
            placeholder="URL zdjęcia (lub wybierz powyżej)"
            value={img.imageUrl}
            onChange={(e) => setImages(images.map((im, idx) => idx === i ? { ...im, imageUrl: e.target.value } : im))}
          />
          <Input
            placeholder="Podpis (np. „Grunt i pierwsza warstwa”)"
            value={img.caption}
            onChange={(e) => setImages(images.map((im, idx) => idx === i ? { ...im, caption: e.target.value } : im))}
          />
        </div>
      ))}

      <Button variant="ghost" size="sm" onClick={() => setImages([...images, { imageUrl: '', caption: '' }])}>
        <ImagePlus className="h-4 w-4" /> Dodaj kolejne zdjęcie
      </Button>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>Anuluj</Button>
        <Button variant="gold" className="flex-1" onClick={handleSubmit} disabled={submitting || !images.some((i) => i.imageUrl && i.caption)}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Prześlij</>}
        </Button>
      </div>
    </div>
  );
}
