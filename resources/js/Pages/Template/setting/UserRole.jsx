import { useState } from 'react';
import { Search } from 'lucide-react';
import PageLayout from '../../../Components/ui/shared/PageLayout';
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';

const SAMPLE = [
  { id: '1', name: 'super_admin',   label: 'Super Admin',   description: 'Full access to all features',  is_active: true,  permissions_count: 48, created_at: '2024-01-01' },
  { id: '2', name: 'front_office',  label: 'Front Office',  description: 'Manage appointments & patients', is_active: true, permissions_count: 18, created_at: '2024-01-05' },
  { id: '3', name: 'dokter',        label: 'Dokter',        description: 'Access patient records & EMR',  is_active: true,  permissions_count: 22, created_at: '2024-01-10' },
  { id: '4', name: 'kasir',         label: 'Kasir',         description: 'Manage transactions & payments', is_active: true, permissions_count: 12, created_at: '2024-01-15' },
  { id: '5', name: 'apoteker',      label: 'Apoteker',      description: 'Manage inventory & stock',      is_active: false, permissions_count: 10, created_at: '2024-02-01' },
];

const FILTER_DEFS = [
  {
    id: 'status',
    label: 'Status',
    options: [
      { value: 'all',    label: 'Semua'    },
      { value: 'active', label: 'Active'   },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
];

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

export default function UserRolePage() {
  const [search, setSearch]           = useState('');
  const [filterVals, setFilterVals]   = useState({ status: 'all' });
  const [appliedVals, setAppliedVals] = useState({ status: 'all' });
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleFilterChange = (id, val) => setFilterVals(prev => ({ ...prev, [id]: val }));
  const handleApply        = () => { setAppliedVals({ ...filterVals }); setPage(0); };
  const handleClear        = () => { const def = { status: 'all' }; setFilterVals(def); setAppliedVals(def); setPage(0); };

  const filtered = SAMPLE.filter(r => {
    const matchSearch = r.label.toLowerCase().includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = appliedVals.status === 'all'
      ? true
      : appliedVals.status === 'active' ? r.is_active : !r.is_active;
    return matchSearch && matchStatus;
  });

  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <PageLayout currentPath="/template/pengaturan/role">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Daftar Role
      </h1>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <FilterPopover
          filters={FILTER_DEFS}
          values={filterVals}
          onChange={handleFilterChange}
          onApply={handleApply}
          onClear={handleClear}
        />

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Buat Role
          </button>

          <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8 }}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Cari Role"
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ width: 150 }}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'role_name',   label: 'Role Name'   },
          { key: 'status',      label: 'Status'      },
          { key: 'permissions', label: 'Permissions' },
          { key: 'created',     label: 'Created'     },
          { key: 'aksi',        label: '', align: 'right' },
        ]}
        empty={
          <div className="flex flex-col items-center gap-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p className="font-medium text-gray-500">No roles found</p>
            <p className="text-sm text-gray-400">Create your first role to get started.</p>
          </div>
        }
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
      >
        {paged.map(r => (
          <tr key={r.id} className="hover:bg-gray-50 transition-colors">
            <td className={COL_CELL}>
              <p className="text-sm font-semibold text-gray-800">{r.label || r.name}</p>
              <p className="text-xs text-gray-500">{r.description}</p>
            </td>
            <td className={COL_CELL}>
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                style={{
                  backgroundColor: r.is_active ? 'rgba(19,222,185,0.1)' : 'rgba(148,163,184,0.15)',
                  color: r.is_active ? '#10B981' : '#64748B',
                }}>
                {r.is_active ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className={COL_CELL}>
              <div className="flex items-center gap-1.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>{r.permissions_count} permissions</span>
              </div>
            </td>
            <td className={COL_CELL}>
              {new Date(r.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-md transition-colors" style={{ color: '#0152EA' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'} title="Edit">
                  <IconEdit />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md transition-colors" style={{ color: '#EF4444' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'} title="Hapus">
                  <IconTrash />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </PageLayout>
  );
}
