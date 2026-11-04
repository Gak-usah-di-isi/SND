<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laratrust\Traits\HasRolesAndPermissions;
use Laratrust\Contracts\LaratrustUser;

class User extends Authenticatable  implements LaratrustUser
{
    use HasRolesAndPermissions;
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'name_certificate',
        'email',
        'password',
        'institution',
        'job_title',
        'phone_number',
        'attendance',
        'country',
        'is_student',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_student' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function abstracts()
    {
        return $this->hasMany(AbstractModel::class);
    }

    public function fullPapers()
    {
        return $this->hasMany(FullPaper::class);
    }

    public function abstractReviews()
    {
        return $this->hasMany(AbstractReview::class, 'reviewer_id');
    }

    public function fullPaperReviews()
    {
        return $this->hasMany(FullPaperReview::class, 'reviewer_id');
    }

    /**
     * Pembayaran peserta untuk tahun konferensi yang sedang aktif.
     * Sengaja di-scope di sini supaya semua pengecekan "sudah bayar?"
     * (gate upload full paper, LoA, dashboard, laporan admin) otomatis
     * mengacu ke tahun berjalan — bukan pembayaran tahun sebelumnya.
     */
    public function filePayment()
    {
        return $this->hasOne(FilePayment::class)->forYear(Year::activeYear());
    }

    /** Seluruh riwayat pembayaran lintas tahun. */
    public function filePayments()
    {
        return $this->hasMany(FilePayment::class);
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new \App\Notifications\ResetPasswordNotification($token));
    }
}
