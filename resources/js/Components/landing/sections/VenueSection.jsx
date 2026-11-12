import { Icon } from '@iconify/react';
import { cn } from '../../../lib/utils';
import { assetUrl, formatDate } from '../landingUtils';
import { container, section } from '../landingStyles';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Mark, SectionHeading } from './SectionParts';

// Data: Venue (image_path, venue_name, address, date, link_map, map, conference_mode, onsite_programme, online_programme).

// Isi kartu info lokasi: nama dan alamat, ringkasan Tanggal/Format, program Luring/Daring, tombol peta.
function VenueInfo({ venue: v }) {
    const programmes = [
        ['Luring', v.onsite_programme],
        ['Daring', v.online_programme],
    ].filter(([, value]) => value);

    return (
        <Card className="flex h-full flex-col gap-6 p-6 sm:p-8">
            <div>
                <h3 className="text-2xl font-extrabold leading-tight tracking-tight">{v.venue_name}</h3>
                {v.address && <p className="mt-2 text-sm leading-relaxed text-sd-muted">{v.address}</p>}
            </div>

            {(v.date || v.conference_mode) && (
                <dl className="grid grid-cols-2 gap-3">
                    {v.date && (
                        <div className="rounded-2xl bg-sd-paper p-4">
                            <dt className="text-xs font-semibold text-sd-muted">Tanggal</dt>
                            <dd className="mt-1 font-bold leading-snug">{formatDate(v.date) ?? v.date}</dd>
                        </div>
                    )}
                    {v.conference_mode && (
                        <div className="rounded-2xl bg-sd-paper p-4">
                            <dt className="text-xs font-semibold text-sd-muted">Format</dt>
                            <dd className="mt-1 font-bold leading-snug">{v.conference_mode}</dd>
                        </div>
                    )}
                </dl>
            )}

            {programmes.length > 0 && (
                <dl className="grid divide-y divide-sd-line border-y border-sd-line">
                    {programmes.map(([label, value]) => (
                        <div key={label} className="grid grid-cols-[4.5rem_1fr] gap-3 py-3">
                            <dt className="text-sm font-bold text-sd-gold-ink">{label}</dt>
                            <dd className="text-sm leading-relaxed text-sd-ink-soft">{value}</dd>
                        </div>
                    ))}
                </dl>
            )}

            {v.link_map && (
                <Button asChild className="w-full sm:w-fit">
                    <a href={v.link_map} target="_blank" rel="noopener noreferrer">
                        <Icon icon="solar:map-point-bold" className="size-5" aria-hidden="true" />
                        Buka di Google Maps
                        <span className="sr-only"> (tab baru)</span>
                    </a>
                </Button>
            )}
        </Card>
    );
}

export default function Venue({ venues }) {
    if (!venues?.length) return null;
    return (
        <section id="lokasi" className={`${section} bg-sd-paper`} aria-labelledby="venue-title">
            <div className={container}>
                <SectionHeading id="venue-title">
                    <Mark>Lokasi</Mark> seminar
                </SectionHeading>
                <div className="grid gap-10">
                    {venues.map((v) => {
                        const image = assetUrl(v.image_path);
                        return (
                            <article key={v.id} className="grid gap-5">
                                <div className={cn('grid gap-5', image && 'lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]')}>
                                    <VenueInfo venue={v} />
                                    {image && (
                                        <img
                                            className="h-full min-h-[260px] w-full rounded-3xl object-cover"
                                            src={image}
                                            alt={v.venue_name}
                                            width="640"
                                            height="480"
                                            loading="lazy"
                                        />
                                    )}
                                </div>
                                {/* Venue.map berisi kode embed iframe dari editor landing. */}
                                {v.map && (
                                    <div
                                        className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-sd-line bg-white sm:aspect-[21/8] [&_iframe]:block [&_iframe]:size-full [&_iframe]:border-0"
                                        dangerouslySetInnerHTML={{ __html: v.map }}
                                    />
                                )}
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
