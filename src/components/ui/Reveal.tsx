import { type ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Reveal({ children, className, delay }: RevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn('animate-on-scroll', delay && `stagger-${delay}`, isVisible && 'is-visible', className)}
    >
      {children}
    </div>
  );
}
