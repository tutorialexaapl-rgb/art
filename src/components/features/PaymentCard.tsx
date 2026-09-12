import { useState } from 'react';
import {
  Wallet, CreditCard, Check, Clock, Loader2, AlertCircle, Lock, X,
} from 'lucide-react';
import type { CommissionProject } from '@/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { stripeService, isStripeConfigured, type PaymentPhase } from '@/services/stripeService';

interface PaymentCardProps {
  project: CommissionProject;
  isClient: boolean;
  onPayDeposit: (projectId: string) => void;
  onPayFinal: (projectId: string) => void;
}

type PaymentState = 'idle' | 'redirecting' | 'success' | 'failed' | 'cancelled';

export function PaymentCard({ project, isClient, onPayDeposit, onPayFinal }: PaymentCardProps) {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const canPayDeposit = !project.depositPaid && isClient &&
    (project.status === 'artist_selected' || project.status === 'deposit_pending');
  const canPayFinal = !project.finalPaid && isClient &&
    (project.status === 'final_accepted' || project.status === 'final_payment_pending');

  async function handlePayDeposit() {
    setPaymentState('redirecting');
    setPaymentError(null);
    try {
      const result = await stripeService.createDepositCheckoutSession(
        project.id,
        project.depositAmount,
      );
      if (isStripeConfigured) {
        window.location.href = result.url;
      } else {
        // Mock flow: simulate payment processing
        setTimeout(() => {
          setPaymentState('success');
        }, 1500);
      }
    } catch {
      setPaymentState('failed');
      setPaymentError('Nie udało się utworzyć sesji płatności. Spróbuj ponownie.');
    }
  }

  async function handlePayFinal() {
    setPaymentState('redirecting');
    setPaymentError(null);
    try {
      const result = await stripeService.createFinalPaymentCheckoutSession(
        project.id,
        project.finalAmount,
      );
      if (isStripeConfigured) {
        window.location.href = result.url;
      } else {
        setTimeout(() => {
          setPaymentState('success');
        }, 1500);
      }
    } catch {
      setPaymentState('failed');
      setPaymentError('Nie udało się utworzyć sesji płatności. Spróbuj ponownie.');
    }
  }

  function handleMockCancel() {
    setPaymentState('cancelled');
    setPaymentError('Płatność została anulowana. Możesz spróbować ponownie.');
  }

  function handleConfirmSuccess() {
    if (showDepositModal) {
      onPayDeposit(project.id);
    } else if (showFinalModal) {
      onPayFinal(project.id);
    }
    resetState();
  }

  function resetState() {
    setPaymentState('idle');
    setPaymentError(null);
    setShowDepositModal(false);
    setShowFinalModal(false);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-graphite-600">Płatności</h2>
            <div className="flex items-center gap-1.5 text-xs text-graphite-300">
              <Lock className="h-3 w-3" />
              <span>Stripe</span>
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {/* Summary */}
          <div className="grid gap-px overflow-hidden rounded-xl bg-graphite-400/10 sm:grid-cols-3">
            <div className="bg-ivory-50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wide text-graphite-300">Cena całkowita</p>
              <p className="mt-1 font-display text-lg text-graphite-600">{formatCurrency(project.totalPrice)}</p>
            </div>
            <div className="bg-ivory-50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wide text-graphite-300">Zaliczka ({project.acceptedOffer?.depositPercent ?? 30}%)</p>
              <p className="mt-1 font-display text-lg text-graphite-600">{formatCurrency(project.depositAmount)}</p>
            </div>
            <div className="bg-ivory-50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wide text-graphite-300">Pozostała kwota</p>
              <p className="mt-1 font-display text-lg text-graphite-600">{formatCurrency(project.finalAmount)}</p>
            </div>
          </div>

          {/* Deposit status */}
          <PaymentStatusRow
            label="Zaliczka"
            amount={project.depositAmount}
            paid={project.depositPaid}
            canPay={canPayDeposit}
            onPay={() => { setShowDepositModal(true); setPaymentState('idle'); }}
            payLabel="Opłać zaliczkę"
            icon={<Wallet className="h-4 w-4" />}
          />

          {/* Final payment status */}
          <PaymentStatusRow
            label="Płatność końcowa"
            amount={project.finalAmount}
            paid={project.finalPaid}
            canPay={canPayFinal}
            onPay={() => { setShowFinalModal(true); setPaymentState('idle'); }}
            payLabel="Opłać pozostałą kwotę"
            icon={<CreditCard className="h-4 w-4" />}
            disabledReason={!project.depositPaid ? 'Wymagana opłacona zaliczka' : undefined}
          />

          {!isStripeConfigured && (canPayDeposit || canPayFinal) && (
            <div className="flex items-start gap-2 rounded-lg bg-gold-50/50 px-3 py-2.5">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
              <p className="text-xs text-graphite-400">
                Płatności działają w trybie testowym. Po skonfigurowaniu kluczy Stripe przejdziesz do prawdziwej bramki płatności.
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Deposit payment modal */}
      <Modal
        open={showDepositModal}
        onClose={resetState}
        title="Opłać zaliczkę"
        size="sm"
      >
        <PaymentModalContent
          phase="deposit"
          amount={project.depositAmount}
          state={paymentState}
          error={paymentError}
          isStripeConfigured={isStripeConfigured}
          onConfirm={handlePayDeposit}
          onCancel={handleMockCancel}
          onSuccess={handleConfirmSuccess}
          onRetry={() => { setPaymentState('idle'); setPaymentError(null); }}
          onClose={resetState}
        />
      </Modal>

      {/* Final payment modal */}
      <Modal
        open={showFinalModal}
        onClose={resetState}
        title="Opłać pozostałą kwotę"
        size="sm"
      >
        <PaymentModalContent
          phase="final"
          amount={project.finalAmount}
          state={paymentState}
          error={paymentError}
          isStripeConfigured={isStripeConfigured}
          onConfirm={handlePayFinal}
          onCancel={handleMockCancel}
          onSuccess={handleConfirmSuccess}
          onRetry={() => { setPaymentState('idle'); setPaymentError(null); }}
          onClose={resetState}
        />
      </Modal>
    </>
  );
}

function PaymentStatusRow({
  label, amount, paid, canPay, onPay, payLabel, icon, disabledReason,
}: {
  label: string;
  amount: number;
  paid: boolean;
  canPay: boolean;
  onPay: () => void;
  payLabel: string;
  icon: React.ReactNode;
  disabledReason?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-graphite-400/10 p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          paid ? 'bg-success/10 text-success' : 'bg-graphite-400/10 text-graphite-400'
        }`}>
          {paid ? <Check className="h-4 w-4" /> : icon}
        </div>
        <div>
          <p className="text-sm font-medium text-graphite-600">{label}</p>
          <p className="text-xs text-graphite-300">{formatCurrency(amount)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {paid ? (
          <span className="flex items-center gap-1 text-xs font-medium text-success">
            <Check className="h-3 w-3" /> Opłacone
          </span>
        ) : canPay ? (
          <Button variant="gold" size="sm" onClick={onPay}>
            {icon} {payLabel}
          </Button>
        ) : disabledReason ? (
          <span className="text-xs text-graphite-200">{disabledReason}</span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-graphite-300">
            <Clock className="h-3 w-3" /> Oczekuje
          </span>
        )}
      </div>
    </div>
  );
}

function PaymentModalContent({
  phase, amount, state, error, isStripeConfigured,
  onConfirm, onCancel, onSuccess, onRetry, onClose,
}: {
  phase: PaymentPhase;
  amount: number;
  state: PaymentState;
  error: string | null;
  isStripeConfigured: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onSuccess: () => void;
  onRetry: () => void;
  onClose: () => void;
}) {
  const label = phase === 'deposit' ? 'zaliczki' : 'płatności końcowej';

  if (state === 'success') {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <Check className="h-8 w-8 text-success" />
        </div>
        <div>
          <h3 className="font-display text-lg text-graphite-600">Płatność zrealizowana</h3>
          <p className="mt-1 text-sm text-graphite-400">
            {phase === 'deposit' ? 'Zaliczka została opłacona. Realizacja się rozpocznie.' : 'Płatność końcowa zrealizowana. Artysta przygotuje wysyłkę.'}
          </p>
        </div>
        <Button variant="gold" className="w-full" onClick={onSuccess}>
          <Check className="h-4 w-4" /> Zamknij
        </Button>
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
          <AlertCircle className="h-8 w-8 text-error" />
        </div>
        <div>
          <h3 className="font-display text-lg text-graphite-600">Płatność nieudana</h3>
          <p className="mt-1 text-sm text-graphite-400">{error}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Zamknij</Button>
          <Button variant="gold" className="flex-1" onClick={onRetry}>Spróbuj ponownie</Button>
        </div>
      </div>
    );
  }

  if (state === 'cancelled') {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-graphite-400/10">
          <X className="h-8 w-8 text-graphite-400" />
        </div>
        <div>
          <h3 className="font-display text-lg text-graphite-600">Płatność anulowana</h3>
          <p className="mt-1 text-sm text-graphite-400">{error}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Zamknij</Button>
          <Button variant="gold" className="flex-1" onClick={onRetry}>Spróbuj ponownie</Button>
        </div>
      </div>
    );
  }

  if (state === 'redirecting') {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-50">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
        <div>
          <h3 className="font-display text-lg text-graphite-600">Przekierowanie do Stripe...</h3>
          <p className="mt-1 text-sm text-graphite-400">Za chwilę zostaniesz przekierowany do bezpiecznej bramki płatności.</p>
        </div>
      </div>
    );
  }

  // Idle state - confirmation screen
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-ivory-100 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-graphite-400">Kwota {label}</span>
          <span className="font-display text-xl text-graphite-600">{formatCurrency(amount)}</span>
        </div>
      </div>
      <div className="flex items-start gap-2 rounded-lg bg-success/5 px-3 py-2.5">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-dark" />
        <p className="text-xs text-graphite-400">
          {isStripeConfigured
            ? 'Płatność jest przetwarzana bezpiecznie przez Stripe. Twoje dane karty nie są przechowywane.'
            : 'Tryb testowy - płatność zostanie zasymulowana. Po skonfigurowaniu Stripe przejdziesz do prawdziwej bramki.'}
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose}>Anuluj</Button>
        <Button variant="gold" className="flex-1" onClick={onConfirm}>
          {isStripeConfigured
            ? <><CreditCard className="h-4 w-4" /> Przejdź do Stripe</>
            : <><CreditCard className="h-4 w-4" /> Symuluj płatność</>}
        </Button>
      </div>
      {isStripeConfigured && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-center text-xs text-graphite-300 underline hover:text-graphite-400"
        >
          Symuluj anulowanie (test)
        </button>
      )}
    </div>
  );
}
