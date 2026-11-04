<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Speaker;
use App\Models\LandingSetting;
use App\Models\Year;
use Illuminate\Support\Facades\Storage;

class SpeakerController extends Controller
{
    public function index(Request $request)
    {
        $activeYear = LandingSetting::where('is_active', true)->value('year')
            ?? Year::where('is_active', true)->value('year')
            ?? (int) date('Y');

        $years = LandingSetting::pluck('year')
            ->merge(Year::pluck('year'))
            ->merge(Speaker::pluck('year'))
            ->push($activeYear)
            ->filter()
            ->unique()
            ->sortDesc()
            ->values();

        $selectedYear = $request->input('year');
        $speakers = Speaker::when($selectedYear, function ($query, $selectedYear) {
            return $query->where('year', $selectedYear);
        })->get();

        return Inertia::render('LandingEditor/LandingPage/Speakers/Index', [
            'speakers' => $speakers,
            'years' => $years,
            'activeYear' => $activeYear,
            'selectedYear' => $selectedYear
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'role' => ['required', 'in:keynote_speaker,invited_speaker'],
            'institution' => ['required', 'string', 'min:3', 'max:255'],
            'image' => ['required', 'file', 'image', 'max:2048', 'mimes:jpeg,png,jpg'],
            'country' => ['required', 'string', 'min:3', 'max:255'],
            'year' => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 5)],
            'session_topic' => ['nullable', 'string', 'max:255'],
            'await_confirmation' => ['boolean'],
        ], [
            'name.required' => 'Nama speaker wajib diisi.',
            'name.min' => 'Nama speaker minimal 3 karakter.',
            'name.max' => 'Nama speaker tidak boleh lebih dari 255 karakter.',
            'role.required' => 'Peran speaker wajib diisi.',
            'role.in' => 'Peran speaker tidak valid.',
            'institution.required' => 'Institusi wajib diisi.',
            'institution.min' => 'Institusi minimal 3 karakter.',
            'institution.max' => 'Institusi tidak boleh lebih dari 255 karakter.',
            'image.required' => 'Gambar speaker wajib diunggah.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format file tidak didukung. Harap unggah gambar dengan format PNG, JPEG, atau JPG.',
            'image.max' => 'Ukuran gambar tidak boleh lebih dari 2MB.',
            'country.required' => 'Negara wajib diisi.',
            'country.min' => 'Negara minimal 3 karakter.',
            'country.max' => 'Negara tidak boleh lebih dari 255 karakter.',
            'year.required' => 'Tahun wajib diisi.',
            'year.integer' => 'Tahun harus berupa angka.',
            'year.min' => 'Tahun tidak valid.',
            'year.max' => 'Tahun tidak valid.',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('speakers', 'public');
            $validatedData['image'] = $imagePath;
        }

        Speaker::create($validatedData);

        return redirect()->route('landing.speakers.index')->with('success', 'Speaker berhasil ditambahkan.');
    }



    public function update(Request $request, $id)
    {
        $speaker = Speaker::findOrFail($id);

        $validatedData = $request->validate([
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'role' => ['required', 'in:keynote_speaker,invited_speaker'],
            'institution' => ['required', 'string', 'min:3', 'max:255'],
            'image' => ['nullable', 'file', 'image', 'max:2048', 'mimes:jpeg,png,jpg'],
            'country' => ['required', 'string', 'min:3', 'max:255'],
            'year' => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 5)],
            'session_topic' => ['nullable', 'string', 'max:255'],
            'await_confirmation' => ['boolean'],
        ], [
            'name.required' => 'Nama speaker wajib diisi.',
            'name.min' => 'Nama speaker minimal 3 karakter.',
            'name.max' => 'Nama speaker tidak boleh lebih dari 255 karakter.',
            'role.required' => 'Peran speaker wajib diisi.',
            'role.in' => 'Peran speaker tidak valid.',
            'institution.required' => 'Institusi wajib diisi.',
            'institution.min' => 'Institusi minimal 3 karakter.',
            'institution.max' => 'Institusi tidak boleh lebih dari 255 karakter.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format file tidak didukung. Harap unggah gambar dengan format PNG, JPEG, atau JPG.',
            'image.max' => 'Ukuran gambar tidak boleh lebih dari 2MB.',
            'country.required' => 'Negara wajib diisi.',
            'country.min' => 'Negara minimal 3 karakter.',
            'country.max' => 'Negara tidak boleh lebih dari 255 karakter.',
            'year.required' => 'Tahun wajib diisi.',
            'year.integer' => 'Tahun harus berupa angka.',
            'year.min' => 'Tahun tidak valid.',
            'year.max' => 'Tahun tidak valid.',
        ]);

        if ($request->hasFile('image')) {
            if ($speaker->image) {
                Storage::disk('public')->delete($speaker->image);
            }

            $imagePath = $request->file('image')->store('speakers', 'public');
            $validatedData['image'] = $imagePath;
        } else {
            $validatedData['image'] = $speaker->image;
        }

        $speaker->update($validatedData);

        return redirect()->route('landing.speakers.index')->with('success', 'Speaker berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $speaker = Speaker::findOrFail($id);
        if ($speaker->image) {
            Storage::disk('public')->delete($speaker->image);
        }
        $speaker->delete();
        return redirect()->route('landing.speakers.index')->with('success', 'Speaker berhasil dihapus.');
    }
}