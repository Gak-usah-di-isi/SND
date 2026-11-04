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

class AbstractAccepted extends Mailable
{

    use Queueable, SerializesModels;
    public $user;
    public $abstract;
    public $conference;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $abstract)
    {
        $this->user = $user;
        $this->abstract = $abstract;
        $this->conference = ConferenceSetting::first();
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Abstract Accepted',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.abstract-accepted',
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
        $emailTemplate = EmailTemplate::where('type', 'abstract_accepted')->first();
        $customMessage = $emailTemplate ? $emailTemplate->content : ' ';

        return $this->subject('Your Abstract Has Been Accepted')
            ->view('emails.abstract-accepted', compact('customMessage'));
    }
}
