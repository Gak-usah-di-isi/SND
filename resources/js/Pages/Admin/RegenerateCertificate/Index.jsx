import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import AdminPageLayout from '../../../Components/ui/shared/AdminPageLayout';
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import StatusBadge from '../../../Components/ui/StatusBadge';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';

const ROLE_BADGE_MAP = {
  'reviewer':               'Reviewer',
  'indonesia-participants': 'Indonesia Participant',
  'indonesia-presenter':    'Indonesia Presenter',
  'foreign-participants':   'Foreign Participant',
  'foreign-presenter':      'Foreign Presenter',
};

function InitialAvatar({ name }) {
  const initials = (name ?? '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%', background: '#0152EA',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Manrope,sans-serif' }}>
        {initials}
      </span>
    </div>
  );
}

const COL = 'px-4 py-4 text-sm text-gray-700';

export default function RegenerateCertificatePage({ users, search: initialSearch = '', role: initialRole = '' }) {
  const toast = useToast();
  const [search, setSearch]           = useState(initialSearch);
  const [filterVals, setFilterVals]   = useState({ role: initialRole });
  const [appliedVals, setAppliedVals] = useState({ role: initialRole });
  const [confirmUser, setConfirmUser] = useState(null);

  const rows        = users?.data ?? [];
  const page        = Math.max((users?.current_page ?? 1) - 1, 0);
  const rowsPerPage = users?.per_page ?? 10;

  const navigate = (params) => {
    router.get('/admin/regenerate-certificate', params, { preserveScroll: true, preserveState: true });
  };

  const handleSearch = (val) => {
    setSearch(val);
    navigate({ search: val, role: appliedVals.role, page: 1 });
  };

  const handleApply = () => {
    setAppliedVals({ ...filterVals });
    navigate({ search, role: filterVals.role, page: 1 });
  };

  const handleClear = () => {
    const empty = { role: '' };
    setFilterVals(empty);
    setAppliedVals(empty);
    navigate({ search, page: 1 });
  };

  const handlePageChange = (nextPage) => {
    navigate({ search, role: appliedVals.role, page: nextPage + 1, per_page: rowsPerPage });
  };

  const handleRowsChange = (nextRows) => {
    navigate({ search, role: appliedVals.role, page: 1, per_page: nextRows });
  };

  const handleGenerate = () => {
    if (!confirmUser) return;
    router.post(`/admin/regenerate-certificate/${confirmUser.id}`, {}, {
      onSuccess: () => {
        toast.success(`Certificate for ${confirmUser.name} regenerated successfully.`);
        setConfirmUser(null);
      },
      onError: () => {
        toast.error('Failed to regenerate certificate.');
        setConfirmUser(null);
      },
      preserveScroll: true,
    });
  };

  return (
    <AdminPageLayout currentPath="/admin/regenerate-certificate">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope,sans-serif' }}>
        Regenerate Certificate
      </h1>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">

        {/* Filter kiri */}
        <FilterPopover
          filters={[
            {
              id: 'role',
              label: 'Role',
              options: [
                { value: 'reviewer',               label: 'Reviewer' },
                { value: 'indonesia-participants',  label: 'Indonesia Participants' },
                { value: 'indonesia-presenter',     label: 'Indonesia Presenter' },
                { value: 'foreign-participants',    label: 'Foreign Participants' },
                { value: 'foreign-presenter',       label: 'Foreign Presenter' },
              ],
            },
          ]}
          values={filterVals}
          onChange={(id, val) => setFilterVals(prev => ({ ...prev, [id]: val }))}
          onApply={handleApply}
          onClear={handleClear}
          showRange={false}
        />

        {/* Kanan: Generate Async + Search */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            title="Feature under development"
            style={{
              height: 36, display: 'flex', alignItems: 'center', gap: 6,
              padding: '0 14px', borderRadius: 8,
              border: '1px solid #0152EA', background: 'rgba(1,82,234,0.06)',
              fontSize: 13, fontFamily: 'Manrope,sans-serif', color: '#0152EA',
              cursor: 'not-allowed', opacity: 0.6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
            </svg>
            Generate Async
          </button>

          <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8, height: 36 }}>
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search name / institution..."
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ width: 190, fontFamily: 'Manrope,sans-serif' }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          { key: 'name',        label: 'Name' },
          { key: 'institution', label: 'Institution' },
          { key: 'role',        label: 'Role' },
          { key: 'action',      label: '' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            <p className="font-medium text-gray-500">No participants found</p>
          </div>
        )}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={users?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[10, 25, 50]}
          />
        )}
      >
        {rows.map(user => {
          const userRole = user.roles?.[0]?.name ?? '';
          const badgeLabel = ROLE_BADGE_MAP[userRole] ?? userRole;

          return (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
              {/* Nama + phone */}
              <td className={COL}>
                <div className="flex items-center gap-3">
                  <InitialAvatar name={user.name} />
                  <div className="flex flex-col">
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                      {user.name}
                    </span>
                    <span style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>
                      {user.phone_number ?? '-'}
                    </span>
                  </div>
                </div>
              </td>

              {/* Institusi */}
              <td className={COL}>
                <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>
                  {user.institution ?? '-'}
                </span>
              </td>

              {/* Role */}
              <td className={COL}>
                <StatusBadge label={badgeLabel} />
              </td>

              {/* Action */}
              <td className="px-4 py-4">
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setConfirmUser(user)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    style={{
                      fontSize: 12.5, fontFamily: 'Manrope,sans-serif', fontWeight: 600,
                      color: '#0152EA', border: '1px solid rgba(1,82,234,0.3)',
                      background: 'rgba(1,82,234,0.04)', cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(1,82,234,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(1,82,234,0.04)'; }}
                    title="Regenerate Certificate"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
                    </svg>
                    Regenerate
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <ConfirmDialog
        open={Boolean(confirmUser)}
        title="Regenerate Certificate"
        message={confirmUser ? `Regenerate certificate for ${confirmUser.name}? The old file will be deleted and recreated.` : ''}
        cancelText="Cancel"
        confirmText="Generate"
        onClose={() => setConfirmUser(null)}
        onConfirm={handleGenerate}
      />
    </AdminPageLayout>
  );
}
