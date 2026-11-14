import { useState } from 'react';
import { Icon } from '@iconify/react';
import { displayPhone, waLink } from '../landingUtils';
import { container, h2, section } from '../landingStyles';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input, Label, Textarea } from '../ui/form';
import { Mark } from './SectionParts';

// Data: Contact (phone1, phone1_name, phone2, phone2_name, email, address).

// Seperti ICASVE: pesan dikirim lewat aplikasi email pengunjung (mailto ke Contact.email).
function ContactForm({ email }) {
    const [sent, setSent] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const subject = `Kontak Seminar DAMPAK - ${f.get('name')}`;
        const body = `Nama: ${f.get('name')}\nEmail: ${f.get('email')}\nPerihal: ${f.get('subject')}\n\n${f.get('message')}`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
    };

    return (
        <Card>
            <CardHeader className="p-7 pb-2 lg:p-9 lg:pb-2">
                <CardTitle className="text-xl">Kirim pesan</CardTitle>
                <CardDescription>Pesan dikirim melalui aplikasi email Anda.</CardDescription>
            </CardHeader>
            <CardContent className="p-7 pt-4 lg:p-9 lg:pt-4">
                <form className="grid gap-5 sm:grid-cols-2" onSubmit={onSubmit}>
                    <Label>
                        Nama
                        <Input name="name" autoComplete="name" placeholder="Nama lengkap" required />
                    </Label>
                    <Label>
                        Email
                        <Input name="email" type="email" autoComplete="email" placeholder="email@contoh.com" required />
                    </Label>
                    <Label className="sm:col-span-2">
                        Perihal
                        <Input name="subject" placeholder="Perihal pesan" required />
                    </Label>
                    <Label className="sm:col-span-2">
                        Pesan
                        <Textarea name="message" rows={5} placeholder="Tulis pesan Anda" required />
                    </Label>
                    <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                        <Button type="submit" size="lg">
                            <Icon icon="solar:plain-2-bold" className="size-5" aria-hidden="true" />
                            Kirim pesan
                        </Button>
                        <p className="text-sm text-sd-muted" role="status">
                            {sent ? 'Aplikasi email Anda terbuka dengan pesan yang sudah terisi. Kirim dari sana.' : ''}
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

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

export default function Contact({ contact }) {
    if (!contact) return null;
    const people = [
        { name: contact.phone1_name, phone: contact.phone1 },
        { name: contact.phone2_name, phone: contact.phone2 },
    ].filter((p) => p.phone);
    const linkClass =
        'inline-flex min-h-11 items-center underline decoration-sd-line decoration-2 underline-offset-4 transition-colors hover:text-sd-gold-ink hover:decoration-sd-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink motion-reduce:transition-none';

    return (
        <section id="kontak" className={`${section} bg-sd-paper`} aria-labelledby="contact-title">
            <div className={`${container} grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}>
                <div>
                    <h2 id="contact-title" className={`${h2} mb-8`}>
                        Hubungi <Mark>panitia</Mark>
                    </h2>
                    <ul>
                        {contact.address && (
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
                        {contact.email && (
                            <ContactItem icon="solar:letter-bold" label="Email">
                                <a className={linkClass} href={`mailto:${contact.email}`}>
                                    {contact.email}
                                </a>
                            </ContactItem>
                        )}
                    </ul>
                </div>
                {contact.email && <ContactForm email={contact.email} />}
            </div>
        </section>
    );
}
