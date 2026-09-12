import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { detectContactAttempts, type ContactDetectionResult } from '@/lib/contactDetection';
import { logContactAttempt, logRateLimit, logDuplicateMessage } from '@/services/moderationService';

export interface AntispamCheckResult {
  blocked: boolean;
  reason: string;
  contactDetected: boolean;
  contactInfo: ContactDetectionResult;
  warning?: string;
}

const COMMENT_RATE_LIMIT = 3;
const COMMENT_WINDOW_MINUTES = 1;
const OFFER_RATE_LIMIT = 5;
const OFFER_WINDOW_HOURS = 24;
const DUPLICATE_LOOKBACK_MINUTES = 10;

function hashText(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) - h) + text.charCodeAt(i);
    h |= 0;
  }
  return `h_${Math.abs(h).toString(36)}`;
}

async function countRecentRows(
  table: string,
  userIdColumn: string,
  userId: string,
  sinceISO: string,
): Promise<number> {
  if (!isSupabaseConfigured) return 0;
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq(userIdColumn, userId)
    .gte('created_at', sinceISO);
  if (error) return 0;
  return count ?? 0;
}

async function findDuplicateMessage(
  table: string,
  userIdColumn: string,
  bodyColumn: string,
  userId: string,
  text: string,
  sinceISO: string,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const normalized = text.trim().toLowerCase().slice(0, 500);
  if (normalized.length < 10) return false;
  const { data, error } = await supabase
    .from(table)
    .select(bodyColumn)
    .eq(userIdColumn, userId)
    .gte('created_at', sinceISO)
    .limit(50);
  if (error || !data) return false;
  return data.some((row) => {
    const existing = String((row as unknown as Record<string, unknown>)[bodyColumn] ?? '').trim().toLowerCase().slice(0, 500);
    return existing === normalized;
  });
}

export const antispam = {
  async checkComment(userId: string, text: string): Promise<AntispamCheckResult> {
    const contactInfo = detectContactAttempts(text);

    if (contactInfo.hasEmail || contactInfo.hasPhone || contactInfo.hasLink) {
      await logContactAttempt(userId, 'comment', '', {
        hasEmail: contactInfo.hasEmail,
        hasPhone: contactInfo.hasPhone,
        hasLink: contactInfo.hasLink,
      }, contactInfo.matches);

      const types: string[] = [];
      if (contactInfo.hasEmail) types.push('e-mail');
      if (contactInfo.hasPhone) types.push('telefon');
      if (contactInfo.hasLink) types.push('link');

      return {
        blocked: false,
        reason: '',
        contactDetected: true,
        contactInfo,
        warning: `Wykryto próbę podania danych kontaktowych (${types.join(', ')}). Twoja wiadomość zostanie przesłana do moderacji. Podawanie kontaktu poza platformą jest zabronione.`,
      };
    }

    const sinceComment = new Date(Date.now() - COMMENT_WINDOW_MINUTES * 60_000).toISOString();
    const recentComments = await countRecentRows('commission_comments', 'author_id', userId, sinceComment);
    if (recentComments >= COMMENT_RATE_LIMIT) {
      await logRateLimit(userId, 'comment', 'comment_rate_exceeded', recentComments, COMMENT_WINDOW_MINUTES);
      return {
        blocked: true,
        reason: `Zbyt wiele komentarzy w krótkim czasie (max ${COMMENT_RATE_LIMIT} / min). Spróbuj za chwilę.`,
        contactDetected: false,
        contactInfo,
      };
    }

    const sinceDup = new Date(Date.now() - DUPLICATE_LOOKBACK_MINUTES * 60_000).toISOString();
    const isDup = await findDuplicateMessage('commission_comments', 'author_id', 'body', userId, text, sinceDup);
    if (isDup) {
      await logDuplicateMessage(userId, 'comment', '', hashText(text));
      return {
        blocked: true,
        reason: 'Wykryto powtórzoną wiadomość. Nie wysyłaj tych samych treści wielokrotnie.',
        contactDetected: false,
        contactInfo,
      };
    }

    return { blocked: false, reason: '', contactDetected: false, contactInfo };
  },

  async checkOffer(userId: string, message: string): Promise<AntispamCheckResult> {
    const contactInfo = detectContactAttempts(message);

    if (contactInfo.hasEmail || contactInfo.hasPhone || contactInfo.hasLink) {
      await logContactAttempt(userId, 'offer', '', {
        hasEmail: contactInfo.hasEmail,
        hasPhone: contactInfo.hasPhone,
        hasLink: contactInfo.hasLink,
      }, contactInfo.matches);

      const types: string[] = [];
      if (contactInfo.hasEmail) types.push('e-mail');
      if (contactInfo.hasPhone) types.push('telefon');
      if (contactInfo.hasLink) types.push('link');

      return {
        blocked: false,
        reason: '',
        contactDetected: true,
        contactInfo,
        warning: `Wykryto dane kontaktowe (${types.join(', ')}) w ofercie. Podawanie kontaktu poza platformą jest zabronione.`,
      };
    }

    const sinceOffer = new Date(Date.now() - OFFER_WINDOW_HOURS * 3_600_000).toISOString();
    const recentOffers = await countRecentRows('commission_offers', 'artist_id', userId, sinceOffer);
    if (recentOffers >= OFFER_RATE_LIMIT) {
      await logRateLimit(userId, 'offer', 'offer_rate_exceeded', recentOffers, OFFER_WINDOW_HOURS);
      return {
        blocked: true,
        reason: `Osiągnięto dzienny limit ofert (max ${OFFER_RATE_LIMIT} / 24h).`,
        contactDetected: false,
        contactInfo,
      };
    }

    return { blocked: false, reason: '', contactDetected: false, contactInfo };
  },

  async checkMessage(userId: string, text: string): Promise<AntispamCheckResult> {
    const contactInfo = detectContactAttempts(text);

    if (contactInfo.hasEmail || contactInfo.hasPhone || contactInfo.hasLink) {
      await logContactAttempt(userId, 'message', '', {
        hasEmail: contactInfo.hasEmail,
        hasPhone: contactInfo.hasPhone,
        hasLink: contactInfo.hasLink,
      }, contactInfo.matches);

      const types: string[] = [];
      if (contactInfo.hasEmail) types.push('e-mail');
      if (contactInfo.hasPhone) types.push('telefon');
      if (contactInfo.hasLink) types.push('link');

      return {
        blocked: false,
        reason: '',
        contactDetected: true,
        contactInfo,
        warning: `Wykryto próbę podania danych kontaktowych (${types.join(', ')}). Wiadomość zostanie przesłana do moderacji.`,
      };
    }

    const sinceDup = new Date(Date.now() - DUPLICATE_LOOKBACK_MINUTES * 60_000).toISOString();
    const isDup = await findDuplicateMessage('messages', 'sender_id', 'body', userId, text, sinceDup);
    if (isDup) {
      await logDuplicateMessage(userId, 'message', '', hashText(text));
      return {
        blocked: true,
        reason: 'Wykryto powtórzoną wiadomość. Nie wysyłaj tych samych treści wielokrotnie.',
        contactDetected: false,
        contactInfo,
      };
    }

    return { blocked: false, reason: '', contactDetected: false, contactInfo };
  },

  getLimits() {
    return {
      commentPerMinute: COMMENT_RATE_LIMIT,
      offerPerDay: OFFER_RATE_LIMIT,
      duplicateWindowMinutes: DUPLICATE_LOOKBACK_MINUTES,
    };
  },
};
