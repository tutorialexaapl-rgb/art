import { useState } from 'react';
import { Send, Loader2, AlertTriangle, Info } from 'lucide-react';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CommentAttachmentUploader, type CommentAttachment } from '@/components/features/CommentAttachmentUploader';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { antispam } from '@/lib/antispam';
import { recordConsents } from '@/lib/consent';
import type { OfferErrorCode } from '@/types';

interface OfferFormProps {
  commissionBudgetMin: number;
  commissionBudgetMax: number;
  onSubmit: (data: OfferFormData) => void | Promise<void>;
  onError?: (code: OfferErrorCode) => void;
}

export interface OfferFormData {
  message: string;
  price: number;
  priceMax?: number;
  estimatedDays: number;
  scopeDescription: string;
  additionalNotes?: string;
  includesMaterials: boolean;
  includesShipping: boolean;
  includesFrame: boolean;
  depositPercent: number;
  attachments: CommentAttachment[];
}

const ERROR_MESSAGES: Record<OfferErrorCode, string> = {
  ARTIST_NOT_APPROVED: 'Twoje konto artysty nie zostało jeszcze zatwierdzone. Aplikowanie na zlecenia będzie dostępne po akceptacji profilu.',
  COMMISSION_CLOSED: 'To zlecenie nie przyjmuje już nowych ofert.',
  OFFER_ALREADY_EXISTS: 'Złożyłeś już ofertę na to zlecenie. Możesz ją wycofać, aby złożyć nową.',
  USER_SUSPENDED: 'Twoje konto jest zawieszone. Nie możesz składać ofert.',
  VALIDATION_ERROR: 'Uzupełnij wszystkie wymagane pola: wiadomość (min. 10 znaków), cena > 0, termin > 0 dni.',
};

