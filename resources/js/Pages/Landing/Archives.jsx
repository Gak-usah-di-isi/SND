import { router } from '@inertiajs/react';
import LandingLayout from '../../Components/landing/LandingLayout';
import { EmptyNote, Mark, SectionHeading } from '../../Components/landing/sections/SectionParts';
import { container, section } from '../../Components/landing/landingStyles';

function AbstractCard({ abstract }) {
    return (
        <li>
            <article className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="break-words text-lg font-bold leading-snug text-sd-ink">{abstract.title}</h3>

                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                    {abstract.presentation_type && (
                        <div className="min-w-0">
                            <dt className="text-sm font-semibold text-sd-muted">Topik</dt>
                            <dd className="mt-1 break-words font-semibold text-sd-ink">{abstract.presentation_type}</dd>
                        </div>
                    )}
                    {abstract.authors && (
                        <div className="min-w-0 sm:col-span-2">
                            <dt className="text-sm font-semibold text-sd-muted">Penulis</dt>
                            <dd className="mt-1 break-words font-semibold text-sd-ink">{abstract.authors}</dd>
                        </div>
                    )}
                </dl>

                <a
                    href={`/download-abstract/${abstract.id}`}
                    className="mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-sd-ink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-sd-ink-soft active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink motion-reduce:transition-none"
                >
                    Unduh abstrak
                </a>
            </article>
        </li>
    );
}

// Halaman Arsip abstrak. Data: tahun-tahun abstrak diterima dan daftar abstrak
// pada tahun terpilih. Pemilihan tahun memakai query string ?year=...
export default function Archives({ layout, years = [], selectedYear = null, abstracts = [] }) {
    // Tahun dari URL bisa saja tidak ada di daftar (mis. /archives/2019 kosong);
    // tetap tampilkan sebagai pilihan agar dropdown tidak kehilangan nilainya.
    const yearOptions =
        selectedYear && !years.some((year) => Number(year) === Number(selectedYear))
            ? [selectedYear, ...years]
            : years;

    const changeYear = (event) => {
        router.get(
            '/archives',
            { year: event.target.value },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <LandingLayout
            layout={layout}
            title="Arsip"
            current="Arsip"
            description="Arsip abstrak Seminar DAMPAK dari tahun ke tahun."
        >
            <section className={section} aria-labelledby="archives-title">
                <div className={container}>
                    <SectionHeading
                        id="archives-title"
                        intro={
                            selectedYear
                                ? `Abstrak yang diterima pada tahun ${selectedYear}.`
                                : 'Kumpulan abstrak Seminar DAMPAK dari tahun ke tahun.'
                        }
                    >
                        <Mark>Arsip</Mark> abstrak
                    </SectionHeading>

                    {yearOptions.length > 0 && (
                        <div className="mb-8 flex flex-wrap items-center gap-3">
                            <label htmlFor="archive-year" className="text-sm font-semibold text-sd-ink">
                                Tahun
                            </label>
                            <select
                                id="archive-year"
                                value={selectedYear ?? ''}
                                onChange={changeYear}
                                className="min-h-11 cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-sd-ink transition-colors hover:border-sd-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink motion-reduce:transition-none"
                            >
                                {yearOptions.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {abstracts.length === 0 ? (
                        <EmptyNote>
                            {selectedYear
                                ? `Belum ada abstrak yang tersedia untuk tahun ${selectedYear}.`
                                : 'Arsip abstrak belum tersedia.'}
                        </EmptyNote>
                    ) : (
                        <ol className="space-y-4">
                            {abstracts.map((abstract) => (
                                <AbstractCard key={abstract.id} abstract={abstract} />
                            ))}
                        </ol>
                    )}
                </div>
            </section>
        </LandingLayout>
    );
}
