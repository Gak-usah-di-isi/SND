import { forwardRef } from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cn } from '../../../lib/utils';

// shadcn/ui NavigationMenu (Radix): dropdown bisa dipakai dengan keyboard dan ditutup dengan Escape.
const NavigationMenu = forwardRef(({ className, children, ...props }, ref) => (
    <NavigationMenuPrimitive.Root ref={ref} className={cn('relative z-10 flex items-center', className)} {...props}>
        {children}
    </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = 'NavigationMenu';

const NavigationMenuList = forwardRef(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.List ref={ref} className={cn('flex items-center gap-1', className)} {...props} />
));
NavigationMenuList.displayName = 'NavigationMenuList';

const NavigationMenuItem = forwardRef(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.Item ref={ref} className={cn('relative', className)} {...props} />
));
NavigationMenuItem.displayName = 'NavigationMenuItem';

const navigationMenuTriggerStyle =
    // Hover dan menu terbuka cukup ganti warna teks, tanpa latar seperti tombol.
    'inline-flex h-11 cursor-pointer items-center gap-1 whitespace-nowrap rounded-md px-3 text-sm font-semibold text-sd-ink-soft transition-colors hover:text-sd-gold-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink data-[state=open]:text-sd-gold-ink motion-reduce:transition-none';

const NavigationMenuTrigger = forwardRef(({ className, children, ...props }, ref) => (
    <NavigationMenuPrimitive.Trigger ref={ref} className={cn(navigationMenuTriggerStyle, 'group', className)} {...props}>
        {children}
        <svg
            className="transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            aria-hidden="true"
        >
            <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

// Satu-satunya bayangan besar di halaman: panel dropdown melayang di atas konten.
const NavigationMenuContent = forwardRef(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.Content
        ref={ref}
        className={cn(
            'absolute left-0 top-full mt-2 min-w-[230px] rounded-2xl border border-sd-line bg-white p-2 shadow-[0_16px_40px_rgba(21,34,74,0.14)]',
            className,
        )}
        {...props}
    />
));
NavigationMenuContent.displayName = 'NavigationMenuContent';

const NavigationMenuLink = NavigationMenuPrimitive.Link;

export {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
};
