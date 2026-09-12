import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface InvitationRow {
  id: string;
  commissionRequestId: string;
  artistId: string;
  clientId: string;
  status: 'pending' | 'accepted' | 'declined';
  message: string | null;
  createdAt: string;
}

export interface CreateInvitationInput {
  commissionRequestId: string;
  artistId: string;
  clientId: string;
  message?: string;
}

export const invitationsService = {
  async create(input: CreateInvitationInput): Promise<InvitationRow | null> {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('commission_invitations')
      .insert({
        commission_request_id: input.commissionRequestId,
        artist_id: input.artistId,
        client_id: input.clientId,
        message: input.message ?? null,
      })
      .select('id, commission_request_id, artist_id, client_id, status, message, created_at')
      .single();
    if (error) throw error;
    return {
      id: data.id,
      commissionRequestId: data.commission_request_id,
      artistId: data.artist_id,
      clientId: data.client_id,
      status: data.status,
      message: data.message,
      createdAt: data.created_at,
    };
  },

  async getByArtist(artistId: string): Promise<InvitationRow[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('commission_invitations')
      .select('id, commission_request_id, artist_id, client_id, status, message, created_at')
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id,
      commissionRequestId: r.commission_request_id,
      artistId: r.artist_id,
      clientId: r.client_id,
      status: r.status,
      message: r.message,
      createdAt: r.created_at,
    }));
  },

  async getByClient(clientId: string): Promise<InvitationRow[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('commission_invitations')
      .select('id, commission_request_id, artist_id, client_id, status, message, created_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id,
      commissionRequestId: r.commission_request_id,
      artistId: r.artist_id,
      clientId: r.client_id,
      status: r.status,
      message: r.message,
      createdAt: r.created_at,
    }));
  },
};
