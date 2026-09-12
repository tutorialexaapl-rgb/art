import { type InputHTMLAttributes, forwardRef, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, id, ...props }, ref) => (
    <div>
      {label && <label htmlFor={id} className="label-elegant">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-graphite-200">{icon}</span>}
        <input
          ref={ref}
          id={id}
          className={cn('input-elegant', icon ? 'pl-11' : '', error ? 'border-error/50 focus:border-error focus:ring-error/30' : '', className)}
          {...props}
        />
      </div>
      {hint && !error && <p className="mt-1.5 text-xs text-graphite-300">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => (
    <div>
      {label && <label htmlFor={id} className="label-elegant">{label}</label>}
      <textarea ref={ref} id={id} className={cn('input-elegant resize-none', error && 'border-error/50', className)} {...props} />
      {hint && !error && <p className="mt-1.5 text-xs text-graphite-300">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  )
);
Textarea.displayName = 'Textarea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className, id, children, ...props }, ref) => (
    <div>
      {label && <label htmlFor={id} className="label-elegant">{label}</label>}
      <select ref={ref} id={id} className={cn('input-elegant cursor-pointer appearance-none bg-[url(\'data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236f6d64%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E\')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10', error && 'border-error/50', className)} {...props}>
        {children}
      </select>
      {hint && !error && <p className="mt-1.5 text-xs text-graphite-300">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  )
);
Select.displayName = 'Select';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: string;
}

export function Checkbox({ label, description, className, id, checked, ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className={cn('group flex cursor-pointer items-start gap-3', className)}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-full border-graphite-400/30 bg-ivory-50 text-sky-500 accent-sky-500 focus:ring-2 focus:ring-sky-500/30"
        {...props}
      />
      <span className="space-y-0.5">
        <span className="block text-sm font-medium text-graphite-600 transition-colors group-hover:text-graphite-700">{label}</span>
        {description && <span className="block text-xs leading-5 text-graphite-300">{description}</span>}
      </span>
    </label>
  );
}

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  value?: string;
  options: RadioOption[];
  onChange?: (value: string) => void;
  label?: string;
}

export function RadioGroup({ name, value, options, onChange, label }: RadioGroupProps) {
  return (
    <div>
      {label && <span className="label-elegant">{label}</span>}
      <div className="space-y-3">
        {options.map((opt) => (
          <label key={opt.value} className="flex cursor-pointer items-start gap-3 group">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange?.(opt.value)}
              className="mt-0.5 h-5 w-5 border-graphite-400/30 text-gold-400 focus:ring-gold-400/30 cursor-pointer"
            />
            <div>
              <span className="text-sm font-medium text-graphite-600 group-hover:text-graphite-700 transition-colors">{opt.label}</span>
              {opt.description && <p className="text-xs text-graphite-300 mt-0.5">{opt.description}</p>}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
