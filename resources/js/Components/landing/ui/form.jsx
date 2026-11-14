import { forwardRef } from 'react';
import { cn } from '../../../lib/utils';

// shadcn/ui Label, Input, Textarea (native, tanpa dependency tambahan).
const Label = forwardRef(({ className, ...props }, ref) => (
    <label ref={ref} className={cn('grid gap-2 text-sm font-semibold text-sd-ink', className)} {...props} />
));
Label.displayName = 'Label';

const fieldBase =
    'w-full rounded-xl border border-sd-line bg-white px-4 text-base text-sd-ink placeholder:text-sd-muted/70 transition-colors hover:border-sd-ink/40 focus-visible:border-sd-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sd-ink/30 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none';

const Input = forwardRef(({ className, type = 'text', ...props }, ref) => (
    <input ref={ref} type={type} className={cn(fieldBase, 'h-12', className)} {...props} />
));
Input.displayName = 'Input';

const Textarea = forwardRef(({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldBase, 'min-h-36 resize-y py-3', className)} {...props} />
));
Textarea.displayName = 'Textarea';

export { Label, Input, Textarea };
