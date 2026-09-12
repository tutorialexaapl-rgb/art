import { useState } from 'react';
import { Flag, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea, Select } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { createReport } from '@/services/moderationService';
import type { ModerationTarget } from '@/types';

const REPORT_REASONS: Record<ModerationTarget, string[]> = {
  commission: ['Spam lub oszustwo', 'Treść niezgodna z regulaminem', 'Niewłaściwe treści', 'Inne'],
  comment: ['Spam', 'Niewłaściwe treści', 'Próba obejścia kontaktu', 'Wulgaryzmy', 'Inne'],
  offer: ['Spam', 'Próba obejścia kontaktu', 'Niewłaściwe treści', 'Inne'],
  portfolio_item: ['Niewłaściwe treści', 'Spam', 'Inne'],
  profile: ['Fałszywy profil', 'Niewłaściwe treści', 'Spam', 'Inne'],
  message: ['Spam', 'Niewłaściwe treści', 'Próba obejścia kontaktu', 'Inne'],
};

interface ReportButtonProps {
  targetType: ModerationTarget;
  targetId: string;
  variant?: 'icon' | 'text';
  className?: string;
}

export function ReportButton({ targetType, targetId, variant = 'icon', className = '' }: ReportButtonProps) {
  const { user } = useAuth();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  async function handleSubmit() {
    if (!reason || !description.trim()) {
      notify('error', 'Wybierz powód i dodaj opis.');
      return;
    }
    setSubmitting(true);
    try {
      await createReport({
        targetId,
        targetType,
        reportedBy: user!.id,
        reportedByName: user!.displayName,
        reason,
        description: description.trim(),
      });
      notify('success', 'Zgłoszenie wysłane. Administracja je sprawdzi.');
      setOpen(false);
      setReason('');
      setDescription('');
    } catch {
      notify('error', 'Nie udało się wysłać zgłoszenia.');
    } finally {
      setSubmitting(false);
    }
  }

  const reasons = REPORT_REASONS[targetType] ?? ['Inne'];

  return (
    <>
      {variant === 'icon' ? (
        <button
          onClick={() => setOpen(true)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-graphite-300 transition-colors hover:bg-error/10 hover:text-error-light ${className}`}
          title="Zgłoś"
        >
          <Flag className="h-4 w-4" />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className={`inline-flex items-center gap-1.5 text-xs text-graphite-300 transition-colors hover:text-error-light ${className}`}
        >
          <Flag className="h-3.5 w-3.5" /> Zgłoś
        </button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Zgłoś treść" size="sm">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Powód zgłoszenia</label>
            <Select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">Wybierz powód...</option>
              {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Opis (wymagane)</label>
            <Textarea
              rows={3}
              placeholder="Opisz szczegółowo, co jest nie tak z tą treścią..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setOpen(false)}>Anuluj</Button>
            <Button
              variant="primary"
              className="flex-1 !bg-error hover:!bg-error-dark"
              onClick={handleSubmit}
              disabled={submitting || !reason || !description.trim()}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flag className="h-4 w-4" />}
              {submitting ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
