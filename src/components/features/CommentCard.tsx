import { HelpCircle, Lightbulb, MessageCircle, EyeOff } from 'lucide-react';
import type { CommissionComment } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { timeAgo } from '@/lib/utils';
import { CommentModerationActions } from '@/components/features/CommentModerationActions';
import { ReportButton } from '@/components/features/ReportButton';

interface CommentCardProps {
  comment: CommissionComment;
  currentUserId?: string;
  isAdmin?: boolean;
  onDelete: (commentId: string) => void;
  onReport: (commentId: string, reason: string) => void;
  onHide: (commentId: string) => void;
}

const TYPE_META: Record<CommissionComment['commentType'], { label: string; icon: typeof HelpCircle }> = {
  question: { label: 'Pytanie', icon: HelpCircle },
  suggestion: { label: 'Sugestia artystyczna', icon: Lightbulb },
  general: { label: 'Komentarz', icon: MessageCircle },
};

export function CommentCard({ comment, currentUserId, isAdmin, onDelete, onReport, onHide }: CommentCardProps) {
  const isOwner = currentUserId === comment.authorId;
  const meta = TYPE_META[comment.commentType] ?? TYPE_META.general;
  const TypeIcon = meta.icon;

  if (comment.isHidden && !isAdmin) {
    return (
      <div className="flex items-center gap-3 py-4 text-sm text-graphite-200">
        <EyeOff className="h-4 w-4" />
        <span>Komentarz ukryty przez moderację.</span>
      </div>
    );
  }

  return (
    <div className="flex gap-4 py-5">
      <Avatar name={comment.authorName} src={comment.authorName === 'Hanna Nowak' ? '/avatar-maja-sokolowska.webp' : comment.authorAvatarUrl} size="sm" />
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-graphite-600">{comment.authorName}</span>
          <Badge color={comment.authorRole === 'artist' ? 'gold' : comment.authorRole === 'admin' ? 'error' : 'neutral'}>
            {comment.authorRole === 'artist' ? 'Artysta' : comment.authorRole === 'admin' ? 'Admin' : 'Zlecający'}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-graphite-300">
            <TypeIcon className="h-3 w-3" /> {meta.label}
          </span>
          <span className="text-xs text-graphite-200">{timeAgo(comment.createdAt)}</span>
          {comment.isHidden && (
            <span className="flex items-center gap-1 text-xs text-error">
              <EyeOff className="h-3 w-3" /> Ukryty
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-graphite-500 text-pretty leading-relaxed whitespace-pre-wrap">{comment.body}</p>
        {comment.attachments && comment.attachments.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {comment.attachments.map((att) => (
              <a
                key={att.id}
                href={att.url}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-xl border border-graphite-400/10"
              >
                <img src={att.url} alt={`Załącznik: ${att.filename}`} className="h-24 w-24 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" decoding="async" />
              </a>
            ))}
          </div>
        )}
        <div className="mt-3 flex items-center gap-2">
          <CommentModerationActions
            commentId={comment.id}
            isOwner={isOwner}
            isAdmin={!!isAdmin}
            isHidden={comment.isHidden}
            onDelete={onDelete}
            onReport={onReport}
            onHide={onHide}
          />
          {!isOwner && (
            <ReportButton targetType="comment" targetId={comment.id} variant="text" />
          )}
        </div>
      </div>
    </div>
  );
}
