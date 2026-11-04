<?php

namespace App\Http\Controllers;

use App\Models\AbstractModel;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ArchiveController extends Controller
{
    public function index(Request $request)
    {
        // Ambil tahun-tahun unik dari abstrak yang diterima
        $years = AbstractModel::where('status', 'accepted')
            ->selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year');
    
        // Ambil tahun yang dipilih atau tahun terbaru untuk default tampilan
        $year = $request->input('year', $years->first());
    
        // Ambil data abstrak untuk tahun yang dipilih
        $abstracts = AbstractModel::whereYear('created_at', $year)
            ->where('status', 'accepted')
            ->get();

        $latestYear = AbstractModel::max('created_at');
    
        // Pass both years and the selected year to the view
        return view('landingpage.archives.index', compact('years', 'year', 'abstracts', 'latestYear'));
    }
    


    public function show(Request $request, $year)
    {
        // Ambil data abstrak berdasarkan tahun yang dipilih
        $abstracts = AbstractModel::whereYear('created_at', $year)
            ->where('status', 'accepted')
            ->get();

        // Kembalikan data ke view utama dengan parameter tahun
        return view('landingpage.archives.index', compact('year', 'abstracts'));
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
