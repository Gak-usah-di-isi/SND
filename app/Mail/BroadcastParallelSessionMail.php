<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\ConferenceSetting;
use App\Models\ParallelSessionTemplate;
use App\Models\Upload;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Content;

class BroadcastParallelSessionMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $conference;
    public $subject;
    public $importantNotesLines;
    public $onlineGuidelinesLines;
    public $submissionFormUrl;

    /**
     * Sengaja TIDAK implement ShouldQueue — broadcast ini harus terkirim
     * langsung (sync), sama seperti mailable broadcast lainnya.
     */
    public function __construct($user, ParallelSessionTemplate $template)
    {
        $this->user = $user;
        $this->conference = ConferenceSetting::first();
        $this->subject = $template->subject;
        $this->importantNotesLines = $this->notesToLines($template->important_notes);
        $this->onlineGuidelinesLines = $this->notesToLines($template->online_guidelines);
        $this->submissionFormUrl = $template->submission_form_url;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.broadcast.parallel-session',
        );
    }

    public function attachments(): array
    {
        return [];
    }

    public function build()
    {
        $mail = $this->subject($this->subject)
            ->view('emails.broadcast.parallel-session', [
                'user' => $this->user,
                'conference' => $this->conference,
                'importantNotes' => $this->importantNotesLines,
                'onlineGuidelines' => $this->onlineGuidelinesLines,
                'submissionFormUrl' => $this->submissionFormUrl,
            ]);

        $scheduleUpload = Upload::currentForType('pararel_session_template');
        if ($scheduleUpload && file_exists(storage_path('app/public/' . $scheduleUpload->file_path))) {
            $mail->attach(storage_path('app/public/' . $scheduleUpload->file_path), [
                'as' => 'Parallel-Session-Schedule.pdf',
                'mime' => 'application/pdf',
            ]);
        }

        $zoomBgUpload = Upload::currentForType('bg_zoom_template');
        if ($zoomBgUpload && file_exists(storage_path('app/public/' . $zoomBgUpload->file_path))) {
            $mail->attach(storage_path('app/public/' . $zoomBgUpload->file_path), [
                'as' => 'ICASVE-Zoom-Background.jpg',
            ]);
        }

        return $mail;
    }

    /**
     * Textarea admin (1 baris = 1 poin) -> array baris non-kosong, dipakai
     * buat render <li> di blade.
     */
    private function notesToLines(?string $text): array
    {
        if (!$text) {
            return [];
        }

        return array_values(array_filter(array_map('trim', explode("\n", $text)), fn ($line) => $line !== ''));
    }
}
