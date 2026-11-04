<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FullPaper;
use App\Models\AbstractModel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Support\ViewingYear;
use App\Models\Year;
use App\Models\ConferenceSetting;
use App\Traits\FlashAlert;

class FullPaperController extends Controller
{
    use FlashAlert;

    /**
     * Abstract hanya boleh disentuh pemiliknya. Tanpa pengecekan ini, presenter
     * mana pun bisa mengunggah full paper ke abstract orang lain hanya dengan
     * mengganti id di URL — dan file milik korban ikut terhapus.
     * Pola yang sama dipakai di AbstractController (show/downloadPdf/acceptancePdf).
     */
    private function ownedAbstractOrNull($abstractId): ?AbstractModel
    {
        $abstract = AbstractModel::find($abstractId);

        if (!$abstract || $abstract->user_id !== auth()->id()) {
            return null;
        }

        // Full paper untuk abstract dari tahun bukan tahun aktif adalah arsip
        // read-only — tanpa ini, abstract lama yang statusnya masih
        // 'open'/'revision' tetap bisa di-upload ulang kapan pun.
        $activeYear = Year::activeYear();
        if ($activeYear !== null && optional($abstract->created_at)->year !== $activeYear) {
            return null;
        }

        return $abstract;
    }

    /**
     * Toggle modul Commitment Letter (FEATURE_COMMITMENT_LETTER_UPLOAD).
     * Saat false, tombolnya disembunyikan di UI dan route-nya ditutup juga,
     * supaya tidak bisa dipanggil langsung dari luar.
     */
    private function commitmentLetterEnabled(): bool
    {
        return filter_var(config('services.features.commitment_letter'), FILTER_VALIDATE_BOOLEAN);
    }

    public function create(Request $request)
    {
        // Upload now happens via a modal on abstracts.index (no dedicated page).
        return redirect()->route('abstracts.index');
    }

    public function createCommitmentLetter(Request $request)
    {
        if (!$this->commitmentLetterEnabled()) {
            abort(404);
        }

        // Upload now happens via a modal on abstracts.index (no dedicated page).
        return redirect()->route('abstracts.index');
    }

    public function finalPaperIndex()
    {
        $user = Auth::user();
        $viewingYear = ViewingYear::current();
        $isArchive = ViewingYear::isReadOnly();
        $conferenceSetting = ConferenceSetting::first();

        $openFullPaperUpload = !$isArchive && ($conferenceSetting->open_full_paper_upload ?? false);

        $abstracts = AbstractModel::where('user_id', $user->id)
            ->when($viewingYear, fn ($q) => $q->whereYear('created_at', $viewingYear))
            ->with([
                'symposium',
                'fullPaper.fullPaperReviews.reviewer',
                'reviewers',
                'user.filePayments' => fn ($q) => $q->when($viewingYear, fn ($qq) => $qq->where('year', $viewingYear)),
            ])
            ->get();

        $abstracts->each(function ($abstract) {
            if ($abstract->user) {
                $abstract->user->setRelation('filePayment', $abstract->user->filePayments->first());
                $abstract->user->unsetRelation('filePayments');
            }
        });

        return Inertia::render('User/FinalPaper/Index', [
            'abstracts' => $abstracts,
            'openFullPaperUpload' => $openFullPaperUpload,
        ]);
    }

    public function createCameraReady(Request $request)
    {
        return redirect()->route('finalpaper.index');
    }

    public function storeCameraReady(Request $request, $abstractId)
    {
        $conferenceSetting = ConferenceSetting::first();
        if (!$conferenceSetting || !$conferenceSetting->open_full_paper_upload) {
            return back()->with($this->alertFullpaperClosed());
        }

        $request->validate([
            'camera_ready_file' => 'required|mimes:pdf,docx,doc|max:15360',
        ]);

        $abstract = $this->ownedAbstractOrNull($abstractId);
        if (!$abstract || $abstract->status !== 'accepted') {
            return back()->with($this->permissionDenied());
        }

        $fullPaper = FullPaper::firstOrNew(['abstract_id' => $abstract->id]);

        if ($fullPaper->camera_ready_path) {
            Storage::disk('public')->delete($fullPaper->camera_ready_path);
        }

        $uploadedPath = $request->file('camera_ready_file')->store('camera_ready_papers', 'public');

        if (!$fullPaper->exists) {
            $fullPaper->file_path = $uploadedPath;
            $fullPaper->status = 'open';
        }

        $fullPaper->camera_ready_path = $uploadedPath;
        $fullPaper->save();

        return back()->with($this->alertCreated());
    }

    public function storeCommitmentLetter(Request $request, $abstractId)
    {
        if (!$this->commitmentLetterEnabled()) {
            abort(404);
        }

        $conferenceSetting = ConferenceSetting::first();
        if (!$conferenceSetting || !$conferenceSetting->open_full_paper_upload) {
            return redirect()->route('abstracts.index')->with($this->alertFullpaperClosed());
        }

        $request->validate([
            'commitment_letter' => 'required|mimes:pdf,docx,doc|max:10240',
        ]);

        $abstract = $this->ownedAbstractOrNull($abstractId);
        if (!$abstract) {
            return redirect()->route('abstracts.index')->with($this->permissionDenied());
        }

        $fullPaper = FullPaper::where('abstract_id', $abstract->id)->first();

        if ($fullPaper && $fullPaper->status === 'accepted') {
            $uploadedPath = $request->file('commitment_letter')->store('commitment_letters', 'public');

            $fullPaper->commitment_letter_path = $uploadedPath;
            $fullPaper->save();

            return redirect()->route('abstracts.index')->with($this->alertCreated());
        }

        return back()->with($this->alertFullpaperNotAccepted());
    }

    public function store(Request $request, $abstractId)
    {
        $conferenceSetting = ConferenceSetting::first();
        if (!$conferenceSetting || !$conferenceSetting->open_full_paper_upload) {
            return redirect()->route('abstracts.index')->with($this->alertFullpaperClosed());
        }

        $request->validate([
            'file' => 'required|mimes:pdf,docx|max:10240',
        ]);

        $abstract = $this->ownedAbstractOrNull($abstractId);
        if (!$abstract) {
            return redirect()->route('abstracts.index')->with($this->permissionDenied());
        }

        $fullPaper = FullPaper::where('abstract_id', $abstract->id)->first();

        if ($fullPaper) {
            if (!in_array($fullPaper->status, ['revision', 'open'])) {
                return back()->with($this->alertFullpaperNotEdit());
            }

            $uploadedPath = $request->file('file')->store('full_papers', 'public');

            if ($fullPaper->status === 'revision') {

                if ($fullPaper->revised_file_path) {
                    Storage::disk('public')->delete($fullPaper->revised_file_path);
                }

                $fullPaper->revised_file_path = $uploadedPath;
            } else {

                if ($fullPaper->file_path) {
                    Storage::disk('public')->delete($fullPaper->file_path);
                }

                $fullPaper->file_path = $uploadedPath;
            }

            $fullPaper->save();
        } else {
            FullPaper::create([
                'abstract_id' => $abstract->id,
                'file_path' => $request->file('file')->store('full_papers', 'public'),
                'status' => 'open',
            ]);
        }
        return redirect()->route('abstracts.index')->with($this->alertCreated());
    }
}
