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
        Schema::create('conference_objectives', function (Blueprint $table) {
            $table->id();
            $table->string('year', 4)->index();
            $table->string('icon')->default('bi bi-check-circle-fill')->comment('Bootstrap Icons class e.g. bi bi-globe');
            $table->text('content');
            $table->unsignedTinyInteger('order_number')->default(0)->comment('Ordering / sequence number');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conference_objectives');
    }
};
