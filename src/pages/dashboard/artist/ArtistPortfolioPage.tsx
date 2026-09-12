import { useState } from 'react';
import { Plus, X, Star, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/States';
import { Badge } from '@/components/ui/Badge';
import { MultiImageUploader, type UploadedImage } from '@/components/ui/Uploader';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useArtistData } from '@/hooks/useArtistData';
import type { ArtistPortfolioItem } from '@/types';

interface EditState {
  mode: 'add' | 'edit';
  item: Partial<ArtistPortfolioItem> | null;
}

const EMPTY_ITEM: Partial<ArtistPortfolioItem> = {
  title: '', imageUrl: '', technique: '', style: '', year: String(new Date().getFullYear()),
  widthCm: 100, heightCm: 100, description: '', isPublic: true, isForSale: false, price: undefined,
};

export function ArtistPortfolioPage() {
  const { notify } = useToast();
  const { user } = useAuth();
  const { profile, addPortfolioItem, updatePortfolioItem, deletePortfolioItem, featurePortfolioItem } = useArtistData();

  const [editState, setEditState] = useState<EditState>({ mode: 'add', item: null });
  const [deleteTarget, setDeleteTarget] = useState<ArtistPortfolioItem | null>(null);
  const [uploadImages, setUploadImages] = useState<UploadedImage[]>([]);

  if (!profile) return null;

  const portfolio = profile.portfolio;

  function handleOpenAdd() {
    setUploadImages([]);
    setEditState({ mode: 'add', item: { ...EMPTY_ITEM } });
  }

  function handleOpenEdit(item: ArtistPortfolioItem) {
    setUploadImages(item.imageUrl ? [{
      id: `existing-${item.id}`,
      url: item.imageUrl,
      filename: item.title,
      mimeType: 'image/jpeg',
      sizeBytes: 0,
      path: item.imageUrl,
    }] : []);
    setEditState({ mode: 'edit', item: { ...item } });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const item = editState.item;
    const imageUrl = uploadImages[0]?.url;
    if (!item || !item.title || !imageUrl || !item.technique) {
      notify('error', 'Uzupełnij tytuł, zdjęcie i technikę.');
      return;
    }
    if (uploadImages.some(img => img.uploading)) {
      notify('error', 'Poczekaj na zakończenie uploadu zdjęć.');
      return;
    }
    if (editState.mode === 'add') {
      addPortfolioItem({
        title: item.title,
        imageUrl,
        technique: item.technique,
        style: item.style,
        year: item.year ?? String(new Date().getFullYear()),
        widthCm: item.widthCm ?? 100,
        heightCm: item.heightCm ?? 100,
        description: item.description,
        isPublic: item.isPublic ?? true,
        isForSale: item.isForSale ?? false,
        price: item.price,
      });
      notify('success', 'Praca dodana do portfolio.');
    } else if (item.id) {
      updatePortfolioItem(item.id, { ...item, imageUrl });
      notify('success', 'Praca zaktualizowana.');
    }
    setEditState({ mode: 'add', item: null });
    setUploadImages([]);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deletePortfolioItem(deleteTarget.id);
    notify('success', 'Praca usunięta z portfolio.');
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Portfolio"
        description="Zarządzaj swoimi pracami w portfolio."
        action={<Button variant="primary" onClick={handleOpenAdd}><Plus className="h-4 w-4" /> Dodaj pracę</Button>}
      />

      {portfolio.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((item) => (
            <Card key={item.id}>
              <div className="group relative aspect-[4/5] overflow-hidden rounded-t-2xl">
                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" decoding="async" />
                <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => featurePortfolioItem(item.id)}
                    title={item.isPublic ? 'Ukryj' : 'Wyróżnij'}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-graphite-700/70 text-ivory-100 hover:bg-gold-400 hover:text-graphite-700 transition-colors"
                  >
                    <Star className={`h-4 w-4 ${item.isPublic ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    title="Edytuj"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-graphite-700/70 text-ivory-100 hover:bg-gold-400 hover:text-graphite-700 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    title="Usuń"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-graphite-700/70 text-ivory-100 hover:bg-error hover:text-ivory-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {!item.isPublic && (
                  <div className="absolute left-3 top-3">
                    <Badge color="neutral">Ukryte</Badge>
                  </div>
                )}
              </div>
              <CardBody>
                <h3 className="font-display text-lg text-graphite-600">{item.title}</h3>
                {item.description && <p className="mt-1 text-sm text-graphite-400 line-clamp-2 text-pretty">{item.description}</p>}
                <p className="mt-2 text-xs text-graphite-300">{item.technique} · {item.year} · {item.widthCm}×{item.heightCm} cm</p>
                {item.style && <p className="mt-1 text-xs text-graphite-300">{item.style}</p>}
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Portfolio jest puste" description="Dodaj swoje pierwsze prace." action={<Button variant="primary" onClick={handleOpenAdd}>Dodaj pracę</Button>} />
      )}

      {/* Add/Edit modal */}
      <Modal
        open={!!editState.item}
        onClose={() => setEditState({ mode: 'add', item: null })}
        title={editState.mode === 'add' ? 'Dodaj pracę' : 'Edytuj pracę'}
        size="lg"
      >
        {editState.item && (
          <form onSubmit={handleSave} className="space-y-5">
            <Input
              label="Tytuł"
              value={editState.item.title ?? ''}
              onChange={(e) => setEditState((s) => ({ ...s, item: { ...s.item!, title: e.target.value } }))}
              required
            />
            <MultiImageUploader
              images={uploadImages}
              onChange={setUploadImages}
              bucket="artist-portfolio"
              userId={user?.id ?? ''}
              max={1}
              label="Zdjęcie pracy"
              hint="Przeciągnij zdjęcie lub kliknij, aby wybrać. Zostanie automatycznie przesłane."
            />
            <Textarea
              label="Opis"
              rows={2}
              value={editState.item.description ?? ''}
              onChange={(e) => setEditState((s) => ({ ...s, item: { ...s.item!, description: e.target.value } }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Technika"
                value={editState.item.technique ?? ''}
                onChange={(e) => setEditState((s) => ({ ...s, item: { ...s.item!, technique: e.target.value } }))}
                required
              />
              <Input
                label="Styl"
                value={editState.item.style ?? ''}
                onChange={(e) => setEditState((s) => ({ ...s, item: { ...s.item!, style: e.target.value } }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Szerokość (cm)"
                type="number"
                min={1}
                value={String(editState.item.widthCm ?? '')}
                onChange={(e) => setEditState((s) => ({ ...s, item: { ...s.item!, widthCm: parseInt(e.target.value) || 0 } }))}
              />
              <Input
                label="Wysokość (cm)"
                type="number"
                min={1}
                value={String(editState.item.heightCm ?? '')}
                onChange={(e) => setEditState((s) => ({ ...s, item: { ...s.item!, heightCm: parseInt(e.target.value) || 0 } }))}
              />
              <Input
                label="Rok"
                value={editState.item.year ?? ''}
                onChange={(e) => setEditState((s) => ({ ...s, item: { ...s.item!, year: e.target.value } }))}
              />
            </div>
            <Button type="submit" variant="primary" className="w-full">
              {editState.mode === 'add' ? 'Dodaj pracę' : 'Zapisz zmiany'}
            </Button>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Usunąć pracę?"
        description={deleteTarget ? `Praca „${deleteTarget.title}" zostanie trwale usunięta z portfolio.` : ''}
        confirmLabel="Usuń"
        danger
      />
    </div>
  );
}
