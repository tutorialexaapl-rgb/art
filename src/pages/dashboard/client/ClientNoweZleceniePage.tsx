import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Check, Save, Send, Loader2, AlertCircle,
  ImageIcon, Palette, Ruler, Home, Wallet, FileText, ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/Dashboard';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Stepper, type Step } from '@/components/ui/Stepper';
import {
  MultiImageUploader,
  type UploadedImage,
  getValidImageUrls,
  validateImagesForSubmit,
} from '@/components/ui/Uploader';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useClientData } from '@/hooks/useClientData';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { CommissionStatus } from '@/types';
import { recordConsents } from '@/lib/consent';

interface FormData {
  title: string;
  publicSummary: string;
  privateDescription: string;
  whatToOrder: string;
  whereHanging: string;
  roomType: string;
  intendedUse: string;
  style: string;
  character: string;
  mood: string;
  avoidWhat: string;
  widthCm: string;
  heightCm: string;
  orientation: string;
  unknownDimensions: boolean;
  preferredColors: string;
  avoidedColors: string;
  interiorColors: string;
  colorDescription: string;
  inspirationImages: UploadedImage[];
  interiorImages: UploadedImage[];
  inspirationDescription: string;
  budgetMin: string;
  budgetMax: string;
  deadline: string;
  needsFrame: boolean;
  needsShipping: boolean;
  location: string;
  consentPublic: boolean;
  consentTerms: boolean;
  consentRights: boolean;
  consentArtistVisibility: boolean;
  consentContactPrivate: boolean;
}

const INITIAL_DATA: FormData = {
  title: '', publicSummary: '', privateDescription: '',
  whatToOrder: '', whereHanging: '', roomType: '', intendedUse: '',
  style: '', character: '', mood: '', avoidWhat: '',
  widthCm: '', heightCm: '', orientation: '', unknownDimensions: false,
  preferredColors: '', avoidedColors: '', interiorColors: '', colorDescription: '',
  inspirationImages: [], interiorImages: [], inspirationDescription: '',
  budgetMin: '', budgetMax: '', deadline: '', needsFrame: false, needsShipping: false, location: '',
  consentPublic: false, consentTerms: false, consentRights: false,
  consentArtistVisibility: false, consentContactPrivate: false,
};

const STEP_ICONS = [
  <FileText key="0" className="h-4 w-4" />,
  <Palette key="1" className="h-4 w-4" />,
  <Ruler key="2" className="h-4 w-4" />,
  <Palette key="3" className="h-4 w-4" />,
  <ImageIcon key="4" className="h-4 w-4" />,
  <Wallet key="5" className="h-4 w-4" />,
  <ShieldCheck key="6" className="h-4 w-4" />,
];

const ROOM_TYPES = [
  { value: '', label: 'Wybierz typ wnętrza' },
  { value: 'living_room', label: 'Salon' },
  { value: 'bedroom', label: 'Sypialnia' },
  { value: 'office', label: 'Gabinet / Biuro' },
  { value: 'hallway', label: 'Korytarz / Hol' },
  { value: 'staircase', label: 'Klatka schodowa' },
  { value: 'restaurant', label: 'Restauracja / Kawiarnia' },
  { value: 'hotel_lobby', label: 'Hotel / Recepcja' },
  { value: 'conference', label: 'Sala konferencyjna' },
  { value: 'children_room', label: 'Pokój dziecka' },
  { value: 'other', label: 'Inne' },
];

const INTENDED_USES = [
  { value: 'home', label: 'Dom / Mieszkanie', description: 'Obraz do prywatnego wnętrza.' },
  { value: 'office', label: 'Biuro', description: 'Przestrzeń pracy lub gabinet.' },
  { value: 'hotel', label: 'Hotel / Pensjonat', description: 'Wnętrza hotelowe, recepcja, pokoje.' },
  { value: 'gift', label: 'Prezent', description: 'Obraz na prezent dla bliskiej osoby.' },
  { value: 'investment', label: 'Inwestycja', description: 'Dla inwestora lub dewelopera.' },
  { value: 'architect', label: 'Projekt architekta', description: 'Jako część projektu wnętrzarskiego.' },
  { value: 'other', label: 'Inne', description: 'Coś innego - opisz w polu poniżej.' },
];

