import { forwardRef } from 'react';
import { cn } from '../../../lib/utils';

// shadcn/ui Card. Tanpa bayangan: kartu dibedakan lewat garis tipis, bukan elevasi.
const Card = forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-3xl border border-sd-line bg-white text-sd-ink', className)} {...props} />
));
Card.displayName = 'Card';

const CardHeader = forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(({ className, as: Tag = 'h3', ...props }, ref) => (
    <Tag ref={ref} className={cn('text-lg font-bold leading-snug tracking-tight', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef(({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-sd-muted', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
