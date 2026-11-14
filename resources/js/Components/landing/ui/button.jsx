import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

// shadcn/ui Button, warna memakai token sd-* (navy dan emas Vokasi UB).
const buttonVariants = cva(
    'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px motion-reduce:transition-none',
    {
        variants: {
            variant: {
                default: 'bg-sd-ink text-white hover:bg-sd-ink-soft',
                accent: 'bg-sd-gold text-sd-ink hover:bg-[#ffc84d] focus-visible:outline-sd-gold',
                outline: 'border border-sd-ink/20 bg-white text-sd-ink hover:border-sd-ink hover:bg-sd-paper',
                outlineDark: 'border border-white/30 text-white hover:border-white hover:bg-white/10 focus-visible:outline-sd-gold',
                ghost: 'text-sd-ink hover:bg-sd-paper-deep',
                link: 'rounded-none px-0 text-sd-ink underline decoration-sd-gold decoration-2 underline-offset-4 hover:decoration-sd-ink',
            },
            size: {
                default: 'h-11 px-5',
                lg: 'h-12 px-6 text-[0.95rem]',
                icon: 'size-11',
            },
        },
        defaultVariants: { variant: 'default', size: 'default' },
    },
);

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };
