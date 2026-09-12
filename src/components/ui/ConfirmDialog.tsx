import { AlertTriangle, Loader2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  confirmLabel = 'Potwierdź', cancelLabel = 'Anuluj', danger = false, loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={loading ? () => {} : onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${danger ? 'bg-error/5 text-error' : 'bg-gold-100 text-gold-500'}`}>
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="font-display text-xl text-graphite-600">{title}</h3>
        <p className="mt-2 text-sm text-graphite-400">{description}</p>
        <div className="mt-7 flex w-full gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? 'primary' : 'gold'}
            className={`flex-1 ${danger ? '!bg-error hover:!bg-error-dark' : ''}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Proszę czekać...</> : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
