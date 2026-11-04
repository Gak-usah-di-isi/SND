<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ConferenceObjective;
use App\Models\LandingSetting;
use Inertia\Inertia;

class ConferenceObjectiveController extends Controller
{
    public function index(Request $request)
    {
        $activeYear = LandingSetting::where('is_active', true)->value('year');
        $query = ConferenceObjective::orderBy('order_number')->orderBy('id');

        if ($request->filled('year')) {
            $query->where('year', $request->year);
        }

        $objectives = $query->paginate(15)->withQueryString();
        $years = ConferenceObjective::select('year')->distinct()->orderByDesc('year')->pluck('year');

        return Inertia::render('LandingEditor/LandingPage/ConferenceObjective/Index', [
            'objectives' => $objectives,
            'years'      => $years,
            'activeYear' => $activeYear,
            'filters'    => ['year' => $request->year ?? ''],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'year'         => ['required', 'digits:4', 'integer', 'min:2024'],
            'icon'         => ['required', 'string', 'max:100'],
            'content'      => ['required', 'string', 'max:500'],
            'order_number' => ['nullable', 'integer', 'min:0', 'max:255'],
            'is_active'    => ['nullable', 'boolean'],
        ]);

        $validated['is_active']    = $request->boolean('is_active', true);
        $validated['order_number'] = $request->input('order_number', 0);

        ConferenceObjective::create($validated);

        return redirect()->route('landing.conference-objectives.index')
            ->with('success', 'Objective berhasil ditambahkan.');
    }

    public function update(Request $request, ConferenceObjective $conferenceObjective)
    {
        $validated = $request->validate([
            'year'         => ['required', 'digits:4', 'integer', 'min:2024'],
            'icon'         => ['required', 'string', 'max:100'],
            'content'      => ['required', 'string', 'max:500'],
            'order_number' => ['nullable', 'integer', 'min:0', 'max:255'],
            'is_active'    => ['nullable', 'boolean'],
        ]);

        $validated['is_active']    = $request->boolean('is_active', true);
        $validated['order_number'] = $request->input('order_number', 0);

        $conferenceObjective->update($validated);

        return redirect()->route('landing.conference-objectives.index')
            ->with('success', 'Objective berhasil diperbarui.');
    }

    public function destroy(ConferenceObjective $conferenceObjective)
    {
        $conferenceObjective->delete();

        return redirect()->route('landing.conference-objectives.index')
            ->with('success', 'Objective berhasil dihapus.');
    }
}
