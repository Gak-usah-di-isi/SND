<?php

namespace App\Support;

use App\Models\AbstractModel;
use App\Models\Certificate;
use App\Models\FilePayment;
use App\Models\User;
use App\Models\Year;

/**
 * Tahun konferensi yang sedang "dilihat" peserta.
 *
 * Default selalu tahun aktif. Peserta lama boleh berpindah ke tahun
 * sebelumnya untuk melihat arsip datanya — pilihan itu disimpan di session.
 * Tahun selain tahun aktif bersifat READ-ONLY (lihat isReadOnly()), supaya
 * data baru tidak pernah tercatat ke tahun yang salah.
 */
class ViewingYear
{
    public const SESSION_KEY = 'viewing_year';

    /** Tahun yang sedang dilihat; jatuh ke tahun aktif kalau pilihan tidak valid. */
    public static function current(?User $user = null): ?int
    {
        $activeYear = Year::activeYear();
        $selected = session(self::SESSION_KEY);

        if (!$selected || (int) $selected === $activeYear) {
            return $activeYear;
        }

        $user = $user ?? auth()->user();

        // Pilihan lama di session tidak boleh dipercaya begitu saja —
        // pastikan peserta memang punya data di tahun tersebut.
        if (!$user || !in_array((int) $selected, self::availableYears($user), true)) {
            return $activeYear;
        }

        return (int) $selected;
    }

    /** True kalau peserta sedang melihat arsip (bukan tahun aktif). */
    public static function isReadOnly(?User $user = null): bool
    {
        $activeYear = Year::activeYear();

        return $activeYear !== null && self::current($user) !== $activeYear;
    }

    /**
     * Tahun yang boleh dipilih peserta: tahun aktif + tahun mana pun yang
     * benar-benar punya jejak datanya (abstract, pembayaran, atau sertifikat).
     */
    public static function availableYears(User $user): array
    {
        $activeYear = Year::activeYear();

        $years = collect()
            ->merge(AbstractModel::where('user_id', $user->id)->pluck('created_at')->map(fn ($d) => (int) $d->format('Y')))
            ->merge(FilePayment::where('user_id', $user->id)->pluck('year'))
            ->merge(Certificate::where('user_id', $user->id)->pluck('year'))
            ->filter()
            ->map(fn ($y) => (int) $y);

        if ($activeYear) {
            $years->push($activeYear);
        }

        return $years->unique()->sortDesc()->values()->all();
    }

    public static function set(int $year): void
    {
        session([self::SESSION_KEY => $year]);
    }

    public static function reset(): void
    {
        session()->forget(self::SESSION_KEY);
    }
}
