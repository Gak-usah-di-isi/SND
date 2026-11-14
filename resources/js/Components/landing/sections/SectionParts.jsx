import { h2, lead } from '../landingStyles';

// Potongan kecil yang dipakai bersama oleh section landing.

export function Mark({ children }) {
    return <mark className="sd-mark">{children}</mark>;
}

export function SectionHeading({ id, children, intro, center = false }) {
    return (
        <div className={center ? 'mx-auto mb-12 max-w-[720px] text-center' : 'mb-12 max-w-[720px]'}>
            <h2 id={id} className={h2}>
                {children}
            </h2>
            {intro && <p className={`${lead} mt-4 ${center ? 'mx-auto' : ''}`}>{intro}</p>}
        </div>
    );
}

export function EmptyNote({ children }) {
    return <p className="rounded-3xl border border-dashed border-sd-line bg-white p-6 text-sd-muted">{children}</p>;
}
