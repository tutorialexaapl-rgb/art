import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockComments } from '@/lib/mockData';
import { mapCommentRow, type CommentRow } from '@/types/database';
import type { CommissionComment } from '@/types';

export const commentsService = {
  async getCommissionComments(commissionId: string): Promise<CommissionComment[]> {
    if (!isSupabaseConfigured) {
      return mockComments.filter((c) => c.commissionId === commissionId);
    }
    const { data, error } = await supabase
      .from('commission_comments')
      .select('*')
      .eq('commission_request_id', commissionId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data as CommentRow[]).map((row) => mapCommentRow(row, []));
  },

  async getByCommission(commissionId: string): Promise<CommissionComment[]> {
    return this.getCommissionComments(commissionId);
  },

  async getAll(): Promise<CommissionComment[]> {
    if (!isSupabaseConfigured) {
      return mockComments;
    }
    const { data, error } = await supabase
      .from('commission_comments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as CommentRow[]).map((row) => mapCommentRow(row, []));
  },

  async addCommissionComment(comment: {
    commissionId: string;
    authorId: string;
    authorName: string;
    authorRole: string;
    authorAvatarUrl?: string;
    body: string;
    isPublic: boolean;
  }): Promise<CommissionComment | null> {
    if (!isSupabaseConfigured) {
      return {
        id: crypto.randomUUID(),
        commissionId: comment.commissionId,
        authorId: comment.authorId,
        authorName: comment.authorName,
        authorRole: comment.authorRole as CommissionComment['authorRole'],
        authorAvatarUrl: comment.authorAvatarUrl,
        body: comment.body,
        attachments: [],
        isPublic: comment.isPublic,
        isHidden: false,
        commentType: 'general',
        createdAt: new Date().toISOString(),
      };
    }
    const { data, error } = await supabase
      .from('commission_comments')
      .insert({
        commission_request_id: comment.commissionId,
        author_id: comment.authorId,
        author_name: comment.authorName,
        author_role: comment.authorRole,
        author_avatar_url: comment.authorAvatarUrl,
        body: comment.body,
        is_public: comment.isPublic,
      })
      .select('*')
      .single();
    if (error) throw error;
    return mapCommentRow(data as CommentRow, []);
  },

  async create(comment: {
    commissionId: string;
    authorId: string;
    authorName: string;
    authorRole: string;
    authorAvatarUrl?: string;
    body: string;
    isPublic: boolean;
  }): Promise<CommissionComment | null> {
    return this.addCommissionComment(comment);
  },

  async setHidden(id: string, isHidden: boolean): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('commission_comments')
      .update({ is_hidden: isHidden })
      .eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('commission_comments')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
