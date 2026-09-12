import {
  Users, FileText, Inbox, Briefcase, Flag, TrendingUp, CheckCircle2, Clock,
  ShieldAlert, MessageCircleWarning, UserCheck, Database,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { timeAgo } from '@/lib/utils';

import { useState } from 'react';
import { adminService } from '@/services/adminService';

export function AdminDashboardPage() {
  const { user } = useAuth();
  const admin = useAdmin(user?.id ?? '', user?.displayName ?? 'Admin');
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  const pendingArtists = admin.users.filter((u) => u.role === 'artist' && u.status === 'pending');
  const pendingModeration = admin.moderationReports.filter((r) => r.status === 'open' || r.status === 'reviewing');
  const inProgressProjects = mockProjectsInProgress();
  const openBypass = admin.contactBypassAttempts.filter((b) => b.status === 'open');

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    const result = await adminService.seedDemoMarketplaceData();
    setSeedResult(result);
    setSeeding(false);
  };

  const stats = [
    { label: 'Użytkownicy', value: admin.users.length, icon: <Users className="h-5 w-5" />, accent: 'text-gold-300' },
    { label: 'Artyści oczekujący', value: pendingArtists.length, icon: <UserCheck className="h-5 w-5" />, accent: 'text-warning-light' },
    { label: 'Aktywne zlecenia', value: mockActiveCommissions(admin), icon: <FileText className="h-5 w-5" />, accent: 'text-gold-300' },
    { label: 'Zlecenia do moderacji', value: pendingModeration.length, icon: <ShieldAlert className="h-5 w-5" />, accent: 'text-error-light' },
    { label: 'Oferty', value: countOffers(), icon: <Inbox className="h-5 w-5" />, accent: 'text-gold-300' },
    { label: 'Projekty w realizacji', value: inProgressProjects, icon: <Briefcase className="h-5 w-5" />, accent: 'text-gold-300' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Pulpit admina" description="Przegląd platformy i moderacji." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-graphite-600/30 bg-graphite-600/50 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-graphite-500/50">
              <span className={s.accent}>{s.icon}</span>
            </div>
            <p className="mt-4 font-display text-3xl text-ivory-100">{s.value}</p>
            <p className="mt-1 text-sm text-graphite-300">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending artists */}
      {pendingArtists.length > 0 && (
        <Card className="bg-graphite-600 border-graphite-500/30">
          <CardBody>
            <div className="mb-4 flex items-center gap-2">
              <Flag className="h-5 w-5 text-gold-400" />
              <h2 className="font-display text-xl text-ivory-100">Artyści oczekujący na weryfikację</h2>
              <span className="rounded-full bg-gold-400 px-2 py-0.5 text-xs font-medium text-graphite-700">{pendingArtists.length}</span>
            </div>
            <div className="space-y-3">
              {pendingArtists.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-xl border border-graphite-600/30 bg-graphite-700 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={a.displayName} src={a.avatarUrl} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-ivory-100">{a.displayName}</p>
                      <p className="text-xs text-graphite-300">{a.email} · {a.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => admin.approveArtist(a.id, 'Zatwierdzenie z pulpitu admina')} className="rounded-full bg-success/20 px-4 py-2 text-xs font-medium text-success-light transition-colors hover:bg-success/30">Zatwierdź</button>
                    <button onClick={() => admin.rejectArtist(a.id, 'Odrzucenie z pulpitu admina')} className="rounded-full bg-error/20 px-4 py-2 text-xs font-medium text-error-light transition-colors hover:bg-error/30">Odrzuć</button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Moderation reports */}
      {pendingModeration.length > 0 && (
        <Card className="bg-graphite-600 border-graphite-500/30">
          <CardBody>
            <div className="mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-error-light" />
              <h2 className="font-display text-xl text-ivory-100">Zgłoszenia do moderacji</h2>
              <span className="rounded-full bg-error px-2 py-0.5 text-xs font-medium text-ivory-100">{pendingModeration.length}</span>
            </div>
            <div className="space-y-3">
              {pendingModeration.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-xl border border-graphite-600/30 bg-graphite-700 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-error/10">
                      <Flag className="h-4 w-4 text-error-light" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ivory-100">{r.reason}</p>
                      <p className="text-xs text-graphite-300">{r.description}</p>
                      <p className="mt-0.5 text-[10px] text-graphite-400">{r.targetType} · {timeAgo(r.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => admin.resolveReport(r.id, 'Rozwiązanie z pulpitu')} className="rounded-full bg-success/20 px-3 py-1.5 text-xs font-medium text-success-light transition-colors hover:bg-success/30">Rozwiąż</button>
                    <button onClick={() => admin.rejectReport(r.id, 'Odrzucenie z pulpitu')} className="rounded-full bg-graphite-500/30 px-3 py-1.5 text-xs font-medium text-graphite-200 transition-colors hover:bg-graphite-500/50">Odrzuć</button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Contact bypass attempts */}
      {openBypass.length > 0 && (
        <Card className="bg-graphite-600 border-graphite-500/30">
          <CardBody>
            <div className="mb-4 flex items-center gap-2">
              <MessageCircleWarning className="h-5 w-5 text-warning-light" />
              <h2 className="font-display text-xl text-ivory-100">Próby obejścia kontaktu</h2>
              <span className="rounded-full bg-warning px-2 py-0.5 text-xs font-medium text-graphite-700">{openBypass.length}</span>
            </div>
            <div className="space-y-3">
              {openBypass.map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-xl border border-graphite-600/30 bg-graphite-700 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                      <MessageCircleWarning className="h-4 w-4 text-warning-light" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ivory-100">{b.userName}</p>
                      <p className="text-xs text-graphite-300">Typ: {b.detectedType} · {timeAgo(b.createdAt)}</p>
                      <p className="mt-0.5 truncate text-xs italic text-graphite-400">"{b.messageBody}"</p>
                    </div>
                  </div>
                  <button onClick={() => admin.resolveBypassAttempt(b.id, 'Rozwiązanie z pulpitu')} className="rounded-full bg-success/20 px-3 py-1.5 text-xs font-medium text-success-light transition-colors hover:bg-success/30">Rozwiąż</button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Developer tools - seed demo data */}
      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody>
          <div className="mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-gold-400" />
            <h2 className="font-display text-xl text-ivory-100">Narzędzia deweloperskie</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-ivory-100">Dodaj przykładowe dane marketplace</p>
                <p className="text-xs text-graphite-300">Wstawia 10 artystów, 40 prac portfolio, 10 zleceń, komentarze i oferty. Operacja jest idempotentna.</p>
              </div>
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="shrink-0 rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-graphite-900 transition hover:bg-gold-400 disabled:opacity-50"
              >
                {seeding ? 'Dodawanie…' : 'Dodaj dane'}
              </button>
            </div>
            {seedResult && (
              <div className={`rounded-lg p-3 text-sm ${seedResult.success ? 'bg-success-dark/20 text-success-light' : 'bg-error-dark/20 text-error-light'}`}>
                {seedResult.message}
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Recent audit log */}
      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gold-400" />
            <h2 className="font-display text-xl text-ivory-100">Dziennik działań</h2>
          </div>
          <div className="space-y-3">
            {admin.auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-center justify-between border-b border-graphite-600/30 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-graphite-500/30">
                    {log.new_value === 'approved' || log.new_value === 'resolved' ? <CheckCircle2 className="h-4 w-4 text-success-light" /> : <Clock className="h-4 w-4 text-graphite-300" />}
                  </div>
                  <div>
                    <p className="text-sm text-ivory-100">{log.action}</p>
                    <p className="text-xs text-graphite-300">{log.entityType} · {log.entity_id} · {log.adminName}</p>
                  </div>
                </div>
                <span className="text-xs text-graphite-400">{timeAgo(log.date)}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Helper functions to count from mock data (imported separately to avoid circular deps)
import { mockCommissions, mockOffers, mockProjects } from '@/lib/mockData';
function mockActiveCommissions(admin: ReturnType<typeof useAdmin>) {
  void admin;
  return mockCommissions.filter((c) => c.status === 'published' || c.status === 'offers_open').length;
}
function countOffers() {
  return mockOffers.length;
}
function mockProjectsInProgress() {
  return mockProjects.filter((p) => p.status === 'concept_stage' || p.status === 'concept_accepted' || p.status === 'painting_in_progress' || p.status === 'preview_uploaded' || p.status === 'revision_requested').length;
}
