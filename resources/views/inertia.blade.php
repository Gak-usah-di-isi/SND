<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
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
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @php
        $activeYear = \App\Models\Year::where('is_active', true)->value('year');
        $faviconUpload = \App\Models\Upload::currentForType('logo');
        $faviconPath = $faviconUpload ? asset('storage/' . $faviconUpload->file_path) : asset('favicon.ico');
    @endphp
    <title>{{ $activeYear ? 'ICASVE ' . $activeYear : 'ICASVE' }}</title>
    <link rel="icon" href="{{ $faviconPath }}">
    @viteReactRefresh
    @vite(['resources/css/template.css', 'resources/js/template.jsx'])
    @inertiaHead
    <style>
        #global-spinner {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff;
            z-index: 9999;
        }
        #global-spinner .loading {
            position: relative;
            width: 55px;
            height: 55px;
        }
        #global-spinner .effects {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 3px solid transparent;
            border-left: 3px solid #0152EA;
            border-radius: 50%;
            box-sizing: border-box;
        }
        #global-spinner .effect-1 { animation: sp-rotate 1s ease infinite; }
        #global-spinner .effect-2 { animation: sp-rotateOpacity 1s ease infinite 0.1s; }
        #global-spinner .effect-3 { animation: sp-rotateOpacity 1s ease infinite 0.2s; }
        @keyframes sp-rotate {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes sp-rotateOpacity {
            0%   { transform: rotate(0deg);   opacity: 0.1; }
            100% { transform: rotate(360deg); opacity: 1; }
        }
    </style>
</head>
<body class="bg-gray-50 antialiased">
    @if (app()->environment('production'))
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M4MTT5JV"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
    @endif
    <div id="global-spinner">
        <div class="loading">
            <div class="effect-1 effects"></div>
            <div class="effect-2 effects"></div>
            <div class="effect-3 effects"></div>
        </div>
    </div>
    @inertia
</body>
</html>
