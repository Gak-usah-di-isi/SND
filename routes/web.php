<?php

use App\Http\Controllers\TemplateController;
use App\Http\Controllers\Landing\GalleryController;
use App\Http\Controllers\Landing\SettingController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ReviewerController;
use App\Http\Controllers\Admin\SymposiumController;
use App\Http\Controllers\Admin\SdgController;
use App\Http\Controllers\AbstractController;
use App\Http\Controllers\Admin\SummaryController;
use App\Http\Controllers\FullPaperController;
use App\Http\Controllers\Reviewer\SummaryReviewerController;
use App\Http\Controllers\Reviewer\EditorController;
use App\Http\Controllers\Reviewer\ReviewController;
use App\Http\Controllers\Reviewer\EditorFullPaperController;
use App\Http\Controllers\Reviewer\ReviewFullPaperController;
use App\Http\Controllers\FilePaymentController;
use App\Http\Controllers\ViewingYearController;
use App\Http\Controllers\Admin\AbstractsController;
use App\Http\Controllers\Admin\OralController;
use App\Http\Controllers\Admin\VerifyPaymentController;
use App\Http\Controllers\Admin\CertificateController;
use App\Http\Controllers\Admin\ManualReceiptController;
use App\Http\Controllers\Admin\EmailCsvController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\Landing\SpeakerController;
use App\Http\Controllers\Admin\DownloadController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Admin\ConferenceSettingController;
use App\Http\Controllers\Admin\YearController;
use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\Landing\RegistrationFeeController;
use App\Http\Controllers\Landing\FaqController;
use App\Http\Controllers\Landing\PublicationsJournalController;
use App\Http\Controllers\Landing\ConferenceProgramController;
use App\Http\Controllers\Landing\ContactController;
use App\Http\Controllers\Landing\ReviewerCommitteeController;
use App\Http\Controllers\Landing\SteeringCommitteeController;
use App\Http\Controllers\ConferenceProgramController as ConferenceProgram;
use App\Http\Controllers\GalleryLandingPageController;
use App\Http\Controllers\LandingPageController as LandingPage;
use App\Http\Controllers\Landing\LandingPageController as LandingPageEditorController;
use App\Http\Controllers\Landing\VenueController;
use App\Http\Controllers\Landing\AboutController;
use App\Http\Controllers\Landing\DeadlineDateController;
use App\Http\Controllers\Landing\PosterController;
use App\Http\Controllers\Landing\LogoController;
use App\Http\Controllers\Landing\ConferenceTitleController;
use App\Http\Controllers\Landing\AbstractGuidelineController;
use App\Http\Controllers\Landing\FullpaperGuidelineController;
use App\Http\Controllers\Landing\PresentationGuidelineController;
use App\Http\Controllers\SteeringLandingPageController;
use App\Http\Controllers\ReviewerLandingPageController;
use App\Http\Controllers\Landing\ConferenceController;
use App\Http\Controllers\Landing\CommitteeController;
use App\Http\Controllers\Landing\ConferenceIndexController;
use App\Http\Controllers\Landing\SubmissionIndexController;
use App\Http\Controllers\Landing\OrganizingCommitteeController;
use App\Http\Controllers\Landing\WhatsappController;
use App\Http\Controllers\Landing\ThemeController;
use App\Http\Controllers\Landing\ConferenceDetailController;
use App\Http\Controllers\FaqLandingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Landing\InstagramController;
use App\Http\Controllers\Landing\PaymentGuidelineController;
use App\Http\Controllers\PreviousConferences;
use App\Http\Controllers\Admin\EmailTemplateController;
use App\Http\Controllers\Admin\BroadcastInvitationController;
use App\Http\Controllers\Admin\BroadcastReminderController;
use App\Http\Controllers\Admin\BroadcastParallelSessionController;
use App\Http\Controllers\Landing\NewsletterController;
use App\Http\Controllers\Landing\PrevconferenceController;
use App\Http\Controllers\Landing\HotelController;
use App\Http\Controllers\Landing\ConferenceObjectiveController;
use App\Http\Controllers\Executive\ExecutiveController;
use App\Http\Controllers\Bendahara\BendaharaController;
use App\Http\Controllers\Sekretaris\SekretarisController;
use App\Http\Controllers\Humas\HumasController;
use App\Http\Controllers\Admin\RegenerateCertificateController;
use App\Http\Controllers\Admin\LogViewerController;
use Illuminate\Support\Facades\Artisan;


Route::get('run-queue-worker', function () {
    Artisan::call('queue:work', ['--once' => true]);
    return 'Queue Worker executed successfully.';
});

Route::get('/', [LandingPage::class, 'index'])->name('home');
Route::get('/{year}', [LandingPage::class, 'index'])->where('year', '[0-9]{4}')->name('home.year');

Route::get('/hotels', [LandingPageController::class, 'hotels'])->name('information');

