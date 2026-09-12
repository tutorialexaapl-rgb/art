import { type ReactNode } from 'react';
import { Inbox, AlertTriangle, Loader2 } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-ivory-300 text-graphite-300">
        {icon ?? <Inbox className="h-7 w-7" />}
      </div>
      <h3 className="font-display text-xl text-graphite-600">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-graphite-300">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Coś poszło nie tak', description = 'Spróbuj ponownie za chwilę.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-error/5 text-error">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h3 className="font-display text-xl text-graphite-600">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-graphite-300">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-6">Spróbuj ponownie</button>
      )}
    </div>
  );
}

export function LoadingState({ label = 'Ładowanie...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-graphite-200" />
      <p className="mt-3 text-sm text-graphite-300">{label}</p>
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className ?? ''}`} />;
}
