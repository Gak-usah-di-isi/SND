import { useEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { Search } from 'lucide-react';
import AdminPageLayout from '../../../Components/ui/shared/AdminPageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import RoleBadgeList from '../../../Components/Admin/Rbac/RoleBadgeList';
import UserFormModal from '../../../Components/Admin/Rbac/UserFormModal';

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function Users({ users, availableRoles = [], filters = {}, authUserId }) {
  const { props } = usePage();
  const flash = props.flash;
  const toast = useToast();

  const [search, setSearch] = useState(filters.search ?? '');
  const [role, setRole] = useState(filters.role ?? '');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (flash?.message) {
      if (flash.type === 'error') toast.error(flash.message);
      else if (flash.type === 'warning') toast.warning(flash.message);
      else toast.success(flash.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flash?.message, flash?.type]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      router.get('/admin/rbac/users', { search, role }, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        only: ['users', 'filters'],
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, role]);

  const openCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    router.delete(`/admin/rbac/users/${deleteTarget.id}`, {
      preserveScroll: true,
      onFinish: () => {
        setDeleting(false);
        setDeleteTarget(null);
      },
    });
  };

  const rows = users?.data ?? [];
  const page = Math.max((users?.current_page ?? 1) - 1, 0);

  const handlePageChange = (nextPage) => {
    router.get('/admin/rbac/users', { search, role, page: nextPage + 1 }, {
      preserveState: true,
      preserveScroll: true,
      only: ['users', 'filters'],
    });
  };

  return (
    <AdminPageLayout currentPath="/admin/rbac/users">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
            Manajemen Pengguna
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>
            Kelola akun admin unit BPPM beserta role Laratrust-nya.
          </p>
        </div>

        <Link
          href="/admin/rbac/roles"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Icon icon="solar:shield-keyhole-outline" width={17} />
          Role &amp; Permission
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3">
            <Search size={14} className="text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama atau email..."
              style={{ width: 210, border: 'none', outline: 'none', fontSize: 13, background: 'transparent', color: '#374151', fontFamily: 'Manrope,sans-serif' }}
            />
          </div>

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            aria-label="Filter role"
            style={{ height: 36, borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', padding: '0 10px', fontSize: 13, color: '#374151', fontFamily: 'Manrope,sans-serif' }}
          >
            <option value="">Semua role</option>
            {availableRoles.map((item) => (
              <option key={item.id} value={item.name}>{item.display_name || item.name}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white"
          style={{ background: '#0152EA' }}
        >
          <Icon icon="lucide:plus" width={16} />
          Tambah User
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Nama' },
          { key: 'email', label: 'Email' },
          { key: 'roles', label: 'Role' },
          { key: 'status', label: 'Status' },
          { key: 'created', label: 'Dibuat' },
          { key: 'actions', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-6">
            <Icon icon="solar:users-group-rounded-outline" width={44} style={{ color: '#D1D5DB' }} />
            <p style={{ color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>Pengguna tidak ditemukan</p>
          </div>
        )}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={users?.per_page ?? rows.length}
            total={users?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={() => {}}
            rowsPerPageOptions={[10]}
          />
        )}
      >
        {rows.map((user) => {
          const isSelf = Number(user.id) === Number(authUserId);
          return (
            <tr key={user.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
              <td className="px-6 py-4">
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                  {user.name}
                </div>
              </td>
              <td className="px-6 py-4">
                <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>{user.email}</span>
              </td>
              <td className="px-6 py-4">
                <RoleBadgeList roles={user.roles ?? []} />
              </td>
              <td className="px-6 py-4">
                {user.email_verified_at ? (
                  <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: 'rgba(16,185,129,0.1)', color: '#059669', fontFamily: 'Manrope,sans-serif' }}>
                    Terverifikasi
                  </span>
                ) : (
                  <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: 'rgba(245,158,11,0.12)', color: '#D97706', fontFamily: 'Manrope,sans-serif' }}>
                    Belum verifikasi
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <span style={{ fontSize: 12.5, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>{formatDate(user.created_at)}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(user)}
                    aria-label="Edit"
                    title="Edit"
                    className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600"
                  >
                    <Icon icon="solar:pen-2-outline" width={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(user)}
                    disabled={isSelf}
                    aria-label="Hapus"
                    title={isSelf ? 'Tidak dapat menghapus akun sendiri' : 'Hapus'}
                    className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <Icon icon="solar:trash-bin-minimalistic-outline" width={16} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>

      <UserFormModal
        open={modalOpen}
        onClose={closeModal}
        user={editingUser}
        availableRoles={availableRoles}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Pengguna"
        message={deleteTarget ? `Hapus akun ${deleteTarget.name}? Tindakan ini tidak dapat dibatalkan.` : ''}
        cancelText="Batal"
        confirmText={deleting ? 'Menghapus...' : 'Hapus'}
        disabled={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </AdminPageLayout>
  );
}