Route::get('/themes/{id}', [LandingPageController::class, 'showTheme'])->name('themes.show');

Route::get('/payment-guidelines', [PaymentGuidelineController::class, 'showLandingPage'])->name('payment_guidelines.landing');

Route::get('/conference-program', [ConferenceProgramController::class, 'showLandingPage'])->name('conference.program');
Route::get('/conference-program/{year}', [ConferenceProgramController::class, 'showLandingPage'])->where('year', '[0-9]{4}')->name('conference.program.year');

Route::get('/gallery', [GalleryController::class, 'showLandingPage'])->name('gallery');
Route::get('/gallery/{year}', [GalleryController::class, 'showLandingPage'])->where('year', '[0-9]{4}')->name('gallery.year');

Route::get('/previous-conference', [PreviousConferences::class, 'index'])->name('previous.conference');
Route::get('abstract-download-all-pdf', [PreviousConferences::class, 'downloadAllPdf'])->name('downloadAllPdf');
Route::get('download-abstract/{id}', [ArchiveController::class, 'downloadPdf'])->name('download.abstract');


Route::prefix('committee')->group(function () {
    Route::get('/steering', [SteeringLandingPageController::class, 'index'])->name('committee.steering');
    Route::get('/steering/{year}', [SteeringLandingPageController::class, 'index'])->where('year', '[0-9]{4}')->name('committee.steering.year');

    Route::get('/reviewer', [ReviewerCommitteeController::class, 'showLandingPage'])
        ->name('committee.reviewer');
    Route::get('/reviewer/{year}', [ReviewerCommitteeController::class, 'showLandingPage'])
        ->where('year', '[0-9]{4}')->name('committee.reviewer.year');

    Route::get('/organizing', [OrganizingCommitteeController::class, 'showLandingPage'])->name('committee.organizing');
    Route::get('/organizing/{year}', [OrganizingCommitteeController::class, 'showLandingPage'])->where('year', '[0-9]{4}')->name('committee.organizing.year');
});

Route::prefix('submission')->group(function () {
    Route::get('/abstract', [AbstractGuidelineController::class, 'showLandingPage'])
        ->name('submission.abstract');
    Route::get('/abstract/{year}', [AbstractGuidelineController::class, 'showLandingPage'])
        ->where('year', '[0-9]{4}')->name('submission.abstract.year');

    Route::get('/fullpaper', [FullpaperGuidelineController::class, 'showLandingPage'])
        ->name('submission.fullpaper');
    Route::get('/fullpaper/{year}', [FullpaperGuidelineController::class, 'showLandingPage'])
        ->where('year', '[0-9]{4}')->name('submission.fullpaper.year');

    Route::get('/presentation', [PresentationGuidelineController::class, 'showLandingPage'])
        ->name('submission.presentation');
    Route::get('/presentation/{year}', [PresentationGuidelineController::class, 'showLandingPage'])
        ->where('year', '[0-9]{4}')->name('submission.presentation.year');
});


Route::get('/archives', [ArchiveController::class, 'index'])->name('archives.index');
Route::get('/archives/{year}', [ArchiveController::class, 'show'])->name('archives.show');
Route::get('/abstracts/{id}/download', [AbstractController::class, 'downloadPdf'])->name('abstracts.download');




Route::get('/faq', [FaqLandingController::class, 'index'])->name('faq');

Route::get('/contact', [ContactController::class, 'showLandingpage'])->name('contact');
Route::post('/contact/send', [ContactController::class, 'sendEmail'])->name('contact.send');

Route::prefix('executive')->middleware(['auth', 'role:executive'])->group(function () {
    Route::get('/', [ExecutiveController::class, 'index'])->name('executive.index');
    Route::get('/participants', [ExecutiveController::class, 'participants'])->name('executive.participants');
    Route::get('/participants/export', [ExecutiveController::class, 'exportParticipants'])->name('executive.participants.export');
    Route::get('/participants/export-not-paid', [ExecutiveController::class, 'exportParticipantsNotPaid'])->name('executive.participants.export-not-paid');
    Route::get('/abstracts', [ExecutiveController::class, 'abstracts'])->name('executive.abstracts');
    Route::get('/payments', [ExecutiveController::class, 'payments'])->name('executive.payments');
    Route::get('/reviewers', [ExecutiveController::class, 'reviewers'])->name('executive.reviewers');
});

// Role Bendahara (Summary Keuangan & Verifikasi Pembayaran)
Route::name('bendahara.')->prefix('bendahara')->middleware(['auth', 'role:bendahara'])->group(function () {
    Route::get('/', [BendaharaController::class, 'summary'])->name('index');
    Route::get('/summary', [BendaharaController::class, 'summary'])->name('summary');
    Route::get('/payments', [BendaharaController::class, 'payments'])->name('payments.index');
    Route::put('/payments/{id}/verify', [BendaharaController::class, 'verify'])->name('payments.verify');
    Route::get('/payments/{id}/download-proof', [BendaharaController::class, 'downloadProof'])->name('payments.downloadProof');
});

