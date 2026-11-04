<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FilePayment extends Model
{
    use HasFactory;

    protected $table = 'files_payment';

    protected $fillable = [
        'user_id',
        'year',
        'file_path',
        'amount',
        'status',
        'currency'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Batasi ke tahun konferensi tertentu; kalau tahun aktif belum di-set,
     * query dibiarkan apa adanya supaya halaman tetap jalan.
     */
    public function scopeForYear($query, $year)
    {
        return $query->when($year, fn ($q) => $q->where('year', $year));
    }
}
