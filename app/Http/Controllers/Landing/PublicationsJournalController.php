<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PublicationsJournal;
use App\Models\PublicationSetting;
use App\Models\LandingSetting;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Inertia\Inertia;

class PublicationsJournalController extends Controller
{
    public function index(Request $request)
    {
        // Mengambil daftar tahun berdasarkan data yang tersedia di tabel
        $years = PublicationsJournal::select('year')->distinct()->orderByDesc('year')->pluck('year');
        if ($years->isEmpty()) {
            $years = collect([date('Y')]);
        }

        $activeYear = LandingSetting::where('is_active', true)->first();
        $targetYear = $request->year ?: ($activeYear?->year ?? date('Y'));

        // Ambil data pengaturan publication (teks proceedings, teks jurnal, status aktif)
        $publicationSetting = PublicationSetting::getOrDefault($targetYear);

        // Mengambil daftar image_type yang unik
        $imageTypes = PublicationsJournal::select('image_type')->distinct()->pluck('image_type');

        // Query dasar
        $query = PublicationsJournal::query();

        // Filter berdasarkan tahun
        if (!empty($request->year)) {
            $query->where('year', $request->year);
        } else if ($targetYear) {
            $query->where('year', $targetYear);
        }

        // Filter berdasarkan image type
        if (!empty($request->image_type)) {
            $query->where('image_type', $request->image_type);
        }

        // Menampilkan 10 item per halaman dengan paginasi
        $publications_journals = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('LandingEditor/LandingPage/PublicationsJournal/Index', [
            'publications_journals' => $publications_journals,
            'years' => $years,
            'imageTypes' => $imageTypes,
            'filters' => [
                'year' => $request->year ?? (string)$targetYear,
                'image_type' => $request->image_type ?? '',
            ],
            'publicationSetting' => $publicationSetting,
            'activeYear' => $targetYear,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'year' => ['required'],
            'proceedings_text' => ['nullable', 'string'],
            'journal_title' => ['nullable', 'string', 'max:255'],
            'journal_text' => ['nullable', 'string'],
            'is_journal_active' => ['required', 'boolean'],
        ]);

        PublicationSetting::updateOrCreate(
            ['year' => $validated['year']],
            [
                'proceedings_text' => $validated['proceedings_text'] ?? '',
                'journal_title' => $validated['journal_title'] ?? 'Journal Publication Opportunity',
                'journal_text' => $validated['journal_text'] ?? '',
                'is_journal_active' => (bool) $validated['is_journal_active'],
            ]
        );

        return redirect()->back()->with('success', 'Pengaturan teks publikasi & status jurnal berhasil diperbarui.');
    }

    
    


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'image_type' => ['required', Rule::in(['publications_journal', 'hosted_by', 'co_hosted_by', 'supported_by'])],
            'image_path.*' => ['required', 'file', 'image', 'max:2048', 'mimes:jpeg,png,jpg'], // Validasi multiple file
            'year' => ['required', 'integer', 'min:2024', 'max:' . Carbon::now()->year],
        ], [
            'image_path.*.mimes' => 'Format file tidak didukung. Harap unggah gambar dengan format PNG, JPEG, atau JPG.',
            'year.min' => 'Tahun minimal adalah 2024.',
            'year.max' => 'Tahun tidak boleh lebih dari tahun sekarang.',
        ]);
    
        if ($request->hasFile('image_path')) {
            foreach ($request->file('image_path') as $file) {
                $imagePath = $file->store('publications_journals', 'public');
                PublicationsJournal::create([
                    'image_type' => $request->image_type,
                    'image_path' => $imagePath,
                    'year' => $request->year,
                ]);
            }
        }
    
        return redirect()->route('landing.publications-journal.index')->with('success', 'Publications created successfully.');
    }



    public function update(Request $request, PublicationsJournal $publications_journal)
    {
        $validatedData = $request->validate([
            'image_type' => ['required', Rule::in(['publications_journal', 'hosted_by', 'co_hosted_by', 'supported_by'])],
            'image_path.*' => ['nullable', 'file', 'image', 'max:2048', 'mimes:jpeg,png,jpg'],
            'year' => ['required', 'integer', 'min:2024', 'max:' . Carbon::now()->year],
        ], [
            'image_path.*.mimes' => 'Format file tidak didukung. Harap unggah gambar dengan format PNG, JPEG, atau JPG.',
            'year.min' => 'Tahun minimal adalah 2024.',
            'year.max' => 'Tahun tidak boleh lebih dari tahun sekarang.',
        ]);
    
        // Mengecek apakah ada file baru
        if ($request->hasFile('image_path')) {
            // Hapus gambar lama jika ada
            if (file_exists(public_path('storage/' . $publications_journal->image_path))) {
                unlink(public_path('storage/' . $publications_journal->image_path));
            }
    
            // Menyimpan gambar baru
            $imagePath = $request->file('image_path')->store('publications_journals', 'public');
            
            // Perbarui entri dengan gambar baru
            $publications_journal->update([
                'image_type' => $request->image_type,
                'image_path' => $imagePath,
                'year' => $request->year,
            ]);
        } else {
            // Jika tidak ada file baru, cukup perbarui data lain
            $publications_journal->update([
                'image_type' => $request->image_type,
                'year' => $request->year,
            ]);
        }
    
        return redirect()->route('landing.publications-journal.index')->with('success', 'Publication updated successfully.');
    }
    
    

    public function destroy(PublicationsJournal $publications_journal)
    {
        $publications_journal->delete();
        return redirect()->route('landing.publications-journal.index')->with('success', 'Publication deleted successfully.');
    }
}
