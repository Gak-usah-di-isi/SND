<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Baris rundown (jadwal) yang dulunya tabel HTML statis di
     * invitation-pdf.blade.php — sekarang bisa diedit admin lewat form
     * terstruktur (time/program/pic), diurutkan lewat sort_order.
     */
    public function up(): void
    {
        Schema::create('invitation_rundown_items', function (Blueprint $table) {
            $table->id();
            $table->string('time_label');
            $table->text('program');
            $table->text('pic');
            $table->boolean('is_section_header')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitation_rundown_items');
    }
};
