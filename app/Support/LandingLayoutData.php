<?php

namespace App\Support;

use App\Models\ConferenceSetting;
use App\Models\LandingSetting;
use App\Models\Sdg;
use App\Models\Upload;

/**
 * Data header dan footer landing yang dipakai semua halaman,
 * supaya tiap controller tidak mengirim ulang hal yang sama.
 */
class LandingLayoutData
{
    public static function props(): array
    {
        return [
            'layout' => [
                'abbreviation' => ConferenceSetting::first()?->conference_abbreviation ?? 'Seminar DAMPAK',
                'year' => (int) (LandingSetting::where('is_active', true)->value('year') ?? date('Y')),
                'logo' => Upload::currentForType('logo')?->file_path,
                'sdgs' => Sdg::orderBy('order')->get(['id', 'code', 'color']),
            ],
        ];
    }
}
