import { useCallback, useEffect, useRef, useState } from 'react';
import { useDemoGuard } from '@/hooks/useDemoGuard';
import { mockConversations, mockMessages } from '@/lib/mockData';
import { detectContactAttempts } from '@/lib/contactDetection';
import { messagesService } from '@/services/messagesService';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Conversation, Message } from '@/types';

const CONV_KEY = 'app_conversations_v1';
const MSG_KEY = 'app_messages_v1';

function load<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T[];
  } catch { /* ignore */ }
  return fallback;
}

export interface SendMessageResult {
  success: boolean;
  contactWarning?: boolean;
  error?: string;
}

export function useMessaging(userId: string | undefined) {
  const demoGuard = useDemoGuard();
  const [conversations, setConversations] = useState<Conversation[]>(() => isSupabaseConfigured ? [] : load(CONV_KEY, mockConversations));
  const [messages, setMessages] = useState<Message[]>(() => isSupabaseConfigured ? [] : load(MSG_KEY, mockMessages));
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const messagesCache = useRef<Record<string, Message[]>>({});

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    if (!userId) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    messagesService.getConversations(userId)
      .then((data) => {
        if (!cancelled) {
          setConversations(data);
          setError(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('useMessaging: failed to load conversations:', err);
          setError(true);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [userId]);

  // Realtime: listen for new messages in conversations the user is part of
  useEffect(() => {
    if (!isSupabaseConfigured || !userId) return;
    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new as MessageRow;
          // Only handle if we have this conversation loaded
          const convExists = conversations.some((c) => c.id === newMsg.conversation_id);
          if (!convExists) {
            // A new conversation may have been created — reload conversations
            messagesService.getConversations(userId)
              .then((data) => setConversations(data))
              .catch(() => {});
            return;
          }
          if (newMsg.sender_id === userId) return; // don't double-add own messages
          const mapped: Message = {
            id: newMsg.id,
            conversationId: newMsg.conversation_id,
            senderId: newMsg.sender_id,
            senderName: newMsg.sender_name,
            senderRole: newMsg.sender_role as Message['senderRole'],
            body: newMsg.body,
            readAt: newMsg.read_at ?? undefined,
            createdAt: newMsg.created_at,
          };
          messagesCache.current[newMsg.conversation_id] = [
            ...(messagesCache.current[newMsg.conversation_id] ?? []),
            mapped,
          ];
          setMessages((prev) => [...prev, mapped]);
          setConversations((prev) => prev.map((c) =>
            c.id === newMsg.conversation_id
              ? {
                  ...c,
                  lastMessageBody: newMsg.body,
                  lastMessageAt: newMsg.created_at,
                  unreadCount: c.unreadCount + 1,
                }
              : c
          ));
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'conversations' },
        () => {
          // A new conversation was created (possibly by the other party starting a chat)
          messagesService.getConversations(userId!)
            .then((data) => setConversations(data))
            .catch(() => {});
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, conversations]);

  useEffect(() => {
    if (isSupabaseConfigured) return;
    try { localStorage.setItem(CONV_KEY, JSON.stringify(conversations)); } catch { /* ignore */ }
  }, [conversations]);

  useEffect(() => {
    if (isSupabaseConfigured) return;
    try { localStorage.setItem(MSG_KEY, JSON.stringify(messages)); } catch { /* ignore */ }
  }, [messages]);

  const myConversations = userId
    ? conversations
        .filter((c) => c.participantIds.includes(userId))
        .sort((a, b) => (b.lastMessageAt ?? '').localeCompare(a.lastMessageAt ?? ''))
    : [];

  const getConversation = useCallback(
    (id: string) => conversations.find((c) => c.id === id),
    [conversations]
  );

  const getMessages = useCallback(
    (conversationId: string) => {
      if (isSupabaseConfigured) {
        return messagesCache.current[conversationId] ?? [];
      }
      return messages
        .filter((m) => m.conversationId === conversationId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    },
    [messages]
  );

  const loadMessages = useCallback(
    async (conversationId: string) => {
      if (!isSupabaseConfigured) return;
      setMessagesError(null);
      try {
        const data = await messagesService.getMessages(conversationId);
        messagesCache.current[conversationId] = data;
        setMessages((prev) => {
          const existing = prev.filter((m) => m.conversationId !== conversationId);
          return [...existing, ...data];
        });
      } catch (err) {
        console.error('useMessaging: failed to load messages:', err);
        setMessagesError(conversationId);
      }
    },
    []
  );

  const markAsRead = useCallback(
    (conversationId: string, readerId: string) => {
      if (isSupabaseConfigured) {
        messagesService.markAsRead(conversationId, readerId).catch(() => {});
        setConversations((prev) => prev.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c
        ));
        return;
      }
      setMessages((prev) => prev.map((m) =>
        m.conversationId === conversationId && m.senderId !== readerId && !m.readAt
          ? { ...m, readAt: new Date().toISOString() }
          : m
      ));
      setConversations((prev) => prev.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ));
    },
    []
  );

  const sendMessage = useCallback(
    async (conversationId: string, senderId: string, senderName: string, senderRole: 'client' | 'artist', body: string): Promise<SendMessageResult> => {
      if (demoGuard()) return { success: false, error: 'Konto demo nie pozwala na wysyłanie wiadomości.' };
      const trimmed = body.trim();
      if (!trimmed) return { success: false, error: 'Wiadomość nie może być pusta.' };
      if (trimmed.length > 5000) return { success: false, error: 'Wiadomość jest za długa (max 5000 znaków).' };

      const conv = conversations.find((c) => c.id === conversationId);
      if (!conv) return { success: false, error: 'Rozmowa nie istnieje.' };
      if (!conv.participantIds.includes(senderId)) return { success: false, error: 'Nie masz dostępu do tej rozmowy.' };

      const detection = detectContactAttempts(trimmed);
      const warning = detection.hasEmail || detection.hasPhone || detection.hasLink;

      if (isSupabaseConfigured) {
        setSending(true);
        try {
          const saved = await messagesService.sendMessage({ conversationId, senderId, senderName, senderRole, body: trimmed });
          if (saved) {
            messagesCache.current[conversationId] = [
              ...(messagesCache.current[conversationId] ?? []),
              saved,
            ];
            setMessages((prev) => [...prev, saved]);
            setConversations((prev) => prev.map((c) =>
              c.id === conversationId
                ? { ...c, lastMessageBody: trimmed, lastMessageAt: saved.createdAt }
                : c
            ));
          }
          return { success: true, contactWarning: warning };
        } catch (err) {
          console.error('[MESSAGING DEBUG] message send ERROR:', err);
          return { success: false, error: 'Nie udało się wysłać wiadomości. Spróbuj ponownie.' };
        } finally {
          setSending(false);
        }
      }

      const msg: Message = {
        id: `m-${Date.now()}`,
        conversationId,
        senderId,
        senderName,
        senderRole,
        body: trimmed,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, msg]);
      setConversations((prev) => prev.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessageBody: trimmed, lastMessageAt: msg.createdAt }
          : c
      ));
      return { success: true, contactWarning: warning };
    },
    [conversations, demoGuard]
  );

  const startConversation = useCallback(
    (otherUserId: string, otherUserName: string, otherAvatarUrl: string | undefined, currentUserId: string, currentUserName: string, currentAvatarUrl: string | undefined): string => {
      if (demoGuard()) return '';
      if (isSupabaseConfigured) {
        const existing = conversations.find(
          (c) => c.participantIds.includes(currentUserId) && c.participantIds.includes(otherUserId) && c.type === 'direct'
        );
        if (existing) return existing.id;

        messagesService.createConversation({
          type: 'direct',
          participantIds: [currentUserId, otherUserId],
          participantNames: [currentUserName, otherUserName],
          participantAvatarUrls: [currentAvatarUrl, otherAvatarUrl],
        })
          .then((conv) => {
            if (conv) {
              setConversations((prev) => {
                if (prev.some((c) => c.id === conv.id)) return prev;
                return [conv, ...prev];
              });
            }
          })
          .catch((err) => console.error('useMessaging: startConversation error:', err));

        return `pending-${Date.now()}`;
      }

      const existing = conversations.find(
        (c) => c.participantIds.includes(currentUserId) && c.participantIds.includes(otherUserId) && c.type === 'direct'
      );
      if (existing) return existing.id;

      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        type: 'direct',
        participantIds: [currentUserId, otherUserId],
        participantNames: [currentUserName, otherUserName],
        participantAvatarUrls: [currentAvatarUrl, otherAvatarUrl],
        unreadCount: 0,
        createdAt: new Date().toISOString(),
      };
      setConversations((prev) => [...prev, newConv]);
      return newConv.id;
    },
    [conversations, demoGuard]
  );

  const startCommissionConversation = useCallback(
    async (input: {
      commissionId: string;
      commissionTitle: string;
      otherUserId: string;
      otherUserName: string;
      otherAvatarUrl?: string;
      otherUserRole: 'client' | 'artist';
    }): Promise<string | null> => {
      if (demoGuard()) return null;
      if (!userId) return null;

      const currentUserName = conversations[0]?.participantNames.find((_, i) =>
        conversations[0]?.participantIds[i] === userId
      ) ?? '';

      // For client starting conversation with artist: clientId = userId, artistId = other
      // For artist starting conversation with client: clientId = other, artistId = userId
      const isClient = input.otherUserRole === 'artist';

      const clientInfo = isClient
        ? { id: userId, name: currentUserName }
        : { id: input.otherUserId, name: input.otherUserName };
      const artistInfo = isClient
        ? { id: input.otherUserId, name: input.otherUserName, avatarUrl: input.otherAvatarUrl }
        : { id: userId, name: currentUserName };

      if (isSupabaseConfigured) {
        // Check if conversation already exists locally
        const existing = conversations.find((c) =>
          c.commissionRequestId === input.commissionId &&
          c.participantIds.includes(userId) &&
          c.participantIds.includes(input.otherUserId)
        );
        if (existing) return existing.id;

        try {
          const conv = await messagesService.startCommissionConversation({
            commissionId: input.commissionId,
            commissionTitle: input.commissionTitle,
            clientId: clientInfo.id,
            clientName: clientInfo.name,
            artistId: artistInfo.id,
            artistName: artistInfo.name,
            artistAvatarUrl: artistInfo.avatarUrl,
          });
          if (conv) {
            console.log('[MESSAGING DEBUG] startCommissionConversation SUCCESS:', { convId: conv.id });
            setConversations((prev) => {
              if (prev.some((c) => c.id === conv.id)) return prev;
              return [conv, ...prev];
            });
            return conv.id;
          }
        } catch (err) {
          console.error('[MESSAGING DEBUG] startCommissionConversation ERROR:', err);
        }
        return null;
      }

      // Mock mode
      const existing = conversations.find((c) =>
        c.commissionRequestId === input.commissionId &&
        c.participantIds.includes(userId) &&
        c.participantIds.includes(input.otherUserId)
      );
      if (existing) return existing.id;

      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        type: 'project',
        participantIds: [clientInfo.id, artistInfo.id],
        participantNames: [clientInfo.name, artistInfo.name],
        participantAvatarUrls: [undefined, artistInfo.avatarUrl],
        commissionTitle: input.commissionTitle,
        commissionRequestId: input.commissionId,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
      };
      setConversations((prev) => [...prev, newConv]);
      return newConv.id;
    },
    [conversations, demoGuard, userId]
  );

  return {
    conversations,
    myConversations,
    getConversation,
    getMessages,
    loadMessages,
    sendMessage,
    markAsRead,
    startConversation,
    startCommissionConversation,
    loading,
    error,
    messagesError,
    sending,
  };
}

interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  body: string;
  read_at: string | null;
  created_at: string;
}
