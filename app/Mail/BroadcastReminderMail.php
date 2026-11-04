<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\ConferenceSetting;
use App\Models\ReminderTemplate;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Content;

class BroadcastReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $conference;
    public $subject;
    public $deadlineLabel;
    public $paymentUrl;

    /**
     * Sengaja TIDAK implement ShouldQueue — broadcast ini harus terkirim
     * langsung (sync), sama seperti BroadcastInvitationMail.
     */
    public function __construct($user, ReminderTemplate $template)
    {
        $this->user = $user;
        $this->conference = ConferenceSetting::first();
        $this->subject = $template->subject;
        $this->deadlineLabel = $template->payment_deadline
            ? \Carbon\Carbon::parse($template->payment_deadline)->format('F j, Y')
            : '-';
        $this->paymentUrl = route('filepayments.create');
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
            view: 'emails.broadcast.reminder',
        );
    }

    public function attachments(): array
    {
        return [];
    }

    public function build()
    {
        return $this->subject($this->subject)
            ->view('emails.broadcast.reminder', [
                'user' => $this->user,
                'conference' => $this->conference,
                'deadlineLabel' => $this->deadlineLabel,
                'paymentUrl' => $this->paymentUrl,
            ]);
    }
}
