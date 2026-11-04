<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Year extends Model
{
    use HasFactory;

    protected $fillable = ['year', 'is_active'];

    /** @var int|null|false false = belum pernah diambil dalam request ini */
    private static $activeYearCache = false;

    /**
     * Tahun konferensi yang sedang aktif (angka tahunnya, bukan model).
     * Di-cache per request karena dipakai di definisi relasi yang bisa
     * terpanggil berkali-kali. Null kalau admin belum menetapkan tahun aktif.
     */
    public static function activeYear(): ?int
    {
        if (self::$activeYearCache === false) {
            self::$activeYearCache = static::where('is_active', true)->value('year');
        }

        return self::$activeYearCache;
    }

    /** Dipakai setelah admin mengganti tahun aktif. */
    public static function forgetActiveYear(): void
    {
        self::$activeYearCache = false;
    }
}
