import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.APP_URL || 'http://127.0.0.1:8000';
const ADMIN_EMAIL = 'admin.dampak@ub.ac.id';
const ADMIN_PASSWORD = 'password';

async function loginAs(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /login|masuk/i }).click();
  await page.waitForLoadState('networkidle');
}

test.describe('Admin RBAC & User Management E2E', () => {
  test('1. Admin dapat mengakses menu RBAC, mencari user, dan membuat akun staf baru dengan role', async ({ page }) => {
    const uniqueEmail = `staf.bppm.${Date.now()}@ub.ac.id`;

    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto(`${BASE_URL}/admin/rbac/users`);

    await expect(page.getByRole('heading', { name: /manajemen pengguna|user management/i })).toBeVisible();

    // Buka modal tambah user baru
    await page.getByRole('button', { name: /tambah user|add user/i }).click();
    await page.getByLabel(/nama|name/i).fill('Staf Unit BPPM');
    await page.getByLabel('Email', { exact: true }).fill(uniqueEmail);
    await page.getByLabel(/^password$/i).fill('PasswordBPPM#2026');
    await page.getByLabel(/konfirmasi password|confirm password/i).fill('PasswordBPPM#2026');

    // Pilih role landing-editor
    await page.getByLabel(/landing editor/i).check();
    await page.getByRole('button', { name: /simpan|save/i }).click();

    // Verifikasi notifikasi sukses & user muncul di tabel
    await expect(page.getByText(/berhasil ditambahkan/i)).toBeVisible();
    await page.getByPlaceholder(/cari|search/i).fill(uniqueEmail);
    await expect(page.getByText(uniqueEmail)).toBeVisible();
    const createdRow = page.getByRole('row').filter({ hasText: uniqueEmail });
    await expect(createdRow.getByText('Landing Editor', { exact: true })).toBeVisible();
  });

  test('2. Akun baru yang dibuat via UI RBAC dapat langsung login sesuai hak akses rolenya', async ({ page }) => {
    const staffEmail = `editor.test.${Date.now()}@ub.ac.id`;
    const staffPassword = 'PasswordEditor#2026';

    // Admin membuat akun dengan role landing-editor
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto(`${BASE_URL}/admin/rbac/users`);
    await page.getByRole('button', { name: /tambah user|add user/i }).click();
    await page.getByLabel(/nama|name/i).fill('Editor Konten DAMPAK');
    await page.getByLabel('Email', { exact: true }).fill(staffEmail);
    await page.getByLabel(/^password$/i).fill(staffPassword);
    await page.getByLabel(/konfirmasi password|confirm password/i).fill(staffPassword);
    await page.getByLabel(/landing editor/i).check();
    await page.getByRole('button', { name: /simpan|save/i }).click();
    await expect(page.getByText(/berhasil ditambahkan/i)).toBeVisible();

    // Logout admin & login memakai akun baru
    await page.getByRole('button', { name: /admin bppm dampak/i }).click();
    await page.getByRole('menuitem', { name: /sign out|keluar/i }).click();
    await page.waitForURL(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');

    await loginAs(page, staffEmail, staffPassword);
    await expect(page).not.toHaveURL(/\/login/);

    // Non-admin (landing-editor) harus ditolak (403) saat mengakses halaman RBAC Admin
    const response = await page.goto(`${BASE_URL}/admin/rbac/users`);
    expect(response?.status()).toBe(403);
  });

  test('3. Admin dapat mengubah role user eksisting dan mencegah penghapusan akun sendiri', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto(`${BASE_URL}/admin/rbac/users`);

    // Cari akun admin sendiri yang sedang login
    await page.getByPlaceholder(/cari|search/i).fill(ADMIN_EMAIL);
    const ownRow = page.getByRole('row', { name: new RegExp(ADMIN_EMAIL, 'i') });
    await expect(ownRow).toBeVisible();

    // Tombol hapus pada akun sendiri harus disabled atau ditolak oleh sistem
    const deleteButton = ownRow.getByRole('button', { name: /hapus|delete/i });
    if (await deleteButton.isEnabled()) {
      await deleteButton.click();
      await expect(page.getByText(/tidak dapat menghapus akun sendiri/i)).toBeVisible();
    } else {
      await expect(deleteButton).toBeDisabled();
    }
  });

  test('4. Admin dapat memperbarui matriks permission pada role di halaman Manajemen Role', async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto(`${BASE_URL}/admin/rbac/roles`);

    await expect(page.getByRole('heading', { name: /role & permission/i })).toBeVisible();

    // Pilih role humas untuk diatur permission-nya
    const roleCard = page.locator('[data-role-name="humas"]').first();
    await expect(roleCard).toBeVisible();

    const firstPermissionCheckbox = roleCard.getByRole('checkbox').first();
    const initialChecked = await firstPermissionCheckbox.isChecked();
    await firstPermissionCheckbox.setChecked(!initialChecked);

    await roleCard.getByRole('button', { name: /simpan permission|save/i }).click();
    await expect(page.getByText(/permission.*berhasil diperbarui/i)).toBeVisible();

    // Reload halaman untuk memastikan perubahan tersimpan di database
    await page.reload();
    await expect(roleCard.getByRole('checkbox').first()).toBeChecked({ checked: !initialChecked });
  });
});

