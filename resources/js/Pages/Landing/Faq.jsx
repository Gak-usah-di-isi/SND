import LandingLayout from '../../Components/landing/LandingLayout';
import { EmptyNote, Mark, SectionHeading } from '../../Components/landing/sections/SectionParts';
import { container, section } from '../../Components/landing/landingStyles';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../Components/landing/ui/accordion';

// Halaman FAQ. Data: Faq (id, title, description HTML) dari database.
export default function Faq({ layout, faqs = [] }) {
    return (
        <LandingLayout
            layout={layout}
            title="FAQ"
            current="FAQ"
            description="Pertanyaan yang sering diajukan seputar Seminar DAMPAK."
        >
            <section className={section} aria-labelledby="faq-page-title">
                <div className={container}>
                    <SectionHeading
                        id="faq-page-title"
                        intro="Jawaban atas pertanyaan yang paling sering diajukan peserta seminar."
                    >
                        Pertanyaan yang <Mark>sering</Mark> diajukan
                    </SectionHeading>

                    {faqs.length === 0 ? (
                        <EmptyNote>Belum ada pertanyaan yang tersedia saat ini.</EmptyNote>
                    ) : (
                        <Accordion type="single" collapsible className="border-t border-sd-line">
                            {faqs.map((faq) => (
                                <AccordionItem key={faq.id} value={String(faq.id)}>
                                    <AccordionTrigger>{faq.title}</AccordionTrigger>
                                    <AccordionContent>
                                        <div
                                            className="[&_p+p]:mt-3"
                                            dangerouslySetInnerHTML={{ __html: faq.description }}
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </div>
            </section>
        </LandingLayout>
    );
}
