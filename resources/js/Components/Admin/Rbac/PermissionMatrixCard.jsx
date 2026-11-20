import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';

const MODULE_LABELS = {
  abstracts: 'Abstracts',
  certificates: 'Certificates',
  landing: 'Landing Page',
  participants: 'Participants',
  payments: 'Payments',
  profile: 'Profile',
  reviewer: 'Reviewers',
  symposiums: 'Symposiums',
};

function moduleLabel(module) {
  if (MODULE_LABELS[module]) return MODULE_LABELS[module];
  return module
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function inputStyle() {
  return {
    width: '100%',
    height: 36,
    borderRadius: 8,
    border: '1px solid #E2E8F0',
    padding: '0 11px',
    fontSize: 12.5,
    color: '#374151',
    background: '#fff',
    outline: 'none',
    fontFamily: 'Manrope,sans-serif',
  };
}

export default function PermissionMatrixCard({ role, groupedPermissions = {}, onSave, processing = false }) {
  const [displayName, setDisplayName] = useState(role.display_name ?? role.name);
  const [description, setDescription] = useState(role.description ?? '');
  const [selected, setSelected] = useState(role.permissions ?? []);

  useEffect(() => {
    setDisplayName(role.display_name ?? role.name);
    setDescription(role.description ?? '');
    setSelected(role.permissions ?? []);
  }, [role.id, role.display_name, role.description, role.permissions]);

  const groups = useMemo(() => Object.entries(groupedPermissions), [groupedPermissions]);

  const toggle = (name) => {
    setSelected((current) => (
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    ));
  };

  const selectGroup = (permissions) => {
    const names = permissions.map((permission) => permission.name);
    setSelected((current) => Array.from(new Set([...current, ...names])));
  };

  const clearGroup = (permissions) => {
    const names = new Set(permissions.map((permission) => permission.name));
    setSelected((current) => current.filter((name) => !names.has(name)));
  };

  const save = () => {
    onSave({
      display_name: displayName,
      description,
      permissions: selected,
    });
  };

  return (
    <div
      data-role-name={role.name}
      className="rounded-[12px] border border-gray-200 bg-white p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
              {role.display_name || role.name}
            </h2>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{ background: 'rgba(1,82,234,0.08)', color: '#0152EA', fontFamily: 'Manrope,sans-serif' }}
            >
              <Icon icon="solar:users-group-two-rounded-outline" width={13} />
              {role.users_count} user
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>
            {role.name}
          </p>
        </div>
        <span style={{ fontSize: 12, color: '#64748B', fontFamily: 'Manrope,sans-serif' }}>
          {selected.length} permission dipilih
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label htmlFor={`role-display-${role.id}`} style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#6B7280', marginBottom: 5, fontFamily: 'Manrope,sans-serif' }}>
            Display Name
          </label>
          <input
            id={`role-display-${role.id}`}
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            style={inputStyle()}
          />
        </div>
        <div>
          <label htmlFor={`role-description-${role.id}`} style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#6B7280', marginBottom: 5, fontFamily: 'Manrope,sans-serif' }}>
            Deskripsi
          </label>
          <input
            id={`role-description-${role.id}`}
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            style={inputStyle()}
          />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {groups.map(([module, permissions]) => (
          <div key={module} className="rounded-lg border border-gray-100 bg-gray-50/60 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>
                {moduleLabel(module)}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => selectGroup(permissions)}
                  className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                >
                  Pilih semua
                </button>
                <button
                  type="button"
                  onClick={() => clearGroup(permissions)}
                  className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                >
                  Kosongkan
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {permissions.map((permission) => (
                <label
                  key={permission.id}
                  htmlFor={`perm-${role.id}-${permission.name}`}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-white"
                >
                  <input
                    id={`perm-${role.id}-${permission.name}`}
                    type="checkbox"
                    checked={selected.includes(permission.name)}
                    onChange={() => toggle(permission.name)}
                  />
                  <span style={{ fontSize: 12, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>
                    {permission.display_name || permission.name}
                    <span style={{ color: '#9CA3AF', marginLeft: 5 }}>({permission.name})</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {!groups.length && (
          <p style={{ margin: 0, fontSize: 12.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>
            Belum ada permission terdaftar.
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
        <button
          type="button"
          disabled={processing}
          onClick={save}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60"
          style={{ background: '#0152EA' }}
        >
          <Icon icon="solar:diskette-outline" width={16} />
          Simpan Permission
        </button>
      </div>
    </div>
  );
}
