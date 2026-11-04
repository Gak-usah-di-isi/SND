<?php

namespace App\Http\Controllers\Landing;

use Illuminate\Http\Request;
use App\Models\ConferenceProgram;
use App\Models\LandingSetting;

class ConferenceProgramDetailsController extends Controller
{
    public function index(Request $request)
    {

        $activeYear = LandingSetting::where('is_active', true)->value('year');
        $years = LandingSetting::orderBy('year', 'desc')->pluck('year');
        $selectedYear = $request->year ?? $activeYear ?? ($years->isNotEmpty() ? $years->first() : date('Y'));

        $conferences = ConferenceProgram::where('year', $selectedYear)->get();
        $programs = ConferenceProgram::where('year', $selectedYear)
            ->orderBy('day_number')
            ->orderBy('start_time')
            ->get();
        $programsByDay = $programs->groupBy('day_number');

        return view('landingpage.conference.program', compact('conferences', 'programsByDay', 'years', 'selectedYear'));
    }
}
