import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { UserRole } from '@/types';

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  return digits ? `+${digits}` : '';
}

export type AccountAvailabilityStatus =
  | 'available'
  | 'email_already_used'
  | 'phone_already_used'
  | 'account_exists_as_client'
  | 'account_exists_as_artist'
  | 'unknown_error';

export interface AccountAvailabilityResult {
  status: AccountAvailabilityStatus;
  existingRole: string | null;
}

const FRIENDLY_MESSAGES: Record<AccountAvailabilityStatus, string> = {
  available: '',
  email_already_used:
    'Na ten adres e-mail istnieje już konto. Zaloguj się do istniejącego konta albo użyj innego adresu e-mail.',
  phone_already_used:
    'Ten numer telefonu jest już przypisany do innego konta.',
  account_exists_as_client:
    'Na ten adres e-mail istnieje już konto zlecającego. Nie możesz założyć drugiego konta artysty na ten sam e-mail.',
  account_exists_as_artist:
    'Na ten adres e-mail istnieje już konto artysty. Nie możesz założyć drugiego konta zlecającego na ten sam e-mail.',
  unknown_error:
    'Nie udało się sprawdzić dostępności konta. Spróbuj ponownie za chwilę.',
};

export function getAvailabilityMessage(status: AccountAvailabilityStatus): string {
  return FRIENDLY_MESSAGES[status] ?? FRIENDLY_MESSAGES.unknown_error;
}

export async function checkAccountAvailability(
  email: string,
  phone?: string,
  requestedRole?: UserRole,
): Promise<AccountAvailabilityResult> {
  if (!isSupabaseConfigured) {
    return { status: 'available', existingRole: null };
  }

  try {
    const { data, error } = await supabase.rpc('check_account_availability', {
      p_email: normalizeEmail(email),
      p_phone: phone ? normalizePhone(phone) : null,
      p_requested_role: requestedRole ?? null,
    });

    if (error) {
      console.error('checkAccountAvailability RPC error:', error);
      return { status: 'unknown_error', existingRole: null };
    }

    const result = data as { status: string; existing_role: string | null };
    return {
      status: (result.status as AccountAvailabilityStatus) ?? 'unknown_error',
      existingRole: result.existing_role ?? null,
    };
  } catch (err) {
    console.error('checkAccountAvailability error:', err);
    return { status: 'unknown_error', existingRole: null };
  }
}

export function translateAuthError(rawError: string): string {
  const lower = rawError.toLowerCase();

  if (lower.includes('already registered') || lower.includes('already been registered')) {
    return 'Konto z tym adresem e-mail już istnieje. Zaloguj się lub użyj innego adresu.';
  }
  if (lower.includes('duplicate key') || lower.includes('unique constraint')) {
    return 'Konto z tym adresem e-mail już istnieje. Zaloguj się lub użyj innego adresu.';
  }
  if (lower.includes('email') && lower.includes('rate limit')) {
    return 'Zbyt wiele prób rejestracji. Odczekaj chwilę i spróbuj ponownie.';
  }
  if (lower.includes('password') && lower.includes('weak')) {
    return 'Hasło jest zbyt słabe. Użyj minimum 8 znaków, w tym cyfr i liter.';
  }
  if (lower.includes('invalid email') || lower.includes('unable to validate email')) {
    return 'Podany adres e-mail jest nieprawidłowy.';
  }

  return rawError;
}

export async function getExistingAccountByEmail(email: string): Promise<{ role: string } | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('email_normalized', normalizeEmail(email))
      .maybeSingle();
    if (error || !data) return null;
    return { role: data.role };
  } catch {
    return null;
  }
}

export async function canRegisterRole(email: string, requestedRole: UserRole): Promise<boolean> {
  const result = await checkAccountAvailability(email, undefined, requestedRole);
  return result.status === 'available';
}
