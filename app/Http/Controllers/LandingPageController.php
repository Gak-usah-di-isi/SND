<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\LandingSetting;
use App\Models\Theme;
use App\Models\Hotel;
use App\Models\Contact;

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

    // TODO(rafif, task 04): conference_title, conference_abbreviation, logo.
    private function heroProps(int $year): array
    {
        return [];
    }

    // TODO(rafif, task 02): about.
    private function aboutProps(int $year): array
    {
        return [];
    }

    // TODO(rafif, task 03): sdgs.
    private function sdgProps(): array
    {
        return [];
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
        return [
            'contacts' => Contact::where('year', $year)->get([
                'id',
                'phone1',
                'phone1_name',
                'phone2',
                'phone2_name',
                'email',
                'address',
            ]),
        ];
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
