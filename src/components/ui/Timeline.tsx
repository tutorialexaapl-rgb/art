import { cn } from '@/lib/utils';
import { milestoneStatusLabels } from '@/lib/mockData';
import type { Milestone } from '@/types';

interface TimelineProps {
  milestones: Milestone[];
}

export function Timeline({ milestones }: TimelineProps) {
  const statusColors: Record<string, string> = {
    done: 'border-gold-400 bg-gold-400 text-graphite-700',
    in_progress: 'border-graphite-600 bg-graphite-600 text-ivory-100',
    pending: 'border-graphite-400/20 bg-ivory-50 text-graphite-200',
    skipped: 'border-graphite-400/10 bg-ivory-200 text-graphite-200',
  };

  return (
    <div className="space-y-0">
      {milestones.map((m, i) => (
        <div key={m.id} className="relative flex gap-5 pb-8 last:pb-0">
          {i < milestones.length - 1 && (
            <div className={cn(
              'absolute left-[11px] top-7 h-full w-0.5',
              m.status === 'done' ? 'bg-gold-300' : 'bg-graphite-400/15'
            )} />
          )}
          <div className={cn(
            'relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
            statusColors[m.status]
          )}>
            {m.status === 'done' && (
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {m.status === 'in_progress' && <span className="h-1.5 w-1.5 rounded-full bg-ivory-100 animate-pulse" />}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className={cn(
                'text-sm font-medium',
                m.status === 'done' ? 'text-graphite-500' : m.status === 'in_progress' ? 'text-graphite-700' : 'text-graphite-400'
              )}>
                {m.title}
              </h4>
              <span className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                m.status === 'done' ? 'bg-gold-100 text-gold-600' :
                m.status === 'in_progress' ? 'bg-graphite-600/10 text-graphite-600' :
                'bg-ivory-300 text-graphite-300'
              )}>
                {milestoneStatusLabels[m.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-graphite-300">{m.description}</p>
            <div className="mt-2 flex items-center gap-3 text-xs text-graphite-200">
              <span>Termin: {new Date(m.dueDate).toLocaleDateString('pl-PL')}</span>
              {m.completedAt && <span>Ukończono: {new Date(m.completedAt).toLocaleDateString('pl-PL')}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
