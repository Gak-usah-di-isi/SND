import { forwardRef } from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '../../../lib/utils';

// shadcn/ui Avatar (Radix): bila foto kosong atau gagal dimuat, tampil inisial.
const Avatar = forwardRef(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root ref={ref} className={cn('relative flex size-14 shrink-0 overflow-hidden rounded-full', className)} {...props} />
));
Avatar.displayName = 'Avatar';

const AvatarImage = forwardRef(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image ref={ref} className={cn('aspect-square size-full object-cover', className)} {...props} />
));
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = forwardRef(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn('flex size-full items-center justify-center rounded-full bg-sd-paper-deep font-bold text-sd-ink', className)}
        {...props}
    />
));
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
