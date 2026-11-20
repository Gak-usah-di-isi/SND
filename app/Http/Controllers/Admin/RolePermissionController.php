<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Rbac\SyncRolePermissionsRequest;
use App\Models\Role;
use App\Repositories\Rbac\RbacRepositoryInterface;
use App\Services\Rbac\RolePermissionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RolePermissionController extends Controller
{
    public function __construct(
        private readonly RbacRepositoryInterface $repository,
        private readonly RolePermissionService $service,
    ) {
    }

    public function index(): Response
    {
        return Inertia::render('Admin/Rbac/Roles', [
            'roles' => $this->repository->rolesWithPermissions(),
            'groupedPermissions' => $this->service->groupedPermissions(),
        ]);
    }

    public function updatePermissions(SyncRolePermissionsRequest $request, Role $role): RedirectResponse
    {
        $this->service->update($role, $request->validated());

        return redirect()
            ->route('admin.rbac.roles.index')
            ->with('type', 'success')
            ->with('message', 'Permission role berhasil diperbarui.');
    }
}