// Role Sekretaris (Read & Export Data, Tanpa Settings/Files/Broadcast)
Route::name('sekretaris.')->prefix('sekretaris')->middleware(['auth', 'role:sekretaris'])->group(function () {
    Route::get('/', [SekretarisController::class, 'summary'])->name('index');
    Route::get('/summary', [SekretarisController::class, 'summary'])->name('summary');
    Route::get('/participants', [SekretarisController::class, 'participants'])->name('participants.index');
    Route::get('/participants/export', [SekretarisController::class, 'exportParticipants'])->name('participants.export');
    Route::get('/participants/export-not-paid', [SekretarisController::class, 'exportParticipantsNotPaid'])->name('participants.exportNotPaid');
    Route::get('/abstracts', [SekretarisController::class, 'abstracts'])->name('abstracts.index');
    Route::get('/abstracts-participant/{id}', [UserController::class, 'showAbstract'])->name('abstracts-participant.show');
    Route::get('/abstracts-participant/{id}/download', [UserController::class, 'downloadAbstractPdf'])->name('abstracts-participant.downloadPdf');
    Route::get('/abstracts-participant/{id}/acceptance-pdf', [UserController::class, 'acceptancePdf'])->name('abstracts-participant.acceptancePdf');
    Route::get('/abstract-book', [SekretarisController::class, 'abstractBook'])->name('abstractBook.index');
    Route::get('/abstract-book/download-pdf', [SekretarisController::class, 'downloadAbstractBookPdf'])->name('abstractBook.downloadPdf');
    Route::get('/payments', [SekretarisController::class, 'payments'])->name('payments.index');
    Route::get('/certificates', [SekretarisController::class, 'certificates'])->name('certificates.index');
    Route::get('/reviewers', [SekretarisController::class, 'reviewers'])->name('reviewers.index');
    Route::get('/reviewers/export', [SekretarisController::class, 'exportReviewers'])->name('reviewers.export');
    Route::get('/email-csv', [SekretarisController::class, 'emailCsv'])->name('emailCsv.index');
});

// Role Humas (Read & Export Data, Tanpa Settings/Files/Broadcast)
Route::name('humas.')->prefix('humas')->middleware(['auth', 'role:humas'])->group(function () {
    Route::get('/', [HumasController::class, 'summary'])->name('index');
    Route::get('/summary', [HumasController::class, 'summary'])->name('summary');
    Route::get('/participants', [HumasController::class, 'participants'])->name('participants.index');
    Route::get('/participants/export', [HumasController::class, 'exportParticipants'])->name('participants.export');
    Route::get('/participants/export-not-paid', [HumasController::class, 'exportParticipantsNotPaid'])->name('participants.exportNotPaid');
    Route::get('/abstracts', [HumasController::class, 'abstracts'])->name('abstracts.index');
    Route::get('/abstracts-participant/{id}', [UserController::class, 'showAbstract'])->name('abstracts-participant.show');
    Route::get('/abstracts-participant/{id}/download', [UserController::class, 'downloadAbstractPdf'])->name('abstracts-participant.downloadPdf');
    Route::get('/abstracts-participant/{id}/acceptance-pdf', [UserController::class, 'acceptancePdf'])->name('abstracts-participant.acceptancePdf');
    Route::get('/abstract-book', [HumasController::class, 'abstractBook'])->name('abstractBook.index');
    Route::get('/abstract-book/download-pdf', [HumasController::class, 'downloadAbstractBookPdf'])->name('abstractBook.downloadPdf');
    Route::get('/payments', [HumasController::class, 'payments'])->name('payments.index');
    Route::get('/certificates', [HumasController::class, 'certificates'])->name('certificates.index');
    Route::get('/reviewers', [HumasController::class, 'reviewers'])->name('reviewers.index');
    Route::get('/reviewers/export', [HumasController::class, 'exportReviewers'])->name('reviewers.export');
    Route::get('/email-csv', [HumasController::class, 'emailCsv'])->name('emailCsv.index');
});

Route::get('/admin/payment/{id}/digital-pdf', [VerifyPaymentController::class, 'digitalPdf'])
    ->middleware('auth')
    ->name('admin.payment.digitalPdf');

