import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import AdminPageLayout from '../../../Components/ui/shared/AdminPageLayout';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import PermissionMatrixCard from '../../../Components/Admin/Rbac/PermissionMatrixCard';

export default function Roles({ roles = [], groupedPermissions = {} }) {
  const { props } = usePage();
  const flash = props.flash;
  const toast = useToast();
  const [savingRoleId, setSavingRoleId] = useState(null);

  useEffect(() => {
    if (flash?.message) {
      if (flash.type === 'error') toast.error(flash.message);
      else toast.success(flash.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flash?.message, flash?.type]);

  const savePermissions = (role, payload) => {
    setSavingRoleId(role.id);
    router.put(`/admin/rbac/roles/${role.id}/permissions`, payload, {
      preserveScroll: true,
      onFinish: () => setSavingRoleId(null),
    });
  };

  return (
    <AdminPageLayout currentPath="/admin/rbac/roles">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
            Role &amp; Permission
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>
            Atur matriks permission untuk setiap role Laratrust.
          </p>
        </div>

        <Link
          href="/admin/rbac/users"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Icon icon="solar:users-group-rounded-outline" width={17} />
          Manajemen Pengguna
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {roles.map((role) => (
          <PermissionMatrixCard
            key={role.id}
            role={role}
            groupedPermissions={groupedPermissions}
            processing={savingRoleId === role.id}
            onSave={(payload) => savePermissions(role, payload)}
          />
        ))}
      </div>

      {!roles.length && (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-12 text-center">
          <Icon icon="solar:shield-keyhole-outline" width={44} style={{ color: '#D1D5DB' }} />
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>
            Belum ada role yang terdaftar.
          </p>
        </div>
      )}

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </AdminPageLayout>
  );
}
