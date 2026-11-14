import SdgRibbon from './SdgRibbon';
import { container } from './landingStyles';

export default function LandingFooter({ name, year, sdgs }) {
    return (
        <footer className="bg-sd-ink text-white">
            <SdgRibbon sdgs={sdgs} />
            <div className={`${container} flex flex-wrap items-end justify-between gap-x-12 gap-y-4 py-12`}>
                <div>
                    <p className="text-[1.2rem] font-extrabold">
                        {name} {year}
                    </p>
                    <p className="mt-1 text-[0.9rem] text-white/80">BPPM Fakultas Vokasi Universitas Brawijaya</p>
                </div>
                <p className="text-[0.85rem] text-white/75">© {year} BPPM Fakultas Vokasi Universitas Brawijaya</p>
            </div>
        </footer>
    );
}
