import { useState } from 'react';
import { router } from '@inertiajs/react';
import { FileText, ChevronDown, Search } from 'lucide-react';
import PageLayout from '../../../Components/ui/shared/PageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';

const SAMPLE = [
  { id: '1', first_name: 'John',  last_name: 'Dhie',      phone: '081238467201', email: 'anaskhalif71@gmail.com',  role: 'front_office',  institusi: 'Klinik Sehat',    photo: null, invitation: true  },
  { id: '2', first_name: 'Anas',  last_name: 'Khalif',    phone: '082345678901', email: 'anaskhalif995@gmail.com', role: 'super_admin',   institusi: 'Klinik Sejahtera', photo: null, invitation: false },
  { id: '3', first_name: 'Sari',  last_name: 'Dewi',      phone: '083456789012', email: 'saridewi@gmail.com',      role: 'dokter',        institusi: 'RS Mitra',        photo: null, invitation: false },
  { id: '4', first_name: 'Budi',  last_name: 'Santoso',   phone: '084567890123', email: 'budisantoso@gmail.com',   role: 'kasir',         institusi: 'Klinik Sehat',    photo: null, invitation: false },
];

function initials(s) { return `${s.first_name[0]}${s.last_name[0]}`.toUpperCase(); }

function IconSend({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14L21 3M21 3l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1L21 3" />
    </svg>
  );
}

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

export default function DaftarStaffPage() {
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = SAMPLE.filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <PageLayout currentPath="/template/pengaturan/staff">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Daftar Staff
      </h1>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
            style={{ borderRadius: 8, fontFamily: 'Manrope, sans-serif' }}>
            <FileText size={15} />
            Export File
            <ChevronDown size={13} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.visit('/template/pengaturan/staff/tambah')}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Tambah Staff
          </button>

          <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8 }}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Cari Staff"
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ width: 150 }}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'nama',      label: 'Nama'      },
          { key: 'email',     label: 'Email'     },
          { key: 'institusi', label: 'Institusi' },
          { key: 'role',      label: 'Jabatan'   },
          { key: 'aksi',      label: '', align: 'right' },
        ]}
        empty={
          <div className="flex flex-col items-center gap-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p className="font-medium text-gray-500">No staffs found</p>
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
        {paged.map((s) => (
          <tr key={s.id} className="hover:bg-gray-50 transition-colors">
            <td className={COL_CELL}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: '#0152EA' }}>
                  {initials(s)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{s.first_name} {s.last_name}</p>
                  <p className="text-xs text-gray-500">{s.phone}</p>
                </div>
              </div>
            </td>
            <td className={COL_CELL}>{s.email}</td>
            <td className={COL_CELL}>{s.institusi}</td>
            <td className={COL_CELL}>{s.role}</td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                {s.invitation && (
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                    style={{ color: '#0152EA', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Kirim Undangan">
                    <IconSend />
                  </button>
                )}
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: '#0152EA', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Edit">
                  <IconEdit />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: '#EF4444', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Hapus">
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
