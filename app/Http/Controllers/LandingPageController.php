<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\LandingSetting;
use App\Models\Theme;
use App\Models\Hotel;

class LandingPageController extends Controller
{
    public function index($year = null)
    {
        $activeYear = $year ? LandingSetting::where('year', $year)->first() : LandingSetting::where('is_active', true)->first();

        if (!$activeYear) {
            // Halaman beranda harus tetap bisa dibuka walau admin belum mengatur
            // tahun aktif. Fallback ke tahun berjalan agar landing page tidak 404.
            if ($year) {
                abort(404, 'Year not found');
            }

            $activeYear = (object) [
                'year' => (int) date('Y'),
                'is_active' => true,
            ];
        }

        // TODO(integrasi CMS): kirim data landing di sini. Daftar key dan model
        // sumbernya ada di resources/js/data/landingDummy.js. Selama
        // `conference_title` belum dikirim, halaman memakai data contoh itu.
        return Inertia::render('Landing/Home', [
            'activeYear' => ['year' => (int) $activeYear->year, 'is_active' => (bool) $activeYear->is_active],
            'routeYear' => $year ? (int) $year : null,
        ]);
    }


    public function showTheme($id)
    {
        $theme = Theme::findOrFail($id);
        return view('landingpage.theme_detail.index', compact('theme'));
    }

    public function hotels()
    {
        $hotels = Hotel::all();
        return view('landingpage.information-hotel.index', compact('hotels'));
    }
}
