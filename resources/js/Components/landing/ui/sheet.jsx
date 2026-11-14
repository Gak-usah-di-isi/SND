import { forwardRef } from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../../lib/utils';

// shadcn/ui Sheet (Radix Dialog): panel menu seluler, fokus terkunci di dalam, Escape menutup.
const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetTitle = SheetPrimitive.Title;
const SheetDescription = SheetPrimitive.Description;

const SheetContent = forwardRef(({ className, children, ...props }, ref) => (
    <SheetPrimitive.Portal>
        <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-sd-ink/40" />
        <SheetPrimitive.Content
            ref={ref}
            className={cn(
                'fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-white p-6 text-sd-ink focus:outline-none',
                className,
            )}
            {...props}
        >
            {children}
            <SheetPrimitive.Close className="absolute right-4 top-4 inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-sd-line hover:border-sd-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink">
                <svg width="18" height="18" viewBox="0 0 22 22" aria-hidden="true">
                    <path d="M5 5l12 12M17 5 5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span className="sr-only">Tutup menu</span>
            </SheetPrimitive.Close>
        </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
));
SheetContent.displayName = 'SheetContent';

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };
