<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Sertifikat belum terikat tahun konferensi, sehingga peserta lama bisa
     * melihat sertifikat tahun sebelumnya saat tahun aktif sudah berganti.
     * Mengikuti pola uploads.year dan files_payment.year.
     *
     * Tanpa unique (user_id, certificate_type, year): sertifikat presenter
     * memang dibuat per abstract, jadi satu peserta bisa punya beberapa
     * dalam satu tahun.
     */
    public function up(): void
    {
        Schema::table('certificates', function (Blueprint $table) {
            $table->unsignedSmallInteger('year')->nullable()->after('user_id');
            $table->index(['user_id', 'year']);
        });

        DB::table('certificates')->whereNull('year')->update([
            'year' => DB::raw('YEAR(created_at)'),
        ]);
    }

    public function down(): void
    {
        Schema::table('certificates', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'year']);
            $table->dropColumn('year');
        });
    }
};
