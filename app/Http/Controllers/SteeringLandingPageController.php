<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SteeringCommittee;
use App\Models\LandingSetting; 

class SteeringLandingPageController extends Controller
{
    public function index($year = null)
    {

        $activeYear = LandingSetting::where('is_active', true)->value('year');


        $years = LandingSetting::orderBy('year', 'desc')->pluck('year');


        $selectedYear = $year ?? $activeYear ?? ($years->isNotEmpty() ? $years->first() : date('Y'));

        
        $steeringCommittee = SteeringCommittee::where('year', $selectedYear)->get();

        
        return view('landingpage.committee.steering', compact('steeringCommittee', 'years', 'selectedYear'));
    }
}
