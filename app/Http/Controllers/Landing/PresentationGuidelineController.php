<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PresentationGuideline;
use App\Models\LandingSetting;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PresentationGuidelineController extends Controller
{
    public function showLandingPage($year = null)
    {
        $activeYear = LandingSetting::where('is_active', true)->value('year');
        $years = LandingSetting::orderBy('year', 'desc')->pluck('year');
        $selectedYear = $year ?? $activeYear ?? ($years->isNotEmpty() ? $years->first() : date('Y'));

        $guideline = PresentationGuideline::where('year', $selectedYear)->first();

        return view('landingpage.submission.presentation', compact('guideline', 'years', 'selectedYear'));
    }

    public function index()
    {
        $guidelines = PresentationGuideline::orderBy('year', 'desc')->get();

        return Inertia::render('LandingEditor/Submission/Presentation/Index', [
            'guidelines' => $guidelines,
        ]);
    }

    public function create()
    {
        return redirect()->route('landing.presentation-guidelines.index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'year' => 'required|integer',
            'content' => 'required',
            'pdf_file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:2048',
        ]);

        $pdfPath = $request->file('pdf_file') ? $request->file('pdf_file')->store('landingpage-editor', 'public') : null;

        PresentationGuideline::create([
            'year' => $request->year,
            'content' => $request->content,
            'pdf_file' => $pdfPath
        ]);

        return redirect()->route('landing.presentation-guidelines.index')->with('success', 'Presentation Guideline berhasil ditambahkan');
    }

    public function edit(PresentationGuideline $presentationGuideline)
    {
        return redirect()->route('landing.presentation-guidelines.index');
    }

    public function update(Request $request, PresentationGuideline $presentationGuideline)
    {
        $request->validate([
            'year' => 'required|integer',
            'content' => 'required',
            'pdf_file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:2048',
        ]);

        if ($request->hasFile('pdf_file')) {
            if ($presentationGuideline->pdf_file) {
                Storage::delete($presentationGuideline->pdf_file);
            }
            $pdfPath = $request->file('pdf_file')->store('landingpage-editor', 'public');
        } else {
            $pdfPath = $presentationGuideline->pdf_file;
        }

        $presentationGuideline->update([
            'year' => $request->year,
            'content' => $request->content,
            'pdf_file' => $pdfPath
        ]);

        return redirect()->route('landing.presentation-guidelines.index')->with('success', 'Presentation Guideline berhasil diperbarui');
    }

    public function destroy(PresentationGuideline $presentationGuideline)
    {
        if ($presentationGuideline->pdf_file) {
            Storage::delete($presentationGuideline->pdf_file);
        }
        $presentationGuideline->delete();

        return redirect()->route('landing.presentation-guidelines.index')->with('success', 'Presentation Guideline berhasil dihapus');
    }
}
