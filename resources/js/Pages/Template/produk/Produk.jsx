import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search, Eye, EyeOff } from 'lucide-react';
import PageLayout from "../../../Components/ui/shared/PageLayout.jsx";
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';

const SAMPLE = [
  { id: '1', code: 'PRD-001', name: 'Serum Vitamin C',   item_category: { name: 'Skincare'   }, unit: 'Botol', sell_price: 'Rp 350.000', visibility: 'show'   },
  { id: '2', code: 'PRD-002', name: 'Sunscreen SPF 50',  item_category: { name: 'Skincare'   }, unit: 'Tube',  sell_price: 'Rp 180.000', visibility: 'show'   },
  { id: '3', code: 'PRD-003', name: 'Retinol Cream',     item_category: { name: 'Anti-aging' }, unit: 'Botol', sell_price: 'Rp 520.000', visibility: 'hidden' },
  { id: '4', code: 'PRD-004', name: 'Hyaluronic Acid',   item_category: { name: 'Serum'      }, unit: 'Botol', sell_price: 'Rp 290.000', visibility: 'show'   },
  { id: '5', code: 'PRD-005', name: 'Toner Brightening', item_category: { name: 'Skincare'   }, unit: 'Botol', sell_price: 'Rp 210.000', visibility: 'show'   },
];

const FILTER_DEFS = [
  {
    id: 'kategori',
    label: 'Kategori Produk',
    options: [
      { value: 'all', label: 'Semua' },
      { value: 'Skincare',   label: 'Skincare'   },
      { value: 'Anti-aging', label: 'Anti-aging' },
      { value: 'Serum',      label: 'Serum'      },
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

export default function ProdukPage() {
  const [search, setSearch]           = useState('');
  const [filterVals, setFilterVals]   = useState({ kategori: 'all' });
  const [appliedVals, setAppliedVals] = useState({ kategori: 'all' });
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData]               = useState(SAMPLE);

  const handleFilterChange = (id, val) => setFilterVals(prev => ({ ...prev, [id]: val }));
  const handleApply        = () => { setAppliedVals({ ...filterVals }); setPage(0); };
  const handleClear        = () => { const def = { kategori: 'all' }; setFilterVals(def); setAppliedVals(def); setPage(0); };

  const toggleVisibility = (id) => {
    setData(prev => prev.map(p => p.id === id ? { ...p, visibility: p.visibility === 'show' ? 'hidden' : 'show' } : p));
  };

  const filtered = data.filter(p => {
    const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchKategori = appliedVals.kategori === 'all' || p.item_category?.name === appliedVals.kategori;
    return matchSearch && matchKategori;
  });

  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <PageLayout currentPath="/template/produk/daftar">
      {/* Title */}
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Daftar Produk
      </h1>

      {/* Action bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        {/* Left: Filter */}
        <FilterPopover
          filters={FILTER_DEFS}
          values={filterVals}
          onChange={handleFilterChange}
          onApply={handleApply}
          onClear={handleClear}
          maxSpent={1000000}
        />

        {/* Right: Atur Kategori + Buat Produk + Search */}
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 text-sm font-medium transition-colors"
            onClick={() => router.get('/template/produk/kategori')}
            style={{ border: '1px solid #0152EA', color: '#0152EA', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
            Atur Kategori
          </button>

          <button
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, fontFamily: 'Manrope, sans-serif', cursor: 'pointer', border: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Buat Produk
          </button>

          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-md px-3 py-2" style={{ borderRadius: 8 }}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Cari Produk"
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ width: 150 }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          { key: 'code',       label: 'Product ID' },
          { key: 'name',       label: 'Nama'       },
          { key: 'kategori',   label: 'Kategori'   },
          { key: 'satuan',     label: 'Satuan'     },
          { key: 'harga',      label: 'Harga Jual' },
          { key: 'status',     label: 'Status'     },
          { key: 'aksi',       label: ''           },
        ]}
        empty={
          <div className="flex flex-col items-center gap-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m14.5 12.5-5 5M9.5 12.5l5 5" />
            </svg>
            <p className="font-medium text-gray-500">Tidak ada produk</p>
            <p className="text-sm text-gray-400">Coba sesuaikan pencarian atau filter.</p>
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
        {paged.map(p => (
          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
            {/* Product ID */}
            <td className={COL_CELL}>{p.code}</td>
            {/* Nama */}
            <td className={COL_CELL}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(1,82,234,0.08)' }}>
                  <span className="text-xs font-bold" style={{ color: '#0152EA' }}>{p.name[0]}</span>
                </div>
                <span className="text-sm font-medium text-gray-800">{p.name}</span>
              </div>
            </td>
            {/* Kategori */}
            <td className={COL_CELL}>{p.item_category?.name}</td>
            {/* Satuan */}
            <td className={COL_CELL}>{p.unit}</td>
            {/* Harga Jual */}
            <td className={COL_CELL + ' font-medium'}>{p.sell_price}</td>
            {/* Status */}
            <td className={COL_CELL}>
              <button
                onClick={() => toggleVisibility(p.id)}
                className="flex items-center gap-1.5 text-xs font-medium"
                style={{ color: p.visibility === 'show' ? '#0152EA' : '#64748B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {p.visibility === 'show'
                  ? <Eye size={15} style={{ color: '#0152EA' }} />
                  : <EyeOff size={15} style={{ color: '#64748B' }} />}
                {p.visibility === 'show' ? 'Show' : 'Hidden'}
              </button>
            </td>
            {/* Aksi */}
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
