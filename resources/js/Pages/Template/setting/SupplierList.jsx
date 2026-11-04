import { useState } from 'react';
import { Search } from 'lucide-react';
import PageLayout from '../../../Components/ui/shared/PageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';

const SAMPLE = [
  { id: '1', name: 'PT Farma Indo',     contact_person: 'Budi Hartono',   email: 'budi@farmaindo.co.id',   phone: '02112345678',  deleted_at: null },
  { id: '2', name: 'CV Medika Jaya',    contact_person: 'Siti Rahayu',    email: 'siti@medikajaya.com',    phone: '02287654321',  deleted_at: null },
  { id: '3', name: 'UD Kosmetik Baru',  contact_person: 'Ahmad Fauzi',    email: 'ahmad@kosmetikbaru.com', phone: '0313456789',   deleted_at: null },
  { id: '4', name: 'PT Kimia Farma',    contact_person: 'Diana Sari',     email: 'diana@kimiafarma.co.id', phone: '02156789012',  deleted_at: '2024-11-15T10:00:00Z' },
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

function IconRestore({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v6h6" /><path d="M3 8C5.333 4.667 8.667 3 13 3c5.523 0 10 4.477 10 10s-4.477 10-10 10S3 18.523 3 13" />
    </svg>
  );
}

const COL_CELL = 'px-6 py-4 text-sm text-gray-700';

export default function SupplierListPage() {
  const [search, setSearch]           = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = SAMPLE.filter(s => {
    const matchDeleted = showDeleted ? true : !s.deleted_at;
    const matchSearch  = s.name.toLowerCase().includes(search.toLowerCase()) || s.contact_person.toLowerCase().includes(search.toLowerCase());
    return matchDeleted && matchSearch;
  });
  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const columns = [
    { key: 'nama_supplier',    label: 'Nama Supplier'  },
    { key: 'contact_person',   label: 'Contact Person' },
    { key: 'email',            label: 'Email'          },
    { key: 'no_telepon',       label: 'No. Telepon'    },
    ...(showDeleted ? [{ key: 'deleted_at', label: 'Tanggal Dihapus' }] : []),
    { key: 'aksi', label: '', align: 'right' },
  ];

  return (
    <PageLayout currentPath="/template/pengaturan/supplier">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Daftar Supplier
      </h1>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={e => { setShowDeleted(e.target.checked); setPage(0); }}
            className="w-4 h-4 rounded"
            style={{ accentColor: '#0152EA' }}
          />
          <span className="text-sm text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>Tampilkan yang dihapus</span>
        </label>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Tambah Supplier
          </button>

          <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8 }}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Cari Supplier"
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ width: 150 }}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        empty={
          <div className="flex flex-col items-center gap-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
              <path d="M3 9l2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
              <path d="M12 3v6" />
            </svg>
            <p className="font-medium text-gray-500">No suppliers found</p>
            <p className="text-sm text-gray-400">Try adjusting your search to find what you are looking for.</p>
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
        {paged.map(s => (
          <tr key={s.id} className="hover:bg-gray-50 transition-colors" style={s.deleted_at ? { opacity: 0.6 } : {}}>
            <td className={COL_CELL + ' font-medium text-gray-800'}>{s.name}</td>
            <td className={COL_CELL}>{s.contact_person}</td>
            <td className={COL_CELL}>{s.email}</td>
            <td className={COL_CELL}>{s.phone}</td>
            {showDeleted && (
              <td className={COL_CELL}>
                {s.deleted_at
                  ? new Date(s.deleted_at).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : '-'}
              </td>
            )}
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                {s.deleted_at ? (
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                    style={{ color: '#10B981' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(16,185,129,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Restore">
                    <IconRestore />
                  </button>
                ) : (
                  <>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md transition-colors" style={{ color: '#0152EA' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'} title="Edit">
                      <IconEdit />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md transition-colors" style={{ color: '#EF4444' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'} title="Hapus">
                      <IconTrash />
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </PageLayout>
  );
}
