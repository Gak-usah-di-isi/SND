<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DeadlineDate;
use App\Models\Year;
use Inertia\Inertia;

class DeadlineDateController extends Controller
{
    public function index(Request $request)
    {
        // Ambil daftar tahun unik dari kolom 'year' di deadline_dates
        $years = DeadlineDate::select('year')->distinct()->orderByDesc('year')->pluck('year');
    
        $query = DeadlineDate::query();
    
        // Filter berdasarkan tahun yang dipilih
        if ($request->filled('year')) {
            $query->where('year', $request->year);
        }
    
        $deadlines = $query->orderBy('date')->get();
    
        return Inertia::render('LandingEditor/LandingPage/DeadlineDates/Index', [
            'deadlines' => $deadlines,
            'years' => $years,
            'filters' => ['year' => $request->year],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'year' => 'required|integer|min:2024|max:' . date('Y'),
        ]);

        DeadlineDate::create($request->all());

        return redirect()->route('landing.deadlines.index')->with('success', 'Deadline added successfully.');
    }

    public function update(Request $request, DeadlineDate $deadline)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'year' => 'required|integer|min:2024|max:' . date('Y'),
        ]);

        $deadline->update($request->all());

        return redirect()->route('landing.deadlines.index')->with('success', 'Deadline updated successfully.');
    }

    public function destroy(DeadlineDate $deadline)
    {
        $deadline->delete();
        return redirect()->route('landing.deadlines.index')->with('success', 'Deadline deleted successfully.');
    }
}
