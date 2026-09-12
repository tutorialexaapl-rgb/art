import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockConversations, mockMessages } from '@/lib/mockData';
import { mapConversationRow, mapMessageRow, type ConversationRow, type MessageRow } from '@/types/database';
import type { Conversation, Message } from '@/types';

export const messagesService = {
  async getConversations(userId: string): Promise<Conversation[]> {
    if (!isSupabaseConfigured) {
      return mockConversations.filter((c) => c.participantIds.includes(userId));
    }
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`client_id.eq.${userId},artist_id.eq.${userId}`)
      .order('last_message_at', { ascending: false, nullsFirst: false });
    if (error) throw error;
    if (!data || data.length === 0) return [];
    return (data as ConversationRow[]).map(mapConversationRow);
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    if (!isSupabaseConfigured) {
      return mockMessages.filter((m) => m.conversationId === conversationId);
    }
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data as MessageRow[]).map(mapMessageRow);
  },

  async sendMessage(msg: {
    conversationId: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    body: string;
  }): Promise<Message | null> {
    if (!isSupabaseConfigured) return null;

    console.log('[MESSAGING SEND DEBUG]', {
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      senderName: msg.senderName,
      senderRole: msg.senderRole,
      bodyLength: msg.body.length,
    });

    const { data, error } = await supabase.from('messages').insert({
      conversation_id: msg.conversationId,
      sender_id: msg.senderId,
      sender_name: msg.senderName,
      sender_role: msg.senderRole,
      body: msg.body,
    }).select('*').single();

    if (error) {
      console.error('[MESSAGING SEND ERROR]', {
        code: (error as { code?: string }).code,
        message: error.message,
        details: (error as { details?: string }).details,
        hint: (error as { hint?: string }).hint,
        status: (error as { status?: number }).status,
      });
      throw error;
    }

    const saved = mapMessageRow(data as MessageRow);

    const { error: convError } = await supabase
      .from('conversations')
      .update({
        last_message_body: msg.body,
        last_message_at: new Date().toISOString(),
      })
      .eq('id', msg.conversationId);
    if (convError) {
      console.error('[MESSAGING SEND] conversation UPDATE failed (non-critical):', convError);
    }

    return saved;
  },

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .is('read_at', null);
    if (error) { /* non-critical */ }
  },

  async createConversation(input: {
    type: 'direct' | 'project';
    participantIds: string[];
    participantNames: string[];
    participantAvatarUrls: (string | undefined)[];
    projectTitle?: string;
    commissionTitle?: string;
    commissionRequestId?: string;
    commissionProjectId?: string;
    initialMessage?: { senderId: string; senderName: string; senderRole: string; body: string };
  }): Promise<Conversation | null> {
    if (!isSupabaseConfigured) return null;

    // Dedup: for commission/project conversations, match by commission_request_id + both participants
    // across ALL types (so 'commission' and 'project' conversations reuse the same row).
    // For direct conversations, match by both participants + type.
    let existingQuery = supabase
      .from('conversations')
      .select('*');

    if (input.commissionRequestId) {
      existingQuery = existingQuery
        .eq('commission_request_id', input.commissionRequestId)
        .eq('client_id', input.participantIds[0])
        .eq('artist_id', input.participantIds[1]);
    } else {
      existingQuery = existingQuery
        .eq('type', input.type)
        .or(
          `and(client_id.eq.${input.participantIds[0]},artist_id.eq.${input.participantIds[1]}),and(client_id.eq.${input.participantIds[1]},artist_id.eq.${input.participantIds[0]})`
        );
    }

    const existing = await existingQuery.maybeSingle();

    if (existing.data) {
      const existingConv = mapConversationRow(existing.data as ConversationRow);
      // If there's an initial message and this is a re-open, still send it
      if (input.initialMessage) {
        await this.sendMessage({
          conversationId: existingConv.id,
          senderId: input.initialMessage.senderId,
          senderName: input.initialMessage.senderName,
          senderRole: input.initialMessage.senderRole,
          body: input.initialMessage.body,
        });
      }
      return existingConv;
    }

    const cleanAvatars = input.participantAvatarUrls.map((a) => a ?? null);

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        type: input.type,
        client_id: input.participantIds[0] ?? null,
        artist_id: input.participantIds[1] ?? null,
        participant_names: input.participantNames,
        participant_avatar_urls: cleanAvatars,
        project_title: input.projectTitle ?? null,
        commission_title: input.commissionTitle ?? null,
        commission_request_id: input.commissionRequestId ?? null,
        commission_project_id: input.commissionProjectId ?? null,
      })
      .select('*')
      .single();

    if (error) throw error;
    const conv = mapConversationRow(data as ConversationRow);

    if (input.initialMessage) {
      const { error: msgError } = await supabase.from('messages').insert({
        conversation_id: conv.id,
        sender_id: input.initialMessage.senderId,
        sender_name: input.initialMessage.senderName,
        sender_role: input.initialMessage.senderRole,
        body: input.initialMessage.body,
      });
      if (msgError) { /* non-critical */ }

      await supabase
        .from('conversations')
        .update({
          last_message_body: input.initialMessage.body,
          last_message_at: new Date().toISOString(),
        })
        .eq('id', conv.id);
    }

    return conv;
  },

  async startCommissionConversation(input: {
    commissionId: string;
    commissionTitle: string;
    clientId: string;
    clientName: string;
    clientAvatarUrl?: string;
    artistId: string;
    artistName: string;
    artistAvatarUrl?: string;
  }): Promise<Conversation | null> {
    return this.createConversation({
      type: 'project',
      participantIds: [input.clientId, input.artistId],
      participantNames: [input.clientName, input.artistName],
      participantAvatarUrls: [input.clientAvatarUrl, input.artistAvatarUrl],
      commissionTitle: input.commissionTitle,
      commissionRequestId: input.commissionId,
    });
  },
};
