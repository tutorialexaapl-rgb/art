import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Send, Search, MessageSquare, AlertTriangle, Paperclip, X,
  Inbox, ShieldAlert, Lock, ArrowLeft, ExternalLink, Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Avatar } from '@/components/ui/Avatar';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useMessaging } from '@/hooks/useMessaging';
import { detectContactAttempts } from '@/lib/contactDetection';
import { antispam } from '@/lib/antispam';
import { cn, timeAgo, formatDate } from '@/lib/utils';
import type { Conversation } from '@/types';

const CONTACT_WARNING = 'Kontakt powinien odbywać się przez platformę, aby zachować porządek ustaleń i bezpieczeństwo obu stron.';

export function WiadomosciPage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const {
    myConversations, getMessages, loadMessages, sendMessage, markAsRead,
    loading: loadingConversations, error: conversationsError, messagesError, sending,
  } = useMessaging(user?.id);

  const [searchParams] = useSearchParams();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [antispamError, setAntispamError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isSuspended = user?.status === 'suspended';
  const basePath = user?.role === 'artist' ? '/dashboard/artist' : '/dashboard/client';

  const filteredConversations = useMemo(() => {
    if (!search.trim()) return myConversations;
    const q = search.toLowerCase();
    return myConversations.filter((c) => {
      const otherName = c.participantNames.find((_, i) => c.participantIds[i] !== user?.id) ?? '';
      const title = c.projectTitle ?? c.commissionTitle ?? '';
      return otherName.toLowerCase().includes(q) || title.toLowerCase().includes(q) || (c.lastMessageBody ?? '').toLowerCase().includes(q);
    });
  }, [myConversations, search, user?.id]);

  const activeConv = activeId ? myConversations.find((c) => c.id === activeId) : null;
  const activeMessages = activeId ? getMessages(activeId) : [];
  const activeMessagesError = activeId ? messagesError === activeId : false;

  // Open conversation from URL param (e.g. ?conv=uuid)
  useEffect(() => {
    const convId = searchParams.get('conv');
    if (convId) {
      setActiveId(convId);
      setMobileChatOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId);
    }
  }, [activeId, loadMessages]);

  useEffect(() => {
    if (activeId && user) markAsRead(activeId, user.id);
  }, [activeId, user, markAsRead, activeMessages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  function getOtherParty(conv: Conversation) {
    const idx = conv.participantIds.findIndex((id) => id !== user?.id);
    return {
      id: conv.participantIds[idx] ?? '',
      name: conv.participantNames[idx] ?? 'Nieznany',
      avatarUrl: conv.participantAvatarUrls?.[idx],
    };
  }

  async function handleSend() {
    if (!user || !activeId) return;
    if (isSuspended) {
      notify('error', 'Twoje konto jest zawieszone - nie możesz wysyłać wiadomości.');
      return;
    }
    if (!draft.trim()) return;
    if (sending) return;

    setAntispamError('');
    const check = await antispam.checkMessage(user.id, draft.trim());
    if (check.blocked) {
      setAntispamError(check.reason);
      return;
    }

    const detection = detectContactAttempts(draft);
    const hasContact = detection.hasEmail || detection.hasPhone || detection.hasLink;

    const result = await sendMessage(activeId, user.id, user.displayName, user.role === 'artist' ? 'artist' : 'client', draft);
    if (!result.success) {
      notify('error', result.error ?? 'Nie udało się wysłać wiadomości. Spróbuj ponownie.');
      return;
    }

    setDraft('');
    setAttachments([]);

    if (hasContact || result.contactWarning || check.warning) {
      setShowWarning(true);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (loadingConversations) {
    return (
      <div className="space-y-6">
        <PageHeader title="Wiadomości" description="Komunikacja z artystami i zlecającymi w ramach projektów." />
        <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50">
          <LoadingState label="Ładowanie rozmów..." />
        </div>
      </div>
    );
  }

  if (conversationsError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Wiadomości" description="Komunikacja z artystami i zlecającymi w ramach projektów." />
        <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50">
          <ErrorState
            title="Nie udało się pobrać rozmów"
            description="Sprawdź połączenie z serwerem i spróbuj ponownie."
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  if (!loadingConversations && myConversations.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Wiadomości" description="Komunikacja z artystami i zlecającymi w ramach projektów." />
        <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50">
          <EmptyState
            icon={<Inbox className="h-7 w-7" />}
            title="Brak rozmów"
            description="Rozmowy powstają automatycznie po zaakceptowaniu oferty. Możesz też rozpocząć rozmowę z artystą klikając Napisz do artysty na stronie ofert."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Wiadomości" description="Komunikacja z artystami i zlecającymi w ramach projektów." />

      <div className="grid h-[calc(100dvh-190px)] min-h-[560px] gap-0 overflow-hidden rounded-2xl border border-graphite-400/10 bg-ivory-50 shadow-sm lg:h-[680px] lg:grid-cols-[340px_1fr]">
        {/* Conversation list */}
        <div className={cn(
          'overflow-hidden border-graphite-400/10 bg-ivory-50 lg:flex lg:flex-col lg:border-r',
          mobileChatOpen ? 'hidden' : 'flex flex-col'
        )}>
          <div className="p-4 border-b border-graphite-400/10">
            <Input
              placeholder="Szukaj rozmów..."
              icon={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-graphite-300">Brak wyników.</p>
            ) : (
              filteredConversations.map((conv) => {
                const other = getOtherParty(conv);
                const title = conv.projectTitle ?? conv.commissionTitle;
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveId(conv.id);
                      setMobileChatOpen(true);
                    }}
                    className={cn(
                      'flex w-full items-start gap-3 border-b border-graphite-400/5 p-4 text-left transition-colors',
                      activeId === conv.id ? 'bg-ivory-200' : 'hover:bg-ivory-200/50'
                    )}
                  >
                    <div className="relative">
                      <Avatar name={other.name} src={other.avatarUrl} size="sm" />
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-graphite-700">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-graphite-600 truncate">{other.name}</span>
                        {conv.lastMessageAt && (
                          <span className="text-[10px] text-graphite-200 shrink-0">{timeAgo(conv.lastMessageAt)}</span>
                        )}
                      </div>
                      {title && <p className="text-xs text-graphite-300 truncate">{title}</p>}
                      <p className="mt-1 text-xs text-graphite-400 line-clamp-1">{conv.lastMessageBody ?? 'Brak wiadomości'}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat panel */}
        <div className={cn(
          'overflow-hidden bg-ivory-50 lg:flex lg:flex-col',
          mobileChatOpen ? 'flex flex-col' : 'hidden lg:flex'
        )}>
          {activeConv ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-graphite-400/10 p-3 sm:p-4">
                <button
                  type="button"
                  onClick={() => setMobileChatOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-graphite-400 transition-colors hover:bg-ivory-200 hover:text-graphite-600 lg:hidden"
                  aria-label="Wróć do listy rozmów"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <Avatar name={getOtherParty(activeConv).name} src={getOtherParty(activeConv).avatarUrl} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-graphite-600">{getOtherParty(activeConv).name}</p>
                  <p className="text-xs text-graphite-300 truncate">
                    {activeConv.projectTitle ?? activeConv.commissionTitle}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activeConv.commissionRequestId && (
                    <Link
                      to={`${basePath}/zlecenia/${activeConv.commissionRequestId}`}
                      className="hidden items-center gap-1 text-xs text-graphite-300 transition-colors hover:text-gold-500 sm:inline-flex"
                    >
                      Zobacz zlecenie <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                  <div className="flex items-center gap-1.5 rounded-full bg-graphite-400/5 px-2.5 py-1">
                    <Lock className="h-3 w-3 text-graphite-300" />
                    <span className="text-[10px] font-medium text-graphite-300">Prywatne</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-ivory-100/40 p-4 sm:p-6">
                {activeMessagesError ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <AlertTriangle className="h-6 w-6 text-graphite-300" />
                    <p className="mt-3 text-sm text-graphite-400">Nie udało się pobrać wiadomości.</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-4"
                      onClick={() => loadMessages(activeId!)}
                    >
                      Spróbuj ponownie
                    </Button>
                  </div>
                ) : activeMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="h-7 w-7 text-graphite-300" />
                    <p className="mt-3 font-display text-base text-graphite-500">Rozpocznij rozmowę</p>
                    <p className="mt-1.5 text-sm text-graphite-400 text-pretty max-w-sm">
                      Zapytaj o szczegóły zlecenia, termin realizacji lub wykonanie obrazu.
                    </p>
                  </div>
                ) : (
                  activeMessages.map((msg) => {
                    const isMine = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
                        <div className={cn(
                          'max-w-[min(80%,32rem)] rounded-2xl px-4 py-3 shadow-sm',
                          isMine ? 'bg-graphite-600 text-ivory-100' : 'bg-ivory-200 text-graphite-600'
                        )}>
                          <p className="whitespace-pre-wrap text-sm text-pretty leading-relaxed">{msg.body}</p>
                          <div className={cn('mt-1 flex items-center gap-2 text-xs', isMine ? 'text-graphite-200' : 'text-graphite-300')}>
                            <span>{formatDate(msg.createdAt)}</span>
                            {isMine && msg.readAt && <span>· Przeczytano</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suspended banner */}
              {isSuspended && (
                <div className="flex items-center gap-2 border-t border-error/20 bg-error/5 px-4 py-2.5">
                  <ShieldAlert className="h-4 w-4 text-error" />
                  <p className="text-xs text-error">Twoje konto jest zawieszone - nie możesz wysyłać wiadomości.</p>
                </div>
              )}

              {antispamError && (
                <div className="flex items-start gap-2 border-t border-error/20 bg-error/5 px-4 py-2.5">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-error" />
                  <p className="text-xs font-medium text-error">{antispamError}</p>
                  <button onClick={() => setAntispamError('')} className="ml-auto text-graphite-300 hover:text-error">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Contact warning */}
              {showWarning && (
                <div className="flex items-start gap-2 border-t border-warning/20 bg-warning/5 px-4 py-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-dark" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-warning-dark">Wykryto próbę kontaktu poza platformą</p>
                    <p className="mt-0.5 text-xs text-graphite-400">{CONTACT_WARNING}</p>
                  </div>
                  <button onClick={() => setShowWarning(false)} className="text-graphite-300 hover:text-graphite-500">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Attachments preview */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-graphite-400/10 px-4 py-2.5">
                  {attachments.map((a, i) => (
                    <span key={i} className="flex items-center gap-1.5 rounded-lg bg-ivory-200 px-2.5 py-1 text-xs text-graphite-400">
                      <Paperclip className="h-3 w-3" /> Załącznik {i + 1}
                      <button onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="text-graphite-300 hover:text-error">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Message input */}
              {!isSuspended && (
                <div className="border-t border-graphite-400/10 p-4">
                  <div className="flex items-stretch gap-2 sm:gap-3">
                    <div className="min-w-0 flex-1">
                      <Textarea
                        placeholder="Napisz wiadomość..."
                        rows={3}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-full w-full resize-none"
                        maxLength={5000}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-full shrink-0"
                      onClick={() => setAttachments([...attachments, `attachment-${Date.now()}`])}
                      title="Dodaj załącznik"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="h-full shrink-0"
                      onClick={handleSend}
                      disabled={!draft.trim() || sending}
                    >
                      {sending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <p className="mt-2 text-[10px] text-graphite-200">
                    {sending ? 'Wysyłanie...' : 'Enter wysyła · Shift+Enter nowa linia'}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState
                icon={<MessageSquare className="h-7 w-7" />}
                title="Wybierz rozmowę"
                description="Wybierz rozmowę z listy po lewej, aby zobaczyć wiadomości."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
