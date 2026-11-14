import { assetUrl } from './landingUtils';
import { container } from './landingStyles';
import { cn } from '../../lib/utils';
import { Button } from './ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './ui/sheet';

// Menu yang belum dibuka diarahkan ke "#" dan tidak berpindah halaman saat diklik.
function linkProps(item) {
    if (!item.disabled) return { href: item.href };
    return { href: '#', onClick: (e) => e.preventDefault() };
}

// Menu aktif cukup ditandai warna emas tua (kontras sekitar 5:1), tanpa latar tombol.
const activeText = '!text-sd-gold-ink font-bold';

function DesktopNav({ nav }) {
    return (
        <NavigationMenu aria-label="Navigasi utama" className="hidden min-[1200px]:flex">
            <NavigationMenuList>
                {nav.map((item) =>
                    item.children ? (
                        <NavigationMenuItem key={item.label}>
                            <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-0.5">
                                    {item.children.map((child) => (
                                        <li key={child.label}>
                                            <NavigationMenuLink asChild>
                                                <a
                                                    className="block rounded-md px-3 py-2.5 text-sm font-semibold text-sd-ink-soft transition-colors hover:text-sd-gold-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink motion-reduce:transition-none"
                                                    {...linkProps(child)}
                                                >
                                                    {child.label}
                                                </a>
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    ) : (
                        <NavigationMenuItem key={item.label}>
                            <NavigationMenuLink asChild active={item.current}>
                                <a
                                    className={cn(navigationMenuTriggerStyle, item.current && activeText)}
                                    aria-current={item.current ? 'page' : undefined}
                                    {...linkProps(item)}
                                >
                                    {item.label}
                                </a>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ),
                )}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function MobileNav({ nav, loginHref }) {
    const linkClass =
        'flex min-h-12 items-center rounded-md px-3 font-semibold text-sd-ink-soft transition-colors hover:text-sd-gold-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink motion-reduce:transition-none';
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="min-[1200px]:hidden" aria-label="Buka menu">
                    <svg width="20" height="20" viewBox="0 0 22 22" aria-hidden="true">
                        <path d="M3 7h16M3 15h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
                <SheetDescription className="sr-only">Navigasi halaman seminar</SheetDescription>
                <nav aria-label="Navigasi utama (seluler)" className="mt-6">
                    <ul className="grid gap-0.5">
                        {nav.map((item) =>
                            item.children ? (
                                <li key={item.label}>
                                    <span className="block px-3 pb-1 pt-4 text-xs font-bold text-sd-muted">{item.label}</span>
                                    <ul className="grid gap-0.5">
                                        {item.children.map((child) => (
                                            <li key={child.label}>
                                                <a className={cn(linkClass, 'pl-6')} {...linkProps(child)}>
                                                    {child.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ) : (
                                <li key={item.label}>
                                    {item.disabled ? (
                                        <a className={linkClass} {...linkProps(item)}>
                                            {item.label}
                                        </a>
                                    ) : (
                                        <SheetClose asChild>
                                            <a className={cn(linkClass, item.current && activeText)} aria-current={item.current ? 'page' : undefined} href={item.href}>
                                                {item.label}
                                            </a>
                                        </SheetClose>
                                    )}
                                </li>
                            ),
                        )}
                    </ul>
                </nav>
                <Button asChild variant="default" size="lg" className="mt-8 w-full">
                    <a href={loginHref}>Masuk ke dasbor</a>
                </Button>
            </SheetContent>
        </Sheet>
    );
}

export default function LandingHeader({ nav, brand, actions }) {
    return (
        <header className="sticky top-0 z-40 border-b border-sd-line/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            {/* Tiga kolom: logo | menu di tengah | aksi. Kolom samping sama lebar agar menu tepat di tengah. */}
            <div className={`${container} grid h-[72px] grid-cols-[1fr_auto] items-center gap-4 min-[1200px]:grid-cols-[1fr_auto_1fr]`}>
                <a
                    className="inline-flex h-11 w-fit items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink"
                    href={brand.href}
                >
                    {/* Logo dari editor landing (menu Logo); bila kosong memakai logo UB. */}
                    <img src={brand.logo ? assetUrl(brand.logo) : '/images/logoub.png'} alt={brand.alt} width="44" height="44" className="h-11 w-auto" />
                </a>

                <DesktopNav nav={nav} />

                <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" className="max-[479px]:hidden">
                        <a href={actions.login}>Masuk</a>
                    </Button>
                    <MobileNav nav={nav} loginHref={actions.login} />
                </div>
            </div>
        </header>
    );
}
