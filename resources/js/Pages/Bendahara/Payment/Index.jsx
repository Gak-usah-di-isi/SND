import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Icon } from '@iconify/react';
import BendaharaPageLayout from '../../../Components/ui/shared/BendaharaPageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import StatusBadge from '../../../Components/ui/StatusBadge';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import { FilterPopover } from '../../../Components/ui/FilterPopover';

const ROLE_LABEL = {
  'indonesia-participants': 'ID Participant',
  'indonesia-presenter':    'ID Presenter',
  'foreign-participants':   'Foreign Participant',
  'foreign-presenter':      'Foreign Presenter',
  reviewer:                 'Reviewer',
};

const RANGES = [
  { key: 'all',   label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'week',  label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

const COL = 'px-4 py-4 text-sm text-gray-700';

/* ---- Pending Card (sama persis Admin) ---- */
function PendingCard({ payment }) {
  const role     = payment.user?.roles?.[0]?.name ?? '';
  const initials = (payment.user?.name ?? '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const date     = payment.created_at
    ? new Date(payment.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';
  const name      = payment.user?.name ?? '-';
  const shortName = name.split(' ').length > 4 ? name.split(' ').slice(0, 4).join(' ') + '...' : name;

  return (
    <div className="bg-white flex-shrink-0" style={{ borderRadius: 12, width: 240, height: 230, padding: 20, boxShadow: 'rgba(175,182,201,0.2) 0px 2px 4px -1px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#0152EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'Manrope,sans-serif' }}>
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#1F2A3D', fontSize: 14, fontFamily: 'Manrope,sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shortName}</p>
          <p style={{ margin: 0, fontSize: 12, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>{ROLE_LABEL[role] ?? role}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Manrope,sans-serif' }}>Pending Payment</p>
        <p style={{ margin: 0, fontWeight: 700, color: '#1F2A3D', fontSize: payment.currency === 'USD' ? 40 : 28, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Manrope,sans-serif' }}>
          {payment.currency === 'USD' ? `$${payment.amount}` : `Rp ${Number(payment.amount).toLocaleString('id-ID')}`}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}><b>{date}</b> payment date</p>
      </div>

      <button
        type="button"
        onClick={() => payment.file_path && window.open(`/filepayments/${payment.id}/proof`, '_blank')}
        disabled={!payment.file_path}
        style={{
          width: '100%', padding: '8px 0', fontSize: 14, fontWeight: 500, fontFamily: 'Manrope,sans-serif',
          border: `1px solid ${payment.file_path ? '#0152EA' : '#E2E8F0'}`,
          color: payment.file_path ? '#0152EA' : '#9CA3AF',
          borderRadius: 9, backgroundColor: 'transparent',
          cursor: payment.file_path ? 'pointer' : 'not-allowed',
        }}
        onMouseEnter={e => { if (payment.file_path) e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.06)'; }}
        onMouseLeave={e => { if (payment.file_path) e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        {payment.file_path ? 'View Proof' : 'No Proof'}
      </button>
    </div>
  );
}

/* ---- Main Page ---- */
export default function BendaharaPaymentPage({ payments, pendingAll = [], stats, filters: initialFilters }) {
  const toast = useToast();

  const [search, setSearch]       = useState(initialFilters?.search ?? '');
  const [range, setRange]         = useState(initialFilters?.range ?? 'all');
  const [filterVals, setFilterVals]   = useState({ status: initialFilters?.status ?? '', type: initialFilters?.type ?? '' });
  const [appliedVals, setAppliedVals] = useState({ status: initialFilters?.status ?? '', type: initialFilters?.type ?? '' });
  const [confirmItem, setConfirmItem] = useState(null);
  const [carouselPage, setCarouselPage] = useState(0);

  const rows        = payments?.data ?? [];
  const page        = Math.max((payments?.current_page ?? 1) - 1, 0);
  const rowsPerPage = payments?.per_page ?? 10;

  const CARDS_PER_PAGE     = 4;
  const totalCarouselPages = Math.ceil(pendingAll.length / CARDS_PER_PAGE);
  const visiblePending     = pendingAll.slice(carouselPage * CARDS_PER_PAGE, (carouselPage + 1) * CARDS_PER_PAGE);

  const navigate = (params) => {
    router.get('/bendahara/payments', params, {
      preserveScroll: true,
      preserveState: true,
      only: ['payments', 'stats', 'filters'],
    });
  };

  const handleSearch = (val) => { setSearch(val); navigate({ search: val, status: appliedVals.status, type: appliedVals.type, range }); };
  const handleRange  = (r)   => { setRange(r); navigate({ search, status: appliedVals.status, type: appliedVals.type, range: r, page: 1 }); };
  const handleApply  = ()    => { setAppliedVals({ ...filterVals }); navigate({ search, status: filterVals.status, type: filterVals.type, range, page: 1 }); };
  const handleClear  = ()    => { const e = { status: '', type: '' }; setFilterVals(e); setAppliedVals(e); navigate({ search, range, page: 1 }); };
  const handlePageChange = (next) => navigate({ search, status: appliedVals.status, type: appliedVals.type, range, page: next + 1, per_page: rowsPerPage });
  const handleRowsChange = (next) => navigate({ search, status: appliedVals.status, type: appliedVals.type, range, page: 1, per_page: next });

  const handleVerify = () => {
    if (!confirmItem) return;
    router.put(`/bendahara/payments/${confirmItem.id}/verify`, {}, {
      onSuccess: () => {
        const action = confirmItem.status === 'verified' ? 'reverted to pending' : 'verified';
        toast.success(`Payment for ${confirmItem.user?.name} successfully ${action}.`);
        setConfirmItem(null);
      },
      onError: () => { toast.error('Failed to update status.'); setConfirmItem(null); },
      preserveScroll: true,
    });
  };

  return (
    <BendaharaPageLayout currentPath="/bendahara/payments">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>Payment</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, borderRadius: 12, backgroundColor: 'rgba(93,135,255,0.1)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgb(59,130,246)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon icon="solar:bill-list-outline" width={24} style={{ color: '#fff' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0152EA', fontFamily: 'Manrope,sans-serif' }}>Total Transactions</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0152EA', fontFamily: 'Manrope,sans-serif' }}>{stats?.total ?? 0}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, borderRadius: 12, backgroundColor: 'rgba(19,222,185,0.1)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgb(16,185,129)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon icon="solar:check-circle-outline" width={24} style={{ color: '#fff' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'rgb(5,150,105)', fontFamily: 'Manrope,sans-serif' }}>Verified Transactions</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'rgb(5,150,105)', fontFamily: 'Manrope,sans-serif' }}>{stats?.verified ?? 0}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, borderRadius: 12, backgroundColor: 'rgba(255,174,31,0.1)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgb(245,158,11)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon icon="solar:clock-circle-outline" width={24} style={{ color: '#fff' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'rgb(245,158,11)', fontFamily: 'Manrope,sans-serif' }}>Pending Transactions</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'rgb(245,158,11)', fontFamily: 'Manrope,sans-serif' }}>{stats?.pending ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Pending Cards Carousel */}
      {pendingAll.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', margin: '0 0 12px', fontFamily: 'Manrope,sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Pending Payment ({pendingAll.length})
          </p>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 16, width: '100%' }}>
            {visiblePending.map(p => (
              <PendingCard key={p.id} payment={p} />
            ))}
            {totalCarouselPages > 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, paddingLeft: 4 }}>
                <button type="button" onClick={() => setCarouselPage(p => Math.max(p - 1, 0))} disabled={carouselPage === 0} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#fff', cursor: carouselPage === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: carouselPage === 0 ? 0.3 : 1 }}>
                  <ChevronLeft size={15} color="#374151" />
                </button>
                <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>{carouselPage + 1}/{totalCarouselPages}</span>
                <button type="button" onClick={() => setCarouselPage(p => Math.min(p + 1, totalCarouselPages - 1))} disabled={carouselPage === totalCarouselPages - 1} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#fff', cursor: carouselPage === totalCarouselPages - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: carouselPage === totalCarouselPages - 1 ? 0.3 : 1 }}>
                  <ChevronRight size={15} color="#374151" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        {/* Range tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'inline-flex', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
            {RANGES.map((r, i) => (
              <button key={r.key} type="button" onClick={() => handleRange(r.key)} style={{ padding: '7px 14px', fontSize: 13, fontFamily: 'Manrope,sans-serif', fontWeight: range === r.key ? 600 : 400, border: 'none', borderLeft: i > 0 ? '1px solid #E2E8F0' : 'none', background: range === r.key ? 'rgba(1,82,234,0.08)' : '#fff', color: range === r.key ? '#0152EA' : '#6B7280', cursor: 'pointer' }}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FilterPopover
            filters={[
              { id: 'type', label: 'Registration Type', options: [
                { value: 'indonesia-participants', label: 'ID Participant' },
                { value: 'indonesia-presenter',    label: 'ID Presenter' },
                { value: 'foreign-participants',   label: 'Foreign Participant' },
                { value: 'foreign-presenter',      label: 'Foreign Presenter' },
              ]},
              { id: 'status', label: 'Status', options: [
                { value: 'pending',  label: 'Pending' },
                { value: 'verified', label: 'Verified' },
              ]},
            ]}
            values={filterVals}
            onChange={(id, val) => setFilterVals(p => ({ ...p, [id]: val }))}
            onApply={handleApply}
            onClear={handleClear}
            showRange={false}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E2E8F0', background: '#fff', padding: '6px 12px', borderRadius: 8, height: 36 }}>
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search name / email / phone..."
              style={{ width: 190, border: 'none', outline: 'none', fontSize: 13, fontFamily: 'Manrope,sans-serif', background: 'transparent', color: '#374151' }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          { key: 'user',   label: 'Name' },
          { key: 'email',  label: 'Email' },
          { key: 'type',   label: 'Registration Type' },
          { key: 'amount', label: 'Amount' },
          { key: 'status', label: 'Status' },
          { key: 'action', label: '' },
        ]}
        empty={(
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '24px 0' }}>
            <Icon icon="solar:wallet-outline" width={48} style={{ color: '#D1D5DB' }} />
            <p style={{ color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>No payment data found</p>
          </div>
        )}
        footer={(
          <TablePagination
            page={page} rowsPerPage={rowsPerPage} total={payments?.total ?? 0}
            onPageChange={handlePageChange} onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[10, 25, 50]}
          />
        )}
      >
        {rows.map(pay => {
          const role      = pay.user?.roles?.[0]?.name ?? '';
          const initials  = (pay.user?.name ?? '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
          const isVerified = pay.status === 'verified';

          return (
            <tr key={pay.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">

              {/* Name */}
              <td className={COL}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: '#0152EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Manrope,sans-serif' }}>{initials}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>{pay.user?.name ?? '-'}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>{pay.user?.phone_number ?? '-'}</div>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td className={COL}>
                <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>{pay.user?.email ?? '-'}</span>
              </td>

              {/* Type */}
              <td className={COL}>
                <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>{ROLE_LABEL[role] ?? role}</span>
              </td>

              {/* Amount */}
              <td className={COL}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                  {pay.currency === 'USD' ? `$ ${pay.amount}` : `Rp ${Number(pay.amount).toLocaleString('id-ID')}`}
                </span>
              </td>

              {/* Status */}
              <td className={COL}>
                <StatusBadge label={isVerified ? 'Verified' : 'Pending'} />
              </td>

              {/* Actions: Proof | Receipt PDF | Verify/Revert */}
              <td className="px-5 py-4">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>

                  {/* Proof */}
                  {pay.file_path ? (
                    <a href={`/filepayments/${pay.id}/proof`} target="_blank" rel="noreferrer" title="View Payment Proof" className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
                      <Icon icon="solar:file-outline" width={16} />
                    </a>
                  ) : (
                    <span className="p-1.5 rounded-md text-gray-300 opacity-40 cursor-not-allowed" title="No proof available">
                      <Icon icon="solar:file-outline" width={16} />
                    </span>
                  )}

                  {/* Receipt PDF */}
                  <a href={`/admin/payment/${pay.id}/digital-pdf`} target="_blank" rel="noreferrer" title="View Receipt PDF" className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
                    <Icon icon="solar:file-text-outline" width={16} />
                  </a>

                  {/* Verify / Revert — aksi utama bendahara */}
                  <button
                    type="button"
                    onClick={() => setConfirmItem(pay)}
                    title={isVerified ? 'Revert to Pending' : 'Verify Payment'}
                    className="p-1.5 rounded-md transition-colors"
                    style={{ color: isVerified ? '#F59E0B' : '#10B981' }}
                    onMouseEnter={e => e.currentTarget.style.background = isVerified ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Icon icon={isVerified ? 'solar:refresh-outline' : 'solar:check-circle-outline'} width={16} />
                  </button>

                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <ConfirmDialog
        open={Boolean(confirmItem)}
        title={confirmItem?.status === 'verified' ? 'Revert to Pending' : 'Verify Payment'}
        message={
          confirmItem
            ? confirmItem.status === 'verified'
              ? `Revert payment for ${confirmItem.user?.name} back to pending?`
              : `Verify payment for ${confirmItem.user?.name}? Confirmation email will be sent automatically.`
            : ''
        }
        cancelText="Cancel"
        confirmText={confirmItem?.status === 'verified' ? 'Revert' : 'Verify'}
        onClose={() => setConfirmItem(null)}
        onConfirm={handleVerify}
      />
    </BendaharaPageLayout>
  );
}
