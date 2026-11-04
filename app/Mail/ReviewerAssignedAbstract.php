<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\AbstractModel;
use App\Models\User;
use App\Models\ConferenceSetting;

class ReviewerAssignedAbstract extends Mailable
{
    use Queueable, SerializesModels;

    public $abstract;
    public $reviewer;
    public $conference;

    /**
     * Create a new message instance.
     */
    public function __construct(AbstractModel $abstract, User $reviewer)
    {
        $this->abstract = $abstract;
        $this->reviewer = $reviewer;
        $this->conference = ConferenceSetting::first();
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reviewer Assigned Abstract',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.reviewer_assigned_abstract',
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
}
