<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Sebelumnya pembayaran tidak terikat tahun konferensi sama sekali, sehingga
     * peserta yang sudah bayar di tahun sebelumnya dianggap "sudah bayar" untuk
     * tahun aktif berikutnya (lolos gate upload full paper, invoice tidak terkirim).
     * Kolom `year` mengikuti pola yang sama dengan uploads.year.
     */
    public function up(): void
    {
        Schema::table('files_payment', function (Blueprint $table) {
            $table->unsignedSmallInteger('year')->nullable()->after('user_id');
        });

        // Backfill: pembayaran lama tetap terikat ke tahun saat dibuat.
        DB::table('files_payment')->whereNull('year')->update([
            'year' => DB::raw('YEAR(created_at)'),
        ]);

        Schema::table('files_payment', function (Blueprint $table) {
            // Satu pembayaran per peserta per tahun konferensi.
            $table->unique(['user_id', 'year']);
        });
    }

    public function down(): void
    {
        Schema::table('files_payment', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'year']);
            $table->dropColumn('year');
        });
    }
};