Route::name('admin.')->prefix('admin')->namespace('App\Http\Controllers\Admin')->middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/regenerate-certificate', [RegenerateCertificateController::class, 'index'])->name('regenerate-certificate.index');
    Route::post('/regenerate-certificate/{id}', [RegenerateCertificateController::class, 'regenerateCertificate'])->name('regenerate-certificate.generate');


    Route::resource('participant', 'UserController');
    Route::post('invite/send', [UserController::class, 'sendInvitation'])->name('invite.send');
    Route::post('parallel-session/send', [UserController::class, 'sendParallelSession'])->name('parallel-session.send');
    Route::post('payment/send-reminder', [VerifyPaymentController::class, 'sendReminder'])->name('payment.sendReminder');
    Route::post('payment/send-reminder-foreign', [VerifyPaymentController::class, 'sendReminderForeign'])->name('payment.sendReminderForeign');
    Route::get('participant-excel', [UserController::class, 'exportExcel'])->name('participant.export');
    Route::get('participant-not-paid-excel', [UserController::class, 'notPaidExcel'])->name('participant.exportNotPaid');
    Route::get('abstracts-participant/{id}', 'UserController@showAbstract')->name('abstracts-participant.show');
    Route::get('abstracts-participant/{id}/download', 'UserController@downloadAbstractPdf')->name('abstracts-participant.downloadPdf');
    Route::get('abstracts-participant/{id}/acceptance-pdf', 'UserController@acceptancePdf')->name('abstracts-participant.acceptancePdf');
    Route::get('abstracts-participant/{id}/invoice-pdf', [UserController::class, 'abstractInvoicePdf'])->name('abstracts-participant.invoicePdf');
    Route::post('participant/{id}/send-invoice', [UserController::class, 'sendInvoice'])->name('participant.sendInvoice');
    Route::get('participant/{id}/invoice-pdf', [UserController::class, 'invoicePdf'])->name('participant.invoicePdf');
    Route::resource('reviewer', 'ReviewerController');
    Route::put('reviewer/{id}/toggle-status', [ReviewerController::class, 'toggleStatus'])->name('reviewer.toggleStatus');
    Route::get('reviewer-excel', [ReviewerController::class, 'export'])->name('reviewer.export');
    Route::resource('symposium', 'SymposiumController');
    Route::resource('sdgs', SdgController::class);
    Route::resource('presentation-type', 'PresentationTypeController');
    Route::resource('abstract', 'AbstractsController');
    Route::resource('oral', 'OralController');
    Route::get('summary', [SummaryController::class, 'index'])->name('summary');
    Route::get('payment', [VerifyPaymentController::class, 'index'])->name('payment.index');
    Route::put('payment/{filePayment}/verify', [VerifyPaymentController::class, 'verify'])->name('payment.verify');
    Route::get('manual-receipt', [ManualReceiptController::class, 'create'])->name('manual-receipt.create');
    Route::post('manual-receipt', [ManualReceiptController::class, 'store'])->name('manual-receipt.store');
    Route::get('certificates', [CertificateController::class, 'index'])->name('certificates.index');
    Route::put('certificates/{id}/toggle', [CertificateController::class, 'toggleStatus'])->name('certificates.toggle');
    Route::get('email-csv', [EmailCsvController::class, 'index'])->name('email.csv');
    Route::get('abstract-book', [AbstractsController::class, 'showBySymposium'])->name('abstract.bySymposium');
    Route::get('abstract-download-all-pdf', [AbstractsController::class, 'downloadAllPdf'])->name('abstract.downloadAllPdf');
    Route::get('abstract-download-verified-pdf', [AbstractsController::class, 'downloadVerifiedPdf'])->name('abstract.downloadVerifiedPdf');
    Route::get('download-files', [DownloadController::class, 'index'])->name('download.index');
    Route::get('download/fullpaper', [DownloadController::class, 'downloadFullPaper'])->name('download.fullpaper');
    Route::get('download/payment-proof', [DownloadController::class, 'downloadPaymentProof'])->name('download.paymentProof');
    Route::get('upload', [UploadController::class, 'index'])->name('upload.index');
    Route::post('upload', [UploadController::class, 'store'])->name('upload.store');
    Route::get('upload/show/{type}', [UploadController::class, 'show'])->name('upload.show');
    Route::get('settings', [ConferenceSettingController::class, 'index'])->name('settings.index');
    Route::post('settings', [ConferenceSettingController::class, 'update'])->name('settings.update');
    Route::get('years', [YearController::class, 'index'])->name('years.index');
    Route::post('years', [YearController::class, 'store'])->name('years.store');
    Route::post('years/{id}/set-active', [YearController::class, 'setActive'])->name('years.setActive');
    Route::get('email-template', [EmailTemplateController::class, 'index'])->name('email-template.index');
    Route::get('email-template/{type}/edit', [EmailTemplateController::class, 'edit'])->name('email-template.edit');
    Route::post('email-template/{type}/update', [EmailTemplateController::class, 'update'])->name('email-template.update');

    // Broadcast Send Invitation (baru, database-driven) — terpisah total dari
    // Send Invitation lama di /admin/settings (UserController::sendInvitation),
    // yang sengaja dibiarkan apa adanya.
    Route::prefix('broadcast/invitation')->name('broadcast.invitation.')->group(function () {
        Route::get('/', [BroadcastInvitationController::class, 'index'])->name('index');
        Route::post('/template/email', [BroadcastInvitationController::class, 'updateEmailTemplate'])->name('template.email.update');
        Route::post('/template/pdf', [BroadcastInvitationController::class, 'updatePdfTemplate'])->name('template.pdf.update');
        Route::post('/rundown', [BroadcastInvitationController::class, 'storeRundownItem'])->name('rundown.store');
        Route::put('/rundown/{item}', [BroadcastInvitationController::class, 'updateRundownItem'])->name('rundown.update');
        Route::delete('/rundown/{item}', [BroadcastInvitationController::class, 'destroyRundownItem'])->name('rundown.destroy');
        Route::post('/rundown/reorder', [BroadcastInvitationController::class, 'reorderRundown'])->name('rundown.reorder');
        Route::post('/preview', [BroadcastInvitationController::class, 'previewBody'])->name('preview');
        Route::post('/preview-pdf', [BroadcastInvitationController::class, 'previewPdf'])->name('previewPdf');
        Route::post('/recipient-count', [BroadcastInvitationController::class, 'recipientCount'])->name('recipientCount');
        Route::post('/send', [BroadcastInvitationController::class, 'send'])->name('send');
        Route::post('/history/{log}/resend', [BroadcastInvitationController::class, 'resend'])->name('history.resend');
        Route::delete('/history/{log}', [BroadcastInvitationController::class, 'destroyHistoryItem'])->name('history.destroyItem');
        Route::delete('/history', [BroadcastInvitationController::class, 'clearHistory'])->name('history.clear');
        Route::post('/test-send', [BroadcastInvitationController::class, 'testSend'])->name('testSend');
        Route::get('/test-users', [BroadcastInvitationController::class, 'testUserOptions'])->name('testUsers');
    });

    // Broadcast Send Reminder (baru, database-driven) — terpisah total dari
    // Send Email Reminder lama di /admin/settings (VerifyPaymentController::sendReminder),
    // yang sengaja dibiarkan apa adanya.
    Route::prefix('broadcast/reminder')->name('broadcast.reminder.')->group(function () {
        Route::get('/', [BroadcastReminderController::class, 'index'])->name('index');
        Route::post('/template', [BroadcastReminderController::class, 'updateTemplate'])->name('template.update');
        Route::post('/preview', [BroadcastReminderController::class, 'previewBody'])->name('preview');
        Route::post('/recipient-count', [BroadcastReminderController::class, 'recipientCount'])->name('recipientCount');
        Route::post('/send', [BroadcastReminderController::class, 'send'])->name('send');
        Route::post('/history/{log}/resend', [BroadcastReminderController::class, 'resend'])->name('history.resend');
        Route::delete('/history/{log}', [BroadcastReminderController::class, 'destroyHistoryItem'])->name('history.destroyItem');
        Route::delete('/history', [BroadcastReminderController::class, 'clearHistory'])->name('history.clear');
        Route::post('/test-send', [BroadcastReminderController::class, 'testSend'])->name('testSend');
        Route::get('/test-users', [BroadcastReminderController::class, 'testUserOptions'])->name('testUsers');
    });

    // Broadcast Send Parallel Session (baru, database-driven) — terpisah total
    // dari Send Parallel Session lama di /admin/settings
    // (UserController::sendParallelSession), yang sengaja dibiarkan apa adanya.
    Route::prefix('broadcast/parallel-session')->name('broadcast.parallelSession.')->group(function () {
        Route::get('/', [BroadcastParallelSessionController::class, 'index'])->name('index');
        Route::post('/template', [BroadcastParallelSessionController::class, 'updateTemplate'])->name('template.update');
        Route::post('/preview', [BroadcastParallelSessionController::class, 'previewBody'])->name('preview');
        Route::post('/recipient-count', [BroadcastParallelSessionController::class, 'recipientCount'])->name('recipientCount');
        Route::post('/send', [BroadcastParallelSessionController::class, 'send'])->name('send');
        Route::post('/history/{log}/resend', [BroadcastParallelSessionController::class, 'resend'])->name('history.resend');
        Route::delete('/history/{log}', [BroadcastParallelSessionController::class, 'destroyHistoryItem'])->name('history.destroyItem');
        Route::delete('/history', [BroadcastParallelSessionController::class, 'clearHistory'])->name('history.clear');
        Route::post('/test-send', [BroadcastParallelSessionController::class, 'testSend'])->name('testSend');
        Route::get('/test-users', [BroadcastParallelSessionController::class, 'testUserOptions'])->name('testUsers');
    });

    Route::get('logs', [LogViewerController::class, 'index'])->name('logs');
    Route::post('logs/clear', [LogViewerController::class, 'clear'])->name('logs.clear');
});

