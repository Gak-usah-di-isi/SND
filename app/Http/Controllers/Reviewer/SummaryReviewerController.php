<?php

namespace App\Http\Controllers\Reviewer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AbstractModel;
use App\Models\FullPaper;
use App\Models\Year;
use Illuminate\Support\Facades\Auth;
use App\Models\Certificate;
use App\Traits\EditorSidebarBadges;

class SummaryReviewerController extends Controller
{
    use EditorSidebarBadges;

    public function index()
    {
        $activeYear = Year::where('is_active', true)->first();

        $countCompletedReviews = AbstractModel::whereHas('abstractReviews', function (
            $query,
        ) {
            $query->where('reviewer_id', auth()->id());
        })->where('status', 'accepted')
            ->when($activeYear, fn ($q) => $q->whereYear('created_at', $activeYear->year))
            ->count();

        $countCompletedPapers = FullPaper::whereHas('fullPaperReviews', function ($query) {
            $query->where('reviewer_id', auth()->id());
        })
            ->where('status', 'accepted')
            ->when($activeYear, fn ($q) => $q->whereYear('created_at', $activeYear->year))
            ->count();

        $allAbstracts = AbstractModel::when($activeYear, fn ($q) => $q->whereYear('created_at', $activeYear->year))->count();
        $allFullPapers = FullPaper::when($activeYear, fn ($q) => $q->whereYear('created_at', $activeYear->year))->count();
        $user = Auth::user();
        // $reviewerCertificate = Certificate::where('user_id', $user->id)->first();
        $reviewerCertificate = Certificate::where('user_id', $user->id)
            ->where('certificate_type', 'reviewer')
            ->first();

        $badgeCounts = $this->editorSidebarBadgeCounts($activeYear);

        return \Inertia\Inertia::render('Editor/Summary/Index', compact('countCompletedReviews', 'countCompletedPapers', 'allAbstracts', 'allFullPapers', 'reviewerCertificate', 'badgeCounts'));
    }
}
