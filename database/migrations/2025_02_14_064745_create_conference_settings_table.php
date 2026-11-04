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
        Schema::create('conference_settings', function (Blueprint $table) {
            $table->id();
            $table->string('conference_title');
            $table->string('conference_abbreviation');
            $table->string('conference_chairperson');
            $table->text('administrator_email');
            $table->text('treasurer_email');
            $table->text('bank_account');
            $table->integer('max_abstracts_per_participant')->default(0);
            $table->integer('max_words_in_abstract_body')->default(0);
            $table->enum('attendance_format', ['onsite', 'online', 'hybrid'])->default('hybrid');
            $table->boolean('open_registration')->default(false);
            $table->boolean('open_full_paper_upload')->default(false);
            $table->boolean('open_abstract_submission')->default(false);
            $table->text('payment_instruction');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conference_settings');
    }
};
