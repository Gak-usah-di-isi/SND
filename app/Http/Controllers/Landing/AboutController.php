<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\About;
use App\Models\LandingSetting;
use App\Models\Year;
use Illuminate\Support\Facades\Storage;

class AboutController extends Controller
{
    public function index(Request $request)
    {
        $activeYear = LandingSetting::where('is_active', true)->value('year')
            ?? Year::where('is_active', true)->value('year')
            ?? (int) date('Y');

        $years = LandingSetting::pluck('year')
            ->merge(Year::pluck('year'))
            ->merge(About::pluck('year'))
            ->push($activeYear)
            ->filter()
            ->unique()
            ->sortDesc()
            ->values();

        $query = About::orderByDesc('year');
        if ($request->has('year') && !empty($request->year)) {
            $query->where('year', $request->year);
        }
        $abouts = $query->get();

        return Inertia::render('LandingEditor/LandingPage/About/Index', [
            'abouts' => $abouts,
            'years' => $years,
            'activeYear' => $activeYear
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255|min:5',
            'content' => 'required|string|min:10',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048|dimensions:min_width=600,min_height=400',
            'year' => 'required|integer|min:2000|max:' . ((int) date('Y') + 5), // Validasi tahun
        ], [
            'title.required' => 'Judul harus diisi.',
            'title.min' => 'Judul minimal 5 karakter.',
            'title.max' => 'Judul maksimal 255 karakter.',
            'content.required' => 'Konten harus diisi.',
            'content.min' => 'Konten minimal 10 karakter.',
            'image.required' => 'Gambar harus diunggah.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format yang diperbolehkan: PNG, JPEG, JPG.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
            'image.dimensions' => 'Ukuran gambar minimal 600x400 px.',
            'year.required' => 'Tahun harus diisi.',
            'year.integer' => 'Tahun harus berupa angka.',
            'year.min' => 'Tahun minimal 2024.',
            'year.max' => 'Tahun maksimal ' . date('Y') . '.',
        ]);
    
        // Simpan gambar
        $path = $request->file('image') ? $request->file('image')->store('abouts', 'public') : null;
    
        // Simpan data ke database
        About::create([
            'title' => $request->title,
            'content' => $request->content,
            'image' => $path,
            'year' => $request->year, // Tambahkan tahun
        ]);
    
        return redirect()->route('landing.abouts.index')->with('success', 'About section created successfully.');
    }



    public function update(Request $request, About $about)
    {
        $request->validate([
            'title' => 'required|string|max:255|min:5',
            'content' => 'required|string|min:10',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048|dimensions:min_width=600,min_height=400',
            'year' => 'required|integer|min:2000|max:' . ((int) date('Y') + 5), // Validasi tahun
        ], [
            'title.required' => 'Judul harus diisi.',
            'title.min' => 'Judul minimal 5 karakter.',
            'title.max' => 'Judul maksimal 255 karakter.',
            'content.required' => 'Konten harus diisi.',
            'content.min' => 'Konten minimal 10 karakter.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format yang diperbolehkan: PNG, JPEG, JPG.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
            'image.dimensions' => 'Ukuran gambar minimal 600x400 px.',
            'year.required' => 'Tahun harus diisi.',
            'year.integer' => 'Tahun harus berupa angka.',
            'year.min' => 'Tahun minimal 2024.',
            'year.max' => 'Tahun maksimal ' . date('Y') . '.',
        ]);
    
        // Update data
        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($about->image); // Hapus gambar lama
            $path = $request->file('image')->store('abouts', 'public'); // Simpan gambar baru
            $about->update([
                'title' => $request->title,
                'content' => $request->content,
                'image' => $path,
                'year' => $request->year, // Update tahun
            ]);
        } else {
            $about->update([
                'title' => $request->title,
                'content' => $request->content,
                'year' => $request->year, // Update tahun
            ]);
        }
    
        return redirect()->route('landing.abouts.index')->with('success', 'About section updated successfully.');
    }

    public function destroy(About $about)
    {
        if ($about->image) {
            Storage::disk('public')->delete($about->image);
        }
        $about->delete();

        return redirect()->route('landing.abouts.index')->with('success', 'About section deleted successfully.');
    }
}
