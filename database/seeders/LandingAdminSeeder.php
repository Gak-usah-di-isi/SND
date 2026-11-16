<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Akun admin landing page (role landing-editor) untuk BPPM Fakultas Vokasi UB.
 *
 * Password TIDAK ditulis di repo. Berikan lewat environment saat menjalankan:
 *
 *   LANDING_ADMIN_PASSWORD='password-nya' php artisan db:seed --class=LandingAdminSeeder --force
 *
 * Opsional: LANDING_ADMIN_EMAIL (default bppmfv@ub.ac.id).
 *
 * Aman dijalankan ulang: bila akun sudah ada, password dan datanya tidak diubah,
 * hanya dipastikan punya role landing-editor.
 */
class LandingAdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('LANDING_ADMIN_EMAIL', 'bppmfv@ub.ac.id');
        $password = env('LANDING_ADMIN_PASSWORD');

        $role = Role::firstOrCreate(
            ['name' => 'landing-editor'],
            ['display_name' => 'Landing Editor', 'description' => 'Editor Landing Page (kelola konten landing page)'],
        );

        $user = User::where('email', $email)->first();

        if (! $user) {
            if (! $password) {
                $this->command?->error('LANDING_ADMIN_PASSWORD belum diisi. Akun tidak dibuat.');
                $this->command?->line("Contoh: LANDING_ADMIN_PASSWORD='...' php artisan db:seed --class=LandingAdminSeeder --force");

                return;
            }

            $user = User::create([
                'name' => 'Admin Landing Page BPPM',
                'email' => $email,
                // Di-hash otomatis oleh cast 'hashed' pada model User.
                'password' => $password,
                'institution' => 'BPPM Fakultas Vokasi Universitas Brawijaya',
                'is_active' => true,
            ]);
            $this->command?->info("Akun {$email} dibuat.");
        } else {
            $this->command?->line("Akun {$email} sudah ada, password dan data tidak diubah.");
        }

        if (! $user->hasRole('landing-editor')) {
            $user->addRole($role);
            $user->flushCache();
        }

        $this->command?->info("{$email} -> role: " . $user->fresh()->roles->pluck('name')->implode(', '));
    }
}
