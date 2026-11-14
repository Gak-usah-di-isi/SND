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

// Menu selain Beranda dan Kontak belum dibuka (disabled -> href="#").
export function buildNav(r) {
    return [
        { label: 'Beranda', href: r.home, current: true },
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
    ];
}
