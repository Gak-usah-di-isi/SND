<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use App\Models\ConferenceTitle;
use App\Models\LandingSetting;
use App\Models\Year;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConferenceTitleController extends Controller
{
    public function index(Request $request)
    {
        $activeYear = LandingSetting::where('is_active', true)->value('year')
            ?? Year::where('is_active', true)->value('year')
            ?? (int) date('Y');

        $years = LandingSetting::pluck('year')
            ->merge(Year::pluck('year'))
            ->merge(ConferenceTitle::pluck('year'))
            ->push($activeYear)
            ->filter()
            ->unique()
            ->sortDesc()
            ->values();

        $query = ConferenceTitle::orderByDesc('year');

        // Jika ada request filter tahun, tambahkan kondisi
        if ($request->has('year') && !empty($request->year)) {
            $query->where('year', $request->year);
        }

        $conferenceTitles = $query->get();

        return Inertia::render('LandingEditor/LandingPage/Title/Index', [
            'conferenceTitles' => $conferenceTitles,
            'years' => $years,
            'activeYear' => $activeYear
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => [
                'required',
                'string',
                'min:5',
            ],
            'description' => [
                'required',
                'string',
                'min:10',
            ],
            'year' => 'required|integer|min:2000|max:' . ((int) date('Y') + 5),
        ], [
            'title.required' => 'Title tidak boleh kosong.',
            'title.string' => 'Title harus berupa teks.',
            'title.min' => 'Title harus memiliki minimal 5 karakter.',

            'description.required' => 'Deskripsi tidak boleh kosong.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.min' => 'Deskripsi harus memiliki minimal 10 karakter.',

            'year.required' => 'Tahun tidak boleh kosong.',
            'year.integer' => 'Tahun harus berupa angka.',
            'year.min' => 'Tahun minimal adalah 2000.',
            'year.max' => 'Tahun tidak boleh lebih dari ' . date('Y') . '.',
        ]);

        // Cek apakah sudah ada conference title dengan tahun yang sama
        if (ConferenceTitle::where('year', $request->year)->exists()) {
            return redirect()->back()->withErrors(['year' => 'Conference Title untuk tahun ini sudah ada!']);
        }

        ConferenceTitle::create($request->all());

        return redirect()->route('landing.conference-title.index')->with('success', 'Conference Title created successfully.');
    }




    public function update(Request $request, ConferenceTitle $conferenceTitle)
    {
        $request->validate([
            'title' => [
                'required',
                'string',
                'min:5',
            ],
            'description' => [
                'required',
                'string',
                'min:10',
            ],
            'year' => 'required|integer|min:2000|max:' . ((int) date('Y') + 5),
        ], [
            'title.required' => 'Title tidak boleh kosong.',
            'title.string' => 'Title harus berupa teks.',
            'title.min' => 'Title harus memiliki minimal 5 karakter.',

            'description.required' => 'Deskripsi tidak boleh kosong.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.min' => 'Deskripsi harus memiliki minimal 10 karakter.',

            'year.required' => 'Tahun tidak boleh kosong.',
            'year.integer' => 'Tahun harus berupa angka.',
            'year.min' => 'Tahun minimal adalah 2000.',
            'year.max' => 'Tahun tidak boleh lebih dari ' . date('Y') . '.',
        ]);

        $conferenceTitle->update($request->all());

        return redirect()->route('landing.conference-title.index')->with('success', 'Conference Title updated successfully.');
    }

    public function destroy(ConferenceTitle $conferenceTitle)
    {
        $conferenceTitle->delete();

        return redirect()->route('landing.conference-title.index')->with('success', 'Conference Title deleted successfully.');
    }
}
