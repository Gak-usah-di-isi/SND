import LandingLayout from '../../../Components/landing/LandingLayout';
import { Mark, SectionHeading } from '../../../Components/landing/sections/SectionParts';
import { Button } from '../../../Components/landing/ui/button';
import { assetUrl } from '../../../Components/landing/landingUtils';
import { container, section } from '../../../Components/landing/landingStyles';
import GuidelineContent from '../../../Components/landing/GuidelineContent';

export default function PresentationGuideline({ layout, guideline, selectedYear }) {
    return (
        <LandingLayout layout={layout} title="Panduan Presentasi" current="Panduan Presentasi">
            <section className={section} aria-labelledby="presentation-guideline-title">
                <div className={container}>
                    <SectionHeading
                        id="presentation-guideline-title"
                        intro={selectedYear ? `Panduan presentasi untuk tahun ${selectedYear}.` : undefined}
                    >
                        Panduan <Mark>Presentasi</Mark>
                    </SectionHeading>

                    <GuidelineContent
                        content={guideline?.content}
                        contentLabel="Isi panduan presentasi"
                        pdfUrl={assetUrl(guideline?.pdf_file)}
                        pdfLabel="Unduh template presentasi (PDF)"
                        emptyText="Panduan presentasi tahun ini belum tersedia."
                        aside={(downloadButton) => (
                            <>
                                <div>
                                    <h2 className="text-lg font-extrabold leading-snug text-sd-ink">Materi presentasi</h2>
                                    <p className="mt-2 text-sm leading-relaxed text-sd-muted">
                                        Unggah materi presentasi melalui dasbor presenter.
                                    </p>
                                </div>

                                {downloadButton}

                                <Button asChild variant="outline" className="w-full">
                                    <a href="/login">Masuk ke dasbor</a>
                                </Button>
                            </>
                        )}
                    />
                </div>
            </section>
        </LandingLayout>
    );
}
