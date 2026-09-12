import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeColor = 'neutral' | 'gold' | 'success' | 'warning' | 'error' | 'clay' | 'stone';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
}

const colorClasses: Record<BadgeColor, string> = {
  neutral: 'bg-ivory-300 text-graphite-400',
  gold: 'bg-gold-100 text-gold-600',
  success: 'bg-success/10 text-success-dark',
  warning: 'bg-warning/10 text-warning-dark',
  error: 'bg-error/10 text-error-dark',
  clay: 'bg-clay-100 text-clay-500',
  stone: 'bg-stone-100 text-stone-500',
};

export function Badge({ color = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide', colorClasses[color], className)}
      {...props}
    >
      {children}
    </span>
  );
}
