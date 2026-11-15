<?php

namespace Database\Seeders;

use App\Models\ConferenceSetting;
use App\Models\LandingSetting;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Sdg;
use App\Models\Year;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

/**
 * Seeder yang AMAN dijalankan setiap deploy (otomatis setelah `php artisan migrate`,
 * lihat AppServiceProvider). Hanya MENAMBAH data acuan yang belum ada:
 *
 * - tidak pernah mengosongkan tabel (truncate/delete),
 * - tidak menimpa isian admin,
 * - tidak membuat akun user.
 *
 * Jangan ganti isinya dengan DatabaseSeeder/LaratrustSeeder: LaratrustSeeder mengosongkan
 * tabel users dan role_user lalu membuat akun default (password "password"), dan
 * Year/LandingSetting/ConferenceSetting seeder menimpa pengaturan yang sudah diubah admin.
 */
class DeploySeeder extends Seeder
{
    public function run(): void
    {
        $this->rolesAndPermissions();
        $this->callWhenEmpty('countries', CountriesSeeder::class);
        $this->callWhenEmpty((new Sdg)->getTable(), SdgSeeder::class);
        $this->callWhenEmpty((new ConferenceSetting)->getTable(), ConferenceSettingSeeder::class);
        $this->activeYearWhenEmpty();
    }

    /**
     * Role dan permission dari config/laratrust_seeder.php. Yang sudah ada dibiarkan;
     * permission hanya ditambahkan ke role (tidak ada yang dilepas).
     */
    private function rolesAndPermissions(): void
    {
        $structure = Config::get('laratrust_seeder.roles_structure');
        $map = collect(Config::get('laratrust_seeder.permissions_map'));

        if (! $structure) {
            $this->command?->warn('  lewati  role & permission (config laratrust_seeder belum ada)');

            return;
        }

        foreach ($structure as $roleName => $modules) {
            $label = ucwords(str_replace('_', ' ', $roleName));
            $role = Role::firstOrCreate(['name' => $roleName], ['display_name' => $label, 'description' => $label]);

            $permissionIds = [];
            foreach ($modules as $module => $actions) {
                foreach (explode(',', $actions) as $action) {
                    $value = $map->get($action);
                    $permissionIds[] = Permission::firstOrCreate(
                        ['name' => $module . '-' . $value],
                        ['display_name' => ucfirst($value) . ' ' . ucfirst($module), 'description' => ucfirst($value) . ' ' . ucfirst($module)],
                    )->id;
                }
            }

            $role->permissions()->syncWithoutDetaching($permissionIds);
        }

        $this->command?->line('  ok      role & permission');
    }

    /** Jalankan seeder lain hanya bila tabelnya masih kosong (instalasi baru). */
    private function callWhenEmpty(string $table, string $seeder): void
    {
        if (DB::table($table)->exists()) {
            $this->command?->line("  lewati  {$table} (sudah ada data)");

            return;
        }

        $this->call($seeder);
    }

    /** Tahun aktif awal untuk instalasi baru; tahun yang sudah diatur admin tidak disentuh. */
    private function activeYearWhenEmpty(): void
    {
        $year = (int) now()->year;

        if (! Year::query()->exists()) {
            Year::create(['year' => $year, 'is_active' => true]);
            $this->command?->line("  isi     years ({$year} aktif)");
        }

        if (! LandingSetting::query()->exists()) {
            LandingSetting::create(['year' => $year, 'is_active' => true]);
            $this->command?->line("  isi     landing_settings ({$year} aktif)");
        }
    }
}
