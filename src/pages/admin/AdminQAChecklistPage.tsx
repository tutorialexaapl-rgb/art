import { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare, Check, X, Circle, ChevronDown, ChevronRight,
  StickyNote, RotateCcw, TrendingUp, User as UserIcon, ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Input';
import { ProductionReadiness } from '@/components/features/ProductionReadiness';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { cn, formatDate } from '@/lib/utils';

type CheckStatus = 'not_checked' | 'passed' | 'failed';

interface QAItem {
  id: string;
  label: string;
  status: CheckStatus;
  note: string;
  lastCheckedAt: string | null;
  checkedBy: string | null;
}

interface QASection {
  id: string;
  title: string;
  items: Omit<QAItem, 'status' | 'note' | 'lastCheckedAt' | 'checkedBy'>[];
}

const QA_SECTIONS: QASection[] = [
  {
    id: 'auth',
    title: 'Auth',
    items: [
      { id: 'auth_client_register', label: 'Rejestracja klienta' },
      { id: 'auth_artist_register', label: 'Rejestracja artysty' },
      { id: 'auth_login', label: 'Login' },
      { id: 'auth_logout', label: 'Logout' },
      { id: 'auth_reset_password', label: 'Reset hasła' },
      { id: 'auth_protected_routes', label: 'Protected routes' },
      { id: 'auth_role_redirects', label: 'Role redirects' },
    ],
  },
  {
    id: 'visibility',
    title: 'Widoczność',
    items: [
      { id: 'vis_no_private_desc', label: 'Publiczne zlecenie nie pokazuje private_description' },
      { id: 'vis_no_full_gallery', label: 'Publiczne zlecenie nie pokazuje pełnej galerii' },
      { id: 'vis_no_client_data', label: 'Publiczne zlecenie nie pokazuje danych klienta' },
      { id: 'vis_guest_no_comments', label: 'Gość nie widzi komentarzy' },
      { id: 'vis_guest_no_offers', label: 'Gość nie widzi ofert' },
      { id: 'vis_approved_artist_more_data', label: 'Approved artist widzi pełniejsze dane' },
      { id: 'vis_pending_artist_cannot_apply', label: 'Pending artist nie może aplikować' },
      { id: 'vis_client_own_commissions', label: 'Klient widzi tylko swoje zlecenia' },
    ],
  },
  {
    id: 'commissions',
    title: 'Zlecenia',
    items: [
      { id: 'com_client_adds', label: 'Klient dodaje zlecenie' },
      { id: 'com_adds_inspiration_photos', label: 'Dodaje zdjęcia inspiracyjne' },
      { id: 'com_sees_public_preview', label: 'Widzi podgląd publiczny' },
      { id: 'com_admin_approves', label: 'Admin zatwierdza' },
      { id: 'com_appears_publicly', label: 'Zlecenie pojawia się publicznie' },
    ],
  },
  {
    id: 'comments',
    title: 'Komentarze',
    items: [
      { id: 'cmt_artist_comments', label: 'Artysta komentuje' },
      { id: 'cmt_artist_adds_photo', label: 'Artysta dodaje zdjęcie' },
      { id: 'cmt_guest_cannot_comment', label: 'Gość nie komentuje' },
      { id: 'cmt_admin_hides', label: 'Admin ukrywa komentarz' },
    ],
  },
  {
    id: 'offers',
    title: 'Oferty',
    items: [
      { id: 'off_artist_sends', label: 'Artysta wysyła ofertę' },
      { id: 'off_no_duplicates', label: 'Nie może wysłać dwóch ofert' },
      { id: 'off_client_sees', label: 'Klient widzi ofertę' },
      { id: 'off_client_accepts', label: 'Klient akceptuje ofertę' },
      { id: 'off_project_created', label: 'Tworzy się projekt' },
    ],
  },
  {
    id: 'project',
    title: 'Projekt',
    items: [
      { id: 'prj_dashboard_created', label: 'Powstaje dashboard' },
      { id: 'prj_milestones_created', label: 'Tworzą się milestone\'y' },
      { id: 'prj_deposit_status_visible', label: 'Status zaliczki jest widoczny' },
      { id: 'prj_final_payment_status_visible', label: 'Status końcowej płatności jest widoczny' },
    ],
  },
  {
    id: 'payments',
    title: 'Płatności',
    items: [
      { id: 'pay_deposit_checkout_mock', label: 'Deposit checkout mock' },
      { id: 'pay_final_checkout_mock', label: 'Final payment checkout mock' },
      { id: 'pay_status_paid', label: 'Status paid' },
      { id: 'pay_status_failed_cancelled', label: 'Status failed/cancelled' },
    ],
  },
  {
    id: 'admin',
    title: 'Admin',
    items: [
      { id: 'adm_approve_artist', label: 'Zatwierdza artystę' },
      { id: 'adm_reject_artist', label: 'Odrzuca artystę' },
      { id: 'adm_approve_commission', label: 'Zatwierdza zlecenie' },
      { id: 'adm_hide_comment', label: 'Ukrywa komentarz' },
      { id: 'adm_suspend_user', label: 'Zawiesza użytkownika' },
      { id: 'adm_sees_audit_log', label: 'Widzi audit log' },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    items: [
      { id: 'mob_landing', label: 'Landing page' },
      { id: 'mob_commission_form', label: 'Formularz zlecenia' },
      { id: 'mob_commission_card', label: 'Karta zlecenia' },
      { id: 'mob_comments', label: 'Komentarze' },
      { id: 'mob_client_panel', label: 'Panel klienta' },
      { id: 'mob_artist_panel', label: 'Panel artysty' },
      { id: 'mob_admin_tables', label: 'Admin tabele' },
    ],
  },
];

const STORAGE_KEY = 'app_qa_checklist_v1';

function buildInitialItems(): Record<string, QAItem> {
  const map: Record<string, QAItem> = {};
  for (const section of QA_SECTIONS) {
    for (const item of section.items) {
      map[item.id] = {
        ...item,
        status: 'not_checked',
        note: '',
        lastCheckedAt: null,
        checkedBy: null,
      };
    }
  }
  return map;
}

function loadItems(): Record<string, QAItem> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, QAItem>;
      const initial = buildInitialItems();
      for (const key of Object.keys(initial)) {
        if (parsed[key]) {
          initial[key] = { ...initial[key], ...parsed[key] };
        }
      }
      return initial;
    }
  } catch { /* ignore */ }
  return buildInitialItems();
}

