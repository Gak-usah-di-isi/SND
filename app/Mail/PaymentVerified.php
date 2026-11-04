<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\ConferenceSetting;

class PaymentVerified extends Mailable
{
    use Queueable, SerializesModels;
    public $user;
    public $filePayment;
    public $conference;
    /**
     * Create a new message instance.
     */
    public function __construct($user, $filePayment)
    {
        $this->user = $user;
        $this->filePayment = $filePayment;
        $this->conference = ConferenceSetting::first();
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Payment Verified',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.payment-verified',
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
        return $this->subject('Payment Verified')
            ->view('emails.payment-verified');
    }
}
