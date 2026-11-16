<?php

namespace App\Http\Controllers;

use App\Models\AbstractModel;
use App\Support\LandingLayoutData;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArchiveController extends Controller
{
    public function index(Request $request)
    {
        return $this->renderArchives($request);
    }

    public function show(Request $request, $year)
    {
        return $this->renderArchives($request, (int) $year);
    }

    private function renderArchives(Request $request, ?int $year = null)
    {
        $years = AbstractModel::query()
            ->where('status', 'accepted')
            ->selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year');

        $requestedYear = $request->query('year');

        $selectedYear = $year
            ?? ($requestedYear !== null
                ? (int) $requestedYear
                : (int) ($years->first() ?? 0));

        $search = trim((string) $request->query('search', ''));

        $query = AbstractModel::query()
            ->where('status', 'accepted');

        if ($selectedYear > 0) {
            $query->whereYear('created_at', $selectedYear);
        } else {
            $query->whereRaw('1 = 0');
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('authors', 'like', "%{$search}%");
            });
        }

        $abstracts = $query
            ->latest('created_at')
            ->paginate(20, [
                'id',
                'title',
                'authors',
                'presentation_type',
            ])
            ->withQueryString();

        return Inertia::render('Landing/Archives', array_merge(
            LandingLayoutData::props(),
            [
                'years' => $years,
                'selectedYear' => $selectedYear ?: null,
                'search' => $search,
                'abstracts' => $abstracts,
            ]
        ));
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
