<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SteeringCommittee;
use App\Models\LandingSetting;
use App\Support\LandingLayoutData;

class SteeringLandingPageController extends Controller
{
    public function index($year = null)
    {

        $activeYear = LandingSetting::where('is_active', true)->value('year');


        $years = LandingSetting::orderBy('year', 'desc')->pluck('year');


        $selectedYear = $year ?? $activeYear ?? ($years->isNotEmpty() ? $years->first() : date('Y'));

        
        $steeringCommittee = SteeringCommittee::where('year', $selectedYear)->get();

        
        return Inertia::render('Landing/Committee/Steering', array_merge(LandingLayoutData::props(), [
            'members' => $steeringCommittee->map->only(['id', 'name', 'institution', 'country']),
            'selectedYear' => (int) $selectedYear,
        ]));
    }
}
