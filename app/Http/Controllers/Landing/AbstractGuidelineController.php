<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AbstractGuideline;
use App\Models\LandingSetting;
use App\Support\LandingLayoutData;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AbstractGuidelineController extends Controller
{
    public function showLandingPage($year = null)
    {
        $activeYear = LandingSetting::where('is_active', true)->value('year');
        $years = LandingSetting::orderBy('year', 'desc')->pluck('year');
        $selectedYear = $year ?? $activeYear ?? ($years->isNotEmpty() ? $years->first() : date('Y'));

        $latestGuideline = AbstractGuideline::where('year', $selectedYear)->first();

        return Inertia::render('Landing/Submission/AbstractGuideline', array_merge(LandingLayoutData::props(), [
            'guideline' => $latestGuideline ? [
                'content' => $latestGuideline->content,
                'pdf_file' => $latestGuideline->pdf_file,
                'year' => $latestGuideline->year,
            ] : null,
            'selectedYear' => $selectedYear,
        ]));
    }


    public function index()
    {
        $guidelines = AbstractGuideline::orderBy('year', 'desc')->get();

        return Inertia::render('LandingEditor/Submission/Abstract/Index', [
            'guidelines' => $guidelines,
        ]);
    }

    public function create()
    {
        return redirect()->route('landing.abstract-guidelines.index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'year' => 'required|integer',
            'content' => 'required',
            'pdf_file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:2048',
        ]);

        $pdfPath = $request->file('pdf_file') ? $request->file('pdf_file')->store('landingpage-editor', 'public') : null;

        AbstractGuideline::create([
            'year' => $request->year,
            'content' => $request->content,
            'pdf_file' => $pdfPath
        ]);

        return redirect()->route('landing.abstract-guidelines.index')->with('success', 'Abstract Guideline berhasil ditambahkan');
    }

    public function edit(AbstractGuideline $abstractGuideline)
    {
        return redirect()->route('landing.abstract-guidelines.index');
    }

    public function update(Request $request, AbstractGuideline $abstractGuideline)
    {
        $request->validate([
            'year' => 'required|integer',
            'content' => 'required',
            'pdf_file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:2048',
        ]);

        if ($request->hasFile('pdf_file')) {
            if ($abstractGuideline->pdf_file) {
                Storage::delete($abstractGuideline->pdf_file);
            }
            $pdfPath = $request->file('pdf_file')->store('landingpage-editor', 'public');
        } else {
            $pdfPath = $abstractGuideline->pdf_file;
        }

        $abstractGuideline->update([
            'year' => $request->year,
            'content' => $request->content,
            'pdf_file' => $pdfPath
        ]);

        return redirect()->route('landing.abstract-guidelines.index')->with('success', 'Abstract Guideline berhasil diperbarui');
    }

    public function destroy(AbstractGuideline $abstractGuideline)
    {
        if ($abstractGuideline->pdf_file) {
            Storage::delete($abstractGuideline->pdf_file);
        }
        $abstractGuideline->delete();

        return redirect()->route('landing.abstract-guidelines.index')->with('success', 'Abstract Guideline berhasil dihapus');
    }
}
