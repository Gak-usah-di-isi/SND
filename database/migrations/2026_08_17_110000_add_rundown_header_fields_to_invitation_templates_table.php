<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invitation_templates', function (Blueprint $table) {
            $table->string('rundown_edition')->nullable()->after('pdf_theme_paragraph');
            $table->string('organizer')->nullable()->after('rundown_edition');
            $table->string('event_date_label')->nullable()->after('organizer');
        });
    }

    public function down(): void
    {
        Schema::table('invitation_templates', function (Blueprint $table) {
            $table->dropColumn(['rundown_edition', 'organizer', 'event_date_label']);
        });
    }
};
