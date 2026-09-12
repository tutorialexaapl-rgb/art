import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

export const isStripeConfigured = Boolean(STRIPE_PUBLISHABLE_KEY && STRIPE_PUBLISHABLE_KEY.startsWith('pk_'));

export type PaymentPhase = 'deposit' | 'final';

export interface CheckoutSessionResult {
  url: string;
  sessionId: string;
}

export interface PaymentResult {
  success: boolean;
  phase: PaymentPhase;
  projectId: string;
  error?: string;
}

async function callCheckoutEdgeFunction(
  functionName: string,
  payload: { projectId: string; amount: number; phase: PaymentPhase },
): Promise<CheckoutSessionResult> {
  const { data: session } = await supabase.auth.getSession();
  const token = session.session?.access_token;

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${functionName}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  if (!data.url || !data.sessionId) {
    throw new Error('Invalid response from checkout function');
  }

  return { url: data.url, sessionId: data.sessionId };
}

function mockCheckoutSession(projectId: string, amount: number, phase: PaymentPhase): CheckoutSessionResult {
  const sessionId = `cs_mock_${phase}_${projectId}_${Date.now()}`;
  return {
    url: `${window.location.origin}/dashboard/payment/mock?session_id=${sessionId}&phase=${phase}&project_id=${projectId}&amount=${amount}`,
    sessionId,
  };
}

export const stripeService = {
  isStripeConfigured,

  async createDepositCheckoutSession(
    projectId: string,
    amount: number,
  ): Promise<CheckoutSessionResult> {
    if (isStripeConfigured && isSupabaseConfigured) {
      return callCheckoutEdgeFunction('create-deposit-checkout', {
        projectId, amount, phase: 'deposit',
      });
    }
    return mockCheckoutSession(projectId, amount, 'deposit');
  },

  async createFinalPaymentCheckoutSession(
    projectId: string,
    amount: number,
  ): Promise<CheckoutSessionResult> {
    if (isStripeConfigured && isSupabaseConfigured) {
      return callCheckoutEdgeFunction('create-final-payment-checkout', {
        projectId, amount, phase: 'final',
      });
    }
    return mockCheckoutSession(projectId, amount, 'final');
  },

  handleStripeSuccess(
    projectId: string,
    phase: PaymentPhase,
    sessionId: string,
    onPaid: (projectId: string, phase: PaymentPhase) => void,
  ): PaymentResult {
    if (!sessionId) {
      return { success: false, phase, projectId, error: 'Brak identyfikatora sesji płatności.' };
    }
    onPaid(projectId, phase);
    return { success: true, phase, projectId };
  },

  handleStripeCancel(
    projectId: string,
    phase: PaymentPhase,
  ): PaymentResult {
    return {
      success: false,
      phase,
      projectId,
      error: phase === 'deposit'
        ? 'Płatność zaliczki została anulowana. Możesz spróbować ponownie.'
        : 'Płatność końcowa została anulowana. Możesz spróbować ponownie.',
    };
  },

  markDepositPaid(projectId: string): PaymentResult {
    return { success: true, phase: 'deposit', projectId };
  },

  markFinalPaymentPaid(projectId: string): PaymentResult {
    return { success: true, phase: 'final', projectId };
  },
};
