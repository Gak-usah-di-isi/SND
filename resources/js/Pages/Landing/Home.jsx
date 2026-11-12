import { Head } from '@inertiajs/react';
import LandingHeader from '../../Components/landing/LandingHeader';
import LandingFooter from '../../Components/landing/LandingFooter';
import { buildNav, buildRoutes } from '../../Components/landing/landingNav';
import HeroSection from '../../Components/landing/sections/HeroSection';
import AboutSection from '../../Components/landing/sections/AboutSection';
import SdgsSection from '../../Components/landing/sections/SdgsSection';
import SpeakersSection from '../../Components/landing/sections/SpeakersSection';
import ThemesSection from '../../Components/landing/sections/ThemesSection';
import TimelineSection from '../../Components/landing/sections/TimelineSection';
import VenueSection from '../../Components/landing/sections/VenueSection';
import HostsSection from '../../Components/landing/sections/HostsSection';
import FaqSection from '../../Components/landing/sections/FaqSection';
import ContactSection from '../../Components/landing/sections/ContactSection';
import { landingDummy } from '../../data/landingDummy';

/*
 * Beranda Seminar DAMPAK, dibangun dengan shadcn/ui (Components/landing/ui).
 * Tiap section ada di Components/landing/sections/ agar bisa dikerjakan terpisah.
 * Urutan section dan field data mengikuti beranda ICASVE / editor landing.
 *
 * Arah desain: bersih dan lapang. Latar putih dan krem bergantian, tinta navy,
 * emas hanya untuk aksen. Motif identitas: pita 17 warna SDGs (Sdg.color) di
 * hero dan footer, plus stabilo emas di satu kata per judul.
 */

export default function Home(props) {
    // Data contoh dipakai PER KEY: key yang sudah dikirim controller menimpa dummy,
    // jadi section bisa diintegrasikan satu per satu tanpa section lain hilang.
    const data = { ...landingDummy, ...props };

    const year = data.activeYear?.year ?? new Date().getFullYear();
    const abbreviation = data.conference_abbreviation ?? landingDummy.conference_abbreviation;
    const routes = buildRoutes(props.routeYear ?? null);

    return (
        <div className="min-h-screen overflow-x-clip bg-white text-base leading-relaxed text-sd-ink antialiased">
            <Head title="Seminar Dampak">
                <meta name="description" content={`${abbreviation} ${year}: ${data.conference_title?.title ?? ''}. BPPM Fakultas Vokasi Universitas Brawijaya.`} />
            </Head>

            <a
                className="sr-only rounded-full bg-sd-ink px-5 py-2.5 font-semibold !text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-gold"
                href="#konten"
            >
                Lewati ke konten
            </a>

            <LandingHeader nav={buildNav(routes)} brand={{ href: routes.home, logo: data.logo, alt: `${abbreviation} ${year}, Universitas Brawijaya` }} actions={{ login: routes.login }} />

            <main id="konten" className="scroll-mt-24">
                <HeroSection title={data.conference_title} abbreviation={abbreviation} year={year} routes={routes} sdgs={data.sdgs} />
                <AboutSection about={data.about} />
                <SdgsSection sdgs={data.sdgs} />
                <SpeakersSection keynote={data.keynoteSpeakers} invited={data.invitedSpeakers} abbreviation={abbreviation} year={year} />
                {/* Link detail subtema baru aktif saat themes sudah dikirim dari database (id-nya nyata). */}
                <ThemesSection themes={data.themes} linkable={Boolean(props.themes)} />
                <TimelineSection dates={data.deadline_date} posters={data.posters} />
                <VenueSection venues={data.venues} />
                <HostsSection
                    groups={[
                        { label: 'Penyelenggara', items: data.hosted_by },
                        { label: 'Mitra penyelenggara', items: data.co_hosted_by },
                        { label: 'Didukung oleh', items: data.supported_by },
                    ]}
                />
                <FaqSection faqs={data.faqs} />
                <ContactSection contact={data.contacts?.[0] ?? null} />
            </main>

            <LandingFooter name={abbreviation} year={year} sdgs={data.sdgs} />
        </div>
    );
}
