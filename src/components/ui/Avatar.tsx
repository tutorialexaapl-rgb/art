import { useState } from 'react';
import { cn, initials } from '@/lib/utils';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'h-8 w-8 text-xs',
  sm: 'h-10 w-10 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
};

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showInitials = !src || imgError;

  return (
    <div className={cn('relative shrink-0 overflow-hidden rounded-full bg-beige-200 flex items-center justify-center', sizeClasses[size], className)}>
      {showInitials ? (
        <span className="font-display font-medium text-graphite-500">{initials(name)}</span>
      ) : (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}
