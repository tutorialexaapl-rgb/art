import { useState } from 'react';
import {
  Search, Check, X, Ban, Eye, EyeOff, Trash2, Edit3, Flag,
  ShieldAlert, MessageCircleWarning, FileText, CheckCircle2,
  Mail, Send, Loader2, AlertCircle, Filter, Activity, StickyNote,
  Settings, ExternalLink,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/States';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/context/ToastContext';
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils';
import type { CommissionRequest, ModerationReport } from '@/types';
import { emailService } from '@/services/emailService';
import type { NotificationType } from '@/services/emailService';
import { NOTIFICATION_TYPE_LABELS } from '@/lib/emailTemplates';
import type { ModerationEvent, ModerationStatus, ModerationTarget } from '@/types';

/* ============ CLIENTS ============ */
export function AdminClientsPage() {
  const { user } = useAuth();
  const admin = useAdmin(user?.id ?? '', user?.displayName ?? 'Admin');

  const clients = admin.users.filter((u) => u.role === 'client');
  const [query, setQuery] = useState('');

  const filtered = clients.filter((c) =>
    !query || c.displayName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Klienci" description="Zarządzanie kontami zlecających." />
      <Input placeholder="Szukaj klientów..." value={query} onChange={(e) => setQuery(e.target.value)} icon={<Search className="h-4 w-4" />} />
      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-graphite-500/30 text-graphite-300">
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Klient</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Typ</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Zleceń</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Status</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Dołączył</th>
              </tr></thead>
              <tbody>
                {filtered.map((c) => {
                  const profile = admin.getClientProfile(c.id);
                  return (
                    <tr key={c.id} className="border-b border-graphite-500/20 last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={c.displayName} size="xs" />
                          <div><p className="text-ivory-100">{c.displayName}</p><p className="text-xs text-graphite-300">{c.email}</p></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-graphite-300">{profile?.clientType ?? 'Indywidualny'}</span>
                      </td>
                      <td className="px-6 py-4 text-graphite-300">
                        {admin.users.length > 0 ? '-' : 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          c.status === 'approved' ? 'bg-success/20 text-success-light' :
                          c.status === 'pending' ? 'bg-warning/20 text-warning-light' :
                          'bg-error/20 text-error-light'
                        }`}>
                          {c.status === 'approved' ? 'Aktywny' : c.status === 'pending' ? 'Oczekuje' : 'Zawieszony'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-graphite-300">{formatDate(c.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/* ============ COMMISSIONS ============ */
export function AdminCommissionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const admin = useAdmin(user?.id ?? '', user?.displayName ?? 'Admin');
  const { notify } = useToast();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [summaryTarget, setSummaryTarget] = useState<CommissionRequest | null>(null);
  const [summaryText, setSummaryText] = useState('');
  const [rejectTarget, setRejectTarget] = useState<CommissionRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Load commissions from localStorage via the hook's internal state - but we need
  // the commissions array exposed. Since useAdmin doesn't expose it directly,
  // we use mockCommissions as fallback for read and admin actions for mutations.
  // For a proper MVP, we read from the admin hook's localStorage-backed state.
  // We'll use a local state synced to localStorage.
  const [commissions, setCommissions] = useState<CommissionRequest[]>(() => {
    try {
      const raw = localStorage.getItem('app_admin_commissions_v1');
      if (raw) return JSON.parse(raw) as CommissionRequest[];
    } catch { /* ignore */ }
    return [] as CommissionRequest[];
  });

  // Sync: poll localStorage for commission changes
  useState(() => {
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem('app_admin_commissions_v1');
        if (raw) setCommissions(JSON.parse(raw) as CommissionRequest[]);
      } catch { /* ignore */ }
    }, 500);
    return () => clearInterval(interval);
  });

  const filtered = commissions.filter((c) => {
    if (query && !c.title.toLowerCase().includes(query.toLowerCase())) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  function openSummaryEditor(c: CommissionRequest) {
    setSummaryTarget(c);
    setSummaryText(c.publicSummary ?? '');
  }

  function saveSummary() {
    if (!summaryTarget) return;
    admin.editCommissionSummary(summaryTarget.id, summaryText, 'Edycja podsumowania');
    notify('success', 'Zaktualizowano podsumowanie zlecenia.');
    setSummaryTarget(null);
  }

  function confirmReject() {
    if (!rejectTarget || !rejectReason.trim()) return;
    admin.rejectCommission(rejectTarget.id, rejectReason);
    notify('success', `Odrzucono zlecenie: ${rejectTarget.title}`);
    setRejectTarget(null);
    setRejectReason('');
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Zlecenia" description="Moderacja wszystkich zleceń na platformie." />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Szukaj zleceń..." value={query} onChange={(e) => setQuery(e.target.value)} icon={<Search className="h-4 w-4" />} />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-48">
          <option value="all">Wszystkie statusy</option>
          <option value="published">Opublikowane</option>
          <option value="pending_review">Oczekujące</option>
          <option value="offers_open">Otwarte na oferty</option>
          <option value="in_progress">W realizacji</option>
          <option value="completed">Zakończone</option>
          <option value="hidden">Ukryte</option>
          <option value="rejected">Odrzucone</option>
        </Select>
      </div>

      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-graphite-500/30 text-graphite-300">
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Zlecenie</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Klient</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Budżet</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Termin</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Komentarzy</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Ofert</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Status</th>
                <th className="px-6 py-3 text-right font-mono text-xs uppercase">Akcje</th>
              </tr></thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-graphite-500/20 last:border-0">
                    <td className="px-6 py-4 text-ivory-100">{c.title}</td>
                    <td className="px-6 py-4 text-graphite-300">{c.clientName}</td>
                    <td className="px-6 py-4 text-graphite-300">{formatCurrency(c.budgetMin)} – {formatCurrency(c.budgetMax)}</td>
                    <td className="px-6 py-4 text-graphite-300">{c.deadline ? formatDate(c.deadline) : '-'}</td>
                    <td className="px-6 py-4 text-graphite-300">{c.commentsCount ?? 0}</td>
                    <td className="px-6 py-4 text-graphite-300">{c.offersCount}</td>
                    <td className="px-6 py-4"><StatusBadge status={c.status} type="commission" /></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5">
                        {c.status !== 'published' && c.status !== 'in_progress' && (
                          <button onClick={() => { admin.approveCommission(c.id, 'Zatwierdzenie zlecenia'); notify('success', `Zatwierdzono: ${c.title}`); }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/20 text-success-light transition-colors hover:bg-success/30" title="Zatwierdź">
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => setRejectTarget(c)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-error/20 text-error-light transition-colors hover:bg-error/30" title="Odrzuć">
                          <X className="h-4 w-4" />
                        </button>
                        <button onClick={() => { admin.hideCommission(c.id, 'Ukrycie zlecenia'); notify('success', `Ukryto: ${c.title}`); }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-graphite-500/30 text-graphite-200 transition-colors hover:bg-graphite-500/50" title="Ukryj">
                          <EyeOff className="h-4 w-4" />
                        </button>
                        <button onClick={() => openSummaryEditor(c)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400/20 text-gold-300 transition-colors hover:bg-gold-400/30" title="Edytuj podsumowanie">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button onClick={() => navigate(`/admin/commissions/${c.id}/edytuj`)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400/20 text-gold-300 transition-colors hover:bg-gold-400/30" title="Pełna edycja">
                          <Settings className="h-4 w-4" />
                        </button>
                        <a href={`/zlecenia/${c.slug}`} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-graphite-500/30 text-graphite-200 transition-colors hover:bg-graphite-500/50" title="Otwórz publicznie">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Summary editor modal */}
      <Modal open={!!summaryTarget} onClose={() => setSummaryTarget(null)} title="Edytuj podsumowanie zlecenia" size="md">
        <div className="space-y-4">
          <p className="text-sm text-graphite-400">Podsumowanie jest publicznie widoczne na stronie zlecenia.</p>
          <div>
            <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Publiczne podsumowanie</label>
            <Textarea rows={4} value={summaryText} onChange={(e) => setSummaryText(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setSummaryTarget(null)}>Anuluj</Button>
            <Button variant="gold" className="flex-1" onClick={saveSummary}>Zapisz</Button>
          </div>
        </div>
      </Modal>

      {/* Reject modal */}
      <Modal open={!!rejectTarget} onClose={() => { setRejectTarget(null); setRejectReason(''); }} title="Odrzuć zlecenie" size="sm">
        <div className="space-y-4">
          <p className="text-sm font-medium text-graphite-600">{rejectTarget?.title}</p>
          <div>
            <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Powód odrzucenia</label>
            <Textarea rows={3} placeholder="np. Treść niezgodna z regulaminem..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => { setRejectTarget(null); setRejectReason(''); }}>Anuluj</Button>
            <Button variant="primary" className="flex-1 !bg-error hover:!bg-error-dark" onClick={confirmReject} disabled={!rejectReason.trim()}>Odrzuć</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ============ COMMENTS ============ */
export function AdminCommentsPage() {
  const { user } = useAuth();
  const admin = useAdmin(user?.id ?? '', user?.displayName ?? 'Admin');
  const { notify } = useToast();

  const [comments, setComments] = useState(() => {
    try {
      const raw = localStorage.getItem('app_admin_comments_v1');
      if (raw) return JSON.parse(raw) as typeof mockCommentsRef;
    } catch { /* ignore */ }
    return mockCommentsRef;
  });

  // Poll for comment changes from admin actions
  useState(() => {
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem('app_admin_comments_v1');
        if (raw) setComments(JSON.parse(raw) as typeof mockCommentsRef);
      } catch { /* ignore */ }
    }, 500);
    return () => clearInterval(interval);
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Komentarze" description="Moderacja komentarzy pod zleceniami." />
      <div className="space-y-3">
        {comments.map((c) => (
          <Card key={c.id} className={`bg-graphite-600 border-graphite-500/30 ${c.isHidden ? 'opacity-50' : ''}`}>
            <CardBody className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <Avatar name={c.authorName} src={c.authorAvatarUrl} size="sm" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ivory-100">{c.authorName}</span>
                    <Badge color={c.authorRole === 'artist' ? 'gold' : 'neutral'}>{c.authorRole === 'artist' ? 'Artysta' : 'Zlecający'}</Badge>
                    {c.isHidden && <Badge color="error">Ukryty</Badge>}
                    <span className="text-xs text-graphite-300">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-graphite-200">{c.body}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {c.isHidden ? (
                  <button onClick={() => { admin.restoreComment(c.id, 'Przywrócenie komentarza'); notify('success', 'Komentarz przywrócony.'); }} className="flex items-center gap-1.5 rounded-lg bg-success/20 px-3 py-1.5 text-xs text-success-light transition-colors hover:bg-success/30">
                    <Eye className="h-3 w-3" /> Przywróć
                  </button>
                ) : (
                  <button onClick={() => { admin.hideComment(c.id, 'Ukrycie komentarza'); notify('success', 'Komentarz ukryty.'); }} className="flex items-center gap-1.5 rounded-lg bg-warning/20 px-3 py-1.5 text-xs text-warning-light transition-colors hover:bg-warning/30">
                    <EyeOff className="h-3 w-3" /> Ukryj
                  </button>
                )}
                <button onClick={() => { admin.deleteComment(c.id, 'Usunięcie komentarza'); notify('success', 'Komentarz usunięty.'); }} className="flex items-center gap-1.5 rounded-lg bg-error/20 px-3 py-1.5 text-xs text-error-light transition-colors hover:bg-error/30">
                  <Trash2 className="h-3 w-3" /> Usuń
                </button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============ OFFERS ============ */
export function AdminOffersPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { mockOffers } = useMockOffers();

  const filtered = mockOffers.map((o) => {
    const commission = mockCommissionsRef.find((c) => c.id === o.commissionId);
    return { ...o, commissionTitle: commission?.title ?? '-' };
  }).filter((o) => {
    if (query && !o.artistName.toLowerCase().includes(query.toLowerCase())) return false;
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Oferty" description="Wszystkie formalne oferty na platformie." />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Szukaj ofert..." value={query} onChange={(e) => setQuery(e.target.value)} icon={<Search className="h-4 w-4" />} />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-44">
          <option value="all">Wszystkie statusy</option>
          <option value="pending">Oczekujące</option>
          <option value="accepted">Zaakceptowane</option>
          <option value="rejected">Odrzucone</option>
          <option value="withdrawn">Wycofane</option>
        </Select>
      </div>
      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-graphite-500/30 text-graphite-300">
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Artysta</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Zlecenie</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Cena</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Termin</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Status</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Data</th>
              </tr></thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-graphite-500/20 last:border-0">
                    <td className="px-6 py-4 text-ivory-100">{o.artistName}</td>
                    <td className="px-6 py-4 text-graphite-300">{o.commissionTitle ?? '-'}</td>
                    <td className="px-6 py-4 text-graphite-300">{formatCurrency(o.price)}</td>
                    <td className="px-6 py-4 text-graphite-300">{o.estimatedDays} dni</td>
                    <td className="px-6 py-4"><StatusBadge status={o.status} type="offer" /></td>
                    <td className="px-6 py-4 text-graphite-300">{timeAgo(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/* ============ PROJECTS ============ */
export function AdminProjectsPage() {
  const { mockProjects } = useMockProjects();

  return (
    <div className="space-y-6">
      <PageHeader title="Projekty" description="Wszystkie projekty realizacji z płatnościami." />
      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-graphite-500/30 text-graphite-300">
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Projekt</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Klient</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Artysta</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Wartość</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Status</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Zaliczka</th>
                <th className="px-6 py-3 text-left font-mono text-xs uppercase">Płatność końcowa</th>
              </tr></thead>
              <tbody>
                {mockProjects.map((p) => (
                  <tr key={p.id} className="border-b border-graphite-500/20 last:border-0">
                    <td className="px-6 py-4 text-ivory-100">{p.commissionTitle}</td>
                    <td className="px-6 py-4 text-graphite-300">{p.clientName}</td>
                    <td className="px-6 py-4 text-graphite-300">{p.artistName}</td>
                    <td className="px-6 py-4 text-graphite-300">{formatCurrency(p.totalPrice)}</td>
                    <td className="px-6 py-4"><StatusBadge status={p.status} type="project" /></td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.depositPaid ? 'bg-success/20 text-success-light' : 'bg-warning/20 text-warning-light'}`}>
                        {p.depositPaid ? 'Opłacono' : 'Oczekuje'}
                      </span>
                    </td>
 <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.finalPaid ? 'bg-success/20 text-success-light' : 'bg-warning/20 text-warning-light'}`}>
                        {p.finalPaid ? 'Opłacono' : 'Oczekuje'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/* ============ MODERATION ============ */
export function AdminModerationPage() {
  const { user } = useAuth();
  const admin = useAdmin(user?.id ?? '', user?.displayName ?? 'Admin');
  const { notify } = useToast();

  const [tab, setTab] = useState<'reports' | 'events' | 'bypass'>('reports');
  const [filterStatus, setFilterStatus] = useState<ModerationStatus | 'all'>('all');
  const [filterTarget, setFilterTarget] = useState<ModerationTarget | 'all'>('all');
  const [filterUser, setFilterUser] = useState('');
  const [filterEventType, setFilterEventType] = useState<string>('all');
  const [filterEntityType, setFilterEntityType] = useState<string>('all');

  const [actionModal, setActionModal] = useState<{
    kind: 'suspend' | 'hide' | 'resolve' | 'reject' | 'note';
    report: ModerationReport;
  } | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const allReports = admin.moderationReports;
  const filteredReports = allReports.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterTarget !== 'all' && r.targetType !== filterTarget) return false;
    if (filterUser.trim() && !r.reportedByName.toLowerCase().includes(filterUser.trim().toLowerCase())) return false;
    return true;
  });
  const openReports = filteredReports.filter((r) => r.status === 'open' || r.status === 'reviewing');
  const resolvedReports = filteredReports.filter((r) => r.status === 'resolved' || r.status === 'rejected' || r.status === 'dismissed');

  const filteredEvents = admin.moderationEvents.filter((e) => {
    if (filterEventType !== 'all' && e.eventType !== filterEventType) return false;
    if (filterEntityType !== 'all' && e.entityType !== filterEntityType) return false;
    return true;
  });

  const openBypass = admin.contactBypassAttempts.filter((b) => b.status === 'open');
  const resolvedBypass = admin.contactBypassAttempts.filter((b) => b.status !== 'open');

  async function executeAction() {
    if (!actionModal) return;
    if (actionModal.kind !== 'note' && !actionReason.trim()) {
      notify('error', 'Powód jest wymagany dla tej akcji.');
      return;
    }
    setActionLoading(true);
    try {
      const r = actionModal.report;
      if (actionModal.kind === 'suspend') {
        await admin.dbSuspendUser(r.reportedBy, actionReason);
        await admin.setReportStatus(r.id, 'resolved', `Użytkownik zawieszony: ${actionReason}`);
        notify('success', 'Użytkownik zawieszony, zgłoszenie rozwiązane.');
      } else if (actionModal.kind === 'hide') {
        await admin.dbHideContent(r.targetType, r.targetId, actionReason);
        await admin.setReportStatus(r.id, 'resolved', `Treść ukryta: ${actionReason}`);
        notify('success', 'Treść ukryta, zgłoszenie rozwiązane.');
      } else if (actionModal.kind === 'resolve') {
        await admin.setReportStatus(r.id, 'resolved', actionReason);
        notify('success', 'Zgłoszenie rozwiązane.');
      } else if (actionModal.kind === 'reject') {
        await admin.setReportStatus(r.id, 'rejected', actionReason);
        notify('info', 'Zgłoszenie odrzucone.');
      } else if (actionModal.kind === 'note') {
        await admin.dbAddNote(r.id, actionReason);
        notify('success', 'Notatka dodana.');
      }
      setActionModal(null);
      setActionReason('');
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Błąd akcji moderacyjnej.');
    } finally {
      setActionLoading(false);
    }
  }

  const EVENT_TYPE_LABELS: Record<string, string> = {
    moderation_action: 'Akcja moderacji',
    contact_attempt: 'Próba kontaktu',
    rate_limit: 'Limit częstotliwości',
    duplicate_message: 'Duplikat wiadomości',
  };
  const ENTITY_LABELS: Record<string, string> = {
    commission: 'Zlecenie', comment: 'Komentarz', offer: 'Oferta', profile: 'Profil', message: 'Wiadomość',
  };
  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    open: { label: 'Otwarte', color: 'bg-error/20 text-error-light' },
    reviewing: { label: 'W trakcie', color: 'bg-warning/20 text-warning-light' },
    resolved: { label: 'Rozwiązane', color: 'bg-success/20 text-success-light' },
    rejected: { label: 'Odrzucone', color: 'bg-graphite-500/30 text-graphite-200' },
    dismissed: { label: 'Odrzucone', color: 'bg-graphite-500/30 text-graphite-200' },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Moderacja" description="Zgłoszenia, zdarzenia bezpieczeństwa i próby obejścia kontaktu." />

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setTab('reports')} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === 'reports' ? 'bg-gold-400 text-graphite-700' : 'bg-graphite-600/50 text-graphite-200 hover:text-ivory-100'}`}>
          <span className="flex items-center gap-2"><Flag className="h-4 w-4" /> Zgłoszenia {openReports.length > 0 && <span className="rounded-full bg-error px-1.5 py-0.5 text-[10px] text-ivory-100">{openReports.length}</span>}</span>
        </button>
        <button onClick={() => setTab('events')} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === 'events' ? 'bg-gold-400 text-graphite-700' : 'bg-graphite-600/50 text-graphite-200 hover:text-ivory-100'}`}>
          <span className="flex items-center gap-2"><Activity className="h-4 w-4" /> Zdarzenia {admin.moderationEvents.length > 0 && <span className="rounded-full bg-warning px-1.5 py-0.5 text-[10px] text-graphite-700">{admin.moderationEvents.length}</span>}</span>
        </button>
        <button onClick={() => setTab('bypass')} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === 'bypass' ? 'bg-gold-400 text-graphite-700' : 'bg-graphite-600/50 text-graphite-200 hover:text-ivory-100'}`}>
          <span className="flex items-center gap-2"><MessageCircleWarning className="h-4 w-4" /> Próby obejścia {openBypass.length > 0 && <span className="rounded-full bg-warning px-1.5 py-0.5 text-[10px] text-graphite-700">{openBypass.length}</span>}</span>
        </button>
      </div>

      {tab === 'reports' && (
        <div className="space-y-4">
          {/* Filters */}
          <Card className="bg-graphite-600 border-graphite-500/30">
            <CardBody className="flex flex-wrap items-end gap-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-graphite-300"><Filter className="h-4 w-4" /> Filtry</div>
              <div className="flex-1 min-w-[140px]">
                <label className="mb-1 block text-[10px] font-mono uppercase text-graphite-400">Status</label>
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as ModerationStatus | 'all')}>
                  <option value="all">Wszystkie</option>
                  <option value="open">Otwarte</option>
                  <option value="reviewing">W trakcie</option>
                  <option value="resolved">Rozwiązane</option>
                  <option value="rejected">Odrzucone</option>
                </Select>
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="mb-1 block text-[10px] font-mono uppercase text-graphite-400">Typ treści</label>
                <Select value={filterTarget} onChange={(e) => setFilterTarget(e.target.value as ModerationTarget | 'all')}>
                  <option value="all">Wszystkie</option>
                  <option value="commission">Zlecenie</option>
                  <option value="comment">Komentarz</option>
                  <option value="offer">Oferta</option>
                  <option value="profile">Profil</option>
                  <option value="message">Wiadomość</option>
                </Select>
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="mb-1 block text-[10px] font-mono uppercase text-graphite-400">Użytkownik</label>
                <Input placeholder="Szukaj po nazwie..." value={filterUser} onChange={(e) => setFilterUser(e.target.value)} />
              </div>
            </CardBody>
          </Card>

          {openReports.length === 0 && resolvedReports.length === 0 ? (
            <EmptyState icon={<ShieldAlert className="h-7 w-7" />} title="Brak zgłoszeń" description="Wszystko w porządku - brak zgłoszeń spełniających kryteria." />
          ) : (
            <>
              {openReports.length > 0 && (
                <div className="space-y-3">
                  <h2 className="font-display text-lg text-ivory-100">Oczekujące ({openReports.length})</h2>
                  {openReports.map((r) => (
                    <Card key={r.id} className="border-l-4 border-l-error bg-graphite-600 border-graphite-500/30">
                      <CardBody className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-error/10">
                              <Flag className="h-4 w-4 text-error-light" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-ivory-100">{r.reason}</p>
                              <p className="text-xs text-graphite-300">{r.description}</p>
                              <p className="mt-1 text-[10px] text-graphite-400">{ENTITY_LABELS[r.targetType] ?? r.targetType} · ID: {r.targetId} · {timeAgo(r.createdAt)}</p>
                              <p className="text-[10px] text-graphite-400">Zgłaszający: {r.reportedByName}</p>
                            </div>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_LABELS[r.status]?.color ?? ''}`}>{STATUS_LABELS[r.status]?.label ?? r.status}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => { setActionModal({ kind: 'resolve', report: r }); setActionReason(''); }} className="flex items-center gap-1.5 rounded-full bg-success/20 px-3 py-1.5 text-xs font-medium text-success-light transition-colors hover:bg-success/30">
                            <CheckCircle2 className="h-3 w-3" /> Rozwiąż
                          </button>
                          <button onClick={() => { setActionModal({ kind: 'reject', report: r }); setActionReason(''); }} className="rounded-full bg-graphite-500/30 px-3 py-1.5 text-xs font-medium text-graphite-200 transition-colors hover:bg-graphite-500/50">
                            <X className="h-3 w-3" /> Odrzuć
                          </button>
                          <button onClick={() => { setActionModal({ kind: 'hide', report: r }); setActionReason(''); }} className="flex items-center gap-1.5 rounded-full bg-warning/20 px-3 py-1.5 text-xs font-medium text-warning-light transition-colors hover:bg-warning/30">
                            <EyeOff className="h-3 w-3" /> Ukryj treść
                          </button>
                          <button onClick={() => { setActionModal({ kind: 'suspend', report: r }); setActionReason(''); }} className="flex items-center gap-1.5 rounded-full bg-error/20 px-3 py-1.5 text-xs font-medium text-error-light transition-colors hover:bg-error/30">
                            <Ban className="h-3 w-3" /> Zawieś użytkownika
                          </button>
                          <button onClick={() => { setActionModal({ kind: 'note', report: r }); setActionReason(''); }} className="flex items-center gap-1.5 rounded-full bg-graphite-500/30 px-3 py-1.5 text-xs font-medium text-graphite-200 transition-colors hover:bg-graphite-500/50">
                            <StickyNote className="h-3 w-3" /> Dodaj notatkę
                          </button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
              {resolvedReports.length > 0 && (
                <div className="space-y-3">
                  <h2 className="font-display text-lg text-graphite-300">Rozwiązane ({resolvedReports.length})</h2>
                  {resolvedReports.map((r) => (
                    <Card key={r.id} className="opacity-60 bg-graphite-600 border-graphite-500/30">
                      <CardBody className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-ivory-100">{r.reason}</p>
                          <p className="text-xs text-graphite-300">{ENTITY_LABELS[r.targetType] ?? r.targetType} · {timeAgo(r.createdAt)}</p>
                          {r.resolutionNote && <p className="mt-0.5 text-[10px] italic text-graphite-400">Notatka: {r.resolutionNote}</p>}
                        </div>
                        <Badge color={r.status === 'resolved' ? 'success' : 'neutral'}>
                          {STATUS_LABELS[r.status]?.label ?? r.status}
                        </Badge>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === 'events' && (
        <div className="space-y-4">
          <Card className="bg-graphite-600 border-graphite-500/30">
            <CardBody className="flex flex-wrap items-end gap-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-graphite-300"><Filter className="h-4 w-4" /> Filtry</div>
              <div className="flex-1 min-w-[140px]">
                <label className="mb-1 block text-[10px] font-mono uppercase text-graphite-400">Typ zdarzenia</label>
                <Select value={filterEventType} onChange={(e) => setFilterEventType(e.target.value)}>
                  <option value="all">Wszystkie</option>
                  <option value="moderation_action">Akcja moderacji</option>
                  <option value="contact_attempt">Próba kontaktu</option>
                  <option value="rate_limit">Limit częstotliwości</option>
                  <option value="duplicate_message">Duplikat wiadomości</option>
                </Select>
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="mb-1 block text-[10px] font-mono uppercase text-graphite-400">Typ treści</label>
                <Select value={filterEntityType} onChange={(e) => setFilterEntityType(e.target.value)}>
                  <option value="all">Wszystkie</option>
                  <option value="commission">Zlecenie</option>
                  <option value="comment">Komentarz</option>
                  <option value="offer">Oferta</option>
                  <option value="profile">Profil</option>
                  <option value="message">Wiadomość</option>
                </Select>
              </div>
            </CardBody>
          </Card>

          {filteredEvents.length === 0 ? (
            <EmptyState icon={<Activity className="h-7 w-7" />} title="Brak zdarzeń" description="Nie zarejestrowano zdarzeń bezpieczeństwa." />
          ) : (
            <div className="space-y-2">
              {filteredEvents.map((e) => (
                <Card key={e.id} className="bg-graphite-600 border-graphite-500/30">
                  <CardBody className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      e.eventType === 'contact_attempt' ? 'bg-warning/10' :
                      e.eventType === 'rate_limit' ? 'bg-error/10' :
                      e.eventType === 'duplicate_message' ? 'bg-error/10' : 'bg-graphite-500/30'
                    }`}>
                      {e.eventType === 'contact_attempt' ? <MessageCircleWarning className="h-4 w-4 text-warning-light" /> :
                       e.eventType === 'rate_limit' || e.eventType === 'duplicate_message' ? <ShieldAlert className="h-4 w-4 text-error-light" /> :
                       <Activity className="h-4 w-4 text-graphite-200" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-ivory-100">{EVENT_TYPE_LABELS[e.eventType] ?? e.eventType}</p>
                        <span className="text-[10px] text-graphite-400">{timeAgo(e.createdAt)}</span>
                      </div>
                      <p className="text-xs text-graphite-300">
                        {e.entityType && <span>{ENTITY_LABELS[e.entityType] ?? e.entityType}</span>}
                        {e.entityId && <span> · ID: {e.entityId.slice(0, 8)}</span>}
                        {e.moderatorName && <span> · Moderator: {e.moderatorName}</span>}
                      </p>
                      <p className="text-xs text-graphite-300">Akcja: {e.action}</p>
                      {e.note && <p className="mt-1 text-xs italic text-graphite-400">"{e.note}"</p>}
                      {e.metadata && (
                        <p className="mt-0.5 text-[10px] text-graphite-500">
                          {JSON.stringify(e.metadata).slice(0, 120)}
                        </p>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'bypass' && (
        <div className="space-y-4">
          {openBypass.length === 0 && resolvedBypass.length === 0 ? (
            <EmptyState icon={<MessageCircleWarning className="h-7 w-7" />} title="Brak prób obejścia" description="Nie wykryto prób kontaktu poza platformą." />
          ) : (
            <>
              {openBypass.length > 0 && (
                <div className="space-y-3">
                  <h2 className="font-display text-lg text-ivory-100">Oczekujące ({openBypass.length})</h2>
                  {openBypass.map((b) => (
                    <Card key={b.id} className="border-l-4 border-l-warning bg-graphite-600 border-graphite-500/30">
                      <CardBody className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                            <MessageCircleWarning className="h-4 w-4 text-warning-light" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-ivory-100">{b.userName}</p>
                            <p className="text-xs text-graphite-300">Typ: {b.detectedType} · {timeAgo(b.createdAt)}</p>
                            <p className="mt-1 truncate text-xs italic text-graphite-400">"{b.messageBody}"</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => { admin.resolveBypassAttempt(b.id, 'Rozwiązanie'); notify('success', 'Próba obejścia rozwiązana.'); }} className="flex items-center gap-1.5 rounded-full bg-success/20 px-3 py-1.5 text-xs font-medium text-success-light transition-colors hover:bg-success/30">
                            <CheckCircle2 className="h-3 w-3" /> Rozwiąż
                          </button>
                          <button onClick={() => { admin.dismissBypassAttempt(b.id, 'Odrzucenie'); notify('info', 'Próba obejścia odrzucona.'); }} className="rounded-full bg-graphite-500/30 px-3 py-1.5 text-xs font-medium text-graphite-200 transition-colors hover:bg-graphite-500/50">
                            Odrzuć
                          </button>
                          <button onClick={() => { admin.suspendUserFromBypass(b.userId, 'Zawieszenie za próbę obejścia'); notify('success', 'Użytkownik zawieszony.'); }} className="flex items-center gap-1.5 rounded-full bg-error/20 px-3 py-1.5 text-xs font-medium text-error-light transition-colors hover:bg-error/30">
                            <Ban className="h-3 w-3" /> Zawieś
                          </button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
              {resolvedBypass.length > 0 && (
                <div className="space-y-3">
                  <h2 className="font-display text-lg text-graphite-300">Rozwiązane ({resolvedBypass.length})</h2>
                  {resolvedBypass.map((b) => (
                    <Card key={b.id} className="opacity-60 bg-graphite-600 border-graphite-500/30">
                      <CardBody className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-ivory-100">{b.userName}</p>
                          <p className="text-xs text-graphite-300">Typ: {b.detectedType} · {timeAgo(b.createdAt)}</p>
                        </div>
                        <Badge color={b.status === 'resolved' ? 'success' : 'neutral'}>
                          {b.status === 'resolved' ? 'Rozwiązane' : 'Odrzucone'}
                        </Badge>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Action modal with mandatory reason */}
      <Modal
        open={!!actionModal}
        onClose={() => { setActionModal(null); setActionReason(''); }}
        title={actionModal?.kind === 'suspend' ? 'Zawieś użytkownika' : actionModal?.kind === 'hide' ? 'Ukryj treść' : actionModal?.kind === 'resolve' ? 'Rozwiąż zgłoszenie' : actionModal?.kind === 'reject' ? 'Odrzuć zgłoszenie' : 'Dodaj notatkę'}
        size="sm"
      >
        <div className="space-y-4">
          {actionModal && (
            <p className="text-sm text-graphite-400">
              Zgłoszenie: <span className="text-ivory-100">{actionModal.report.reason}</span>
              <br />Cel: <span className="text-graphite-300">{ENTITY_LABELS[actionModal.report.targetType] ?? actionModal.report.targetType} · {actionModal.report.reportedByName}</span>
            </p>
          )}
          <div>
            <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">
              {actionModal?.kind === 'note' ? 'Treść notatki' : 'Powód (wymagany)'}
            </label>
            <Textarea
              rows={3}
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder={actionModal?.kind === 'note' ? 'Wewnętrzna notatka moderacyjna...' : 'np. Naruszenie regulaminu, spam, niewłaściwe treści...'}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => { setActionModal(null); setActionReason(''); }} disabled={actionLoading}>Anuluj</Button>
            <Button
              variant="primary"
              className={`flex-1 ${
                actionModal?.kind === 'suspend' ? '!bg-error hover:!bg-error-dark' :
                actionModal?.kind === 'hide' ? '!bg-warning hover:!bg-warning-dark' :
                actionModal?.kind === 'reject' ? '!bg-graphite-500 hover:!bg-graphite-400' :
                '!bg-success hover:!bg-success-dark'
              }`}
              onClick={executeAction}
              disabled={actionLoading || (actionModal?.kind !== 'note' && !actionReason.trim())}
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {actionModal?.kind === 'suspend' ? 'Zawieś' : actionModal?.kind === 'hide' ? 'Ukryj' : actionModal?.kind === 'resolve' ? 'Rozwiąż' : actionModal?.kind === 'reject' ? 'Odrzuć' : 'Dodaj'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ============ SETTINGS ============ */
export function AdminSettingsPage() {
  const { user } = useAuth();
  const admin = useAdmin(user?.id ?? '', user?.displayName ?? 'Admin');
  const { notify } = useToast();

  const [form, setForm] = useState(admin.settings);
  const [testEmailType, setTestEmailType] = useState<NotificationType>('user_registered');
  const [testRecipient, setTestRecipient] = useState(user?.email ?? '');
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  function handleSave() {
    admin.updateSettings(form, 'Aktualizacja ustawień platformy');
    notify('success', 'Ustawienia zapisane.');
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Ustawienia" description="Konfiguracja platformy." />

      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="space-y-6">
          <h3 className="font-display text-lg text-ivory-100">Weryfikacja i moderacja</h3>

          <ToggleRow
            label="Artyści wymagają akceptacji"
            description="Nowi artyści muszą zostać zatwierdzeni przez admina przed publikacją profilu."
            checked={form.artistApprovalRequired}
            onChange={(v) => setForm({ ...form, artistApprovalRequired: v })}
          />
          <ToggleRow
            label="Zlecenia wymagają moderacji"
            description="Nowe zlecenia muszą zostać sprawdzone przed publikacją."
            checked={form.commissionModerationRequired}
            onChange={(v) => setForm({ ...form, commissionModerationRequired: v })}
          />
          <ToggleRow
            label="Aplikowanie jest darmowe"
            description="Artyści nie płacą za składanie ofert na zlecenia."
            checked={form.applicationFree}
            onChange={(v) => setForm({ ...form, applicationFree: v })}
          />
        </CardBody>
      </Card>

      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="space-y-6">
          <h3 className="font-display text-lg text-ivory-100">Płatności</h3>

          <div>
            <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Procent zaliczki</label>
            <div className="flex items-center gap-4">
              <input
                type="range" min={10} max={60} step={5}
                value={form.depositPercent}
                onChange={(e) => setForm({ ...form, depositPercent: Number(e.target.value) })}
                className="flex-1 accent-gold-400"
              />
              <span className="w-16 rounded-lg bg-graphite-500/30 px-3 py-2 text-center text-sm font-medium text-gold-300">{form.depositPercent}%</span>
            </div>
            <p className="mt-1.5 text-xs text-graphite-300">Końcowa płatność: {100 - form.depositPercent}%</p>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="space-y-6">
          <h3 className="font-display text-lg text-ivory-100">Komunikacja</h3>

          <div>
            <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Komunikat platformy</label>
            <Textarea rows={3} value={form.platformMessage} onChange={(e) => setForm({ ...form, platformMessage: e.target.value })} />
            <p className="mt-1.5 text-xs text-graphite-300">Wyświetlany na stronie głównej i w powiadomieniach.</p>
          </div>

          <div>
            <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">E-mail właściciela serwisu</label>
            <Input type="email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} />
          </div>
        </CardBody>
      </Card>

      {/* Test e-mail panel */}
      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="space-y-5">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-gold-400" />
            <h3 className="font-display text-lg text-ivory-100">Test powiadomień e-mail</h3>
          </div>
          <p className="text-sm text-graphite-300">
            Wyślij testowego e-maila wybranego typu, aby sprawdzić szablon i dostarczenie. Bez skonfigurowanego klucza RESEND_API_KEY e-maile działają w trybie mock (nie są wysyłane).
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Typ e-maila</label>
              <Select value={testEmailType} onChange={(e) => { setTestEmailType(e.target.value as NotificationType); setTestResult(null); }}>
                {Object.entries(NOTIFICATION_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Odbiorca testowy</label>
              <Input type="email" placeholder="test@example.com" value={testRecipient} onChange={(e) => { setTestRecipient(e.target.value); setTestResult(null); }} />
            </div>
          </div>

          {testResult && (
            <div className={`flex items-start gap-3 rounded-xl p-4 ${
              testResult.success ? 'bg-success/10 text-success-light' : 'bg-error/10 text-error-light'
            }`}>
              {testResult.success
                ? <Check className="mt-0.5 h-4 w-4 shrink-0" />
                : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
              <div>
                <p className="text-sm font-medium">{testResult.success ? 'Wynik: sukces' : 'Wynik: błąd'}</p>
                <p className="mt-0.5 text-xs opacity-80">{testResult.message}</p>
              </div>
            </div>
          )}

          {showPreview && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-graphite-300">
                <Eye className="h-3.5 w-3.5" /> Podgląd szablonu
              </div>
              <div className="max-h-72 overflow-y-auto rounded-xl border border-graphite-500/30 bg-ivory-50 p-4">
                <iframe
                  srcDoc={emailService.previewTemplate(testEmailType).html}
                  title="Podgląd e-mail"
                  className="h-56 w-full rounded-lg border-0"
                />
              </div>
              <p className="text-xs text-graphite-400">Temat: {emailService.previewTemplate(testEmailType).subject}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="h-4 w-4" /> {showPreview ? 'Ukryj podgląd' : 'Pokaż podgląd'}
            </Button>
            <Button
              variant="gold"
              onClick={async () => {
                if (!testRecipient.trim()) {
                  notify('error', 'Podaj adres e-mail odbiorcy.');
                  return;
                }
                setTestSending(true);
                setTestResult(null);
                const result = await emailService.sendTestEmail(testEmailType, testRecipient);
                setTestResult({ success: result.success, message: result.message });
                setTestSending(false);
                notify(result.success ? 'success' : 'error', result.message);
              }}
              disabled={testSending || !testRecipient.trim()}
            >
              {testSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {testSending ? 'Wysyłanie...' : 'Wyślij test'}
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button variant="gold" onClick={handleSave}>Zapisz ustawienia</Button>
      </div>
    </div>
  );
}

/* ============ Payments / SEO / QA (unchanged stubs) ============ */
export function AdminPaymentsPage() {
  const { mockProjects } = useMockProjects();
  return (
    <div className="space-y-6">
      <PageHeader title="Płatności" description="Historia płatności na platformie." />
      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-graphite-500/30 text-graphite-300">
              <th className="px-6 py-3 text-left font-mono text-xs uppercase">Projekt</th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase">Typ</th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase">Kwota</th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase">Status</th>
            </tr></thead>
            <tbody>
              {mockProjects.flatMap((p) => [
                { id: `${p.id}-dep`, project: p.commissionTitle, type: 'Zaliczka 40%', amount: p.depositAmount, paid: p.depositPaid },
                { id: `${p.id}-fin`, project: p.commissionTitle, type: 'Końcowa 60%', amount: p.finalAmount, paid: p.finalPaid },
              ]).map((row) => (
                <tr key={row.id} className="border-b border-graphite-500/20 last:border-0">
                  <td className="px-6 py-4 text-ivory-100">{row.project}</td>
                  <td className="px-6 py-4 text-graphite-300">{row.type}</td>
                  <td className="px-6 py-4 text-graphite-300">{formatCurrency(row.amount)}</td>
                  <td className="px-6 py-4"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${row.paid ? 'bg-success/20 text-success-light' : 'bg-warning/20 text-warning-light'}`}>{row.paid ? 'Opłacono' : 'Oczekuje'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export function AdminSEOPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="SEO" description="Optymalizacja dla wyszukiwarek." />
      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="space-y-5">
          <div><label className="block text-xs font-mono uppercase text-graphite-300 mb-2">Meta title</label><input className="w-full rounded-xl border border-graphite-500/30 bg-graphite-700 px-4 py-3 text-sm text-ivory-100" defaultValue="Atelier - Rynek zleceń na obrazy" /></div>
          <div><label className="block text-xs font-mono uppercase text-graphite-300 mb-2">Meta description</label><textarea className="w-full rounded-xl border border-graphite-500/30 bg-graphite-700 px-4 py-3 text-sm text-ivory-100" rows={3} defaultValue="Platforma łącząca zlecających z artystami malarzami." /></div>
        </CardBody>
      </Card>
    </div>
  );
}

/* ============ Helpers ============ */
function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-4 cursor-pointer">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`mt-0.5 relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-gold-400' : 'bg-graphite-500/50'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-ivory-100 transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
      </button>
      <div>
        <p className="text-sm font-medium text-ivory-100">{label}</p>
        <p className="text-xs text-graphite-300">{description}</p>
      </div>
    </label>
  );
}

import { mockComments as mockCommentsRef, mockOffers as mockOffersRef, mockProjects as mockProjectsRef, mockCommissions as mockCommissionsRef } from '@/lib/mockData';

function useMockOffers() {
  return { mockOffers: mockOffersRef };
}
function useMockProjects() {
  return { mockProjects: mockProjectsRef };
}
