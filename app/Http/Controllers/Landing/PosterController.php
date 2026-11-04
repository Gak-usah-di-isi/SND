<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Poster;
use App\Models\LandingSetting;
use App\Models\Year;
use Illuminate\Support\Facades\Storage;

class PosterController extends Controller
{
    public function index()
    {
        $activeYear = LandingSetting::where('is_active', true)->value('year')
            ?? Year::where('is_active', true)->value('year')
            ?? (int) date('Y');

        $years = LandingSetting::pluck('year')
            ->merge(Year::pluck('year'))
            ->merge(Poster::pluck('year'))
            ->push($activeYear)
            ->filter()
            ->unique()
            ->sortDesc()
            ->values();

        $posters = Poster::latest()->get();
        return Inertia::render('LandingEditor/LandingPage/Poster/Index', [
            'posters' => $posters,
            'years' => $years,
            'activeYear' => $activeYear,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'year' => 'required|digits:4|integer|min:2000|max:' . ((int) date('Y') + 5),
            'link' => 'nullable|url',
        ]);

        $imagePath = $request->file('image')->store('posters', 'public');

        Poster::create([
            'image' => $imagePath,
            'year' => $request->year,
            'link' => $request->link ?? null, // Menghindari NULL yang tidak eksplisit
        ]);

        return redirect()->route('landing.poster.index')->with('success', 'Poster berhasil ditambahkan.');
    }



    public function update(Request $request, Poster $poster)
    {
        $request->validate([
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'year' => 'required|digits:4|integer|min:2000|max:' . ((int) date('Y') + 5),
            'link' => 'nullable|url',
        ]);

        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($poster->image && Storage::exists('public/' . $poster->image)) {
                Storage::delete('public/' . $poster->image);
            }

            // Simpan gambar baru
            $poster->image = $request->file('image')->store('posters', 'public');
        }

        $poster->year = $request->year;
        $poster->link = $request->link ?? null;
        $poster->save();

        return redirect()->route('landing.poster.index')->with('success', 'Poster berhasil diperbarui.');
    }

    public function destroy(Poster $poster)
    {
        if ($poster->image && Storage::exists('public/' . $poster->image)) {
            Storage::delete('public/' . $poster->image);
        }

        $poster->delete();

        return redirect()->route('landing.poster.index')->with('success', 'Poster berhasil dihapus.');
    }
}
