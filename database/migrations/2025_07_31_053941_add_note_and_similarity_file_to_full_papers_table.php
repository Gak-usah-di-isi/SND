<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('full_papers', function (Blueprint $table) {
            $table->text('note')->nullable()->after('status');
            $table->string('similarity_file')->nullable()->after('note');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('full_papers', function (Blueprint $table) {
            $table->dropColumn(['note', 'similarity_file']);
        });
    }
};
