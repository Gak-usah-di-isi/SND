import { useForm, usePage } from '@inertiajs/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input, Label, Textarea } from './ui/form';

function FieldError({ id, message }) {
    return message ? (
        <p id={id} className="text-sm font-medium text-red-700" role="alert">
            {message}
        </p>
    ) : null;
}

export default function ContactForm() {
    const form = useForm({ name: '', email: '', subject: '', message: '' });
    const flash = usePage().props.flash ?? {};

    const submit = (event) => {
        event.preventDefault();
        form.post('/contact/send', {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.flash?.type === 'success') form.reset();
            },
        });
    };

    return (
        <Card>
            <CardHeader className="p-7 pb-2 lg:p-9 lg:pb-2">
                <CardTitle className="text-xl">Kirim pesan</CardTitle>
                <CardDescription>Pesan Anda akan dikirim kepada panitia.</CardDescription>
            </CardHeader>
            <CardContent className="p-7 pt-4 lg:p-9 lg:pt-4">
                <form className="grid gap-5 sm:grid-cols-2" onSubmit={submit} noValidate>
                    <Label htmlFor="contact-name">
                        Nama
                        <Input
                            id="contact-name"
                            name="name"
                            autoComplete="name"
                            placeholder="Nama lengkap"
                            value={form.data.name}
                            onChange={(event) => form.setData('name', event.target.value)}
                            aria-invalid={Boolean(form.errors.name)}
                            aria-describedby={form.errors.name ? 'contact-name-error' : undefined}
                        />
                        <FieldError id="contact-name-error" message={form.errors.name} />
                    </Label>

                    <Label htmlFor="contact-email">
                        Email
                        <Input
                            id="contact-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="email@contoh.com"
                            value={form.data.email}
                            onChange={(event) => form.setData('email', event.target.value)}
                            aria-invalid={Boolean(form.errors.email)}
                            aria-describedby={form.errors.email ? 'contact-email-error' : undefined}
                        />
                        <FieldError id="contact-email-error" message={form.errors.email} />
                    </Label>

                    <Label className="sm:col-span-2" htmlFor="contact-subject">
                        Perihal
                        <Input
                            id="contact-subject"
                            name="subject"
                            placeholder="Perihal pesan"
                            value={form.data.subject}
                            onChange={(event) => form.setData('subject', event.target.value)}
                            aria-invalid={Boolean(form.errors.subject)}
                            aria-describedby={form.errors.subject ? 'contact-subject-error' : undefined}
                        />
                        <FieldError id="contact-subject-error" message={form.errors.subject} />
                    </Label>

                    <Label className="sm:col-span-2" htmlFor="contact-message">
                        Pesan
                        <Textarea
                            id="contact-message"
                            name="message"
                            rows={5}
                            placeholder="Tulis pesan Anda"
                            value={form.data.message}
                            onChange={(event) => form.setData('message', event.target.value)}
                            aria-invalid={Boolean(form.errors.message)}
                            aria-describedby={form.errors.message ? 'contact-message-error' : undefined}
                        />
                        <FieldError id="contact-message-error" message={form.errors.message} />
                    </Label>

                    <div className="grid gap-3 sm:col-span-2 sm:justify-items-start">
                        <Button type="submit" size="lg" disabled={form.processing} aria-busy={form.processing}>
                            {form.processing ? 'Mengirim...' : 'Kirim pesan'}
                        </Button>
                        {flash.message && (
                            <p
                                className={`text-sm font-medium ${flash.type === 'error' ? 'text-red-700' : 'text-sd-ink'}`}
                                role={flash.type === 'error' ? 'alert' : 'status'}
                            >
                                {flash.message}
                            </p>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
