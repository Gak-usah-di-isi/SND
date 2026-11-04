<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Template global "Send Invitation" broadcast (subject + zoom) — beda dari
     * InvitationMail lama yang hardcode semuanya. Cuma 1 row (singleton),
     * disepakati dipakai sama tiap tahun konferensi, bukan per-tahun.
     */
    public function up(): void
    {
        Schema::create('invitation_templates', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->string('zoom_url')->nullable();
            $table->string('zoom_id')->nullable();
            $table->string('zoom_pass')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitation_templates');
    }
};
