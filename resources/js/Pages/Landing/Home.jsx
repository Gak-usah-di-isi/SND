import LandingLayout from '../../Components/landing/LandingLayout';
import { buildRoutes } from '../../Components/landing/landingNav';
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

/*
 * Beranda Seminar DAMPAK, dibangun dengan shadcn/ui (Components/landing/ui).
 * Tiap section ada di Components/landing/sections/ agar bisa dikerjakan terpisah.
 * Urutan section dan field data mengikuti beranda ICASVE / editor landing.
 *
 * Arah desain: bersih dan lapang. Latar putih dan krem bergantian, tinta navy,
 * emas hanya untuk aksen. Motif identitas: pita 17 warna SDGs (Sdg.color) di
 * hero dan footer, plus stabilo emas di satu kata per judul.
 *
 * Semua data dikirim LandingPageController@index. Section yang datanya kosong
 * menyembunyikan diri, jadi beranda tetap utuh saat admin belum mengisi apa pun.
 */

export default function Home(props) {
    const data = props;

    const year = data.activeYear?.year ?? new Date().getFullYear();
    const abbreviation = data.conference_abbreviation ?? 'Seminar DAMPAK';
    const routes = buildRoutes(props.routeYear ?? null);

    return (
        <LandingLayout
            title="Seminar Dampak"
            current="Beranda"
            layout={data.layout}
            routeYear={props.routeYear ?? null}
            description={`${abbreviation} ${year}: ${data.conference_title?.title ?? ''}. BPPM Fakultas Vokasi Universitas Brawijaya.`}
        >
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
        </LandingLayout>
    );
}
