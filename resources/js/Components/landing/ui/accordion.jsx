import { forwardRef } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '../../../lib/utils';

// shadcn/ui Accordion (Radix): keyboard Enter/Space, panah atas/bawah antar item.
const Accordion = AccordionPrimitive.Root;

const AccordionItem = forwardRef(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item ref={ref} className={cn('border-b border-sd-line', className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = forwardRef(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                'group flex min-h-16 flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-base font-semibold text-sd-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink sm:text-lg',
                className,
            )}
            {...props}
        >
            {children}
            <span
                className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-sd-line transition-colors group-hover:border-sd-ink group-data-[state=open]:border-sd-gold group-data-[state=open]:bg-sd-gold motion-reduce:transition-none"
                aria-hidden="true"
            >
                <span className="absolute h-0.5 w-3 rounded-full bg-current" />
                <span className="absolute h-3 w-0.5 rounded-full bg-current transition-transform group-data-[state=open]:rotate-90 group-data-[state=open]:scale-y-0 motion-reduce:transition-none" />
            </span>
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = forwardRef(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content ref={ref} className="overflow-hidden" {...props}>
        <div className={cn('max-w-[64ch] pb-6 pr-14 text-sd-muted', className)}>{children}</div>
    </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
