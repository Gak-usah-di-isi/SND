<?php

namespace App\Http\Controllers;

use App\Models\AbstractModel;
use App\Support\LandingLayoutData;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class ArchiveController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Landing/Archives', array_merge(
            LandingLayoutData::props(),
            $this->archiveProps($request),
        ));
    }

    public function show(Request $request, $year)
    {
        return Inertia::render('Landing/Archives', array_merge(
            LandingLayoutData::props(),
            $this->archiveProps($request, $year),
        ));
    }

    // Tahun-tahun abstrak yang diterima dan daftar abstrak pada tahun terpilih.
    // Halaman /archives/{year} memakai tahun dari URL, sedangkan /archives?year=
    // memakai query string; tanpa keduanya dipakai tahun terbaru.
    private function archiveProps(Request $request, $year = null): array
    {
        $years = AbstractModel::where('status', 'accepted')
            ->selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year')
            ->map(fn ($value) => (int) $value)
            ->values();

        $requestedYear = $year !== null ? (int) $year : $request->input('year');
        $selectedYear = $requestedYear !== null && $requestedYear !== ''
            ? (int) $requestedYear
            : $years->first();

        $abstracts = $selectedYear
            ? AbstractModel::whereYear('created_at', $selectedYear)
                ->where('status', 'accepted')
                ->orderBy('title')
                ->get(['id', 'title', 'authors', 'presentation_type'])
            : collect();

        return [
            'years' => $years,
            'selectedYear' => $selectedYear ?: null,
            'abstracts' => $abstracts,
        ];
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

    public function downloadPdf($id)
    {
        // Ambil data abstrak berdasarkan ID
        $abstract = AbstractModel::with('symposium')->findOrFail($id);

        // Format penulis dan afiliasi, jika diperlukan
        $formattedAuthors = $this->formatAuthors($abstract->authors);
        $formattedAffiliations = $this->formatAffiliations($abstract->affiliations);

        // Generate PDF dari view yang sudah disiapkan
        $pdf = PDF::loadView('abstracts.pdf', compact('abstract', 'formattedAuthors', 'formattedAffiliations'));

        // Unduh file PDF
        return $pdf->download('abstract-detail-' . $id . '.pdf');
    }
}
