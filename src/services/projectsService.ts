import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockProjects } from '@/lib/mockData';
import {
  mapProjectRow, mapMilestoneRow, mapPaymentRow, mapProgressImageRow, mapProjectMessageRow,
  type ProjectRow, type MilestoneRow, type PaymentRow, type ProgressImageRow, type ProjectMessageRow,
} from '@/types/database';
import type { CommissionProject, ProjectStatus } from '@/types';

export const projectsService = {
  async getAll(): Promise<CommissionProject[]> {
    if (!isSupabaseConfigured) {
      return mockProjects;
    }
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as ProjectRow[]).map((row) => mapProjectRow(row, [], [], [], []));
  },

  async getById(id: string): Promise<CommissionProject | null> {
    if (!isSupabaseConfigured) {
      return mockProjects.find((p) => p.id === id) ?? null;
    }
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!project) return null;

    const row = project as ProjectRow;

    const [milestonesRes, paymentsRes, imagesRes, messagesRes] = await Promise.all([
      supabase.from('milestones').select('*').eq('project_id', id).order('sort_order', { ascending: true }),
      supabase.from('payments').select('*').eq('project_id', id),
      supabase.from('progress_images').select('*').eq('project_id', id).order('uploaded_at', { ascending: false }),
      supabase.from('project_messages').select('*').eq('project_id', id).order('created_at', { ascending: true }),
    ]);

    return mapProjectRow(
      row,
      (milestonesRes.data as MilestoneRow[] | null)?.map(mapMilestoneRow) ?? [],
      (paymentsRes.data as PaymentRow[] | null)?.map(mapPaymentRow) ?? [],
      (imagesRes.data as ProgressImageRow[] | null)?.map(mapProgressImageRow) ?? [],
      (messagesRes.data as ProjectMessageRow[] | null)?.map(mapProjectMessageRow) ?? [],
    );
  },

  async getByClientId(clientId: string): Promise<CommissionProject[]> {
    if (!isSupabaseConfigured) {
      return mockProjects.filter((p) => p.clientId === clientId);
    }
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as ProjectRow[]).map((row) => mapProjectRow(row, [], [], [], []));
  },

  async getByArtistId(artistId: string): Promise<CommissionProject[]> {
    if (!isSupabaseConfigured) {
      return mockProjects.filter((p) => p.artistId === artistId);
    }
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as ProjectRow[]).map((row) => mapProjectRow(row, [], [], [], []));
  },

  async updateStatus(id: string, status: ProjectStatus): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('projects').update({ status }).eq('id', id);
    if (error) throw error;
  },
};
