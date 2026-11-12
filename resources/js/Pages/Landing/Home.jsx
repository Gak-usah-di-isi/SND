import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import LandingHeader from '../../Components/landing/LandingHeader';
import LandingFooter from '../../Components/landing/LandingFooter';
import SdgRibbon from '../../Components/landing/SdgRibbon';
import { assetUrl, displayPhone, formatDate, initials, parseDate, waLink } from '../../Components/landing/landingUtils';
import { container, h2, lead, section } from '../../Components/landing/landingStyles';
import { Button } from '../../Components/landing/ui/button';
import { Badge } from '../../Components/landing/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../Components/landing/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../Components/landing/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '../../Components/landing/ui/avatar';
import { Input, Label, Textarea } from '../../Components/landing/ui/form';
import { cn } from '../../lib/utils';
import { landingDummy } from '../../data/landingDummy';

/*
 * Beranda Seminar DAMPAK, dibangun dengan shadcn/ui (Components/landing/ui).
 * Urutan section dan field data mengikuti beranda ICASVE / editor landing:
 * Hero, About, SDGs (pengganti Objectives), Pembicara, Call for Abstract,
 * Tanggal penting + Poster, Lokasi, Penyelenggara, FAQ, Kontak.
 *
 * Arah desain: bersih dan lapang. Latar putih dan krem bergantian, tinta navy,
 * emas hanya untuk aksen. Motif identitas: pita 17 warna SDGs (Sdg.color) di
 * hero dan footer, plus stabilo emas di satu kata per judul.
 */

function buildRoutes(year) {
    return {
        home: year ? `/${year}` : '/',
        contact: '/contact',
        login: '/login',
        register: '/register',
    };
}

// Menu selain Beranda dan Kontak belum dibuka (disabled -> href="#").
function buildNav(r) {
    return [
        { label: 'Beranda', href: r.home, current: true },
        {
            label: 'Komite',
            children: [
                { label: 'Komite Pengarah', disabled: true },
                { label: 'Komite Reviewer', disabled: true },
                { label: 'Panitia Pelaksana', disabled: true },
            ],
        },
        {
            label: 'Submisi',
            children: [
                { label: 'Panduan Abstrak', disabled: true },
                { label: 'Panduan Presentasi', disabled: true },
            ],
        },
        { label: 'Galeri', disabled: true },
        { label: 'Program', disabled: true },
        { label: 'Arsip', disabled: true },
        { label: 'Seminar Sebelumnya', disabled: true },
        { label: 'FAQ', disabled: true },
        { label: 'Kontak', href: r.contact },
    ];
}

function Mark({ children }) {
    return <mark className="sd-mark">{children}</mark>;
}

function SectionHeading({ id, children, intro, center = false }) {
    return (
        <div className={center ? 'mx-auto mb-12 max-w-[720px] text-center' : 'mb-12 max-w-[720px]'}>
            <h2 id={id} className={h2}>
                {children}
            </h2>
            {intro && <p className={`${lead} mt-4 ${center ? 'mx-auto' : ''}`}>{intro}</p>}
        </div>
    );
}

function EmptyNote({ children }) {
    return <p className="rounded-3xl border border-dashed border-sd-line bg-white p-6 text-sd-muted">{children}</p>;
}

/* ---------------------------------------------------------------- Hero */

// Foto latar hero (Gedung Laboratorium Vokasi UB). Ganti file ini bila ada foto acara yang lebih baru.
const HERO_IMAGE = '/images/Lab.jpeg';

