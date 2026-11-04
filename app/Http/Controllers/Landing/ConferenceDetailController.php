<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ConferenceDetail;
use Inertia\Inertia;

class ConferenceDetailController extends Controller
{
    public function index()
    {
        $conferences = ConferenceDetail::latest()->get();

        return Inertia::render('LandingEditor/ConferenceProgram/Detail/Index', [
            'conferences' => $conferences,
        ]);
    }

    public function create()
    {
        return redirect()->route('landing.conference-detail.index');
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'title' => 'required|string|max:255',
            'theme' => 'required|string|max:255',
            'university' => 'required|string|max:255',
            'hosted' => 'required|string|max:255',
            'date' => 'required|string', // Ubah ke date
            'year' => 'required|integer',
        ]);

        ConferenceDetail::create($validate);

        return redirect()->route('landing.conference-detail.index')->with('success', 'Conference created successfully.');
    }

    public function edit(ConferenceDetail $conferenceDetail)
    {
        return redirect()->route('landing.conference-detail.index');
    }

    public function update(Request $request, ConferenceDetail $conferenceDetail)
    {
        $validate = $request->validate([
            'title' => 'required|string|max:255',
            'theme' => 'required|string|max:255',
            'university' => 'required|string|max:255',
            'hosted' => 'required|string|max:255',
            'date' => 'required|string', // Ubah ke date
            'year' => 'required|integer',
        ]);

        $conferenceDetail->update($validate);

        return redirect()->route('landing.conference-detail.index')->with('success', 'Conference updated successfully.');
    }

    public function destroy(ConferenceDetail $conferenceDetail)
    {
        $conferenceDetail->delete();

        return redirect()->route('landing.conference-detail.index')->with('success', 'Conference deleted successfully.');
    }
}
