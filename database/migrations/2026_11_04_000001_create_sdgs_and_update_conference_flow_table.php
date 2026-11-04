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
        if (!Schema::hasTable('sdgs')) {
            Schema::create('sdgs', function (Blueprint $table) {
                $table->id();
                $table->unsignedInteger('order')->default(1);
                $table->string('code', 20); // e.g. SDG-1
                $table->string('name_en');
                $table->string('name_id');
                $table->string('color', 20)->default('#0152EA');
                $table->string('icon')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('abstract_sdg')) {
            Schema::create('abstract_sdg', function (Blueprint $table) {
                $table->id();
                $table->foreignId('abstract_id')->constrained('abstracts')->onDelete('cascade');
                $table->foreignId('sdg_id')->constrained('sdgs')->onDelete('cascade');
                $table->timestamps();

                $table->unique(['abstract_id', 'sdg_id']);
            });
        }

        Schema::table('abstracts', function (Blueprint $table) {
            if (!Schema::hasColumn('abstracts', 'editor_feedback')) {
                $table->text('editor_feedback')->nullable()->after('status');
            }
        });

        Schema::table('conference_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('conference_settings', 'is_payment_enabled')) {
                // Default false karena Bu Salnan menyampaikan tahun ini gratis
                $table->boolean('is_payment_enabled')->default(false)->after('attendance_format');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conference_settings', function (Blueprint $table) {
            if (Schema::hasColumn('conference_settings', 'is_payment_enabled')) {
                $table->dropColumn('is_payment_enabled');
            }
        });

        Schema::table('abstracts', function (Blueprint $table) {
            if (Schema::hasColumn('abstracts', 'editor_feedback')) {
                $table->dropColumn('editor_feedback');
            }
        });

        Schema::dropIfExists('abstract_sdg');
        Schema::dropIfExists('sdgs');
    }
};
