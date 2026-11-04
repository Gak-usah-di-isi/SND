import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Icon } from '@iconify/react';
import SekretarisPageLayout from '../../../Components/ui/shared/SekretarisPageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import StatusBadge from '../../../Components/ui/StatusBadge';
import { FilterPopover } from '../../../Components/ui/FilterPopover';

const ROLE_LABEL = {
  'indonesia-participants': 'ID Participant',
  'indonesia-presenter':    'ID Presenter',
  'foreign-participants':   'Foreign Participant',
  'foreign-presenter':      'Foreign Presenter',
  'reviewer':               'Reviewer',
};

const RANGES = [
  { key: 'all',   label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'week',  label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

const COL = 'px-4 py-4 text-sm text-gray-700';

/* ---------- Pending Card (persis tampilan Admin) ---------- */
function PendingCard({ payment, onShowProof }) {
  const role     = payment.user?.roles?.[0]?.name ?? '';
  const initials = (payment.user?.name ?? '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const date     = payment.created_at
    ? new Date(payment.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';
  const name  = payment.user?.name ?? '-';
  const words = name.split(' ');
  const shortName = words.length > 4 ? words.slice(0, 4).join(' ') + '...' : name;

  return (
    <div className="bg-white flex-shrink-0" style={{
      borderRadius: 12, width: 240, height: 230,
      padding: 20,
      boxShadow: 'rgba(175, 182, 201, 0.2) 0px 2px 4px -1px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      {/* Avatar + nama */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ backgroundColor: '#0152EA' }}>
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <p className="font-bold text-gray-800 text-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {shortName}
          </p>
          <p className="text-xs text-gray-500">{ROLE_LABEL[role] ?? role}</p>
        </div>
      </div>

      {/* Label + angka besar + sub */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide" style={{ margin: 0 }}>Pending Payment</p>
        <p className="font-bold text-gray-800" style={{ fontSize: payment.currency === 'USD' ? 40 : 28, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
          {payment.currency === 'USD' ? `$${payment.amount}` : `Rp ${Number(payment.amount).toLocaleString('id-ID')}`}
        </p>
        <p className="text-xs text-gray-500" style={{ margin: 0 }}>
          <b>{date}</b> payment date
        </p>
      </div>

      {/* Button View Proof */}
      <button
        type="button"
        onClick={() => payment.file_path && onShowProof(payment)}
        disabled={!payment.file_path}
        className="w-full py-2 text-sm font-medium border"
        style={{
          borderColor: payment.file_path ? '#0152EA' : '#E2E8F0',
          color: payment.file_path ? '#0152EA' : '#9CA3AF',
          borderRadius: 9,
          backgroundColor: 'transparent',
          cursor: payment.file_path ? 'pointer' : 'not-allowed',
          transition: 'background-color 150ms ease',
        }}
        onMouseEnter={e => {
          if (!payment.file_path) return;
          e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.06)';
        }}
        onMouseLeave={e => {
          if (!payment.file_path) return;
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {payment.file_path ? 'View Proof' : 'No Proof'}
      </button>
    </div>
  );
}

export default function SekretarisPaymentIndexPage({
  payments,
  pendingAll = [],
  stats,
  filters: initialFilters = {},
}) {
  const [search, setSearch]           = useState(initialFilters?.search ?? '');
  const [range, setRange]             = useState(initialFilters?.range ?? 'all');
  const [filterVals, setFilterVals]   = useState({ status: initialFilters?.status ?? '', type: initialFilters?.type ?? '' });
  const [appliedVals, setAppliedVals] = useState({ status: initialFilters?.status ?? '', type: initialFilters?.type ?? '' });
  const [carouselPage, setCarouselPage] = useState(0);

  const rows        = payments?.data ?? [];
  const page        = Math.max((payments?.current_page ?? 1) - 1, 0);
  const rowsPerPage = payments?.per_page ?? 10;

  const CARDS_PER_PAGE     = 4;
  const totalCarouselPages = Math.ceil(pendingAll.length / CARDS_PER_PAGE);
  const visiblePending     = pendingAll.slice(carouselPage * CARDS_PER_PAGE, (carouselPage + 1) * CARDS_PER_PAGE);

  const navigate = (params) => {
    router.get('/sekretaris/payments', params, {
      preserveScroll: true,
      preserveState: true,
      only: ['payments', 'stats', 'filters'],
    });
  };

  const handleSearch = (val) => {
    setSearch(val);
    navigate({ search: val, status: appliedVals.status, type: appliedVals.type, range });
  };

  const handleRange = (r) => {
    setRange(r);
    navigate({ search, status: appliedVals.status, type: appliedVals.type, range: r });
  };

  const handleApply = () => {
    setAppliedVals({ ...filterVals });
    navigate({ search, status: filterVals.status, type: filterVals.type, range, page: 1 });
  };

  const handleClear = () => {
    const empty = { status: '', type: '' };
    setFilterVals(empty);
    setAppliedVals(empty);
    navigate({ search, range, page: 1 });
  };

  const handlePageChange = (next) => {
    navigate({ search, status: appliedVals.status, type: appliedVals.type, range, page: next + 1, per_page: rowsPerPage });
  };

  const handleRowsChange = (next) => {
    navigate({ search, status: appliedVals.status, type: appliedVals.type, range, page: 1, per_page: next });
  };

  return (
    <SekretarisPageLayout currentPath="/sekretaris/payments">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
          Payment
        </h1>
      </div>

      {/* Stat Cards — copy exact dari HTML Daftar Transaksi */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Total */}
        <div className="flex items-center gap-4 p-5" style={{ borderRadius: 12, backgroundColor: 'rgba(93,135,255,0.1)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgb(59,130,246)' }}>
            <Icon icon="solar:bill-list-outline" width={24} className="text-white" style={{ color: '#fff' }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#0152EA' }}>Total Transactions</p>
            <p className="font-bold text-xl" style={{ color: '#0152EA' }}>{stats?.total ?? 0}</p>
          </div>
        </div>

        {/* Terverifikasi */}
        <div className="flex items-center gap-4 p-5" style={{ borderRadius: 12, backgroundColor: 'rgba(19,222,185,0.1)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgb(16,185,129)' }}>
            <Icon icon="solar:check-circle-outline" width={24} style={{ color: '#fff' }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'rgb(5,150,105)' }}>Verified Transactions</p>
            <p className="font-bold text-xl" style={{ color: 'rgb(5,150,105)' }}>{stats?.verified ?? 0}</p>
          </div>
        </div>

        {/* Pending */}
        <div className="flex items-center gap-4 p-5" style={{ borderRadius: 12, backgroundColor: 'rgba(255,174,31,0.1)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgb(245,158,11)' }}>
            <Icon icon="solar:clock-circle-outline" width={24} style={{ color: '#fff' }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'rgb(245,158,11)' }}>Pending Transactions</p>
            <p className="font-bold text-xl" style={{ color: 'rgb(245,158,11)' }}>{stats?.pending ?? 0}</p>
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
              <PendingCard
                key={p.id}
                payment={p}
                onShowProof={(pay) => window.open(`/filepayments/${pay.id}/proof`, '_blank')}
              />
            ))}

            {/* Next / Prev arrow carousel */}
            {totalCarouselPages > 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, paddingLeft: 4 }}>
                <button
                  type="button"
                  onClick={() => setCarouselPage(p => Math.max(p - 1, 0))}
                  disabled={carouselPage === 0}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#fff', cursor: carouselPage === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: carouselPage === 0 ? 0.3 : 1, transition: 'all 150ms' }}
                  onMouseEnter={e => { if (carouselPage > 0) e.currentTarget.style.background = '#F1F5F9'; }}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <ChevronLeft size={15} color="#374151" />
                </button>
                <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', lineHeight: 1 }}>
                  {carouselPage + 1}/{totalCarouselPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCarouselPage(p => Math.min(p + 1, totalCarouselPages - 1))}
                  disabled={carouselPage === totalCarouselPages - 1}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#fff', cursor: carouselPage === totalCarouselPages - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: carouselPage === totalCarouselPages - 1 ? 0.3 : 1, transition: 'all 150ms' }}
                  onMouseEnter={e => { if (carouselPage < totalCarouselPages - 1) e.currentTarget.style.background = '#F1F5F9'; }}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <ChevronRight size={15} color="#374151" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Date range filter + Filter + Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>

        {/* Kiri: range tabs + date nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Range toggle */}
          <div style={{ display: 'inline-flex', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
            {RANGES.map((r, i) => (
              <button
                key={r.key}
                type="button"
                onClick={() => handleRange(r.key)}
                style={{
                  padding: '7px 14px', fontSize: 13, fontFamily: 'Manrope,sans-serif',
                  fontWeight: range === r.key ? 600 : 400,
                  border: 'none',
                  borderLeft: i > 0 ? '1px solid #E2E8F0' : 'none',
                  background: range === r.key ? 'rgba(1,82,234,0.08)' : '#fff',
                  color: range === r.key ? '#0152EA' : '#6B7280',
                  cursor: 'pointer', transition: 'all 120ms',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Date display */}
          <div className="flex items-center gap-2">
            <button type="button" className="flex items-center justify-center border border-gray-200 bg-white rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors" style={{ width: 36, height: 36 }}>
              <ChevronLeft size={16} className="text-gray-500" />
            </button>
            <div className="px-4 py-1.5 border border-gray-200 bg-white rounded-md text-sm font-medium text-gray-700" style={{ minWidth: 160, textAlign: 'center' }}>
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <button type="button" className="flex items-center justify-center border border-gray-200 bg-white rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors" style={{ width: 36, height: 36 }}>
              <ChevronRight size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Kanan: Filter + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FilterPopover
            filters={[
              {
                id: 'type', label: 'Registration Type',
                options: [
                  { value: 'indonesia-participants', label: 'ID Participant' },
                  { value: 'indonesia-presenter',    label: 'ID Presenter' },
                  { value: 'foreign-participants',   label: 'Foreign Participant' },
                  { value: 'foreign-presenter',      label: 'Foreign Presenter' },
                ],
              },
              {
                id: 'status', label: 'Status',
                options: [
                  { value: 'pending',  label: 'Pending' },
                  { value: 'verified', label: 'Verified' },
                ],
              },
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
          <div className="flex flex-col items-center gap-2 py-6">
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
          const role     = pay.user?.roles?.[0]?.name ?? '';
          const initials = (pay.user?.name ?? '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
          const isVerified = pay.status === 'verified';

          return (
            <tr key={pay.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">

              {/* Nama + phone */}
              <td className={COL}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: '#0152EA', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
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

              {/* Registration Type */}
              <td className={COL}>
                <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>
                  {ROLE_LABEL[role] ?? role}
                </span>
              </td>

              {/* Amount */}
              <td className={COL}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                  {pay.currency === 'USD'
                    ? `$ ${pay.amount}`
                    : `Rp ${Number(pay.amount).toLocaleString('id-ID')}`}
                </span>
              </td>

              {/* Status */}
              <td className={COL}>
                <StatusBadge label={isVerified ? 'Verified' : 'Pending'} />
              </td>

              {/* Actions: Proof | Receipt (Read-only for Sekretaris) */}
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1">

                  {/* Proof */}
                  {pay.file_path ? (
                    <a
                      href={`/filepayments/${pay.id}/proof`}
                      target="_blank"
                      rel="noreferrer"
                      title="View Payment Proof"
                      className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                    >
                      <Icon icon="solar:file-outline" width={16} />
                    </a>
                  ) : (
                    <span className="p-1.5 rounded-md text-gray-300 opacity-40 cursor-not-allowed" title="No proof available">
                      <Icon icon="solar:file-outline" width={16} />
                    </span>
                  )}

                  {/* Receipt PDF */}
                  <a
                    href={`/admin/payment/${pay.id}/digital-pdf`}
                    target="_blank"
                    rel="noreferrer"
                    title="View Receipt PDF"
                    className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                  >
                    <Icon icon="solar:file-text-outline" width={16} />
                  </a>

                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>
    </SekretarisPageLayout>
  );
}
