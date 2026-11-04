<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('uploads', function (Blueprint $table) {
            $table->unsignedSmallInteger('year')->nullable()->after('file_path');
        });

        // Backfill existing rows with the year they were originally created in,
        // so previously uploaded files stay tied to the year they belong to.
        DB::table('uploads')->whereNull('year')->update([
            'year' => DB::raw('YEAR(created_at)'),
        ]);

        Schema::table('uploads', function (Blueprint $table) {
            $table->unique(['type', 'year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('uploads', function (Blueprint $table) {
            $table->dropUnique(['type', 'year']);
            $table->dropColumn('year');
        });
    }
};
