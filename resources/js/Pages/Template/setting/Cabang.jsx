import { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import PageLayout from '../../../Components/ui/shared/PageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';

const DAYS_DEF = [
  { initial: 'S', day: 'Senin'  },
  { initial: 'S', day: 'Selasa' },
  { initial: 'R', day: 'Rabu'   },
  { initial: 'K', day: 'Kamis'  },
  { initial: 'J', day: 'Jumat'  },
  { initial: 'S', day: 'Sabtu'  },
  { initial: 'M', day: 'Minggu' },
];

const SAMPLE = [
  {
    id: '1', name: 'Klinik Pusat', code: 'BR-001', photo: null,
    head: { first_name: 'Anas', last_name: 'Khalif', phone: '081234567890' },
    day: ['Senin','Selasa','Rabu','Kamis','Jumat'],
    open_time: '08:00', close_time: '17:00',
    full_address: 'Jl. Sudirman No. 1', province: 'DKI Jakarta', city: 'Jakarta Pusat', sub_district: 'Menteng', postal_code: '10310', email: 'pusat@klinik.com', phone_number: '0211234567',
  },
  {
    id: '2', name: 'Cabang Selatan', code: 'BR-002', photo: null,
    head: { first_name: 'Budi', last_name: 'Santoso', phone: '082345678901' },
    day: ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
    open_time: '09:00', close_time: '18:00',
    full_address: 'Jl. TB Simatupang No. 5', province: 'DKI Jakarta', city: 'Jakarta Selatan', sub_district: 'Pasar Minggu', postal_code: '12520', email: '', phone_number: '',
  },
];

function initials(b) { return b.name.slice(0, 2).toUpperCase(); }

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

function ExpandRow({ branch }) {
  const activeDays = DAYS_DEF.filter(d => branch.day.includes(d.day));
  const detailRows = [
    ['Alamat Lengkap', branch.full_address],
    ['Provinsi',       branch.province],
    ['Kota/Kabupaten', branch.city],
    ['Kelurahan',      branch.sub_district],
    ['Kode Pos',       branch.postal_code],
    branch.email        && ['Email',    branch.email],
    branch.phone_number && ['Telepon',  branch.phone_number],
  ].filter(Boolean);

  return (
    <tr>
      <td colSpan={5} style={{ background: '#F8FAFC', padding: 0 }}>
        <div style={{ padding: '20px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Left: Jam Kerja */}
          {activeDays.length > 0 && (
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Jam Kerja</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                {activeDays.map(d => (
                  <div key={d.day} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: '#0152EA', fontSize: 12 }}>
                      {d.initial}
                    </div>
                    <span className="text-sm text-gray-700">{d.day} : {branch.open_time} - {branch.close_time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right: Detail Cabang */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">Detail Cabang</p>
            <div className="flex flex-col gap-2">
              {detailRows.map(([label, val]) => (
                <div key={label} className="flex gap-3">
                  <span className="text-sm font-semibold text-gray-700" style={{ minWidth: 130 }}>{label}:</span>
                  <span className="text-sm text-gray-500">{val || '-'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function CabangPage() {
  const [search, setSearch]           = useState('');
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expanded, setExpanded]       = useState({});

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const filtered = SAMPLE.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.code.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <PageLayout currentPath="/template/pengaturan/cabang">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Cabang
      </h1>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div />
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Buat Cabang
          </button>

          <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8 }}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Cari Cabang"
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ width: 150 }}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'expand',  label: '' },
          { key: 'nama',    label: 'Nama Cabang'    },
          { key: 'kepala',  label: 'Kepala Cabang'  },
          { key: 'harikerja', label: 'Hari Kerja'   },
          { key: 'aksi',    label: '', align: 'right' },
        ]}
        empty={
          <div className="flex flex-col items-center gap-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" />
            </svg>
            <p className="font-medium text-gray-500">No branches found</p>
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
        {paged.map(b => {
          const isOpen = !!expanded[b.id];
          return [
            <tr key={b.id} className="hover:bg-gray-50 transition-colors">
              <td className="pl-4 py-4 w-10">
                <button
                  onClick={() => toggleExpand(b.id)}
                  className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-gray-100 text-gray-400">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </td>
              <td className={COL_CELL}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: '#0152EA' }}>
                    {initials(b)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.code}</p>
                  </div>
                </div>
              </td>
              <td className={COL_CELL}>
                <p className="text-sm font-medium text-gray-800">{b.head?.first_name} {b.head?.last_name}</p>
                <p className="text-xs text-gray-500">{b.head?.phone}</p>
              </td>
              <td className={COL_CELL}>
                <div className="flex gap-1.5 flex-wrap">
                  {DAYS_DEF.map(d => {
                    const active = b.day.includes(d.day);
                    return (
                      <div key={d.day}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: active ? '#0152EA' : '#E5E7EB', color: active ? '#fff' : '#9CA3AF' }}>
                        {d.initial}
                      </div>
                    );
                  })}
                </div>
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
            </tr>,
            isOpen && <ExpandRow key={`${b.id}-expand`} branch={b} />,
          ];
        })}
      </DataTable>
    </PageLayout>
  );
}
