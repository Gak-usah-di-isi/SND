<?php

namespace App\Services\Rbac;

use App\Models\Role;
use App\Repositories\Rbac\RbacRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RolePermissionService
{
    public function __construct(private readonly RbacRepositoryInterface $repository)
    {
    }

    public function groupedPermissions(): array
    {
        return $this->groupPermissions($this->repository->allPermissions());
    }

    public function moduleLabel(string $module): string
    {
        return [
            'abstracts' => 'Abstracts',
            'certificates' => 'Certificates',
            'landing' => 'Landing Page',
            'participants' => 'Participants',
            'payments' => 'Payments',
            'profile' => 'Profile',
            'reviewer' => 'Reviewers',
            'symposiums' => 'Symposiums',
        ][$module] ?? Str::headline($module);
    }

    public function update(Role $role, array $data): Role
    {
        return DB::transaction(function () use ($role, $data) {
            $role->update([
                'display_name' => $data['display_name'],
                'description' => $data['description'] ?? null,
            ]);

            $role->syncPermissions($data['permissions']);
            $role->flushCache();

            return $role->fresh('permissions');
        });
    }

    public function groupPermissions(Collection $permissions): array
    {
        return $permissions
            ->sortBy('name')
            ->groupBy(fn ($permission) => Str::before($permission->name, '-'))
            ->map(fn (Collection $group) => $group->map(fn ($permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
                'display_name' => $permission->display_name,
                'description' => $permission->description,
            ])->values()->all())
            ->all();
    }
}
