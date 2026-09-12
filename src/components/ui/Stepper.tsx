import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface Step {
  id: string;
  label: string;
  description?: string;
  status: 'pending' | 'active' | 'done' | 'skipped';
}

interface StepperProps {
  steps: Step[];
  onStepClick?: (index: number) => void;
  className?: string;
}

export function Stepper({ steps, onStepClick, className }: StepperProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {steps.map((step, i) => (
        <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && (
            <div className={cn(
              'absolute left-[15px] top-8 h-full w-px',
              step.status === 'done' ? 'bg-gold-300' : 'bg-graphite-400/15'
            )} />
          )}
          <button
            type="button"
            onClick={() => onStepClick?.(i)}
            disabled={!onStepClick}
            className={cn('group relative z-10 flex gap-4 text-left', onStepClick && 'cursor-pointer')}
          >
          <div className={cn(
            'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all',
            step.status === 'done' && 'border-gold-400 bg-gold-400 text-graphite-700',
            step.status === 'active' && 'border-graphite-600 bg-graphite-600 text-ivory-100',
            step.status === 'pending' && 'border-graphite-400/20 bg-ivory-50 text-graphite-200',
            step.status === 'skipped' && 'border-graphite-400/10 bg-ivory-200 text-graphite-200'
          )}>
            {step.status === 'done' && (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {step.status === 'active' && <span className="h-2 w-2 rounded-full bg-ivory-100" />}
            {step.status === 'pending' && <span className="text-xs font-medium">{i + 1}</span>}
          </div>
          <div className="pt-1">
            <p className={cn(
              'text-sm font-medium transition-colors',
              step.status === 'done' && 'text-graphite-500',
              step.status === 'active' && 'text-graphite-700',
              step.status === 'pending' && 'text-graphite-300',
              step.status === 'skipped' && 'text-graphite-200'
            )}>
              {step.label}
            </p>
            {step.description && (
              <p className="mt-0.5 text-xs text-graphite-300">{step.description}</p>
            )}
          </div>
          </button>
        </div>
      ))}
    </div>
  );
}
