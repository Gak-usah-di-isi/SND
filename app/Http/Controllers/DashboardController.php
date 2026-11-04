<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use App\Models\User;
use App\Models\Role;
use App\Models\Upload;
use App\Models\Year;
use App\Support\ViewingYear;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $roles = $user->roles->pluck('name')->toArray();

        $participants = [
            'indonesia-presenter',
            'foreign-presenter',
            'indonesia-participants',
            'foreign-participants',
        ];

        $reviewers = [
            'chief-editor',
            'editor',
            'reviewer'
        ];

        $landingEditor = [
            'landing-editor'
        ];

        $executive = [
            'executive'
        ];

        if (in_array('admin', $roles)) {
            return redirect()->route('admin.summary');
        }

        if (in_array('bendahara', $roles)) {
            return redirect()->route('bendahara.summary');
        }

        if (in_array('sekretaris', $roles)) {
            return redirect()->route('sekretaris.summary');
        }

        if (in_array('humas', $roles)) {
            return redirect()->route('humas.summary');
        }

        if (array_intersect($roles, $executive)) {
            return redirect()->route('executive.index');
        }

        if (array_intersect($roles, $reviewers)) {
            return redirect()->route('reviewer.summary');
        }

        if (array_intersect($roles, $landingEditor)) {
            return redirect()->route('landing.landingpage.index');
        }

        if (!array_intersect($roles, $participants)) {
            abort(403, 'Unauthorized');
        }

        // Seluruh isi dashboard mengikuti tahun yang sedang dilihat peserta
        // (default tahun aktif, bisa diarahkan ke arsip tahun sebelumnya).
        $viewingYear = ViewingYear::current();
        $isArchive = ViewingYear::isReadOnly();

        $user = User::with([
            'abstracts' => fn ($q) => $q->when($viewingYear, fn ($qq) => $qq->whereYear('created_at', $viewingYear)),
            'abstracts.symposium',
            'abstracts.fullPaper.fullPaperReviews.reviewer',
            'filePayments' => fn ($q) => $q->when($viewingYear, fn ($qq) => $qq->where('year', $viewingYear)),
            'certificates' => fn ($q) => $q->when($viewingYear, fn ($qq) => $qq->where('year', $viewingYear)),
        ])->find(Auth::id());

        // Frontend membaca `user.file_payment`; isikan dengan pembayaran tahun
        // yang sedang dilihat (relasi filePayment sendiri terkunci ke tahun aktif).
        $payment = $user->filePayments->first();
        $user->setRelation('filePayment', $payment);
        $user->unsetRelation('filePayments');

        $firstAbstract = $user->abstracts->first();
        $fullPaper = $firstAbstract ? $firstAbstract->fullPaper : null;
        $isFullPaperAccepted = $fullPaper && $fullPaper->status == 'accepted';

        // Peringatan bayar hanya relevan di tahun aktif — saat melihat arsip,
        // tidak ada lagi yang bisa dibayar.
        $hasAcceptedWithoutPayment = !$isArchive
            && $user->abstracts->contains('status', 'accepted')
            && !$payment;

        // Modul Commitment Letter bisa dimatikan lewat FEATURE_COMMITMENT_LETTER_UPLOAD;
        // saat mati, URL template tidak dikirim ke presenter.
        $commitmentLetterEnabled = filter_var(config('services.features.commitment_letter'), FILTER_VALIDATE_BOOLEAN);
        $commitmentLetterUrl = ($isFullPaperAccepted && $commitmentLetterEnabled)
            ? Upload::getFilePath('commitment_letter')
            : null;

        $participantCertificate = $user->certificates->firstWhere('certificate_type', 'participant');
        $presenterCertificate = $user->certificates->firstWhere('certificate_type', 'presenter');

        $showParticipantCertificate = $participantCertificate && $participantCertificate->status == 1;
        $showPresenterCertificate = $presenterCertificate && $presenterCertificate->status == 1 && $firstAbstract;

        $participantCertificateUrl = null;
        if ($showParticipantCertificate) {
            $participantCertificateUrl = $firstAbstract
                ? route('abstracts.viewCertificate', ['id' => Crypt::encrypt($firstAbstract->id), 'type' => 'participant'])
                : asset('storage/' . $participantCertificate->certificate_path);
        }

        $presenterCertificateUrl = null;
        if ($showPresenterCertificate) {
            $presenterCertificateUrl = route('abstracts.viewCertificate', ['id' => Crypt::encrypt($firstAbstract->id), 'type' => 'presenter']);
        }

        return Inertia::render('User/Dashboard/Index', [
            'user' => $user,
            'isFullPaperAccepted' => $isFullPaperAccepted,
            'hasAcceptedWithoutPayment' => $hasAcceptedWithoutPayment,
            'commitmentLetterUrl' => $commitmentLetterUrl,
            'showParticipantCertificate' => $showParticipantCertificate,
            'showPresenterCertificate' => $showPresenterCertificate,
            'participantCertificateUrl' => $participantCertificateUrl,
            'presenterCertificateUrl' => $presenterCertificateUrl,
        ]);
    }
}
