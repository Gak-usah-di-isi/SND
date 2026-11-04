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
        Schema::create('publication_settings', function (Blueprint $table) {
            $table->id();
            $table->string('year', 4)->index();
            $table->text('proceedings_text')->nullable();
            $table->string('journal_title')->default('Journal Publication Opportunity');
            $table->text('journal_text')->nullable();
            $table->boolean('is_journal_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publication_settings');
    }
};
