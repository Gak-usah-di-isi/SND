<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Contracts\Console\Kernel;

require __DIR__ . '/../../vendor/autoload.php';

$app = require __DIR__ . '/../../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$role = Role::firstOrCreate(
    ['name' => 'admin'],
    ['display_name' => 'Admin', 'description' => 'Administrator utama sistem']
);

$admin = User::firstOrCreate(
    ['email' => 'admin.dampak@ub.ac.id'],
    ['name' => 'Admin BPPM DAMPAK', 'password' => 'password', 'is_active' => true]
);

$admin->forceFill([
    'name' => 'Admin BPPM DAMPAK',
    'password' => 'password',
    'is_active' => true,
    'email_verified_at' => now(),
])->save();

$admin->syncRoles([$role]);
$admin->flushCache();

echo "E2E admin ready: {$admin->email}\n";
