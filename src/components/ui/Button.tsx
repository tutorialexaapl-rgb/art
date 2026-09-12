import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  gold: 'btn-gold',
};

const sizeClasses: Record<Size, string> = {
  sm: '!px-5 !py-2 !text-xs',
  md: '',
  lg: '!px-9 !py-4 !text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => (
    <button ref={ref} className={cn(variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </button>
  )
);
Button.displayName = 'Button';
