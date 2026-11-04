import { useState } from 'react';
import { router } from '@inertiajs/react';
import { FileText, ChevronDown, Search } from 'lucide-react';
import PageLayout from '../../../Components/ui/shared/PageLayout';
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { TablePagination } from '../../../Components/ui/TablePagination';
import { DataTable } from '../../../Components/ui/DataTable';

const TIER_STYLE = {
  Bronze: { bg: 'rgba(180,83,9,0.1)',    color: '#B45309' },
  Silver: { bg: 'rgba(100,116,139,0.1)', color: '#475569' },
  Gold:   { bg: 'rgba(234,179,8,0.1)',   color: '#CA8A04' },
};

const SAMPLE_PATIENTS = [
  { id: '1', first_name: 'Alice',   last_name: 'Wonderland', phone_number: '081234567890', tier: 'Gold',   total_spent: 'Rp 5.200.000',  points: 520,  is_active: true  },
  { id: '2', first_name: 'Bob',     last_name: 'Marley',     phone_number: '082345678901', tier: 'Silver', total_spent: 'Rp 1.800.000',  points: 180,  is_active: true  },
  { id: '3', first_name: 'Charlie', last_name: 'Brown',      phone_number: '083456789012', tier: 'Bronze', total_spent: 'Rp 500.000',    points: 50,   is_active: false },
  { id: '4', first_name: 'Diana',   last_name: 'Prince',     phone_number: '084567890123', tier: 'Gold',   total_spent: 'Rp 12.000.000', points: 1200, is_active: true  },
  { id: '5', first_name: 'Edward',  last_name: 'Norton',     phone_number: '085678901234', tier: 'Silver', total_spent: 'Rp 3.100.000',  points: 310,  is_active: true  },
];

function initials(p) { return `${p.first_name[0]}${p.last_name[0]}`.toUpperCase(); }

/* ---- Tabler edit icon ---- */
function IconEdit({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
      <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415z" />
    </svg>
  );
}

/* ---- Tabler trash icon ---- */
function IconTrash({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

const FILTER_DEFS = [
  {
    id: 'tier',
    label: 'Membership',
    options: [
      { value: 'all', label: 'Semua Tier' },
      { value: 'Gold', label: 'Gold' },
      { value: 'Silver', label: 'Silver' },
      { value: 'Bronze', label: 'Bronze' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    options: [
      { value: 'all', label: 'Semua Status' },
      { value: 'aktif', label: 'Aktif' },
      { value: 'nonaktif', label: 'Nonaktif' },
    ],
  },
];

export default function PasienPage() {
  const [search, setSearch]           = useState('');
  const [filterVals, setFilterVals]   = useState({ tier: 'all', status: 'all' });
  const [appliedVals, setAppliedVals] = useState({ tier: 'all', status: 'all' });
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmRow, setConfirmRow]   = useState(null);

  const handleFilterChange = (id, val) => setFilterVals(prev => ({ ...prev, [id]: val }));
  const handleApply        = () => { setAppliedVals({ ...filterVals }); setPage(0); };
  const handleClear        = () => { const def = { tier: 'all', status: 'all' }; setFilterVals(def); setAppliedVals(def); setPage(0); };

  const filtered = SAMPLE_PATIENTS.filter(p => {
    const matchSearch = `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) || p.phone_number.includes(search);
    const matchTier   = appliedVals.tier === 'all'   || p.tier === appliedVals.tier;
    const matchStatus = appliedVals.status === 'all' ? true : appliedVals.status === 'aktif' ? p.is_active : !p.is_active;
    return matchSearch && matchTier && matchStatus;
  });

  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const COL_CELL = 'px-6 py-4 text-sm text-gray-700';

  return (
    <PageLayout currentPath="/template/pasien">
      {/* Page title */}
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Data Pasien
      </h1>

      {/* Action bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        {/* Left: Filter button */}
        <FilterPopover
          filters={FILTER_DEFS}
          values={filterVals}
          onChange={handleFilterChange}
          onApply={handleApply}
          onClear={handleClear}
        />

        {/* Right: Export + Register + Search */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 bg-white rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
            style={{ borderRadius: 8 }}>
            <FileText size={15} />
            Export File
            <ChevronDown size={13} />
          </button>

          <button
            onClick={() => router.get('/template/pasien/register')}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer"
            style={{ backgroundColor: '#0152EA', borderRadius: 8 }}>
            {/* + icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Register
          </button>

          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-md px-3 py-2" style={{ borderRadius: 8 }}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Cari Pasien"
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ width: 150 }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          { key: 'patient', label: 'Patient' },
          { key: 'tier', label: 'Tier' },
          { key: 'saldo', label: 'Saldo Point' },
          { key: 'status', label: 'Status' },
          { key: 'spent', label: 'Total Spent' },
          { key: 'aksi', label: '' },
        ]}
        footer={
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={filtered.length}
            onPageChange={setPage}
            onRowsPerPageChange={n => { setRowsPerPage(n); setPage(0); }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        }
        empty={
          <div className="flex flex-col items-center gap-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m14.5 12.5-5 5M9.5 12.5l5 5" />
            </svg>
            <p className="font-medium text-gray-500">No patients found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filter to find what you are looking for.</p>
          </div>
        }
      >
        {paged.map(p => {
          const tier = TIER_STYLE[p.tier] ?? TIER_STYLE.Bronze;
          return (
            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
              <td className={COL_CELL}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: '#0152EA' }}>
                    {initials(p)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{p.first_name} {p.last_name}</p>
                    <p className="text-xs text-gray-500">{p.phone_number}</p>
                  </div>
                </div>
              </td>
              <td className={COL_CELL}>
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                  style={{ backgroundColor: tier.bg, color: tier.color }}>
                  {p.tier}
                </span>
              </td>
              <td className={COL_CELL}>{p.points}</td>
              <td className={COL_CELL}>
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  style={{ backgroundColor: p.is_active ? 'rgba(19,222,185,0.1)' : 'rgba(239,68,68,0.1)', color: p.is_active ? '#10B981' : '#EF4444' }}>
                  {p.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </td>
              <td className={COL_CELL + ' font-medium'}>{p.total_spent}</td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-md transition-colors" style={{ color: '#0152EA' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'} title="Edit">
                    <IconEdit />
                  </button>
                  <button
                    onClick={() => setConfirmRow(p)}
                    className="w-8 h-8 flex items-center justify-center rounded-md transition-colors" style={{ color: '#EF4444' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Nonaktifkan">
                    <IconTrash />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>


      {/* Confirm deactivate dialog */}
      {confirmRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl mx-4">
            <p className="font-semibold text-gray-800 text-base mb-2">Nonaktifkan Pasien</p>
            <p className="text-sm text-gray-500 mb-6">
              Nonaktifkan pasien {confirmRow.first_name} {confirmRow.last_name}?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmRow(null)}
                className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">
                Batal
              </button>
              <button onClick={() => setConfirmRow(null)}
                className="px-4 py-2 text-sm rounded-md text-white bg-red-500 hover:bg-red-600">
                Ya, Nonaktifkan
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
