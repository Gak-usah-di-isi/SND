<?php

namespace Database\Seeders;

use App\Models\LandingSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LandingSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LandingSetting::truncate();
        LandingSetting::create([
            'year' => now()->year,
            'is_active' => true,
        ]);
    }
}