export function OfferForm({ commissionBudgetMin, commissionBudgetMax, onSubmit, onError }: OfferFormProps) {
  const { user } = useAuth();
  const [form, setForm] = useState<OfferFormData>({
    message: '', price: commissionBudgetMin, priceMax: undefined, estimatedDays: 60,
    scopeDescription: '', additionalNotes: '',
    includesMaterials: true, includesShipping: false, includesFrame: false,
    depositPercent: 40, attachments: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<OfferErrorCode | null>(null);
  const [consentOfferRules, setConsentOfferRules] = useState(false);
  const [consentCommentNotOffer, setConsentCommentNotOffer] = useState(false);
  const [consentPaidApplications, setConsentPaidApplications] = useState(false);

  const set = <K extends keyof OfferFormData>(key: K, value: OfferFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const valid = form.message.trim().length > 10 && form.price > 0 && form.estimatedDays > 0 && form.scopeDescription.trim().length > 5 && consentOfferRules && consentCommentNotOffer && consentPaidApplications;

  const depositAmount = Math.round((form.price * form.depositPercent) / 100);

  const [antispamError, setAntispamError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      setError('VALIDATION_ERROR');
      onError?.('VALIDATION_ERROR');
      return;
    }
    setAntispamError('');
    if (user) {
      const check = await antispam.checkOffer(user.id, form.message);
      if (check.blocked) {
        setAntispamError(check.reason);
        return;
      }
    }
    setError(null);
    setSubmitting(true);
    try {
      recordConsents(['offer_rules', 'comment_not_offer', 'paid_applications'], { form: 'offer' });
      await onSubmit(form);
    } catch {
      setError('VALIDATION_ERROR');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Free-tier notice */}
      <div className="flex items-start gap-2 rounded-lg bg-success/5 px-3 py-2.5">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-dark" />
        <p className="text-xs text-graphite-400">
          Na start aplikowanie jest darmowe. W przyszłości wysłanie oferty może wymagać pakietu lub aktywnej subskrypcji.
        </p>
      </div>

      <Textarea
        label="Wiadomość do zlecającego"
        placeholder="Opisz swoje podejście do projektu, technikę, doświadczenie z podobnymi zleceniami..."
        value={form.message}
        onChange={(e) => set('message', e.target.value)}
        rows={5}
        hint="Minimum 10 znaków"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Cena (PLN)"
          type="number"
          min={0}
          value={form.price}
          onChange={(e) => set('price', parseInt(e.target.value) || 0)}
          hint={`Budżet: ${formatCurrency(commissionBudgetMin)}–${formatCurrency(commissionBudgetMax)}`}
        />
        <Input
          label="Cena max. (PLN)"
          type="number"
          min={0}
          value={form.priceMax ?? ''}
          onChange={(e) => set('priceMax', e.target.value ? parseInt(e.target.value) : undefined)}
          hint="Górna granica ceny"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Szacowany czas (dni)"
          type="number"
          min={1}
          value={form.estimatedDays}
          onChange={(e) => set('estimatedDays', parseInt(e.target.value) || 0)}
        />
        <Select label="Zaliczka (%)" value={String(form.depositPercent)} onChange={(e) => set('depositPercent', parseInt(e.target.value))}>
          <option value="30">30% - {formatCurrency(Math.round(form.price * 0.3))}</option>
          <option value="40">40% - {formatCurrency(Math.round(form.price * 0.4))}</option>
          <option value="50">50% - {formatCurrency(Math.round(form.price * 0.5))}</option>
        </Select>
      </div>
      <p className="-mt-3 text-xs text-graphite-300">
        Zaliczka: {formatCurrency(depositAmount)}, końcowa: {formatCurrency(form.price - depositAmount)}
      </p>

      <Textarea
        label="Opis zakresu pracy"
        placeholder="Opisz dokładnie, co obejmuje Twoja oferta - etapy pracy, liczba prób/studiów, materiały, werniks, certyfikat, próbki do akceptacji..."
        value={form.scopeDescription}
        onChange={(e) => set('scopeDescription', e.target.value)}
        rows={4}
        hint="Minimum 5 znaków"
      />

      <Textarea
        label="Dodatkowe uwagi (opcjonalnie)"
        placeholder="Wszystko, co warto doprecyzować - elastyczność terminu, opcje oprawy,_transport, modyfikacje..."
        value={form.additionalNotes ?? ''}
        onChange={(e) => set('additionalNotes', e.target.value)}
        rows={3}
      />

      <div className="space-y-3 rounded-xl border border-graphite-400/10 bg-ivory-100 p-4">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-ivory-200/60">
          <input
            type="checkbox"
            checked={consentOfferRules}
            onChange={(e) => setConsentOfferRules(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-gold-500"
          />
          <span>
            <span className="block text-sm font-medium text-graphite-500">Akceptuję zasady składania ofert dla artystów</span>
            <span className="mt-1 block text-xs leading-relaxed text-graphite-300">Zobacz zasady dla artystów — link w stopce strony.</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-ivory-200/60">
          <input
            type="checkbox"
            checked={consentCommentNotOffer}
            onChange={(e) => setConsentCommentNotOffer(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-gold-500"
          />
          <span>
            <span className="block text-sm font-medium text-graphite-500">Potwierdzam, że komentarz nie jest formalną ofertą</span>
            <span className="mt-1 block text-xs leading-relaxed text-graphite-300">Cenę i termin podaję w tym formularzu oferty.</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-ivory-200/60">
          <input
            type="checkbox"
            checked={consentPaidApplications}
            onChange={(e) => setConsentPaidApplications(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-gold-500"
          />
          <span>
            <span className="block text-sm font-medium text-graphite-500">Rozumiem, że aplikowanie może być płatne w przyszłości</span>
            <span className="mt-1 block text-xs leading-relaxed text-graphite-300">Na start aplikowanie jest darmowe. Docelowo może wymagać pakietu lub subskrypcji.</span>
          </span>
        </label>
      </div>

      <div className="grid gap-3 rounded-xl border border-graphite-400/10 bg-ivory-100 p-4 sm:grid-cols-3">
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-graphite-400/10 bg-ivory-50 px-3 py-3 transition-colors hover:border-gold-400/40 hover:bg-ivory-200/50">
          <input
            type="checkbox"
            checked={form.includesMaterials}
            onChange={(e) => set('includesMaterials', e.target.checked)}
            className="h-4 w-4 shrink-0 accent-gold-500"
          />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-graphite-500">Materiały</span>
            <span className="mt-0.5 block text-xs text-graphite-300">{form.includesMaterials ? 'Wliczone w cenę' : 'Poza ceną'}</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-graphite-400/10 bg-ivory-50 px-3 py-3 transition-colors hover:border-gold-400/40 hover:bg-ivory-200/50">
          <input
            type="checkbox"
            checked={form.includesFrame}
            onChange={(e) => set('includesFrame', e.target.checked)}
            className="h-4 w-4 shrink-0 accent-gold-500"
          />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-graphite-500">Oprawa (rama)</span>
            <span className="mt-0.5 block text-xs text-graphite-300">{form.includesFrame ? 'Wliczona w cenę' : 'Poza ceną'}</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-graphite-400/10 bg-ivory-50 px-3 py-3 transition-colors hover:border-gold-400/40 hover:bg-ivory-200/50">
          <input
            type="checkbox"
            checked={form.includesShipping}
            onChange={(e) => set('includesShipping', e.target.checked)}
            className="h-4 w-4 shrink-0 accent-gold-500"
          />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-graphite-500">Transport</span>
            <span className="mt-0.5 block text-xs text-graphite-300">{form.includesShipping ? 'Wliczony w cenę' : 'Poza ceną'}</span>
          </span>
        </label>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-graphite-500">Załączniki / przykładowe zdjęcia (opcjonalnie)</label>
        <CommentAttachmentUploader
          attachments={form.attachments}
          onChange={(atts) => set('attachments', atts)}
          bucket="offer-attachments"
          userId={user?.id ?? ''}
          max={5}
        />
      </div>

      {antispamError && (
        <div className="flex items-start gap-2 rounded-lg border border-error/30 bg-error/10 px-3 py-2.5">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-error" />
          <p className="text-xs font-medium text-error">{antispamError}</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-error/20 bg-error/5 px-3 py-2.5">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-error" />
          <p className="text-xs text-error">{ERROR_MESSAGES[error]}</p>
        </div>
      )}

      <Button variant="gold" className="w-full" disabled={!valid || submitting}>
        {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Składanie oferty...</> : <><Send className="h-4 w-4" /> Wyślij ofertę</>}
      </Button>
      {!consentOfferRules && !consentCommentNotOffer && !consentPaidApplications && (
        <p className="text-center text-xs text-graphite-300">Aby wysłać ofertę, zaznacz wszystkie zgody powyżej.</p>
      )}
    </form>
  );
}
