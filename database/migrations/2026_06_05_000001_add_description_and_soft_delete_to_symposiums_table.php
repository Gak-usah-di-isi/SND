<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('symposiums', function (Blueprint $table) {
            $table->text('description')->nullable()->after('abbreviation');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('symposiums', function (Blueprint $table) {
            $table->dropColumn('description');
            $table->dropSoftDeletes();
        });
    }
};
