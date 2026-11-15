<?php

namespace App\Http\Controllers;

use App\Models\AbstractModel;
use App\Models\Prevconference;
use App\Support\LandingLayoutData;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PreviousConferences extends Controller
{
    public function index()
    {
        $years = Prevconference::query()
            ->select('year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year');
        $prevconferences = Prevconference::query()
            ->orderByDesc('year')
            ->get(['id', 'image', 'title', 'description', 'keynote', 'date', 'location', 'pdf', 'year']);

        return Inertia::render('Landing/PreviousConference', array_merge(LandingLayoutData::props(), [
            'prevconferences' => $prevconferences,
            'years' => $years,
        ]));
    }

    public function downloadAllPdf(Request $request)
    {
        $selectedYear = $request->get('year', now()->year);
        $abstracts = AbstractModel::whereYear('created_at', $selectedYear)->get();
        foreach ($abstracts as $abstract) {
            $abstract->formattedAuthors = $this->formatAuthors($abstract->authors);
            $abstract->formattedAffiliations = $this->formatAffiliations($abstract->affiliations);
        }

        $pdf = PDF::loadView('abstract.all_pdf', compact('abstracts', 'selectedYear'));

        return $pdf->stream('all-abstracts-' . $selectedYear . '.pdf');
    }

    private function formatAuthors($authors)
    {
        return preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', $authors);
    }

    private function formatAffiliations($affiliations)
    {
        $formattedAffiliations = preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', $affiliations);
        return nl2br($formattedAffiliations);
    }
}
