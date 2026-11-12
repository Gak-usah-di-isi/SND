import { assetUrl } from '../landingUtils';
import { container, h2, section } from '../landingStyles';

// Data: About (title, content, image).

export default function About({ about }) {
    if (!about) return null;
    const image = assetUrl(about.image);
    return (
        <section id="tentang" className={section} aria-labelledby="about-title">
            <div className={`${container} grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20`}>
                <div>
                    <h2 id="about-title" className={`${h2} mb-6`}>
                        {about.title}
                    </h2>
                    {/* About.content berasal dari RichTextEditor di editor landing (HTML). */}
                    <div className="text-[1.05rem] leading-relaxed text-sd-ink-soft [&_p+p]:mt-4" dangerouslySetInnerHTML={{ __html: about.content }} />
                </div>
                {image && (
                    <img className="aspect-[4/3] w-full rounded-[28px] object-cover" src={image} alt={about.title} width="981" height="737" loading="lazy" />
                )}
            </div>
        </section>
    );
}
