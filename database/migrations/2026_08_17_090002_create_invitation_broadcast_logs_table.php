<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Riwayat pengiriman broadcast Send Invitation (baru) — belum ada
     * tabel semacam ini di project sebelumnya, jadi broadcast lama tidak
     * pernah punya jejak siapa sudah/belum terkirim.
     */
    public function up(): void
    {
        Schema::create('invitation_broadcast_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('email');
            $table->string('name');
            $table->string('role')->nullable();
            $table->foreignId('abstract_id')->nullable()->constrained('abstracts')->nullOnDelete();
            $table->string('status');
            $table->text('error_message')->nullable();
            $table->boolean('is_test')->default(false);
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitation_broadcast_logs');
    }
};
