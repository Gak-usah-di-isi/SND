import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { FilterPopover } from '../../../../Components/ui/FilterPopover';
import { DataTable } from '../../../../Components/ui/DataTable';
import { TablePagination } from '../../../../Components/ui/TablePagination';
import StatusBadge from '../../../../Components/ui/StatusBadge';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';

const COL = 'px-4 py-4 text-sm text-gray-700';

function StatCard({ label: text, value, bg, color }) {
  return (
    <div style={{ flex: 1, padding: '16px 20px', borderRadius: 12, background: bg, boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color, fontFamily: 'Manrope, sans-serif' }}>{text}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: 'Manrope, sans-serif', marginTop: 2 }}>{value}</div>
    </div>
  );
}

export default function HistoryTab({ history, stats, filters: initialFilters, roleOptions = {} }) {
  const toast = useToast();
  const [search, setSearch] = useState(initialFilters?.search ?? '');
  const [filterVals, setFilterVals] = useState({ status: initialFilters?.status ?? '', role: initialFilters?.role ?? '' });
  const [appliedVals, setAppliedVals] = useState({ status: initialFilters?.status ?? '', role: initialFilters?.role ?? '' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const rows = history?.data ?? [];
  const page = Math.max((history?.current_page ?? 1) - 1, 0);
  const rowsPerPage = history?.per_page ?? 10;

  const navigate = (params) => {
    router.get('/admin/broadcast/invitation', { tab: 'history', ...params }, {
      preserveScroll: true,
      preserveState: true,
      only: ['history', 'historyStats', 'historyFilters'],
    });
  };

  const handleSearch = (val) => {
    setSearch(val);
    navigate({ search: val, status: appliedVals.status, role: appliedVals.role, page: 1 });
  };

  const handleApply = () => {
    setAppliedVals({ ...filterVals });
    navigate({ search, status: filterVals.status, role: filterVals.role, page: 1 });
  };

  const handleClear = () => {
    const empty = { status: '', role: '' };
    setFilterVals(empty);
    setAppliedVals(empty);
    navigate({ search, page: 1 });
  };

  const handlePageChange = (nextPage) => {
    navigate({ search, status: appliedVals.status, role: appliedVals.role, page: nextPage + 1, per_page: rowsPerPage });
  };

  const handleRowsChange = (nextRows) => {
    navigate({ search, status: appliedVals.status, role: appliedVals.role, page: 1, per_page: nextRows });
  };

  const handleResend = (log) => {
    router.post(`/admin/broadcast/invitation/history/${log.id}/resend`, {}, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => toast.success(`Resending to ${log.email} is processing.`),
      onError: () => toast.error('Failed to resend.'),
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/broadcast/invitation/history/${deleteTarget.id}`, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => { toast.success('Record deleted.'); setDeleteTarget(null); },
      onError: () => { toast.error('Failed to delete record.'); setDeleteTarget(null); },
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <StatCard label="Total" value={stats?.total ?? 0} bg="#5D87FF1A" color="#0152EA" />
        <StatCard label="Sent" value={stats?.sent ?? 0} bg="#13DEB91A" color="#0BB193" />
        <StatCard label="Failed" value={stats?.failed ?? 0} bg="#FA896B1A" color="#EF4444" />
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <FilterPopover
          filters={[
            { id: 'status', label: 'Status', options: [{ value: 'sent', label: 'Sent' }, { value: 'failed', label: 'Failed' }] },
            { id: 'role', label: 'Role', options: Object.entries(roleOptions).map(([value, l]) => ({ value, label: l })) },
          ]}
          values={filterVals}
          onChange={(id, val) => setFilterVals((prev) => ({ ...prev, [id]: val }))}
          onApply={handleApply}
          onClear={handleClear}
          showRange={false}
        />

        <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8, height: 36 }}>
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search name / email..."
            className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            style={{ width: 190, fontFamily: 'Manrope,sans-serif' }}
          />
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
          { key: 'sent_at', label: 'Time' },
          { key: 'action', label: '' },
        ]}
        empty={<p className="font-medium text-gray-500">No delivery history yet</p>}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={history?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[10, 25, 50]}
          />
        )}
      >
        {rows.map((log) => (
          <tr key={log.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
            <td className={COL}>
              <div className="flex flex-col">
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>{log.name}</span>
                <span style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>
                  {log.email}{log.is_test ? ' · Test' : ''}
                </span>
              </div>
            </td>
            <td className={COL}>{roleOptions[log.role] ?? log.role ?? '-'}</td>
            <td className={COL}>
              <StatusBadge label={log.status === 'sent' ? 'Success' : 'Failed'} />
              {log.status === 'failed' && log.error_message && (
                <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4, maxWidth: 220 }}>{log.error_message}</p>
              )}
            </td>
            <td className={COL}>{log.sent_at ? new Date(log.sent_at).toLocaleString('en-US') : '-'}</td>
            <td className="px-4 py-4">
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleResend(log)}
                  style={{ fontSize: 12, fontWeight: 600, color: '#0152EA', border: '1px solid rgba(1,82,234,0.3)', background: 'rgba(1,82,234,0.04)', padding: '5px 10px', borderRadius: 8, cursor: 'pointer' }}
                >
                  Resend
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(log)}
                  style={{ fontSize: 12, fontWeight: 600, color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)', padding: '5px 10px', borderRadius: 8, cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Record"
        message={deleteTarget ? `Delete delivery record for ${deleteTarget.email}?` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </div>
  );
}
