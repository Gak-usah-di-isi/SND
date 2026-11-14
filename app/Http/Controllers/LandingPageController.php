<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\About;
use App\Models\ConferenceSetting;
use App\Models\ConferenceTitle;
use App\Models\LandingSetting;
use App\Models\Sdg;
use App\Models\Theme;
use App\Models\Upload;
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

        $selectedYear = (int) $activeYear->year;

        // Setiap section beranda punya method sendiri di bawah (lihat docs/taks-new).
        // Key yang dikirim menimpa data contoh di resources/js/data/landingDummy.js;
        // key yang belum dikirim tetap memakai data contoh.
        return Inertia::render('Landing/Home', array_merge(
            [
                'activeYear' => ['year' => $selectedYear, 'is_active' => (bool) $activeYear->is_active],
                'routeYear' => $year ? (int) $year : null,
            ],
            $this->heroProps($selectedYear),
            $this->aboutProps($selectedYear),
            $this->sdgProps(),
            $this->speakerProps($selectedYear),
            $this->themeProps($selectedYear),
            $this->timelineProps($selectedYear),
            $this->venueProps($selectedYear),
            $this->hostProps($selectedYear),
            $this->faqProps($selectedYear),
            $this->contactProps($selectedYear),
        ));
    }

    // Judul dan singkatan dari editor landing / pengaturan konferensi;
    // logo null berarti header memakai logo UB.
    private function heroProps(int $year): array
    {
        $title = ConferenceTitle::where('year', $year)->first(['id', 'title', 'description', 'year']);

        return [
            'conference_title' => $title,
            'conference_abbreviation' => ConferenceSetting::first()?->conference_abbreviation ?: 'Seminar DAMPAK',
            'logo' => Upload::currentForType('logo')?->file_path,
        ];
    }

    // About diambil dari editor landing; bila tahun aktif belum diisi,
    // section Tentang menyembunyikan diri (null).
    private function aboutProps(int $year): array
    {
        $about = About::where('year', $year)->latest('id')->first();

        return ['about' => $about?->only(['id', 'title', 'content', 'image'])];
    }

    // SDGs berlaku lintas tahun; urutan mengikuti kolom `order` agar ikon
    // dan pita warna sama dengan urutan resmi.
    private function sdgProps(): array
    {
        return ['sdgs' => Sdg::orderBy('order')->get(['id', 'order', 'code', 'name_id', 'color'])];
    }

    // TODO(sasa, task 04): keynoteSpeakers, invitedSpeakers.
    private function speakerProps(int $year): array
    {
        return [];
    }

    // TODO(sasa, task 03): themes.
    private function themeProps(int $year): array
    {
        return [];
    }

    // TODO(tita, task 03): deadline_date, posters.
    private function timelineProps(int $year): array
    {
        return [];
    }

    // TODO(tita, task 02): venues.
    private function venueProps(int $year): array
    {
        return [];
    }

    // TODO(sasa, task 01): hosted_by, co_hosted_by, supported_by.
    private function hostProps(int $year): array
    {
        return [];
    }

    // TODO(sasa, task 02): faqs.
    private function faqProps(int $year): array
    {
        return [];
    }

    // TODO(tita, task 01): contacts.
    private function contactProps(int $year): array
    {
        return [];
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
