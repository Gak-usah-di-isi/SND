/**
 * Data contoh untuk halaman Landing/Home.
 *
 * Key dan field di sini sama persis dengan yang dipakai beranda ICASVE
 * (LandingPageController@index versi lama) dan model editor landing. Tidak ada
 * field tambahan di luar schema. Integrasi cukup dengan mengirim props yang
 * sama dari LandingPageController@index lewat Inertia::render('Landing/Home', [...]).
 * Selama props `conference_title` belum dikirim, halaman memakai data ini.
 *
 * Key -> model (field yang dipakai halaman):
 *   activeYear              LandingSetting (year)
 *   conference_abbreviation ConferenceSetting::conference_abbreviation (string)
 *   logo                    Upload::currentForType('logo')->file_path, null = logo UB
 *   conference_title        ConferenceTitle (title, description, year)
 *   about                   About (title, content, image)
 *   sdgs                    Sdg (order, code, name_id, color), pengganti conference_objectives
 *   keynoteSpeakers         Speaker role keynote_speaker
 *   invitedSpeakers         Speaker role invited_speaker
 *                           (name, institution, image, country, session_topic, await_confirmation)
 *   themes                  Theme (id, title, year), tautan ke /themes/{id}
 *   posters                 Poster (image, link)
 *   deadline_date           DeadlineDate (name, date). Nama yang sama dengan beberapa
 *                           tanggal = tenggat diperpanjang, tanggal lama dicoret.
 *   venues                  Venue (image_path, venue_name, address, date, link_map, map,
 *                           conference_mode, onsite_programme, online_programme)
 *   hosted_by               PublicationsJournal image_type hosted_by (image_path)
 *   co_hosted_by            PublicationsJournal image_type co_hosted_by (image_path)
 *   supported_by            PublicationsJournal image_type supported_by (image_path)
 *   faqs                    Faq (title, description), maksimal 3 seperti ICASVE
 *   contacts                Contact (phone1, phone1_name, phone2, phone2_name, email, address)
 *
 * Path gambar dari database (mis. "speakers/a.jpg") otomatis diawali /storage/
 * oleh helper assetUrl(). Path yang diawali "/" atau "http" dipakai apa adanya.
 */

