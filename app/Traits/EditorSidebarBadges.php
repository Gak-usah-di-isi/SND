<?php

namespace App\Traits;

use App\Models\AbstractModel;
use App\Models\FullPaper;
use App\Models\Year;

/**
 * Sidebar badge counts shown for the editor/chief-editor role, mirroring
 * resources/views/layouts/partials/sidebar.blade.php, scoped to the
 * conference year currently marked active by admin (Year::is_active).
 */
trait EditorSidebarBadges
{
    protected function editorSidebarBadgeCounts(?Year $activeYear): array
    {
        $scopeToYear = fn ($q) => $q->when($activeYear, fn ($q2) => $q2->whereYear('created_at', $activeYear->year));

        return [
            'reviewAbstract' => AbstractModel::whereHas('abstractReviews', function ($query) {
                $query->where('reviewer_id', auth()->id());
            })->whereIn('status', ['under review', 'revision'])
                ->tap($scopeToYear)->count(),

            'abstractCompleted' => AbstractModel::whereHas('abstractReviews', function ($query) {
                $query->where('reviewer_id', auth()->id());
            })->where('status', 'accepted')
                ->tap($scopeToYear)->count(),

            'reviewFullpaper' => FullPaper::whereHas('fullPaperReviews', function ($query) {
                $query->where('reviewer_id', auth()->id());
            })->whereIn('status', ['under review', 'revision'])
                ->tap($scopeToYear)->count(),

            'paperCompleted' => FullPaper::whereHas('fullPaperReviews', function ($query) {
                $query->where('reviewer_id', auth()->id());
            })->where('status', 'accepted')
                ->tap($scopeToYear)->count(),

            'abstractNoReview' => AbstractModel::where(function ($q) {
                $q->doesntHave('abstractReviews')
                    ->orWhereHas('abstractReviews', function ($query) {
                        $query->whereNull('comment');
                    });
            })->tap($scopeToYear)->count(),
            'abstractRevision' => AbstractModel::where('status', 'revision')->tap($scopeToYear)->count(),
            'abstractNoDecision' => AbstractModel::where('status', 'under review')
                ->whereHas('abstractReviews', function ($query) {
                    $query->whereNotNull('comment');
                })->tap($scopeToYear)->count(),
            'abstractWithDecision' => AbstractModel::where('status', 'accepted')->tap($scopeToYear)->count(),
            'allAbstract' => AbstractModel::tap($scopeToYear)->count(),

            'paperNoReview' => FullPaper::where(function ($q) {
                $q->doesntHave('fullPaperReviews')
                    ->orWhereHas('fullPaperReviews', function ($query) {
                        $query->whereNull('comment');
                    });
            })->tap($scopeToYear)->count(),
            'paperRevision' => FullPaper::where('status', 'revision')->tap($scopeToYear)->count(),
            'paperNoDecision' => FullPaper::where('status', 'under review')
                ->whereHas('fullPaperReviews', function ($query) {
                    $query->whereNotNull('comment');
                })->tap($scopeToYear)->count(),
            'paperWithDecision' => FullPaper::where('status', 'accepted')->tap($scopeToYear)->count(),
            'allPapers' => FullPaper::tap($scopeToYear)->count(),
        ];
    }
}
