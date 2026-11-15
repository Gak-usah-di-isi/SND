import { Head } from '@inertiajs/react';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';
import { buildNav, buildRoutes } from './landingNav';

/*
 * Kerangka bersama semua halaman landing selain beranda: judul tab, link
 * "Lewati ke konten", header, dan footer. Halaman cukup membungkus isinya
 * dengan komponen ini.
 */
export default function LandingLayout({ layout = {}, title, current, description, routeYear = null, children }) {
    const abbreviation = layout.abbreviation ?? 'Seminar DAMPAK';
    const year = layout.year ?? new Date().getFullYear();
    const routes = buildRoutes(routeYear);

    return (
        <div className="min-h-screen overflow-x-clip bg-white text-base leading-relaxed text-sd-ink antialiased">
            <Head title={title || 'Seminar Dampak'}>
                {description && <meta name="description" content={description} />}
            </Head>

            <a
                className="sr-only rounded-full bg-sd-ink px-5 py-2.5 font-semibold !text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-gold"
                href="#konten"
            >
                Lewati ke konten
            </a>

            <LandingHeader
                nav={buildNav(routes, current)}
                brand={{ href: routes.home, logo: layout.logo ?? null, alt: `${abbreviation} ${year}, Universitas Brawijaya` }}
                actions={{ login: routes.login }}
            />

            <main id="konten" className="scroll-mt-24">
                {children}
            </main>

            <LandingFooter name={abbreviation} year={year} sdgs={layout.sdgs ?? []} />
        </div>
    );
}
