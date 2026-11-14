// Rute dan menu landing, dipakai bersama oleh semua halaman landing.
// Semua menu sudah punya halaman tujuan; label yang sama dengan halaman aktif
// ditandai lewat withCurrent().

export function buildRoutes(year) {
    return {
        home: year ? `/${year}` : '/',
        steering: '/committee/steering',
        reviewer: '/committee/reviewer',
        organizing: '/committee/organizing',
        abstract: '/submission/abstract',
        presentation: '/submission/presentation',
        gallery: '/gallery',
        program: '/conference-program',
        archives: '/archives',
        previous: '/previous-conference',
        faq: '/faq',
        contact: '/contact',
        login: '/login',
        register: '/register',
    };
}

// Item yang label-nya sama dengan halaman aktif ditandai `current: true`,
// termasuk anak menu, supaya header bisa menyorotnya.
function withCurrent(item, current) {
    return {
        ...item,
        ...(item.label === current ? { current: true } : {}),
        ...(item.children ? { children: item.children.map((child) => withCurrent(child, current)) } : {}),
    };
}

export function buildNav(r, current) {
    return [
        { label: 'Beranda', href: r.home },
        {
            label: 'Komite',
            children: [
                { label: 'Komite Pengarah', href: r.steering },
                { label: 'Komite Reviewer', href: r.reviewer },
                { label: 'Panitia Pelaksana', href: r.organizing },
            ],
        },
        {
            label: 'Submisi',
            children: [
                { label: 'Panduan Abstrak', href: r.abstract },
                { label: 'Panduan Presentasi', href: r.presentation },
            ],
        },
        { label: 'Galeri', href: r.gallery },
        { label: 'Program', href: r.program },
        { label: 'Arsip', href: r.archives },
        { label: 'Seminar Sebelumnya', href: r.previous },
        { label: 'FAQ', href: r.faq },
        { label: 'Kontak', href: r.contact },
    ].map((item) => withCurrent(item, current));
}
