import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { Icon } from '@iconify/react';
import AdminPageLayout from '../../../Components/ui/shared/AdminPageLayout';
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import StatusBadge from '../../../Components/ui/StatusBadge';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';

const TYPE_LABEL = {
  presenter:   'Presenter',
  participant: 'Participant',
  reviewer:    'Reviewer',
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

/* ---------- Stat Card (gaya TransactionPage template) ---------- */
function StatCard({ icon, label, value, bg, color }) {
  return (
    <div style={{
      flex: 1, padding: '20px 24px', borderRadius: 12,
      background: bg, display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 12, flexShrink: 0,
        background: 'rgba(255,255,255,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div style={{ color }}>
        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Manrope,sans-serif' }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Manrope,sans-serif', marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

const IconTotal = (
  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
    <path d="M20 44C28.8366 44 36 36.8366 36 28C36 19.1634 28.8366 12 20 12C11.1634 12 4 19.1634 4 28C4 36.8366 11.1634 44 20 44Z" fill="#0152EA"/>
    <path d="M31.5857 30.9273C39.0134 30.9273 45.0347 24.906 45.0347 17.4783C45.0347 10.0506 39.0134 4.0293 31.5857 4.0293C24.158 4.0293 18.1367 10.0506 18.1367 17.4783C18.1367 24.906 24.158 30.9273 31.5857 30.9273Z" fill="#F5BC00"/>
    <path d="M4.07031 43.9998H19.9093L10.9223 35.5488L4.07031 43.9998Z" fill="#0152EA"/>
    <path d="M20.0017 12C19.7627 12 19.5307 12.025 19.2937 12.036C18.5547 13.701 18.1367 15.54 18.1367 17.479C18.1367 24.907 24.1577 30.928 31.5857 30.928C33.0697 30.928 34.4927 30.678 35.8277 30.235C35.9307 29.502 36.0017 28.76 36.0017 28C36.0017 19.163 28.8387 12 20.0017 12Z" fill="#0152EA"/>
    <path d="M44.9742 4.0293H31.6602L39.2142 11.1333L44.9742 4.0293Z" fill="#F5BC00"/>
  </svg>
);

const IconActive = (
  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
    <path d="M44 41H4V10H44V41Z" fill="#F5BC00"/>
    <path d="M44 26H24H4V10H44V26Z" fill="#0BB193"/>
    <path d="M17 26H11V29H17V26Z" fill="#0BB193"/>
    <path d="M37 26H31V29H37V26Z" fill="#0BB193"/>
    <path d="M31 7H17V10H31V7Z" fill="#F5BC00"/>
    <path d="M17 23H11V26H17V23Z" fill="#0BB193"/>
    <path d="M37 23H31V26H37V23Z" fill="#0BB193"/>
  </svg>
);

const IconInactive = (
  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
    <path d="M44 41H4V10H44V41Z" fill="#F5BC00"/>
    <path d="M44 26H24H4V10H44V26Z" fill="#EB7900"/>
    <path d="M17 26H11V29H17V26Z" fill="#EB7900"/>
    <path d="M37 26H31V29H37V26Z" fill="#EB7900"/>
    <path d="M31 7H17V10H31V7Z" fill="#F5BC00"/>
    <path d="M17 23H11V26H17V23Z" fill="#EB0000"/>
    <path d="M37 23H31V26H37V23Z" fill="#EB0000"/>
  </svg>
);

const COL = 'px-4 py-4 text-sm text-gray-700';

export default function CertificatesIndexPage({ certificates, stats, search: initialSearch = '', type: initialType = '' }) {
  const toast = useToast();
  const [search, setSearch]         = useState(initialSearch);
  const [filterVals, setFilterVals] = useState({ type: initialType });
  const [appliedVals, setAppliedVals] = useState({ type: initialType });
  const [confirmItem, setConfirmItem] = useState(null);

  const rows        = certificates?.data ?? [];
  const page        = Math.max((certificates?.current_page ?? 1) - 1, 0);
  const rowsPerPage = certificates?.per_page ?? 10;

  const navigate = (params) => {
    router.get('/admin/certificates', params, { preserveScroll: true, preserveState: true });
  };

  const handleSearch = (val) => {
    setSearch(val);
    navigate({ search: val, type: appliedVals.type, page: 1 });
  };

  const handleApply = () => {
    setAppliedVals({ ...filterVals });
    navigate({ search, type: filterVals.type, page: 1 });
  };

  const handleClear = () => {
    const empty = { type: '' };
    setFilterVals(empty);
    setAppliedVals(empty);
    navigate({ search, page: 1 });
  };

  const handlePageChange = (nextPage) => {
    navigate({ search, type: appliedVals.type, page: nextPage + 1, per_page: rowsPerPage });
  };

  const handleRowsChange = (nextRows) => {
    navigate({ search, type: appliedVals.type, page: 1, per_page: nextRows });
  };

  const handleToggle = () => {
    if (!confirmItem) return;
    const newStatus = confirmItem.status ? 0 : 1;
    router.put(`/admin/certificates/${confirmItem.id}/toggle`, { status: newStatus }, {
      onSuccess: () => {
        toast.success(`Certificate status for ${confirmItem.user?.name} updated successfully.`);
        setConfirmItem(null);
      },
      onError: () => {
        toast.error('Failed to update status.');
        setConfirmItem(null);
      },
      preserveScroll: true,
    });
  };

  return (
    <AdminPageLayout currentPath="/admin/certificates">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 24, fontFamily: 'Manrope,sans-serif' }}>
        Certificates
      </h1>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <StatCard
          icon={IconTotal}
          label="Total Certificates"
          value={stats?.total ?? 0}
          bg="#5D87FF1A"
          color="#0152EA"
        />
        <StatCard
          icon={IconActive}
          label="Active Certificates"
          value={stats?.active ?? 0}
          bg="#13DEB91A"
          color="#0BB193"
        />
        <StatCard
          icon={IconInactive}
          label="Inactive Certificates"
          value={stats?.inactive ?? 0}
          bg="#FFAE1F1A"
          color="#FFAE1F"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <FilterPopover
          filters={[
            {
              id: 'type',
              label: 'Type',
              options: [
                { value: 'presenter',   label: 'Presenter' },
                { value: 'participant', label: 'Participant' },
                { value: 'reviewer',    label: 'Reviewer' },
              ],
            },
          ]}
          values={filterVals}
          onChange={(id, val) => setFilterVals(prev => ({ ...prev, [id]: val }))}
          onApply={handleApply}
          onClear={handleClear}
          showRange={false}
        />

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

      {/* Table */}
      <DataTable
        columns={[
          { key: 'name',    label: 'Name' },
          { key: 'type',    label: 'Certificate Type' },
          { key: 'payment', label: 'Payment' },
          { key: 'status',  label: 'Status' },
          { key: 'file',    label: 'File' },
          { key: 'action',  label: '' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <p className="font-medium text-gray-500">No certificates found</p>
          </div>
        )}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={certificates?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[10, 25, 50]}
          />
        )}
      >
        {rows.map(cert => (
          <tr key={cert.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
            {/* Nama */}
            <td className={COL}>
              <div className="flex items-center gap-3">
                <InitialAvatar name={cert.user?.name} />
                <div className="flex flex-col">
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                    {cert.user?.name ?? '-'}
                  </span>
                  <span style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>
                    {cert.user?.institution ?? '-'}
                  </span>
                </div>
              </div>
            </td>

            {/* Certificate Type */}
            <td className={COL}>
              <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>
                {TYPE_LABEL[cert.certificate_type] ?? cert.certificate_type}
              </span>
            </td>

            {/* Payment */}
            <td className={COL}>
              <StatusBadge label={
                cert.user?.file_payment?.status === 'verified' ? 'Verified'
                : cert.user?.file_payment?.status === 'pending' ? 'Pending'
                : 'Not Yet Paid'
              } />
            </td>

            {/* Status */}
            <td className={COL}>
              <StatusBadge label={cert.status ? 'Active' : 'Inactive'} />
            </td>

            {/* File */}
            <td className={COL}>
              {cert.certificate_path ? (
                <a
                  href={`/storage/${cert.certificate_path}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 12.5, fontWeight: 500, color: '#0152EA',
                    fontFamily: 'Manrope,sans-serif', textDecoration: 'none',
                    padding: '4px 10px', borderRadius: 6,
                    background: 'rgba(1,82,234,0.06)', border: '1px solid rgba(1,82,234,0.2)',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(1,82,234,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(1,82,234,0.06)'}
                >
                  <Icon icon="solar:medal-ribbons-star-outline" width={14} />
                  View
                </a>
              ) : (
                <span style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>—</span>
              )}
            </td>

            {/* Action */}
            <td className="px-4 py-4">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmItem(cert)}
                  style={{
                    fontSize: 12.5, fontFamily: 'Manrope,sans-serif', fontWeight: 600,
                    color: cert.status ? '#EF4444' : '#0152EA',
                    border: `1px solid ${cert.status ? 'rgba(239,68,68,0.3)' : 'rgba(1,82,234,0.3)'}`,
                    background: cert.status ? 'rgba(239,68,68,0.04)' : 'rgba(1,82,234,0.04)',
                    padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = cert.status ? 'rgba(239,68,68,0.1)' : 'rgba(1,82,234,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = cert.status ? 'rgba(239,68,68,0.04)' : 'rgba(1,82,234,0.04)'}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    {cert.status
                      ? <><path d="M18.364 18.364A9 9 0 0 0 5.636 5.636"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></>
                      : <><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></>
                    }
                  </svg>
                  {cert.status ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <ConfirmDialog
        open={Boolean(confirmItem)}
        title={confirmItem?.status ? 'Deactivate Certificate' : 'Activate Certificate'}
        message={confirmItem
          ? `${confirmItem.status ? 'Deactivate' : 'Activate'} certificate for ${confirmItem.user?.name}?`
          : ''}
        cancelText="Cancel"
        confirmText={confirmItem?.status ? 'Deactivate' : 'Activate'}
        onClose={() => setConfirmItem(null)}
        onConfirm={handleToggle}
      />
    </AdminPageLayout>
  );
}