Route::name('reviewer.')
    ->prefix('reviewer')
    ->namespace('App\Http\Controllers\Reviewer')
    ->middleware(['auth', 'role:reviewer|chief-editor|editor'])
    ->group(function () {
        Route::get('summary', [SummaryReviewerController::class, 'index'])->name('summary');
        Route::get('all-abstract', [EditorController::class, 'index'])->name('editor.index');
        Route::get('/abstract-workload', [EditorController::class, 'workLoad'])->name('editor.workLoad');

        Route::get('/editor-abstract/no-reviewer', [EditorController::class, 'noReviewer'])->name('editor.noReviewer');
        Route::get('/editor-abstract/no-decision', [EditorController::class, 'noDecision'])->name('editor.noDecision');
        Route::get('/editor-abstract/with-decision', [EditorController::class, 'withDecision'])->name('editor.withDecision');
        Route::get('/editor-abstract/revision', [EditorController::class, 'revision'])->name('editor.revision');

        Route::get('/editor-abstract/assign-reviewer/{abstractId}', [EditorController::class, 'showAssignReviewer'])->name('editor.showAssignReviewer');
        Route::post('/editor-abstract/assign-reviewer/{abstractId}', [EditorController::class, 'assignReviewer'])->name('editor.assignReviewer');

        Route::get('/editor-abstract/edit-status/{abstractId}', [EditorController::class, 'showEditStatus'])->name('editor.showEditStatus');
        Route::post('/editor-abstract/edit-status/{abstractId}', [EditorController::class, 'updateStatus'])->name('editor.updateStatus');

        Route::get('/review-abstract', [ReviewController::class, 'index'])->name('review-abstract.index');
        Route::get('/review-abstract-completed', [ReviewController::class, 'reviewCompleted'])->name('review.review-completed');

        Route::get('/review-abstract/{abstract}', [ReviewController::class, 'showReviewForm'])->name('review.showReviewForm');
        Route::post('/review-abstract/{abstract}', [ReviewController::class, 'storeReview'])->name('review.storeReview');

        Route::get('all-fullpaper', [EditorFullPaperController::class, 'index'])->name('editor-fullpaper.index');
        Route::get('/editor-fullpaper/export', [EditorFullPaperController::class, 'export'])->name('editor-fullpaper.export');
        Route::get('/fullpaper-workload', [EditorFullPaperController::class, 'workLoad'])->name('editor-fullpaper.workLoad');

        Route::get('/editor-fullpaper/no-reviewer', [EditorFullPaperController::class, 'noReviewer'])->name('editor-fullpaper.noReviewer');
        Route::get('/editor-fullpaper/no-decision', [EditorFullPaperController::class, 'noDecision'])->name('editor-fullpaper.noDecision');
        Route::get('/editor-fullpaper/with-decision', [EditorFullPaperController::class, 'withDecision'])->name('editor-fullpaper.withDecision');
        Route::get('/editor-fullpaper/revision', [EditorFullPaperController::class, 'revision'])->name('editor-fullpaper.revision');

        Route::get('/editor-fullpaper/assign-reviewer/{fullpaperId}', [EditorFullPaperController::class, 'showAssignReviewer'])->name('editor-fullpaper.showAssignReviewer');
        Route::post('/editor-fullpaper/assign-reviewer/{fullpaperId}', [EditorFullPaperController::class, 'assignReviewer'])->name('editor-fullpaper.assignReviewer');

        Route::get('/editor-fullpaper/edit-status/{fullpaperId}', [EditorFullPaperController::class, 'showEditStatus'])->name('editor-fullpaper.showEditStatus');
        Route::post('/editor-fullpaper/edit-status/{fullpaperId}', [EditorFullPaperController::class, 'updateStatus'])->name('editor-fullpaper.updateStatus');

        Route::get('/review-fullpaper', [ReviewFullPaperController::class, 'index'])->name('review-fullpaper.index');
        Route::get('/review-fullpaper-completed', [ReviewFullPaperController::class, 'reviewCompleted'])->name('review-fullpaper.review-completed');

        Route::get('/review-fullpaper/{fullpaperId}', [ReviewFullPaperController::class, 'showReviewForm'])->name('review-fullpaper.showReviewForm');
        Route::post('/review-fullpaper/{fullpaperId}', [ReviewFullPaperController::class, 'storeReview'])->name('review-fullpaper.storeReview');
    });

