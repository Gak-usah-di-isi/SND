import LandingLayout from '../../../Components/landing/LandingLayout';
import { Mark, SectionHeading } from '../../../Components/landing/sections/SectionParts';
import GuidelineContent from '../../../Components/landing/GuidelineContent';
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

                    <GuidelineContent
                        content={guideline?.content}
                        contentLabel="Isi panduan abstrak"
                        pdfUrl={pdfUrl}
                        pdfLabel="Unduh template abstrak (PDF)"
                        emptyText="Panduan abstrak tahun ini belum tersedia."
                        aside={(downloadButton) => (
                            <>
                                <div>
                                    <h2 className="text-lg font-extrabold leading-snug text-sd-ink">Informasi pengiriman</h2>
                                    <p className="mt-2 text-sm leading-relaxed text-sd-muted">
                                        Seminar ini hanya meminta abstrak, tanpa makalah lengkap.
                                    </p>
                                </div>

                                {downloadButton}

                                <Button asChild variant="outline" className="w-full">
                                    <a href="/register">Daftar dan kirim abstrak</a>
                                </Button>
                            </>
                        )}
                    />
                </div>
            </section>
        </LandingLayout>
    );
}
