import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import LandingLayout from '../../Components/landing/LandingLayout';
import { EmptyNote, Mark, SectionHeading } from '../../Components/landing/sections/SectionParts';
import { container, section } from '../../Components/landing/landingStyles';
import { formatDate, parseDate } from '../../Components/landing/landingUtils';
import { Button } from '../../Components/landing/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../Components/landing/ui/tabs';

function formatTime(value) {
    const match = String(value ?? '').match(/^(\d{1,2}):(\d{2})/);
    return match ? `${match[1].padStart(2, '0')}.${match[2]}` : String(value ?? '');
}

function isOngoing(item, date, now) {
    const sessionDate = parseDate(date);
    if (!sessionDate || sessionDate.toDateString() !== now.toDateString()) return false;

    const start = String(item.start_time ?? '').match(/^(\d{1,2}):(\d{2})/);
    const end = String(item.end_time ?? '').match(/^(\d{1,2}):(\d{2})/);
    if (!start || !end) return false;

    const startMinutes = Number(start[1]) * 60 + Number(start[2]);
    const endMinutes = Number(end[1]) * 60 + Number(end[2]);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return startMinutes <= currentMinutes && currentMinutes < endMinutes;
}

function defaultDay(days, now) {
    const today = days.find((day) => parseDate(day.date)?.toDateString() === now.toDateString());
    return String(today?.day ?? days[0]?.day ?? '');
}

function ConferenceSummary({ conference }) {
    if (!conference) return null;

    const details = [
        conference.title && { label: 'Acara', value: conference.title },
        conference.theme && { label: 'Tema', value: conference.theme },
        conference.hosted && { label: 'Tuan rumah', value: conference.hosted },
        conference.university && { label: 'Universitas', value: conference.university },
        conference.date && { label: 'Tanggal', value: formatDate(conference.date) ?? conference.date },
    ].filter(Boolean);

    if (details.length === 0) return null;

    return (
        <dl className="mb-12 grid gap-x-8 gap-y-5 border-y border-sd-line py-6 sm:grid-cols-2 lg:grid-cols-4">
            {details.map(({ label, value }) => (
                <div key={label} className="min-w-0">
                    <dt className="text-sm font-semibold text-sd-muted">{label}</dt>
                    <dd className="mt-1 break-words font-bold leading-snug text-sd-ink">{value}</dd>
                </div>
            ))}
        </dl>
    );
}

function DaySchedule({ day, now }) {
    return (
        <ol className="divide-y divide-sd-line border-y border-sd-line">
            {day.items.map((item) => {
                const ongoing = isOngoing(item, day.date, now);
                return (
                    <li key={item.id} className="grid gap-2 py-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
                        <time
                            className="font-semibold tabular-nums text-sd-ink"
                            dateTime={`${day.date}T${item.start_time}`}
                        >
                            {formatTime(item.start_time)}–{formatTime(item.end_time)}
                        </time>
                        <div className="min-w-0">
                            <h3 className="break-words text-lg font-bold leading-snug text-sd-ink">{item.program_name}</h3>
                            {item.pic && item.pic !== '-' && (
                                <p className="mt-1 break-words text-sm text-sd-muted">PIC: {item.pic}</p>
                            )}
                            {ongoing && (
                                <p className="mt-3 inline-flex min-h-11 items-center border-l-4 border-sd-gold bg-sd-paper px-3 font-semibold text-sd-ink">
                                    Sedang berlangsung
                                </p>
                            )}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

export default function Program({ layout, conference, days = [], years = [], selectedYear }) {
    const [now, setNow] = useState(() => new Date());
    const [activeDay, setActiveDay] = useState(() => defaultDay(days, new Date()));

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 30_000);
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        setActiveDay(defaultDay(days, new Date()));
    }, [days, selectedYear]);

    const currentDay = days.find((day) => String(day.day) === activeDay) ?? days[0];

    return (
        <LandingLayout layout={layout} title="Program Acara" current="Program" routeYear={selectedYear}>
            <section className={section} aria-labelledby="program-title">
                <div className={container}>
                    <SectionHeading
                        id="program-title"
                        intro={selectedYear ? `Susunan acara Seminar DAMPAK tahun ${selectedYear}.` : undefined}
                    >
                        Program <Mark>acara</Mark>
                    </SectionHeading>

                    {years.length > 0 && (
                        <nav className="mb-8 flex flex-wrap gap-2" aria-label="Pilih tahun program">
                            {years.map((year) => {
                                const active = Number(year) === Number(selectedYear);
                                return (
                                    <Button key={year} asChild variant={active ? 'default' : 'outline'}>
                                        <Link
                                            href={`/conference-program/${year}`}
                                            aria-current={active ? 'page' : undefined}
                                            preserveScroll
                                        >
                                            {year}
                                        </Link>
                                    </Button>
                                );
                            })}
                        </nav>
                    )}

                    <ConferenceSummary conference={conference} />

                    {days.length === 0 ? (
                        <EmptyNote>Susunan acara tahun ini belum tersedia.</EmptyNote>
                    ) : (
                        <div>
                            <h2 className="mb-4 text-xl font-extrabold tracking-tight text-sd-ink">Jadwal per hari</h2>
                            <Tabs value={String(currentDay?.day ?? '')} onValueChange={setActiveDay}>
                                <TabsList aria-label="Pilih hari program">
                                    {days.map((day) => (
                                        <TabsTrigger key={day.day} value={String(day.day)}>
                                            <span>Hari {day.day}</span>
                                            <span className="mx-1.5 text-current" aria-hidden="true">·</span>
                                            <span>{formatDate(day.date) ?? day.date}</span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {days.map((day) => (
                                    <TabsContent key={day.day} value={String(day.day)}>
                                        <DaySchedule day={day} now={now} />
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>
                    )}
                </div>
            </section>
        </LandingLayout>
    );
}