Route::name('landing.')
    ->prefix('landing')
    ->namespace('App\Http\Controllers\Landing')
    ->middleware(['auth', 'role:landing-editor'])
    ->group(function () {
        Route::get('landingpage', [LandingPageEditorController::class, 'index'])->name('landingpage.index');
        Route::get('committee', [CommitteeController::class, 'index'])->name('committee.index');
        Route::get('conferencelanding', [ConferenceIndexController::class, 'index'])->name('conferencelanding.index');
        Route::get('submission', [SubmissionIndexController::class, 'index'])->name('submission.index');
        Route::resource('speakers', SpeakerController::class);
        Route::resource('registrationFee', 'RegistrationFeeController');
        Route::resource('faq', 'FaqController');
        Route::post('publications-journal/settings', [PublicationsJournalController::class, 'updateSettings'])->name('publications-journal.settings.update');
        Route::resource('publications-journal', 'PublicationsJournalController');
        Route::resource('conference-program', 'ConferenceProgramController');
        Route::resource('steering', SteeringCommitteeController::class);
        Route::resource('reviewer', ReviewerCommitteeController::class);
        Route::resource('organizing', OrganizingCommitteeController::class);
        Route::resource('contact', ContactController::class);
        Route::delete('gallery-images/{galleryImage}', [GalleryController::class, 'destroyImage'])
            ->name('gallery.images.destroy');
        Route::resource('gallery', 'GalleryController');
        Route::resource('venue', 'VenueController');
        Route::resource('abouts', AboutController::class);
        Route::resource('poster', PosterController::class);
        Route::resource('deadlines', DeadlineDateController::class);
        Route::resource('logos', LogoController::class);
        Route::resource('whatsapp', WhatsappController::class);
        Route::resource('instagram', InstagramController::class);
        Route::resource('conference-title', ConferenceTitleController::class);
        Route::resource('fullpaper-guidelines', FullpaperGuidelineController::class);
        Route::resource('abstract-guidelines', AbstractGuidelineController::class);
        Route::resource('presentation-guidelines', PresentationGuidelineController::class);
        Route::resource('conference-detail', ConferenceDetailController::class);
        Route::resource('themes', ThemeController::class);
        Route::resource('payment_guidelines', PaymentGuidelineController::class);
        Route::get('newsletters/export', [NewsletterController::class, 'export'])
            ->name('newsletters.export');
        Route::resource('newsletters', NewsletterController::class);
        Route::resource('prevconference', PrevconferenceController::class);
        Route::resource('conference-objectives', ConferenceObjectiveController::class);
        Route::resource('hotels', HotelController::class);


        // Route untuk halaman Setting Tahun Aktif
        Route::get('setting', [SettingController::class, 'index'])->name('setting.index');
        Route::post('setting', [SettingController::class, 'update'])->name('setting.update');
        Route::post('setting', [SettingController::class, 'store'])->name('setting.store');
        Route::post('setting/{id}/set-active', [SettingController::class, 'setActive'])->name('setting.setActive');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Peserta berpindah tahun konferensi yang dilihat (arsip tahun sebelumnya).
    Route::post('viewing-year', [ViewingYearController::class, 'update'])->name('viewing-year.update');

    Route::middleware(['auth', 'role:indonesia-presenter|foreign-presenter'])->group(function () {
        Route::get('abstracts', [AbstractController::class, 'index'])->name('abstracts.index');
        Route::get('final-paper', [FullPaperController::class, 'finalPaperIndex'])->name('finalpaper.index');

        // Aksi tulis: hanya boleh saat peserta berada di tahun aktif.
        // Didaftarkan sebelum route /abstracts/{abstract} supaya "create"
        // tidak tertangkap sebagai parameter.
        Route::middleware('active-year')->group(function () {
            Route::get('abstracts/create', [AbstractController::class, 'create'])->name('abstracts.create');
            Route::post('abstracts', [AbstractController::class, 'store'])->name('abstracts.store');
            Route::get('abstracts/{abstract}/edit', [AbstractController::class, 'edit'])->name('abstracts.edit');
            Route::put('abstracts/{abstract}', [AbstractController::class, 'update'])->name('abstracts.update');
            Route::delete('abstracts/{abstract}', [AbstractController::class, 'destroy'])->name('abstracts.destroy');
            Route::post('fullpaper/commitment-letter', [FullPaperController::class, 'createCommitmentLetter'])->name('fullpapers.createCommitmentLetter');
            Route::post('fullpaper/commitment-letter/{abstractId}', [FullPaperController::class, 'storeCommitmentLetter'])->name('fullpapers.storeCommitmentLetter');
            Route::post('fullpaper/camera-ready', [FullPaperController::class, 'createCameraReady'])->name('fullpapers.createCameraReady');
            Route::post('fullpaper/camera-ready/{abstractId}', [FullPaperController::class, 'storeCameraReady'])->name('fullpapers.storeCameraReady');
            Route::post('fullpaper-create', [FullPaperController::class, 'create'])->name('fullpapers.create');
            Route::post('store/{abstractId}', [FullPaperController::class, 'store'])->name('fullpapers.store');
        });

        Route::get('abstracts/{id}/download-pdf', [AbstractController::class, 'downloadPdf'])->name('abstracts.downloadPdf');
        Route::get('abstracts/{id}/acceptance-pdf', [AbstractController::class, 'acceptancePdf'])->name('abstracts.acceptancePdf');
        Route::get('abstracts/{id}/certificate/{type}', [AbstractController::class, 'viewCertificate'])->name('abstracts.viewCertificate');
        Route::get('/fullpaper-create', function () {
            return redirect()->route('abstracts.index');
        });
        Route::get('/fullpaper/commitment-letter', function () {
            return redirect()->route('abstracts.index');
        });
        Route::get('/fullpaper/camera-ready', function () {
            return redirect()->route('finalpaper.index');
        });

        // Paling akhir: pola paling umum, supaya tidak menelan route di atasnya.
        Route::get('abstracts/{abstract}', [AbstractController::class, 'show'])->name('abstracts.show');
    });

    Route::get('payment', [FilePaymentController::class, 'create'])->name('filepayments.create');
    Route::post('filepayments', [FilePaymentController::class, 'store'])->middleware('active-year')->name('filepayments.store');
    Route::get('filepayments/{id}/receipt', [FilePaymentController::class, 'receipt'])->name('filepayments.receipt');

    // Bukti pembayaran hanya boleh disajikan oleh route ini (auth + otorisasi
    // di controller), bukan diambil langsung dari symlink /storage.
    Route::get('filepayments/{id}/proof', [FilePaymentController::class, 'proof'])
        ->whereNumber('id')
        ->name('filepayments.proof');

    // URL lama /storage/payments/{filename}: tetap terbaca untuk pemilik/admin
    // (backward compatible), tetapi tanpa login diarahkan ke halaman login
    // dan tanpa hak ditolak 403.
    Route::get('storage/payments/{filename}', [FilePaymentController::class, 'proofByFilename'])
        ->where('filename', '[A-Za-z0-9._\-]+')
        ->name('filepayments.proofByFilename');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/upload-photo', [ProfileController::class, 'uploadPhoto'])->name('profile.uploadPhoto');
    Route::delete('/profile/photo', [ProfileController::class, 'deletePhoto'])->name('profile.deletePhoto');
});

