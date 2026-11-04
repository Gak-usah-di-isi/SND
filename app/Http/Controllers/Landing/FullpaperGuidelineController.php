<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FullpaperGuideline;
use App\Models\LandingSetting;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FullpaperGuidelineController extends Controller
{
    public function showLandingPage($year = null)
    {
        $activeYear = LandingSetting::where('is_active', true)->value('year');
        $years = LandingSetting::orderBy('year', 'desc')->pluck('year');
        $selectedYear = $year ?? $activeYear ?? ($years->isNotEmpty() ? $years->first() : date('Y'));
        $guideline = FullpaperGuideline::where('year', $selectedYear)->first();

        return view('landingpage.submission.fullpaper', compact('guideline', 'years', 'selectedYear'));
    }


    public function index()
    {
        $guidelines = FullpaperGuideline::orderBy('year', 'desc')->get();

        return Inertia::render('LandingEditor/Submission/Fullpaper/Index', [
            'guidelines' => $guidelines,
        ]);
    }

    public function create()
    {
        return redirect()->route('landing.fullpaper-guidelines.index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'year' => 'required|integer',
            'content' => 'required',
            'pdf_file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:2048',
        ]);

        $pdfPath = $request->file('pdf_file') ? $request->file('pdf_file')->store('landingpage-editor', 'public') : null;

        FullpaperGuideline::create([
            'year' => $request->year,
            'content' => $request->content,
            'pdf_file' => $pdfPath
        ]);

        return redirect()->route('landing.fullpaper-guidelines.index')->with('success', 'Fullpaper Guideline berhasil ditambahkan');
    }

    public function edit(FullpaperGuideline $fullpaperGuideline)
    {
        return redirect()->route('landing.fullpaper-guidelines.index');
    }

    public function update(Request $request, FullpaperGuideline $fullpaperGuideline)
    {
        $request->validate([
            'year' => 'required|integer',
            'content' => 'required',
            'pdf_file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:2048',
        ]);

        // Hapus file lama jika ada file baru
        if ($request->hasFile('pdf_file')) {
            if ($fullpaperGuideline->pdf_file) {
                Storage::disk('public')->delete($fullpaperGuideline->pdf_file);
            }
            $pdfPath = $request->file('pdf_file')->store('landingpage-editor', 'public');
        } else {
            $pdfPath = $fullpaperGuideline->pdf_file;
        }

        $fullpaperGuideline->update([
            'year' => $request->year,
            'content' => $request->content,
            'pdf_file' => $pdfPath
        ]);

        return redirect()->route('landing.fullpaper-guidelines.index')->with('success', 'Fullpaper Guideline berhasil diperbarui');
    }

    public function destroy(FullpaperGuideline $fullpaperGuideline)
    {
        if ($fullpaperGuideline->pdf_file) {
            Storage::disk('public')->delete($fullpaperGuideline->pdf_file);
        }
        $fullpaperGuideline->delete();

        return redirect()->route('landing.fullpaper-guidelines.index')->with('success', 'Fullpaper Guideline berhasil dihapus');
    }
}
