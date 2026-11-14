import { cn } from '../../../lib/utils';
import { assetUrl, initials } from '../landingUtils';
import { container, section } from '../landingStyles';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Mark, SectionHeading } from './SectionParts';

// Data: Speaker role keynote_speaker / invited_speaker (name, institution, image, country, session_topic, await_confirmation).
// Garis bagan: kelas .sd-tree di resources/css/template.css.

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
export default function Speakers({ keynote, invited, abbreviation, year }) {
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
