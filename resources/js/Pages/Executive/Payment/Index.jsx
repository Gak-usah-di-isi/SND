import { useState } from 'react';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Icon } from '@iconify/react';
import ExecutivePageLayout from '../../../Components/ui/shared/ExecutivePageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import StatusBadge from '../../../Components/ui/StatusBadge';
import { FilterPopover } from '../../../Components/ui/FilterPopover';

const ROLE_LABEL = {
  'indonesia-participants': 'ID Participant',
  'indonesia-presenter': 'ID Presenter',
  'foreign-participants': 'Foreign Participant',
  'foreign-presenter': 'Foreign Presenter',
  reviewer: 'Reviewer',
};

const RANGES = [
  { key: 'all', label: 'Semua' },
  { key: 'today', label: 'Hari Ini' },
  { key: 'week', label: 'Minggu Ini' },
  { key: 'month', label: 'Bulan Ini' },
];

const CELL = 'px-4 py-4 text-sm text-gray-700';

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).map(word => word[0]).slice(0, 2).join('').toUpperCase();
}

function PendingCard({ payment }) {
  const name = payment.user?.name ?? '-';
  const date = payment.created_at
    ? new Date(payment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';

  return (
    <div className="flex h-[230px] w-[240px] flex-shrink-0 flex-col justify-between rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
          {getInitials(name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-800">{name}</p>
          <p className="text-xs text-gray-500">{ROLE_LABEL[payment.user?.roles?.[0]?.name] ?? payment.user?.roles?.[0]?.name ?? '-'}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="m-0 text-xs font-semibold uppercase text-gray-400">Pending Payment</p>
        <p className="m-0 truncate font-bold leading-tight text-gray-800" style={{ fontSize: payment.currency === 'USD' ? 32 : 26 }}>
          {payment.currency === 'USD' ? `$${payment.amount}` : `Rp ${Number(payment.amount).toLocaleString('id-ID')}`}
        </p>
        <p className="m-0 text-xs text-gray-500"><b>{date}</b> payment date</p>
      </div>
      {payment.file_path ? (
        <a
          href={`/filepayments/${payment.id}/proof`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-blue-600 py-2 text-center text-sm font-medium text-blue-700 hover:bg-blue-50"
        >
          Lihat Bukti
        </a>
      ) : (
        <span className="rounded-lg border border-gray-200 py-2 text-center text-sm text-gray-400">Tidak Ada Bukti</span>
      )}
    </div>
  );
}

export default function PaymentIndex({ payments, pendingAll = [], stats, filters: initialFilters }) {
  const [search, setSearch] = useState(initialFilters?.search ?? '');
  const [range, setRange] = useState(initialFilters?.range ?? 'all');
  const [filterVals, setFilterVals] = useState({ status: initialFilters?.status ?? '', type: initialFilters?.type ?? '' });
  const [appliedVals, setAppliedVals] = useState({ status: initialFilters?.status ?? '', type: initialFilters?.type ?? '' });
  const [carouselPage, setCarouselPage] = useState(0);

  const rows = payments?.data ?? [];
  const page = Math.max((payments?.current_page ?? 1) - 1, 0);
  const rowsPerPage = payments?.per_page ?? 10;
  const cardsPerPage = 4;
  const carouselPages = Math.ceil(pendingAll.length / cardsPerPage);
  const visiblePending = pendingAll.slice(carouselPage * cardsPerPage, (carouselPage + 1) * cardsPerPage);

  const navigate = (params) => {
    router.get('/executive/payments', params, {
      preserveScroll: true,
      preserveState: true,
      only: ['payments', 'stats', 'filters'],
    });
  };

  const handleSearch = (value) => {
    setSearch(value);
    navigate({ search: value, status: appliedVals.status, type: appliedVals.type, range });
  };

  const handleRange = (value) => {
    setRange(value);
    navigate({ search, status: appliedVals.status, type: appliedVals.type, range: value, page: 1 });
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

  const handlePageChange = (nextPage) => {
    navigate({ search, status: appliedVals.status, type: appliedVals.type, range, page: nextPage + 1, per_page: rowsPerPage });
  };

  const handleRowsChange = (value) => {
    navigate({ search, status: appliedVals.status, type: appliedVals.type, range, page: 1, per_page: value });
  };

  return (
    <ExecutivePageLayout currentPath="/executive/payments">
      <header className="mb-6">
        <h1 className="m-0 text-[28px] font-bold text-[#1F2A3D]" style={{ fontFamily: 'Manrope,sans-serif' }}>Payment</h1>
      </header>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl p-5" style={{ backgroundColor: 'rgba(93,135,255,0.1)' }}>
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
            <Icon icon="solar:bill-list-outline" width={24} style={{ color: '#fff' }} />
          </div>
          <div><p className="text-sm font-semibold text-blue-700">Total Transactions</p><p className="text-xl font-bold text-blue-700">{stats?.total ?? 0}</p></div>
        </div>
        <div className="flex items-center gap-4 rounded-xl p-5" style={{ backgroundColor: 'rgba(19,222,185,0.1)' }}>
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
            <Icon icon="solar:check-circle-outline" width={24} style={{ color: '#fff' }} />
          </div>
          <div><p className="text-sm font-semibold text-emerald-700">Verified Transactions</p><p className="text-xl font-bold text-emerald-700">{stats?.verified ?? 0}</p></div>
        </div>
        <div className="flex items-center gap-4 rounded-xl p-5" style={{ backgroundColor: 'rgba(255,174,31,0.1)' }}>
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-500">
            <Icon icon="solar:clock-circle-outline" width={24} style={{ color: '#fff' }} />
          </div>
          <div><p className="text-sm font-semibold text-amber-600">Pending Transactions</p><p className="text-xl font-bold text-amber-600">{stats?.pending ?? 0}</p></div>
        </div>
      </div>

      {pendingAll.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-[13px] font-semibold uppercase text-gray-500">Pending Payment ({pendingAll.length})</h2>
          <div className="flex items-stretch gap-4 overflow-x-auto pb-2">
            {visiblePending.map(payment => <PendingCard key={payment.id} payment={payment} />)}
            {carouselPages > 1 && (
              <div className="flex flex-shrink-0 flex-col items-center justify-center gap-2 px-1">
                <button type="button" aria-label="Previous pending payments" onClick={() => setCarouselPage(value => Math.max(value - 1, 0))} disabled={carouselPage === 0} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white disabled:opacity-30">
                  <ChevronLeft size={15} />
                </button>
                <span className="text-[11px] text-gray-400">{carouselPage + 1}/{carouselPages}</span>
                <button type="button" aria-label="Next pending payments" onClick={() => setCarouselPage(value => Math.min(value + 1, carouselPages - 1))} disabled={carouselPage === carouselPages - 1} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white disabled:opacity-30">
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-lg border border-gray-200 bg-white">
            {RANGES.map((item, index) => (
              <button key={item.key} type="button" onClick={() => handleRange(item.key)} className={`border-0 px-3.5 py-2 text-[13px] ${index ? 'border-l border-l-gray-200' : ''} ${range === item.key ? 'bg-blue-50 font-semibold text-blue-700' : 'bg-white text-gray-500'}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterPopover
            filters={[
              { id: 'type', label: 'Registration Type', options: [
                { value: 'indonesia-participants', label: 'ID Participant' },
                { value: 'indonesia-presenter', label: 'ID Presenter' },
                { value: 'foreign-participants', label: 'Foreign Participant' },
                { value: 'foreign-presenter', label: 'Foreign Presenter' },
              ] },
              { id: 'status', label: 'Status', options: [
                { value: 'pending', label: 'Pending' },
                { value: 'verified', label: 'Verified' },
              ] },
            ]}
            values={filterVals}
            onChange={(id, value) => setFilterVals(previous => ({ ...previous, [id]: value }))}
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

      <DataTable
        columns={[
          { key: 'user', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'type', label: 'Registration Type' },
          { key: 'amount', label: 'Amount' },
          { key: 'status', label: 'Status' },
          { key: 'action', label: 'Action', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-6">
            <Icon icon="solar:wallet-outline" width={48} style={{ color: '#D1D5DB' }} />
            <p className="text-gray-500">No payment data found</p>
          </div>
        )}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={payments?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[10, 25, 50]}
          />
        )}
      >
        {rows.map(payment => {
          const role = payment.user?.roles?.[0]?.name ?? '';
          return (
            <tr key={payment.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
              <td className={CELL}>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">{getInitials(payment.user?.name ?? '')}</div>
                  <div>
                    <div className="text-[13.5px] font-semibold text-[#1F2A3D]">{payment.user?.name ?? '-'}</div>
                    <div className="text-xs text-gray-400">{payment.user?.phone_number ?? '-'}</div>
                  </div>
                </div>
              </td>
              <td className={CELL}><span className="text-[13px] text-gray-500">{payment.user?.email ?? '-'}</span></td>
              <td className={CELL}><span className="text-[13px] text-gray-700">{ROLE_LABEL[role] ?? role}</span></td>
              <td className={CELL}>
                <span className="text-[13px] font-semibold text-[#1F2A3D]">
                  {payment.currency === 'USD' ? `$ ${payment.amount}` : `Rp ${Number(payment.amount).toLocaleString('id-ID')}`}
                </span>
              </td>
              <td className={CELL}><StatusBadge label={payment.status === 'verified' ? 'Verified' : 'Pending'} /></td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {payment.file_path ? (
                    <a href={`/filepayments/${payment.id}/proof`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100" title="View Transfer Proof">
                      <Icon icon="solar:file-outline" width={16} /> View Proof
                    </a>
                  ) : (
                    <span className="px-2 py-1.5 text-xs text-gray-400">No Proof</span>
                  )}
                  <a href={`/admin/payment/${payment.id}/digital-pdf`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100" title="View Receipt PDF">
                    <Icon icon="solar:file-text-outline" width={16} /> Receipt PDF
                  </a>
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>
    </ExecutivePageLayout>
  );
}