import { Link } from 'react-router-dom';
import { cn, formatCurrency, truncate } from '@/lib/utils';
import type { ReactNode } from 'react';

interface DashboardStatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: string; positive: boolean };
  to?: string;
  className?: string;
}

export function DashboardStatCard({ label, value, icon, trend, to, className }: DashboardStatCardProps) {
  const content = (
    <div className={cn('rounded-2xl border border-graphite-400/10 bg-ivory-50 p-6 shadow-sm transition-colors', to && 'hover:border-gold-400/30', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">{label}</p>
          <p className="mt-2 font-display text-3xl text-graphite-600">{typeof value === 'number' && label.includes('zł') ? formatCurrency(value) : value}</p>
        </div>
        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ivory-200 text-graphite-400">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className={trend.positive ? 'text-success' : 'text-error'}>{trend.value}</span>
          <span className="text-graphite-200">vs. poprzedni miesiąc</span>
        </div>
      )}
    </div>
  );

  return to ? <Link to={to} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60">{content}</Link> : content;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        <h1 className="font-display text-title text-graphite-600">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-graphite-400 text-pretty">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
