import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockProfiles, mockUsers, mockClientProfiles } from '@/lib/mockData';
import {
  mapProfileRow, mapProfileRowToUser, mapClientProfileRow,
  type ProfileRow, type ClientProfileRow,
} from '@/types/database';
import type { Profile, User, ClientProfile, UserRole, UserStatus } from '@/types';

export const profilesService = {
  async getCurrentProfile(userId: string): Promise<Profile | null> {
    if (!isSupabaseConfigured) {
      return mockProfiles.find((p) => p.userId === userId) ?? null;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data ? mapProfileRow(data as ProfileRow) : null;
  },

  async getAllUsers(): Promise<User[]> {
    if (!isSupabaseConfigured) {
      return mockUsers;
    }
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data as ProfileRow[]).map(mapProfileRowToUser);
  },

  async updateProfileStatus(userId: string, status: UserStatus): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('profiles').update({ status }).eq('id', userId);
    if (error) throw error;
  },

  async updateProfileRole(userId: string, role: UserRole): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
    if (error) throw error;
  },

  async getClientProfile(userId: string): Promise<ClientProfile | null> {
    if (!isSupabaseConfigured) {
      return mockClientProfiles.find((p) => p.userId === userId) ?? null;
    }
    const { data, error } = await supabase
      .from('client_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data ? mapClientProfileRow(data as ClientProfileRow) : null;
  },

  async getAllClientProfiles(): Promise<ClientProfile[]> {
    if (!isSupabaseConfigured) {
      return mockClientProfiles;
    }
    const { data, error } = await supabase.from('client_profiles').select('*');
    if (error) throw error;
    return (data as ClientProfileRow[]).map(mapClientProfileRow);
  },

  async updateOwnProfile(userId: string, updates: Partial<{
    displayName: string;
    avatarUrl: string;
    bio: string;
    location: string;
    phone: string;
    website: string;
    instagram: string;
  }>): Promise<void> {
    if (!isSupabaseConfigured) return;
    const row: Record<string, unknown> = {};
    if (updates.displayName !== undefined) row.display_name = updates.displayName;
    if (updates.avatarUrl !== undefined) row.avatar_url = updates.avatarUrl;
    if (updates.bio !== undefined) row.bio = updates.bio;
    if (updates.location !== undefined) row.location = updates.location;
    if (updates.phone !== undefined) {
      row.phone = updates.phone || null;
      row.phone_normalized = updates.phone ? updates.phone.replace(/[\s-]/g, '') : null;
    }
    if (updates.website !== undefined) row.website = updates.website || null;
    if (updates.instagram !== undefined) row.instagram = updates.instagram || null;

    const { error } = await supabase.from('profiles').update(row).eq('id', userId);
    if (error) throw error;
  },

  async updateClientProfile(userId: string, updates: Partial<{
    displayName: string;
    avatarUrl: string;
    bio: string;
    location: string;
    phone: string;
    clientType: string;
    company: string;
    nip: string;
  }>): Promise<void> {
    if (!isSupabaseConfigured) return;
    const row: Record<string, unknown> = {};
    if (updates.displayName !== undefined) row.display_name = updates.displayName;
    if (updates.avatarUrl !== undefined) row.avatar_url = updates.avatarUrl;
    if (updates.bio !== undefined) row.bio = updates.bio;
    if (updates.location !== undefined) row.location = updates.location;
    if (updates.phone !== undefined) row.phone = updates.phone || null;
    if (updates.clientType !== undefined) row.client_type = updates.clientType || null;
    if (updates.company !== undefined) row.company = updates.company || null;
    if (updates.nip !== undefined) row.nip = updates.nip || null;

    const { error } = await supabase.from('client_profiles').update(row).eq('user_id', userId);
    if (error) throw error;
  },
};
