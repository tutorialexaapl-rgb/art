import { useState } from 'react';
import { Flag, EyeOff, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';

interface CommentModerationActionsProps {
  commentId: string;
  isOwner: boolean;
  isAdmin: boolean;
  isHidden: boolean;
  onDelete: (commentId: string) => void;
  onReport: (commentId: string, reason: string) => void;
  onHide: (commentId: string) => void;
}

export function CommentModerationActions({
  commentId,
  isOwner,
  isAdmin,
  isHidden,
  onDelete,
  onReport,
  onHide,
}: CommentModerationActionsProps) {
  const [showReport, setShowReport] = useState(false);
  const [reason, setReason] = useState('');

  function handleReportSubmit() {
    onReport(commentId, reason.trim() || 'Naruszenie regulaminu');
    setShowReport(false);
    setReason('');
  }

  return (
    <div className="flex items-center gap-2">
      {/* Owner can delete own comment */}
      {isOwner && (
        <button
          onClick={() => onDelete(commentId)}
          className="flex items-center gap-1 text-xs text-graphite-200 transition-colors hover:text-error"
          title="Usuń swój komentarz"
        >
          <Trash2 className="h-3.5 w-3.5" /> Usuń
        </button>
      )}

      {/* Anyone (non-owner) can report */}
      {!isOwner && (
        <button
          onClick={() => setShowReport(true)}
          className="flex items-center gap-1 text-xs text-graphite-200 transition-colors hover:text-warning-dark"
          title="Zgłoś komentarz"
        >
          <Flag className="h-3.5 w-3.5" /> Zgłoś
        </button>
      )}

      {/* Admin can hide */}
      {isAdmin && !isOwner && (
        <button
          onClick={() => onHide(commentId)}
          className="flex items-center gap-1 text-xs text-graphite-200 transition-colors hover:text-error"
          title="Ukryj komentarz (admin)"
        >
          <EyeOff className="h-3.5 w-3.5" /> {isHidden ? 'Ukryty' : 'Ukryj'}
        </button>
      )}

      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-graphite-700/40 p-4" onClick={() => setShowReport(false)}>
          <div className="w-full max-w-md rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-graphite-600">Zgłoś komentarz</h3>
              <button onClick={() => setShowReport(false)} className="text-graphite-300 hover:text-graphite-500">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-graphite-400">Zgłoszenie trafi do moderacji. Podaj powód, aby pomóc zespołowi szybciej zareagować.</p>
            <Textarea
              className="mt-4"
              rows={3}
              placeholder="np. spam, nieodpowiednie treści, próba kontaktu poza platformą..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowReport(false)}>Anuluj</Button>
              <Button variant="primary" size="sm" onClick={handleReportSubmit}>
                <Flag className="h-3.5 w-3.5" /> Wyślij zgłoszenie
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
