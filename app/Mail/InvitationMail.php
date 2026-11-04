<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\ConferenceSetting;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Content;
use App\Models\Upload;

class InvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $abstract;
    public $conference;
    public $signaturePath;
    public $zoomLink;
    public $letterHeader;
    public $rundownHtml;
    public $roleNames;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $abstract = null)
    {
        $this->user = $user;
        $this->abstract = $abstract;
        $this->conference = ConferenceSetting::first();
        $this->zoomLink = [
            'url' => 'https://univ-brawijaya.zoom.us/j/91906144067?pwd=9P6mENqBAKABq495fsw5LRaOCv3RgV.1',
            'id' => '919 0614 4067',
            'pass' => '834404',
        ];

        $this->roleNames = $user->roles->pluck('name')->toArray();

        $this->letterHeader = Upload::getBase64Image('letter_header', 800);
        $this->signaturePath = Upload::getBase64Image('signature', 300);

        $invitation = Upload::currentForType('invitation_template');
        $this->rundownHtml = null;
        if ($invitation && file_exists(storage_path('app/public/' . $invitation->file_path))) {
            $this->rundownHtml = file_get_contents(storage_path('app/public/' . $invitation->file_path));
        }
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Acceptance of Abstract and Invitation as an Academic Session Speaker at The 4th International Conference On Applied Science For Vocational Education (ICAVSE 2025)',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.invitation',
        );
    }

    public function attachments(): array
    {
        return [];
    }

    /**
     * Build the message.
     */
    public function build()
    {
        @ini_set('memory_limit', '512M');
        $pdf = Pdf::loadView('emails.invitation-pdf', [
            'user' => $this->user,
            'abstract' => $this->abstract,
            'conference' => $this->conference,
            'zoomLink' => $this->zoomLink,
            'signaturePath' => $this->signaturePath,
            'letterHeader' => $this->letterHeader,
            'rundownHtml' => $this->rundownHtml,
            'roleNames' => $this->roleNames,
        ]);
        $pdf->getDomPDF()->set_option('dpi', 96);
        $pdf->getDomPDF()->set_option('isPhpEnabled', false);

        return $this->subject('Invitation as Academic Session Speaker at ICASVE 2025')
            ->view('emails.invitation', [
                'user' => $this->user,
                'abstract' => $this->abstract,
                'conference' => $this->conference,
                'zoomLink' => $this->zoomLink,
                'signaturePath' => $this->signaturePath,
                'letterHeader' => $this->letterHeader,
                'rundownHtml' => $this->rundownHtml,
                'roleNames' => $this->roleNames,
            ])
            ->attachData($pdf->output(), 'Invitation_' . $this->user->id . '.pdf', [
                'mime' => 'application/pdf',
            ]);
    }
}
