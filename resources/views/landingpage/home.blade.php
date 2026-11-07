@extends('layouts.landing-snd')

@php
    $sndYear = (int) ($activeYear->year ?? date('Y'));

    $contactList = collect($contacts ?? []);
    $primaryContact = $contactList->first();
    $contactEmail = $primaryContact->email ?? 'bppm.vokasi@ub.ac.id';
    $contactPhone = $primaryContact->phone1 ?? null;
    $contactAddress = $primaryContact->address ?? 'Gedung Fakultas Vokasi Universitas Brawijaya, Jl. Veteran No. 12–16, Ketawanggede, Kec. Lowokwaru, Kota Malang, Jawa Timur 65145';

    $isLoggedIn = auth()->check();
    $portalUrl = $isLoggedIn ? route('dashboard') : route('login');
    $accountLabel = $isLoggedIn ? 'Dashboard' : 'Masuk / Akun';

    $bulanId = [
        1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
        5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
        9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
    ];

    $formatTanggal = function ($value) use ($bulanId) {
        if (!$value) {
            return '-';
        }

        try {
            $date = \Carbon\Carbon::parse($value);
            return $date->day . ' ' . ($bulanId[(int) $date->month] ?? $date->format('F')) . ' ' . $date->year;
        } catch (\Throwable $e) {
            return (string) $value;
        }
    };

    // ---------------------------------------------------------------------
    // 4 Klaster Subtema (fallback ke data prototipe, ditimpa data CMS bila ada)
    // ---------------------------------------------------------------------
    $clusters = [
        1 => [
            'title' => 'Sains, Keteknikan & Teknologi Terapan',
            'desc' => 'Rekayasa perangkat lunak, IoT, kecerdasan buatan terapan, energi baru terbarukan, otomasi industri, dan teknologi tepat guna untuk industri dan masyarakat.',
            'sdgs' => [7, 9, 11],
            'icon' => 'solar:cpu-bolt-bold',
        ],
        2 => [
            'title' => 'Bisnis, Manajemen, Keuangan & Pariwisata',
            'desc' => 'Transformasi UMKM digital, perbankan & perpajakan terapan, akuntansi hijau, pariwisata berkelanjutan, perhotelan, dan model bisnis ekonomi sirkular.',
            'sdgs' => [8, 12, 17],
            'icon' => 'solar:chart-square-bold',
        ],
        3 => [
            'title' => 'Sosial, Humaniora, Pendidikan & Kebijakan Vokasi',
            'desc' => 'Pedagogi kurikulum vokasi masa depan, pengentasan kemiskinan desa mitra, inklusi gender & disabilitas, hukum bisnis, dan tata kelola kebijakan publik.',
            'sdgs' => [1, 4, 5, 10, 16],
            'icon' => 'solar:square-academic-cap-bold',
        ],
        4 => [
            'title' => 'Lingkungan, Ketahanan Pangan & Kesehatan Berkelanjutan',
            'desc' => 'Pertanian & peternakan presisi, pengolahan pangan lokal terapan, kesehatan preventif masyarakat, sanitasi air bersih, serta adaptasi perubahan iklim.',
            'sdgs' => [2, 3, 6, 13, 14, 15],
            'icon' => 'solar:leaf-bold',
        ],
    ];

    foreach (collect($themes ?? [])->take(4)->values() as $themeIndex => $theme) {
        $clusterId = $themeIndex + 1;
        if (!isset($clusters[$clusterId])) {
            continue;
        }
        if (!empty($theme->title)) {
            $clusters[$clusterId]['title'] = $theme->title;
        }
        if (!empty($theme->description)) {
            $clusters[$clusterId]['desc'] = trim(preg_replace('/\s+/', ' ', strip_tags($theme->description)));
        }
    }

    // ---------------------------------------------------------------------
    // 17 Pilar SDGs resmi (fallback warna/ikon PBB, ditimpa data CMS bila ada)
    // ---------------------------------------------------------------------
    $officialSdgs = [
        1 => ['id' => 1, 'title' => 'Tanpa Kemiskinan', 'cluster' => 3, 'hex' => '#E5243B', 'icon' => 'carbon:pedestrian-family'],
        2 => ['id' => 2, 'title' => 'Tanpa Kelaparan', 'cluster' => 4, 'hex' => '#DDA63A', 'icon' => 'lucide:soup'],
        3 => ['id' => 3, 'title' => 'Kehidupan Sehat & Sejahtera', 'cluster' => 4, 'hex' => '#4C9F38', 'icon' => 'solar:heart-pulse-bold'],
        4 => ['id' => 4, 'title' => 'Pendidikan Berkualitas', 'cluster' => 3, 'hex' => '#C5192D', 'icon' => 'solar:square-academic-cap-bold'],
        5 => ['id' => 5, 'title' => 'Kesetaraan Gender', 'cluster' => 3, 'hex' => '#FF3A21', 'icon' => 'solar:users-group-two-rounded-bold'],
        6 => ['id' => 6, 'title' => 'Air Bersih & Sanitasi', 'cluster' => 4, 'hex' => '#26BDE2', 'icon' => 'solar:waterdrops-bold'],
        7 => ['id' => 7, 'title' => 'Energi Bersih & Terjangkau', 'cluster' => 1, 'hex' => '#FCC30B', 'icon' => 'solar:bolt-circle-bold'],
        8 => ['id' => 8, 'title' => 'Pekerjaan Layak & Ekonomi', 'cluster' => 2, 'hex' => '#A21942', 'icon' => 'solar:graph-up-bold'],
        9 => ['id' => 9, 'title' => 'Industri, Inovasi & Infrastruktur', 'cluster' => 1, 'hex' => '#FD6925', 'icon' => 'solar:cpu-bolt-bold'],
        10 => ['id' => 10, 'title' => 'Berkurangnya Kesenjangan', 'cluster' => 3, 'hex' => '#DD1367', 'icon' => 'solar:scale-bold'],
        11 => ['id' => 11, 'title' => 'Kota & Permukiman Berkelanjutan', 'cluster' => 1, 'hex' => '#FD9D24', 'icon' => 'solar:city-bold'],
        12 => ['id' => 12, 'title' => 'Konsumsi & Produksi Bertanggung Jawab', 'cluster' => 2, 'hex' => '#BF8B2E', 'icon' => 'solar:refresh-circle-bold'],
        13 => ['id' => 13, 'title' => 'Penanganan Perubahan Iklim', 'cluster' => 4, 'hex' => '#3F7E44', 'icon' => 'solar:cloud-sun-2-bold'],
        14 => ['id' => 14, 'title' => 'Ekosistem Lautan', 'cluster' => 4, 'hex' => '#0A97D9', 'icon' => 'solar:water-bold'],
        15 => ['id' => 15, 'title' => 'Ekosistem Daratan', 'cluster' => 4, 'hex' => '#56C02B', 'icon' => 'solar:leaf-bold'],
        16 => ['id' => 16, 'title' => 'Perdamaian, Keadilan & Kelembagaan', 'cluster' => 3, 'hex' => '#00689D', 'icon' => 'solar:shield-check-bold'],
        17 => ['id' => 17, 'title' => 'Kemitraan untuk Mencapai Tujuan', 'cluster' => 2, 'hex' => '#19486A', 'icon' => 'solar:global-bold'],
    ];

    $dbSdgs = collect($sdgs ?? []);
    if ($dbSdgs->isNotEmpty()) {
        $sdgItems = $dbSdgs->map(function ($sdg) use ($officialSdgs) {
            $sdgId = (int) preg_replace('/\D+/', '', (string) ($sdg->code ?? ''));
            if (!$sdgId) {
                $sdgId = (int) ($sdg->order ?? 0);
            }

            $base = $officialSdgs[$sdgId] ?? [
                'id' => $sdgId,
                'title' => 'SDG ' . $sdgId,
                'cluster' => 1,
                'hex' => '#092C56',
                'icon' => 'solar:global-bold',
            ];

            return [
                'id' => $sdgId,
                'title' => $sdg->name_id ?: ($sdg->name_en ?: $base['title']),
                'cluster' => $base['cluster'],
                'hex' => $sdg->color ?: $base['hex'],
                'icon' => $sdg->icon ?: $base['icon'],
            ];
        })->filter(fn ($sdg) => $sdg['id'] > 0)->sortBy('id')->values();
    } else {
        $sdgItems = collect($officialSdgs)->values();
    }

    if ($sdgItems->isEmpty()) {
        $sdgItems = collect($officialSdgs)->values();
    }

    // ---------------------------------------------------------------------
    // 3 Profil Narasumber (fallback prototipe, ditimpa data CMS bila ada)
    // ---------------------------------------------------------------------
    $fallbackSpeakers = [
        [
            'badge' => 'Akademisi Terapan',
            'role' => 'KEYNOTE SPEAKER 1',
            'name' => 'Prof. Dr. Ir. Hendra Suryanto, M.T.',
            'institution' => 'Guru Besar Teknologi Rekayasa Material & Hilirisasi',
            'topic' => '"Akselerasi Prototipe TRL-6 Menuju Pasar Melalui Kerangka Kemitraan Vokasi"',
            'footer' => 'Komite Riset Terapan Kemendiktisaintek',
            'footer_icon' => 'solar:square-academic-cap-bold',
            'image' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
            'featured' => false,
        ],
        [
            'badge' => 'Tuan Rumah Utama',
            'role' => 'PIMPINAN FAKULTAS VOKASI UB',
            'name' => 'Dr. Ir. Mukhammad Kholid, S.T., M.T.',
            'institution' => 'Dekan Fakultas Vokasi Universitas Brawijaya',
            'topic' => '"Strategi Hilirisasi Riset Terapan Fakultas Vokasi UB Menjawab Sasaran 17 Pilar SDGs"',
            'footer' => 'BPPM Fakultas Vokasi UB Malang',
            'footer_icon' => 'solar:buildings-3-bold',
            'image' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
            'featured' => true,
        ],
        [
            'badge' => 'Praktisi Industri',
            'role' => 'KEYNOTE SPEAKER 2',
            'name' => 'Rizki Pratama, S.Kom., M.Sc.',
            'institution' => 'VP of Applied Technology & Sustainable Innovation Hub',
            'topic' => '"Integrasi Kebutuhan Industri dengan Daya Inovasi Lulusan dan Riset Terapan Kampus"',
            'footer' => 'Asosiasi Industri Manufaktur & Digital Mandiri',
            'footer_icon' => 'solar:case-round-bold',
            'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
            'featured' => false,
        ],
    ];

    $dbSpeakers = collect($keynoteSpeakers ?? [])
        ->merge(collect($invitedSpeakers ?? []))
        ->take(3)
        ->values();

    $speakerCards = collect($fallbackSpeakers);
    foreach ($dbSpeakers as $speakerIndex => $speaker) {
        if ($speakerIndex > 2) {
            break;
        }

        $base = $fallbackSpeakers[$speakerIndex];
        $isVokasi = $speaker->institution
            && (stripos($speaker->institution, 'vokasi') !== false || stripos($speaker->institution, 'brawijaya') !== false);
        $isInvited = $speaker->role && stripos($speaker->role, 'invited') !== false;

        $speakerCards[$speakerIndex] = [
            'badge' => $speakerIndex === 1
                ? ($isVokasi ? 'Tuan Rumah Utama' : 'Narasumber Utama')
                : ($speakerIndex === 0 ? 'Akademisi Terapan' : 'Praktisi Industri'),
            'role' => $speakerIndex === 1
                ? ($isVokasi ? 'PIMPINAN FAKULTAS VOKASI UB' : 'NARASUMBER UTAMA')
                : ($isInvited ? 'INVITED SPEAKER' : 'KEYNOTE SPEAKER ' . ($speakerIndex + 1)),
            'name' => $speaker->name ?: $base['name'],
            'institution' => $speaker->institution ?: $base['institution'],
            'topic' => $speaker->session_topic ? '"' . $speaker->session_topic . '"' : $base['topic'],
            'footer' => $speaker->country ?: $base['footer'],
            'footer_icon' => $base['footer_icon'],
            'image' => $speaker->image ? asset('storage/' . $speaker->image) : $base['image'],
            'featured' => $speakerIndex === 1,
        ];
    }
    $speakerCards = $speakerCards->values();

    // ---------------------------------------------------------------------
    // Tanggal Penting (fallback prototipe, ditimpa data CMS bila ada)
    // ---------------------------------------------------------------------
    $fallbackDeadlines = [
        [
            'name' => 'Penerimaan Abstrak',
            'desc' => 'Pendaftaran akun pemakalah dan unggah dokumen abstrak terstruktur',
            'date' => '15 Jul – 30 Sep ' . $sndYear,
            'status' => 'Fase Berjalan',
            'icon' => 'solar:calendar-bold',
            'active' => true,
        ],
        [
            'name' => 'Pengumuman Review (LoA)',
            'desc' => 'Penilaian substansi abstrak & penerbitan Letter of Acceptance digital',
            'date' => '05 Oktober ' . $sndYear,
            'status' => 'Tahap 2',
            'icon' => 'solar:check-circle-bold',
            'active' => false,
        ],
        [
            'name' => 'Batas Konfirmasi & Materi',
            'desc' => 'Konfirmasi kehadiran pemakalah & pengunggahan slide presentasi',
            'date' => '15 Oktober ' . $sndYear,
            'status' => 'Tahap 3',
            'icon' => 'solar:document-add-bold',
            'active' => false,
        ],
        [
            'name' => 'Seminar & Book of Abstracts',
            'desc' => 'Sesi pleno, paralel, serta peluncuran Book of Abstracts resmi',
            'date' => '24 Oktober ' . $sndYear,
            'status' => 'Puncak Acara',
            'icon' => 'solar:diploma-verified-bold',
            'active' => false,
        ],
    ];

    $dbDeadlines = collect($deadline_date ?? [])->sortBy('date')->take(4)->values();
    if ($dbDeadlines->isNotEmpty()) {
        $deadlineItems = $dbDeadlines->map(function ($deadline, $deadlineIndex) use ($fallbackDeadlines, $formatTanggal) {
            $base = $fallbackDeadlines[$deadlineIndex] ?? $fallbackDeadlines[0];

            return [
                'name' => $deadline->name ?: $base['name'],
                'desc' => $base['desc'],
                'date' => $formatTanggal($deadline->date),
                'status' => $deadlineIndex === 0
                    ? 'Fase Berjalan'
                    : ($deadlineIndex === 3 ? 'Puncak Acara' : 'Tahap ' . ($deadlineIndex + 1)),
                'icon' => $base['icon'],
                'active' => $deadlineIndex === 0,
            ];
        });
    } else {
        $deadlineItems = collect($fallbackDeadlines);
    }

    // ---------------------------------------------------------------------
    // Arsip Book of Abstracts
    // ---------------------------------------------------------------------
    $archiveCards = collect();
    foreach (collect($archives ?? [])->take(2) as $archive) {
        $archiveYear = (int) ($archive->year ?? 0);
        if (!$archiveYear) {
            continue;
        }

        $archiveCards->push([
            'label' => 'EDISI ' . $archiveYear . ' - ARSIP',
            'title' => 'Book of Abstracts SND ' . $archiveYear,
            'desc' => 'Kumpulan abstrak resmi penyelenggaraan Seminar Nasional Berdampak tahun ' . $archiveYear . '.',
            'total' => null,
            'institutions' => null,
            'url' => route('archives.index', ['year' => $archiveYear]),
            'download' => $archive->pdf ? asset('storage/' . $archive->pdf) : null,
        ]);
    }

    if ($archiveCards->isEmpty() && collect($archiveStats ?? [])->isNotEmpty()) {
        foreach (collect($archiveStats)->take(2) as $stat) {
            $statYear = (int) ($stat->year ?? 0);
            if (!$statYear) {
                continue;
            }

            $archiveCards->push([
                'label' => 'EDISI ' . $statYear . ' - TERBIT',
                'title' => 'Book of Abstracts SND ' . $statYear,
                'desc' => 'Kumpulan abstrak resmi penyelenggaraan Seminar Nasional Berdampak tahun ' . $statYear . '.',
                'total' => (int) ($stat->total ?? 0),
                'institutions' => null,
                'url' => route('archives.index', ['year' => $statYear]),
                'download' => null,
            ]);
        }
    }

    $hasArchive = $archiveCards->isNotEmpty();

    if (!$hasArchive) {
        $archiveCards = collect([
            [
                'label' => 'EDISI 2025 - TERBIT',
                'title' => 'Book of Abstracts SND 2025',
                'desc' => 'Sinergi Inovasi Vokasi Berbasis SDGs Menuju Kemandirian Bangsa',
                'total' => 148,
                'institutions' => 32,
                'url' => route('archives.index', ['year' => 2025]),
                'download' => null,
            ],
            [
                'label' => 'EDISI 2024 - ARSIP',
                'title' => 'Kumpulan Abstrak Riset Terapan 2024',
                'desc' => 'Transformasi Digital & Hilirisasi Produk Vokasi Untuk Masyarakat',
                'total' => 112,
                'institutions' => 24,
                'url' => route('archives.index', ['year' => 2024]),
                'download' => null,
            ],
        ]);
    }

    // ---------------------------------------------------------------------
    // Narasi Tentang (fallback prototipe, ditimpa data CMS bila ada)
    // ---------------------------------------------------------------------
    $aboutTitle = $about && $about->title
        ? \Illuminate\Support\Str::limit($about->title, 90)
        : 'Fokus Pada Esensi Inovasi & Dampak Nyata';

    $aboutExcerpt = $about && $about->content
        ? \Illuminate\Support\Str::limit(trim(preg_replace('/\s+/', ' ', strip_tags($about->content))), 320)
        : 'Kami menyederhanakan alur naskah panjang agar peneliti terapan dapat berfokus menyalurkan metodologi aplikatif dan dampak sosial bagi masyarakat dan industri.';

    $aboutImage = $about && $about->image
        ? asset('storage/' . $about->image)
        : 'https://asset-2.tstatic.net/tribunnews/foto/bank/images/ilustrasi-fakultas-vokasi-universitas-brawijaya-ub.jpg';
