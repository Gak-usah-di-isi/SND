<?php

namespace App\Repositories\Rbac;

use App\Models\Role;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface RbacRepositoryInterface
{
    public function paginateUsers(array $filters, int $perPage = 10): LengthAwarePaginator;

    public function allRoles(): Collection;

    public function rolesWithPermissions(): Collection;

    public function allPermissions(): Collection;

    public function countAdmins(): int;

    public function findRoleByName(string $name): ?Role;
}
