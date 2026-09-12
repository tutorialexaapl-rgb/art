import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockOffers } from '@/lib/mockData';
import { mapOfferRow, type OfferRow } from '@/types/database';
import type { CommissionOffer, OfferStatus } from '@/types';

export const offersService = {
  async getAll(): Promise<CommissionOffer[]> {
    if (!isSupabaseConfigured) {
      return mockOffers;
    }
    const { data, error } = await supabase
      .from('commission_offers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as OfferRow[]).map(mapOfferRow);
  },

  async getByCommission(commissionId: string): Promise<CommissionOffer[]> {
    if (!isSupabaseConfigured) {
      return mockOffers.filter((o) => o.commissionId === commissionId);
    }
    const { data, error } = await supabase
      .from('commission_offers')
      .select('*')
      .eq('commission_request_id', commissionId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as OfferRow[]).map(mapOfferRow);
  },

  async getByArtist(artistId: string): Promise<CommissionOffer[]> {
    if (!isSupabaseConfigured) {
      return mockOffers.filter((o) => o.artistId === artistId);
    }
    const { data, error } = await supabase
      .from('commission_offers')
      .select('*')
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as OfferRow[]).map(mapOfferRow);
  },

  async getClientOffers(clientId: string): Promise<CommissionOffer[]> {
    if (!isSupabaseConfigured) {
      return mockOffers.filter((o) => {
        const commission = mockOffers.find((mc) => mc.commissionId === o.commissionId);
        return commission;
      });
    }
    const { data: commissions, error: commissionError } = await supabase
      .from('commission_requests')
      .select('id')
      .eq('client_id', clientId);
    if (commissionError) throw commissionError;
    if (!commissions || commissions.length === 0) return [];

    const commissionIds = (commissions as { id: string }[]).map((c) => c.id);
    const { data, error } = await supabase
      .from('commission_offers')
      .select('*')
      .in('commission_request_id', commissionIds)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as OfferRow[]).map(mapOfferRow);
  },

  async createOffer(offer: {
    commissionId: string;
    artistId: string;
    artistName: string;
    artistAvatarUrl?: string;
    artistSlug?: string;
    message: string;
    price: number;
    estimatedDays: number;
    includesMaterials: boolean;
    includesShipping: boolean;
    includesFrame: boolean;
    depositPercent: number;
    portfolioRefs: string[];
  }): Promise<CommissionOffer | null> {
    if (!isSupabaseConfigured) {
      return {
        id: crypto.randomUUID(),
        commissionId: offer.commissionId,
        artistId: offer.artistId,
        artistName: offer.artistName,
        artistAvatarUrl: offer.artistAvatarUrl,
        artistSlug: offer.artistSlug,
        message: offer.message,
        price: offer.price,
        estimatedDays: offer.estimatedDays,
        includesMaterials: offer.includesMaterials,
        includesShipping: offer.includesShipping,
        includesFrame: offer.includesFrame,
        depositPercent: offer.depositPercent,
        portfolioRefs: offer.portfolioRefs,
        status: 'submitted',
        createdAt: new Date().toISOString(),
      };
    }
    const { data, error } = await supabase
      .from('commission_offers')
      .insert({
        commission_request_id: offer.commissionId,
        artist_id: offer.artistId,
        artist_name: offer.artistName,
        artist_avatar_url: offer.artistAvatarUrl,
        artist_slug: offer.artistSlug,
        message: offer.message,
        price: offer.price,
        estimated_days: offer.estimatedDays,
        includes_materials: offer.includesMaterials,
        includes_shipping: offer.includesShipping,
        includes_frame: offer.includesFrame,
        deposit_percent: offer.depositPercent,
        portfolio_refs: offer.portfolioRefs,
        status: 'pending',
      })
      .select('*')
      .single();
    if (error) throw error;
    return mapOfferRow(data as OfferRow);
  },

  async create(offer: Partial<CommissionOffer>): Promise<CommissionOffer | null> {
    return this.createOffer({
      commissionId: offer.commissionId ?? '',
      artistId: offer.artistId ?? '',
      artistName: offer.artistName ?? '',
      artistAvatarUrl: offer.artistAvatarUrl,
      artistSlug: offer.artistSlug,
      message: offer.message ?? '',
      price: offer.price ?? 0,
      estimatedDays: offer.estimatedDays ?? 0,
      includesMaterials: offer.includesMaterials ?? false,
      includesShipping: offer.includesShipping ?? false,
      includesFrame: offer.includesFrame ?? false,
      depositPercent: offer.depositPercent ?? 30,
      portfolioRefs: offer.portfolioRefs ?? [],
    });
  },

  async acceptOffer(offerId: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('commission_offers')
      .update({ status: 'accepted' })
      .eq('id', offerId);
    if (error) throw error;
  },

  async rejectOthers(commissionId: string, acceptedOfferId: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('commission_offers')
      .update({ status: 'rejected' })
      .eq('commission_request_id', commissionId)
      .neq('id', acceptedOfferId)
      .in('status', ['submitted', 'viewed', 'shortlisted', 'pending']);
    if (error) throw error;
  },

  async updateStatus(id: string, status: OfferStatus): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('commission_offers')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },
};
