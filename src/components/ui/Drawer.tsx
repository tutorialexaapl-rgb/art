import { type ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: 'left' | 'right';
}

export function Drawer({ open, onClose, title, children, side = 'right' }: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={cn('absolute inset-0 bg-graphite-700/40 backdrop-blur-sm transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />
      <div
        className={cn(
          'absolute top-0 h-full w-full max-w-md bg-ivory-50 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          side === 'right' ? 'right-0 ' + (open ? 'translate-x-0' : 'translate-x-full') : 'left-0 ' + (open ? 'translate-x-0' : '-translate-x-full')
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-graphite-400/10 px-6 py-5">
            <h3 className="font-display text-xl text-graphite-600">{title}</h3>
            <button onClick={onClose} className="text-graphite-300 hover:text-graphite-500 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto p-6" style={{ maxHeight: title ? 'calc(100vh - 81px)' : '100vh' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
