import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { router } from '@inertiajs/react';
import PageLayout from '../../../Components/ui/shared/PageLayout';
import { Card } from '../../../Components/ui/card';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import BackButton from '../../../Components/ui/BackButton';
import { FloatInput } from '../../../Components/ui/FloatInput';

const SAMPLE = [
  { id: '1', code: 'CAT-001', name: 'Skincare', total: 12, status: 'Active' },
  { id: '2', code: 'CAT-002', name: 'Anti-aging', total: 6, status: 'Active' },
  { id: '3', code: 'CAT-003', name: 'Serum', total: 9, status: 'Active' },
  { id: '4', code: 'CAT-004', name: 'Body Care', total: 4, status: 'Inactive' },
];

const COL_CELL = 'px-6 py-4 text-sm text-gray-700';

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

export default function KategoriProduk() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState(SAMPLE);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter(item => item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q));
  }, [data, search]);

  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const resetForm = () => setForm({ name: '', description: '' });

  const handleSave = () => {
    if (!form.name.trim()) {
      return;
    }

    const nextId = String(data.length + 1);
    const nextCode = `CAT-${String(data.length + 1).padStart(3, '0')}`;
    setData(prev => [
      { id: nextId, code: nextCode, name: form.name.trim(), total: 0, status: 'Active' },
      ...prev,
    ]);
    resetForm();
    setShowModal(false);
  };

  return (
    <PageLayout currentPath="/template/produk/kategori">
      <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
        <BackButton onClick={() => router.get('/template/produk/daftar')} />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
          Kategori Produk
        </h1>
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div />

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white transition-colors"
            onClick={() => setShowModal(true)}
            style={{ backgroundColor: '#0152EA', borderRadius: 8, fontFamily: 'Manrope, sans-serif', cursor: 'pointer', border: 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Tambah Kategori Produk
          </button>

          <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-md px-3 py-2" style={{ borderRadius: 8 }}>
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Cari Kategori"
            className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            style={{ width: 160 }}
          />
        </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
          <div className="w-full" style={{ maxWidth: 600 }}>
            <Card className="px-6 pb-6" style={{ paddingTop: 16 }}>
              <div className="flex items-center justify-between" style={{ marginTop: -2 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', lineHeight: '20px' }}>
                  Buat Kategori Produk
                </h2>
                <button
                  type="button"
                  onClick={() => { resetForm(); setShowModal(false); }}
                  className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: '#64748B', background: 'transparent', border: 'none', cursor: 'pointer', marginTop: -2 }}
                  onMouseEnter={event => { event.currentTarget.style.backgroundColor = '#F1F5F9'; }}
                  onMouseLeave={event => { event.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="M6 6 18 18" />
                  </svg>
                </button>
              </div>
              <div
                style={{
                  height: 1,
                  background: '#E2E8F0',
                  margin: '4px -24px 18px',
                }}
              />

              <div className="w-full">
                <FloatInput
                  id="category-name"
                  label="Nama Kategori *"
                  value={form.name}
                  onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
                />

                <div className="mt-5">
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 8 }}>
                    Icon Kategori
                  </p>
                  <div
                    className="flex flex-col items-center justify-center text-center"
                    style={{
                      border: '1px dashed #CBD5E1',
                      borderRadius: 12,
                      width: 300,
                      height: 300,
                      color: '#64748B',
                      background: '#FFFFFF',
                    }}
                  >
                    <div
                      className="flex items-center justify-center"
                      style={{ width: 44, height: 44, borderRadius: '50%', background: '#EAF1FF', color: '#0152EA', marginBottom: 10 }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                    </div>
                    <p style={{ fontSize: 12, lineHeight: 1.5, maxWidth: 160 }}>
                      Pastikan format foto anda JPG atau PNG. File maksimal file hanya 2mb.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-6">
                <button
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  onClick={() => { resetForm(); setShowModal(false); }}
                  style={{ border: '1px solid #3B82F6', color: '#3B82F6', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white transition-colors"
                  onClick={handleSave}
                  style={{ backgroundColor: '#0152EA', borderRadius: 8, fontFamily: 'Manrope, sans-serif', cursor: 'pointer', border: 'none' }}
                >
                  Buat Kategori Produk
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}

      <DataTable
        columns={[
          { key: 'code', label: 'Kode' },
          { key: 'name', label: 'Nama Kategori' },
          { key: 'total', label: 'Total Produk' },
          { key: 'status', label: 'Status' },
          { key: 'aksi', label: '' },
        ]}
        empty={
          <div className="flex flex-col items-center gap-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m14.5 12.5-5 5M9.5 12.5l5 5" />
            </svg>
            <p className="font-medium text-gray-500">Tidak ada kategori</p>
            <p className="text-sm text-gray-400">Coba sesuaikan pencarian.</p>
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
        {paged.map(item => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={COL_CELL}>{item.code}</td>
            <td className={COL_CELL}>{item.name}</td>
            <td className={COL_CELL}>{item.total}</td>
            <td className={COL_CELL}>{item.status}</td>
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
