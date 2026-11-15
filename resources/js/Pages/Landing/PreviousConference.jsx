import { useEffect, useRef, useState } from 'react';
import LandingLayout from '../../Components/landing/LandingLayout';
import { EmptyNote, Mark, SectionHeading } from '../../Components/landing/sections/SectionParts';
import { container, section } from '../../Components/landing/landingStyles';
import { assetUrl, formatDate } from '../../Components/landing/landingUtils';

function ExpandableText({ id, label, text }) {
    const [expanded, setExpanded] = useState(false);
    const [canExpand, setCanExpand] = useState(false);
    const textRef = useRef(null);

    useEffect(() => {
        const element = textRef.current;
        if (!element) return undefined;

        const measure = () => {
            if (!expanded) setCanExpand(element.scrollHeight > element.clientHeight);
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);

        return () => observer.disconnect();
    }, [expanded, text]);

    if (!text) return null;

    return (
        <div className="mt-5">
            <h4 className="text-sm font-bold text-sd-ink">{label}</h4>
            <p
                ref={textRef}
                id={id}
                className={`mt-2 whitespace-pre-line text-sd-muted ${expanded ? '' : 'line-clamp-3'}`}
            >
                {text}
            </p>
            {canExpand && (
                <button
                    type="button"
                    className="mt-2 inline-flex min-h-11 cursor-pointer items-center py-2 text-sm font-bold text-sd-ink underline decoration-sd-gold decoration-2 underline-offset-4 hover:decoration-sd-ink active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink motion-reduce:transition-none"
                    aria-expanded={expanded}
                    aria-controls={id}
                    onClick={() => setExpanded((value) => !value)}
                >
                    {expanded ? 'Tampilkan lebih sedikit' : 'Baca selengkapnya'}
                </button>
            )}
        </div>
    );
}

function PreviousConferenceEdition({ edition, index }) {
    const image = assetUrl(edition.image);
    const bookOfAbstracts = assetUrl(edition.pdf);
    const reverse = index % 2 === 1;

    return (
        <li>
            <article className={`grid gap-8 border-b border-sd-line pb-12 ${image ? 'lg:grid-cols-2 lg:items-center lg:gap-12' : ''}`}>
                {image && (
                    <div className={`min-w-0 ${reverse ? 'lg:order-2' : ''}`}>
                        <img
                            src={image}
                            alt={edition.title}
                            width="960"
                            height="720"
                            loading="lazy"
                            className="aspect-[4/3] w-full rounded-2xl bg-sd-paper object-contain"
                        />
                    </div>
                )}

                <div className={`min-w-0 ${image && reverse ? 'lg:order-1' : ''}`}>
                    <h3 className="text-balance leading-tight text-sd-ink">
                        <span className="block text-[clamp(2.5rem,5vw,4rem)] font-extrabold tabular-nums">{edition.year}</span>
                        <span className="mt-2 block text-2xl font-bold sm:text-3xl">{edition.title}</span>
                    </h3>

                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                        {edition.date && (
                            <div>
                                <dt className="text-sm font-semibold text-sd-muted">Tanggal</dt>
                                <dd className="mt-1 font-semibold text-sd-ink">{formatDate(edition.date) ?? edition.date}</dd>
                            </div>
                        )}
                        {edition.location && (
                            <div>
                                <dt className="text-sm font-semibold text-sd-muted">Lokasi</dt>
                                <dd className="mt-1 break-words font-semibold text-sd-ink">{edition.location}</dd>
                            </div>
                        )}
                    </dl>

                    <ExpandableText id={`previous-description-${edition.id}`} label="Tentang edisi" text={edition.description} />
                    <ExpandableText id={`previous-keynote-${edition.id}`} label="Pembicara utama" text={edition.keynote} />

                    <div className="mt-6 flex flex-wrap gap-3">
                        {bookOfAbstracts && (
                            <a
                                href={bookOfAbstracts}
                                download
                                className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-sd-ink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-sd-ink-soft active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink motion-reduce:transition-none"
                            >
                                Unduh Book of Abstracts
                            </a>
                        )}
                        <a
                            href={`/abstract-download-all-pdf?year=${encodeURIComponent(edition.year)}`}
                            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-sd-ink/20 bg-white px-5 py-2 text-sm font-semibold text-sd-ink transition-colors hover:border-sd-ink hover:bg-sd-paper active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink motion-reduce:transition-none"
                        >
                            Unduh semua abstrak
                        </a>
                    </div>
                    <p className="mt-2 text-sm text-sd-muted">Proses unduh semua abstrak dapat memerlukan waktu.</p>
                </div>
            </article>
        </li>
    );
}

export default function PreviousConference({ layout, prevconferences = [] }) {
    return (
        <LandingLayout layout={layout} title="Seminar Sebelumnya" current="Seminar Sebelumnya">
            <section className={section} aria-labelledby="previous-conference-title">
                <div className={container}>
                    <SectionHeading id="previous-conference-title">
                        <Mark>Seminar</Mark> sebelumnya
                    </SectionHeading>

                    {prevconferences.length === 0 ? (
                        <EmptyNote>Arsip seminar sebelumnya belum tersedia.</EmptyNote>
                    ) : (
                        <ol className="space-y-12">
                            {prevconferences.map((edition, index) => (
                                <PreviousConferenceEdition key={edition.id} edition={edition} index={index} />
                            ))}
                        </ol>
                    )}
                </div>
            </section>
        </LandingLayout>
    );
}
