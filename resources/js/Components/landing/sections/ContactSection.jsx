import { Icon } from '@iconify/react';
import { displayPhone, waLink } from '../landingUtils';
import { container, h2, section } from '../landingStyles';
import { Mark } from './SectionParts';
import ContactForm from '../ContactForm';

// Data: Contact (phone1, phone1_name, phone2, phone2_name, email, address).

// Ikon Solar (set yang sama dengan dasbor); WhatsApp memakai logo mereknya karena Solar tidak punya.
function ContactItem({ icon, label, children }) {
    return (
        <li className="flex items-start gap-4 border-b border-sd-line py-5 first:pt-0 last:border-b-0">
            <Icon icon={icon} className="mt-0.5 size-6 shrink-0 text-sd-gold-ink" aria-hidden="true" />
            <div className="min-w-0">
                <p className="text-sm text-sd-muted">{label}</p>
                <div className="mt-0.5 text-lg font-semibold leading-snug [overflow-wrap:anywhere]">{children}</div>
            </div>
        </li>
    );
}

export default function Contact({ contact, page = false }) {
    if (!contact && !page) return null;

    const Heading = page ? 'h1' : 'h2';
    const people = [
        { name: contact?.phone1_name, phone: contact?.phone1 },
        { name: contact?.phone2_name, phone: contact?.phone2 },
    ].filter((p) => p.phone);
    const linkClass =
        'inline-flex min-h-11 items-center underline decoration-sd-line decoration-2 underline-offset-4 transition-colors hover:text-sd-gold-ink hover:decoration-sd-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink motion-reduce:transition-none';

    return (
        <section id="kontak" className={`${section} bg-sd-paper`} aria-labelledby="contact-title">
            <div className={`${container} grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}>
                <div>
                    <Heading id="contact-title" className={`${h2} mb-8`}>
                        Hubungi <Mark>panitia</Mark>
                    </Heading>
                    <ul>
                        {contact?.address && (
                            <ContactItem icon="solar:map-point-bold" label="Alamat">
                                {contact.address}
                            </ContactItem>
                        )}
                        {people.map((p) => (
                            <ContactItem key={p.phone} icon="ic:baseline-whatsapp" label={`WhatsApp${p.name ? `, ${p.name}` : ''}`}>
                                <a className={linkClass} href={waLink(p.phone)} target="_blank" rel="noopener noreferrer">
                                    {displayPhone(p.phone)}
                                    <span className="sr-only"> (WhatsApp, tab baru)</span>
                                </a>
                            </ContactItem>
                        ))}
                        {contact?.email && (
                            <ContactItem icon="solar:letter-bold" label="Email">
                                <a className={linkClass} href={`mailto:${contact.email}`}>
                                    {contact.email}
                                </a>
                            </ContactItem>
                        )}
                        {!contact && (
                            <li>
                                <p className="text-sd-muted" role="status">
                                    Informasi kontak untuk tahun aktif belum tersedia.
                                </p>
                            </li>
                        )}
                    </ul>
                </div>
                <ContactForm />
            </div>
        </section>
    );
}
