<?php

namespace App\Services\Rbac;

use App\Exceptions\RbacOperationException;
use App\Models\User;
use App\Repositories\Rbac\RbacRepositoryInterface;
use Illuminate\Support\Facades\DB;

class UserRbacService
{
    public function __construct(private readonly RbacRepositoryInterface $repository)
    {
    }

    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'is_active' => true,
            ]);

            if (! empty($data['auto_verify'])) {
                $user->forceFill(['email_verified_at' => now()])->save();
            }

            $user->syncRoles($data['roles']);
            $user->flushCache();

            return $user->fresh('roles');
        });
    }

    public function update(User $user, array $data, User $actor): User
    {
        return DB::transaction(function () use ($user, $data, $actor) {
            $roles = $data['roles'];

            $this->guardAdminRoleRemoval($user, $roles, $actor);

            $attributes = [
                'name' => $data['name'],
                'email' => $data['email'],
            ];

            if (! empty($data['password'])) {
                $attributes['password'] = $data['password'];
            }

            $user->update($attributes);
            $user->syncRoles($roles);
            $user->flushCache();

            return $user->fresh('roles');
        });
    }

    public function delete(User $user, User $actor): void
    {
        if ($actor->id === $user->id) {
            throw new RbacOperationException('Anda tidak dapat menghapus akun sendiri.');
        }

        if ($user->hasRole('admin') && $this->repository->countAdmins() <= 1) {
            throw new RbacOperationException('Akun admin terakhir tidak dapat dihapus.');
        }

        DB::transaction(function () use ($user) {
            $user->roles()->detach();
            $user->permissions()->detach();
            $user->delete();
        });
    }

    private function guardAdminRoleRemoval(User $user, array $newRoles, User $actor): void
    {
        if (! $user->hasRole('admin') || in_array('admin', $newRoles, true)) {
            return;
        }

        if ($actor->id === $user->id) {
            throw new RbacOperationException('Anda tidak dapat mencabut role admin dari akun sendiri yang sedang aktif login.');
        }

        if ($this->repository->countAdmins() <= 1) {
            throw new RbacOperationException('Role admin tidak dapat dicabut dari akun admin terakhir.');
        }
    }
}
