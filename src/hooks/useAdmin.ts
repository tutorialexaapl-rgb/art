import { useCallback, useEffect, useState } from 'react';
import {
  mockUsers, mockArtistProfiles, mockClientProfiles, mockCommissions, mockOffers,
  mockProjects, mockComments, mockModerationReports, mockAuditLogs, mockSettings,
  mockContactBypassAttempts,
} from '@/lib/mockData';
import type {
  AdminAuditLog, ContactBypassAttempt, ModerationEvent, ModerationReport, PlatformSettings, User, UserRole, UserStatus,
} from '@/types';
import {
  fetchReports, fetchEvents, updateReportStatus, adminHideContent, adminSuspendUser, adminAddNote,
} from '@/services/moderationService';
import type { ModerationStatus, ModerationTarget } from '@/types';

const USERS_KEY = 'app_admin_users_v1';
const CONV_KEY = 'app_admin_commissions_v1';
const COMM_KEY = 'app_admin_comments_v1';
const REPO_KEY = 'app_admin_reports_v1';
const LOGS_KEY = 'app_admin_audit_v1';
const SETT_KEY = 'app_admin_settings_v1';
const BYPASS_KEY = 'app_admin_bypass_v1';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return fallback;
}

let logSeq = 0;

export interface UseAdminReturn {
  users: User[];
  settings: PlatformSettings;
  auditLogs: AdminAuditLog[];
  moderationReports: ModerationReport[];
  moderationEvents: ModerationEvent[];
  contactBypassAttempts: ContactBypassAttempt[];
  suspendUser: (id: string, reason?: string) => void;
  activateUser: (id: string, reason?: string) => void;
  changeUserRole: (id: string, newRole: UserRole, reason?: string) => void;
  approveArtist: (id: string, reason?: string) => void;
  rejectArtist: (id: string, reason: string) => void;
  suspendArtist: (id: string, reason?: string) => void;
  approveCommission: (id: string, reason?: string) => void;
  rejectCommission: (id: string, reason: string) => void;
  hideCommission: (id: string, reason?: string) => void;
  editCommissionSummary: (id: string, newSummary: string, reason?: string) => void;
  hideComment: (id: string, reason?: string) => void;
  restoreComment: (id: string, reason?: string) => void;
  deleteComment: (id: string, reason?: string) => void;
  resolveReport: (id: string, reason?: string) => void;
  rejectReport: (id: string, reason?: string) => void;
  suspendUserFromReport: (userId: string, reason?: string) => void;
  hideContentFromReport: (targetId: string, targetType: string, reason?: string) => void;
  resolveBypassAttempt: (id: string, reason?: string) => void;
  dismissBypassAttempt: (id: string, reason?: string) => void;
  suspendUserFromBypass: (userId: string, reason?: string) => void;
  updateSettings: (data: Partial<PlatformSettings>, reason?: string) => void;
  getArtistProfile: (userId: string) => ArtistProfile | undefined;
  getClientProfile: (userId: string) => ClientProfile | undefined;
  // DB-backed moderation actions
  setReportStatus: (id: string, status: ModerationStatus, note?: string) => Promise<void>;
  dbHideContent: (targetType: ModerationTarget, targetId: string, reason: string) => Promise<void>;
  dbSuspendUser: (userId: string, reason: string) => Promise<void>;
  dbAddNote: (reportId: string, note: string) => Promise<void>;
  refreshModeration: () => Promise<void>;
}

import type { ArtistProfile, ClientProfile } from '@/types';

