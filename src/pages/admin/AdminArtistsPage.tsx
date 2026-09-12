import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Ban, Search, ImageIcon, Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/context/ToastContext';
import { formatCurrency } from '@/lib/utils';
import type { User } from '@/types';

export function AdminArtistsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const admin = useAdmin(user?.id ?? '', user?.displayName ?? 'Admin');
  const { notify } = useToast();

  const [query, setQuery] = useState('');
  const [rejectTarget, setRejectTarget] = useState<User | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [portfolioPreview, setPortfolioPreview] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);

  const artists = admin.users.filter((u) => u.role === 'artist');
  const filtered = artists.filter((a) =>
    !query || a.displayName.toLowerCase().includes(query.toLowerCase()) || (a.email ?? '').toLowerCase().includes(query.toLowerCase())
  );

  function confirmReject() {
    if (!rejectTarget || !rejectReason.trim()) return;
    admin.rejectArtist(rejectTarget.id, rejectReason);
    notify('success', `Odrzucono artystę: ${rejectTarget.displayName}`);
    setRejectTarget(null);
    setRejectReason('');
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await admin.deleteUser(deleteTarget.id, deleteReason || 'Trwałe usunięcie konta artysty');
      notify('success', `Trwale usunięto konto: ${deleteTarget.displayName}`);
    } catch {
      notify('error', 'Nie udało się usunąć konta. Spróbuj ponownie.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
      setDeleteReason('');
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Artyści" 
        description="Weryfikacja i zarządzanie artystami." 
        action={
          <button 
            onClick={() => navigate('/admin/artysci/nowy')}
            className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-5 py-2.5 text-sm font-medium text-graphite-700 transition-colors hover:bg-gold-500"
          >
            <Plus className="h-4 w-4" /> Nowy artysta
          </button>
        }
      />

      <Input placeholder="Szukaj artystów..." value={query} onChange={(e) => setQuery(e.target.value)} icon={<Search className="h-4 w-4" />} />

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((a) => {
          const profile = admin.getArtistProfile(a.id);
          return (
            <Card key={a.id} className="bg-graphite-600 border-graphite-500/30">
              <CardBody>
                <div className="flex items-start gap-4">
                  <Avatar name={a.displayName} src={a.avatarUrl} size="md" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg text-ivory-100">{a.displayName}</h3>
                      {a.isVerifiedArtist && <Badge color="gold">Zweryfikowany</Badge>}
                    </div>
                    <p className="text-xs text-graphite-300">{a.email} · {a.location}</p>
                    {profile && (
                      <p className="mt-1 text-xs text-graphite-400">
                        {profile.stats.completedProjects} realizacji · ⭐ {profile.stats.averageRating} · {profile.yearsExperience} lat exp.
                      </p>
                    )}
                    {profile && profile.specializations && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {profile.specializations.slice(0, 3).map((s) => (
                          <span key={s} className="rounded-full bg-graphite-500/30 px-2 py-0.5 text-[10px] text-graphite-200">{s}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        a.status === 'approved' ? 'bg-success/20 text-success-light' :
                        a.status === 'pending' ? 'bg-warning/20 text-warning-light' :
                        'bg-error/20 text-error-light'
                      }`}>
                        {a.status === 'approved' ? 'Zatwierdzony' : a.status === 'pending' ? 'Oczekuje' : 'Zawieszony'}
                      </span>
                      {profile && (
                        <span className="text-xs text-graphite-400">
                          {formatCurrency(profile.priceRangeMin)} – {formatCurrency(profile.priceRangeMax)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Portfolio preview thumbnails */}
                {profile && profile.portfolio.length > 0 && (
                  <div className="mt-4 flex gap-2">
                    {profile.portfolio.slice(0, 4).map((item) => (
                      <div key={item.id} className="h-16 w-16 overflow-hidden rounded-lg border border-graphite-500/30">
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                      </div>
                    ))}
                    {profile.portfolio.length > 4 && (
                      <button onClick={() => setPortfolioPreview(a)} className="flex h-16 w-16 items-center justify-center rounded-lg border border-graphite-500/30 bg-graphite-500/20 text-xs text-graphite-200 hover:bg-graphite-500/40">
                        +{profile.portfolio.length - 4}
                      </button>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button 
                    onClick={() => navigate(`/admin/artysci/${a.id}`)}
                    className="flex items-center gap-1.5 rounded-full bg-graphite-500/30 px-4 py-2 text-xs font-medium text-graphite-100 transition-colors hover:bg-graphite-500/50"
                  >
                    <Pencil className="h-3 w-3" /> Edytuj profil
                  </button>
                  {a.status === 'pending' && (
                    <>
                      <button onClick={() => { admin.approveArtist(a.id, 'Zatwierdzenie artysty'); notify('success', `Zatwierdzono: ${a.displayName}`); }} className="flex items-center gap-1.5 rounded-full bg-success/20 px-4 py-2 text-xs font-medium text-success-light transition-colors hover:bg-success/30">
                        <Check className="h-3 w-3" /> Zatwierdź
                      </button>
                      <button onClick={() => setRejectTarget(a)} className="flex items-center gap-1.5 rounded-full bg-error/20 px-4 py-2 text-xs font-medium text-error-light transition-colors hover:bg-error/30">
                        <X className="h-3 w-3" /> Odrzuć
                      </button>
                    </>
                  )}
                  {a.status === 'approved' && (
                    <button onClick={() => { admin.suspendArtist(a.id, 'Zawieszenie artysty'); notify('success', `Zawieszono: ${a.displayName}`); }} className="flex items-center gap-1.5 rounded-full bg-error/20 px-4 py-2 text-xs font-medium text-error-light transition-colors hover:bg-error/30">
                      <Ban className="h-3 w-3" /> Zawieś
                    </button>
                  )}
                  {a.status === 'suspended' && (
                    <button onClick={() => { admin.approveArtist(a.id, 'Ponowne zatwierdzenie'); notify('success', `Aktywowano: ${a.displayName}`); }} className="flex items-center gap-1.5 rounded-full bg-success/20 px-4 py-2 text-xs font-medium text-success-light transition-colors hover:bg-success/30">
                      <Check className="h-3 w-3" /> Aktywuj
                    </button>
                  )}
                  <button
                    onClick={() => { setDeleteTarget(a); setDeleteReason(''); }}
                    className="flex items-center gap-1.5 rounded-full bg-error/20 px-4 py-2 text-xs font-medium text-error-light transition-colors hover:bg-error/30"
                    title="Trwale usuń konto"
                  >
                    <Trash2 className="h-3 w-3" /> Usuń konto
                  </button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Reject modal */}
      <Modal open={!!rejectTarget} onClose={() => { setRejectTarget(null); setRejectReason(''); }} title="Odrzuć artystę" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {rejectTarget && <Avatar name={rejectTarget.displayName} src={rejectTarget.avatarUrl} size="sm" />}
            <div>
              <p className="text-sm font-medium text-graphite-600">{rejectTarget?.displayName}</p>
              <p className="text-xs text-graphite-400">{rejectTarget?.email}</p>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Powód odrzucenia</label>
            <Textarea rows={3} placeholder="np. Portfolio nie spełnia standardów, brak oryginalnych prac..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => { setRejectTarget(null); setRejectReason(''); }}>Anuluj</Button>
            <Button variant="primary" className="flex-1 !bg-error hover:!bg-error-dark" onClick={confirmReject} disabled={!rejectReason.trim()}>Odrzuć</Button>
          </div>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal open={!!deleteTarget} onClose={() => { setDeleteTarget(null); setDeleteReason(''); }} title="Trwałe usunięcie konta" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {deleteTarget && <Avatar name={deleteTarget.displayName} src={deleteTarget.avatarUrl} size="sm" />}
            <div>
              <p className="text-sm font-medium text-graphite-600">{deleteTarget?.displayName}</p>
              <p className="text-xs text-graphite-400">{deleteTarget?.email}</p>
            </div>
          </div>
          <div className="rounded-lg border border-error/30 bg-error/10 p-3 text-xs text-error-light">
            <strong>Ostrzeżenie:</strong> Ta operacja jest nieodwracalna. Wszystkie dane artysty zostaną trwale usunięte — profil, portfolio, zlecenia, oferty, wiadomości i konto logowania.
          </div>
          <div>
            <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Powód usunięcia</label>
            <Textarea rows={3} placeholder="np. Naruszenie regulaminu, prośba artysty..." value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => { setDeleteTarget(null); setDeleteReason(''); }} disabled={deleting}>Anuluj</Button>
            <Button variant="primary" className="flex-1 !bg-error hover:!bg-error-dark" onClick={confirmDelete} disabled={deleting}>{deleting ? 'Usuwanie...' : 'Usuń trwale'}</Button>
          </div>
        </div>
      </Modal>

      {/* Portfolio preview modal */}
      <Modal open={!!portfolioPreview} onClose={() => setPortfolioPreview(null)} title={`Portfolio - ${portfolioPreview?.displayName ?? ''}`} size="lg">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {portfolioPreview && admin.getArtistProfile(portfolioPreview.id)?.portfolio.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-graphite-400/10">
              <div className="aspect-square overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-graphite-600">{item.title}</p>
                <p className="text-xs text-graphite-400">{item.technique} · {item.year}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
