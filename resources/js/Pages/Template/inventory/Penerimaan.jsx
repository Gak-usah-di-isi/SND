import { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import PageLayout from '../../../Components/ui/shared/PageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import { FloatSelect } from '../../../Components/ui/FloatSelect';

const SAMPLE = [
  {
    id: '1', code: 'RCV-001', date: '2025-05-01', supplier: { name: 'PT Farma Indo'    }, type: 'purchase',   total_amount: 2500000, status: 'completed',
    invoice_no: 'INV-001', warehouse: { name: 'Gudang Utama' }, notes: '-',
    items: [{ id: '1', item: { name: 'Paracetamol' }, quantity: 100, unit: 'PCS', price: 25000, total: 2500000 }],
  },
  {
    id: '2', code: 'RCV-002', date: '2025-05-03', supplier: { name: 'CV Medika Jaya'   }, type: 'purchase',   total_amount: 1800000, status: 'draft',
    invoice_no: 'INV-002', warehouse: { name: 'Gudang B'     }, notes: '-',
    items: [{ id: '2', item: { name: 'Vitamin C'   }, quantity: 50,  unit: 'BOX', price: 36000, total: 1800000 }],
  },
  {
    id: '3', code: 'RCV-003', date: '2025-05-07', supplier: { name: 'PT Farma Indo'    }, type: 'return',      total_amount: 350000,  status: 'completed',
    invoice_no: 'INV-003', warehouse: { name: 'Gudang Utama' }, notes: 'Retur barang rusak',
    items: [{ id: '3', item: { name: 'Amoxicillin' }, quantity: 14,  unit: 'PCS', price: 25000, total: 350000  }],
  },
  {
    id: '4', code: 'RCV-004', date: '2025-05-10', supplier: { name: 'UD Kosmetik Baru' }, type: 'purchase',   total_amount: 5200000, status: 'draft',
    invoice_no: 'INV-004', warehouse: { name: 'Gudang C'     }, notes: '-',
    items: [{ id: '4', item: { name: 'Serum Vit E' }, quantity: 20,  unit: 'BTL', price: 260000, total: 5200000 }],
  },
];

const STATUS_STYLE = {
  completed: { label: 'Selesai', bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  draft:     { label: 'Draft',   bg: 'rgba(255,174,31,0.12)', color: '#F59E0B' },
};

const TYPE_LABEL = { purchase: 'Pembelian', return: 'Retur', adjustment: 'Penyesuaian' };

function formatRp(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

const COL_CELL = 'px-6 py-4 text-sm text-gray-700';

function ExpandRow({ row }) {
  return (
    <tr>
      <td colSpan={8} style={{ background: '#F8FAFC', padding: 0 }}>
        <div style={{ padding: '20px 24px' }}>
          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Invoice No</p>
              <p className="text-sm font-medium text-gray-800">{row.invoice_no || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Gudang</p>
              <p className="text-sm font-medium text-gray-800">{row.warehouse?.name || '-'}</p>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <p className="text-xs text-gray-400 mb-0.5">Catatan</p>
              <p className="text-sm font-medium text-gray-800">{row.notes || '-'}</p>
            </div>
          </div>

          {/* Detail items sub-table */}
          {row.items?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Detail Item</p>
              <div className="bg-white rounded-[8px] border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Item','Jumlah','Satuan','Harga Satuan','Total'].map((h, i) => (
                        <th key={h} className={`px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider ${i >= 3 ? 'text-right' : 'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {row.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{item.item?.name || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.unit}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatRp(item.price)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatRp(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function PenerimaanPage() {
  const [search, setSearch]           = useState('');
  const [status, setStatus]           = useState('');
  const [type, setType]               = useState('');
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expanded, setExpanded]       = useState({});

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const filtered = SAMPLE.filter(r => {
    const matchSearch = r.code.toLowerCase().includes(search.toLowerCase()) || r.supplier.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !status || r.status === status;
    const matchType   = !type   || r.type   === type;
    return matchSearch && matchStatus && matchType;
  });

  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <PageLayout currentPath="/template/inventory/penerimaan">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Penerimaan Barang
      </h1>

      {/* Action bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div />
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Tambah Penerimaan
          </button>

          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8 }}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Cari kode, invoice..."
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ width: 170 }}
            />
          </div>

          {/* Status select */}
          <div style={{ width: 130 }}>
            <FloatSelect
              id="status-filter"
              label="Status"
              value={status}
              options={[
                { value: '',          label: 'Semua'   },
                { value: 'draft',     label: 'Draft'   },
                { value: 'completed', label: 'Selesai' },
              ]}
              onChange={v => { setStatus(v); setPage(0); }}
            />
          </div>

          {/* Tipe select */}
          <div style={{ width: 150 }}>
            <FloatSelect
              id="type-filter"
              label="Tipe"
              value={type}
              options={[
                { value: '',           label: 'Semua'       },
                { value: 'purchase',   label: 'Pembelian'   },
                { value: 'return',     label: 'Retur'       },
                { value: 'adjustment', label: 'Penyesuaian' },
              ]}
              onChange={v => { setType(v); setPage(0); }}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'expand',   label: '' },
          { key: 'code',     label: 'Kode'     },
          { key: 'tanggal',  label: 'Tanggal'  },
          { key: 'supplier', label: 'Supplier' },
          { key: 'tipe',     label: 'Tipe'     },
          { key: 'total',    label: 'Total'    },
          { key: 'status',   label: 'Status'   },
          { key: 'aksi',     label: 'Aksi', align: 'right' },
        ]}
        empty={
          <div className="flex flex-col items-center gap-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m14.5 12.5-5 5M9.5 12.5l5 5" />
            </svg>
            <p className="font-medium text-gray-500">Tidak ada data penerimaan</p>
            <p className="text-sm text-gray-400">Belum ada data penerimaan barang yang tersedia.</p>
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
        {paged.map(r => {
          const s = STATUS_STYLE[r.status] ?? STATUS_STYLE.draft;
          const isOpen = !!expanded[r.id];
          return [
            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
              {/* Expand chevron */}
              <td className="pl-4 py-4 w-10">
                <button
                  onClick={() => toggleExpand(r.id)}
                  className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-gray-100 text-gray-400">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </td>
              <td className={COL_CELL + ' font-medium text-gray-800'}>{r.code}</td>
              <td className={COL_CELL}>{fmtDate(r.date)}</td>
              <td className={COL_CELL}>{r.supplier.name}</td>
              <td className={COL_CELL}>{TYPE_LABEL[r.type] ?? r.type}</td>
              <td className={COL_CELL + ' font-medium'}>{formatRp(r.total_amount)}</td>
              <td className={COL_CELL}>
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  style={{ backgroundColor: s.bg, color: s.color }}>
                  {s.label}
                </span>
              </td>
              {/* Edit only for draft */}
              <td className="px-6 py-4">
                <div className="flex items-center justify-end">
                  {r.status === 'draft' && (
                    <button className="w-8 h-8 flex items-center justify-center rounded-md transition-colors" style={{ color: '#0152EA' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'} title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
                        <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415z" />
                      </svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>,
            isOpen && <ExpandRow key={`${r.id}-expand`} row={r} />,
          ];
        })}
      </DataTable>
    </PageLayout>
  );
}
