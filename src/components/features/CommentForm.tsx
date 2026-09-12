import { useState, useCallback } from 'react';
import { Send, Loader2, AlertTriangle, HelpCircle, Lightbulb, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Textarea, Checkbox } from '@/components/ui/Input';
import { CommentAttachmentUploader } from '@/components/features/CommentAttachmentUploader';
import type { CommentAttachment } from '@/components/features/CommentAttachmentUploader';
export type { CommentAttachment };
import { detectContactAttempts } from '@/lib/contactDetection';
import { antispam } from '@/lib/antispam';
import { recordConsents } from '@/lib/consent';

type CommentType = 'question' | 'suggestion' | 'general';

interface CommentFormProps {
  currentUser: { id: string; displayName: string; avatarUrl?: string };
  isSuspended?: boolean;
  onSubmit: (body: string, attachments: CommentAttachment[], commentType: CommentType) => void;
  loginRedirect?: string;
}

const TYPE_OPTIONS: { value: CommentType; label: string; icon: typeof HelpCircle }[] = [
  { value: 'question', label: 'Pytanie', icon: HelpCircle },
  { value: 'suggestion', label: 'Sugestia', icon: Lightbulb },
  { value: 'general', label: 'Komentarz', icon: MessageCircle },
];

export function CommentForm({ currentUser, isSuspended, onSubmit }: CommentFormProps) {
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<CommentAttachment[]>([]);
  const [commentType, setCommentType] = useState<CommentType>('general');
  const [submitting, setSubmitting] = useState(false);
  const [contactWarning, setContactWarning] = useState(false);
  const [antispamError, setAntispamError] = useState('');
  const [consentOfferRules, setConsentOfferRules] = useState(false);
  const [consentCommentNotOffer, setConsentCommentNotOffer] = useState(false);
  const [consentPaidApplications, setConsentPaidApplications] = useState(false);

  const handleTextChange = useCallback((text: string) => {
    setBody(text);
    const detection = detectContactAttempts(text);
    setContactWarning(detection.hasEmail || detection.hasPhone || detection.hasLink);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setAntispamError('');
    const check = await antispam.checkComment(currentUser.id, body.trim());
    if (check.blocked) {
      setAntispamError(check.reason);
      return;
    }
    if (check.warning) {
      setContactWarning(true);
    }
    setSubmitting(true);
    setTimeout(() => {
      onSubmit(body.trim(), attachments, commentType);
      recordConsents(['offer_rules', 'comment_not_offer', 'paid_applications'], { form: 'comment' });
      setBody('');
      setAttachments([]);
      setCommentType('general');
      setContactWarning(false);
      setAntispamError('');
      setSubmitting(false);
    }, 300);
  }

  if (isSuspended) {
    return (
      <div className="rounded-xl border border-error/20 bg-error/5 p-5 text-center">
        <AlertTriangle className="mx-auto h-6 w-6 text-error" />
        <p className="mt-3 text-sm text-graphite-500">
          Twoje konto jest zawieszone. Nie możesz dodawać komentarzy ani ofert.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Avatar name={currentUser.displayName} src={currentUser.avatarUrl} size="sm" />
      <div className="flex-1">
        {/* Info banner */}
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-gold-50 px-3 py-2">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" />
          <p className="text-xs text-graphite-400">
            Komentarz służy do zadania pytania lub pokazania inspiracji. Formalną cenę i termin podaj w ofercie.
          </p>
        </div>

        {/* Type selector */}
        <div className="mb-3 flex gap-2">
          {TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCommentType(opt.value)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  commentType === opt.value
                    ? 'bg-graphite-600 text-ivory-100'
                    : 'bg-ivory-200 text-graphite-300 hover:text-graphite-500'
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {opt.label}
              </button>
            );
          })}
        </div>

        <Textarea
          placeholder={
            commentType === 'question'
              ? 'Zadaj pytanie zlecającemu - np. o wymiary, materiały, technikę...'
              : commentType === 'suggestion'
              ? 'Podziel się sugestią artystyczną - np. proponowaną techniką, paletą, kompozycją...'
              : 'Dodaj komentarz lub pokaż inspirację...'
          }
          value={body}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={3}
        />

        {contactWarning && (
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-error/20 bg-error/5 px-3 py-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-error" />
            <p className="text-xs text-error">
              Wykryto próbę podania danych kontaktowych (e-mail, telefon lub link). Prosimy o kontakt wyłącznie przez platformę - dane kontaktowe zostaną usunięte, a zdarzenie zgłoszone do moderacji.
            </p>
          </div>
        )}

        {antispamError && (
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-error/30 bg-error/10 px-3 py-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-error" />
            <p className="text-xs font-medium text-error">{antispamError}</p>
          </div>
        )}

        <div className="mt-3">
          <CommentAttachmentUploader attachments={attachments} onChange={setAttachments} bucket="commission-comment-attachments" userId={currentUser.id} max={3} />
        </div>

        <div className="mt-3 space-y-2 rounded-lg border border-graphite-400/10 bg-ivory-100 p-3">
          <Checkbox
            id="commentConsentOfferRules"
            label={<><Link to="/zasady-dla-artystow" className="text-graphite-400 hover:text-graphite-600 underline">Akceptuję zasady składania ofert</Link> dla artystów.</>}
            checked={consentOfferRules}
            onChange={(e) => setConsentOfferRules(e.target.checked)}
          />
          <Checkbox
            id="commentConsentNotOffer"
            label={<>Rozumiem, że komentarz nie jest formalną ofertą.</>}
            checked={consentCommentNotOffer}
            onChange={(e) => setConsentCommentNotOffer(e.target.checked)}
          />
          <Checkbox
            id="commentConsentPaid"
            label={<>Rozumiem, że docelowo aplikowanie na zlecenia może być płatne.</>}
            checked={consentPaidApplications}
            onChange={(e) => setConsentPaidApplications(e.target.checked)}
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-graphite-200">{body.length > 0 && `${body.length} znaków`}</span>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!body.trim() || submitting || !consentOfferRules || !consentCommentNotOffer || !consentPaidApplications}
          >
            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Opublikuj
          </Button>
        </div>
      </div>
    </div>
  );
}
