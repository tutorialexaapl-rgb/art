import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockCommissions } from '@/lib/mockData';
import { mapCommissionRow, type CommissionRow } from '@/types/database';
import type { CommissionRequest, CommissionStatus } from '@/types';

export const commissionsService = {
  async getAll(): Promise<CommissionRequest[]> {
    if (!isSupabaseConfigured) {
      return mockCommissions;
    }
    const { data, error } = await supabase
      .from('commission_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as CommissionRow[]).map(mapCommissionRow);
  },

  async getPublicCommissions(): Promise<CommissionRequest[]> {
    if (!isSupabaseConfigured) {
      return mockCommissions.filter(
        (c) => c.status === 'offers_open' || c.status === 'published' || c.status === 'in_progress'
      );
    }
    const { data, error } = await supabase
      .from('commission_requests')
      .select('id, slug, title, client_name, status, public_summary, style, mood, width_cm, height_cm, orientation, budget_min, budget_max, deadline, location, frame_required, delivery_required, inspiration_images, interior_images, tags, medium, views, comments_count, offers_count, created_at, updated_at')
      .in('status', ['published', 'offers_open', 'in_progress', 'completed'])
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as CommissionRow[]).map(mapCommissionRow);
  },

  async getPublicCommissionBySlug(slug: string): Promise<CommissionRequest | null> {
    if (!isSupabaseConfigured) {
      return mockCommissions.find((c) => c.slug === slug) ?? null;
    }
    const { data, error } = await supabase
      .from('commission_requests')
      .select('id, slug, title, client_id, client_name, status, public_summary, style, mood, width_cm, height_cm, orientation, budget_min, budget_max, deadline, location, frame_required, delivery_required, inspiration_images, interior_images, tags, medium, views, comments_count, offers_count, created_at, updated_at')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return data ? mapCommissionRow(data as CommissionRow) : null;
  },

  async getBySlug(slug: string): Promise<CommissionRequest | null> {
    if (!isSupabaseConfigured) {
      return mockCommissions.find((c) => c.slug === slug) ?? null;
    }
    const { data, error } = await supabase
      .from('commission_requests')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return data ? mapCommissionRow(data as CommissionRow) : null;
  },

  async getById(id: string): Promise<CommissionRequest | null> {
    if (!isSupabaseConfigured) {
      return mockCommissions.find((c) => c.id === id) ?? null;
    }
    const { data, error } = await supabase
      .from('commission_requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapCommissionRow(data as CommissionRow) : null;
  },

  async getCommissionForArtist(commissionId: string, artistId: string): Promise<CommissionRequest | null> {
    if (!isSupabaseConfigured) {
      return mockCommissions.find((c) => c.id === commissionId) ?? null;
    }
    const { data, error } = await supabase
      .from('commission_requests')
      .select('*')
      .eq('id', commissionId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const commission = mapCommissionRow(data as CommissionRow);

    const { data: offer } = await supabase
      .from('commission_offers')
      .select('id')
      .eq('commission_request_id', commissionId)
      .eq('artist_id', artistId)
      .maybeSingle();
    return { ...commission, _artistHasOffer: Boolean(offer) } as CommissionRequest & { _artistHasOffer: boolean };
  },

  async getClientCommissions(clientId: string): Promise<CommissionRequest[]> {
    if (!isSupabaseConfigured) {
      return mockCommissions.filter((c) => c.clientId === clientId);
    }
    const { data, error } = await supabase
      .from('commission_requests')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as CommissionRow[]).map(mapCommissionRow);
  },

  async getByClientId(clientId: string): Promise<CommissionRequest[]> {
    return this.getClientCommissions(clientId);
  },

  async createCommission(input: {
    clientId: string;
    clientName: string;
    title: string;
    publicSummary: string;
    privateDescription: string;
    style: string;
    mood: string;
    widthCm: number;
    heightCm: number;
    orientation: string;
    budgetMin: number;
    budgetMax: number;
    deadline: string;
    roomType: string;
    intendedUse: string;
    frameRequired: boolean;
    deliveryRequired: boolean;
    tags: string[];
    medium: string;
    preferredColors: string[];
    colorsToAvoid: string[];
    inspirationImages: string[];
    interiorImages: string[];
    location: string;
    status: CommissionStatus;
  }): Promise<CommissionRequest | null> {
    if (!isSupabaseConfigured) {
      const newCommission: CommissionRequest = {
        id: crypto.randomUUID(),
        slug: input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36),
        title: input.title,
        clientId: input.clientId,
        clientName: input.clientName,
        status: input.status,
        publicSummary: input.publicSummary,
        privateDescription: input.privateDescription,
        roomType: input.roomType as CommissionRequest['roomType'],
        intendedUse: input.intendedUse as CommissionRequest['intendedUse'],
        style: input.style,
        mood: input.mood,
        preferredColors: input.preferredColors,
        colorsToAvoid: input.colorsToAvoid,
        widthCm: input.widthCm,
        heightCm: input.heightCm,
        orientation: input.orientation as CommissionRequest['orientation'],
        budgetMin: input.budgetMin,
        budgetMax: input.budgetMax,
        deadline: input.deadline,
        location: input.location,
        frameRequired: input.frameRequired,
        deliveryRequired: input.deliveryRequired,
        attachments: [],
        inspirationImages: input.inspirationImages,
        interiorImages: input.interiorImages,
        tags: input.tags,
        medium: input.medium,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        commentsCount: 0,
        offersCount: 0,
      };
      return newCommission;
    }
    const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
    const { data, error } = await supabase
      .from('commission_requests')
      .insert({
        slug,
        title: input.title,
        client_id: input.clientId,
        client_name: input.clientName,
        status: input.status,
        public_summary: input.publicSummary,
        private_description: input.privateDescription,
        room_type: input.roomType,
        intended_use: input.intendedUse,
        style: input.style,
        mood: input.mood,
        preferred_colors: input.preferredColors,
        colors_to_avoid: input.colorsToAvoid,
        width_cm: input.widthCm,
        height_cm: input.heightCm,
        orientation: input.orientation,
        budget_min: input.budgetMin,
        budget_max: input.budgetMax,
        deadline: input.deadline,
        location: input.location || null,
        frame_required: input.frameRequired,
        delivery_required: input.deliveryRequired,
        inspiration_images: input.inspirationImages,
        interior_images: input.interiorImages,
        tags: input.tags,
        medium: input.medium,
      })
      .select('*')
      .single();
    if (error) throw error;
    return mapCommissionRow(data as CommissionRow);
  },

  async updateCommission(id: string, input: {
    title: string;
    publicSummary: string;
    privateDescription: string;
    style: string;
    mood: string;
    widthCm: number;
    heightCm: number;
    orientation: string;
    budgetMin: number;
    budgetMax: number;
    deadline: string;
    roomType: string;
    intendedUse: string;
    frameRequired: boolean;
    deliveryRequired: boolean;
    tags: string[];
    medium: string;
    preferredColors: string[];
    colorsToAvoid: string[];
    inspirationImages: string[];
    interiorImages: string[];
    location: string;
    status?: CommissionStatus;
  }): Promise<CommissionRequest | null> {
    if (!isSupabaseConfigured) return null;
    const updateData: Record<string, unknown> = {
        title: input.title,
        public_summary: input.publicSummary,
        private_description: input.privateDescription,
        room_type: input.roomType,
        intended_use: input.intendedUse,
        style: input.style,
        mood: input.mood,
        preferred_colors: input.preferredColors,
        colors_to_avoid: input.colorsToAvoid,
        width_cm: input.widthCm,
        height_cm: input.heightCm,
        orientation: input.orientation,
        budget_min: input.budgetMin,
        budget_max: input.budgetMax,
        deadline: input.deadline,
        location: input.location || null,
        frame_required: input.frameRequired,
        delivery_required: input.deliveryRequired,
        inspiration_images: input.inspirationImages,
        interior_images: input.interiorImages,
        tags: input.tags,
        medium: input.medium,
        updated_at: new Date().toISOString(),
    };
    if (input.status) {
      updateData.status = input.status;
    }
    const { data, error } = await supabase
      .from('commission_requests')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return mapCommissionRow(data as CommissionRow);
  },

  async updateStatus(id: string, status: CommissionStatus): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('commission_requests')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },

  async deleteCommission(id: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('commission_requests')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async updatePublicSummary(id: string, summary: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('commission_requests')
      .update({ public_summary: summary })
      .eq('id', id);
    if (error) throw error;
  },

  async incrementViews(id: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.rpc('increment_commission_views', { commission_id: id });
    if (error) { /* non-critical */ }
  },

  async getClientMarketplaceCommissions(): Promise<CommissionRequest[]> {
    if (!isSupabaseConfigured) {
      return mockCommissions.filter(
        (c) => c.status === 'offers_open' || c.status === 'published' || c.status === 'in_progress'
      );
    }
    const { data, error } = await supabase
      .from('client_marketplace_commissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as CommissionRow[]).map((row) => {
      const mapped = mapCommissionRow(row);
      return {
        ...mapped,
        privateDescription: '',
        clientId: '',
        clientName: '',
        attachments: [],
      };
    });
  },

  async getClientMarketplaceCommissionBySlug(slug: string): Promise<CommissionRequest | null> {
    if (!isSupabaseConfigured) {
      const found = mockCommissions.find(
        (c) => c.slug === slug && (c.status === 'offers_open' || c.status === 'published' || c.status === 'in_progress')
      );
      if (!found) return null;
      return { ...found, privateDescription: '', clientId: '', clientName: '', attachments: [], interiorImages: [] };
    }
    const { data, error } = await supabase
      .from('client_marketplace_commissions')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const mapped = mapCommissionRow(data as CommissionRow);
    return {
      ...mapped,
      privateDescription: '',
      clientId: '',
      clientName: '',
      attachments: [],
    };
  },

  async getSimilarCommissions(commissionId: string, limit = 3): Promise<CommissionRequest[]> {
    if (!isSupabaseConfigured) {
      return mockCommissions
        .filter((c) => c.id !== commissionId && (c.status === 'offers_open' || c.status === 'published' || c.status === 'in_progress'))
        .slice(0, limit);
    }
    const { data: current } = await supabase
      .from('client_marketplace_commissions')
      .select('style')
      .eq('id', commissionId)
      .maybeSingle();
    const style = (current as { style: string } | null)?.style;
    if (!style) {
      const { data, error } = await supabase
        .from('client_marketplace_commissions')
        .select('*')
        .neq('id', commissionId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data as CommissionRow[]).map((row) => {
        const mapped = mapCommissionRow(row);
        return { ...mapped, privateDescription: '', clientId: '', clientName: '', attachments: [] };
      });
    }
    const { data, error } = await supabase
      .from('client_marketplace_commissions')
      .select('*')
      .neq('id', commissionId)
      .ilike('style', `%${style}%`)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as CommissionRow[]).map((row) => {
      const mapped = mapCommissionRow(row);
      return { ...mapped, privateDescription: '', clientId: '', clientName: '', attachments: [] };
    });
  },
};
