<header id="header" class="header d-flex align-items-center sticky-top">
    <div class="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
        @php
            // Tahun yang lagi dibuka (dari segmen /{year} di URL), null kalau di halaman default (ikut tahun aktif)
            $currentYear = request()->route('year');

            $activeYearValue = \App\Models\LandingSetting::where('is_active', true)->value('year');
            $logoYear = $currentYear ?? $activeYearValue ?? date('Y');
            $logo = \App\Models\Logo::where('year', $logoYear)->first();

            $yearRoute = fn($plainName, $yearName) => $currentYear
                ? route($yearName, $currentYear)
                : route($plainName);
        @endphp
        <a href="{{ $currentYear ? route('home.year', $currentYear) : route('home') }}" class="logo d-flex align-items-center">
         @if($logo)
             <img src="{{ asset('storage/' . $logo->image) }}" alt="Logo" style="max-width: 90px; height: auto; margin-right: 8px;" />
         @else
             <p>No logo found for this year.</p>
         @endif
        </a>

        <nav id="navmenu" class="navmenu">
            <ul>
                <li><a href="{{ $currentYear ? route('home.year', $currentYear) : route('home') }}">Home</a></li>
                <li class="dropdown">
                    <a href="#"><span>Committe</span> <i class="bi bi-chevron-down toggle-dropdown"></i></a>
                    <ul>
                        <li><a href="{{ $yearRoute('committee.steering', 'committee.steering.year') }}">Steering Committee</a></li>
                        <li><a href="{{ $yearRoute('committee.reviewer', 'committee.reviewer.year') }}">Reviewer Committee</a></li>
                        <li><a href="{{ $yearRoute('committee.organizing', 'committee.organizing.year') }}">Organizing Committee</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#"><span>Submission</span> <i
                            class="bi bi-chevron-down toggle-dropdown"></i></a>
                    <ul>
                        <li><a href="{{ $yearRoute('submission.abstract', 'submission.abstract.year') }}">Abstract Submission</a></li>
                        <li><a href="{{ $yearRoute('submission.fullpaper', 'submission.fullpaper.year') }}">Fullpaper Submission</a></li>
                        <li><a href="{{ $yearRoute('submission.presentation', 'submission.presentation.year') }}">Presentation Submission</a></li>
                    </ul>
                </li>
                <li><a href="{{ $yearRoute('gallery', 'gallery.year') }}">Gallery</a></li>
                <li><a href="{{ $yearRoute('conference.program', 'conference.program.year') }}">Conference Program</a></li>
                <li><a href="{{ route('archives.index') }}">Archives</a></li>
                <li><a href="{{ route('previous.conference') }}">Previous Conference</a></li>
                <li><a href="{{ route('faq') }}">FAQ</a></li>
                <li><a href="{{ route('contact') }}">Contact</a></li>
            </ul>
            <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>
    </div>
</header>
