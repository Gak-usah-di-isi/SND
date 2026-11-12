import { container, h2, lead, section } from '../landingStyles';
import { Mark } from './SectionParts';

// Data: Sdg (order, code, name_id). Ikon dari public/images/sdgs/{code}.svg.

export default function Sdgs({ sdgs }) {
    if (!sdgs?.length) return null;
    return (
        <section id="sdgs" className={`${section} bg-sd-paper`} aria-labelledby="sdgs-title">
            <div className={container}>
                <div className="mb-12 grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-16">
                    <h2 id="sdgs-title" className={h2}>
                        Setiap abstrak terhubung ke <Mark>SDGs</Mark>
                    </h2>
                    <p className={lead}>
                        Saat mengunggah abstrak, pilih satu atau lebih dari {sdgs.length} Tujuan Pembangunan Berkelanjutan yang paling dekat
                        dengan kegiatan atau hasil riset Anda.
                    </p>
                </div>
                <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-5 lg:grid-cols-7 lg:gap-x-5">
                    {sdgs.map((sdg) => (
                        <li key={sdg.id ?? sdg.code}>
                            {/* Ikon resmi SDG sudah memuat nama Inggris; nama Indonesia ada di keterangan. */}
                            <img className="aspect-square w-full rounded-2xl" src={`/images/sdgs/${sdg.code}.svg`} alt="" width="120" height="120" loading="lazy" />
                            <span className="mt-2.5 block text-xs leading-snug text-sd-ink-soft sm:text-[0.8rem]">
                                <span className="font-bold text-sd-ink">{sdg.order}.</span> {sdg.name_id}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
