import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockArtistProfiles, mockArtistPortfolioItems, mockUsers } from '@/lib/mockData';
import {
  mapArtistProfileRow, mapPortfolioItemRow,
  type ArtistProfileRow, type PortfolioItemRow,
} from '@/types/database';
import type { ArtistProfile, ArtistPortfolioItem, ApprovalStatus, User } from '@/types';

export const artistsService = {
  async getAll(): Promise<ArtistProfile[]> {
    if (!isSupabaseConfigured) {
      return mockArtistProfiles.filter((a) => a.approvalStatus === 'approved');
    }
    const { data: artists, error } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('approval_status', 'approved')
      .order('created_at', { ascending: false });
    if (error) throw error;

    const { data: portfolio } = await supabase
      .from('artist_portfolio_items')
      .select('*')
      .eq('is_public', true);

    return (artists as ArtistProfileRow[]).map((row) => {
      const items = (portfolio as PortfolioItemRow[] | null)?.filter((p) => p.artist_id === row.id) ?? [];
      return mapArtistProfileRow(row, items.map(mapPortfolioItemRow));
    });
  },

  async getBySlug(slug: string): Promise<ArtistProfile | null> {
    if (!isSupabaseConfigured) {
      return mockArtistProfiles.find((a) => a.slug === slug && a.approvalStatus === 'approved') ?? null;
    }
    const { data, error } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('slug', slug)
      .eq('approval_status', 'approved')
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const { data: portfolio } = await supabase
      .from('artist_portfolio_items')
      .select('*')
      .eq('artist_id', (data as ArtistProfileRow).id)
      .eq('is_public', true);

    return mapArtistProfileRow(
      data as ArtistProfileRow,
      (portfolio as PortfolioItemRow[] | null)?.map(mapPortfolioItemRow) ?? []
    );
  },

  async getBySlugAnyStatus(slug: string): Promise<ArtistProfile | null> {
    if (!isSupabaseConfigured) {
      return mockArtistProfiles.find((a) => a.slug === slug) ?? null;
    }
    const { data, error } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const { data: portfolio } = await supabase
      .from('artist_portfolio_items')
      .select('*')
      .eq('artist_id', (data as ArtistProfileRow).id);

    return mapArtistProfileRow(
      data as ArtistProfileRow,
      (portfolio as PortfolioItemRow[] | null)?.map(mapPortfolioItemRow) ?? []
    );
  },

  async getByUserId(userId: string): Promise<ArtistProfile | null> {
    if (!isSupabaseConfigured) {
      return mockArtistProfiles.find((a) => a.userId === userId) ?? null;
    }
    const { data, error } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const { data: portfolio } = await supabase
      .from('artist_portfolio_items')
      .select('*')
      .eq('artist_id', (data as ArtistProfileRow).id);

    return mapArtistProfileRow(
      data as ArtistProfileRow,
      (portfolio as PortfolioItemRow[] | null)?.map(mapPortfolioItemRow) ?? []
    );
  },

  async getArtistProfile(artistId: string): Promise<ArtistProfile | null> {
    if (!isSupabaseConfigured) {
      return mockArtistProfiles.find((a) => a.id === artistId || a.userId === artistId) ?? null;
    }
    const { data, error } = await supabase
      .from('artist_profiles')
      .select('*')
      .or(`id.eq.${artistId},user_id.eq.${artistId}`)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const row = data as ArtistProfileRow;
    const { data: portfolio } = await supabase
      .from('artist_portfolio_items')
      .select('*')
      .eq('artist_id', row.id);

    return mapArtistProfileRow(
      row,
      (portfolio as PortfolioItemRow[] | null)?.map(mapPortfolioItemRow) ?? []
    );
  },

  async createArtistProfileForUser(userId: string, artistName: string): Promise<ArtistProfile> {
    if (!isSupabaseConfigured) {
      const existing = mockArtistProfiles.find((profile) => profile.userId === userId);
      if (!existing) throw new Error('Profil artysty nie istnieje w danych demonstracyjnych.');
      return existing;
    }

    const slugBase = artistName.toLowerCase().trim()
      .replace(/[ą]/g, 'a').replace(/[ć]/g, 'c').replace(/[ę]/g, 'e').replace(/[ł]/g, 'l')
      .replace(/[ń]/g, 'n').replace(/[ó]/g, 'o').replace(/[ś]/g, 's').replace(/[żź]/g, 'z')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `artysta-${userId.slice(0, 8)}`;

    let slug = slugBase;
    let suffix = 1;
    for (;;) {
      const { data: existing } = await supabase
        .from('artist_profiles')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      if (!existing) break;
      slug = `${slugBase}-${suffix++}`;
    }

    const { data, error } = await supabase
      .from('artist_profiles')
      .insert({
        user_id: userId,
        slug,
        artist_name: artistName,
        bio: '',
        location: '',
        styles: [],
        techniques: [],
        specializations: [],
        price_range_min: 0,
        price_range_max: 0,
        average_delivery_days: 14,
        approval_status: 'approved',
        is_verified: false,
        years_experience: 0,
      })
      .select('*')
      .single();
    if (error) throw error;
    return mapArtistProfileRow(data as ArtistProfileRow, []);
  },

  async updateArtistProfile(artistId: string, updates: Partial<{
    artistName: string;
    bio: string;
    location: string;
    styles: string[];
    techniques: string[];
    specializations: string[];
    priceRangeMin: number;
    priceRangeMax: number;
    averageDeliveryDays: number;
    website: string;
    instagram: string;
    avatarUrl: string;
    coverUrl: string;
  }>): Promise<void> {
    if (!isSupabaseConfigured) return;
    const row: Record<string, unknown> = {};
    if (updates.artistName !== undefined) row.artist_name = updates.artistName;
    if (updates.bio !== undefined) row.bio = updates.bio;
    if (updates.location !== undefined) row.location = updates.location;
    if (updates.styles !== undefined) row.styles = updates.styles;
    if (updates.techniques !== undefined) row.techniques = updates.techniques;
    if (updates.specializations !== undefined) row.specializations = updates.specializations;
    if (updates.priceRangeMin !== undefined) row.price_range_min = updates.priceRangeMin;
    if (updates.priceRangeMax !== undefined) row.price_range_max = updates.priceRangeMax;
    if (updates.averageDeliveryDays !== undefined) row.average_delivery_days = updates.averageDeliveryDays;
    if (updates.website !== undefined) row.website = updates.website;
    if (updates.instagram !== undefined) row.instagram = updates.instagram;
    if (updates.avatarUrl !== undefined) row.avatar_url = updates.avatarUrl;
    if (updates.coverUrl !== undefined) row.cover_url = updates.coverUrl;

    const { error } = await supabase
      .from('artist_profiles')
      .update(row)
      .eq('id', artistId);
    if (error) throw error;
  },

  async getArtistPortfolio(artistId: string): Promise<ArtistPortfolioItem[]> {
    if (!isSupabaseConfigured) {
      return mockArtistPortfolioItems.filter((p) => p.artistId === artistId);
    }
    const { data, error } = await supabase
      .from('artist_portfolio_items')
      .select('*')
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as PortfolioItemRow[]).map(mapPortfolioItemRow);
  },

  async addPortfolioItem(item: {
    artistId: string;
    title: string;
    imageUrl: string;
    technique: string;
    year: string;
    widthCm: number;
    heightCm: number;
    isPublic: boolean;
    isForSale: boolean;
    price?: number;
  }): Promise<ArtistPortfolioItem | null> {
    if (!isSupabaseConfigured) {
      return {
        id: crypto.randomUUID(),
        artistId: item.artistId,
        title: item.title,
        imageUrl: item.imageUrl,
        technique: item.technique,
        year: item.year,
        widthCm: item.widthCm,
        heightCm: item.heightCm,
        isPublic: item.isPublic,
        isForSale: item.isForSale,
        price: item.price,
      };
    }
    const { data, error } = await supabase
      .from('artist_portfolio_items')
      .insert({
        artist_id: item.artistId,
        title: item.title,
        image_url: item.imageUrl,
        technique: item.technique,
        year: item.year,
        width_cm: item.widthCm,
        height_cm: item.heightCm,
        is_public: item.isPublic,
        is_for_sale: item.isForSale,
        price: item.price,
      })
      .select('*')
      .single();
    if (error) throw error;
    return mapPortfolioItemRow(data as PortfolioItemRow);
  },

  async getPendingArtists(): Promise<ArtistProfile[]> {
    if (!isSupabaseConfigured) {
      return mockArtistProfiles.filter((a) => a.approvalStatus === 'pending');
    }
    const { data, error } = await supabase
      .from('artist_profiles')
      .select('*')
      .eq('approval_status', 'pending');
    if (error) throw error;
    return (data as ArtistProfileRow[]).map((row) => mapArtistProfileRow(row, []));
  },

  async getPendingArtistUsers(): Promise<User[]> {
    if (!isSupabaseConfigured) {
      return mockUsers.filter((u) => u.role === 'artist' && u.status === 'pending');
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'artist')
      .eq('status', 'pending');
    if (error) throw error;
    return (data as unknown[]).map((row) => {
      const r = row as { id: string; email: string; role: string; status: string; display_name: string; avatar_url: string | null; created_at: string };
      return {
        id: r.id,
        email: r.email,
        role: r.role as User['role'],
        status: r.status as User['status'],
        displayName: r.display_name,
        avatarUrl: r.avatar_url ?? undefined,
        createdAt: r.created_at,
      };
    });
  },

  async updateApprovalStatus(artistProfileId: string, status: ApprovalStatus): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('artist_profiles')
      .update({ approval_status: status })
      .eq('id', artistProfileId);
    if (error) throw error;
  },

  async deletePortfolioItem(itemId: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('artist_portfolio_items')
      .delete()
      .eq('id', itemId);
    if (error) throw error;
  },

  async updatePortfolioItem(itemId: string, updates: Partial<{
    title: string;
    technique: string;
    year: string;
    widthCm: number;
    heightCm: number;
    isPublic: boolean;
    isForSale: boolean;
    price: number;
  }>): Promise<void> {
    if (!isSupabaseConfigured) return;
    const row: Record<string, unknown> = {};
    if (updates.title !== undefined) row.title = updates.title;
    if (updates.technique !== undefined) row.technique = updates.technique;
    if (updates.year !== undefined) row.year = updates.year;
    if (updates.widthCm !== undefined) row.width_cm = updates.widthCm;
    if (updates.heightCm !== undefined) row.height_cm = updates.heightCm;
    if (updates.isPublic !== undefined) row.is_public = updates.isPublic;
    if (updates.isForSale !== undefined) row.is_for_sale = updates.isForSale;
    if (updates.price !== undefined) row.price = updates.price;

    const { error } = await supabase
      .from('artist_portfolio_items')
      .update(row)
      .eq('id', itemId);
    if (error) throw error;
  },

  async getApprovedArtists(): Promise<ArtistProfile[]> {
    return this.getAll();
  },

  async getApprovedArtistBySlug(slug: string): Promise<ArtistProfile | null> {
    return this.getBySlug(slug);
  },
};
