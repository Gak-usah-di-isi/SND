<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\ConferenceSetting;
use App\Models\InvitationTemplate;
use App\Models\Upload;
use App\Models\Year;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Support\Collection;

class BroadcastInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $abstract;
    public $conference;
    public $activeYear;
    public $conferenceFullName;
    public $signaturePath;
    public $zoomLink;
    public $venue;
    public $letterDate;
    public $pdfThemeParagraph;
    public $rundownEdition;
    public $organizer;
    public $eventDateLabel;
    public $letterHeader;
    public $rundownItems;
    public $roleNames;
    public $subject;

    /**
     * Sengaja TIDAK implement ShouldQueue — broadcast ini harus terkirim
     * langsung (sync), bukan lewat queue database seperti mailable lain.
     */
    public function __construct($user, $abstract, InvitationTemplate $template, Collection $rundownItems)
    {
        $this->user = $user;
        $this->abstract = $abstract;
        $this->conference = ConferenceSetting::first();
        $this->activeYear = Year::activeYear();
        $this->conferenceFullName = trim("{$this->conference?->conference_title} ({$this->conference?->conference_abbreviation}) {$this->activeYear}");
        $this->subject = $template->subject;
        $this->zoomLink = [
            'url' => $template->zoom_url,
            'id' => $template->zoom_id,
            'pass' => $template->zoom_pass,
        ];
        $this->venue = $template->venue;
        $this->letterDate = $template->letter_date ? \Carbon\Carbon::parse($template->letter_date)->format('d F Y') : now()->format('d F Y');
        $this->pdfThemeParagraph = $template->pdf_theme_paragraph;
        $this->rundownEdition = $template->rundown_edition;
        $this->organizer = $template->organizer;
        $this->eventDateLabel = $template->event_date_label;
        $this->rundownItems = $rundownItems;

        $this->roleNames = $user->roles->pluck('name')->toArray();

        $this->letterHeader = Upload::getBase64Image('letter_header', 800);
        $this->signaturePath = Upload::getBase64Image('signature', 300);
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
            view: 'emails.broadcast.invitation',
        );
    }

    public function attachments(): array
    {
        return [];
    }

    public function build()
    {
        $data = [
            'user' => $this->user,
            'abstract' => $this->abstract,
            'conference' => $this->conference,
            'activeYear' => $this->activeYear,
            'conferenceFullName' => $this->conferenceFullName,
            'zoomLink' => $this->zoomLink,
            'venue' => $this->venue,
            'letterDate' => $this->letterDate,
            'pdfThemeParagraph' => $this->pdfThemeParagraph,
            'rundownEdition' => $this->rundownEdition,
            'organizer' => $this->organizer,
            'eventDateLabel' => $this->eventDateLabel,
            'signaturePath' => $this->signaturePath,
            'letterHeader' => $this->letterHeader,
            'rundownItems' => $this->rundownItems,
            'roleNames' => $this->roleNames,
            'subject' => $this->subject,
        ];

        @ini_set('memory_limit', '512M');
        $pdf = Pdf::loadView('emails.broadcast.invitation-pdf', $data);
        $pdf->getDomPDF()->set_option('dpi', 96);
        $pdf->getDomPDF()->set_option('isPhpEnabled', false);

        return $this->subject($this->subject)
            ->view('emails.broadcast.invitation', $data)
            ->attachData($pdf->output(), 'Invitation_' . $this->user->id . '.pdf', [
                'mime' => 'application/pdf',
            ]);
    }
}
