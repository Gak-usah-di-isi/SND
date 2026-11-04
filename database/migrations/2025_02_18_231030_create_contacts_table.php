<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('phone1'); 
            $table->string('phone2')->nullable(); 
            $table->string('email')->nullable();
            $table->string('phone1_name')->nullable();
            $table->string('phone2_name')->nullable();
            $table->text('address');
            $table->integer('year')->default(date('Y')); // Menyimpan tahun kontak
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
