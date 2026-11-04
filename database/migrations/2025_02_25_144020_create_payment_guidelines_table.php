<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payment_guidelines', function (Blueprint $table) {
            $table->id();
            $table->string('bank_name');
            $table->year('year');
            $table->text('guideline');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_guidelines');
    }
};
