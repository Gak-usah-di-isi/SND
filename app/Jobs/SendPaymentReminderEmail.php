<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\User;
use App\Mail\PaymentReminderMail;
use Illuminate\Support\Facades\Mail;

class SendPaymentReminderEmail implements ShouldQueue
{
    use Queueable;

    protected $user;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Mail::to($this->user->email)->send(new PaymentReminderMail($this->user));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Gagal mengirim email PaymentReminder ke {$this->user->email}: " . $e->getMessage());
        }
    }
}
