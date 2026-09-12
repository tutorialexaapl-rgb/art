import { useState } from 'react';
import { Search, Ban, CheckCircle2, RefreshCw, UserCog } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Textarea } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/context/ToastContext';
import { formatDate } from '@/lib/utils';
import type { User, UserRole } from '@/types';

export function AdminUsersPage() {
  const { user } = useAuth();
  const admin = useAdmin(user?.id ?? '', user?.displayName ?? 'Admin');
  const { notify } = useToast();

  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [suspendTarget, setSuspendTarget] = useState<User | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [roleTarget, setRoleTarget] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');

  const filtered = admin.users.filter((u) => {
    if (query && !u.displayName.toLowerCase().includes(query.toLowerCase()) && !u.email.toLowerCase().includes(query.toLowerCase())) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    return true;
  });

  function confirmSuspend() {
    if (!suspendTarget) return;
    admin.suspendUser(suspendTarget.id, suspendReason || 'Zawieszenie konta');
    notify('success', `Zawieszono użytkownika ${suspendTarget.displayName}`);
    setSuspendTarget(null);
    setSuspendReason('');
  }

  function confirmRoleChange() {
    if (!roleTarget) return;
    admin.changeUserRole(roleTarget.id, selectedRole, `Zmiana roli na ${selectedRole}`);
    notify('success', `Zmieniono rolę: ${roleTarget.displayName} → ${selectedRole}`);
    setRoleTarget(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Użytkownicy" description="Zarządzaj wszystkimi użytkownikami platformy." />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Szukaj użytkowników..." value={query} onChange={(e) => setQuery(e.target.value)} icon={<Search className="h-4 w-4" />} />
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="sm:w-44">
          <option value="all">Wszystkie role</option>
          <option value="client">Zlecający</option>
          <option value="artist">Artyści</option>
          <option value="admin">Admini</option>
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-44">
          <option value="all">Wszystkie statusy</option>
          <option value="approved">Zatwierdzony</option>
          <option value="pending">Oczekuje</option>
          <option value="suspended">Zawieszony</option>
        </Select>
      </div>

      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-graphite-500/30 text-graphite-300">
                  <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wide">Użytkownik</th>
                  <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wide">Rola</th>
                  <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-wide">Dołączył</th>
                  <th className="px-6 py-3 text-right font-mono text-xs uppercase tracking-wide">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-graphite-500/20 last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.displayName} src={u.avatarUrl} size="xs" />
                        <div>
                          <p className="text-ivory-100">{u.displayName}</p>
                          <p className="text-xs text-graphite-300">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge color={u.role === 'artist' ? 'gold' : u.role === 'admin' ? 'error' : 'neutral'}>
                        {u.role === 'artist' ? 'Artysta' : u.role === 'admin' ? 'Admin' : 'Zlecający'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        u.status === 'approved' ? 'bg-success/20 text-success-light' :
                        u.status === 'pending' ? 'bg-warning/20 text-warning-light' :
                        'bg-error/20 text-error-light'
                      }`}>
                        {u.status === 'approved' ? 'Zatwierdzony' : u.status === 'pending' ? 'Oczekuje' : 'Zawieszony'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-graphite-300">{formatDate(u.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5">
                        {u.status === 'suspended' ? (
                          <button onClick={() => { admin.activateUser(u.id, 'Aktywacja konta'); notify('success', `Aktywowano: ${u.displayName}`); }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/20 text-success-light transition-colors hover:bg-success/30" title="Aktywuj">
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        ) : (
                          <button onClick={() => setSuspendTarget(u)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-error/20 text-error-light transition-colors hover:bg-error/30" title="Zawieś">
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => { setRoleTarget(u); setSelectedRole(u.role); }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-graphite-500/30 text-graphite-200 transition-colors hover:bg-graphite-500/50" title="Zmień rolę">
                          <UserCog className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Suspend modal */}
      <Modal open={!!suspendTarget} onClose={() => { setSuspendTarget(null); setSuspendReason(''); }} title="Zawieś użytkownika" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {suspendTarget && <Avatar name={suspendTarget.displayName} src={suspendTarget.avatarUrl} size="sm" />}
            <div>
              <p className="text-sm font-medium text-graphite-600">{suspendTarget?.displayName}</p>
              <p className="text-xs text-graphite-400">{suspendTarget?.email}</p>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Powód zawieszenia</label>
            <Textarea rows={3} placeholder="np. Naruszenie regulaminu, spam..." value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => { setSuspendTarget(null); setSuspendReason(''); }}>Anuluj</Button>
            <Button variant="primary" className="flex-1 !bg-error hover:!bg-error-dark" onClick={confirmSuspend}>Zawieś</Button>
          </div>
        </div>
      </Modal>

      {/* Role change modal */}
      <Modal open={!!roleTarget} onClose={() => setRoleTarget(null)} title="Zmień rolę użytkownika" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {roleTarget && <Avatar name={roleTarget.displayName} src={roleTarget.avatarUrl} size="sm" />}
            <div>
              <p className="text-sm font-medium text-graphite-600">{roleTarget?.displayName}</p>
              <p className="text-xs text-graphite-400">Obecna rola: {roleTarget?.role}</p>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Nowa rola</label>
            <Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as UserRole)} className="w-full">
              <option value="client">Zlecający</option>
              <option value="artist">Artysta</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setRoleTarget(null)}>Anuluj</Button>
            <Button variant="gold" className="flex-1" onClick={confirmRoleChange}>Zmień rolę</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
