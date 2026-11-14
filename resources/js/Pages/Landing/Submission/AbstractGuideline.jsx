import LandingLayout from '../../../Components/landing/LandingLayout';
import { EmptyNote, Mark, SectionHeading } from '../../../Components/landing/sections/SectionParts';
import { Button } from '../../../Components/landing/ui/button';
import { assetUrl } from '../../../Components/landing/landingUtils';
import { container, section } from '../../../Components/landing/landingStyles';

export default function AbstractGuideline({ layout, guideline, selectedYear }) {
    const pdfUrl = assetUrl(guideline?.pdf_file);

    return (
        <LandingLayout layout={layout} title="Panduan Abstrak" current="Panduan Abstrak">
            <section className={section} aria-labelledby="abstract-guideline-title">
                <div className={container}>
                    <SectionHeading
                        id="abstract-guideline-title"
                        intro={selectedYear ? `Panduan penulisan abstrak untuk tahun ${selectedYear}.` : undefined}
                    >
                        Panduan <Mark>Abstrak</Mark>
                    </SectionHeading>

                    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
                        <article aria-label="Isi panduan abstrak" className="min-w-0">
                            {guideline?.content ? (
                                <div
                                    className="min-w-0 overflow-x-auto rounded-2xl border border-sd-line bg-white p-5 leading-relaxed text-sd-ink-soft sm:p-8 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-sd-ink [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-sd-ink [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-sd-ink [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li+li]:mt-2 [&_p+p]:mt-4 [&_strong]:font-bold [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-sd-line [&_th]:bg-sd-paper [&_th]:p-3 [&_th]:text-left [&_td]:border [&_td]:border-sd-line [&_td]:p-3"
                                    dangerouslySetInnerHTML={{ __html: guideline.content }}
                                />
                            ) : (
                                <EmptyNote>Panduan abstrak tahun ini belum tersedia.</EmptyNote>
                            )}
                        </article>

                        <aside className="lg:sticky lg:top-28">
                            <div className="space-y-5 rounded-3xl border border-sd-line bg-white p-6">
                                <div>
                                    <h2 className="text-lg font-extrabold leading-snug text-sd-ink">Informasi pengiriman</h2>
                                    <p className="mt-2 text-sm leading-relaxed text-sd-muted">
                                        Seminar ini hanya meminta abstrak, tanpa makalah lengkap.
                                    </p>
                                </div>

                                {pdfUrl && (
                                    <Button asChild className="w-full">
                                        <a href={pdfUrl} download>
                                            Unduh template abstrak (PDF)
                                        </a>
                                    </Button>
                                )}

                                <Button asChild variant="outline" className="w-full">
                                    <a href="/register">Daftar dan kirim abstrak</a>
                                </Button>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </LandingLayout>
    );
}
