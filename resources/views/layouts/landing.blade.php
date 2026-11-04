<!DOCTYPE html>
<html lang="en">

<head>
    @if (app()->environment('production'))
        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-M4MTT5JV');</script>
        <!-- End Google Tag Manager -->
    @endif
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    <link href="{{ asset($logoPath) }}" rel="icon" />
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet" />
    <link href="{{ asset('vendor/bootstrap/css/bootstrap.min.css') }}" rel="stylesheet" />
    <link href="{{ asset('vendor/bootstrap-icons/bootstrap-icons.css') }}" rel="stylesheet" />
    <link href="{{ asset('vendor/aos/aos.css') }}" rel="stylesheet" />
    <link href="{{ asset('vendor/glightbox/css/glightbox.min.css') }}" rel="stylesheet" />
    <link href="{{ asset('vendor/swiper/swiper-bundle.min.css') }}" rel="stylesheet" />

    <link href="{{ asset('css/main.css') }}" rel="stylesheet" />
    <link href="{{ asset('css/theme.css') }}" rel="stylesheet" />
    @stack('styles')
    <title>
        {{-- @php
            $years = \App\Models\::where('is_active', 1)->first();
        @endphp
        @hasSection('title')
            @yield('title') | ICASVE {{ $years->year }}
        @else
            ICasve
        @endif --}}
    </title>
</head>

@php
    $themeYear = request()->route('year') ?? \App\Models\LandingSetting::where('is_active', true)->value('year');
@endphp
<body class="index-page{{ $themeYear ? ' theme-' . $themeYear : '' }}">
    @if (app()->environment('production'))
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M4MTT5JV"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
    @endif
    @include('layouts.landingpartials.header')
    <main class="w-full mb-5">
        @yield('content')
        @php
            $activeYear = \App\Models\LandingSetting::where('is_active', true)->value('year');
            $whatsapp = \App\Models\Whatsapp::where('year', $activeYear)->first();
        @endphp

        @if ($whatsapp)
            <a href="https://api.whatsapp.com/send?phone={{ $whatsapp->nomor }}" class="whatsapp-float text-white"
                target="_blank">
                <img src="{{ asset('img/whatsapp-brands.svg') }}" width="30px" height="30px" alt="logo-wa">
            </a>
        @else
            <a href="" class="whatsapp-float text-white" target="_blank">
                <img src="{{ asset('img/whatsapp-brands.svg') }}" width="30px" height="30px" alt="logo-wa">
            </a>
        @endif


    </main>
    @include('layouts.landingpartials.footer')
    @include('layouts.landingpartials.script')
</body>

</html>
