<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\ConferenceSetting;
use App\Models\EmailTemplate;

class FullPaperAccepted extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $fullpaper;
    public $conference;
    public $customMessage;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $fullpaper)
    {
        $this->user = $user;
        $this->fullpaper = $fullpaper;
        $this->conference = ConferenceSetting::first();
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Full Paper Accepted',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.fullpaper-accepted',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    public function build()
    {
        $emailTemplate = EmailTemplate::where('type', 'fullpaper_accepted')->first();
        $customMessage = $emailTemplate ? $emailTemplate->content : ' ';

        return $this->subject('Your Full Paper Has Been Accepted')
            ->view('emails.fullpaper-accepted', compact('customMessage'));
    }
}
