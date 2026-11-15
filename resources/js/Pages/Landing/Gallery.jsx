import { useState } from 'react';
import { Link } from '@inertiajs/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import LandingLayout from '../../Components/landing/LandingLayout';
import { EmptyNote, Mark, SectionHeading } from '../../Components/landing/sections/SectionParts';
import { container, section } from '../../Components/landing/landingStyles';
import { assetUrl } from '../../Components/landing/landingUtils';
import { Button } from '../../Components/landing/ui/button';

// Halaman Galeri. Data: Gallery (year) dan GalleryImage (image_path) untuk tahun terpilih.
export default function Gallery({ layout, years = [], selectedYear, images = [] }) {
    // Indeks foto yang sedang dibuka di tampilan besar; null berarti dialog tertutup.
    const [activeIndex, setActiveIndex] = useState(null);
    const activeImage = activeIndex === null ? null : images[activeIndex];

    return (
        <LandingLayout layout={layout} title="Galeri" current="Galeri">
            <section className={section} aria-labelledby="gallery-title">
                <div className={container}>
                    <SectionHeading
                        id="gallery-title"
                        intro={selectedYear ? `Dokumentasi kegiatan seminar tahun ${selectedYear}.` : undefined}
                    >
                        <Mark>Galeri</Mark> kegiatan
                    </SectionHeading>

                    {years.length > 0 && (
                        <div className="mb-8 flex flex-wrap gap-2" aria-label="Pilih tahun galeri">
                            {years.map((itemYear) => {
                                const active = Number(itemYear) === Number(selectedYear);
                                return (
                                    <Button key={itemYear} asChild variant={active ? 'default' : 'outline'}>
                                        <Link href={`/gallery/${itemYear}`} aria-current={active ? 'page' : undefined} preserveScroll>
                                            {itemYear}
                                        </Link>
                                    </Button>
                                );
                            })}
                        </div>
                    )}

                    {images.length === 0 ? (
                        <EmptyNote>Galeri tahun ini belum tersedia.</EmptyNote>
                    ) : (
                        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                            {images.map((image, index) => {
                                const alt = `Dokumentasi Seminar DAMPAK ${selectedYear ?? ''}, foto ${index + 1}`;
                                return (
                                    <li key={image.id}>
                                        <button
                                            type="button"
                                            className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sd-ink"
                                            onClick={() => setActiveIndex(index)}
                                        >
                                            <img
                                                src={assetUrl(image.image_path)}
                                                alt={alt}
                                                width="600"
                                                height="600"
                                                loading="lazy"
                                                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                                            />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <DialogPrimitive.Root open={activeImage !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
                        <DialogPrimitive.Portal>
                            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-sd-ink/85" />
                            <DialogPrimitive.Content className="fixed inset-0 z-50 grid place-items-center p-4 focus:outline-none">
                                <DialogPrimitive.Title className="sr-only">
                                    Foto galeri {selectedYear ?? ''}
                                </DialogPrimitive.Title>
                                <DialogPrimitive.Description className="sr-only">
                                    Tampilan foto besar. Tekan Escape atau tombol tutup untuk kembali.
                                </DialogPrimitive.Description>

                                {activeImage && (
                                    <img
                                        src={assetUrl(activeImage.image_path)}
                                        alt={`Dokumentasi Seminar DAMPAK ${selectedYear ?? ''}, foto ${activeIndex + 1}`}
                                        className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain"
                                    />
                                )}

                                <DialogPrimitive.Close className="absolute right-4 top-4 inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none">
                                    <svg width="18" height="18" viewBox="0 0 22 22" aria-hidden="true">
                                        <path d="M5 5l12 12M17 5 5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                    <span className="sr-only">Tutup foto</span>
                                </DialogPrimitive.Close>
                            </DialogPrimitive.Content>
                        </DialogPrimitive.Portal>
                    </DialogPrimitive.Root>
                </div>
            </section>
        </LandingLayout>
    );
}
