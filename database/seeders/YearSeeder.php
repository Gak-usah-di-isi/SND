<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Year;
use App\Models\LandingSetting;

class YearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus semua data sebelum menambahkan baru
        Year::truncate();

        // Tambahkan tahun 2024
        Year::create([
            'year' => 2024,
            'is_active' => false, // Tahun 2024 tidak aktif secara default
        ]);

        // Tambahkan tahun sekarang dan aktifkan
        Year::create([
            'year' => now()->year,
            'is_active' => true,
        ]);


    }
}
