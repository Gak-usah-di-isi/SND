import { assetUrl, formatDate, parseDate } from '../landingUtils';
import { container, section } from '../landingStyles';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { EmptyNote, Mark, SectionHeading } from './SectionParts';

// Data: DeadlineDate (id, name, date Y-m-d) dan Poster (image, link).

// Sama seperti ICASVE: nama tenggat yang sama dikelompokkan, tanggal lama dicoret.
function groupDeadlines(dates = []) {
    const groups = new Map();
    dates.forEach((d) => {
        const key = String(d.name ?? '').trim().toLowerCase();
        if (!groups.has(key)) groups.set(key, { name: d.name, items: [] });
        groups.get(key).items.push(d);
    });
    return [...groups.values()]
        .map((g) => ({ ...g, items: g.items.sort((a, b) => parseDate(a.date) - parseDate(b.date)) }))
        .sort((a, b) => parseDate(a.items[0].date) - parseDate(b.items[0].date));
}

export default function Timeline({ dates, posters }) {
    const groups = groupDeadlines(dates);
    const poster = posters?.[0] ?? null;
    const posterSrc = poster ? assetUrl(poster.image) : null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Titik "berikutnya" = kelompok pertama yang tanggal akhirnya belum lewat.
    const nextIndex = groups.findIndex((g) => parseDate(g.items[g.items.length - 1].date) >= today);

    return (
        <section id="tanggal-penting" className={section} aria-labelledby="timeline-title">
            <div className={container}>
                <SectionHeading id="timeline-title" center>
                    <Mark>Tanggal</Mark> penting
                </SectionHeading>

                <div className={posterSrc ? 'grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16' : ''}>
                    {groups.length ? (
                        <ol className="relative mx-auto w-full max-w-[880px]">
                            {groups.map((g, i) => {
                                const last = g.items[g.items.length - 1];
                                const past = nextIndex === -1 || i < nextIndex;
                                const isNext = i === nextIndex;
                                const right = i % 2 === 1;
                                return (
                                    <li key={g.name} className="relative grid pb-10 pl-10 last:pb-0 md:grid-cols-2 md:gap-14 md:pl-0">
                                        {/*
                                          Segmen jalur: dari pusat titik ini (10px) sampai pusat titik berikutnya
                                          (10px di bawah awal item berikutnya). Item terakhir tidak punya segmen.
                                          Di desktop jalur di tengah dan item bergantian kiri-kanan.
                                        */}
                                        {i < groups.length - 1 && (
                                            <span
                                                className="absolute -bottom-[10px] left-[11px] top-[10px] w-0.5 bg-sd-line md:left-1/2 md:-translate-x-1/2"
                                                aria-hidden="true"
                                            />
                                        )}
                                        {/* Titik 24px dengan pusat di 10px = tengah baris tanggal (leading 20px). */}
                                        <span
                                            className={`absolute -top-[2px] left-0 size-6 rounded-full border-[3px] md:left-1/2 md:-translate-x-1/2 ${
                                                isNext ? 'border-sd-gold bg-sd-ink ring-4 ring-sd-gold/30' : past ? 'border-white bg-sd-line' : 'border-sd-ink bg-white'
                                            }`}
                                            aria-hidden="true"
                                        />
                                        <div className={right ? 'md:col-start-2' : 'md:text-right'}>
                                            <p className={`text-sm font-bold leading-5 ${past ? 'text-sd-muted' : 'text-sd-ink'}`}>
                                                {g.items.slice(0, -1).map((item) => (
                                                    <s key={item.id} className="mr-2 font-semibold text-sd-muted">
                                                        <span className="sr-only">Diperpanjang dari </span>
                                                        {formatDate(item.date)}
                                                    </s>
                                                ))}
                                                <time dateTime={last.date}>{formatDate(last.date)}</time>
                                            </p>
                                            <h3 className={`mt-1 text-xl font-extrabold leading-snug tracking-tight ${past ? 'text-sd-muted' : ''}`}>{g.name}</h3>
                                            {isNext && (
                                                <Badge variant="accent" className="mt-2">
                                                    Berikutnya
                                                </Badge>
                                            )}
                                            {past && <span className="sr-only"> (sudah lewat)</span>}
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    ) : (
                        <EmptyNote>Jadwal belum diumumkan.</EmptyNote>
                    )}

                    {posterSrc && (
                        <figure className="self-start">
                            <img className="w-full rounded-3xl border border-sd-line" src={posterSrc} alt="Poster seminar" width="720" height="1018" loading="lazy" />
                            <Button asChild variant="outline" size="lg" className="mt-5 w-full">
                                <a href={poster.link || posterSrc} target="_blank" rel="noopener noreferrer">
                                    Unduh leaflet
                                    <span className="sr-only"> (tab baru)</span>
                                </a>
                            </Button>
                        </figure>
                    )}
                </div>
            </div>
        </section>
    );
}
