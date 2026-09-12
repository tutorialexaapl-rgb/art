import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { CommissionComment, CommissionCommentAttachment, UserRole, UserStatus } from '@/types';
import { CommentCard } from '@/components/features/CommentCard';
import { CommentForm, type CommentAttachment } from '@/components/features/CommentForm';
interface CommissionCommentsProps {
  commissionId: string;
  comments: CommissionComment[];
  currentUser: { id: string; displayName: string; avatarUrl?: string; role: UserRole; status: UserStatus } | null;
  onAddComment: (commissionId: string, body: string, attachments: CommissionCommentAttachment[], commentType: 'question' | 'suggestion' | 'general') => void;
  onDeleteComment: (commentId: string) => void;
  onReportComment: (commentId: string, reason: string) => void;
  onHideComment: (commentId: string) => void;
}

export function CommissionComments({
  commissionId,
  comments,
  currentUser,
  onAddComment,
  onDeleteComment,
  onReportComment,
  onHideComment,
}: CommissionCommentsProps) {
  const [reported, setReported] = useState<string[]>([]);

  if (!currentUser) {
    const guestVisibleComments = comments.filter((c) => !c.isHidden);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-graphite-600 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-graphite-300" /> Komentarze
          </h2>
          <Badge color="neutral">{guestVisibleComments.length}</Badge>
        </div>

        {guestVisibleComments.length > 0 ? (
          <div className="divide-y divide-graphite-400/5">
            {guestVisibleComments.map((c) => (
              <CommentCard
                key={c.id}
                comment={c}
                currentUserId=""
                isAdmin={false}
                onDelete={() => {}}
                onReport={() => {}}
                onHide={() => {}}
              />
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-graphite-300">Brak komentarzy.</p>
        )}

        <div className="rounded-2xl border border-graphite-400/10 bg-ivory-200 p-6 text-center">
          <LogIn className="mx-auto h-6 w-6 text-graphite-300" />
          <p className="mt-3 text-sm text-graphite-400">
            Zarejestruj się lub zaloguj, aby dodać komentarz do tego zlecenia.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link to="/login"><Button variant="primary" size="sm"><LogIn className="h-4 w-4" /> Zaloguj się</Button></Link>
            <Link to="/register"><Button variant="secondary" size="sm">Załóż konto</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'admin';
  const isArtist = currentUser.role === 'artist' && currentUser.status !== 'suspended';
  const isSuspended = currentUser.status === 'suspended';
  const canComment = (isArtist || currentUser.role === 'client' || isAdmin) && !isSuspended;

  function handleSubmit(body: string, attachments: CommentAttachment[], commentType: 'question' | 'suggestion' | 'general') {
    const mappedAttachments: CommissionCommentAttachment[] = attachments.map((a) => ({
      id: a.id,
      commentId: '',
      url: a.url,
      filename: a.filename,
      mimeType: a.mimeType,
    }));
    onAddComment(commissionId, body, mappedAttachments, commentType);
  }

  function handleReport(commentId: string, reason: string) {
    onReportComment(commentId, reason);
    setReported((prev) => [...prev, commentId]);
  }

  const visibleComments = comments.filter((c) => !c.isHidden || isAdmin);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-graphite-600 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-graphite-300" /> Komentarze
        </h2>
        <Badge color="neutral">{visibleComments.length}</Badge>
      </div>

      {canComment && (
        <CommentForm
          currentUser={currentUser}
          isSuspended={isSuspended}
          onSubmit={handleSubmit}
        />
      )}

      {visibleComments.length > 0 ? (
        <div className="divide-y divide-graphite-400/5">
          {visibleComments.map((c) => (
            <CommentCard
              key={c.id}
              comment={c}
              currentUserId={currentUser.id}
              isAdmin={isAdmin}
              onDelete={onDeleteComment}
              onReport={handleReport}
              onHide={onHideComment}
            />
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-graphite-300">
          {canComment ? 'Brak komentarzy. Bądź pierwszy!' : 'Brak komentarzy.'}
        </p>
      )}

      {reported.length > 0 && (
        <div className="rounded-lg bg-ivory-200 px-4 py-2 text-center text-xs text-graphite-300">
          Dziękujemy za zgłoszenie. Nasz zespół moderacji sprawdzi komentarz wkrótce.
        </div>
      )}
    </div>
  );
}
