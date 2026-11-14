import { useState } from 'react';
import LandingLayout from '../../../Components/landing/LandingLayout';
import { EmptyNote, Mark, SectionHeading } from '../../../Components/landing/sections/SectionParts';
import { container, section } from '../../../Components/landing/landingStyles';
import { Input, Label } from '../../../Components/landing/ui/form';

// Halaman Komite Reviewer. Data: ReviewerCommittee (name, institution, country).
// Pencarian disaring di sisi React karena daftarnya sudah dimuat sekaligus.
export default function Reviewer({ layout, reviewers = [], selectedYear }) {
    const [query, setQuery] = useState('');
    const needle = query.trim().toLowerCase();
    const filtered = needle
        ? reviewers.filter((reviewer) => `${reviewer.name ?? ''} ${reviewer.institution ?? ''}`.toLowerCase().includes(needle))
        : reviewers;

    return (
        <LandingLayout layout={layout} title="Komite Reviewer" current="Komite Reviewer">
            <section className={section} aria-labelledby="reviewer-title">
                <div className={container}>
                    <SectionHeading
                        id="reviewer-title"
                        intro={selectedYear ? `Daftar penelaah abstrak seminar tahun ${selectedYear}.` : undefined}
                    >
                        Komite <Mark>Reviewer</Mark>
                    </SectionHeading>

                    {reviewers.length === 0 ? (
                        <EmptyNote>Daftar Komite Reviewer tahun ini belum tersedia.</EmptyNote>
                    ) : (
                        <>
                            <div className="mb-8 max-w-md">
                                <Label htmlFor="reviewer-search">
                                    Cari reviewer
                                    <Input
                                        id="reviewer-search"
                                        type="search"
                                        placeholder="Nama atau institusi"
                                        autoComplete="off"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                </Label>
                            </div>

                            {filtered.length === 0 ? (
                                <EmptyNote>Tidak ada reviewer yang cocok dengan pencarian.</EmptyNote>
                            ) : (
                                <ul className="divide-y divide-sd-line overflow-hidden rounded-3xl border border-sd-line bg-white">
                                    {filtered.map((reviewer) => (
                                        <li
                                            key={reviewer.id}
                                            className="grid gap-1 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-baseline sm:gap-6"
                                        >
                                            <p className="break-words font-bold leading-snug">{reviewer.name}</p>
                                            <p className="break-words text-sm text-sd-muted">
                                                {reviewer.institution}
                                                {reviewer.country ? `, ${reviewer.country}` : ''}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>
            </section>
        </LandingLayout>
    );
}
