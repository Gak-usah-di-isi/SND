import { container, h2, lead, section } from '../landingStyles';
import { Card } from '../ui/card';
import { Mark } from './SectionParts';

// Data: Theme (id, title). Link ke /themes/{id} aktif bila linkable.

export default function Themes({ themes, linkable }) {
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
