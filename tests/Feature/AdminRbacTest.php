<?php

namespace Tests\Feature;

use App\Exceptions\RbacOperationException;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Services\Rbac\UserRbacService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminRbacTest extends TestCase
{
    use DatabaseTransactions;

    private User $admin;
    private Role $adminRole;
    private Role $landingEditorRole;
    private Role $humasRole;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['display_name' => 'Admin', 'description' => 'Administrator utama sistem']
        );
        $this->landingEditorRole = Role::firstOrCreate(
            ['name' => 'landing-editor'],
            ['display_name' => 'Landing Editor', 'description' => 'Editor landing page']
        );
        $this->humasRole = Role::firstOrCreate(
            ['name' => 'humas'],
            ['display_name' => 'Humas', 'description' => 'Humas panitia']
        );

        $this->admin = User::factory()->create([
            'name' => 'Admin RBAC Test',
            'email' => 'admin.rbac.'.uniqid().'@ub.ac.id',
        ]);
        $this->admin->addRole($this->adminRole);
        $this->admin->flushCache();

        User::where('id', '!=', $this->admin->id)
            ->whereHas('roles', fn ($query) => $query->where('name', 'admin'))
            ->get()
            ->each(function (User $user) {
                $user->removeRole($this->adminRole);
                $user->flushCache();
            });
    }

    private function makeUserWithRole(Role $role, array $attributes = []): User
    {
        $user = User::factory()->create(array_merge([
            'email' => 'user.'.uniqid().'@ub.ac.id',
        ], $attributes));
        $user->addRole($role);
        $user->flushCache();

        return $user;
    }

    private function makePermission(string $name): Permission
    {
        return Permission::firstOrCreate(
            ['name' => $name],
            ['display_name' => ucwords(str_replace('-', ' ', $name)), 'description' => $name]
        );
    }

    public function test_guest_is_redirected_from_rbac_routes(): void
    {
        $this->get('/admin/rbac/users')->assertRedirect('/login');
        $this->get('/admin/rbac/roles')->assertRedirect('/login');
    }

    public function test_non_admin_is_forbidden_from_all_rbac_routes(): void
    {
        $editor = $this->makeUserWithRole($this->landingEditorRole);
        $target = $this->makeUserWithRole($this->humasRole);

        $this->actingAs($editor)->get('/admin/rbac/users')->assertForbidden();
        $this->actingAs($editor)->get('/admin/rbac/roles')->assertForbidden();
        $this->actingAs($editor)->post('/admin/rbac/users', [
            'name' => 'Blocked User',
            'email' => 'blocked.'.uniqid().'@ub.ac.id',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'roles' => ['humas'],
        ])->assertForbidden();
        $this->actingAs($editor)->put("/admin/rbac/users/{$target->id}", [
            'name' => $target->name,
            'email' => $target->email,
            'roles' => ['humas'],
        ])->assertForbidden();
        $this->actingAs($editor)->delete("/admin/rbac/users/{$target->id}")->assertForbidden();
        $this->actingAs($editor)->put("/admin/rbac/roles/{$this->humasRole->id}/permissions", [
            'display_name' => 'Humas',
            'description' => 'Humas panitia',
            'permissions' => [],
        ])->assertForbidden();
    }

    public function test_admin_can_view_paginated_users_and_filter_them(): void
    {
        $target = $this->makeUserWithRole($this->landingEditorRole, [
            'name' => 'Staf Pencarian Khusus',
            'email' => 'staf.pencarian.'.uniqid().'@ub.ac.id',
        ]);
        $this->makeUserWithRole($this->humasRole, [
            'name' => 'Pengguna Lain',
            'email' => 'lain.'.uniqid().'@ub.ac.id',
        ]);

        $this->actingAs($this->admin)
            ->get('/admin/rbac/users?search=Staf+Pencarian+Khusus&role=landing-editor')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Rbac/Users')
                ->has('users.data', 1)
                ->where('users.data.0.id', $target->id)
                ->where('users.data.0.email', $target->email)
                ->where('users.data.0.roles.0.name', 'landing-editor')
                ->where('filters.search', 'Staf Pencarian Khusus')
                ->where('filters.role', 'landing-editor')
                ->has('availableRoles')
                ->where('authUserId', $this->admin->id)
            );
    }

    public function test_admin_can_create_user_with_multiple_roles(): void
    {
        $email = 'staf.baru.'.uniqid().'@ub.ac.id';

        $response = $this->actingAs($this->admin)->post('/admin/rbac/users', [
            'name' => 'Staf Sekretariat BPPM',
            'email' => $email,
            'password' => 'PasswordKuat#2026',
            'password_confirmation' => 'PasswordKuat#2026',
            'roles' => ['humas', 'landing-editor'],
            'auto_verify' => true,
        ]);

        $response->assertRedirect(route('admin.rbac.users.index'));
        $response->assertSessionHas('type', 'success');
        $response->assertSessionHas('message', 'Pengguna baru berhasil ditambahkan dan role telah diterapkan.');

        $user = User::where('email', $email)->firstOrFail();
        $this->assertTrue(Hash::check('PasswordKuat#2026', $user->password));
        $this->assertNotNull($user->email_verified_at);
        $this->assertEqualsCanonicalizing(
            ['humas', 'landing-editor'],
            $user->roles()->pluck('name')->all()
        );
    }

    public function test_create_user_validation_errors_are_returned(): void
    {
        $this->actingAs($this->admin)->post('/admin/rbac/users', [
            'name' => '',
            'email' => $this->admin->email,
            'password' => 'short',
            'password_confirmation' => 'different',
            'roles' => [],
        ])->assertSessionHasErrors(['name', 'email', 'password', 'roles']);
    }

    public function test_admin_can_update_user_roles_and_reset_password(): void
    {
        $user = $this->makeUserWithRole($this->landingEditorRole, [
            'password' => 'OldPassword#2026',
        ]);

        $this->actingAs($this->admin)->put("/admin/rbac/users/{$user->id}", [
            'name' => 'Staf BPPM Updated',
            'email' => $user->email,
            'password' => 'NewPassword#2026',
            'password_confirmation' => 'NewPassword#2026',
            'roles' => ['humas'],
        ])->assertRedirect(route('admin.rbac.users.index'))
            ->assertSessionHas('type', 'success');

        $user->refresh();
        $this->assertSame('Staf BPPM Updated', $user->name);
        $this->assertTrue(Hash::check('NewPassword#2026', $user->password));
        $this->assertEquals(['humas'], $user->roles()->pluck('name')->all());
    }

    public function test_update_without_password_keeps_existing_password(): void
    {
        $user = $this->makeUserWithRole($this->humasRole, [
            'password' => 'OldPassword#2026',
        ]);
        $oldHash = $user->password;

        $this->actingAs($this->admin)->put("/admin/rbac/users/{$user->id}", [
            'name' => 'Nama Baru',
            'email' => $user->email,
            'password' => '',
            'password_confirmation' => '',
            'roles' => ['humas', 'landing-editor'],
        ])->assertRedirect(route('admin.rbac.users.index'));

        $user->refresh();
        $this->assertSame($oldHash, $user->password);
        $this->assertTrue(Hash::check('OldPassword#2026', $user->password));
        $this->assertEqualsCanonicalizing(['humas', 'landing-editor'], $user->roles()->pluck('name')->all());
    }

    public function test_admin_cannot_remove_admin_role_from_self(): void
    {
        $response = $this->actingAs($this->admin)->put("/admin/rbac/users/{$this->admin->id}", [
            'name' => $this->admin->name,
            'email' => $this->admin->email,
            'password' => '',
            'password_confirmation' => '',
            'roles' => ['humas'],
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('type', 'error');
        $response->assertSessionHas('message', 'Anda tidak dapat mencabut role admin dari akun sendiri yang sedang aktif login.');
        $this->assertTrue($this->admin->fresh()->hasRole('admin'));
    }

    public function test_admin_cannot_delete_own_account(): void
    {
        $response = $this->actingAs($this->admin)->delete("/admin/rbac/users/{$this->admin->id}");

        $response->assertRedirect();
        $response->assertSessionHas('type', 'error');
        $response->assertSessionHas('message', 'Anda tidak dapat menghapus akun sendiri.');
        $this->assertDatabaseHas('users', ['id' => $this->admin->id]);
    }

    public function test_service_guard_prevents_deleting_last_admin(): void
    {
        $other = $this->makeUserWithRole($this->humasRole);

        $this->expectException(RbacOperationException::class);
        $this->expectExceptionMessage('Akun admin terakhir tidak dapat dihapus.');

        app(UserRbacService::class)->delete($this->admin, $other);
    }

    public function test_admin_can_delete_other_user_and_pivot_is_removed(): void
    {
        $user = $this->makeUserWithRole($this->landingEditorRole);

        $this->actingAs($this->admin)
            ->delete("/admin/rbac/users/{$user->id}")
            ->assertRedirect(route('admin.rbac.users.index'))
            ->assertSessionHas('type', 'success');

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertDatabaseMissing('role_user', ['user_id' => $user->id]);
    }

    public function test_admin_can_view_roles_and_grouped_permissions(): void
    {
        $permission = $this->makePermission('zztest-read');
        $this->humasRole->permissions()->sync([$permission->id]);

        $this->actingAs($this->admin)
            ->get('/admin/rbac/roles')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Rbac/Roles')
                ->has('roles')
                ->has('groupedPermissions.zztest')
                ->where('groupedPermissions.zztest.0.name', 'zztest-read')
            );
    }

    public function test_admin_can_sync_role_permissions_and_metadata(): void
    {
        $read = $this->makePermission('landing-read');
        $manage = $this->makePermission('landing-manage');

        $this->actingAs($this->admin)->put("/admin/rbac/roles/{$this->humasRole->id}/permissions", [
            'display_name' => 'Humas Updated',
            'description' => 'Deskripsi baru humas',
            'permissions' => ['landing-read', 'landing-manage'],
        ])->assertRedirect(route('admin.rbac.roles.index'))
            ->assertSessionHas('type', 'success')
            ->assertSessionHas('message', 'Permission role berhasil diperbarui.');

        $this->humasRole->refresh();
        $this->assertSame('Humas Updated', $this->humasRole->display_name);
        $this->assertSame('Deskripsi baru humas', $this->humasRole->description);

        $permissionIds = $this->humasRole->permissions()->pluck('permissions.id')->all();
        $this->assertEqualsCanonicalizing([$read->id, $manage->id], $permissionIds);
    }

    public function test_sync_role_permissions_validates_payload(): void
    {
        $this->actingAs($this->admin)->put("/admin/rbac/roles/{$this->humasRole->id}/permissions", [
            'display_name' => '',
            'description' => str_repeat('a', 501),
            'permissions' => ['permission-yang-tidak-ada'],
        ])->assertSessionHasErrors(['display_name', 'description', 'permissions.0']);
    }
}
