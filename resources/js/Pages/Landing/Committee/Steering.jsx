import LandingLayout from '../../../Components/landing/LandingLayout';
import { EmptyNote, Mark, SectionHeading } from '../../../Components/landing/sections/SectionParts';
import { container, section } from '../../../Components/landing/landingStyles';
import { initials } from '../../../Components/landing/landingUtils';
import { Avatar, AvatarFallback } from '../../../Components/landing/ui/avatar';
import { Card } from '../../../Components/landing/ui/card';

// Halaman Komite Pengarah. Data: SteeringCommittee (name, institution, country).
export default function Steering({ layout, members = [], selectedYear }) {
    return (
        <LandingLayout layout={layout} title="Komite Pengarah" current="Komite Pengarah">
            <section className={section} aria-labelledby="steering-title">
                <div className={container}>
                    <SectionHeading
                        id="steering-title"
                        intro={selectedYear ? `Anggota yang menjaga arah dan mutu seminar tahun ${selectedYear}.` : undefined}
                    >
                        Komite <Mark>Pengarah</Mark>
                    </SectionHeading>

                    {members.length > 0 ? (
                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {members.map((member) => (
                                <li key={member.id}>
                                    <Card className="flex h-full items-start gap-4 p-6">
                                        <Avatar className="size-14">
                                            <AvatarFallback className="text-lg" aria-hidden="true">
                                                {initials(member.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <h3 className="text-balance break-words text-lg font-extrabold leading-snug tracking-tight">{member.name}</h3>
                                            <p className="mt-1 break-words text-sm text-sd-muted">
                                                {member.institution}
                                                {member.country ? `, ${member.country}` : ''}
                                            </p>
                                        </div>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyNote>Daftar Komite Pengarah tahun ini belum tersedia.</EmptyNote>
                    )}
                </div>
            </section>
        </LandingLayout>
    );
}
