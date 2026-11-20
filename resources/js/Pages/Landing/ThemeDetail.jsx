import LandingLayout from '../../Components/landing/LandingLayout';
import { container, section } from '../../Components/landing/landingStyles';
import { EmptyNote } from '../../Components/landing/sections/SectionParts';
import { Button } from '../../Components/landing/ui/button';
import { Card } from '../../Components/landing/ui/card';

/*
 * Design Read: editorial detail for seminar authors, using the landing's navy and gold identity.
 * ENERGY 2 / RHYTHM 2 / MOTION 1. The sequence number echoes the abstract list; a wide reading
 * column and separate registration action keep the subtheme content primary.
 */
export default function ThemeDetail({ layout, theme, themeNumber, otherThemes = [] }) {
    const numberLabel = String(themeNumber).padStart(2, '0');

    return (
        <LandingLayout layout={layout} title={theme.title} current="Beranda">
            <section className={`${section} bg-sd-paper`} aria-labelledby="theme-title">
                <div className={container}>
                    <a
                        className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-sd-ink underline decoration-sd-gold decoration-2 underline-offset-4 transition-colors hover:text-sd-gold-ink active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sd-ink motion-reduce:transition-none"
                        href="/#call-for-abstract"
                    >
                        Kembali ke beranda
                    </a>

                    <div className="mt-10 grid min-w-0 gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
                        <div className="min-w-0">
                            <p className="font-bold text-sd-gold-ink">
                                Subtema ke-{themeNumber} <span aria-hidden="true">·</span> {theme.year}
                            </p>
                            <h1
                                id="theme-title"
                                className="mt-4 break-words text-balance text-[clamp(2rem,1.3rem+3.2vw,3.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-sd-ink"
                            >
                                {theme.title}
                            </h1>
                        </div>
                        <p aria-hidden="true" className="text-6xl font-extrabold leading-none tracking-tight text-sd-gold-ink md:text-7xl">
                            {numberLabel}
                        </p>
                    </div>
                </div>
            </section>

            <section className={`${section} bg-white`} aria-labelledby="theme-description-title">
                <div className={`${container} grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(250px,0.42fr)] lg:items-start lg:gap-16`}>
                    <article className="min-w-0">
                        <h2 id="theme-description-title" className="text-2xl font-extrabold leading-tight tracking-tight text-sd-ink">
                            Deskripsi subtema
                        </h2>
                        {theme.description ? (
                            <div
                                className="mt-6 max-w-full overflow-x-auto break-words text-[1.05rem] leading-relaxed text-sd-ink-soft [&_a]:cursor-pointer [&_a]:font-semibold [&_a]:text-sd-ink [&_a]:underline [&_a]:decoration-sd-gold [&_a]:underline-offset-4 [&_a]:active:translate-y-px [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-2 [&_a]:focus-visible:outline-sd-ink [&_a]:hover:text-sd-gold-ink [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-sd-ink [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-sd-ink [&_li+li]:mt-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p+p]:mt-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
                                dangerouslySetInnerHTML={{ __html: theme.description }}
                            />
                        ) : (
                            <div className="mt-6">
                                <EmptyNote>Deskripsi subtema belum tersedia.</EmptyNote>
                            </div>
                        )}
                    </article>

                    <aside className="flex flex-col items-start gap-4 rounded-3xl border border-sd-line bg-sd-paper p-6 sm:p-8">
                        <h2 className="text-xl font-extrabold leading-snug text-sd-ink">Tertarik mengirim abstrak?</h2>
                        <Button asChild variant="accent" size="lg">
                            <a className="cursor-pointer" href="/register">
                                Daftar dan kirim abstrak
                            </a>
                        </Button>
                    </aside>
                </div>
            </section>

            {otherThemes.length > 0 && (
                <section className={`${section} bg-sd-paper`} aria-labelledby="other-themes-title">
                    <div className={container}>
                        <h2 id="other-themes-title" className="mb-8 text-2xl font-extrabold leading-tight tracking-tight text-sd-ink">
                            Subtema lain
                        </h2>
                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {otherThemes.map((otherTheme) => (
                                <li key={otherTheme.id}>
                                    <Card className="h-full transition-colors hover:border-sd-ink active:translate-y-px motion-reduce:transition-none">
                                        <a
                                            className="flex h-full min-h-20 cursor-pointer items-center break-words p-5 font-bold leading-snug text-sd-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink"
                                            href={`/themes/${otherTheme.id}`}
                                        >
                                            {otherTheme.title}
                                        </a>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </LandingLayout>
    );
}
