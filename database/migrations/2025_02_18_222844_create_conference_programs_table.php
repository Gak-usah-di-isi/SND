<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conference_programs', function (Blueprint $table) {
            $table->id();
            $table->integer('year'); // Menambahkan kolom tahun
            $table->integer('day_number');
            $table->string('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('program_name');
            $table->string('pic');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conference_programs');
    }
};
