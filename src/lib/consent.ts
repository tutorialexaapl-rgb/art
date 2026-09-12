import { supabase } from '@/lib/supabase';

export const CONSENT_VERSION = '1.0';

export type ConsentType =
  | 'terms'
  | 'privacy_policy'
  | 'artist_rules'
  | 'client_rules'
  | 'commission_publication'
  | 'commission_artist_visibility'
  | 'commission_contact_private'
  | 'image_rights'
  | 'offer_rules'
  | 'comment_not_offer'
  | 'paid_applications';

/**
 * Records a consent acceptance in the consent_records table.
 * Silently fails - consent recording is an audit trail, not a gate.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function recordConsent(
  consentType: ConsentType,
  _metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('consent_records').upsert(
      {
        user_id: user.id,
        consent_type: consentType,
        version: CONSENT_VERSION,
        granted: true,
      },
      { onConflict: 'user_id,consent_type,version' },
    );
  } catch {
    // Silent fail - consent recording must not block the user flow
  }
}

/** Records multiple consents at once. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function recordConsents(
  consentTypes: ConsentType[],
  _metadata?: Record<string, unknown>,
): Promise<void> {
  await Promise.all(consentTypes.map((ct) => recordConsent(ct)));
}
