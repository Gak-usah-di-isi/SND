import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

// shadcn/ui Badge. Dipakai hanya untuk status nyata (mis. "Menunggu konfirmasi", "Berikutnya").
const badgeVariants = cva('inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', {
    variants: {
        variant: {
            default: 'bg-sd-ink text-white',
            accent: 'bg-sd-gold text-sd-ink',
            muted: 'bg-sd-paper-deep text-sd-muted',
            onDark: 'bg-white/15 text-white',
        },
    },
    defaultVariants: { variant: 'default' },
});

function Badge({ className, variant, ...props }) {
    return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
