<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AbstractModel;
use App\Models\Symposium;
use Illuminate\Support\Facades\Auth;
use App\Models\FullPaper;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\FilePayment;
use App\Models\Year;
use App\Models\ConferenceSetting;
use App\Models\PresentationType;
use Illuminate\Validation\Rule;
use App\Traits\FlashAlert;

class AbstractsController extends Controller
{
    use FlashAlert;
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $search = $request->query('search');

        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with($this->alertDanger());
        }

        $statusFilter           = $request->query('status');
        $presentationTypeFilter = $request->query('presentation_type');

        $abstracts = AbstractModel::with(['symposium', 'fullPaper', 'filePayment', 'user'])
            ->whereYear('created_at', $activeYear->year)
            ->when($search, fn($q) => $q->where('title', 'LIKE', "%{$search}%"))
            ->when($statusFilter, fn($q) => $q->where('status', $statusFilter))
            ->when($presentationTypeFilter, fn($q) => $q->where('presentation_type', $presentationTypeFilter))
            ->paginate(min((int) $request->query('per_page', 10), 100))
            ->withQueryString();


        $oralTotal = AbstractModel::where('presentation_type', 'Oral Presentation')
            ->where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $oralPaid = AbstractModel::where('presentation_type', 'Oral Presentation')
            ->where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->whereHas('filePayment', function ($query) {
                $query->where('status', 'verified');
            })
            ->count();

        $posterTotal = AbstractModel::where('presentation_type', 'Poster')
            ->where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $posterPaid = AbstractModel::where('presentation_type', 'Poster')
            ->where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->whereHas('filePayment', function ($query) {
                $query->where('status', 'verified');
            })
            ->count();

        $openTotal = AbstractModel::where('status', 'open')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $revisionTotal = AbstractModel::where('status', 'revision')
            ->whereYear('created_at', $activeYear->year)
            ->count();

        $conferenceSetting = ConferenceSetting::first();
        $enablePublicationSelection = $conferenceSetting ? (bool) ($conferenceSetting->enable_publication_selection ?? true) : true;

        return \Inertia\Inertia::render('Admin/Abstract/Index', [
            'abstracts'                  => $abstracts,
            'symposiums'                 => Symposium::all(['id', 'name']),
            'presentationTypes'          => PresentationType::all(['id', 'name', 'is_active']),
            'enablePublicationSelection' => $enablePublicationSelection,
            'oralTotal'                  => $oralTotal,
            'oralPaid'                   => $oralPaid,
            'posterTotal'                => $posterTotal,
            'posterPaid'                 => $posterPaid,
            'openTotal'                  => $openTotal,
            'revisionTotal'              => $revisionTotal,
            'search'                     => $search ?? '',
            'filters'                    => $request->only(['status', 'presentation_type']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AbstractModel $abstract)
    {
        $symposiums = Symposium::all();
        return view('abstract.edit', compact('abstract', 'symposiums'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AbstractModel $abstract)
    {
        $hasPresentationTypes = PresentationType::where('is_active', true)->exists();
        $presentationRule = $hasPresentationTypes
            ? ['required', 'string', Rule::exists('presentation_types', 'name')]
            : ['required', 'string', 'in:Oral presentation,Poster presentation'];

        $conferenceSetting = ConferenceSetting::first();
        $enablePublication = $conferenceSetting ? (bool) ($conferenceSetting->enable_publication_selection ?? true) : true;
        $publicationRule = $enablePublication
            ? 'required|in:Journal Publication,International Indexed Proceedings'
            : 'nullable|string';

        $request->validate([
            'title' => 'required',
            'authors' => 'required',
            'affiliations' => 'required',
            'corresponding_email' => 'required|email',
            'abstract' => 'required',
            'presentation_type' => $presentationRule,
            'publication' => $publicationRule,
            'symposium_id' => 'required|exists:symposiums,id',
        ]);

        $updateData = $request->only([
            'title', 'authors', 'affiliations', 'corresponding_email', 'abstract',
            'presentation_type', 'symposium_id', 'keyword',
        ]);

        if ($enablePublication) {
            $updateData['publication'] = $request->publication;
        }

        $abstract->update($updateData);

        return redirect()->route('admin.abstract.index')->with($this->alertUpdated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AbstractModel $abstract)
    {
        $abstract->delete();
        return redirect()->route('admin.abstract.index')->with($this->alertDeleted());
    }

    public function showBySymposium()
    {
        $activeYear = Year::where('is_active', true)->first();

        $symposiums = Symposium::with('abstracts')
            ->when($activeYear, fn($q) => $q->whereYear('created_at', $activeYear->year))
            ->get();

        foreach ($symposiums as $symposium) {
            foreach ($symposium->abstracts as $abstract) {
                $abstract->formattedAuthors      = $this->formatAuthors($abstract->authors);
                $abstract->formattedAffiliations = $this->formatAffiliations($abstract->affiliations);
            }
        }

        return \Inertia\Inertia::render('Admin/AbstractBook/Index', [
            'symposiums' => $symposiums,
        ]);
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

    public function downloadAllPdf()
    {
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with('error', 'No active year set.');
        }

        $abstracts = AbstractModel::with('symposium')
            ->whereYear('created_at', $activeYear->year)
            ->get();

        foreach ($abstracts as $abstract) {
            $abstract->formattedAuthors = $this->formatAuthors($abstract->authors);
            $abstract->formattedAffiliations = $this->formatAffiliations($abstract->affiliations);
        }

        $pdf = PDF::loadView('abstract.all_pdf', compact('abstracts'));

        return $pdf->stream('all-abstracts.pdf');
    }

    public function downloadVerifiedPdf()
    {
        $activeYear = Year::where('is_active', true)->first();

        if (!$activeYear) {
            return back()->with('error', 'No active year set.');
        }

        $abstracts = AbstractModel::with('symposium')
            ->where('status', 'accepted')
            ->whereYear('created_at', $activeYear->year)
            ->whereHas('user.filePayment', function ($query) {
                $query->where('status', 'verified');
            })
            ->get();

        foreach ($abstracts as $abstract) {
            $abstract->formattedAuthors = $this->formatAuthors($abstract->authors);
            $abstract->formattedAffiliations = $this->formatAffiliations($abstract->affiliations);
        }

        $pdf = PDF::loadView('abstract.verified_pdf', compact('abstracts'));

        return $pdf->stream('verified-abstracts.pdf');
    }
}
