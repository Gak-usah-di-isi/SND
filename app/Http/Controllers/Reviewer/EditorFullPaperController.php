<?php

namespace App\Http\Controllers\Reviewer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FullPaper;
use App\Models\User;
use App\Models\Year;
use App\Models\ConferenceSetting;
use App\Traits\FlashAlert;
use App\Traits\EditorSidebarBadges;
use App\Mail\FullPaperAccepted;
use App\Exports\FullPapersExport;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class EditorFullPaperController extends Controller
{
    use FlashAlert;
    use EditorSidebarBadges;

    private function activeYear(): ?Year
    {
        return Year::where('is_active', true)->first();
    }

    /**
     * Query dasar daftar full paper untuk menu "Editor: Paper" — selalu
     * dibatasi tahun konferensi yang sedang aktif, sama seperti dashboard admin.
     */
    private function fullPapersQuery(Request $request, ?\Closure $filter = null)
    {
        $activeYear = $this->activeYear();
        $search = $request->query('search');
        $status = $request->query('status');
        $presentationType = $request->query('presentation_type');

        return FullPaper::with(['fullPaperReviews.reviewer', 'abstract.symposium'])
            ->when($filter, $filter)
            ->when($activeYear, fn ($q) => $q->whereYear('created_at', $activeYear->year))
            // Full paper tidak punya judul sendiri — judul & tipe presentasi ikut abstract-nya.
            ->when($search, fn ($q) => $q->whereHas('abstract', fn ($a) => $a->where('title', 'LIKE', "%{$search}%")))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($presentationType, fn ($q) => $q->whereHas('abstract', fn ($a) => $a->where('presentation_type', $presentationType)));
    }

    private function paginateFullPapers(Request $request, ?\Closure $filter = null)
    {
        return $this->fullPapersQuery($request, $filter)
            ->paginate(min((int) $request->query('per_page', 10), 100))
            ->withQueryString();
    }

    /**
     * Filter daftar full paper per menu Editor, dipakai bersama oleh halaman
     * index dan export supaya isinya selalu sama.
     */
    private function scopeFilter(string $scope): ?\Closure
    {
        return match ($scope) {
            'no-reviewer' => fn ($q) => $q->where(function ($query) {
                $query->doesntHave('fullPaperReviews')
                    ->orWhereHas('fullPaperReviews', fn ($sub) => $sub->whereNull('comment'));
            }),
            'no-decision' => fn ($q) => $q
                ->where('status', 'under review')
                ->whereHas('fullPaperReviews', fn ($query) => $query->whereNotNull('comment')),
            'with-decision' => fn ($q) => $q->where('status', 'accepted'),
            'revision' => fn ($q) => $q->where('status', 'revision'),
            default => null,
        };
    }

    /**
     * Props search/filter yang dikirim balik ke halaman supaya nilainya
     * tetap terisi setelah navigasi.
     */
    private function searchProps(Request $request): array
    {
        return [
            'search' => $request->query('search', ''),
            'filters' => $request->only(['status', 'presentation_type']),
        ];
    }

    public function index(Request $request)
    {
        return \Inertia\Inertia::render('Editor/EditorFullpaper/EditorIndex', [
            'fullpapers' => $this->paginateFullPapers($request),
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
            ...$this->searchProps($request),
        ]);
    }

    /**
     * Export daftar full paper (sesuai scope menu & filter aktif) ke Excel.
     * Yang diunduh adalah data tabelnya, bukan file paper peserta.
     */
    public function export(Request $request)
    {
        $scope = (string) $request->query('scope', 'all');

        $fullpapers = $this->fullPapersQuery($request, $this->scopeFilter($scope))
            ->orderByDesc('created_at')
            ->get();

        $year = $this->activeYear()?->year ?? date('Y');

        return Excel::download(new FullPapersExport($fullpapers), "full-papers-{$year}.xlsx");
    }

    public function noReviewer(Request $request)
    {
        $fullpapers = $this->paginateFullPapers($request, $this->scopeFilter('no-reviewer'));

        return \Inertia\Inertia::render('Editor/EditorFullpaper/EditorNoReviewer', [
            'fullpapers' => $fullpapers,
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
            ...$this->searchProps($request),
        ]);
    }

    public function noDecision(Request $request)
    {
        $fullpapers = $this->paginateFullPapers($request, $this->scopeFilter('no-decision'));

        return \Inertia\Inertia::render('Editor/EditorFullpaper/EditorNoDecision', [
            'fullpapers' => $fullpapers,
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
            ...$this->searchProps($request),
        ]);
    }

    public function withDecision(Request $request)
    {
        $fullpapers = $this->paginateFullPapers($request, $this->scopeFilter('with-decision'));

        return \Inertia\Inertia::render('Editor/EditorFullpaper/EditorWithDecision', [
            'fullpapers' => $fullpapers,
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
            ...$this->searchProps($request),
        ]);
    }

    public function revision(Request $request)
    {
        $fullpapers = $this->paginateFullPapers($request, $this->scopeFilter('revision'));

        return \Inertia\Inertia::render('Editor/EditorFullpaper/EditorRevision', [
            'fullpapers' => $fullpapers,
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
            ...$this->searchProps($request),
        ]);
    }

    public function showAssignReviewer($fullpaperId)
    {
        $fullpaper = FullPaper::with(['reviewers', 'abstract.symposium'])->findOrFail($fullpaperId);
        $reviewers = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['reviewer', 'editor', 'chief-editor']);
        })->get(['id', 'name']);

        $assignedReviewer1 = $fullpaper->reviewers->first() ? $fullpaper->reviewers[0]->id : null;
        $assignedReviewer2 = $fullpaper->reviewers->count() > 1 ? $fullpaper->reviewers[1]->id : null;
        $assignedReviewer3 = $fullpaper->reviewers->count() > 2 ? $fullpaper->reviewers[2]->id : null;

        return \Inertia\Inertia::render('Editor/EditorFullpaper/EditorAssignReviewer', [
            'fullpaper' => $fullpaper,
            'formattedAuthors' => $this->formatSuperscript($fullpaper->abstract->authors ?? ''),
            'formattedAffiliations' => nl2br($this->formatSuperscript($fullpaper->abstract->affiliations ?? '')),
            'reviewers' => $reviewers,
            'assignedReviewer1' => $assignedReviewer1,
            'assignedReviewer2' => $assignedReviewer2,
            'assignedReviewer3' => $assignedReviewer3,
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
        ]);
    }

    /**
     * Ubah penanda [n] jadi <sup>n</sup>, sama seperti di ReviewController.
     */
    private function formatSuperscript($value)
    {
        return preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', e($value ?? ''));
    }

    public function assignReviewer(Request $request, $fullpaperId)
    {
        $fullpaper = FullPaper::findOrFail($fullpaperId);

        $request->validate([
            'reviewer_1_id' => 'required|exists:users,id',
            'reviewer_2_id' => 'nullable|exists:users,id|different:reviewer_1_id',
            'reviewer_3_id' => 'nullable|exists:users,id|different:reviewer_1_id|different:reviewer_2_id',
        ]);

        if (!$request->reviewer_1_id && !$request->reviewer_2_id) {
            return back()->withErrors(['reviewer_1_id' => 'At least one reviewer must be assigned.']);
        }

        $fullpaper->reviewers()->detach();

        $reviewers = [];
        if ($request->reviewer_1_id) {
            $reviewers[$request->reviewer_1_id] = ['created_at' => now(), 'updated_at' => now()];
        }
        if ($request->reviewer_2_id) {
            $reviewers[$request->reviewer_2_id] = ['created_at' => now(), 'updated_at' => now()];
        }

        if ($request->reviewer_3_id) {
            $reviewers[$request->reviewer_3_id] = ['created_at' => now(), 'updated_at' => now()];
        }

        $fullpaper->reviewers()->attach($reviewers);

        $fullpaper->status = 'under review';
        $fullpaper->save();

        return redirect()->route('reviewer.editor-fullpaper.noReviewer')->with($this->alertAssign());
    }


    public function showEditStatus($fullpaperId)
    {
        $fullpaper = FullPaper::with(['fullPaperReviews.reviewer', 'abstract.symposium'])->findOrFail($fullpaperId);
        $conferenceSetting = ConferenceSetting::first();
        $enablePublication = $conferenceSetting ? (bool) ($conferenceSetting->enable_publication_selection ?? true) : true;

        return \Inertia\Inertia::render('Editor/EditorFullpaper/EditorEditStatus', [
            'fullpaper'                  => $fullpaper,
            'enablePublicationSelection' => $enablePublication,
            'formattedAuthors'           => $this->formatSuperscript($fullpaper->abstract->authors ?? ''),
            'formattedAffiliations'      => nl2br($this->formatSuperscript($fullpaper->abstract->affiliations ?? '')),
            'badgeCounts'                => $this->editorSidebarBadgeCounts($this->activeYear()),
        ]);
    }

    public function updateStatus(Request $request, $fullpaperId)
    {
        $fullpaper = FullPaper::with('abstract')->findOrFail($fullpaperId);
        $conferenceSetting = ConferenceSetting::first();
        $enablePublication = $conferenceSetting ? (bool) ($conferenceSetting->enable_publication_selection ?? true) : true;

        $request->validate([
            'status' => 'required|string|in:open,under review,accepted,revision,rejected',
            'publication' => $enablePublication ? 'required|string|in:Journal Publication,Proceedings Indexed in EBSCO' : 'nullable|string',
            'note' => 'nullable|string',
            'similarity_file' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        if ($request->hasFile('similarity_file')) {
            if ($fullpaper->similarity_file) {
                Storage::disk('public')->delete($fullpaper->similarity_file);
            }
            $path = $request->file('similarity_file')->store('similarity_files', 'public');
            $fullpaper->similarity_file = $path;
        }

        $fullpaper->status = $request->status;
        $fullpaper->save();

        if ($fullpaper->abstract) {
            $fullpaper->abstract->publication = $request->publication;
            $fullpaper->abstract->save();
        }

        if ($request->status === 'accepted') {
            $user = $fullpaper->abstract?->user;
            if ($user) {
                Mail::to($user->email)->send(new FullPaperAccepted($user, $fullpaper));
            }
        }

        return redirect()->route('reviewer.editor-fullpaper.index')->with($this->alertUpdated());
    }

    public function workLoad()
    {
        $activeYear = $this->activeYear();

        $reviewers = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['reviewer', 'editor', 'chief-editor']);
        })->get();

        // Hanya hitung review untuk full paper pada tahun konferensi aktif,
        // supaya angkanya konsisten dengan halaman Editor: Paper lainnya.
        $scopeToYear = fn ($q) => $q->when($activeYear, fn ($qq) => $qq->whereHas(
            'fullPaper',
            fn ($p) => $p->whereYear('created_at', $activeYear->year)
        ));

        $workloads = $reviewers->map(function ($reviewer) use ($scopeToYear) {
            $assigned = $reviewer->fullPaperReviews()->tap($scopeToYear)->count();
            $completed = $reviewer->fullPaperReviews()->tap($scopeToYear)->whereNotNull('comment')->count();
            $inReview = $assigned - $completed;

            return [
                'name' => $reviewer->name,
                'in_review' => $inReview,
                'completed' => $completed,
                'assigned' => $assigned
            ];
        });
        return \Inertia\Inertia::render('Editor/EditorFullpaper/EditorWorkload', [
            'workloads' => $workloads,
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
        ]);
    }
}
