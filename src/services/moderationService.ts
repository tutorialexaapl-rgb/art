import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { detectContactAttempts } from '@/lib/contactDetection';
import type {
  ModerationReport, ModerationStatus, ModerationTarget,
} from '@/types';
import {
  mapModerationReportRow, mapModerationEventRow, type ModerationReportRow,
  type ModerationEventRow, type AuditLogRow,
} from '@/types/database';
import type { ModerationEvent } from '@/types';

export interface CreateReportInput {
  targetId: string;
  targetType: ModerationTarget;
  reportedBy: string;
  reportedByName: string;
  reason: string;
  description: string;
}

export interface ModerationEventInput {
  userId?: string;
  eventType: 'moderation_action' | 'contact_attempt' | 'rate_limit' | 'duplicate_message';
  entityType?: 'commission' | 'comment' | 'offer' | 'profile' | 'message';
  entityId?: string;
  moderatorId?: string;
  moderatorName?: string;
  action: string;
  note?: string;
  metadata?: Record<string, unknown>;
  reportId?: string;
}

// ─── Reports ───

export async function createReport(input: CreateReportInput): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('moderation_reports').insert({
    target_id: input.targetId,
    target_type: input.targetType,
    reported_by: input.reportedBy,
    reported_by_name: input.reportedByName,
    reason: input.reason,
    description: input.description,
    status: 'open',
  });
  if (error) throw error;
}

export async function fetchReports(filters?: {
  status?: ModerationStatus | 'all';
  targetType?: ModerationTarget | 'all';
  userId?: string;
}): Promise<ModerationReport[]> {
  if (!isSupabaseConfigured) return [];
  let query = supabase
    .from('moderation_reports')
    .select('*')
    .order('created_at', { ascending: false });
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.targetType && filters.targetType !== 'all') {
    query = query.eq('target_type', filters.targetType);
  }
  if (filters?.userId) {
    query = query.eq('reported_by', filters.userId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as ModerationReportRow[]).map(mapModerationReportRow);
}

export async function updateReportStatus(
  id: string,
  status: ModerationStatus,
  resolvedBy: string,
  note?: string,
): Promise<void> {
  if (!isSupabaseConfigured) return;
  const update: Record<string, unknown> = {
    status,
    resolved_by: status === 'open' || status === 'reviewing' ? null : resolvedBy,
    resolution_note: note ?? null,
    updated_at: new Date().toISOString(),
  };
  if (status === 'resolved' || status === 'rejected' || status === 'dismissed') {
    update.resolved_at = new Date().toISOString();
  } else {
    update.resolved_at = null;
  }
  const { error } = await supabase.from('moderation_reports').update(update).eq('id', id);
  if (error) throw error;
}

// ─── Moderation Events ───

export async function fetchEvents(filters?: {
  eventType?: string | 'all';
  entityType?: string | 'all';
  userId?: string;
}): Promise<ModerationEvent[]> {
  if (!isSupabaseConfigured) return [];
  let query = supabase
    .from('moderation_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (filters?.eventType && filters.eventType !== 'all') {
    query = query.eq('event_type', filters.eventType);
  }
  if (filters?.entityType && filters.entityType !== 'all') {
    query = query.eq('entity_type', filters.entityType);
  }
  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as ModerationEventRow[]).map(mapModerationEventRow);
}

export async function logEvent(input: ModerationEventInput): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('moderation_events').insert({
    user_id: input.userId ?? null,
    event_type: input.eventType,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    moderator_id: input.moderatorId ?? null,
    moderator_name: input.moderatorName ?? null,
    action: input.action,
    note: input.note ?? null,
    metadata: input.metadata ?? null,
    report_id: input.reportId ?? null,
  });
  if (error) { /* non-critical */ }
}

// ─── Admin Actions (with mandatory reason) ───

export async function adminHideContent(
  targetType: ModerationTarget,
  targetId: string,
  adminId: string,
  adminName: string,
  reason: string,
): Promise<void> {
  if (!reason.trim()) throw new Error('Powód jest wymagany dla akcji moderacyjnej.');
  const tableMap: Record<string, string> = {
    comment: 'commission_comments',
    commission: 'commission_requests',
    offer: 'commission_offers',
    profile: 'profiles',
  };
  const table = tableMap[targetType];
  if (!table || !isSupabaseConfigured) return;

  let update: Record<string, unknown>;
  if (targetType === 'comment') update = { is_hidden: true };
  else if (targetType === 'commission') update = { status: 'hidden' };
  else if (targetType === 'offer') update = { status: 'withdrawn' };
  else if (targetType === 'profile') update = { status: 'suspended' };
  else return;

  const { error } = await supabase.from(table).update(update).eq('id', targetId);
  if (error) throw error;

  await logEvent({
    moderatorId: adminId,
    moderatorName: adminName,
    eventType: 'moderation_action',
    entityType: targetType,
    entityId: targetId,
    action: 'hide_content',
    note: reason,
  });
  await logAdminAudit(adminId, adminName, 'hide_content', targetType, targetId, reason);
}

export async function adminSuspendUser(
  userId: string,
  adminId: string,
  adminName: string,
  reason: string,
): Promise<void> {
  if (!reason.trim()) throw new Error('Powód jest wymagany dla zawieszenia użytkownika.');
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('profiles').update({ status: 'suspended' }).eq('id', userId);
  if (error) throw error;

  await logEvent({
    moderatorId: adminId,
    moderatorName: adminName,
    eventType: 'moderation_action',
    entityType: 'profile',
    entityId: userId,
    action: 'suspend_user',
    note: reason,
  });
  await logAdminAudit(adminId, adminName, 'suspend_user', 'user', userId, reason);
}

export async function adminAddNote(
  reportId: string,
  adminId: string,
  adminName: string,
  note: string,
): Promise<void> {
  if (!note.trim()) throw new Error('Notatka nie może być pusta.');
  await logEvent({
    moderatorId: adminId,
    moderatorName: adminName,
    eventType: 'moderation_action',
    action: 'add_note',
    note,
    reportId,
  });
}

async function logAdminAudit(
  adminId: string,
  adminName: string,
  action: string,
  targetType: string,
  targetId: string,
  details: string,
): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from('admin_audit_logs').insert({
    admin_id: adminId,
    admin_name: adminName,
    action,
    target_type: targetType,
    target_id: targetId,
    details,
  });
  if (error) { /* non-critical */ }
}

// ─── Antispam helpers ───

export async function logContactAttempt(
  userId: string,
  entityType: 'comment' | 'message' | 'offer',
  entityId: string,
  detectedTypes: { hasEmail: boolean; hasPhone: boolean; hasLink: boolean },
  matches: string[],
): Promise<void> {
  await logEvent({
    userId,
    eventType: 'contact_attempt',
    entityType,
    entityId,
    action: 'contact_info_detected',
    metadata: { detectedTypes, matches },
  });
}

export async function logRateLimit(
  userId: string,
  entityType: 'comment' | 'offer',
  action: string,
  count: number,
  windowMinutes: number,
): Promise<void> {
  await logEvent({
    userId,
    eventType: 'rate_limit',
    entityType,
    action,
    metadata: { count, windowMinutes },
  });
}

export async function logDuplicateMessage(
  userId: string,
  entityType: 'comment' | 'message',
  entityId: string,
  hash: string,
): Promise<void> {
  await logEvent({
    userId,
    eventType: 'duplicate_message',
    entityType,
    entityId,
    action: 'duplicate_blocked',
    metadata: { hash },
  });
}

export function checkContentForContactInfo(text: string) {
  return detectContactAttempts(text);
}
