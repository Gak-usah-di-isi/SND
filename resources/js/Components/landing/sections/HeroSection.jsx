import SdgRibbon from '../SdgRibbon';
import { container } from '../landingStyles';
import { Button } from '../ui/button';

// Data: ConferenceTitle (title, description, year), ConferenceSetting.conference_abbreviation, Sdg (color).

// Foto latar hero (Gedung Laboratorium Vokasi UB). Ganti file ini bila ada foto acara yang lebih baru.
const HERO_IMAGE = '/images/Lab.jpeg';

export default function Hero({ title, abbreviation, year, routes, sdgs }) {
    return (
        <section className="pt-4 md:pt-6" aria-labelledby="hero-title">
            <div className={container}>
                <div className="relative isolate overflow-hidden rounded-[32px] bg-sd-ink text-white">
                    {/*
                      Latar foto Gedung Vokasi UB (aset tetap, seperti ornamen hero ICASVE) dengan overlay navy:
                      pekat di kiri agar teks tetap kontras, memudar ke kanan agar gedung terlihat.
                      Di HP overlay dibuat rata dan pekat karena teks menutupi seluruh lebar.
                    */}
                    <img
                        src={HERO_IMAGE}
                        alt=""
                        width="981"
                        height="737"
                        fetchPriority="high"
                        className="absolute inset-0 -z-20 size-full object-cover object-[70%_35%]"
                    />
                    <div
                        className="absolute inset-0 -z-10 bg-sd-ink/90 lg:bg-transparent lg:bg-[linear-gradient(90deg,var(--color-sd-ink)_0%,var(--color-sd-ink)_38%,color-mix(in_srgb,var(--color-sd-ink)_70%,transparent)_68%,color-mix(in_srgb,var(--color-sd-ink)_35%,transparent)_100%)]"
                        aria-hidden="true"
                    />
                    <div className="px-6 pb-14 pt-14 sm:px-10 lg:px-16 lg:pb-20 lg:pt-20">
                        <p className="text-sm font-semibold text-white/70">
                            {abbreviation} {title.year ?? year}
                        </p>
                        <h1
                            id="hero-title"
                            className="mt-5 max-w-[20ch] text-balance text-[clamp(2.25rem,1.2rem+4.4vw,4.5rem)] font-extrabold leading-[1.03] tracking-[-0.035em]"
                        >
                            {title.title}
                        </h1>
                        {title.description && (
                            <p className="mt-6 max-w-[44ch] text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] font-medium leading-snug text-sd-gold">
                                {title.description}
                            </p>
                        )}
                        <div className="mt-10 flex flex-wrap gap-3">
                            <Button asChild variant="accent" size="lg">
                                <a href={routes.register}>Daftar dan kirim abstrak</a>
                            </Button>
                            <Button asChild variant="outlineDark" size="lg">
                                <a href="#tanggal-penting">Lihat tanggal penting</a>
                            </Button>
                        </div>
                    </div>
                    <SdgRibbon sdgs={sdgs} />
                </div>
            </div>
        </section>
    );
}
