<?php

namespace App\Http\Controllers\Reviewer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AbstractModel;
use App\Models\User;
use App\Mail\AbstractAccepted;
use Illuminate\Support\Facades\Mail;
use App\Models\FilePayment;
use App\Mail\AbstractInvoice;
use App\Traits\FlashAlert;
use App\Traits\EditorSidebarBadges;
use App\Mail\ReviewerAssignedAbstract;
use App\Models\Year;
use App\Models\ConferenceSetting;
use Illuminate\Support\Facades\Log;

class EditorController extends Controller
{
    use FlashAlert;
    use EditorSidebarBadges;

    public function index(Request $request)
    {
        $abstracts = $this->paginateAbstracts($request);

        return \Inertia\Inertia::render('Editor/EditorAbstract/Index', [
            'abstracts' => $abstracts,
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
            ...$this->searchProps($request),
        ]);
    }

    private function activeYear(): ?Year
    {
        return Year::where('is_active', true)->first();
    }

    /**
     * Query dasar daftar abstract untuk menu "Editor: Abstract" — selalu
     * dibatasi tahun konferensi yang sedang aktif, sama seperti dashboard admin.
     */
    private function paginateAbstracts(Request $request, ?\Closure $filter = null)
    {
        $activeYear = $this->activeYear();
        $search = $request->query('search');
        $status = $request->query('status');
        $presentationType = $request->query('presentation_type');

        return AbstractModel::with(['sdgs', 'symposium', 'abstractReviews.reviewer'])
            ->when($filter, $filter)
            ->when($activeYear, fn ($q) => $q->whereYear('created_at', $activeYear->year))
            ->when($search, fn ($q) => $q->where('title', 'LIKE', "%{$search}%"))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($presentationType, fn ($q) => $q->where('presentation_type', $presentationType))
            ->paginate(min((int) $request->query('per_page', 10), 100))
            ->withQueryString();
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

    public function noReviewer(Request $request)
    {
        $abstracts = $this->paginateAbstracts($request, fn ($q) => $q->where(function ($query) {
            $query->doesntHave('abstractReviews')
                ->orWhereHas('abstractReviews', function ($sub) {
                    $sub->whereNull('comment');
                });
        }));

        return \Inertia\Inertia::render('Editor/EditorAbstract/NoReviewer', [
            'abstracts' => $abstracts,
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
            ...$this->searchProps($request),
        ]);
    }

    public function revision(Request $request)
    {
        $abstracts = $this->paginateAbstracts($request, fn ($q) => $q->where('status', 'revision'));

        return \Inertia\Inertia::render('Editor/EditorAbstract/Revision', [
            'abstracts' => $abstracts,
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
            ...$this->searchProps($request),
        ]);
    }

    public function noDecision(Request $request)
    {
        $abstracts = $this->paginateAbstracts($request, fn ($q) => $q
            ->where('status', 'under review')
            ->whereHas('abstractReviews', function ($query) {
                $query->whereNotNull('comment');
            }));

        return \Inertia\Inertia::render('Editor/EditorAbstract/NoDecision', [
            'abstracts' => $abstracts,
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
            ...$this->searchProps($request),
        ]);
    }

    public function withDecision(Request $request)
    {
        $abstracts = $this->paginateAbstracts($request, fn ($q) => $q->where('status', 'accepted'));

        return \Inertia\Inertia::render('Editor/EditorAbstract/WithDecision', [
            'abstracts' => $abstracts,
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
            ...$this->searchProps($request),
        ]);
    }

    public function showAssignReviewer($abstractId)
    {
        $abstract = AbstractModel::with(['reviewers', 'symposium', 'sdgs'])->findOrFail($abstractId);

        $reviewers = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['reviewer', 'editor', 'chief-editor']);
        })->get(['id', 'name']);

        $assignedReviewer1 = $abstract->reviewers->first() ? $abstract->reviewers[0]->id : null;
        $assignedReviewer2 = $abstract->reviewers->count() > 1 ? $abstract->reviewers[1]->id : null;

        return \Inertia\Inertia::render('Editor/EditorAbstract/AssignReviewer', [
            'abstract' => $abstract,
            'formattedAuthors' => $this->formatAuthors($abstract->authors),
            'formattedAffiliations' => $this->formatAffiliations($abstract->affiliations),
            'reviewers' => $reviewers,
            'assignedReviewer1' => $assignedReviewer1,
            'assignedReviewer2' => $assignedReviewer2,
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
        ]);
    }


    public function assignReviewer(Request $request, $abstractId)
    {
        $abstract = AbstractModel::findOrFail($abstractId);

        $request->validate([
            'reviewer_1_id' => 'required|exists:users,id',
            'reviewer_2_id' => 'nullable|exists:users,id|different:reviewer_1_id',
        ]);

        if (!$request->reviewer_1_id && !$request->reviewer_2_id) {
            return back()->withErrors(['reviewer_1_id' => 'At least one reviewer must be assigned.']);
        }

        $abstract->reviewers()->detach();

        $reviewers = [];
        if ($request->reviewer_1_id) {
            $reviewers[$request->reviewer_1_id] = ['created_at' => now(), 'updated_at' => now()];
        }
        if ($request->reviewer_2_id) {
            $reviewers[$request->reviewer_2_id] = ['created_at' => now(), 'updated_at' => now()];
        }

        $abstract->reviewers()->attach($reviewers);

        $abstract->status = 'under review';
        $abstract->save();

        try {
            $reviewer1 = User::find($request->reviewer_1_id);
            if ($reviewer1) {
                Mail::to($reviewer1->email)->send(new ReviewerAssignedAbstract($abstract, $reviewer1));
            }

            if ($request->reviewer_2_id) {
                $reviewer2 = User::find($request->reviewer_2_id);
                if ($reviewer2) {
                    Mail::to($reviewer2->email)->send(new ReviewerAssignedAbstract($abstract, $reviewer2));
                }
            }
        } catch (\Throwable $e) {
            Log::warning("Gagal mengirim email assignment reviewer abstract {$abstractId}: " . $e->getMessage());
        }

        return redirect()->route('reviewer.editor.noReviewer')->with($this->alertAssign());
    }


    public function showEditStatus($abstractId)
    {
        $abstract = AbstractModel::with(['sdgs', 'symposium', 'abstractReviews.reviewer'])->findOrFail($abstractId);
        $formattedAuthors = $this->formatAuthors($abstract->authors);
        $formattedAffiliations = $this->formatAffiliations($abstract->affiliations);

        return \Inertia\Inertia::render('Editor/EditorAbstract/EditStatus', [
            'abstract' => $abstract,
            'formattedAuthors' => $formattedAuthors,
            'formattedAffiliations' => $formattedAffiliations,
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
        ]);
    }

    private function formatAuthors($authors)
    {
        return preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', e($authors ?? ''));
    }


    private function formatAffiliations($affiliations)
    {
        $formattedAffiliations = preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', e($affiliations ?? ''));
        return nl2br($formattedAffiliations);
    }

    public function updateStatus(Request $request, $abstractId)
    {
        $abstract = AbstractModel::findOrFail($abstractId);

        $request->validate([
            'status' => 'required|string|in:open,under review,accepted,revision,rejected',
            'editor_feedback' => 'nullable|string',
        ]);

        $abstract->status = $request->status;
        if ($request->has('editor_feedback')) {
            $abstract->editor_feedback = $request->editor_feedback;
        }
        $abstract->save();

        if ($request->status === 'accepted') {
            $user = $abstract->user;
            try {
                Mail::to($user->email)->send(new AbstractAccepted($user, $abstract));

                $confSetting = ConferenceSetting::first();
                $isPaymentEnabled = (bool) ($confSetting->is_payment_enabled ?? false);

                // Kirim invoice hanya jika sistem pembayaran diaktifkan oleh admin
                if ($isPaymentEnabled) {
                    $hasPaid = FilePayment::where('user_id', $user->id)->forYear(Year::activeYear())->exists();
                    if (!$hasPaid) {
                        Mail::to($user->email)->send(new AbstractInvoice($user, $abstract));
                    }
                }
            } catch (\Throwable $e) {
                Log::error("Gagal mengirim email acceptance/invoice abstract {$abstractId}: " . $e->getMessage());
                return redirect()->route('reviewer.editor.index')->with([
                    'type' => 'warning',
                    'message' => 'Status berhasil diubah menjadi accepted, tetapi email gagal terkirim (port SMTP mungkin terblokir).'
                ]);
            }
        }

        return redirect()->route('reviewer.editor.index')->with($this->alertUpdated());
    }

    public function workLoad()
    {
        $activeYear = $this->activeYear();

        $reviewers = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['reviewer', 'editor', 'chief-editor']);
        })->with([
            // Hanya hitung review untuk abstract pada tahun konferensi aktif,
            // supaya angkanya konsisten dengan halaman Editor: Abstract lainnya.
            'abstractReviews' => function ($query) use ($activeYear) {
                $query->when($activeYear, fn ($q) => $q->whereHas(
                    'abstract',
                    fn ($a) => $a->whereYear('created_at', $activeYear->year)
                ));
            },
            'abstractReviews.abstract' => function ($query) {
                $query->select('id', 'title');
            }
        ])->get();

        $workloads = $reviewers->map(function ($reviewer) {
            return [
                'name' => $reviewer->name,
                'in_review' => $reviewer->abstractReviews->whereNull('comment')->count(),
                'completed' => $reviewer->abstractReviews->whereNotNull('comment')->count(),
                'assigned' => $reviewer->abstractReviews->count(),
            ];
        });

        return \Inertia\Inertia::render('Editor/EditorAbstract/Workload', [
            'workloads' => $workloads,
            'badgeCounts' => $this->editorSidebarBadgeCounts($this->activeYear()),
        ]);
    }
}