// Template Radix UI (development only)
Route::get('/template', [TemplateController::class, 'index'])->name('template.index');
Route::get('/template/doctor', [TemplateController::class, 'index'])->name('template.doctor');
Route::get('/template/front-office', [TemplateController::class, 'frontOffice'])->name('template.front-office');
Route::get('/template/business', [TemplateController::class, 'business'])->name('template.business');

// Modul pages
Route::get('/template/jadwal/saya',            [TemplateController::class, 'jadwalSaya'])->name('template.jadwal.saya');
Route::get('/template/jadwal/klinik',          [TemplateController::class, 'jadwalKlinik'])->name('template.jadwal.klinik');
Route::get('/template/jadwal/staff',           [TemplateController::class, 'jadwalStaff'])->name('template.jadwal.staff');
Route::get('/template/pasien',                  [TemplateController::class, 'pasien'])->name('template.pasien');
Route::get('/template/pasien/register',         [TemplateController::class, 'pasienRegister'])->name('template.pasien.register');
Route::get('/template/penjualan/transaksi',     [TemplateController::class, 'transaksi'])->name('template.transaksi');
Route::get('/template/treatment/daftar',        [TemplateController::class, 'treatment'])->name('template.treatment');
Route::get('/template/produk/daftar',           [TemplateController::class, 'produk'])->name('template.produk');
Route::get('/template/produk/kategori',         [TemplateController::class, 'kategoriProduk'])->name('template.produk.kategori');
Route::get('/template/inventory/ruang',         [TemplateController::class, 'ruangPenyimpanan'])->name('template.ruang');
Route::get('/template/inventory/penerimaan',    [TemplateController::class, 'penerimaan'])->name('template.penerimaan');
Route::get('/template/pengaturan',              [TemplateController::class, 'setting'])->name('template.setting');
Route::get('/template/pengaturan/staff',        [TemplateController::class, 'daftarStaff'])->name('template.staff');
Route::get('/template/pengaturan/staff/tambah', [TemplateController::class, 'tambahStaff'])->name('template.staff.tambah');
Route::get('/template/pengaturan/cabang',       [TemplateController::class, 'cabang'])->name('template.cabang');
Route::get('/template/pengaturan/compliance',            [TemplateController::class, 'complianceDocument'])->name('template.compliance');
Route::get('/template/pengaturan/compliance/{id}',       [TemplateController::class, 'lihatDokumen'])->name('template.compliance.view');
Route::get('/template/pengaturan/role',         [TemplateController::class, 'userRole'])->name('template.role');
Route::get('/template/pengaturan/supplier',     [TemplateController::class, 'supplierList'])->name('template.supplier');
Route::get('/template/pengaturan/payment',      [TemplateController::class, 'paymentMethod'])->name('template.payment');
Route::get('/template/docs',                    [TemplateController::class, 'docs'])->name('template.docs');

require __DIR__ . '/auth.php';
