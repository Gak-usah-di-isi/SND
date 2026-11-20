<?php

namespace App\Repositories\Rbac;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentRbacRepository implements RbacRepositoryInterface
{
    public function paginateUsers(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $role = trim((string) ($filters['role'] ?? ''));

        return User::query()
            ->with('roles:id,name,display_name,description')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($role !== '', fn ($query) => $query->whereHas(
                'roles',
                fn ($sub) => $sub->where('name', $role)
            ))
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'is_active' => $user->is_active,
                'roles' => $user->roles->map(fn (Role $role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'display_name' => $role->display_name,
                ])->values()->all(),
                'created_at' => $user->created_at,
            ]);
    }

    public function allRoles(): Collection
    {
        return Role::query()
            ->orderBy('name')
            ->get(['id', 'name', 'display_name', 'description'])
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'display_name' => $role->display_name,
                'description' => $role->description,
            ])
            ->values();
    }

    public function rolesWithPermissions(): Collection
    {
        return Role::query()
            ->with(['permissions:id,name,display_name,description'])
            ->withCount('users')
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'display_name' => $role->display_name,
                'description' => $role->description,
                'users_count' => $role->users_count,
                'permissions' => $role->permissions->pluck('name')->values()->all(),
            ])
            ->values();
    }

    public function allPermissions(): Collection
    {
        return Permission::query()
            ->orderBy('name')
            ->get(['id', 'name', 'display_name', 'description']);
    }

    public function countAdmins(): int
    {
        return User::query()
            ->whereHas('roles', fn ($query) => $query->where('name', 'admin'))
            ->count();
    }

    public function findRoleByName(string $name): ?Role
    {
        return Role::query()->where('name', $name)->first();
    }
}
