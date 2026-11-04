<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Illuminate\Queue\Events\JobProcessing;
use App\Models\Logo;
use App\Models\Upload;
use App\Models\Year;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Schema::defaultStringLength(191);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->ensureSafeMailDriver();

        // Cache tahun aktif di Year bersifat statis, sedangkan queue worker
        // (QUEUE_CONNECTION=database) berumur panjang dan memakai instance aplikasi
        // yang sama antar-job. Tanpa reset ini, worker bisa memakai tahun lama
        // setelah admin mengganti tahun aktif, sampai worker di-restart.
        Event::listen(JobProcessing::class, fn () => Year::forgetActiveYear());

        View::composer('*', function ($view) {
            // Cek apakah ada tahun aktif
            $activeYear = Year::where('is_active', true)->value('year');

            // Jika tidak ada tahun aktif, pakai tahun terbaru dari tabel Logo
            if (!$activeYear) {
                $activeYear = Logo::max('year');
            }

            // Ambil logo berdasarkan tahun aktif
            $logo = $activeYear ? Logo::where('year', $activeYear)->first() : null;

            // Jika logo tidak ditemukan di tabel Logo, cari di tabel Upload
            if (!$logo) {
                $logo = Upload::currentForType('logo');
            }

            // Tentukan path logo
            $logoPath = $logo ? asset('storage/' . ($logo->image ?? $logo->file_path)) : asset('img/icasve_logo.jpg');

            // Kirim variabel ke semua view
            $view->with('logoPath', $logoPath);
        });
    }

    /**
     * Otomatis deteksi kelengkapan konfigurasi email (.env).
     * Jika driver diset 'smtp' tetapi kredensial belum diisi (masih null/kosong/dummy),
     * driver dialihkan ke 'log' agar seluruh proses bisnis (register, review, payment, dll)
     * tidak pernah gagal/crash karena timeout koneksi SMTP.
     */
    private function ensureSafeMailDriver(): void
    {
        $defaultMailer = config('mail.default');

        if ($defaultMailer === 'smtp') {
            $host = config('mail.mailers.smtp.host');
            $username = config('mail.mailers.smtp.username');
            $password = config('mail.mailers.smtp.password');

            $isUnconfigured = empty($host)
                || empty($username)
                || $username === 'null'
                || empty($password)
                || $password === 'null'
                || (in_array($host, ['null', '127.0.0.1', 'localhost']) && (empty($username) || $username === 'null'));

            if ($isUnconfigured) {
                config(['mail.default' => 'log']);
            }
        }
    }
}
