import { useState } from 'react';
import { Search } from 'lucide-react';
import PageLayout from '../../../Components/ui/shared/PageLayout';
import BackButton from '../../../Components/ui/BackButton';
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import FormActions from '../../../Components/ui/FormActions';

const SAMPLE = [
  { id: '1', room_code: 'STG-00001', room_name: 'diversity', bed_type: 'room', room_type: 'sdasda', status: 'Aktif' },
  { id: '2', room_code: 'STG-00002', room_name: 'Corporate', bed_type: 'warehouse', room_type: '-', status: 'Aktif' },
  { id: '3', room_code: 'STG-00003', room_name: 'diversity', bed_type: 'warehouse', room_type: 'asda', status: 'Aktif' },
];

const TYPE_OPTIONS = [
  { value: 'warehouse', label: 'Gudang' },
  { value: 'room', label: 'Ruangan' },
  { value: 'pharmacy', label: 'Apotek' },
];

const BRANCH_OPTIONS = [
  { value: '1', label: 'Cabang Utama' },
  { value: '2', label: 'Cabang Selatan' },
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

export default function RuangPenyimpananPage() {
  const [search, setSearch] = useState('');
  const [filterVals, setFilterVals] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [view, setView] = useState('list');
  const [form, setForm] = useState({
    code: '',
    name: '',
    type: '',
    branch: '',
    description: '',
  });

  const filtered = SAMPLE.filter(r =>
    r.room_name.toLowerCase().includes(search.toLowerCase()) ||
    r.room_code.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  if (view === 'create') {
    return (
      <PageLayout currentPath="/template/inventory/ruang">
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <BackButton onClick={() => setView('list')} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
            Tambah Ruangan
          </h1>
        </div>

        <Card>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
            Profil Ruang Penyimpanan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatInput
              id="storage-code"
              label="Kode"
              value={form.code}
              onChange={event => setForm(prev => ({ ...prev, code: event.target.value }))}
              placeholder="- Generate Otomatis -"
              disabled
            />
            <FloatInput
              id="storage-name"
              label="Nama Ruang Penyimpanan *"
              value={form.name}
              onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
              placeholder="Masukkan Nama"
            />
            <FloatSelect
              id="storage-type"
              label="Tipe *"
              value={form.type}
              onChange={value => setForm(prev => ({ ...prev, type: value }))}
              options={TYPE_OPTIONS}
              placeholder="Pilih Tipe"
            />
            <FloatSelect
              id="storage-branch"
              label="Cabang *"
              value={form.branch}
              onChange={value => setForm(prev => ({ ...prev, branch: value }))}
              options={BRANCH_OPTIONS}
              placeholder="Pilih Cabang"
            />
          </div>

          <div className="mt-4">
            <FloatInput
              id="storage-desc"
              label="Deskripsi"
              value={form.description}
              onChange={event => setForm(prev => ({ ...prev, description: event.target.value }))}
              placeholder="Masukkan Deskripsi (Opsional)"
              multiline
              rows={3}
            />
          </div>

        </Card>

        <div className="mt-6">
          <FormActions
            id="storage-form"
            cancelText="Batal"
            submitText="Simpan"
            onCancel={() => setView('list')}
            onSubmit={() => setView('list')}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout currentPath="/template/inventory/ruang">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Ruang Penyimpanan
      </h1>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <FilterPopover
          filters={[]}
          values={filterVals}
          onChange={(id, val) => setFilterVals(prev => ({ ...prev, [id]: val }))}
          onApply={() => setPage(0)}
          onClear={() => { setFilterVals({}); setPage(0); }}
        />

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
            onClick={() => setView('create')}
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Tambah Ruangan
          </button>

          <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8 }}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Cari Ruangan"
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ width: 150 }}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'code', label: 'Kode Ruangan' },
          { key: 'name', label: 'Nama Ruangan' },
          { key: 'bed_type', label: 'Tipe Bed' },
          { key: 'room_type', label: 'Tipe Ruangan' },
          { key: 'tambahan', label: 'Tambahan Harga' },
          { key: 'aksi', label: '' },
        ]}
        empty={
          <div className="flex flex-col items-center gap-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" />
            </svg>
            <p className="font-medium text-gray-500">Belum ada ruang penyimpanan</p>
            <p className="text-sm text-gray-400">Klik tombol "Tambah Ruangan" untuk menambahkan.</p>
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
            <td className={COL_CELL}>{r.room_code}</td>
            <td className={COL_CELL}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-800">{r.room_name}</span>
              </div>
            </td>
            <td className={COL_CELL}>{r.bed_type}</td>
            <td className={COL_CELL}>{r.room_type}</td>
            <td className={COL_CELL}>{r.status}</td>
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
