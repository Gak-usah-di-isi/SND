import { useState } from 'react';
import { Search, FileText, ChevronDown, Eye, Send } from 'lucide-react';
import { Icon } from '@iconify/react';
import PageLayout from '../../../Components/ui/shared/PageLayout';
import NexTable from '../../../Components/ui/shared/NexTable';

const STATUS_STYLE = {
  completed: { label: 'Berhasil', bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  pending:   { label: 'Pending',  bg: 'rgba(255,174,31,0.1)',  color: '#F59E0B' },
  failed:    { label: 'Gagal',    bg: 'rgba(239,68,68,0.1)',   color: '#EF4444' },
};

const SAMPLE = [
  { id: '1', invoice_code: 'INV-2025-001', paid_at: '2025-05-01', patient: { first_name: 'Alice',   last_name: 'W',       phone_number: '081234567890' }, payment_method: { name: 'Cash'          }, amount: 1500000, status: 'completed' },
  { id: '2', invoice_code: 'INV-2025-002', paid_at: '2025-05-02', patient: { first_name: 'Bob',     last_name: 'M',       phone_number: '082345678901' }, payment_method: { name: 'Bank Transfer'  }, amount: 2800000, status: 'pending'   },
  { id: '3', invoice_code: 'INV-2025-003', paid_at: '2025-05-03', patient: { first_name: 'Charlie', last_name: 'B',       phone_number: '083456789012' }, payment_method: { name: 'QRIS'           }, amount: 750000,  status: 'completed' },
  { id: '4', invoice_code: 'INV-2025-004', paid_at: '2025-05-04', patient: { first_name: 'Diana',   last_name: 'P',       phone_number: '084567890123' }, payment_method: { name: 'Credit Card'    }, amount: 4200000, status: 'failed'    },
  { id: '5', invoice_code: 'INV-2025-005', paid_at: '2025-05-05', patient: { first_name: 'Edward',  last_name: 'N',       phone_number: '085678901234' }, payment_method: { name: 'Cash'           }, amount: 900000,  status: 'completed' },
];

function fmt(v) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v); }
function initials(p) { return `${p.first_name[0]}${p.last_name[0]}`.toUpperCase(); }

export default function TransaksiPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = SAMPLE.filter(t => {
    const matchSearch = t.invoice_code.toLowerCase().includes(search.toLowerCase()) ||
      `${t.patient.first_name} ${t.patient.last_name}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total      = SAMPLE.length;
  const totalBerhasil = SAMPLE.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalPending  = SAMPLE.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0);

  const columns = [
    { id: 'invoice_code', header: 'Kode Invoice',      render: (r) => <span className="text-sm font-medium text-gray-800">{r.invoice_code}</span> },
    { id: 'paid_at',      header: 'Tanggal Pembayaran', render: (r) => <span className="text-sm text-gray-600">{new Date(r.paid_at).toLocaleDateString('id-ID')}</span> },
    { id: 'patient',      header: 'Nama Customer',      render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: '#0152EA' }}>
          {initials(r.patient)}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{r.patient.first_name} {r.patient.last_name}</p>
          <p className="text-xs text-gray-500">{r.patient.phone_number}</p>
        </div>
      </div>
    )},
    { id: 'payment_method', header: 'Metode Pembayaran', render: (r) => <span className="text-sm text-gray-600">{r.payment_method?.name ?? '-'}</span> },
    { id: 'amount',  header: 'Total',  render: (r) => <span className="text-sm font-semibold text-gray-800">{fmt(r.amount)}</span> },
    { id: 'status',  header: 'Status', render: (r) => {
      const s = STATUS_STYLE[r.status] ?? STATUS_STYLE.pending;
      return <span className="inline-block px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>;
    }},
  ];

  const actions = () => [
    { icon: <Eye size={16} />,  title: 'Lihat Detail', onClick: () => {} },
    { icon: <Send size={16} />, title: 'Kirim Struk',  onClick: () => {} },
  ];

  return (
    <PageLayout currentPath="/template/penjualan/transaksi">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-gray-800" style={{ fontSize: 22 }}>Daftar Transaksi</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-4 p-5 bg-white" style={{ borderRadius: '12px', boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)', backgroundColor: 'rgba(93,135,255,0.1)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#3B82F6' }}>
            <Icon icon="solar:bill-list-outline" className="text-white" width={24} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#0152EA' }}>Total Transaksi</p>
            <p className="font-bold text-xl" style={{ color: '#0152EA' }}>{total}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5" style={{ borderRadius: '12px', backgroundColor: 'rgba(19,222,185,0.1)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#10B981' }}>
            <Icon icon="solar:check-circle-outline" className="text-white" width={24} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#059669' }}>Transaksi Berhasil</p>
            <p className="font-bold text-xl" style={{ color: '#059669' }}>{fmt(totalBerhasil)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5" style={{ borderRadius: '12px', backgroundColor: 'rgba(255,174,31,0.1)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F59E0B' }}>
            <Icon icon="solar:clock-circle-outline" className="text-white" width={24} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#F59E0B' }}>Transaksi Pending</p>
            <p className="font-bold text-xl" style={{ color: '#F59E0B' }}>{fmt(totalPending)}</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 bg-white rounded-md px-3 py-2 text-gray-600 outline-none">
          <option value="">Semua Status</option>
          <option value="completed">Berhasil</option>
          <option value="pending">Pending</option>
          <option value="failed">Gagal</option>
        </select>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 bg-white rounded-md text-gray-600 hover:bg-gray-50">
            <FileText size={15} /> Export File <ChevronDown size={14} />
          </button>
          <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-md px-3 py-2">
            <Search size={15} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari Transaksi"
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent" style={{ width: 160 }} />
          </div>
        </div>
      </div>

      <NexTable columns={columns} data={filtered} actions={actions} emptyTitle="Tidak ada transaksi" emptyDesc="Belum ada data transaksi." />
    </PageLayout>
  );
}
