import { assetUrl } from '../landingUtils';
import { container } from '../landingStyles';

// Data: PublicationsJournal image_type hosted_by / co_hosted_by / supported_by (image_path).

export default function Hosts({ groups }) {
    const visible = groups.filter((g) => g.items?.length);
    if (!visible.length) return null;
    return (
        <section className="py-16" aria-label="Penyelenggara dan pendukung">
            <div className={`${container} flex flex-wrap items-center justify-center gap-x-20 gap-y-10`}>
                {visible.map((g) => (
                    <div key={g.label} className="flex flex-col items-center gap-4">
                        <p className="text-sm font-semibold text-sd-muted">{g.label}</p>
                        <ul className="flex flex-wrap items-center justify-center gap-8">
                            {g.items.map((item) => (
                                <li key={item.id}>
                                    <img className="h-16 w-auto object-contain" src={assetUrl(item.image_path)} alt={`Logo ${g.label.toLowerCase()}`} height="64" width="120" loading="lazy" />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
