import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody } from '@/components/ui/Card';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/context/ToastContext';
import type { CommissionStatus } from '@/types';

const STATUS_OPTIONS: { value: CommissionStatus; label: string }[] = [
  { value: 'draft', label: 'Szkic' },
  { value: 'pending_review', label: 'Oczekuje na review' },
  { value: 'published', label: 'Opublikowane' },
  { value: 'offers_open', label: 'Otwarte na oferty' },
  { value: 'artist_selected', label: 'Wybrano artystę' },
  { value: 'in_progress', label: 'W realizacji' },
  { value: 'completed', label: 'Zakończone' },
  { value: 'hidden', label: 'Ukryte' },
  { value: 'rejected', label: 'Odrzucone' },
  { value: 'closed', label: 'Zamknięte' },
];

const ROOM_TYPES = ['living_room', 'bedroom', 'office', 'kitchen', 'hallway', 'child_room', 'other'];
const INTENDED_USES = ['private', 'gift', 'business', 'public'];
const ORIENTATIONS = ['portrait', 'landscape', 'square', 'custom'];

export function AdminEditCommissionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const admin = useAdmin(user?.id ?? '', user?.displayName ?? 'Admin');
  const { notify } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reason, setReason] = useState('');

  const [form, setForm] = useState({
    title: '',
    publicSummary: '',
    privateDescription: '',
    status: 'published' as CommissionStatus,
    style: '',
    mood: '',
    medium: '',
    roomType: 'living_room',
    intendedUse: 'private',
    orientation: 'landscape',
    widthCm: 0,
    heightCm: 0,
    budgetMin: 0,
    budgetMax: 0,
    deadline: '',
    location: '',
    frameRequired: false,
    deliveryRequired: false,
    preferredColors: '',
    colorsToAvoid: '',
    tags: '',
  });

  useEffect(() => {
    if (!id) return;
    const c = admin.getCommission(id);
    if (!c) {
      notify('error', 'Zlecenie nie zostało znalezione.');
      navigate('/admin/commissions');
      return;
    }
    setForm({
      title: c.title,
      publicSummary: c.publicSummary,
      privateDescription: c.privateDescription,
      status: c.status,
      style: c.style,
      mood: c.mood,
      medium: c.medium ?? '',
      roomType: c.roomType,
      intendedUse: c.intendedUse,
      orientation: c.orientation,
      widthCm: c.widthCm,
      heightCm: c.heightCm,
      budgetMin: c.budgetMin,
      budgetMax: c.budgetMax,
      deadline: c.deadline,
      location: c.location ?? '',
      frameRequired: c.frameRequired,
      deliveryRequired: c.deliveryRequired,
      preferredColors: (c.preferredColors ?? []).join(', '),
      colorsToAvoid: (c.colorsToAvoid ?? []).join(', '),
      tags: (c.tags ?? []).join(', '),
    });
    setLoading(false);
  }, [id]);

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!id) return;
    if (!form.title.trim()) {
      notify('error', 'Tytuł jest wymagany.');
      return;
    }
    setSaving(true);
    try {
      admin.updateCommissionFull(id, {
        title: form.title.trim(),
        publicSummary: form.publicSummary.trim(),
        privateDescription: form.privateDescription.trim(),
        status: form.status,
        style: form.style,
        mood: form.mood,
        medium: form.medium,
        roomType: form.roomType as typeof form.roomType,
        intendedUse: form.intendedUse as typeof form.intendedUse,
        orientation: form.orientation as typeof form.orientation,
        widthCm: Number(form.widthCm) || 0,
        heightCm: Number(form.heightCm) || 0,
        budgetMin: Number(form.budgetMin) || 0,
        budgetMax: Number(form.budgetMax) || 0,
        deadline: form.deadline,
        location: form.location.trim(),
        frameRequired: form.frameRequired,
        deliveryRequired: form.deliveryRequired,
        preferredColors: form.preferredColors.split(',').map((s) => s.trim()).filter(Boolean),
        colorsToAvoid: form.colorsToAvoid.split(',').map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      }, reason.trim() || 'Edycja zlecenia przez admina');
      notify('success', 'Zlecenie zostało zaktualizowane.');
      navigate('/admin/commissions');
    } catch {
      notify('error', 'Nie udało się zapisać zmian.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-graphite-300 border-t-gold-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/admin/commissions">
          <Button variant="secondary" size="sm"><ArrowLeft className="h-4 w-4" /> Wróć do zleceń</Button>
        </Link>
        <a
          href={`/zlecenia/${admin.getCommission(id ?? '')?.slug ?? ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-graphite-500/30 px-4 py-2 text-sm text-graphite-200 transition-colors hover:bg-graphite-500/50"
        >
          <Eye className="h-4 w-4" /> Otwórz publicznie
        </a>
      </div>

      <PageHeader title="Edycja zlecenia" description={form.title} />

      <div className="flex items-center gap-3">
        <StatusBadge status={form.status} type="commission" />
        <span className="text-xs text-graphite-300">ID: {id}</span>
      </div>

      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="space-y-5">
          <h3 className="font-display text-lg text-ivory-100">Podstawowe informacje</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Tytuł</label>
              <Input value={form.title} onChange={(e) => update('title', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Publiczne podsumowanie</label>
              <Textarea rows={3} value={form.publicSummary} onChange={(e) => update('publicSummary', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Prywatny opis</label>
              <Textarea rows={4} value={form.privateDescription} onChange={(e) => update('privateDescription', e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Status</label>
              <Select value={form.status} onChange={(e) => update('status', e.target.value as CommissionStatus)}>
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Styl</label>
              <Input value={form.style} onChange={(e) => update('style', e.target.value)} />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="space-y-5">
          <h3 className="font-display text-lg text-ivory-100">Szczegóły</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Typ wnętrza</label>
              <Select value={form.roomType} onChange={(e) => update('roomType', e.target.value)}>
                {ROOM_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Przeznaczenie</label>
              <Select value={form.intendedUse} onChange={(e) => update('intendedUse', e.target.value)}>
                {INTENDED_USES.map((u) => <option key={u} value={u}>{u}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Orientacja</label>
              <Select value={form.orientation} onChange={(e) => update('orientation', e.target.value)}>
                {ORIENTATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Nastrój</label>
              <Input value={form.mood} onChange={(e) => update('mood', e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Technika</label>
              <Input value={form.medium} onChange={(e) => update('medium', e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Lokalizacja</label>
              <Input value={form.location} onChange={(e) => update('location', e.target.value)} />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="space-y-5">
          <h3 className="font-display text-lg text-ivory-100">Wymiary i budżet</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Szerokość (cm)</label>
              <Input type="number" value={String(form.widthCm)} onChange={(e) => update('widthCm', Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Wysokość (cm)</label>
              <Input type="number" value={String(form.heightCm)} onChange={(e) => update('heightCm', Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Budżet od (zł)</label>
              <Input type="number" value={String(form.budgetMin)} onChange={(e) => update('budgetMin', Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Budżet do (zł)</label>
              <Input type="number" value={String(form.budgetMax)} onChange={(e) => update('budgetMax', Number(e.target.value))} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Termin realizacji</label>
              <Input type="date" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="space-y-5">
          <h3 className="font-display text-lg text-ivory-100">Kolory i tagi</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Preferowane kolory (po przecinku)</label>
              <Input value={form.preferredColors} onChange={(e) => update('preferredColors', e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Kolory do unikania (po przecinku)</label>
              <Input value={form.colorsToAvoid} onChange={(e) => update('colorsToAvoid', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-mono uppercase text-graphite-300">Tagi (po przecinku)</label>
              <Input value={form.tags} onChange={(e) => update('tags', e.target.value)} />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="space-y-5">
          <h3 className="font-display text-lg text-ivory-100">Opcje dodatkowe</h3>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.frameRequired} onChange={(e) => update('frameRequired', e.target.checked)} className="h-4 w-4 accent-gold-400" />
              <span className="text-sm text-ivory-100">Wymaga ramy</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.deliveryRequired} onChange={(e) => update('deliveryRequired', e.target.checked)} className="h-4 w-4 accent-gold-400" />
              <span className="text-sm text-ivory-100">Wymaga dostawy</span>
            </label>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-graphite-600 border-graphite-500/30">
        <CardBody className="space-y-4">
          <h3 className="font-display text-lg text-ivory-100">Powód zmiany</h3>
          <Input placeholder="np. Korekta treści, zmiana statusu przez admina..." value={reason} onChange={(e) => setReason(e.target.value)} />
          <p className="text-xs text-graphite-300">Zostanie zapisany w dzienniku audytu.</p>
        </CardBody>
      </Card>

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={() => navigate('/admin/commissions')}>Anuluj</Button>
        <Button variant="gold" className="flex-1" onClick={handleSave} disabled={saving}>
          {saving ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-graphite-700 border-t-transparent" /> Zapisywanie...</> : <><Save className="h-4 w-4" /> Zapisz zmiany</>}
        </Button>
      </div>
    </div>
  );
}
