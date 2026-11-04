<?php

namespace App\Http\Middleware;

use App\Support\ViewingYear;
use Closure;
use Illuminate\Http\Request;

/**
 * Menolak aksi tulis ketika peserta sedang melihat arsip tahun sebelumnya.
 *
 * Menyembunyikan tombol di UI saja tidak cukup — request bisa dikirim langsung,
 * dan data baru yang masuk ke tahun yang salah sulit dibersihkan.
 */
class EnsureActiveYearIsSelected
{
    public function handle(Request $request, Closure $next)
    {
        if (ViewingYear::isReadOnly($request->user())) {
            return back()->with([
                'type' => 'warning',
                'message' => 'Anda sedang melihat arsip tahun sebelumnya. Kembali ke tahun aktif untuk melakukan perubahan.',
            ]);
        }

        return $next($request);
    }
}
