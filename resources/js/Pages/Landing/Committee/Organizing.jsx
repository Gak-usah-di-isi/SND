import LandingLayout from '../../../Components/landing/LandingLayout';
import { EmptyNote, Mark, SectionHeading } from '../../../Components/landing/sections/SectionParts';
import { container, section } from '../../../Components/landing/landingStyles';

export default function Organizing({ layout, members = [], selectedYear }) {
    const groups = members.reduce((result, member) => {
        const category = String(member.category ?? '').trim() || 'Anggota';
        const categoryMembers = result.get(category) ?? [];

        categoryMembers.push(member);
        result.set(category, categoryMembers);

        return result;
    }, new Map());

    return (
        <LandingLayout layout={layout} title="Panitia Pelaksana" current="Panitia Pelaksana">
            <section className={section} aria-labelledby="organizing-title">
                <div className={container}>
                    <SectionHeading
                        id="organizing-title"
                        intro={selectedYear ? `Susunan Panitia Pelaksana seminar tahun ${selectedYear}.` : undefined}
                    >
                        Panitia <Mark>Pelaksana</Mark>
                    </SectionHeading>

                    {groups.size > 0 ? (
                        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                            {[...groups].map(([category, categoryMembers], index) => {
                                const headingId = `organizing-category-${index}`;

                                return (
                                    <section key={category} aria-labelledby={headingId}>
                                        <h3 id={headingId} className="border-b border-sd-line pb-3 text-lg font-extrabold leading-snug text-sd-ink">
                                            {category}
                                        </h3>
                                        <ul className="mt-4 space-y-3">
                                            {categoryMembers.map((member) => (
                                                <li
                                                    key={member.id}
                                                    className={`break-words leading-snug ${
                                                        categoryMembers.length === 1
                                                            ? 'text-xl font-extrabold text-sd-ink'
                                                            : 'font-semibold text-sd-ink-soft'
                                                    }`}
                                                >
                                                    {member.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyNote>Susunan Panitia Pelaksana tahun ini belum tersedia.</EmptyNote>
                    )}
                </div>
            </section>
        </LandingLayout>
    );
}
