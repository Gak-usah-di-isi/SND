<?php

namespace App\Http\Controllers\Reviewer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FullPaper;
use App\Models\FullPaperReview;
use App\Models\Year;
use App\Traits\FlashAlert;
use App\Traits\EditorSidebarBadges;

class ReviewFullPaperController extends Controller
{
    use FlashAlert;
    use EditorSidebarBadges;

    public function index()
    {
        $reviewerId = auth()->id();

        $fullPapers = FullPaper::with('abstract.symposium')
            ->whereHas('fullPaperReviews', function ($query) use ($reviewerId) {
                $query->where('reviewer_id', $reviewerId);
            })
            ->whereIn('status', ['under review', 'revision'])
            ->get();

        $badgeCounts = $this->editorSidebarBadgeCounts(Year::where('is_active', true)->first());

        return \Inertia\Inertia::render('Editor/ReviewFullpaper/Index', compact('fullPapers', 'badgeCounts'));
    }

    public function reviewCompleted()
    {
        $reviewerId = auth()->id();

        $fullPapers = FullPaper::with('abstract.symposium')
            ->whereHas('fullPaperReviews', function ($query) use ($reviewerId) {
                $query->where('reviewer_id', $reviewerId);
            })
            ->where('status', 'accepted')
            ->get();

        $badgeCounts = $this->editorSidebarBadgeCounts(Year::where('is_active', true)->first());

        return \Inertia\Inertia::render('Editor/ReviewFullpaper/Completed', compact('fullPapers', 'badgeCounts'));
    }


    public function showReviewForm($fullpaperId)
    {
        $fullpaper = FullPaper::with('abstract.symposium')->findOrFail($fullpaperId);
        $fullpaperReview = FullPaperReview::where('full_paper_id', $fullpaperId)
            ->where('reviewer_id', auth()->id())
            ->first();

        $formattedAuthors = $this->formatSuperscript($fullpaper->abstract->authors ?? '');
        $formattedAffiliations = nl2br($this->formatSuperscript($fullpaper->abstract->affiliations ?? ''));

        $badgeCounts = $this->editorSidebarBadgeCounts(Year::where('is_active', true)->first());

        return \Inertia\Inertia::render('Editor/ReviewFullpaper/Review', compact('fullpaper', 'fullpaperReview', 'formattedAuthors', 'formattedAffiliations', 'badgeCounts'));
    }

    /**
     * Ubah penanda [n] jadi <sup>n</sup>, sama seperti di ReviewController.
     */
    private function formatSuperscript($value)
    {
        return preg_replace('/\[(\d+)\]/', '<sup>$1</sup>', e($value ?? ''));
    }

    public function storeReview(Request $request, $fullpaperId)
    {
        $request->validate([
            'recommendation' => 'required|string',
            'comment' => 'nullable|string',
        ]);

        $fullpaperReview = FullPaperReview::firstOrCreate(
            ['full_paper_id' => $fullpaperId, 'reviewer_id' => auth()->id()],
            ['recommendation' => $request->recommendation, 'comment' => $request->comment]
        );

        if ($fullpaperReview->wasRecentlyCreated === false) {
            $fullpaperReview->update([
                'recommendation' => $request->recommendation,
                'comment' => $request->comment
            ]);
        }

        return redirect()->route('reviewer.review-fullpaper.index')->with($this->alertReview());
    }
}
