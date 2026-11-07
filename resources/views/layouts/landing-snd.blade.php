<!DOCTYPE html>
<html lang="id" class="scroll-smooth">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description"
        content="Seminar Nasional Berdampak (SND) BPPM Fakultas Vokasi Universitas Brawijaya. Diseminasi riset terapan berbasis 17 Pilar SDGs dengan luaran LoA dan Book of Abstracts." />
    <meta name="keywords" content="SND, Seminar Nasional Berdampak, BPPM, Fakultas Vokasi, Universitas Brawijaya, abstrak, LoA, Book of Abstracts, SDGs" />

    @php
        $sndFavicon = $logoPath ?? asset('favicon.ico');
        if (stripos($sndFavicon, 'icasve') !== false) {
            $sndFavicon = asset('favicon.ico');
        }
    @endphp
    <link href="{{ $sndFavicon }}" rel="icon" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
        rel="stylesheet" />

    {{-- Iconify web component untuk ikon-ikon solar/lucide/carbon. --}}
    <script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>

    @vite(['resources/css/landing.css'])
    @stack('styles')

    <title>@yield('title', 'SND — Seminar Nasional Berdampak | BPPM Fakultas Vokasi UB')</title>
</head>

<body class="antialiased selection:bg-[#F3B13E] selection:text-[#041527] relative bg-[#FAF8F5]">
    @yield('content')
    @stack('scripts')
</body>

</html>
