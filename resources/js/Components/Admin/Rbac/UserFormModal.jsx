import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Icon } from '@iconify/react';

function Field({ id, label, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 6, fontFamily: 'Manrope,sans-serif' }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p style={{ margin: '4px 0 0', fontSize: 11.5, color: '#DC2626', fontFamily: 'Manrope,sans-serif' }}>
          {error}
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  height: 38,
  borderRadius: 8,
  border: '1px solid #E2E8F0',
  padding: '0 12px',
  fontSize: 13,
  color: '#374151',
  background: '#fff',
  outline: 'none',
  fontFamily: 'Manrope,sans-serif',
};

export default function UserFormModal({ open, onClose, user = null, availableRoles = [] }) {
  const isEdit = Boolean(user);

  const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: [],
    auto_verify: true,
  });

  useEffect(() => {
    if (!open) return;

    form.clearErrors();
    form.setData({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
      password_confirmation: '',
      roles: user?.roles?.map((role) => role.name) ?? [],
      auto_verify: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.id]);

  if (!open) return null;

  const toggleRole = (name) => {
    const next = form.data.roles.includes(name)
      ? form.data.roles.filter((role) => role !== name)
      : [...form.data.roles, name];
    form.setData('roles', next);
  };

  const submit = (event) => {
    event.preventDefault();

    const options = {
      preserveScroll: true,
      onSuccess: () => onClose(),
    };

    if (isEdit) {
      form.put(`/admin/rbac/users/${user.id}`, options);
    } else {
      form.post('/admin/rbac/users', options);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
              {isEdit ? 'Edit Pengguna' : 'Tambah User'}
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>
              {isEdit ? 'Perbarui data akun dan role Laratrust.' : 'Buat akun baru dan pilih minimal satu role.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <Icon icon="solar:close-circle-outline" width={22} />
          </button>
        </div>

        <form onSubmit={submit} className="max-h-[75vh] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field id="rbac-name" label="Nama" error={form.errors.name}>
              <input
                id="rbac-name"
                type="text"
                value={form.data.name}
                onChange={(event) => form.setData('name', event.target.value)}
                placeholder="Nama lengkap"
                style={inputStyle}
              />
            </Field>

            <Field id="rbac-email" label="Email" error={form.errors.email}>
              <input
                id="rbac-email"
                type="email"
                value={form.data.email}
                onChange={(event) => form.setData('email', event.target.value)}
                placeholder="nama@ub.ac.id"
                style={inputStyle}
              />
            </Field>

            <Field id="rbac-password" label="Password" error={form.errors.password}>
              <input
                id="rbac-password"
                type="password"
                value={form.data.password}
                onChange={(event) => form.setData('password', event.target.value)}
                placeholder={isEdit ? 'Kosongkan jika tidak diubah' : 'Minimal 8 karakter'}
                autoComplete="new-password"
                style={inputStyle}
              />
            </Field>

            <Field id="rbac-password-confirmation" label="Konfirmasi Password" error={form.errors.password_confirmation}>
              <input
                id="rbac-password-confirmation"
                type="password"
                value={form.data.password_confirmation}
                onChange={(event) => form.setData('password_confirmation', event.target.value)}
                placeholder="Ulangi password"
                autoComplete="new-password"
                style={inputStyle}
              />
            </Field>
          </div>

          <div className="mt-5">
            <p style={{ margin: '0 0 8px', fontSize: 12.5, fontWeight: 600, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>
              Role
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {availableRoles.map((role) => (
                <label
                  key={role.id}
                  htmlFor={`rbac-role-${role.name}`}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border border-gray-200 px-3 py-2.5 transition-colors hover:bg-gray-50"
                >
                  <input
                    id={`rbac-role-${role.name}`}
                    type="checkbox"
                    className="mt-0.5 cursor-pointer"
                    checked={form.data.roles.includes(role.name)}
                    onChange={() => toggleRole(role.name)}
                  />
                  <span>
                    <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                      {role.display_name || role.name}
                    </span>
                    <span style={{ display: 'block', fontSize: 11.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>
                      {role.name}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {form.errors.roles && (
              <p style={{ margin: '6px 0 0', fontSize: 11.5, color: '#DC2626', fontFamily: 'Manrope,sans-serif' }}>
                {form.errors.roles}
              </p>
            )}
          </div>

          {!isEdit && (
            <label htmlFor="rbac-auto-verify" className="mt-4 flex cursor-pointer items-center gap-2">
              <input
                id="rbac-auto-verify"
                type="checkbox"
                checked={form.data.auto_verify}
                onChange={(event) => form.setData('auto_verify', event.target.checked)}
              />
              <span style={{ fontSize: 12.5, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>
                Tandai email sudah terverifikasi
              </span>
            </label>
          )}

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={form.processing}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60"
              style={{ background: '#0152EA' }}
            >
              {form.processing ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
