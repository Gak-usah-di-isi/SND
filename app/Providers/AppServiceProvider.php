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

}
