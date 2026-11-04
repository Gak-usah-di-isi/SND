<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invitation_templates', function (Blueprint $table) {
            $table->string('venue')->nullable()->after('zoom_pass');
            $table->date('letter_date')->nullable()->after('venue');
            $table->longText('pdf_theme_paragraph')->nullable()->after('letter_date');
        });
    }

    public function down(): void
    {
        Schema::table('invitation_templates', function (Blueprint $table) {
            $table->dropColumn(['venue', 'letter_date', 'pdf_theme_paragraph']);
        });
    }
};