const STYLES = [
  { value: '', label: 'Wybierz styl' },
  { value: 'Abstrakcja', label: 'Abstrakcja' },
  { value: 'Pejzaż', label: 'Pejzaż' },
  { value: 'Minimalizm', label: 'Minimalizm' },
  { value: 'Strukturalny', label: 'Strukturalny / Faktura' },
  { value: 'Portret', label: 'Portret' },
  { value: 'Nowoczesny', label: 'Nowoczesny' },
  { value: 'Klasyczny', label: 'Klasyczny' },
  { value: 'Inne', label: 'Inne' },
];

const CHARACTERS = [
  { value: 'spokojny', label: 'Spokojny', description: 'Wyciszający, harmonijny, relaksujący.' },
  { value: 'elegancki', label: 'Elegancki', description: 'Wyrafinowany, subtelny, szlachetny.' },
  { value: 'dynamiczny', label: 'Dynamiczny', description: 'Pełen ruchu, energii, kontrastów.' },
  { value: 'luksusowy', label: 'Luksusowy', description: 'Bogaty, prestiżowy, z nutą złota.' },
  { value: 'ciepły', label: 'Ciepły', description: 'Przytulny, ziemisty, ocieplający wnętrze.' },
  { value: 'chłodny', label: 'Chłodny', description: 'Stonowany, niebiesko-szary, nowoczesny.' },
  { value: 'organiczny', label: 'Organiczny', description: 'Naturalny, z motywami natury.' },
  { value: 'geometryczny', label: 'Geometryczny', description: 'Ostry, precyzyjny, z wyraźnymi formami.' },
];

const ORIENTATIONS = [
  { value: 'vertical', label: 'Pion', description: 'Wysoki format - np. nad komodą.' },
  { value: 'horizontal', label: 'Poziom', description: 'Szeroki format - np. nad sofą.' },
  { value: 'square', label: 'Kwadrat', description: 'Równe proporcje.' },
];

