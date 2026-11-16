import { forwardRef } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../../lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn('flex flex-wrap gap-2', className)}
        {...props}
    />
));
TabsList.displayName = 'TabsList';

const TabsTrigger = forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            'inline-flex min-h-11 max-w-full cursor-pointer items-center justify-center rounded-xl border border-sd-line px-4 py-2 text-left text-sm font-semibold text-sd-ink transition-colors hover:border-sd-ink active:translate-y-px data-[state=active]:border-sd-ink data-[state=active]:bg-sd-ink data-[state=active]:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50',
            className,
        )}
        {...props}
    />
));
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn('mt-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sd-ink', className)}
        {...props}
    />
));
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