export const landingDummy = {
    activeYear: { year: 2026 },

    conference_abbreviation: 'Seminar DAMPAK',

    logo: null,

    conference_title: {
        id: 1,
        title: 'Seminar Nasional Pengabdian kepada Masyarakat dan Inovasi Terapan',
        description: 'Diseminasi Aksi Masyarakat, Pengabdian, Aplikasi, dan Karya',
        year: 2026,
    },

    about: {
        id: 1,
        title: 'Tentang Seminar DAMPAK 2026',
        content:
            '<p>Seminar DAMPAK diselenggarakan oleh BPPM Fakultas Vokasi Universitas Brawijaya untuk mempertemukan dosen, peneliti, praktisi, dan mahasiswa yang menjalankan pengabdian kepada masyarakat maupun riset terapan.</p>' +
            '<p>Peserta cukup mengirim abstrak, tanpa makalah lengkap. Setiap abstrak dikaitkan dengan satu atau lebih Tujuan Pembangunan Berkelanjutan (SDGs), ditelaah reviewer, lalu yang diterima mendapat LoA, dipresentasikan saat seminar, dan dihimpun dalam Book of Abstracts.</p>',
        image: '/images/Lab.jpeg',
        year: 2026,
    },

    sdgs: [
        { id: 1, order: 1, code: 'SDG-1', name_id: 'Tanpa Kemiskinan', color: '#E5243B' },
        { id: 2, order: 2, code: 'SDG-2', name_id: 'Tanpa Kelaparan', color: '#DDA63A' },
        { id: 3, order: 3, code: 'SDG-3', name_id: 'Kehidupan Sehat dan Sejahtera', color: '#4C9F38' },
        { id: 4, order: 4, code: 'SDG-4', name_id: 'Pendidikan Berkualitas', color: '#C5192D' },
        { id: 5, order: 5, code: 'SDG-5', name_id: 'Kesetaraan Gender', color: '#FF3A21' },
        { id: 6, order: 6, code: 'SDG-6', name_id: 'Air Bersih dan Sanitasi Layak', color: '#26BDE2' },
        { id: 7, order: 7, code: 'SDG-7', name_id: 'Energi Bersih dan Terjangkau', color: '#FCC30B' },
        { id: 8, order: 8, code: 'SDG-8', name_id: 'Pekerjaan Layak & Pertumbuhan Ekonomi', color: '#A21942' },
        { id: 9, order: 9, code: 'SDG-9', name_id: 'Industri, Inovasi & Infrastruktur', color: '#FD6925' },
        { id: 10, order: 10, code: 'SDG-10', name_id: 'Berkurangnya Kesenjangan', color: '#DD1367' },
        { id: 11, order: 11, code: 'SDG-11', name_id: 'Kota & Komunitas Berkelanjutan', color: '#FD9D24' },
        { id: 12, order: 12, code: 'SDG-12', name_id: 'Konsumsi & Produksi Bertanggung Jawab', color: '#BF8B2E' },
        { id: 13, order: 13, code: 'SDG-13', name_id: 'Penanganan Perubahan Iklim', color: '#3F7E44' },
        { id: 14, order: 14, code: 'SDG-14', name_id: 'Ekosistem Lautan', color: '#0A97D9' },
        { id: 15, order: 15, code: 'SDG-15', name_id: 'Ekosistem Daratan', color: '#56C02B' },
        { id: 16, order: 16, code: 'SDG-16', name_id: 'Perdamaian, Keadilan & Kelembagaan Tangguh', color: '#00689D' },
        { id: 17, order: 17, code: 'SDG-17', name_id: 'Kemitraan untuk Mencapai Tujuan', color: '#19486A' },
    ],

    keynoteSpeakers: [
        { id: 1, name: 'Nama Pembicara Utama 1', institution: 'Instansi pembicara', image: null, country: 'Indonesia', session_topic: 'Topik sesi pembicara utama', await_confirmation: false },
        { id: 2, name: 'Nama Pembicara Utama 2', institution: 'Instansi pembicara', image: null, country: 'Indonesia', session_topic: 'Topik sesi pembicara utama', await_confirmation: true },
    ],

    invitedSpeakers: [
        { id: 3, name: 'Nama Pembicara Tamu 1', institution: 'Instansi pembicara', image: null, country: 'Indonesia', session_topic: null, await_confirmation: false },
        { id: 4, name: 'Nama Pembicara Tamu 2', institution: 'Instansi pembicara', image: null, country: 'Indonesia', session_topic: null, await_confirmation: false },
        { id: 5, name: 'Nama Pembicara Tamu 3', institution: 'Instansi pembicara', image: null, country: 'Indonesia', session_topic: null, await_confirmation: false },
        { id: 6, name: 'Nama Pembicara Tamu 4', institution: 'Instansi pembicara', image: null, country: 'Indonesia', session_topic: null, await_confirmation: true },
    ],

    themes: [
        { id: 1, title: 'Inovasi teknologi tepat guna untuk masyarakat', year: 2026 },
        { id: 2, title: 'Pemberdayaan ekonomi dan UMKM', year: 2026 },
        { id: 3, title: 'Pendidikan, kesehatan, dan sumber daya manusia', year: 2026 },
        { id: 4, title: 'Lingkungan, energi, dan ketahanan pangan', year: 2026 },
    ],

    posters: [],

    deadline_date: [
        { id: 1, name: 'Pengiriman abstrak dibuka', date: '2026-10-01', year: 2026 },
        { id: 2, name: 'Batas akhir pengiriman abstrak', date: '2026-11-15', year: 2026 },
        { id: 3, name: 'Batas akhir pengiriman abstrak', date: '2026-11-30', year: 2026 },
        { id: 4, name: 'Pengumuman hasil review', date: '2026-12-05', year: 2026 },
        { id: 5, name: 'Batas unggah revisi abstrak', date: '2026-12-12', year: 2026 },
        { id: 6, name: 'Pelaksanaan seminar', date: '2026-12-19', year: 2026 },
    ],

    venues: [
        {
            id: 1,
            image_path: '/images/Lab.jpeg',
            venue_name: 'Fakultas Vokasi Universitas Brawijaya',
            address: 'Jl. Veteran No.12-16, Ketawanggede, Kec. Lowokwaru, Kota Malang, Jawa Timur',
            date: '2026-12-19',
            link_map: 'https://www.google.com/maps/search/?api=1&query=Fakultas+Vokasi+Universitas+Brawijaya',
            map: '<iframe src="https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sFakultas+Vokasi+Universitas+Brawijaya" title="Peta lokasi seminar" loading="lazy"></iframe>',
            conference_mode: 'Hybrid',
            onsite_programme: 'Presentasi luring dan diskusi',
            online_programme: 'Presentasi daring melalui ruang virtual',
            year: 2026,
        },
    ],

    hosted_by: [
        { id: 1, image_type: 'hosted_by', image_path: '/images/logoub.png', year: 2026 },
        { id: 2, image_type: 'hosted_by', image_path: '/images/vokasi_ub.png', year: 2026 },
    ],
    co_hosted_by: [],
    supported_by: [],

    faqs: [
        {
            id: 1,
            title: 'Apakah saya perlu mengirim makalah lengkap?',
            description: '<p>Tidak. Seminar ini hanya meminta abstrak. Abstrak yang diterima dipresentasikan saat seminar dan diterbitkan di Book of Abstracts.</p>',
        },
        {
            id: 2,
            title: 'Bolehkah memilih lebih dari satu SDG?',
            description: '<p>Boleh. Saat mengunggah abstrak, pilih semua tujuan SDGs yang relevan dengan kegiatan atau hasil riset Anda.</p>',
        },
        {
            id: 3,
            title: 'Apa yang terjadi jika abstrak saya perlu revisi?',
            description: '<p>Editor memberi keputusan revisi beserta catatan reviewer. Anda mengunggah abstrak perbaikan dari dasbor, lalu editor memberi keputusan akhir.</p>',
        },
    ],

    contacts: [
        {
            id: 1,
            phone1: '080000000000',
            phone1_name: 'Nama Narahubung 1',
            phone2: '080000000001',
            phone2_name: 'Nama Narahubung 2',
            email: 'panitia@example.com',
            address: 'BPPM Fakultas Vokasi Universitas Brawijaya, Jl. Veteran No.12-16, Malang',
            year: 2026,
        },
    ],
};