export function ClientNoweZleceniePage() {
  const { notify } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createCommission, getCommission, updateCommission, loading: dataLoading } = useClientData();
  const { id: editId } = useParams();
  const isEditMode = Boolean(editId);

  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(isEditMode);
  const [originalStatus, setOriginalStatus] = useState<CommissionStatus>('draft');

  useEffect(() => {
    if (!editId) return;
    if (dataLoading) return;
    const commission = getCommission(editId);
    if (!commission) {
      setLoadingEdit(false);
      notify('error', 'Zlecenie nie zostało znalezione.');
      navigate('/dashboard/client/zlecenia');
      return;
    }
    if (commission.offersCount > 0) {
      setLoadingEdit(false);
      notify('error', 'Nie można edytować zlecenia, na które już wpłynęły oferty.');
      navigate(`/dashboard/client/zlecenia/${commission.id}`);
      return;
    }
    setOriginalStatus(commission.status);
    const orientationReverseMap: Record<string, string> = {
      portrait: 'vertical',
      landscape: 'horizontal',
      square: 'square',
      custom: '',
    };
    const [characterPart, ...moodParts] = (commission.mood || '').split(';');
    setData({
      ...INITIAL_DATA,
      title: commission.title,
      publicSummary: commission.publicSummary,
      privateDescription: commission.privateDescription,
      whatToOrder: commission.privateDescription,
      roomType: commission.roomType,
      intendedUse: commission.intendedUse,
      style: commission.style,
      mood: moodParts.join(';').trim() || commission.mood,
      character: characterPart.trim(),
      widthCm: commission.widthCm ? String(commission.widthCm) : '',
      heightCm: commission.heightCm ? String(commission.heightCm) : '',
      unknownDimensions: commission.widthCm === 0 && commission.heightCm === 0,
      orientation: orientationReverseMap[commission.orientation] ?? '',
      preferredColors: (commission.preferredColors || []).join(', '),
      avoidedColors: (commission.colorsToAvoid || []).join(', '),
      budgetMin: String(commission.budgetMin),
      budgetMax: String(commission.budgetMax),
      deadline: commission.deadline,
      needsFrame: commission.frameRequired,
      needsShipping: commission.deliveryRequired,
      location: commission.location ?? '',
      inspirationImages: (commission.inspirationImages || []).map((url, i) => {
        const pathMatch = url.match(/\/commission-inspirations\/(.+)$/);
        return { id: `existing-insp-${i}`, url, path: pathMatch ? pathMatch[1] : undefined };
      }),
      interiorImages: (commission.interiorImages || []).map((url, i) => {
        const pathMatch = url.match(/\/commission-inspirations\/(.+)$/);
        return { id: `existing-int-${i}`, url, path: pathMatch ? pathMatch[1] : undefined };
      }),
      consentPublic: true,
      consentTerms: true,
      consentRights: true,
      consentArtistVisibility: true,
      consentContactPrivate: true,
    });
    setLoadingEdit(false);
  }, [editId, getCommission, navigate, notify, dataLoading]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const c = { ...prev }; delete c[key]; return c; });
  }

  const steps: Step[] = useMemo(() =>
    ['Podstawy', 'Styl i charakter', 'Wymiary', 'Kolorystyka', 'Inspiracje', 'Budżet i termin', 'Podgląd i zgody'].map((label, i) => ({
      id: `step-${i}`, label,
      status: i < step ? 'done' : i === step ? 'active' : 'pending',
    })), [step]);

  const goToStep = (i: number) => {
    if (i === step) return;
    setStep(i);
    setErrors({});
  };

  function validateStep(s: number): boolean {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!data.title.trim()) e.title = 'Podaj tytuł zlecenia.';
      if (!data.publicSummary.trim()) e.publicSummary = 'Napisz krótki opis - to pierwsza rzecz, którą zobaczą artyści.';
      if (!data.whatToOrder.trim()) e.whatToOrder = 'Opisz, co chcesz zamówić.';
      if (!data.roomType) e.roomType = 'Wybierz typ wnętrza.';
      if (!data.intendedUse) e.intendedUse = 'Wybierz przeznaczenie.';
    }
    if (s === 1) {
      if (!data.style) e.style = 'Wybierz styl obrazu.';
      if (!data.character) e.character = 'Wybierz charakter dzieła.';
      if (!data.mood.trim()) e.mood = 'Opisz klimat, jakiego oczekujesz.';
    }
    if (s === 2) {
      if (!data.unknownDimensions) {
        if (!data.widthCm || parseInt(data.widthCm) < 1) e.widthCm = 'Podaj szerokość w centymetrach.';
        if (!data.heightCm || parseInt(data.heightCm) < 1) e.heightCm = 'Podaj wysokość w centymetrach.';
      }
      if (!data.orientation && !data.unknownDimensions) e.orientation = 'Wybierz orientację.';
    }
    if (s === 5) {
      if (!data.budgetMin || parseInt(data.budgetMin) < 1) e.budgetMin = 'Podaj dolny zakres budżetu.';
      if (data.budgetMax && parseInt(data.budgetMax) < 1) e.budgetMax = 'Górny budżet musi być dodatni.';
      if (data.budgetMin && data.budgetMax && parseInt(data.budgetMin) > parseInt(data.budgetMax)) e.budgetMax = 'Cena do musi być równa lub większa niż cena od.';
      if (!data.deadline) e.deadline = 'Wybierz oczekiwany termin realizacji.';
    }
    if (s === 6) {
      if (!data.consentPublic) e.consentPublic = 'Zgoda na publikację publicznego skrótu jest wymagana.';
      if (!data.consentTerms) e.consentTerms = 'Akceptacja regulaminu jest wymagana.';
      if (!data.consentRights) e.consentRights = 'Musisz potwierdzić prawa do zdjęć.';
      if (!data.consentArtistVisibility) e.consentArtistVisibility = 'Musisz potwierdzić, że rozumiesz widoczność pełnego opisu dla artystów.';
      if (!data.consentContactPrivate) e.consentContactPrivate = 'Musisz potwierdzić, że rozumiesz, że dane kontaktowe nie są publiczne.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const imagesUploading = [...data.inspirationImages, ...data.interiorImages].some((img) => img.uploading);

  function next() {
    if (!validateStep(step)) {
      notify('error', 'Uzupełnij wymagane pola.');
      return;
    }
    setStep((s) => Math.min(s + 1, 6));
  }
  function back() { setStep((s) => Math.max(s - 1, 0)); }

  function buildPayload(status: CommissionStatus) {
    const orientationMap: Record<string, string> = {
      vertical: 'portrait',
      horizontal: 'landscape',
      square: 'square',
    };
    const inspirationImages = getValidImageUrls(data.inspirationImages);
    const interiorImages = getValidImageUrls(data.interiorImages);
    return {
      title: data.title.trim(),
      publicSummary: data.publicSummary.trim(),
      privateDescription: data.privateDescription.trim() || data.whatToOrder.trim(),
      roomType: data.roomType,
      intendedUse: data.intendedUse,
      style: data.style,
      mood: `${data.character}; ${data.mood}`.trim(),
      orientation: data.unknownDimensions ? 'custom' : (orientationMap[data.orientation] ?? 'custom'),
      widthCm: data.unknownDimensions ? 0 : parseInt(data.widthCm) || 0,
      heightCm: data.unknownDimensions ? 0 : parseInt(data.heightCm) || 0,
      preferredColors: data.preferredColors.split(',').map((s) => s.trim()).filter(Boolean),
      avoidedColors: data.avoidedColors.split(',').map((s) => s.trim()).filter(Boolean),
      budgetMin: parseInt(data.budgetMin) || 0,
      budgetMax: parseInt(data.budgetMax) || 0,
      deadline: data.deadline,
      frameRequired: data.needsFrame,
      deliveryRequired: data.needsShipping,
      location: data.location.trim(),
      inspirationImages,
      interiorImages,
      tags: [],
      medium: '',
      status,
    };
  }

  async function handleSaveDraft() {
    if (!data.title.trim()) {
      notify('error', 'Podaj przynajmniej tytuł, aby zapisać szkic.');
      return;
    }
    if (!user) {
      notify('error', 'Nie jesteś zalogowany. Zaloguj się, aby zapisać zlecenie.');
      return;
    }
    const imageError = validateImagesForSubmit([...data.inspirationImages, ...data.interiorImages]);
    if (imageError) {
      notify('error', imageError);
      return;
    }
    setSubmitting(true);
    try {
      if (isEditMode && editId) {
        await updateCommission(editId, buildPayload(originalStatus));
        notify('success', 'Zmiany zostały zapisane.');
        navigate(`/dashboard/client/zlecenia/${editId}`);
      } else {
        const commission = await createCommission(buildPayload('draft'));
        notify('success', 'Szkic zapisany.');
        navigate(`/dashboard/client/zlecenia/${commission.id}`);
      }
    } catch (err) {
      console.error('handleSaveDraft error:', err);
      notify('error', 'Nie udało się zapisać zlecenia. Sprawdź połączenie lub uprawnienia i spróbuj ponownie.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(6)) { notify('error', 'Wymagane zgody nie zostały zaznaczone.'); return; }
    if (!user) {
      notify('error', 'Nie jesteś zalogowany. Zaloguj się, aby opublikować zlecenie.');
      return;
    }
    const imageError = validateImagesForSubmit([...data.inspirationImages, ...data.interiorImages]);
    if (imageError) {
      notify('error', imageError);
      return;
    }
    setSubmitting(true);
    try {
      if (isEditMode && editId) {
        await updateCommission(editId, buildPayload('offers_open'));
        notify('success', 'Zlecenie zaktualizowane i opublikowane! Jest teraz widoczne dla artystów.');
        navigate(`/dashboard/client/zlecenia/${editId}`);
      } else {
        const commission = await createCommission(buildPayload('offers_open'));
        recordConsents(['commission_publication', 'commission_artist_visibility', 'commission_contact_private', 'image_rights'], { commission_id: commission.id }).catch((err) => {
          console.error('recordConsents error (non-critical):', err);
        });
        notify('success', 'Zlecenie opublikowane! Jest teraz widoczne dla artystów, którzy mogą składać oferty.');
        navigate(`/dashboard/client/zlecenia/${commission.id}`);
      }
    } catch (err) {
      console.error('handlePublish error:', err);
      notify('error', 'Nie udało się opublikować zlecenia. Sprawdź połączenie lub uprawnienia i spróbuj ponownie.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl space-y-4 lg:[zoom:0.82] xl:[zoom:0.9] 2xl:[zoom:0.96]">
      <PageHeader
        title={isEditMode ? 'Edytuj zlecenie' : 'Nowe zlecenie'}
        description={isEditMode ? 'Zmień szczegóły swojego zlecenia. Możesz to robić dopóki nie wpłyną żadne oferty.' : 'Opisz krok po kroku, jakiego obrazu szukasz. Nie musisz znać się na sztuce - poprowadzimy Cię przez wszystkie kroki.'}
      />

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Stepper sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <Stepper steps={steps} onStepClick={isEditMode ? goToStep : undefined} />
          </div>
        </aside>

        {/* Mobile step indicator */}
        <div className="lg:hidden">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => (isEditMode ? goToStep(i) : i < step ? setStep(i) : undefined)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  s.status === 'active' ? 'bg-graphite-600 text-ivory-100'
                  : s.status === 'done' ? 'bg-gold-100 text-gold-600'
                  : 'bg-ivory-200 text-graphite-300'
                }`}
              >
                {s.status === 'done' ? <Check className="h-3 w-3" /> : i + 1}
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handlePublish} className="space-y-6">
          {loadingEdit && (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-graphite-300 border-t-graphite-600" />
            </div>
          )}
          {/* Step 1: Podstawy */}
          {step === 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-gold-600">{STEP_ICONS[0]}</div>
                  <div>
                    <h2 className="font-display text-lg text-graphite-600">Podstawy</h2>
                    <p className="text-sm text-graphite-300">Powiedz nam, co i gdzie ma wisieć.</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-5">
                <Input
                  label="Tytuł zlecenia"
                  placeholder="np. Obraz abstrakcyjny do salonu nad sofę"
                  hint="Krótki, opisowy tytuł - pomoże artystom szybko zrozumieć, o co chodzi."
                  value={data.title}
                  onChange={(e) => update('title', e.target.value)}
                  error={errors.title}
                  required
                />
                <Textarea
                  label="Co chcesz zamówić?"
                  placeholder="np. Duży obraz abstrakcyjny w neutralnych tonacjach, który stanie się centralnym punktem salonu..."
                  hint="Opisz swoim językiem, jakiego obrazu szukasz. Nie musisz używać fachowych pojęć."
                  rows={4}
                  value={data.whatToOrder}
                  onChange={(e) => update('whatToOrder', e.target.value)}
                  error={errors.whatToOrder}
                  required
                />
                <Textarea
                  label="Krótki opis (publiczny skrót)"
                  placeholder="np. Abstrakcja do salonu, beżowo-złota, 180×120 cm"
                  hint="To zdanie zobaczą wszyscy odwiedzający stronę zleceń - nawet bez logowania."
                  rows={2}
                  value={data.publicSummary}
                  onChange={(e) => update('publicSummary', e.target.value)}
                  error={errors.publicSummary}
                  required
                />
                <Input
                  label="Gdzie obraz będzie wisiał?"
                  placeholder="np. Nad sofą w salonie, na głównej ścianie"
                  hint="Pomóż artystom wyobrazić sobie przestrzeń."
                  value={data.whereHanging}
                  onChange={(e) => update('whereHanging', e.target.value)}
                />
                <Select
                  label="Typ wnętrza"
                  value={data.roomType}
                  onChange={(e) => update('roomType', e.target.value)}
                  error={errors.roomType}
                  required
                >
                  {ROOM_TYPES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </Select>
                <Select
                  label="Przeznaczenie"
                  value={data.intendedUse}
                  onChange={(e) => update('intendedUse', e.target.value)}
                  error={errors.intendedUse}
                  required
                >
                  <option value="">Wybierz przeznaczenie</option>
                  {INTENDED_USES.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
                {errors.intendedUse && <p className="text-xs text-error">{errors.intendedUse}</p>}
              </CardBody>
            </Card>
          )}

          {/* Step 2: Styl i charakter */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-gold-600">{STEP_ICONS[1]}</div>
                  <div>
                    <h2 className="font-display text-lg text-graphite-600">Styl i charakter</h2>
                    <p className="text-sm text-graphite-300">Jaki klimat ma mieć obraz?</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-5">
                <Select
                  label="Styl obrazu"
                  value={data.style}
                  onChange={(e) => update('style', e.target.value)}
                  error={errors.style}
                  hint="Nie jesteś pewien? Wybierz to, co najbardziej Ci się podoba - artyści pomogą doprecyzować."
                  required
                >
                  {STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </Select>
                <Select
                  label="Charakter dzieła"
                  value={data.character}
                  onChange={(e) => update('character', e.target.value)}
                  error={errors.character}
                  required
                >
                  <option value="">Wybierz charakter dzieła</option>
                  {CHARACTERS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
                {errors.character && <p className="text-xs text-error">{errors.character}</p>}
                <Textarea
                  label="Klimat / Nastrój"
                  placeholder="np. Chcę, żeby obraz wprowadzał spokój i harmonię, żeby pasował do drewnianych mebli..."
                  hint="Opisz własnymi słowami, jakie emocje lub atmosferę ma budzić obraz."
                  rows={3}
                  value={data.mood}
                  onChange={(e) => update('mood', e.target.value)}
                  error={errors.mood}
                  required
                />
                <Textarea
                  label="Czego unikać?"
                  placeholder="np. Nie chcę ostrych kontrastów, czerwieni ani postaci ludzkich"
                  hint="Jeśli masz jakieś „nie” - zapisz je tutaj. To równie ważne jak to, czego chcesz."
                  rows={2}
                  value={data.avoidWhat}
                  onChange={(e) => update('avoidWhat', e.target.value)}
                />
              </CardBody>
            </Card>
          )}

          {/* Step 3: Wymiary */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-gold-600">{STEP_ICONS[2]}</div>
                  <div>
                    <h2 className="font-display text-lg text-graphite-600">Wymiary</h2>
                    <p className="text-sm text-graphite-300">Jak duży ma być obraz?</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-5">
                <Select
                  label="Czy znasz wymiary obrazu?"
                  value={data.unknownDimensions ? 'yes' : 'no'}
                  onChange={(e) => update('unknownDimensions', e.target.value === 'yes')}
                >
                  <option value="no">Znam wymiary - wpiszę je poniżej</option>
                  <option value="yes">Nie znam wymiarów - potrzebuję sugestii artysty</option>
                </Select>
                {!data.unknownDimensions && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Szerokość (cm)"
                        type="number"
                        min={1}
                        placeholder="np. 180"
                        hint="Zmierz dostępną przestrzeń na ścianie."
                        value={data.widthCm}
                        onChange={(e) => update('widthCm', e.target.value)}
                        error={errors.widthCm}
                        required
                      />
                      <Input
                        label="Wysokość (cm)"
                        type="number"
                        min={1}
                        placeholder="np. 120"
                        value={data.heightCm}
                        onChange={(e) => update('heightCm', e.target.value)}
                        error={errors.heightCm}
                        required
                      />
                    </div>
                    <Select
                      label="Orientacja"
                      value={data.orientation}
                      onChange={(e) => update('orientation', e.target.value)}
                      error={errors.orientation}
                      required
                    >
                      <option value="">Wybierz orientację</option>
                      {ORIENTATIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </Select>
                    {errors.orientation && <p className="text-xs text-error">{errors.orientation}</p>}
                  </>
                )}
                {data.unknownDimensions && (
                  <div className="flex items-start gap-3 rounded-xl bg-gold-50 p-4">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                    <p className="text-sm text-graphite-400 text-pretty">
                      Artyści mogą zasugerować odpowiednie wymiary na podstawie zdjęcia Twojego wnętrza i opisu. Dodaj zdjęcie wnętrza w kroku „Inspiracje”.
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* Step 4: Kolorystyka */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-gold-600">{STEP_ICONS[3]}</div>
                  <div>
                    <h2 className="font-display text-lg text-graphite-600">Kolorystyka</h2>
                    <p className="text-sm text-graphite-300">Jakie kolory pasują do wnętrza?</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-5">
                <Input
                  label="Preferowane kolory"
                  placeholder="np. beżowy, złoty, grafitowy, szałwiowa zieleń"
                  hint="Wypisz kolory, które chcesz widzieć na obrazie. Oddziel je przecinkami."
                  value={data.preferredColors}
                  onChange={(e) => update('preferredColors', e.target.value)}
                />
                <Input
                  label="Kolory do unikania"
                  placeholder="np. czerwony, pomarańczowy"
                  value={data.avoidedColors}
                  onChange={(e) => update('avoidedColors', e.target.value)}
                />
                <Input
                  label="Dominujące kolory wnętrza"
                  placeholder="np. jasny dąb, biały, grafitowy, marmur"
                  hint="Pomóż artystom dobrać paletę do istniejącego wnętrza."
                  value={data.interiorColors}
                  onChange={(e) => update('interiorColors', e.target.value)}
                />
                <Textarea
                  label="Dodatkowy opis kolorystyki"
                  placeholder="np. Chcę ciepłe tonacje, ale nie za ciemne - wnętrze jest jasne i chcę zachować przestrzenność"
                  rows={3}
                  value={data.colorDescription}
                  onChange={(e) => update('colorDescription', e.target.value)}
                />
              </CardBody>
            </Card>
          )}

          {/* Step 5: Inspiracje */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-gold-600">{STEP_ICONS[4]}</div>
                  <div>
                    <h2 className="font-display text-lg text-graphite-600">Inspiracje</h2>
                    <p className="text-sm text-graphite-300">Pokaż, co Ci się podoba.</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                <MultiImageUploader
                  label="Główne i dodatkowe zdjęcia inspiracyjne"
                  images={data.inspirationImages}
                  onChange={(imgs) => update('inspirationImages', imgs)}
                  bucket="commission-inspirations"
                  userId={user?.id ?? ''}
                  max={10}
                  hint="Dodaj zdjęcia obrazów, fragmentów, palet barw - czegokolwiek, co Ci inspiruje. Zalecane przynajmniej jedno zdjęcie."
                />
                <div className="border-t border-graphite-400/10 pt-6">
                  <MultiImageUploader
                    label="Zdjęcie wnętrza (gdzie obraz będzie wisiał)"
                    images={data.interiorImages}
                    onChange={(imgs) => update('interiorImages', imgs)}
                    bucket="commission-inspirations"
                    userId={user?.id ?? ''}
                    max={5}
                    hint="Zdjęcie ściany lub całego pomieszczenia pomoże artystom dobrać rozmiar i kompozycję."
                  />
                </div>
                <Textarea
                  label="Opis inspiracji"
                  placeholder="np. Podobają mi się obrazy z serii X artysty Y, ale w innych kolorach. Drugie zdjęcie to paleta, którą znalazłam na Pinterest..."
                  rows={3}
                  value={data.inspirationDescription}
                  onChange={(e) => update('inspirationDescription', e.target.value)}
                />
              </CardBody>
            </Card>
          )}

          {/* Step 6: Budżet i termin */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-gold-600">{STEP_ICONS[5]}</div>
                  <div>
                    <h2 className="font-display text-lg text-graphite-600">Budżet i termin</h2>
                    <p className="text-sm text-graphite-300">Ile chcesz wydać i kiedy potrzebujesz obrazu?</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Budżet od (PLN)"
                    type="number"
                    min={0}
                    placeholder="np. 3000"
                    value={data.budgetMin}
                    onChange={(e) => update('budgetMin', e.target.value)}
                    error={errors.budgetMin}
                    required
                  />
                  <Input
                    label="Budżet do (PLN)"
                    type="number"
                    min={0}
                    placeholder="np. 8000"
                    value={data.budgetMax}
                    onChange={(e) => update('budgetMax', e.target.value)}
                    error={errors.budgetMax}
                    hint="Opcjonalnie - musi być równy lub większy niż cena od."
                  />
                </div>
                <Input
                  label="Oczekiwany termin realizacji"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={data.deadline}
                  onChange={(e) => update('deadline', e.target.value)}
                  error={errors.deadline}
                  hint="Data, do której chciałbyś otrzymać gotowy obraz."
                  required
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="Oprawa / rama"
                    hint="Obraz ma być gotowy do powieszenia."
                    value={data.needsFrame ? 'yes' : 'no'}
                    onChange={(e) => update('needsFrame', e.target.value === 'yes')}
                  >
                    <option value="no">Nie potrzebuję oprawy</option>
                    <option value="yes">Potrzebuję oprawy / ramy</option>
                  </Select>
                  <Select
                    label="Dostawa"
                    hint="Artyści spoza Twojej okolicy mogą uwzględnić wysyłkę w ofercie."
                    value={data.needsShipping ? 'yes' : 'no'}
                    onChange={(e) => update('needsShipping', e.target.value === 'yes')}
                  >
                    <option value="no">Odbiorę osobiście</option>
                    <option value="yes">Potrzebuję dostawy</option>
                  </Select>
                </div>
                <Input
                  label="Lokalizacja"
                  placeholder="np. Warszawa"
                  hint="Miasto lub region - pomoże w ustaleniu dostawy."
                  value={data.location}
                  onChange={(e) => update('location', e.target.value)}
                />
              </CardBody>
            </Card>
          )}

          {/* Step 7: Podgląd i zgody */}
          {step === 6 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-gold-600">{STEP_ICONS[6]}</div>
                    <div>
                      <h2 className="font-display text-lg text-graphite-600">Podgląd i zgody</h2>
                      <p className="text-sm text-graphite-300">Sprawdź, jak zobaczą Twoje zlecenie inni.</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="space-y-6">
                  {/* Public preview */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-graphite-500">
                      <Home className="h-4 w-4 text-graphite-300" /> Publiczny podgląd (widoczne dla wszystkich)
                    </h3>
                    <div className="rounded-2xl border border-graphite-400/10 bg-ivory-100 p-5">
                      <p className="font-display text-lg text-graphite-600">{data.title || 'Tytuł zlecenia'}</p>
                      <p className="mt-1 text-sm text-graphite-400">{data.publicSummary || 'Krótki opis...'}</p>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-graphite-300">
                        <span>{data.style || 'Styl nieokreślony'}</span>
                        <span>{data.unknownDimensions ? 'Wymiary do ustalenia' : `${data.widthCm || '?'}×${data.heightCm || '?'} cm`}</span>
                        <span>{data.budgetMin && data.budgetMax ? `${formatCurrency(parseInt(data.budgetMin))} - ${formatCurrency(parseInt(data.budgetMax))}` : 'Budżet nieokreślony'}</span>
                        <span>{data.deadline ? formatDate(data.deadline) : 'Termin nieokreślony'}</span>
                      </div>
                      {data.inspirationImages.length > 0 && (
                        <div className="mt-4 flex gap-2 overflow-hidden">
                          {data.inspirationImages.slice(0, 4).map((img) => (
                            <div key={img.id} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                              <img src={img.url} alt={`Przesłane zdjęcie ${img.filename}`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* What artists see */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-graphite-500">
                      <ImageIcon className="h-4 w-4 text-graphite-300" /> Co zobaczą tylko zalogowani artyści
                    </h3>
                    <div className="rounded-2xl border border-graphite-400/10 bg-ivory-100 p-5">
                      <ul className="space-y-2 text-sm text-graphite-400">
                        <li>Pełny opis: {data.whatToOrder || '-'}</li>
                        <li>Klimat: {data.mood || '-'}</li>
                        <li>Czego unikać: {data.avoidWhat || '-'}</li>
                        <li>Preferowane kolory: {data.preferredColors || '-'}</li>
                        <li>Kolory do unikania: {data.avoidedColors || '-'}</li>
                        <li>Kolory wnętrza: {data.interiorColors || '-'}</li>
                        <li>Opis inspiracji: {data.inspirationDescription || '-'}</li>
                        <li>Zdjęcia inspiracyjne: {data.inspirationImages.length}</li>
                        <li>Zdjęcia wnętrza: {data.interiorImages.length}</li>
                        <li>Lokalizacja: {data.location || '-'}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Consents */}
                  <div className="space-y-3">
                    {[
                      { key: 'consentPublic' as const, label: 'Zgoda na publikację publicznego skrótu zlecenia', hint: 'Tytuł, krótki opis, styl, wymiary, budżet, termin, miniatury inspiracji - widoczne dla wszystkich odwiedzających stronę.' },
                      { key: 'consentTerms' as const, label: 'Akceptacja regulaminu platformy', hint: 'Regulamin oraz zasady publikacji zleceń.' },
                      { key: 'consentRights' as const, label: 'Prawo do użycia zdjęć inspiracyjnych', hint: 'Potwierdzam, że przesłane zdjęcia są mojego autorstwa lub pochodzą ze źródeł pozwalających na takie użycie.' },
                      { key: 'consentArtistVisibility' as const, label: 'Widoczność pełnego opisu dla artystów', hint: 'Pełny opis zlecenia i inspiracje mogą być widoczne dla zalogowanych artystów.' },
                      { key: 'consentContactPrivate' as const, label: 'Prywatność danych kontaktowych', hint: 'Moje dane kontaktowe nie są publiczne i nie będą widoczne w publicznym podglądzie zlecenia.' },
                    ].map((item) => {
                      const checked = data[item.key];
                      const err = errors[item.key];
                      return (
                        <label
                          key={item.key}
                          className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                            checked
                              ? 'border-gold-400 bg-gold-50/50'
                              : err
                                ? 'border-error/30 bg-error/5'
                                : 'border-graphite-400/10 bg-ivory-50 hover:border-graphite-400/20'
                          }`}
                        >
                          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                            checked
                              ? 'border-gold-500 bg-gold-500 text-white'
                              : err
                                ? 'border-error/40 bg-white'
                                : 'border-graphite-300 bg-white group-hover:border-graphite-400'
                          }`}>
                            {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                          </span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => update(item.key, e.target.checked)}
                            className="sr-only"
                          />
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-medium ${checked ? 'text-graphite-600' : 'text-graphite-500'}`}>{item.label}</p>
                            <p className="mt-0.5 text-xs text-graphite-300">{item.hint}</p>
                            {err && <p className="mt-1 text-xs text-error">{err}</p>}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-graphite-400/10 pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={back}
              disabled={step === 0 || submitting}
            >
              <ArrowLeft className="h-4 w-4" /> Wstecz
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleSaveDraft}
                disabled={submitting || imagesUploading}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : imagesUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isEditMode ? 'Zapisz zmiany' : 'Zapisz jako szkic'}
              </Button>

              {step < 6 ? (
                <Button type="button" variant="primary" onClick={next}>
                  Dalej <ArrowRight className="h-4 w-4" />
                </Button>
              ) : isEditMode && originalStatus === 'offers_open' ? (
                <Button type="submit" variant="gold" disabled={submitting || imagesUploading}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : imagesUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Zapisz i opublikuj
                </Button>
              ) : (
                <Button type="submit" variant="gold" disabled={submitting || imagesUploading}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : imagesUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Wyślij do publikacji
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
