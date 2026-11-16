
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import LandingLayout from '../../Components/landing/LandingLayout';
import { EmptyNote, Mark, SectionHeading } from '../../Components/landing/sections/SectionParts';
import { container, section } from '../../Components/landing/landingStyles';
import { Button } from '../../Components/landing/ui/button';

function renderAuthors(authors = '') {
    return String(authors).split(/(\[\d+\])/g).map((part, index) => {
        const match = part.match(/^\[(\d+)\]$/);

        return match
            ? <sup key={index}>{match[1]}</sup>
            : <span key={index}>{part}</span>;
    });
}

export default function Archives({
    layout,
    years = [],
    selectedYear,
    search = '',
    abstracts = {},
}) {
    const [searchTerm, setSearchTerm] = useState(search);

    const items = abstracts.data ?? [];
    const currentPage = abstracts.current_page ?? 1;
    const lastPage = abstracts.last_page ?? 1;

    function handleSearch(event) {
        event.preventDefault();

        router.get(
            selectedYear ? `/archives/${selectedYear}` : '/archives',
            { search: searchTerm.trim() || undefined },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }

    return (
        <LandingLayout layout={layout} title="Arsip" current="Arsip">
            <section className={section} aria-labelledby="archives-title">
                <div className={container}>
                    <SectionHeading
                        id="archives-title"
                        intro={
                            selectedYear
                                ? `Kumpulan abstrak yang telah diterima pada tahun ${selectedYear}.`
                                : 'Kumpulan abstrak seminar yang telah diterima.'
                        }
                    >
                        <Mark>Arsip</Mark> abstrak
                    </SectionHeading>

                    {years.length > 0 && (
                        <div className="mb-8 flex flex-wrap gap-2" aria-label="Pilih tahun arsip">
                            {years.map((itemYear) => {
                                const active = Number(itemYear) === Number(selectedYear);

                                return (
                                    <Button key={itemYear} asChild variant={active ? 'default' : 'outline'}>
                                        <Link
                                            href={`/archives/${itemYear}`}
                                            aria-current={active ? 'page' : undefined}
                                            preserveScroll
                                        >
                                            {itemYear}
                                        </Link>
                                    </Button>
                                );
                            })}
                        </div>
                    )}

                    <form onSubmit={handleSearch} className="mb-8 flex flex-col gap-3 sm:flex-row">
                        <label htmlFor="archive-search" className="sr-only">
                            Cari judul atau nama penulis abstrak
                        </label>
                        <input
                            id="archive-search"
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Cari judul atau nama penulis..."
                            className="h-11 min-w-0 flex-1 rounded-full border border-sd-line bg-white px-5 text-sm text-sd-ink placeholder:text-sd-muted focus:border-sd-ink focus:outline-none focus:ring-2 focus:ring-sd-ink/10"
                        />
                        <Button type="submit">Cari abstrak</Button>
                    </form>

                    {items.length === 0 ? (
                        <EmptyNote>Belum ada abstrak yang diterima pada tahun ini.</EmptyNote>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {items.map((abstract) => (
                                    <article
                                        key={abstract.id}
                                        className="rounded-2xl border border-sd-line bg-white p-5 shadow-sm sm:p-6"
                                    >
                                        <h3 className="text-base font-semibold leading-relaxed text-sd-ink sm:text-lg">
                                            {abstract.title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-relaxed text-sd-muted">
                                            {renderAuthors(abstract.authors)}
                                        </p>

                                        {abstract.presentation_type && (
                                            <span className="mt-4 inline-flex rounded-full bg-sd-paper px-3 py-1 text-xs font-semibold text-sd-ink">
                                                {abstract.presentation_type}
                                            </span>
                                        )}

                                        <div className="mt-5">
                                            <a
                                                href={`/download-abstract/${abstract.id}`}
                                                className="inline-flex min-h-10 items-center justify-center rounded-full bg-sd-ink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-sd-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink motion-reduce:transition-none"
                                            >
                                                Unduh PDF
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <p className="text-sm text-sd-muted">
                                    Halaman {currentPage} dari {lastPage}
                                    {abstracts.total !== undefined && ` · ${abstracts.total} abstrak`}
                                </p>

                                <div className="flex gap-2">
                                    {abstracts.prev_page_url && (
                                        <Button asChild variant="outline">
                                            <Link href={abstracts.prev_page_url} preserveScroll>
                                                Sebelumnya
                                            </Link>
                                        </Button>
                                    )}

                                    {abstracts.next_page_url && (
                                        <Button asChild variant="outline">
                                            <Link href={abstracts.next_page_url} preserveScroll>
                                                Berikutnya
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </LandingLayout>
    );
}
