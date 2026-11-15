
import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import LandingLayout from '../../Components/landing/LandingLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../Components/landing/ui/accordion';
import { EmptyNote, Mark, SectionHeading } from '../../Components/landing/sections/SectionParts';
import { container, section } from '../../Components/landing/landingStyles';

export default function Faq({ layout, faqs = [] }) {
    const [search, setSearch] = useState('');

    const filteredFaqs = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return faqs;

        return faqs.filter((faq) => {
            const question = (faq.title ?? '').toLowerCase();
            const answer = (faq.description ?? '')
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s+/g, ' ')
                .toLowerCase();

            return question.includes(keyword) || answer.includes(keyword);
        });
    }, [faqs, search]);

    return (
        <LandingLayout layout={layout} title="FAQ" current="FAQ">
            <section className={`${section} border-t border-sd-line`}>
                <div className={container}>
                    <SectionHeading
                        id="faq-title"
                        intro="Temukan jawaban atas pertanyaan yang sering diajukan seputar Seminar DAMPAK."
                    >
                        Pertanyaan yang <Mark>sering</Mark> diajukan
                    </SectionHeading>

                    <div className="mb-8 max-w-xl">
                        <label htmlFor="faq-search" className="mb-2 block text-sm font-semibold text-sd-ink">
                            Cari pertanyaan
                        </label>
                        <input
                            id="faq-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Ketik kata kunci pertanyaan atau jawaban..."
                            className="w-full rounded-xl border border-sd-line bg-white px-4 py-3 text-sd-ink outline-none transition focus-visible:border-sd-ink focus-visible:ring-2 focus-visible:ring-sd-gold"
                        />
                    </div>

                    {filteredFaqs.length > 0 ? (
                        <Accordion type="single" collapsible className="border-t border-sd-line">
                            {filteredFaqs.map((faq) => (
                                <AccordionItem key={faq.id} value={String(faq.id)}>
                                    <AccordionTrigger>{faq.title}</AccordionTrigger>
                                    <AccordionContent>
                                        <div
                                            className="[&_p+p]:mt-3"
                                            dangerouslySetInnerHTML={{ __html: faq.description ?? '' }}
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <EmptyNote>
                            Tidak ada pertanyaan yang cocok. Hubungi panitia lewat halaman{' '}
                            <Link href="/contact" className="font-semibold text-sd-ink underline underline-offset-4">
                                Kontak
                            </Link>.
                        </EmptyNote>
                    )}

                    <div className="mt-16 rounded-3xl bg-sd-paper p-8 md:p-10">
                        <h2 className="text-xl font-bold text-sd-ink md:text-2xl">
                            Masih punya pertanyaan?
                        </h2>
                        <p className="mt-3 max-w-xl text-sd-muted">
                            Jika belum menemukan jawaban yang dibutuhkan, silakan hubungi panitia melalui halaman Kontak.
                        </p>
                        <Link
                            href="/contact"
                            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-sd-ink px-6 py-3 font-semibold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink"
                        >
                            Hubungi Panitia
                        </Link>
                    </div>
                </div>
            </section>
        </LandingLayout>
    );
}
