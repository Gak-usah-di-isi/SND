import { container, h2, section } from '../landingStyles';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Mark } from './SectionParts';

// Data: Faq (id, title, description HTML). Beranda menampilkan maksimal 3.

export default function Faq({ faqs }) {
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