const STATUS_CONFIG: Record<CheckStatus, { label: string; icon: typeof Check; activeClass: string; badgeClass: string; dotClass: string }> = {
  not_checked: {
    label: 'Do sprawdzenia',
    icon: Circle,
    activeClass: 'bg-graphite-500/30 text-graphite-200 border-graphite-400/20',
    badgeClass: 'bg-graphite-500/30 text-graphite-300',
    dotClass: 'bg-graphite-400',
  },
  passed: {
    label: 'Pass',
    icon: Check,
    activeClass: 'bg-success/20 text-success-light border-success/30',
    badgeClass: 'bg-success/20 text-success-light',
    dotClass: 'bg-success',
  },
  failed: {
    label: 'Fail',
    icon: X,
    activeClass: 'bg-error/20 text-error-light border-error/30',
    badgeClass: 'bg-error/20 text-error-light',
    dotClass: 'bg-error',
  },
};

export function AdminQAChecklistPage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [items, setItems] = useState<Record<string, QAItem>>(loadItems);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(QA_SECTIONS.map((s) => s.id)));
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [activeTab, setActiveTab] = useState<'qa' | 'readiness'>('qa');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items]);

  const stats = useMemo(() => {
    const all = Object.values(items);
    const passed = all.filter((i) => i.status === 'passed').length;
    const failed = all.filter((i) => i.status === 'failed').length;
    const notChecked = all.filter((i) => i.status === 'not_checked').length;
    const total = all.length;
    return { passed, failed, notChecked, total };
  }, [items]);

  const progressPercent = stats.total > 0 ? Math.round(((stats.passed + stats.failed) / stats.total) * 100) : 0;

  function toggleSection(id: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function setStatus(itemId: string, status: CheckStatus) {
    setItems((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        status,
        lastCheckedAt: new Date().toISOString(),
        checkedBy: user?.displayName ?? 'Admin',
      },
    }));
  }

  function openNoteEditor(itemId: string) {
    setEditingNote(itemId);
    setNoteDraft(items[itemId]?.note ?? '');
  }

  function saveNote() {
    if (!editingNote) return;
    setItems((prev) => ({
      ...prev,
      [editingNote]: {
        ...prev[editingNote],
        note: noteDraft,
        lastCheckedAt: prev[editingNote].lastCheckedAt ?? new Date().toISOString(),
        checkedBy: prev[editingNote].checkedBy ?? user?.displayName ?? 'Admin',
      },
    }));
    setEditingNote(null);
    setNoteDraft('');
  }

  function resetAll() {
    setItems(buildInitialItems());
    notify('success', 'Checklista zresetowana.');
  }

  function getSectionStats(sectionId: string) {
    const sectionItems = QA_SECTIONS.find((s) => s.id === sectionId)?.items ?? [];
    const passed = sectionItems.filter((i) => items[i.id]?.status === 'passed').length;
    const failed = sectionItems.filter((i) => items[i.id]?.status === 'failed').length;
    const total = sectionItems.length;
    return { passed, failed, total };
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="QA Checklist"
        description="Checklista testów przed publikacją MVP i readiness do produkcji."
      />

      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('qa')}
          className={cn(
            'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
            activeTab === 'qa'
              ? 'bg-gold-400 text-graphite-700'
              : 'border border-graphite-500/30 text-graphite-200 hover:bg-graphite-500/30',
          )}
        >
          <CheckSquare className="h-4 w-4" /> Testy MVP
        </button>
        <button
          onClick={() => setActiveTab('readiness')}
          className={cn(
            'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
            activeTab === 'readiness'
              ? 'bg-gold-400 text-graphite-700'
              : 'border border-graphite-500/30 text-graphite-200 hover:bg-graphite-500/30',
          )}
        >
          <ShieldCheck className="h-4 w-4" /> Production Readiness
        </button>
      </div>

      {activeTab === 'readiness' && <ProductionReadiness />}

      {activeTab === 'qa' && (<>
      <div className="flex justify-end">
        <button
          onClick={resetAll}
          className="flex items-center gap-2 rounded-full border border-graphite-500/30 px-4 py-2 text-sm font-medium text-graphite-200 transition-colors hover:bg-graphite-500/30"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-graphite-600/30 bg-graphite-600/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-graphite-500/50">
              <CheckSquare className="h-5 w-5 text-graphite-200" />
            </div>
            <div>
              <p className="font-display text-2xl text-ivory-100">{stats.total}</p>
              <p className="text-xs text-graphite-300">Wszystkie testy</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-graphite-600/30 bg-graphite-600/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20">
              <Check className="h-5 w-5 text-success-light" />
            </div>
            <div>
              <p className="font-display text-2xl text-success-light">{stats.passed}</p>
              <p className="text-xs text-graphite-300">Pass</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-graphite-600/30 bg-graphite-600/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error/20">
              <X className="h-5 w-5 text-error-light" />
            </div>
            <div>
              <p className="font-display text-2xl text-error-light">{stats.failed}</p>
              <p className="text-xs text-graphite-300">Fail</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-graphite-600/30 bg-graphite-600/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/20">
              <TrendingUp className="h-5 w-5 text-gold-300" />
            </div>
            <div>
              <p className="font-display text-2xl text-gold-300">{progressPercent}%</p>
              <p className="text-xs text-graphite-300">Pokrycie</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl border border-graphite-600/30 bg-graphite-600/50 p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-graphite-300">Postęp testów</span>
          <span className="text-xs text-graphite-400">{stats.passed + stats.failed} / {stats.total}</span>
        </div>
        <div className="flex h-2 w-full gap-1 overflow-hidden rounded-full bg-graphite-700">
          <div className="h-full bg-success transition-all duration-500" style={{ width: `${(stats.passed / stats.total) * 100}%` }} />
          <div className="h-full bg-error transition-all duration-500" style={{ width: `${(stats.failed / stats.total) * 100}%` }} />
        </div>
      </div>

      {/* Sections */}
      {QA_SECTIONS.map((section) => {
        const isExpanded = expandedSections.has(section.id);
        const sStats = getSectionStats(section.id);

        return (
          <Card key={section.id} hover={false} className="bg-graphite-600 border-graphite-500/30">
            {/* Section header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between border-b border-graphite-500/30 px-6 py-4 text-left transition-colors hover:bg-graphite-500/10"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown className="h-4 w-4 text-graphite-300" /> : <ChevronRight className="h-4 w-4 text-graphite-300" />}
                <h2 className="font-display text-lg text-ivory-100">{section.title}</h2>
                <div className="flex items-center gap-2">
                  {sStats.passed > 0 && <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-medium text-success-light">{sStats.passed} pass</span>}
                  {sStats.failed > 0 && <span className="rounded-full bg-error/20 px-2 py-0.5 text-xs font-medium text-error-light">{sStats.failed} fail</span>}
                  {sStats.total - sStats.passed - sStats.failed > 0 && (
                    <span className="rounded-full bg-graphite-500/30 px-2 py-0.5 text-xs font-medium text-graphite-300">{sStats.total - sStats.passed - sStats.failed} todo</span>
                  )}
                </div>
              </div>
              <div className="flex h-1.5 w-24 gap-0.5 overflow-hidden rounded-full bg-graphite-700">
                <div className="h-full bg-success" style={{ width: `${(sStats.passed / sStats.total) * 100}%` }} />
                <div className="h-full bg-error" style={{ width: `${(sStats.failed / sStats.total) * 100}%` }} />
              </div>
            </button>

            {/* Section items */}
            {isExpanded && (
              <CardBody className="space-y-1 p-0">
                {section.items.map((item) => {
                  const qaItem = items[item.id];
                  if (!qaItem) return null;
                  const statusCfg = STATUS_CONFIG[qaItem.status];
                  const StatusIcon = statusCfg.icon;
                  const isNoteEditing = editingNote === item.id;

                  return (
                    <div key={item.id} className="border-b border-graphite-500/20 px-6 py-3 last:border-0">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full', statusCfg.activeClass)}>
                            <StatusIcon className="h-3.5 w-3.5" />
                          </span>
                          <span className={cn('text-sm', qaItem.status === 'not_checked' ? 'text-graphite-300' : 'text-ivory-100')}>
                            {item.label}
                          </span>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          {/* Last checked info */}
                          {qaItem.lastCheckedAt && (
                            <div className="hidden items-center gap-2 text-xs text-graphite-400 sm:flex">
                              {qaItem.checkedBy && (
                                <span className="flex items-center gap-1">
                                  <UserIcon className="h-3 w-3" /> {qaItem.checkedBy}
                                </span>
                              )}
                              <span>{formatDate(qaItem.lastCheckedAt)}</span>
                            </div>
                          )}

                          {/* Note button */}
                          <button
                            onClick={() => isNoteEditing ? saveNote() : openNoteEditor(item.id)}
                            className={cn(
                              'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                              qaItem.note
                                ? 'bg-gold-400/20 text-gold-300 hover:bg-gold-400/30'
                                : 'bg-graphite-500/30 text-graphite-400 hover:bg-graphite-500/50',
                            )}
                            title={qaItem.note ? 'Edytuj notatkę' : 'Dodaj notatkę'}
                          >
                            <StickyNote className="h-3.5 w-3.5" />
                          </button>

                          {/* Status buttons */}
                          <div className="flex items-center gap-1">
                            {(Object.keys(STATUS_CONFIG) as CheckStatus[]).map((s) => {
                              const cfg = STATUS_CONFIG[s];
                              const Icon = cfg.icon;
                              const isActive = qaItem.status === s;
                              return (
                                <button
                                  key={s}
                                  onClick={() => setStatus(item.id, s)}
                                  className={cn(
                                    'flex h-7 w-7 items-center justify-center rounded-lg border transition-all',
                                    isActive
                                      ? cn(cfg.activeClass, 'scale-105')
                                      : 'border-graphite-500/20 text-graphite-400 hover:bg-graphite-500/30',
                                  )}
                                  title={cfg.label}
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Note editing */}
                      {isNoteEditing && (
                        <div className="mt-3 pl-9">
                          <Textarea
                            rows={2}
                            placeholder="Notatka z testu..."
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            autoFocus
                          />
                          <div className="mt-2 flex gap-2">
                            <button onClick={saveNote} className="rounded-full bg-gold-400 px-4 py-1.5 text-xs font-medium text-graphite-700 transition-colors hover:bg-gold-300">Zapisz notatkę</button>
                            <button onClick={() => { setEditingNote(null); setNoteDraft(''); }} className="rounded-full border border-graphite-500/30 px-4 py-1.5 text-xs font-medium text-graphite-300 transition-colors hover:bg-graphite-500/30">Anuluj</button>
                          </div>
                        </div>
                      )}

                      {/* Existing note display */}
                      {!isNoteEditing && qaItem.note && (
                        <div className="mt-2 flex items-start gap-2 pl-9">
                          <StickyNote className="mt-0.5 h-3 w-3 shrink-0 text-gold-300" />
                          <p className="text-xs italic text-graphite-400">{qaItem.note}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardBody>
            )}
          </Card>
        );
      })}
      </>)}
    </div>
  );
}