function Hero({ title, abbreviation, year, routes, sdgs }) {
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

/* --------------------------------------------------------------- About */

function About({ about }) {
    if (!about) return null;
    const image = assetUrl(about.image);
    return (
        <section id="tentang" className={section} aria-labelledby="about-title">
            <div className={`${container} grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20`}>
                <div>
                    <h2 id="about-title" className={`${h2} mb-6`}>
                        {about.title}
                    </h2>
                    {/* About.content berasal dari RichTextEditor di editor landing (HTML). */}
                    <div className="text-[1.05rem] leading-relaxed text-sd-ink-soft [&_p+p]:mt-4" dangerouslySetInnerHTML={{ __html: about.content }} />
                </div>
                {image && (
                    <img className="aspect-[4/3] w-full rounded-[28px] object-cover" src={image} alt={about.title} width="981" height="737" loading="lazy" />
                )}
            </div>
        </section>
    );
}

/* ---------------------------------------------------------------- SDGs */

function Sdgs({ sdgs }) {
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

/* ------------------------------------------------------------ Speakers */

// Foto bulat. Bila Speaker.image kosong atau gagal dimuat, tampil inisial.
function SpeakerPhoto({ person, className, fallbackClassName }) {
    return (
        <Avatar className={className}>
            {person.image && <AvatarImage src={assetUrl(person.image)} alt={person.name} className="object-top" />}
            <AvatarFallback className={cn('font-extrabold tracking-tight', fallbackClassName)} aria-hidden="true">
                {initials(person.name)}
            </AvatarFallback>
        </Avatar>
    );
}

// Kartu di bagan; pembicara utama dan tamu memakai ukuran yang sama agar foto sama jelas.
// Di bawah 1024px foto di kiri, sehingga cabang garis (--sd-tick: 80px) jatuh tepat di tengah foto.
function SpeakerNode({ speaker: s, keynote = false }) {
    return (
        <Card className="flex w-full max-w-[340px] items-start gap-4 p-6 lg:flex-col lg:items-center lg:text-center">
            <SpeakerPhoto
                person={s}
                className="size-20 lg:size-24"
                fallbackClassName={keynote ? 'bg-sd-ink text-2xl text-sd-gold' : 'bg-sd-paper-deep text-2xl text-sd-ink'}
            />
            <div className="min-w-0">
                {keynote && <p className="text-xs font-bold text-sd-gold-ink">Pembicara utama</p>}
                {keynote ? (
                    <h3 className="mt-1 text-lg font-extrabold leading-snug tracking-tight">{s.name}</h3>
                ) : (
                    <h4 className="text-lg font-extrabold leading-snug tracking-tight">{s.name}</h4>
                )}
                <p className="mt-1 text-sm text-sd-muted">
                    {s.institution}
                    {s.country ? `, ${s.country}` : ''}
                </p>
                {s.session_topic && <p className="mt-3 border-t border-sd-line pt-3 text-sm font-semibold">{s.session_topic}</p>}
                {s.await_confirmation && (
                    <Badge variant="muted" className="mt-3">
                        Menunggu konfirmasi
                    </Badge>
                )}
            </div>
        </Card>
    );
}

// Node induk dan label kelompok di bagan (pil), sejajar kiri di bawah 1024px dan di tengah di desktop.
function TreeLabel({ as: Tag = 'p', dark = false, children }) {
    return (
        <div className="flex justify-start lg:justify-center">
            <Tag
                className={cn(
                    'rounded-full px-5 py-2.5 text-sm font-bold',
                    dark ? 'bg-sd-ink text-white' : 'border border-sd-line bg-sd-paper text-sd-ink',
                )}
            >
                {children}
            </Tag>
        </div>
    );
}

// Bagan pembicara bergaya struktur organisasi: seminar -> pembicara utama -> pembicara tamu.
function Speakers({ keynote, invited, abbreviation, year }) {
    if (!keynote?.length && !invited?.length) return null;
    return (
        <section id="pembicara" className={section} aria-labelledby="speakers-title">
            <div className={container}>
                <SectionHeading id="speakers-title" center>
                    <Mark>Pembicara</Mark> seminar
                </SectionHeading>

                <div className="sd-tree">
                    <TreeLabel dark>
                        {abbreviation} {year}
                    </TreeLabel>

                    {keynote?.length > 0 && (
                        <ul className={cn('sd-tree-row', invited?.length > 0 && 'sd-tree-row--continue')} style={{ '--sd-tick': '80px' }} aria-label="Pembicara utama">
                            {keynote.map((s) => (
                                <li key={s.id}>
                                    <SpeakerNode speaker={s} keynote />
                                </li>
                            ))}
                        </ul>
                    )}

                    {invited?.length > 0 && (
                        <>
                            {keynote?.length > 0 && (
                                // Desktop: garis dari bawah tiap kartu pembicara utama menyatu ke label di bawah.
                                <div className="sd-tree-join" aria-hidden="true">
                                    {keynote.map((s) => (
                                        <span key={s.id} />
                                    ))}
                                </div>
                            )}
                            {/* HP (atau tanpa pembicara utama): batang lurus ke label. */}
                            <div className={cn('sd-tree-stem', keynote?.length > 0 && 'lg:hidden')} aria-hidden="true" />
                            <TreeLabel as="h3">Pembicara tamu</TreeLabel>
                            <ul className="sd-tree-row" style={{ '--sd-tick': '80px' }} aria-label="Pembicara tamu">
                                {invited.map((s) => (
                                    <li key={s.id}>
                                        <SpeakerNode speaker={s} />
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ---------------------------------------------------- Call for Abstract */

function Themes({ themes, linkable }) {
    if (!themes?.length) return null;
    return (
        <section id="call-for-abstract" className={`${section} bg-sd-paper`} aria-labelledby="themes-title">
            <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16`}>
                <div className="lg:sticky lg:top-28 lg:self-start">
                    <h2 id="themes-title" className={h2}>
                        Call for <Mark>Abstract</Mark>
                    </h2>
                    <p className={`${lead} mt-4`}>Topik yang dapat diajukan meliputi, namun tidak terbatas pada:</p>
                </div>
                <ol className="grid gap-3">
                    {themes.map((t, i) => {
                        const body = (
                            <>
                                <span className="text-3xl font-extrabold leading-none tracking-tight text-sd-gold-ink tabular-nums" aria-hidden="true">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className="text-lg font-bold leading-snug">{t.title}</span>
                            </>
                        );
                        return (
                            <li key={t.id}>
                                {/* Detail subtema ada di /themes/{id}; dimatikan selama memakai data contoh. */}
                                {linkable ? (
                                    <a
                                        className="flex items-center gap-6 rounded-3xl border border-sd-line bg-white px-6 py-5 transition-colors hover:border-sd-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink motion-reduce:transition-none"
                                        href={`/themes/${t.id}`}
                                    >
                                        {body}
                                    </a>
                                ) : (
                                    <Card className="flex items-center gap-6 px-6 py-5">{body}</Card>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}

/* ---------------------------------------------- Tanggal penting (jalur) */

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

function Timeline({ dates, posters }) {
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

/* --------------------------------------------------------------- Venue */

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

function Venue({ venues }) {
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

/* --------------------------------------------------------------- Hosts */

function Hosts({ groups }) {
    const visible = groups.filter((g) => g.items?.length);
    if (!visible.length) return null;
    return (
        <section className="py-16" aria-label="Penyelenggara dan pendukung">
            <div className={`${container} flex flex-wrap items-center justify-center gap-x-20 gap-y-10`}>
                {visible.map((g) => (
                    <div key={g.label} className="flex flex-col items-center gap-4">
                        <p className="text-sm font-semibold text-sd-muted">{g.label}</p>
                        <ul className="flex flex-wrap items-center justify-center gap-8">
                            {g.items.map((item) => (
                                <li key={item.id}>
                                    <img className="h-16 w-auto object-contain" src={assetUrl(item.image_path)} alt={`Logo ${g.label.toLowerCase()}`} height="64" width="120" loading="lazy" />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ----------------------------------------------------------------- FAQ */

function Faq({ faqs }) {
    if (!faqs?.length) return null;
    return (
        <section id="faq" className={`${section} border-t border-sd-line`} aria-labelledby="faq-title">
            <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16`}>
                <h2 id="faq-title" className={h2}>
                    Pertanyaan yang <Mark>sering</Mark> diajukan
                </h2>
                <Accordion type="single" collapsible className="border-t border-sd-line">
                    {faqs.map((f) => (
                        <AccordionItem key={f.id} value={String(f.id)}>
                            <AccordionTrigger>{f.title}</AccordionTrigger>
                            <AccordionContent>
                                <div className="[&_p+p]:mt-3" dangerouslySetInnerHTML={{ __html: f.description }} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------- Contact */

// Seperti ICASVE: pesan dikirim lewat aplikasi email pengunjung (mailto ke Contact.email).
function ContactForm({ email }) {
    const [sent, setSent] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const subject = `Kontak Seminar DAMPAK - ${f.get('name')}`;
        const body = `Nama: ${f.get('name')}\nEmail: ${f.get('email')}\nPerihal: ${f.get('subject')}\n\n${f.get('message')}`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
    };

    return (
        <Card>
            <CardHeader className="p-7 pb-2 lg:p-9 lg:pb-2">
                <CardTitle className="text-xl">Kirim pesan</CardTitle>
                <CardDescription>Pesan dikirim melalui aplikasi email Anda.</CardDescription>
            </CardHeader>
            <CardContent className="p-7 pt-4 lg:p-9 lg:pt-4">
                <form className="grid gap-5 sm:grid-cols-2" onSubmit={onSubmit}>
                    <Label>
                        Nama
                        <Input name="name" autoComplete="name" placeholder="Nama lengkap" required />
                    </Label>
                    <Label>
                        Email
                        <Input name="email" type="email" autoComplete="email" placeholder="email@contoh.com" required />
                    </Label>
                    <Label className="sm:col-span-2">
                        Perihal
                        <Input name="subject" placeholder="Perihal pesan" required />
                    </Label>
                    <Label className="sm:col-span-2">
                        Pesan
                        <Textarea name="message" rows={5} placeholder="Tulis pesan Anda" required />
                    </Label>
                    <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                        <Button type="submit" size="lg">
                            <Icon icon="solar:plain-2-bold" className="size-5" aria-hidden="true" />
                            Kirim pesan
                        </Button>
                        <p className="text-sm text-sd-muted" role="status">
                            {sent ? 'Aplikasi email Anda terbuka dengan pesan yang sudah terisi. Kirim dari sana.' : ''}
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

// Ikon Solar (set yang sama dengan dasbor); WhatsApp memakai logo mereknya karena Solar tidak punya.
function ContactItem({ icon, label, children }) {
    return (
        <li className="flex items-start gap-4 border-b border-sd-line py-5 first:pt-0 last:border-b-0">
            <Icon icon={icon} className="mt-0.5 size-6 shrink-0 text-sd-gold-ink" aria-hidden="true" />
            <div className="min-w-0">
                <p className="text-sm text-sd-muted">{label}</p>
                <div className="mt-0.5 text-lg font-semibold leading-snug [overflow-wrap:anywhere]">{children}</div>
            </div>
        </li>
    );
}

function Contact({ contact }) {
    if (!contact) return null;
    const people = [
        { name: contact.phone1_name, phone: contact.phone1 },
        { name: contact.phone2_name, phone: contact.phone2 },
    ].filter((p) => p.phone);
    const linkClass =
        'inline-flex min-h-11 items-center underline decoration-sd-line decoration-2 underline-offset-4 transition-colors hover:text-sd-gold-ink hover:decoration-sd-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink motion-reduce:transition-none';

    return (
        <section id="kontak" className={`${section} bg-sd-paper`} aria-labelledby="contact-title">
            <div className={`${container} grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}>
                <div>
                    <h2 id="contact-title" className={`${h2} mb-8`}>
                        Hubungi <Mark>panitia</Mark>
                    </h2>
                    <ul>
                        {contact.address && (
                            <ContactItem icon="solar:map-point-bold" label="Alamat">
                                {contact.address}
                            </ContactItem>
                        )}
                        {people.map((p) => (
                            <ContactItem key={p.phone} icon="ic:baseline-whatsapp" label={`WhatsApp${p.name ? `, ${p.name}` : ''}`}>
                                <a className={linkClass} href={waLink(p.phone)} target="_blank" rel="noopener noreferrer">
                                    {displayPhone(p.phone)}
                                    <span className="sr-only"> (WhatsApp, tab baru)</span>
                                </a>
                            </ContactItem>
                        ))}
                        {contact.email && (
                            <ContactItem icon="solar:letter-bold" label="Email">
                                <a className={linkClass} href={`mailto:${contact.email}`}>
                                    {contact.email}
                                </a>
                            </ContactItem>
                        )}
                    </ul>
                </div>
                {contact.email && <ContactForm email={contact.email} />}
            </div>
        </section>
    );
}

/* ---------------------------------------------------------------- Page */

export default function Home(props) {
    // Selama controller belum mengirim data, halaman memakai data contoh.
    const isDummy = !props.conference_title;
    const data = isDummy ? { ...landingDummy, ...props } : props;

    const year = data.activeYear?.year ?? new Date().getFullYear();
    const abbreviation = data.conference_abbreviation ?? landingDummy.conference_abbreviation;
    const routes = buildRoutes(props.routeYear ?? null);

    return (
        <div className="min-h-screen overflow-x-clip bg-white text-base leading-relaxed text-sd-ink antialiased">
            <Head title="Seminar Dampak">
                <meta name="description" content={`${abbreviation} ${year}: ${data.conference_title?.title ?? ''}. BPPM Fakultas Vokasi Universitas Brawijaya.`} />
            </Head>

            <a
                className="sr-only rounded-full bg-sd-ink px-5 py-2.5 font-semibold !text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-gold"
                href="#konten"
            >
                Lewati ke konten
            </a>

            <LandingHeader nav={buildNav(routes)} brand={{ href: routes.home, logo: data.logo, alt: `${abbreviation} ${year}, Universitas Brawijaya` }} actions={{ login: routes.login }} />

            <main id="konten" className="scroll-mt-24">
                <Hero title={data.conference_title} abbreviation={abbreviation} year={year} routes={routes} sdgs={data.sdgs} />
                <About about={data.about} />
                <Sdgs sdgs={data.sdgs} />
                <Speakers keynote={data.keynoteSpeakers} invited={data.invitedSpeakers} abbreviation={abbreviation} year={year} />
                <Themes themes={data.themes} linkable={!isDummy} />
                <Timeline dates={data.deadline_date} posters={data.posters} />
                <Venue venues={data.venues} />
                <Hosts
                    groups={[
                        { label: 'Penyelenggara', items: data.hosted_by },
                        { label: 'Mitra penyelenggara', items: data.co_hosted_by },
                        { label: 'Didukung oleh', items: data.supported_by },
                    ]}
                />
                <Faq faqs={data.faqs} />
                <Contact contact={data.contacts?.[0] ?? null} />
            </main>

            <LandingFooter name={abbreviation} year={year} sdgs={data.sdgs} />
        </div>
    );
}
