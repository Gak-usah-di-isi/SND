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
        Schema::table('conference_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('conference_settings', 'enable_student_registration')) {
                $table->boolean('enable_student_registration')->default(true)->after('is_payment_enabled');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conference_settings', function (Blueprint $table) {
            if (Schema::hasColumn('conference_settings', 'enable_student_registration')) {
                $table->dropColumn('enable_student_registration');
            }
        });
    }
};