export function useAdmin(adminId: string, adminName: string): UseAdminReturn {
  const [users, setUsers] = useState<User[]>(() => load(USERS_KEY, mockUsers));
  const [commissions, setCommissions] = useState(() => load(CONV_KEY, mockCommissions));
  const [comments, setComments] = useState(() => load(COMM_KEY, mockComments));
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>(() => load(REPO_KEY, mockModerationReports));
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => load(LOGS_KEY, mockAuditLogs));
  const [settings, setSettings] = useState<PlatformSettings>(() => load(SETT_KEY, mockSettings));
  const [moderationEvents, setModerationEvents] = useState<ModerationEvent[]>([]);
  const [contactBypassAttempts, setContactBypassAttempts] = useState<ContactBypassAttempt[]>(() => load(BYPASS_KEY, mockContactBypassAttempts));

  useEffect(() => { try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch { /* ignore */ } }, [users]);
  useEffect(() => { try { localStorage.setItem(CONV_KEY, JSON.stringify(commissions)); } catch { /* ignore */ } }, [commissions]);
  useEffect(() => { try { localStorage.setItem(COMM_KEY, JSON.stringify(comments)); } catch { /* ignore */ } }, [comments]);
  useEffect(() => { try { localStorage.setItem(REPO_KEY, JSON.stringify(moderationReports)); } catch { /* ignore */ } }, [moderationReports]);
  useEffect(() => { try { localStorage.setItem(LOGS_KEY, JSON.stringify(auditLogs)); } catch { /* ignore */ } }, [auditLogs]);
  useEffect(() => { try { localStorage.setItem(SETT_KEY, JSON.stringify(settings)); } catch { /* ignore */ } }, [settings]);
  useEffect(() => { try { localStorage.setItem(BYPASS_KEY, JSON.stringify(contactBypassAttempts)); } catch { /* ignore */ } }, [contactBypassAttempts]);

  const addLog = useCallback((entry: Omit<AdminAuditLog, 'id' | 'adminId' | 'adminName' | 'date'>) => {
    const log: AdminAuditLog = {
      ...entry,
      id: `al-${Date.now()}-${logSeq++}`,
      adminId,
      adminName,
      date: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  }, [adminId, adminName]);

  const setStatus = useCallback((id: string, newStatus: UserStatus, action: string, reason?: string) => {
    setUsers((prev) => {
      const user = prev.find((u) => u.id === id);
      if (user) addLog({ action, entityType: 'user', entity_id: id, old_value: user.status, new_value: newStatus, reason });
      return prev.map((u) => u.id === id ? { ...u, status: newStatus } : u);
    });
  }, [addLog]);

  const suspendUser = useCallback((id: string, reason?: string) => setStatus(id, 'suspended', 'suspend_user', reason), [setStatus]);
  const activateUser = useCallback((id: string, reason?: string) => setStatus(id, 'approved', 'activate_user', reason), [setStatus]);

  const changeUserRole = useCallback((id: string, newRole: UserRole, reason?: string) => {
    setUsers((prev) => {
      const user = prev.find((u) => u.id === id);
      if (user) addLog({ action: 'change_role', entityType: 'user', entity_id: id, old_value: user.role, new_value: newRole, reason });
      return prev.map((u) => u.id === id ? { ...u, role: newRole } : u);
    });
  }, [addLog]);

  const approveArtist = useCallback((id: string, reason?: string) => setStatus(id, 'approved', 'approve_artist', reason), [setStatus]);
  const rejectArtist = useCallback((id: string, reason: string) => setStatus(id, 'suspended', 'reject_artist', reason), [setStatus]);
  const suspendArtist = useCallback((id: string, reason?: string) => setStatus(id, 'suspended', 'suspend_artist', reason), [setStatus]);

  const approveCommission = useCallback((id: string, reason?: string) => {
    setCommissions((prev: typeof mockCommissions) => {
      const c = prev.find((x) => x.id === id);
      if (c) addLog({ action: 'approve_commission', entityType: 'commission', entity_id: id, old_value: c.status, new_value: 'published', reason });
      return prev.map((c) => c.id === id ? { ...c, status: 'published' as const } : c);
    });
  }, [addLog]);

  const rejectCommission = useCallback((id: string, reason: string) => {
    setCommissions((prev: typeof mockCommissions) => {
      const c = prev.find((x) => x.id === id);
      if (c) addLog({ action: 'reject_commission', entityType: 'commission', entity_id: id, old_value: c.status, new_value: 'rejected', reason });
      return prev.map((c) => c.id === id ? { ...c, status: 'rejected' as const } : c);
    });
  }, [addLog]);

  const hideCommission = useCallback((id: string, reason?: string) => {
    setCommissions((prev: typeof mockCommissions) => {
      const c = prev.find((x) => x.id === id);
      if (c) addLog({ action: 'hide_commission', entityType: 'commission', entity_id: id, old_value: c.status, new_value: 'hidden', reason });
      return prev.map((c) => c.id === id ? { ...c, status: 'hidden' as const } : c);
    });
  }, [addLog]);

  const editCommissionSummary = useCallback((id: string, newSummary: string, reason?: string) => {
    setCommissions((prev: typeof mockCommissions) => {
      const c = prev.find((x) => x.id === id);
      if (c) addLog({ action: 'edit_commission_summary', entityType: 'commission', entity_id: id, old_value: c.publicSummary ?? '', new_value: newSummary, reason });
      return prev.map((c) => c.id === id ? { ...c, publicSummary: newSummary } : c);
    });
  }, [addLog]);

  const hideComment = useCallback((id: string, reason?: string) => {
    setComments((prev: typeof mockComments) => {
      const c = prev.find((x) => x.id === id);
      if (c) addLog({ action: 'hide_comment', entityType: 'comment', entity_id: id, old_value: 'visible', new_value: 'hidden', reason });
      return prev.map((c) => c.id === id ? { ...c, isHidden: true } : c);
    });
  }, [addLog]);

  const restoreComment = useCallback((id: string, reason?: string) => {
    setComments((prev: typeof mockComments) => {
      const c = prev.find((x) => x.id === id);
      if (c) addLog({ action: 'restore_comment', entityType: 'comment', entity_id: id, old_value: 'hidden', new_value: 'visible', reason });
      return prev.map((c) => c.id === id ? { ...c, isHidden: false } : c);
    });
  }, [addLog]);

  const deleteComment = useCallback((id: string, reason?: string) => {
    setComments((prev: typeof mockComments) => {
      const c = prev.find((x) => x.id === id);
      if (c) addLog({ action: 'delete_comment', entityType: 'comment', entity_id: id, old_value: c.isHidden ? 'hidden' : 'visible', new_value: 'deleted', reason });
      return prev.filter((c) => c.id !== id);
    });
  }, [addLog]);

  const resolveReport = useCallback((id: string, reason?: string) => {
    setModerationReports((prev) => {
      const r = prev.find((x) => x.id === id);
      if (r) addLog({ action: 'resolve_report', entityType: 'report', entity_id: id, old_value: r.status, new_value: 'resolved', reason });
      return prev.map((r) => r.id === id ? { ...r, status: 'resolved' as const } : r);
    });
  }, [addLog]);

  const rejectReport = useCallback((id: string, reason?: string) => {
    setModerationReports((prev) => {
      const r = prev.find((x) => x.id === id);
      if (r) addLog({ action: 'reject_report', entityType: 'report', entity_id: id, old_value: r.status, new_value: 'rejected', reason });
      return prev.map((r) => r.id === id ? { ...r, status: 'rejected' as const } : r);
    });
  }, [addLog]);

  const suspendUserFromReport = useCallback((userId: string, reason?: string) => {
    suspendUser(userId, reason);
  }, [suspendUser]);

  const hideContentFromReport = useCallback((targetId: string, targetType: string, reason?: string) => {
    if (targetType === 'comment') hideComment(targetId, reason);
    else if (targetType === 'commission') hideCommission(targetId, reason);
    else addLog({ action: 'hide_content', entityType: targetType, entity_id: targetId, old_value: '', new_value: 'hidden', reason });
  }, [hideComment, hideCommission, addLog]);

  const resolveBypassAttempt = useCallback((id: string, reason?: string) => {
    setContactBypassAttempts((prev) => {
      const b = prev.find((x) => x.id === id);
      if (b) addLog({ action: 'resolve_bypass', entityType: 'contact_bypass', entity_id: id, old_value: b.status, new_value: 'resolved', reason });
      return prev.map((b) => b.id === id ? { ...b, status: 'resolved' as const } : b);
    });
  }, [addLog]);

  const dismissBypassAttempt = useCallback((id: string, reason?: string) => {
    setContactBypassAttempts((prev) => {
      const b = prev.find((x) => x.id === id);
      if (b) addLog({ action: 'dismiss_bypass', entityType: 'contact_bypass', entity_id: id, old_value: b.status, new_value: 'dismissed', reason });
      return prev.map((b) => b.id === id ? { ...b, status: 'dismissed' as const } : b);
    });
  }, [addLog]);

  const suspendUserFromBypass = useCallback((userId: string, reason?: string) => {
    suspendUser(userId, reason);
  }, [suspendUser]);

  const updateSettings = useCallback((data: Partial<PlatformSettings>, reason?: string) => {
    setSettings((prev) => {
      const prevRecord = prev as unknown as Record<string, unknown>;
      const dataRecord = data as unknown as Record<string, unknown>;
      const changedKeys = Object.keys(data).filter((k) => prevRecord[k] !== dataRecord[k]);
      if (changedKeys.length > 0) {
        addLog({
          action: 'update_settings',
          entityType: 'settings',
          entity_id: 'platform',
          old_value: changedKeys.map((k) => `${k}=${prevRecord[k]}`).join(', '),
          new_value: changedKeys.map((k) => `${k}=${dataRecord[k]}`).join(', '),
          reason,
        });
      }
      return { ...prev, ...data };
    });
  }, [addLog]);

  const refreshModeration = useCallback(async () => {
    try {
      const [reports, events] = await Promise.all([
        fetchReports(),
        fetchEvents(),
      ]);
      setModerationReports(reports.length > 0 ? reports : load(REPO_KEY, mockModerationReports));
      setModerationEvents(events);
    } catch { /* keep mock data */ }
  }, []);

  useEffect(() => { refreshModeration(); }, [refreshModeration]);

  const setReportStatus = useCallback(async (id: string, status: ModerationStatus, note?: string) => {
    await updateReportStatus(id, status, adminId, note);
    await refreshModeration();
  }, [adminId, refreshModeration]);

  const dbHideContent = useCallback(async (targetType: ModerationTarget, targetId: string, reason: string) => {
    await adminHideContent(targetType, targetId, adminId, adminName, reason);
    await refreshModeration();
  }, [adminId, adminName, refreshModeration]);

  const dbSuspendUser = useCallback(async (userId: string, reason: string) => {
    await adminSuspendUser(userId, adminId, adminName, reason);
  }, [adminId, adminName]);

  const dbAddNote = useCallback(async (reportId: string, note: string) => {
    await adminAddNote(reportId, adminId, adminName, note);
    await refreshModeration();
  }, [adminId, adminName, refreshModeration]);

  const getArtistProfile = useCallback((userId: string) => mockArtistProfiles.find((p) => p.userId === userId), []);
  const getClientProfile = useCallback((userId: string) => mockClientProfiles.find((p) => p.userId === userId), []);

  return {
    users, settings, auditLogs, moderationReports, moderationEvents, contactBypassAttempts,
    suspendUser, activateUser, changeUserRole,
    approveArtist, rejectArtist, suspendArtist,
    approveCommission, rejectCommission, hideCommission, editCommissionSummary,
    hideComment, restoreComment, deleteComment,
    resolveReport, rejectReport, suspendUserFromReport, hideContentFromReport,
    resolveBypassAttempt, dismissBypassAttempt, suspendUserFromBypass,
    updateSettings, getArtistProfile, getClientProfile,
    setReportStatus, dbHideContent, dbSuspendUser, dbAddNote, refreshModeration,
  };
}

export type { User, CommissionRequest, CommissionComment, CommissionOffer, CommissionProject } from '@/types';