@endphp

@section('title', 'SND ' . $sndYear . ' — Seminar Nasional Berdampak | BPPM Fakultas Vokasi UB')

@section('content')
    <div class="relative z-10">
        {{-- =========================================================
             1. SINGLE SEAMLESS FROSTED-GLASS NAVBAR
        ========================================================== --}}
        <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
            <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-5">
                <a href="#beranda" class="flex items-center gap-3 group shrink-0">
                    <div class="w-11 h-11 rounded-2xl bg-[#092C56] flex items-center justify-center text-[#F3B13E] font-extrabold text-xl shadow-sm group-hover:bg-[#124076] transition-colors">
                        <iconify-icon icon="solar:diploma-verified-bold" class="text-2xl"></iconify-icon>
                    </div>
                    <div>
                        <div class="flex items-center gap-1.5">
                            <span class="font-extrabold text-lg tracking-tight text-[#092C56]">SND</span>
                            <span class="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500 border-l border-slate-300 pl-1.5">Vokasi UB</span>
                        </div>
                        <p class="text-[11px] text-slate-500 font-semibold leading-none mt-0.5">Seminar Nasional Berdampak</p>
                    </div>
                </a>

                <nav class="hidden xl:flex items-center gap-6 text-[15px] font-bold text-slate-800">
                    <a href="#beranda" class="header-nav-link py-2">Beranda</a>
                    <a href="#tentang" class="header-nav-link py-2">Tentang</a>
                    <a href="#ruang-lingkup" class="header-nav-link py-2 whitespace-nowrap">Ruang Lingkup &amp; Subtema</a>
                    <a href="#alur-pendaftaran" class="header-nav-link py-2 whitespace-nowrap">Alur Pendaftaran</a>
                    <a href="#tanggal-penting" class="header-nav-link py-2 whitespace-nowrap">Tanggal Penting</a>
                    <a href="#pembicara" class="header-nav-link py-2">Pembicara</a>
                    <a href="#arsip" class="header-nav-link py-2">Arsip</a>
                </nav>

                <div class="hidden sm:flex items-center shrink-0">
                    <a href="{{ $portalUrl }}"
                        class="header-account-button text-sm font-extrabold text-white bg-[#092C56] hover:bg-[#124076] px-7 py-3 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3B13E] focus-visible:ring-offset-2">
                        {{ $accountLabel }}
                    </a>
                </div>

                <button id="mobileMenuBtn" onclick="toggleMobileMenu()" aria-label="Buka menu navigasi"
                    class="xl:hidden p-2.5 rounded-xl border border-slate-200 text-[#092C56] hover:bg-slate-50">
                    <iconify-icon icon="solar:hamburger-menu-linear" class="text-2xl"></iconify-icon>
                </button>
            </div>

            <div id="mobileMenu" class="hidden xl:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2">
                <a href="#beranda" onclick="toggleMobileMenu()" class="header-nav-link block w-fit px-3 py-2 rounded-lg text-sm font-bold text-slate-700">Beranda</a>
                <a href="#tentang" onclick="toggleMobileMenu()" class="header-nav-link block w-fit px-3 py-2 rounded-lg text-sm font-bold text-slate-700">Tentang</a>
                <a href="#ruang-lingkup" onclick="toggleMobileMenu()" class="header-nav-link block w-fit px-3 py-2 rounded-lg text-sm font-bold text-slate-700">Ruang Lingkup &amp; Subtema (17 SDGs)</a>
                <a href="#alur-pendaftaran" onclick="toggleMobileMenu()" class="header-nav-link block w-fit px-3 py-2 rounded-lg text-sm font-bold text-slate-700">Alur Pendaftaran</a>
                <a href="#tanggal-penting" onclick="toggleMobileMenu()" class="header-nav-link block w-fit px-3 py-2 rounded-lg text-sm font-bold text-slate-700">Tanggal Penting</a>
                <a href="#pembicara" onclick="toggleMobileMenu()" class="header-nav-link block w-fit px-3 py-2 rounded-lg text-sm font-bold text-slate-700">Pembicara</a>
                <a href="#arsip" onclick="toggleMobileMenu()" class="header-nav-link block w-fit px-3 py-2 rounded-lg text-sm font-bold text-slate-700">Arsip Book of Abstracts</a>
                <div class="pt-3 border-t border-slate-200">
                    <a href="{{ $portalUrl }}"
                        class="block text-center w-full py-3 rounded-full bg-[#092C56] hover:bg-[#124076] text-white font-extrabold text-sm transition-colors">
                        {{ $accountLabel }}
                    </a>
                </div>
            </div>
        </header>

        {{-- =========================================================
             2. HERO SECTION
        ========================================================== --}}
        <section id="beranda" class="relative pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
            <div class="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div class="w-full max-w-5xl h-[420px] opacity-15 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]">
                    <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80"
                        alt="Atmosphere Seminar Nasional Berdampak Vokasi UB"
                        class="w-full h-full object-cover scale-105 filter grayscale contrast-125" />
                </div>
            </div>

            <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-gradient-to-tr from-[#124076]/10 via-[#F3B13E]/10 to-transparent blur-3xl rounded-full pointer-events-none z-0"></div>
            <div class="absolute top-12 left-8 w-56 h-56 bg-[#F3B13E]/10 blur-3xl rounded-full pointer-events-none z-0"></div>
            <div class="absolute top-12 right-8 w-56 h-56 bg-[#124076]/10 blur-3xl rounded-full pointer-events-none z-0"></div>

            <div class="relative z-10 text-center max-w-4xl mx-auto">
                <div class="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-slate-300/80 rounded-full pl-3 pr-4 py-1.5 mb-8 shadow-sm">
                    <span class="bg-[#092C56] text-[#F3B13E] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        17 Pilar SDGs
                    </span>
                    <span class="text-xs font-bold text-[#092C56] tracking-tight">
                        BPPM Fakultas Vokasi Universitas Brawijaya • Edisi {{ $sndYear }}
                    </span>
                </div>

                <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-zinc-900 mb-6">
                    Hilirisasi Riset Terapan Melalui <br class="hidden sm:inline">
                    <span class="text-[#092C56] dual-underline">Seminar Nasional Berdampak</span>
                </h1>

                <p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium mb-10">
                    Diseminasi karya inovasi terapan dan pengabdian masyarakat berbasis <strong class="text-zinc-800">17 Pilar SDGs</strong>. Skema pendaftaran praktis <strong class="text-[#092C56]">100% berbasis Abstrak</strong> untuk penerbitan <em>LoA Digital</em> dan <em>Book of Abstracts</em> resmi BPPM Vokasi UB.
                </p>

                <div class="flex flex-wrap items-center justify-center gap-4">
                    <a href="{{ $portalUrl }}"
                        class="bg-[#092C56] hover:bg-[#124076] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#092C56]/25 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3B13E] focus-visible:ring-offset-2 text-white font-extrabold text-sm px-7 py-4 rounded-2xl shadow-lg shadow-[#092C56]/20 transition-all inline-flex items-center gap-3 cursor-pointer">
                        <span>Submit Abstrak Sekarang</span>
                    </a>
                    <a href="#ruang-lingkup"
                        class="bg-white hover:bg-blue-50 hover:border-[#092C56] hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3B13E] focus-visible:ring-offset-2 text-[#092C56] border border-slate-300 font-extrabold text-sm px-6 py-4 rounded-2xl transition-all inline-flex items-center gap-2 shadow-2xs">
                        <iconify-icon icon="solar:layers-minimalistic-bold-duotone" class="text-lg text-[#F3B13E]"></iconify-icon>
                        <span>Jelajahi 4 Subtema & 17 SDGs</span>
                    </a>
                </div>
            </div>

            <div class="mt-16 md:mt-20 max-w-6xl mx-auto relative z-10">
                <div class="bg-gradient-to-r from-[#041527] via-[#092C56] to-[#041527] rounded-3xl md:rounded-full p-4 sm:p-6 shadow-2xl border border-white/15 relative overflow-hidden">
                    <div class="absolute -right-10 -bottom-10 w-44 h-44 bg-[#F3B13E]/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#F3B13E]/20 text-white">
                        <div class="px-5 py-4 relative flex items-center gap-4">
                            <div class="w-12 h-12 rounded-2xl bg-white/10 text-[#F3B13E] flex items-center justify-center shrink-0 text-2xl border border-white/10">
                                <iconify-icon icon="solar:global-bold"></iconify-icon>
                            </div>
                            <div>
                                <div class="flex items-center gap-1.5">
                                    <span class="text-2xl lg:text-3xl font-extrabold text-white">17 Pilar</span>
                                    <span class="text-[10px] font-black uppercase bg-[#F3B13E] text-[#041527] px-1.5 py-0.5 rounded">SDGs</span>
                                </div>
                                <p class="text-xs text-blue-200/90 font-medium leading-snug mt-0.5">Terintegrasi dalam 4 Klaster Subtema</p>
                            </div>
                        </div>

                        <div class="px-5 py-4 relative flex items-center gap-4">
                            <div class="w-12 h-12 rounded-2xl bg-white/10 text-[#F7D147] flex items-center justify-center shrink-0 text-2xl border border-white/10">
                                <iconify-icon icon="solar:document-text-bold"></iconify-icon>
                            </div>
                            <div>
                                <div class="text-2xl lg:text-3xl font-extrabold text-white">100% Abstrak</div>
                                <p class="text-xs text-blue-200/90 font-medium leading-snug mt-0.5">Fokus penuh pada substansi abstrak</p>
                            </div>
                        </div>

                        <div class="px-5 py-4 relative flex items-center gap-4">
                            <div class="w-12 h-12 rounded-2xl bg-white/10 text-[#F3B13E] flex items-center justify-center shrink-0 text-2xl border border-white/10">
                                <iconify-icon icon="solar:tag-price-bold"></iconify-icon>
                            </div>
                            <div>
                                <div class="text-2xl lg:text-3xl font-extrabold text-white">Gratis / Dinamis*</div>
                                <p class="text-xs text-blue-200/90 font-medium leading-snug mt-0.5">*Subsidi penuh sivitas Vokasi UB</p>
                            </div>
                        </div>

                        <div class="px-5 py-4 relative flex items-center gap-4">
                            <div class="w-12 h-12 rounded-2xl bg-white/10 text-[#F7D147] flex items-center justify-center shrink-0 text-2xl border border-white/10">
                                <iconify-icon icon="solar:bookmark-square-minimalistic-bold"></iconify-icon>
                            </div>
                            <div>
                                <div class="text-xl lg:text-2xl font-extrabold text-white leading-tight">LoA & Kumpulan Abstrak</div>
                                <p class="text-xs text-blue-200/90 font-medium leading-snug mt-0.5">Book of Abstracts ber-ISSN</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {{-- =========================================================
             3. TENTANG & PELAKSANAAN
        ========================================================== --}}
        <section id="tentang" class="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                <div>
                    <span class="text-xs font-extrabold uppercase tracking-widest text-[#F3B13E]">TENTANG PENYELENGGARA</span>
                    <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 leading-snug mt-1">
                        Kolaborasi Riset Terapan <br />
                        <span class="text-[#092C56]">Untuk Indonesia Berdampak</span>
                    </h2>
                </div>
                <p class="text-sm md:text-base text-slate-600 max-w-xl leading-relaxed">
                    Diselenggarakan oleh <strong class="text-zinc-800">Badan Penelitian dan Pengabdian Masyarakat (BPPM) Fakultas Vokasi Universitas Brawijaya</strong>. SND mempertemukan akademisi, peneliti vokasi, mitra industri, dan mahasiswa untuk mendiseminasikan solusi terapan secara ringkas, adaptif, dan berorientasi hasil.
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div class="lg:col-span-7 rounded-3xl overflow-hidden relative min-h-[340px] bg-[#092C56] group shadow-md">
                    <img src="{{ $aboutImage }}" alt="Kampus Fakultas Vokasi Universitas Brawijaya Malang"
                        class="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" />
                    <div class="absolute inset-0 bg-gradient-to-t from-[#041527]/85 via-transparent to-transparent"></div>

                    <div class="absolute bottom-5 left-5 right-5 sm:right-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl max-w-md border border-slate-200">
                        <div class="flex items-center gap-2 text-xs font-extrabold text-[#092C56]">
                            <span>BPPM FAKULTAS VOKASI UNIVERSITAS BRAWIJAYA</span>
                        </div>
                        <p class="text-sm font-extrabold text-zinc-900 mt-1">Kampus Vokasi UB — Malang, Jawa Timur</p>
                        <p class="text-xs text-slate-500 mt-0.5">Format Hibrida: Luring di Malang &amp; Zoom Teleconference Terpadu</p>
                    </div>
                </div>

                <div class="lg:col-span-5 rounded-3xl bg-[#041527] p-7 sm:p-8 flex flex-col justify-between text-white shadow-md relative overflow-hidden">
                    <div class="relative z-10">
                        <span class="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider bg-[#F3B13E] text-[#041527] px-3 py-1 rounded-full">
                            <iconify-icon icon="solar:verified-check-bold"></iconify-icon>
                            Keunggulan SND {{ $sndYear }}
                        </span>
                        <h3 class="text-xl sm:text-2xl font-extrabold mt-4 leading-snug">
                            {{ $aboutTitle }}
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
                            {{ $aboutExcerpt }}
                        </p>
                    </div>

                    <div class="space-y-3 pt-6 border-t border-white/10 text-xs sm:text-sm relative z-10">
                        <div class="flex items-center gap-2.5">
                            <iconify-icon icon="solar:check-square-bold" class="text-[#F3B13E] text-lg shrink-0"></iconify-icon>
                            <span>Submisi ringkas: <strong>Abstrak Terstruktur (250–350 kata)</strong></span>
                        </div>
                        <div class="flex items-center gap-2.5">
                            <iconify-icon icon="solar:check-square-bold" class="text-[#F3B13E] text-lg shrink-0"></iconify-icon>
                            <span>Koneksi multi-label dengan <strong>4 Subtema & 17 Pilar SDGs</strong></span>
                        </div>
                        <div class="flex items-center gap-2.5">
                            <iconify-icon icon="solar:check-square-bold" class="text-[#F3B13E] text-lg shrink-0"></iconify-icon>
                            <span>Penerbitan <strong>LoA Digital Cepat</strong> & Book of Abstracts</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {{-- =========================================================
             4. RUANG LINGKUP & OFFICIAL SDG BADGE HUB
        ========================================================== --}}
        <section id="ruang-lingkup" class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="bg-[#F4EFE6] rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-300/80 shadow-xs relative">
                <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div>
                        <span class="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest bg-[#092C56] text-[#F3B13E] px-3.5 py-1.5 rounded-full">
                            <iconify-icon icon="solar:widget-5-bold"></iconify-icon>
                            FOKUS &amp; RUMPUN ILMU TERAPAN
                        </span>
                        <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 mt-3 leading-tight">
                            Ruang Lingkup dan Subtema <br class="hidden sm:inline" />
                            <span class="text-[#092C56]">Seminar Nasional Berdampak {{ $sndYear }}</span>
                        </h2>
                    </div>
                    <div class="flex items-center gap-3">
                        <a href="{{ $portalUrl }}"
                            class="bg-[#092C56] hover:bg-[#124076] text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer">
                            <span>Daftar &amp; Pilih Subtema</span>
                            <span class="text-[#F3B13E]">→</span>
                        </a>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                    @foreach ($clusters as $clusterId => $cluster)
                        <button onclick="selectSubthemeCluster({{ $clusterId }})" id="subthemeTab{{ $clusterId }}"
                            class="subtheme-tab-btn text-left p-4 rounded-2xl transition-all cursor-pointer {{ $clusterId === 1 ? 'bg-[#092C56] text-white border-2 border-[#F3B13E] shadow-md active-tab' : 'bg-white text-zinc-800 border border-slate-300 hover:border-[#092C56]' }}">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-black uppercase {{ $clusterId === 1 ? 'text-[#F3B13E]' : 'text-slate-400' }}">Subtema {{ str_pad($clusterId, 2, '0', STR_PAD_LEFT) }}</span>
                                <iconify-icon icon="{{ $cluster['icon'] }}" class="text-lg {{ $clusterId === 1 ? '' : 'text-[#092C56]' }}"></iconify-icon>
                            </div>
                            <p class="text-xs font-extrabold mt-2 leading-snug">{{ $cluster['title'] }}</p>
                            <p class="text-[11px] {{ $clusterId === 1 ? 'text-blue-200' : 'text-slate-500' }} mt-1">
                                SDG {{ implode(', ', $cluster['sdgs']) }}
                            </p>
                        </button>
                    @endforeach
                </div>

                <div id="subthemeClusterBanner" class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-300/80 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <span id="bannerClusterBadge" class="bg-[#092C56] text-[#F3B13E] text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                                Subtema 1
                            </span>
                            <span class="text-xs font-bold text-slate-500">Rumpun Ilmu Terapan Pilihan</span>
                        </div>
                        <h3 id="bannerClusterTitle" class="text-lg font-extrabold text-zinc-900 mt-1.5">
                            {{ $clusters[1]['title'] }}
                        </h3>
                        <p id="bannerClusterDesc" class="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                            {{ $clusters[1]['desc'] }}
                        </p>
                    </div>
                    <button onclick="selectCurrentClusterForModal()"
                        class="shrink-0 bg-[#F3B13E] hover:bg-[#F7D147] text-[#041527] font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer">
                        <span>Pilih Klaster Ini</span>
                        <span>→</span>
                    </button>
                </div>

                <div>
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h3 class="text-sm font-extrabold text-[#092C56] uppercase tracking-wider">
                                17 Pilar Sustainable Development Goals (SDGs) Resmi
                            </h3>
                            <p class="text-xs text-slate-500">Klik pada salah satu badge pilar untuk memilih topik riset secara langsung ke form.</p>
                        </div>
                        <span class="text-[11px] font-bold text-slate-400 hidden sm:inline">Palet Warna Resmi PBB</span>
                    </div>

                    <div id="sdgBadgeGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                        @foreach ($sdgItems as $sdg)
                            <div data-sdg-cluster="{{ $sdg['cluster'] }}" onclick="selectSdgDirectly({{ $sdg['id'] }})"
                                title="Klik untuk memilih SDG {{ $sdg['id'] }} ke pendaftaran abstrak"
                                class="sdg-badge rounded-xl p-2.5 transition-all cursor-pointer flex items-center gap-2.5 group shadow-2xs border border-zinc-800/15 bg-white hover:opacity-100">
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-extrabold text-sm shadow-xs"
                                    style="background-color: {{ $sdg['hex'] }};">
                                    <iconify-icon icon="{{ $sdg['icon'] }}" class="text-lg"></iconify-icon>
                                </div>
                                <div class="overflow-hidden">
                                    <div class="flex items-center gap-1 leading-none">
                                        <span class="text-[10px] font-black uppercase text-zinc-800">SDG {{ $sdg['id'] }}</span>
                                    </div>
                                    <p class="text-[11px] font-bold text-slate-600 truncate mt-0.5 group-hover:text-[#092C56]">
                                        {{ $sdg['title'] }}
                                    </p>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </section>

        {{-- =========================================================
             5. ALUR PENDAFTARAN STEPPER
        ========================================================== --}}
        <section id="alur-pendaftaran" class="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <span class="text-xs font-extrabold uppercase tracking-widest text-[#F3B13E]">TAHAPAN SUBMISI RINGKAS</span>
                    <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 mt-1">
                        Alur Pendaftaran &amp; <span class="text-[#092C56]">Luaran Seminar</span>
                    </h2>
                </div>
                <div class="flex items-center gap-3">
                    <button onclick="openTemplateGuideModal()"
                        class="border border-slate-300 hover:bg-white text-slate-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer">
                        <iconify-icon icon="solar:file-download-bold" class="text-[#092C56] text-base"></iconify-icon>
                        <span>Format Abstrak (.DOCX)</span>
                    </button>
                    <a href="{{ $portalUrl }}"
                        class="bg-[#092C56] hover:bg-[#124076] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer">
                        Mulai Pendaftaran →
                    </a>
                </div>
            </div>

            <div class="relative py-6">
                <div class="hidden lg:block absolute top-1/2 left-10 right-10 h-1 bg-gradient-to-r from-[#092C56] via-[#F3B13E] to-[#092C56] -translate-y-1/2 rounded-full z-0 opacity-40"></div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    <div class="flex flex-col items-center text-center group">
                        <div class="w-16 h-16 rounded-full bg-[#092C56] text-[#F3B13E] flex items-center justify-center font-extrabold text-xl shadow-lg border-4 border-white mb-4 group-hover:scale-105 transition-transform">
                            01
                        </div>
                        <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#092C56] bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs mb-2">
                            Registrasi
                        </span>
                        <h3 class="text-base font-extrabold text-zinc-900 leading-snug">
                            Buat Akun &amp; Pilih Subtema
                        </h3>
                        <p class="text-xs text-slate-600 mt-1.5 max-w-xs leading-relaxed">
                            Daftarkan profil pemakalah, pilih 1 dari 4 klaster subtema terapan, dan tandai target pilar SDGs Anda.
                        </p>
                    </div>

                    <div class="flex flex-col items-center text-center relative group">
                        <span class="absolute -top-3 bg-[#F3B13E] text-[#041527] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md z-20">
                            Fokus 100% Abstrak
                        </span>
                        <div class="w-16 h-16 rounded-full bg-[#F3B13E] text-[#041527] flex items-center justify-center font-extrabold text-xl shadow-xl border-4 border-white mb-4 glowing-node">
                            02
                        </div>
                        <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#041527] bg-[#F7D147] px-2.5 py-0.5 rounded-full mb-2">
                            Unggah Abstrak
                        </span>
                        <h3 class="text-base font-extrabold text-[#092C56] leading-snug">
                            Kirim Naskah Abstrak Terstruktur
                        </h3>
                        <p class="text-xs text-slate-600 mt-1.5 max-w-xs leading-relaxed">
                            Cukup kirimkan abstrak 250–350 kata memuat latar belakang, metode terapan, dan dampak terukur.
                        </p>
                    </div>

                    <div class="flex flex-col items-center text-center group">
                        <div class="w-16 h-16 rounded-full bg-[#092C56] text-[#F3B13E] flex items-center justify-center font-extrabold text-xl shadow-lg border-4 border-white mb-4 group-hover:scale-105 transition-transform">
                            03
                        </div>
                        <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs mb-2">
                            Review &amp; LoA
                        </span>
                        <h3 class="text-base font-extrabold text-zinc-900 leading-snug">
                            Review &amp; Penerbitan LoA Digital
                        </h3>
                        <p class="text-xs text-slate-600 mt-1.5 max-w-xs leading-relaxed">
                            Penilaian oleh tim BPPM Vokasi UB. Naskah yang lolos langsung mendapatkan Letter of Acceptance (LoA) resmi.
                        </p>
                    </div>

                    <div class="flex flex-col items-center text-center group">
                        <div class="w-16 h-16 rounded-full bg-[#092C56] text-[#F3B13E] flex items-center justify-center font-extrabold text-xl shadow-lg border-4 border-white mb-4 group-hover:scale-105 transition-transform">
                            04
                        </div>
                        <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#092C56] bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs mb-2">
                            Publikasi
                        </span>
                        <h3 class="text-base font-extrabold text-zinc-900 leading-snug">
                            Seminar &amp; Rilis Book of Abstracts
                        </h3>
                        <p class="text-xs text-slate-600 mt-1.5 max-w-xs leading-relaxed">
                            Presentasi paralel, sertifikat pemakalah, dan publikasi resmi di Book of Abstracts BPPM Vokasi UB.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {{-- =========================================================
             6. TANGGAL PENTING / LINIMASA
        ========================================================== --}}
        <section id="tanggal-penting" class="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="bg-gradient-to-br from-[#041527] via-[#092C56] to-[#041527] rounded-3xl p-6 sm:p-10 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/10">
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <span class="text-xs font-extrabold uppercase tracking-widest text-[#F3B13E]">LINIMASA RESMI SND {{ $sndYear }}</span>
                        <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-1">
                            Tanggal Penting Pelaksanaan
                        </h2>
                    </div>
                    <span class="inline-flex items-center gap-2 text-xs font-bold bg-white/10 text-[#F7D147] px-4 py-2 rounded-xl w-fit border border-white/10">
                        <iconify-icon icon="solar:calendar-mark-bold"></iconify-icon>
                        Gelombang Submisi Abstrak Sedang Dibuka
                    </span>
                </div>

                <div class="relative">
                    <div class="hidden lg:block absolute top-6 left-12 right-12 h-0.5 bg-white/20 z-0"></div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        @foreach ($deadlineItems as $deadline)
                            <div class="flex flex-col">
                                <div class="flex items-center gap-3 mb-3">
                                    <div class="w-12 h-12 rounded-full {{ $deadline['active'] ? 'bg-[#F3B13E] text-[#041527] glowing-node' : 'bg-white/15 text-slate-200 border border-white/20' }} flex items-center justify-center font-extrabold text-base shadow-lg shrink-0">
                                        <iconify-icon icon="{{ $deadline['icon'] }}"></iconify-icon>
                                    </div>
                                    <span class="{{ $deadline['active'] ? 'text-[10px] font-black uppercase tracking-wider bg-[#F3B13E] text-[#041527] px-2.5 py-0.5 rounded-full' : 'text-[10px] font-bold text-slate-300' }}">
                                        {{ $deadline['status'] }}
                                    </span>
                                </div>
                                <div class="{{ $deadline['active'] ? 'bg-white/10 border-[#F3B13E]/60' : 'bg-white/5 border-white/10' }} rounded-2xl p-4 border backdrop-blur-xs flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 class="text-base font-extrabold text-white">{{ $deadline['name'] }}</h3>
                                        <p class="text-xs {{ $deadline['active'] ? 'text-blue-100' : 'text-slate-300' }} mt-1">{{ $deadline['desc'] }}</p>
                                    </div>
                                    <div class="mt-4 pt-3 border-t border-white/10 text-sm {{ $deadline['active'] ? 'font-black text-[#F7D147]' : 'font-bold text-white' }}">
                                        {{ $deadline['date'] }}
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </section>

        {{-- =========================================================
             7. PEMBICARA / NARASUMBER
        ========================================================== --}}
        <section id="pembicara" class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                <div>
                    <span class="text-xs font-extrabold uppercase tracking-widest text-[#F3B13E]">NARASUMBER KONFERENSI</span>
                    <h2 class="text-3xl md:text-4xl font-extrabold text-[#092C56] tracking-tight mt-1">Narasumber &amp; Pakar Terapan</h2>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                @foreach ($speakerCards as $speaker)
                    @if ($speaker['featured'])
                        <div class="bg-[#092C56] text-white rounded-[2rem] p-6 shadow-xl border-2 border-[#F3B13E]/40 relative flex flex-col justify-between lg:-translate-y-2">
                            <div>
                                <div class="relative rounded-t-[2.2rem] rounded-b-2xl overflow-hidden aspect-[4/3] mb-5 bg-[#041527]">
                                    <img src="{{ $speaker['image'] }}" alt="{{ $speaker['name'] }}" loading="lazy"
                                        class="w-full h-full object-cover" />
                                    <span class="absolute top-3 left-3 bg-[#F3B13E] text-[#041527] text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow">
                                        {{ $speaker['badge'] }}
                                    </span>
                                </div>
                                <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#F3B13E] bg-white/10 px-2.5 py-1 rounded-md inline-block w-fit">
                                    {{ $speaker['role'] }}
                                </span>
                                <h3 class="text-lg md:text-xl font-extrabold text-white leading-snug mt-2">
                                    {{ $speaker['name'] }}
                                </h3>
                                <p class="text-xs text-[#F7D147] font-semibold mt-1">
                                    {{ $speaker['institution'] }}
                                </p>
                                <div class="my-4 p-4 rounded-2xl bg-[#041527]/70 border border-white/10 text-xs text-blue-100 italic leading-relaxed">
                                    {{ $speaker['topic'] }}
                                </div>
                            </div>
                            <div class="pt-4 border-t border-white/15 flex items-center gap-2 text-xs font-semibold text-[#F7D147]">
                                <iconify-icon icon="{{ $speaker['footer_icon'] }}" class="text-base"></iconify-icon>
                                <span>{{ $speaker['footer'] }}</span>
                            </div>
                        </div>
                    @else
                        <div class="bg-white rounded-[2rem] p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                            <div>
                                <div class="relative rounded-t-[2.2rem] rounded-b-2xl overflow-hidden aspect-[4/3] mb-5 bg-slate-100">
                                    <img src="{{ $speaker['image'] }}" alt="{{ $speaker['name'] }}" loading="lazy"
                                        class="w-full h-full object-cover" />
                                    <span class="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#092C56] text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                                        {{ $speaker['badge'] }}
                                    </span>
                                </div>
                                <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#092C56]">{{ $speaker['role'] }}</span>
                                <h3 class="text-lg md:text-xl font-extrabold text-zinc-900 leading-snug mt-1">
                                    {{ $speaker['name'] }}
                                </h3>
                                <p class="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                                    {{ $speaker['institution'] }}
                                </p>
                                <div class="my-4 p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80 text-xs text-slate-600 italic leading-relaxed">
                                    {{ $speaker['topic'] }}
                                </div>
                            </div>
                            <div class="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-600">
                                <iconify-icon icon="{{ $speaker['footer_icon'] }}" class="text-[#F3B13E] text-base"></iconify-icon>
                                <span>{{ $speaker['footer'] }}</span>
                            </div>
                        </div>
                    @endif
                @endforeach
            </div>
        </section>

        {{-- =========================================================
             8. ARSIP BOOK OF ABSTRACTS
        ========================================================== --}}
        <section id="arsip" class="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="bg-[#F4EFE6] rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-300/80">
                <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                    <div>
                        <span class="text-xs font-extrabold uppercase tracking-widest text-[#F3B13E]">DOKUMENTASI &amp; REPOSITORI ILMIAH</span>
                        <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 mt-1">
                            Arsip Prosiding &amp; <span class="text-[#092C56]">Kumpulan Abstrak</span>
                        </h2>
                        <p class="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl">
                            Katalog luaran resmi <em>Book of Abstracts</em> dari penyelenggaraan Seminar Nasional Berdampak BPPM Fakultas Vokasi Universitas Brawijaya.
                        </p>
                    </div>
                </div>

                @if (!$hasArchive)
                    <div class="mb-6 rounded-2xl border border-dashed border-[#092C56]/25 bg-white/70 px-5 py-4 text-xs sm:text-sm text-slate-600">
                        Katalog digital edisi terbaru sedang dalam proses kompilasi. Berikut arsip edisi terakhir yang terdokumentasi.
                    </div>
                @endif

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    @foreach ($archiveCards as $archiveCard)
                        <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between gap-2 mb-4">
                                    <span class="bg-[#092C56] text-[#F3B13E] text-[11px] font-extrabold px-3 py-1 rounded-full">
                                        {{ $archiveCard['label'] }}
                                    </span>
                                    <span class="text-xs font-bold text-slate-400">ISSN / E-Book</span>
                                </div>
                                <div class="p-5 rounded-2xl bg-gradient-to-br from-[#092C56] to-[#041527] text-white mb-5 relative overflow-hidden">
                                    <div class="text-[10px] font-extrabold uppercase tracking-widest text-[#F3B13E]">BPPM FAKULTAS VOKASI UB</div>
                                    <h3 class="text-lg font-extrabold mt-1 leading-snug">{{ $archiveCard['title'] }}</h3>
                                    <p class="text-xs text-blue-100 mt-1">{{ $archiveCard['desc'] }}</p>
                                    <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#F7D147] font-bold">
                                        <span>{{ $archiveCard['total'] ? $archiveCard['total'] . ' Abstrak Terpublikasi' : 'Repositori Resmi' }}</span>
                                        <span>4 Klaster Subtema</span>
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-3 text-center my-4">
                                    <div class="bg-[#FAF8F5] rounded-xl p-3 border border-slate-200">
                                        <div class="text-lg font-extrabold text-[#092C56]">{{ $archiveCard['total'] ?? '—' }}</div>
                                        <div class="text-[11px] text-slate-500 font-semibold">Pemakalah</div>
                                    </div>
                                    <div class="bg-[#FAF8F5] rounded-xl p-3 border border-slate-200">
                                        <div class="text-lg font-extrabold text-[#092C56]">{{ $archiveCard['institutions'] ?? '17' }}</div>
                                        <div class="text-[11px] text-slate-500 font-semibold">{{ $archiveCard['institutions'] ? 'Institusi Mitra' : 'Pilar SDGs' }}</div>
                                    </div>
                                </div>
                            </div>
                            <a href="{{ $archiveCard['url'] }}"
                                class="w-full mt-2 bg-[#092C56] hover:bg-[#124076] text-white text-xs sm:text-sm font-extrabold py-3 px-4 rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer">
                                <iconify-icon icon="solar:file-download-bold" class="text-[#F3B13E] text-lg"></iconify-icon>
                                <span>Lihat Book of Abstracts (PDF)</span>
                            </a>
                        </div>
                    @endforeach

                    <div class="bg-[#092C56] text-white rounded-2xl p-6 border-2 border-[#F3B13E]/40 shadow-lg flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between gap-2 mb-4">
                                <span class="bg-[#F3B13E] text-[#041527] text-[11px] font-extrabold px-3 py-1 rounded-full">
                                    EDISI {{ $sndYear }} - OPEN CALL
                                </span>
                                <span class="text-xs font-bold text-[#F7D147]">Target 200+ Abstrak</span>
                            </div>
                            <h3 class="text-xl font-extrabold leading-snug mt-2">
                                Book of Abstracts SND {{ $sndYear }} (Segera Terbit)
                            </h3>
                            <p class="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
                                Jadilah bagian dari publikasi resmi tahun ini. Seluruh abstrak yang dinyatakan diterima langsung memperoleh LoA resmi dan dikompilasi ke dalam repositori resmi BPPM Vokasi UB.
                            </p>
                            <div class="mt-5 p-4 rounded-xl bg-[#041527]/70 border border-white/10 space-y-2 text-xs text-blue-100">
                                <div class="flex items-center gap-2">
                                    <iconify-icon icon="solar:check-circle-bold" class="text-[#F3B13E]"></iconify-icon>
                                    <span>Indeksasi Repositori BPPM Vokasi UB</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <iconify-icon icon="solar:check-circle-bold" class="text-[#F3B13E]"></iconify-icon>
                                    <span>100% Berbasis Abstrak Terstruktur</span>
                                </div>
                            </div>
                        </div>
                        <a href="{{ $portalUrl }}"
                            class="w-full mt-6 bg-[#F3B13E] hover:bg-[#F7D147] text-[#041527] text-xs sm:text-sm font-extrabold py-3 px-4 rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer">
                            <span>Daftarkan Abstrak Anda di Edisi {{ $sndYear }}</span>
                            <span>↗</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        {{-- =========================================================
             9. FOOTER RESMI BPPM FAKULTAS VOKASI UB
        ========================================================== --}}
        <footer class="bg-[#041527] text-white pt-16 pb-10 px-4 sm:px-6 lg:px-8 border-t border-white/10">
            <div class="max-w-7xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
                    <div class="lg:col-span-5 space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="w-11 h-11 rounded-2xl bg-[#092C56] border border-[#F3B13E]/40 flex items-center justify-center text-[#F3B13E] font-extrabold">
                                <iconify-icon icon="solar:diploma-verified-bold" class="text-2xl"></iconify-icon>
                            </div>
                            <div>
                                <div class="font-extrabold text-lg text-white">SND {{ $sndYear }} — BPPM Vokasi UB</div>
                                <div class="text-xs text-[#F7D147] font-semibold">Seminar Nasional Berdampak</div>
                            </div>
                        </div>
                        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                            Badan Penelitian dan Pengabdian Masyarakat (BPPM) Fakultas Vokasi Universitas Brawijaya. Wadah kolaborasi riset terapan nasional berbasis 4 Klaster Subtema dan 17 Pilar SDGs.
                        </p>
                        <div class="text-xs text-slate-400 space-y-1 pt-1">
                            <p class="font-bold text-white">Alamat Sekretariat:</p>
                            <p>{{ $contactAddress }}</p>
                            @if ($contactPhone)
                                <p>Telepon: {{ $contactPhone }}</p>
                            @endif
                        </div>
                    </div>

                    <div class="lg:col-span-3 space-y-3">
                        <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#F3B13E]">Menu Navigasi</h4>
                        <ul class="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
                            <li><a href="#beranda" class="hover:text-[#F7D147] transition-colors">Beranda</a></li>
                            <li><a href="#tentang" class="hover:text-[#F7D147] transition-colors">Tentang SND &amp; BPPM</a></li>
                            <li><a href="#ruang-lingkup" class="hover:text-[#F7D147] transition-colors">Ruang Lingkup &amp; Subtema</a></li>
                            <li><a href="#alur-pendaftaran" class="hover:text-[#F7D147] transition-colors">Alur Pendaftaran Abstrak</a></li>
                            <li><a href="#tanggal-penting" class="hover:text-[#F7D147] transition-colors">Tanggal Penting</a></li>
                            <li><a href="#pembicara" class="hover:text-[#F7D147] transition-colors">Narasumber &amp; Pakar</a></li>
                            <li><a href="#arsip" class="hover:text-[#F7D147] transition-colors">Arsip Book of Abstracts</a></li>
                        </ul>
                    </div>

                    <div class="lg:col-span-4 space-y-3">
                        <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#F3B13E]">Dokumen &amp; Layanan Pemakalah</h4>
                        <ul class="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
                            <li>
                                <button onclick="openTemplateGuideModal()" class="hover:text-[#F7D147] transition-colors inline-flex items-center gap-1.5 cursor-pointer">
                                    <iconify-icon icon="solar:document-text-bold" class="text-[#F3B13E]"></iconify-icon>
                                    <span>Unduh Template Abstrak Resmi (.DOCX)</span>
                                </button>
                            </li>
                            <li>
                                <a href="{{ $portalUrl }}" class="hover:text-[#F7D147] transition-colors inline-flex items-center gap-1.5">
                                    <iconify-icon icon="solar:upload-square-bold" class="text-[#F3B13E]"></iconify-icon>
                                    <span>Portal Submisi Abstrak &amp; Cek Status LoA</span>
                                </a>
                            </li>
                            <li>
                                <a href="{{ route('archives.index') }}" class="hover:text-[#F7D147] transition-colors inline-flex items-center gap-1.5">
                                    <iconify-icon icon="solar:book-bookmark-bold" class="text-[#F3B13E]"></iconify-icon>
                                    <span>Katalog Book of Abstracts</span>
                                </a>
                            </li>
                            <li>
                                <a href="{{ route('submission.abstract') }}" class="hover:text-[#F7D147] transition-colors inline-flex items-center gap-1.5">
                                    <iconify-icon icon="solar:notebook-bold" class="text-[#F3B13E]"></iconify-icon>
                                    <span>Panduan Penulisan Abstrak</span>
                                </a>
                            </li>
                        </ul>

                        <div class="pt-4 mt-4 border-t border-white/10 text-xs text-slate-300 space-y-1.5">
                            <div class="flex items-center gap-2">
                                <iconify-icon icon="solar:letter-bold" class="text-[#F3B13E]"></iconify-icon>
                                <a href="mailto:{{ $contactEmail }}" class="hover:text-[#F7D147] transition-colors">{{ $contactEmail }}</a>
                            </div>
                            <div class="flex items-center gap-2">
                                <iconify-icon icon="solar:globe-bold" class="text-[#F3B13E]"></iconify-icon>
                                <span>vokasi.ub.ac.id</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <p>© {{ $sndYear }} Badan Penelitian dan Pengabdian Masyarakat (BPPM) Fakultas Vokasi Universitas Brawijaya. Hak Cipta Dilindungi.</p>
                    <p class="text-slate-300 font-semibold">100% Berbasis Abstrak • Luaran LoA &amp; Book of Abstracts</p>
                </div>
            </div>
        </footer>
    </div>

    {{-- =========================================================
         MODAL 1: PORTAL SUBMISI ABSTRAK
    ========================================================== --}}
    <div id="abstractModal" class="fixed inset-0 z-50 hidden bg-[#041527]/75 backdrop-blur-xs items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                    <span class="text-[11px] font-extrabold uppercase tracking-wider bg-[#F3B13E]/25 text-[#092C56] px-2.5 py-0.5 rounded-full">
                        Fokus 100% Abstrak
                    </span>
                    <h3 class="text-xl font-extrabold text-[#092C56] mt-1">Portal Submisi Abstrak SND {{ $sndYear }}</h3>
                </div>
                <button onclick="closeAbstractModal()" aria-label="Tutup"
                    class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold cursor-pointer">
                    ✕
                </button>
            </div>

            <div class="mt-5 space-y-4 text-xs sm:text-sm">
                <div>
                    <label for="modalSubthemeSelect" class="block font-extrabold text-zinc-800 mb-1">Klaster Subtema Pilihan</label>
                    <select id="modalSubthemeSelect"
                        class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-semibold text-zinc-800 focus:outline-none focus:border-[#092C56]">
                        @foreach ($clusters as $clusterId => $cluster)
                            <option value="Subtema {{ $clusterId }}: {{ $cluster['title'] }}">
                                Subtema {{ $clusterId }}: {{ $cluster['title'] }} (SDG {{ implode(', ', $cluster['sdgs']) }})
                            </option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label for="modalSdgInput" class="block font-extrabold text-zinc-800 mb-1">Pilar SDGs Terkait (Multi-SDG Tagging)</label>
                    <input id="modalSdgInput" type="text" readonly placeholder="Contoh: SDG 9, SDG 11"
                        class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-medium text-zinc-800 focus:outline-none focus:border-[#092C56]" />
                </div>

                <div class="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-300 text-xs text-slate-600 flex items-start gap-2.5">
                    <iconify-icon icon="solar:info-circle-bold" class="text-[#092C56] text-lg shrink-0 mt-0.5"></iconify-icon>
                    <span>Anda akan diarahkan ke portal pemakalah untuk melengkapi data dan mengunggah <strong>Abstrak Terstruktur</strong>. LoA akan diterbitkan langsung setelah lolos review.</span>
                </div>

                <div class="pt-2 flex items-center justify-end gap-3">
                    <button type="button" onclick="closeAbstractModal()"
                        class="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                        Batal
                    </button>
                    <a href="{{ $portalUrl }}"
                        class="px-6 py-2.5 rounded-xl bg-[#092C56] hover:bg-[#124076] text-white font-extrabold cursor-pointer inline-flex items-center gap-2">
                        <span>Lanjut ke Portal Submisi</span>
                        <span>→</span>
                    </a>
                </div>
            </div>
        </div>
    </div>

    {{-- =========================================================
         MODAL 2: PANDUAN & TEMPLATE ABSTRAK
    ========================================================== --}}
    <div id="templateGuideModal" class="fixed inset-0 z-50 hidden bg-[#041527]/75 backdrop-blur-xs items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                    <span class="text-[11px] font-extrabold uppercase tracking-wider bg-[#092C56] text-[#F3B13E] px-2.5 py-0.5 rounded-full">
                        Ketentuan Penulisan
                    </span>
                    <h3 class="text-xl font-extrabold text-[#092C56] mt-1">Panduan Abstrak SND {{ $sndYear }}</h3>
                </div>
                <button onclick="closeTemplateGuideModal()" aria-label="Tutup"
                    class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold cursor-pointer">
                    ✕
                </button>
            </div>
            <ul class="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li class="flex items-start gap-2">
                    <iconify-icon icon="solar:check-circle-bold" class="text-[#F3B13E] text-base shrink-0 mt-0.5"></iconify-icon>
                    <span><strong>Panjang Naskah:</strong> 250 hingga 350 kata dalam Bahasa Indonesia atau Bahasa Inggris.</span>
                </li>
                <li class="flex items-start gap-2">
                    <iconify-icon icon="solar:check-circle-bold" class="text-[#F3B13E] text-base shrink-0 mt-0.5"></iconify-icon>
                    <span><strong>Struktur Wajib:</strong> Tujuan/Masalah Mitra, Metode Terapan, Hasil Utama, dan Kontribusi terhadap Subtema &amp; 17 Pilar SDGs.</span>
                </li>
                <li class="flex items-start gap-2">
                    <iconify-icon icon="solar:check-circle-bold" class="text-[#F3B13E] text-base shrink-0 mt-0.5"></iconify-icon>
                    <span><strong>Kata Kunci:</strong> 3–5 kata kunci dipisahkan dengan tanda titik koma (;).</span>
                </li>
                <li class="flex items-start gap-2">
                    <iconify-icon icon="solar:check-circle-bold" class="text-[#F3B13E] text-base shrink-0 mt-0.5"></iconify-icon>
                    <span><strong>Luaran:</strong> LoA Digital resmi dan publikasi di Book of Abstracts BPPM Vokasi UB.</span>
                </li>
            </ul>
            <div class="mt-6 flex flex-col sm:flex-row justify-end gap-2">
                <a href="{{ route('submission.abstract') }}"
                    class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-extrabold text-center hover:bg-slate-50">
                    Buka Panduan Lengkap
                </a>
                <button onclick="closeTemplateGuideModal()"
                    class="px-5 py-2.5 rounded-xl bg-[#092C56] text-white text-xs font-extrabold cursor-pointer">
                    Mengerti &amp; Tutup
                </button>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        const clusterData = @json($clusters);
        const sdgMap = @json($sdgItems->keyBy('id'));
        let activeClusterId = 1;

        function applySdgFilter(clusterId) {
            document.querySelectorAll('[data-sdg-cluster]').forEach((el) => {
                const isSelected = clusterId === 'all' || Number(el.dataset.sdgCluster) === Number(clusterId);
                el.classList.toggle('opacity-40', !isSelected);
            });
        }

        function selectSubthemeCluster(clusterId) {
            activeClusterId = clusterId;

            for (let i = 1; i <= 4; i++) {
                const btn = document.getElementById(`subthemeTab${i}`);
                if (!btn) continue;

                if (i === clusterId) {
                    btn.className = 'subtheme-tab-btn active-tab text-left p-4 rounded-2xl bg-[#092C56] text-white border-2 border-[#F3B13E] transition-all cursor-pointer shadow-md';
                } else {
                    btn.className = 'subtheme-tab-btn text-left p-4 rounded-2xl bg-white text-zinc-800 border border-slate-300 hover:border-[#092C56] transition-all cursor-pointer';
                }
            }

            const data = clusterData[clusterId] || clusterData[1];
            const badge = document.getElementById('bannerClusterBadge');
            const title = document.getElementById('bannerClusterTitle');
            const desc = document.getElementById('bannerClusterDesc');

            if (badge) badge.textContent = `Subtema ${clusterId}`;
            if (title) title.textContent = data.title;
            if (desc) desc.textContent = data.desc;

            applySdgFilter(clusterId);
        }

        function selectCurrentClusterForModal() {
            const data = clusterData[activeClusterId] || clusterData[1];
            const selectEl = document.getElementById('modalSubthemeSelect');
            const sdgInput = document.getElementById('modalSdgInput');

            if (selectEl) selectEl.value = `Subtema ${activeClusterId}: ${data.title}`;
            if (sdgInput) sdgInput.value = data.sdgs.map((n) => `SDG ${n}`).join(', ');

            openAbstractModal();
        }

        function selectSdgDirectly(sdgId) {
            const sdg = sdgMap[sdgId];
            if (!sdg) return;

            selectSubthemeCluster(sdg.cluster);

            const data = clusterData[sdg.cluster] || clusterData[1];
            const selectEl = document.getElementById('modalSubthemeSelect');
            const sdgInput = document.getElementById('modalSdgInput');

            if (selectEl) selectEl.value = `Subtema ${sdg.cluster}: ${data.title}`;
            if (sdgInput) sdgInput.value = `SDG ${sdg.id} (${sdg.title})`;

            openAbstractModal();
        }

        function openAbstractModal() {
            const modal = document.getElementById('abstractModal');
            if (!modal) return;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeAbstractModal() {
            const modal = document.getElementById('abstractModal');
            if (!modal) return;
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        function openTemplateGuideModal() {
            const modal = document.getElementById('templateGuideModal');
            if (!modal) return;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeTemplateGuideModal() {
            const modal = document.getElementById('templateGuideModal');
            if (!modal) return;
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            if (menu) menu.classList.toggle('hidden');
        }

        document.addEventListener('DOMContentLoaded', () => {
            selectSubthemeCluster(1);
        });
    </script>
@endpush
