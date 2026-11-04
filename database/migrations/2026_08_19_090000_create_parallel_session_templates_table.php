<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parallel_session_templates', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->text('important_notes')->nullable();
            $table->text('online_guidelines')->nullable();
            $table->string('submission_form_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parallel_session_templates');
    }
};
