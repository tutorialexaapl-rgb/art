import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  mockUsers, mockModerationReports, mockAuditLogs, mockSettings, mockContactBypassAttempts,
} from '@/lib/mockData';
import {
  mapProfileRowToUser, mapModerationReportRow, mapAuditLogRow,
  type ProfileRow, type ModerationReportRow, type AuditLogRow,
} from '@/types/database';
import type {
  AdminAuditLog, ArtistProfile, ContactBypassAttempt, ModerationReport, PlatformSettings, User, UserRole, UserStatus,
} from '@/types';
import {
  mapArtistProfileRow, mapPortfolioItemRow,
  type ArtistProfileRow, type PortfolioItemRow,
} from '@/types/database';

export const adminService = {
  async getAllUsers(): Promise<User[]> {
    if (!isSupabaseConfigured) {
      return mockUsers;
    }
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data as ProfileRow[]).map(mapProfileRowToUser);
  },

  async updateUserStatus(id: string, status: UserStatus): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('profiles').update({ status }).eq('id', id);
    if (error) throw error;
  },

  async updateUserRole(id: string, role: UserRole): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
    if (error) throw error;
  },

  async getModerationReports(): Promise<ModerationReport[]> {
    if (!isSupabaseConfigured) {
      return mockModerationReports;
    }
    const { data, error } = await supabase
      .from('moderation_reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as ModerationReportRow[]).map(mapModerationReportRow);
  },

  async resolveReport(id: string, note?: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('moderation_reports')
      .update({ status: 'resolved', resolved_at: new Date().toISOString(), resolution_note: note })
      .eq('id', id);
    if (error) throw error;
  },

  async rejectReport(id: string, note?: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('moderation_reports')
      .update({ status: 'dismissed', resolved_at: new Date().toISOString(), resolution_note: note })
      .eq('id', id);
    if (error) throw error;
  },

  async getAuditLogs(): Promise<AdminAuditLog[]> {
    if (!isSupabaseConfigured) {
      return mockAuditLogs;
    }
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data as AuditLogRow[]).map(mapAuditLogRow);
  },

  async insertAuditLog(entry: {
    adminId: string;
    adminName: string;
    action: string;
    targetType: string;
    targetId: string;
    details: string;
  }): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('audit_logs').insert({
      admin_id: entry.adminId,
      admin_name: entry.adminName,
      action: entry.action,
      target_type: entry.targetType,
      target_id: entry.targetId,
      details: entry.details,
    });
    if (error) { /* non-critical */ }
  },

  async getSettings(): Promise<PlatformSettings> {
    if (!isSupabaseConfigured) {
      return mockSettings;
    }
    return mockSettings;
  },

  async getContactBypassAttempts(): Promise<ContactBypassAttempt[]> {
    if (!isSupabaseConfigured) {
      return mockContactBypassAttempts;
    }
    return mockContactBypassAttempts;
  },

  async seedDemoMarketplaceData(): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Supabase nie jest skonfigurowany.' };
    }
    const { data, error } = await supabase.rpc('seed_demo_marketplace_data_full');
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Dodano przykładowe dane marketplace.' };
  },

  async getAllArtistProfiles(): Promise<ArtistProfile[]> {
    if (!isSupabaseConfigured) {
      return [];
    }
    const { data: artists, error } = await supabase
      .from('artist_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;

    const { data: portfolio } = await supabase
      .from('artist_portfolio_items')
      .select('*');

    return (artists as ArtistProfileRow[]).map((row) => {
      const items = (portfolio as PortfolioItemRow[] | null)?.filter((p) => p.artist_id === row.id) ?? [];
      return mapArtistProfileRow(row, items.map(mapPortfolioItemRow));
    });
  },
};
