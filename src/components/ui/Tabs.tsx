import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  badge?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div className={className}>
      <div className="flex gap-1 border-b border-graphite-400/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'relative px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-300',
              active === tab.id ? 'text-graphite-700' : 'text-graphite-300 hover:text-graphite-400'
            )}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-600">
                {tab.badge}
              </span>
            )}
            {active === tab.id && (
              <span className="absolute bottom-0 left-0 h-px w-full bg-graphite-600 animate-draw-line" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-6">{activeTab?.content}</div>
    </div>
  );
}
