import { cn } from '@/lib/utils';

type StatusType = 'commission' | 'offer' | 'project' | 'milestone' | 'user';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
}

const labelMap: Record<string, string> = {
  draft: 'Szkic', published: 'Opublikowane', offers_open: 'Otwarte na oferty', artist_selected: 'Wybrano artystę', in_progress: 'W realizacji',
  completed: 'Zakończone', cancelled: 'Anulowane', closed: 'Zamknięte',
  pending: 'Oczekuje', pending_review: 'W weryfikacji', accepted: 'Zaakceptowana',
  submitted: 'Złożona', viewed: 'Wyświetlona', shortlisted: 'W krótkiej liście', rejected: 'Odrzucona',
  withdrawn: 'Wycofana', awaiting_deposit: 'Oczekuje na zaliczkę',
  review: 'W przeglądzie', awaiting_final_payment: 'Oczekuje na płatność',
  approved: 'Zatwierdzony', suspended: 'Zawieszony',
  skipped: 'Pominięty', done: 'Ukończony',
  deposit_pending: 'Oczekuje na zaliczkę', deposit_paid: 'Zaliczka opłacona',
  concept_stage: 'Etap koncepcji', concept_accepted: 'Koncepcja zaakceptowana', painting_in_progress: 'Malowanie w toku',
  preview_uploaded: 'Podgląd gotowy', revision_requested: 'Wymagane poprawki', final_accepted: 'Praca zaakceptowana',
  final_payment_pending: 'Oczekuje na płatność końcową', fully_paid: 'W pełni opłacone', delivery_preparation: 'Przygotowanie wysyłki',
  delivered: 'Dostarczono', disputed: 'Spór',
};

const colorMap: Record<string, string> = {
  open: 'bg-success/10 text-success-dark',
  offers_open: 'bg-success/10 text-success-dark',
  published: 'bg-success/10 text-success-dark',
  artist_selected: 'bg-gold-100 text-gold-600',
  approved: 'bg-success/10 text-success-dark',
  done: 'bg-gold-100 text-gold-600',
  completed: 'bg-success/10 text-success-dark',
  accepted: 'bg-gold-100 text-gold-600',
  shortlisted: 'bg-gold-100 text-gold-600',
  in_progress: 'bg-graphite-600/10 text-graphite-600',
  pending: 'bg-ivory-300 text-graphite-400',
  submitted: 'bg-ivory-300 text-graphite-400',
  viewed: 'bg-graphite-600/10 text-graphite-600',
  awaiting_deposit: 'bg-warning/10 text-warning-dark',
  awaiting_final_payment: 'bg-warning/10 text-warning-dark',
  review: 'bg-clay-100 text-clay-500',
  draft: 'bg-ivory-300 text-graphite-300',
  pending_review: 'bg-warning/10 text-warning-dark',
  cancelled: 'bg-error/10 text-error-dark',
  declined: 'bg-error/10 text-error-dark',
  rejected: 'bg-error/10 text-error-dark',
  withdrawn: 'bg-error/10 text-error-dark',
  suspended: 'bg-error/10 text-error-dark',
  skipped: 'bg-ivory-200 text-graphite-200',
  closed: 'bg-stone-100 text-stone-500',
  deposit_pending: 'bg-warning/10 text-warning-dark',
  deposit_paid: 'bg-success/10 text-success-dark',
  concept_stage: 'bg-graphite-600/10 text-graphite-600',
  concept_accepted: 'bg-gold-100 text-gold-600',
  painting_in_progress: 'bg-graphite-600/10 text-graphite-600',
  preview_uploaded: 'bg-clay-100 text-clay-500',
  revision_requested: 'bg-warning/10 text-warning-dark',
  final_accepted: 'bg-gold-100 text-gold-600',
  final_payment_pending: 'bg-warning/10 text-warning-dark',
  fully_paid: 'bg-success/10 text-success-dark',
  delivery_preparation: 'bg-graphite-600/10 text-graphite-600',
  delivered: 'bg-success/10 text-success-dark',
  disputed: 'bg-error/10 text-error-dark',
};

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const label = labelMap[status] ?? status;
  const color = colorMap[status] ?? 'bg-ivory-300 text-graphite-400';
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide', color, className)} data-type={type}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {label}
    </span>
  );
}
