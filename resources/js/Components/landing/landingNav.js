// Rute dan menu landing, dipakai bersama oleh semua halaman landing.
// Menu yang halamannya belum jadi diberi `disabled: true` (href="#", tidak berpindah halaman).
// Saat halamannya selesai: hapus `disabled: true` dan isi `href`.

export function buildRoutes(year) {
    return {
        home: year ? `/${year}` : '/',
        steering: '/committee/steering',
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

// Menu selain Beranda dan Kontak belum dibuka (disabled -> href="#").
export function buildNav(r, current) {
    return [
        { label: 'Beranda', href: r.home },
        {
            label: 'Komite',
            children: [
                { label: 'Komite Pengarah', href: r.steering },
                { label: 'Komite Reviewer', disabled: true },
                { label: 'Panitia Pelaksana', disabled: true },
            ],
        },
        {
            label: 'Submisi',
            children: [
                { label: 'Panduan Abstrak', disabled: true },
                { label: 'Panduan Presentasi', disabled: true },
            ],
        },
        { label: 'Galeri', disabled: true },
        { label: 'Program', disabled: true },
        { label: 'Arsip', disabled: true },
        { label: 'Seminar Sebelumnya', disabled: true },
        { label: 'FAQ', disabled: true },
        { label: 'Kontak', href: r.contact },
    ].map((item) => withCurrent(item, current));
}
