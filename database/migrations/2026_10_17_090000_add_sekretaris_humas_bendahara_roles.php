<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $roles = [
            [
                'name' => 'sekretaris',
                'display_name' => 'Sekretaris',
                'description' => 'Sekretaris Panitia (Read & Export Data, Tanpa Settings/Files/Broadcast)',
            ],
            [
                'name' => 'humas',
                'display_name' => 'Humas',
                'description' => 'Humas Panitia (Read & Export Data, Tanpa Settings/Files/Broadcast)',
            ],
            [
                'name' => 'bendahara',
                'display_name' => 'Bendahara',
                'description' => 'Bendahara Panitia (Kelola Summary Keuangan & Verifikasi Payment)',
            ],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(
                ['name' => $roleData['name']],
                [
                    'display_name' => $roleData['display_name'],
                    'description' => $roleData['description'],
                ]
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Role::whereIn('name', ['sekretaris', 'humas', 'bendahara'])->delete();
    }
};
