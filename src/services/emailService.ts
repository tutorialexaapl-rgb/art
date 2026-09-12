import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getEmailTemplate } from '@/lib/emailTemplates';

export type NotificationType =
  | 'user_registered'
  | 'artist_profile_submitted'
  | 'artist_approved'
  | 'commission_created'
  | 'commission_approved'
  | 'new_comment'
  | 'new_offer'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'project_created'
  | 'deposit_pending'
  | 'deposit_paid'
  | 'preview_uploaded'
  | 'final_accepted'
  | 'final_payment_pending'
  | 'final_payment_paid'
  | 'new_message';

export interface EmailPayload {
  to: string;
  type: NotificationType;
  data: {
    recipientName: string;
    [key: string]: string | number | undefined;
  };
}

export interface SendEmailResult {
  success: boolean;
  message: string;
  id?: string;
}

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? window.location.origin;

async function callSendEmailEdgeFunction(payload: EmailPayload): Promise<SendEmailResult> {
  const { data: session } = await supabase.auth.getSession();
  const token = session.session?.access_token;

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
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

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      success: false,
      message: result.error || `HTTP ${response.status}`,
    };
  }

  return {
    success: true,
    message: 'E-mail wysłany pomyślnie.',
    id: result.id,
  };
}

export const emailService = {
  async sendNotificationEmail(payload: EmailPayload): Promise<SendEmailResult> {
    try {
      if (isSupabaseConfigured) {
        return await callSendEmailEdgeFunction(payload);
      }

      // Mock mode - no real e-mail sent, just simulate success
      console.info('[emailService] Mock mode - sendNotificationEmail:', payload.type, '→', payload.to);
      return {
        success: true,
        message: 'E-mail zasymulowany (tryb mock). Skonfiguruj RESEND_API_KEY, aby wysyłać prawdziwe wiadomości.',
        id: `mock_${Date.now()}`,
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Nieznany błąd wysyłania e-maila.',
      };
    }
  },

  async sendTestEmail(
    type: NotificationType,
    recipientEmail: string,
  ): Promise<SendEmailResult> {
    return this.sendNotificationEmail({
      to: recipientEmail,
      type,
      data: {
        recipientName: 'Tester',
        title: 'Testowe zlecenie - Portret olejny',
        commissionId: 'test-123',
        artistName: 'Jan Kowalski',
        actorName: 'Maria Nowak',
        amount: '4000',
        estimatedDays: '14',
        totalPrice: '4000',
        depositPercent: '30',
        depositAmount: '1200',
        finalAmount: '2800',
        commentBody: 'To jest testowy komentarz pod zleceniem.',
        messageBody: 'To jest testowa wiadomość w projekcie.',
        siteUrl: SITE_URL,
      },
    });
  },

  previewTemplate(type: NotificationType): { subject: string; html: string } {
    return getEmailTemplate(type, {
      recipientName: 'Tester',
      title: 'Testowe zlecenie - Portret olejny',
      commissionId: 'test-123',
      artistName: 'Jan Kowalski',
      actorName: 'Maria Nowak',
      amount: '4000',
      estimatedDays: '14',
      totalPrice: '4000',
      depositPercent: '30',
      depositAmount: '1200',
      finalAmount: '2800',
      commentBody: 'To jest testowy komentarz pod zleceniem.',
      messageBody: 'To jest testowa wiadomość w projekcie.',
      siteUrl: SITE_URL,
    });
  },
};
