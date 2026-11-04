<?php

namespace App\Http\Controllers\Reviewer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AbstractModel;
use App\Models\AbstractReview;
use App\Models\Year;
use App\Traits\FlashAlert;
use App\Traits\EditorSidebarBadges;

class ReviewController extends Controller
{
    use FlashAlert;
    use EditorSidebarBadges;

    public function index()
    {
        $reviewerId = auth()->id();
        $abstracts = AbstractModel::with('symposium')
            ->whereHas('abstractReviews', function ($query) use ($reviewerId) {
                $query->where('reviewer_id', $reviewerId);
            })
            ->whereIn('status', ['under review', 'revision'])
            ->get();

        $badgeCounts = $this->editorSidebarBadgeCounts(Year::where('is_active', true)->first());

        return \Inertia\Inertia::render('Editor/ReviewAbstract/Index', compact('abstracts', 'badgeCounts'));
    }

    public function reviewCompleted()
    {
        $reviewerId = auth()->id();
        $abstracts = AbstractModel::with('symposium')
            ->whereHas('abstractReviews', function ($query) use ($reviewerId) {
                $query->where('reviewer_id', $reviewerId);
            })
            ->where('status', 'accepted')
            ->get();

        $badgeCounts = $this->editorSidebarBadgeCounts(Year::where('is_active', true)->first());

        return \Inertia\Inertia::render('Editor/ReviewAbstract/Completed', compact('abstracts', 'badgeCounts'));
    }

    public function showReviewForm(AbstractModel $abstract)
    {
        $abstract->load('symposium');
        $formattedAuthors = $this->formatAuthors($abstract->authors);
        $formattedAffiliations = $this->formatAffiliations($abstract->affiliations);
        $abstractReview = AbstractReview::where('abstract_id', $abstract->id)
            ->where('reviewer_id', auth()->id())
            ->first();

        $badgeCounts = $this->editorSidebarBadgeCounts(Year::where('is_active', true)->first());

        return \Inertia\Inertia::render('Editor/ReviewAbstract/Review', compact('abstract', 'abstractReview', 'formattedAuthors', 'formattedAffiliations', 'badgeCounts'));
    }

    private function formatAuthors($authors)
    {
        $escaped = e($authors ?? '');
        return preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', $escaped);
    }


    private function formatAffiliations($affiliations)
    {
        $escaped = e($affiliations ?? '');
        $formattedAffiliations = preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', $escaped);
        return nl2br($formattedAffiliations);
    }

    public function storeReview(Request $request, AbstractModel $abstract)
    {
        $request->validate([
            'recommendation' => 'required|string',
            'comment' => 'nullable|string',
        ]);

        $abstractReview = AbstractReview::firstOrCreate(
            ['abstract_id' => $abstract->id, 'reviewer_id' => auth()->id()],
            ['recommendation' => $request->recommendation, 'comment' => $request->comment]
        );

        if ($abstractReview->wasRecentlyCreated === false) {
            $abstractReview->update([
                'recommendation' => $request->recommendation,
                'comment' => $request->comment
            ]);
        }

        return redirect()->route('reviewer.review-abstract.index')->with($this->alertReview());
    }
}
