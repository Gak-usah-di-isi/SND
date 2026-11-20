<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\RbacOperationException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Rbac\StoreUserRequest;
use App\Http\Requests\Admin\Rbac\UpdateUserRequest;
use App\Models\User;
use App\Repositories\Rbac\RbacRepositoryInterface;
use App\Services\Rbac\UserRbacService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    public function __construct(
        private readonly RbacRepositoryInterface $repository,
        private readonly UserRbacService $service,
    ) {
    }

    public function index(Request $request): Response
    {
        $filters = [
            'search' => (string) $request->query('search', ''),
            'role' => (string) $request->query('role', ''),
        ];

        return Inertia::render('Admin/Rbac/Users', [
            'users' => $this->repository->paginateUsers($filters),
            'availableRoles' => $this->repository->allRoles(),
            'filters' => $filters,
            'authUserId' => $request->user()->id,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return redirect()
            ->route('admin.rbac.users.index')
            ->with('type', 'success')
            ->with('message', 'Pengguna baru berhasil ditambahkan dan role telah diterapkan.');
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        try {
            $this->service->update($user, $request->validated(), $request->user());
        } catch (RbacOperationException $exception) {
            return back()
                ->with('type', 'error')
                ->with('message', $exception->getMessage());
        }

        return redirect()
            ->route('admin.rbac.users.index')
            ->with('type', 'success')
            ->with('message', 'Data pengguna berhasil diperbarui dan role telah disinkronkan.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        try {
            $this->service->delete($user, $request->user());
        } catch (RbacOperationException $exception) {
            return back()
                ->with('type', 'error')
                ->with('message', $exception->getMessage());
        }

        return redirect()
            ->route('admin.rbac.users.index')
            ->with('type', 'success')
            ->with('message', 'Pengguna berhasil dihapus.');
    }
}
