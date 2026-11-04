import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { Icon } from '@iconify/react';
import AdminPageLayout from '../../../Components/ui/shared/AdminPageLayout';
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import InitialBadge from '../../../Components/ui/InitialBadge';
import StatusBadge from '../../../Components/ui/StatusBadge';
import BackButton from '../../../Components/ui/BackButton';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import FormActions from '../../../Components/ui/FormActions';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';

function IconEdit({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
      <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415z" />
    </svg>
  );
}

function IconTrash({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

const COL_CELL = 'px-6 py-4 text-sm text-gray-700';

const EMPTY_FORM = {
  name: '',
  email: '',
  institution: '',
  password: '',
  password_confirmation: '',
  role_id: '',
  is_active: true,
};

export default function ReviewerIndexPage({
  users,
  roles = [],
  years = [],
  activeYear = '',
  search: initialSearch = '',
  role: initialRole = '',
  selectedYear = '',
  selectedStatus = '',
}) {
  const toast = useToast();

  const [search, setSearch] = useState(initialSearch);
  const [filterVals, setFilterVals] = useState({
    role: initialRole,
    year: selectedYear || activeYear,
    status: selectedStatus || '',
  });
  const [page, setPage] = useState(Math.max((users?.current_page ?? 1) - 1, 0));
  const [rowsPerPage, setRowsPerPage] = useState(users?.per_page ?? 8);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [confirmRow, setConfirmRow] = useState(null);
  const [confirmToggle, setConfirmToggle] = useState(null);

  const rows = users?.data ?? [];
  const roleOptions = roles.map(r => ({ value: r.id, label: r.display_name }));
  const roleFilterOptions = [
    { value: '', label: 'All Roles' },
    ...roles.map(r => ({ value: r.name, label: r.display_name })),
  ];

  // Opsi filter tahun (otomatis mendeteksi tahun historis dari database)
  const otherYears = years.filter(y => String(y) !== String(activeYear));
  const yearFilterOptions = [
    { value: String(activeYear), label: `${activeYear} (Active Year)` },
    ...otherYears.map(y => ({ value: String(y), label: String(y) })),
    { value: 'all', label: 'All Years' },
  ];

  const statusFilterOptions = [
    { value: '', label: 'Default (Active in Active Year)' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'all', label: 'All Status' },
  ];

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSelected(null);
  };

  const setField = (key) => (e) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
    if (formErrors[key]) setFormErrors(prev => ({ ...prev, [key]: '' }));
  };

  const handleCreateSubmit = () => {
    router.post('/admin/reviewer', form, {
      onError: (errors) => setFormErrors(errors),
      onSuccess: () => {
        resetForm();
        setView('list');
        toast.success('Reviewer added successfully.');
      },
    });
  };

  const handleEditSubmit = () => {
    if (!selected) return;
    router.put(`/admin/reviewer/${selected.id}`, {
      name: form.name,
      email: form.email,
      institution: form.institution,
      role_id: form.role_id,
      is_active: form.is_active ? 1 : 0,
    }, {
      onError: (errors) => setFormErrors(errors),
      onSuccess: () => {
        resetForm();
        setView('list');
        toast.success('Reviewer updated successfully.');
      },
    });
  };

  const handleDelete = (row) => setConfirmRow(row);

  const handleConfirmDelete = () => {
    if (!confirmRow) return;
    router.delete(`/admin/reviewer/${confirmRow.id}`, {
      onSuccess: () => {
        toast.success('Reviewer deleted successfully.');
        setConfirmRow(null);
      },
      onError: () => {
        toast.error('Failed to delete reviewer.');
        setConfirmRow(null);
      },
    });
  };

  const handleConfirmToggle = () => {
    if (!confirmToggle) return;
    const nextStatus = !confirmToggle.is_active;
    router.put(`/admin/reviewer/${confirmToggle.id}/toggle-status`, {
      is_active: nextStatus ? 1 : 0,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(`Reviewer ${confirmToggle.name} ${nextStatus ? 'activated' : 'deactivated'} successfully.`);
        setConfirmToggle(null);
      },
      onError: () => {
        toast.error('Failed to update reviewer status.');
        setConfirmToggle(null);
      },
    });
  };

  const navigate = (params) => {
    router.get('/admin/reviewer', params, { preserveScroll: true, preserveState: true });
  };

  const handleSearch = (value) => {
    setSearch(value);
    navigate({
      page: 1,
      per_page: rowsPerPage,
      search: value,
      role: filterVals.role,
      year: filterVals.year,
      status: filterVals.status,
    });
  };

  const handleApplyFilter = () => {
    setPage(0);
    navigate({
      page: 1,
      per_page: rowsPerPage,
      search,
      role: filterVals.role,
      year: filterVals.year,
      status: filterVals.status,
    });
  };

  const handleClearFilter = () => {
    const defaultVals = { role: '', year: String(activeYear), status: '' };
    setFilterVals(defaultVals);
    setPage(0);
    navigate({
      page: 1,
      per_page: rowsPerPage,
      search,
      year: String(activeYear),
    });
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 0) return;
    setPage(nextPage);
    navigate({
      page: nextPage + 1,
      per_page: rowsPerPage,
      search,
      role: filterVals.role,
      year: filterVals.year,
      status: filterVals.status,
    });
  };

  const handleRowsChange = (nextRows) => {
    setRowsPerPage(nextRows);
    setPage(0);
    navigate({
      page: 1,
      per_page: nextRows,
      search,
      role: filterVals.role,
      year: filterVals.year,
      status: filterVals.status,
    });
  };

  const exportUrl = `/admin/reviewer-excel?${new URLSearchParams({
    ...(search ? { search } : {}),
    ...(filterVals.role ? { role: filterVals.role } : {}),
    ...(filterVals.year ? { year: filterVals.year } : (selectedYear ? { year: selectedYear } : {})),
    ...(filterVals.status ? { status: filterVals.status } : (selectedStatus ? { status: selectedStatus } : {})),
  }).toString()}`;

  if (view === 'create' || view === 'edit') {
    return (
      <AdminPageLayout currentPath="/admin/reviewer">
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <BackButton onClick={() => { resetForm(); setView('list'); }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
            {view === 'create' ? 'Add Reviewer' : 'Edit Reviewer'}
          </h1>
        </div>

        <Card>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
            Reviewer Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatInput
              id="reviewer-name"
              label="Name *"
              value={form.name}
              onChange={setField('name')}
              placeholder="E.g. Budi Utomo"
              error={Boolean(formErrors.name)}
              helperText={formErrors.name}
            />
            <FloatInput
              id="reviewer-email"
              label="Email *"
              type="email"
              value={form.email}
              onChange={setField('email')}
              placeholder="E.g. budiutomo@gmail.com"
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
            />
            <FloatInput
              id="reviewer-institution"
              label="Institution *"
              value={form.institution}
              onChange={setField('institution')}
              placeholder="E.g. Faculty of Science, Brawijaya University"
              error={Boolean(formErrors.institution)}
              helperText={formErrors.institution}
            />
            <FloatSelect
              id="reviewer-role"
              label="Role *"
              options={roleOptions}
              value={form.role_id}
              onChange={(val) => {
                setForm(prev => ({ ...prev, role_id: val }));
                if (formErrors.role_id) setFormErrors(prev => ({ ...prev, role_id: '' }));
              }}
              placeholder="Select role..."
              error={Boolean(formErrors.role_id)}
              helperText={formErrors.role_id}
            />

            {view === 'edit' && (
              <div className="md:col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 mt-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={Boolean(form.is_active)}
                  onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${form.is_active ? 'bg-[#0152EA]' : 'bg-gray-300'}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${form.is_active ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    Status: {form.is_active ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Jika aktif, reviewer ini akan muncul di daftar konferensi tahun aktif ({activeYear}).
                  </div>
                </div>
              </div>
            )}

            {view === 'create' && (
              <>
                <FloatInput
                  id="reviewer-password"
                  label="Password *"
                  type="password"
                  value={form.password}
                  onChange={setField('password')}
                  placeholder="Min. 8 characters"
                  error={Boolean(formErrors.password)}
                  helperText={formErrors.password}
                />
                <FloatInput
                  id="reviewer-password-confirmation"
                  label="Confirm Password *"
                  type="password"
                  value={form.password_confirmation}
                  onChange={setField('password_confirmation')}
                  placeholder="Repeat password"
                  error={Boolean(formErrors.password_confirmation)}
                  helperText={formErrors.password_confirmation}
                />
              </>
            )}
          </div>
        </Card>

        <div className="mt-6">
          <FormActions
            id="reviewer-form"
            cancelText="Cancel"
            submitText={view === 'create' ? 'Save' : 'Update'}
            onCancel={() => { resetForm(); setView('list'); }}
            onSubmit={view === 'create' ? handleCreateSubmit : handleEditSubmit}
          />
        </div>

        <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout currentPath="/admin/reviewer">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Reviewers
      </h1>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        {/* Kiri: Filter (Year, Status, Role) */}
        <FilterPopover
          filters={[
            {
              id: 'year',
              label: 'Year',
              options: yearFilterOptions,
            },
            {
              id: 'status',
              label: 'Status',
              options: statusFilterOptions,
            },
            {
              id: 'role',
              label: 'Role',
              options: roleFilterOptions,
            },
          ]}
          values={filterVals}
          onChange={(id, val) => setFilterVals(prev => ({ ...prev, [id]: val }))}
          onApply={handleApplyFilter}
          onClear={handleClearFilter}
          showRange={false}
        />

        {/* Kanan: Export + Tambah + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a
            href={exportUrl}
            style={{
              height: 36, padding: '0 14px', borderRadius: 8,
              border: '1px solid #E2E8F0', background: '#fff',
              fontSize: 13, fontWeight: 500, color: '#374151',
              fontFamily: 'Manrope,sans-serif', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <Icon icon="solar:file-text-outline" width={15} />
            Export
          </a>

          <button
            type="button"
            onClick={() => { resetForm(); setView('create'); }}
            style={{
              height: 36, padding: '0 16px', borderRadius: 8,
              background: '#0152EA', color: '#fff', border: 'none',
              fontSize: 13, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
              display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
            }}
          >
            <Icon icon="lucide:plus" width={16} />
            Add Reviewer
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E2E8F0', background: '#fff', padding: '6px 12px', borderRadius: 8, height: 36 }}>
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search name / email / institution..."
              style={{ width: 190, border: 'none', outline: 'none', fontSize: 13, fontFamily: 'Manrope,sans-serif', background: 'transparent', color: '#374151' }}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'no', label: 'No' },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'institution', label: 'Institution' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p className="font-medium text-gray-500">No reviewers found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or click the "Add Reviewer" button.</p>
          </div>
        )}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={users?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[8, 25, 50]}
          />
        )}
      >
        {rows.map((user, i) => (
          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
            <td className={`${COL_CELL} w-[60px]`}>{(users?.from ?? 1) + i}</td>
            <td className={`${COL_CELL} max-w-[220px]`}>
              <div className="flex items-center gap-3">
                <InitialBadge label={user.name} />
                <span className="text-sm font-medium text-gray-800 truncate" title={user.name}>{user.name}</span>
              </div>
            </td>
            <td className={COL_CELL}>{user.email}</td>
            <td className={COL_CELL}>{user.institution}</td>
            <td className={COL_CELL}>
              {user.roles?.map(role => (
                <StatusBadge key={role.id} label={role.display_name} />
              ))}
            </td>
            <td className={COL_CELL}>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  role="switch"
                  aria-checked={Boolean(user.is_active)}
                  onClick={() => setConfirmToggle(user)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${user.is_active ? 'bg-[#0152EA]' : 'bg-gray-300'}`}
                  title={user.is_active ? 'Click to deactivate' : 'Click to activate'}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user.is_active ? 'translate-x-4' : 'translate-x-0'}`}
                  />
                </button>
                <StatusBadge label={user.is_active ? 'Active' : 'Inactive'} />
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(user);
                    setForm({
                      name: user.name || '',
                      email: user.email || '',
                      institution: user.institution || '',
                      password: '',
                      password_confirmation: '',
                      role_id: user.roles?.[0]?.id ?? '',
                      is_active: Boolean(user.is_active),
                    });
                    setFormErrors({});
                    setView('edit');
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: '#0152EA', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Edit"
                >
                  <IconEdit />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(user)}
                  className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: '#EF4444', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Delete"
                >
                  <IconTrash />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <ConfirmDialog
        open={Boolean(confirmToggle)}
        title={confirmToggle?.is_active ? 'Deactivate Reviewer' : 'Activate Reviewer'}
        message={
          confirmToggle
            ? `Are you sure you want to ${confirmToggle.is_active ? 'deactivate' : 'activate'} ${confirmToggle.name}? ${
                confirmToggle.is_active
                  ? 'Reviewer ini tidak akan muncul di daftar tahun aktif.'
                  : 'Reviewer ini akan muncul di daftar konferensi tahun aktif.'
              }`
            : ''
        }
        cancelText="Cancel"
        confirmText={confirmToggle?.is_active ? 'Deactivate' : 'Activate'}
        onClose={() => setConfirmToggle(null)}
        onConfirm={handleConfirmToggle}
      />

      <ConfirmDialog
        open={Boolean(confirmRow)}
        title="Delete Reviewer"
        message={confirmRow ? `Are you sure you want to delete ${confirmRow.name}? This action cannot be undone.` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setConfirmRow(null)}
        onConfirm={handleConfirmDelete}
      />
    </AdminPageLayout>
  );
}
