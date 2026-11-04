import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import PageLayout from '../../../Components/ui/shared/PageLayout';
import NexTable from '../../../Components/ui/shared/NexTable';

const SAMPLE = [
  { id: '1', code: 'TRT-001', name: 'Facial Basic',     item_category: { name: 'Facial'         }, duration_minutes: 60,  sell_price: 'Rp 250.000',  visibility: 'show'   },
  { id: '2', code: 'TRT-002', name: 'Botox Rahang',     item_category: { name: 'Botox'           }, duration_minutes: 45,  sell_price: 'Rp 1.500.000',visibility: 'show'   },
  { id: '3', code: 'TRT-003', name: 'Tanam Benang',     item_category: { name: 'Thread Lift'     }, duration_minutes: 90,  sell_price: 'Rp 3.000.000',visibility: 'hidden' },
  { id: '4', code: 'TRT-004', name: 'Chemical Peeling', item_category: { name: 'Peeling'         }, duration_minutes: 75,  sell_price: 'Rp 500.000',  visibility: 'show'   },
  { id: '5', code: 'TRT-005', name: 'Microneedling',    item_category: { name: 'Skin Treatment'  }, duration_minutes: 60,  sell_price: 'Rp 800.000',  visibility: 'show'   },
];

export default function TreatmentPage() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState(SAMPLE);

  const filtered = data.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase())
  );

  const toggleVisibility = (id) => {
    setData(prev => prev.map(t => t.id === id ? { ...t, visibility: t.visibility === 'show' ? 'hidden' : 'show' } : t));
  };

  const columns = [
    { id: 'code',     header: 'Kode',      render: (r) => <span className="text-sm text-gray-700">{r.code}</span> },
    { id: 'name',     header: 'Nama',      render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold" style={{ color: '#0152EA' }}>{r.name[0]}</span>
        </div>
        <span className="text-sm font-medium text-gray-800">{r.name}</span>
      </div>
    )},
    { id: 'category', header: 'Kategori',  render: (r) => <span className="text-sm text-gray-600">{r.item_category?.name}</span> },
    { id: 'duration', header: 'Durasi',    render: (r) => <span className="text-sm text-gray-600">{r.duration_minutes} menit</span> },
    { id: 'price',    header: 'Harga',     render: (r) => <span className="text-sm font-medium text-gray-800">{r.sell_price}</span> },
    { id: 'visibility', header: 'Status',  render: (r) => (
      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
        style={{ backgroundColor: r.visibility === 'show' ? 'rgba(19,222,185,0.1)' : 'rgba(100,116,139,0.1)', color: r.visibility === 'show' ? '#10B981' : '#64748B' }}>
        {r.visibility === 'show' ? 'Tampil' : 'Tersembunyi'}
      </span>
    )},
  ];

  const actions = (row) => [
    { icon: row.visibility === 'show' ? <EyeOff size={16} /> : <Eye size={16} />, title: row.visibility === 'show' ? 'Sembunyikan' : 'Tampilkan', onClick: () => toggleVisibility(row.id) },
    { icon: <Edit2 size={16} />,  title: 'Edit',  onClick: () => {} },
    { icon: <Trash2 size={16} />, title: 'Hapus', onClick: () => {}, needsConfirmation: true, confirmationType: 'danger', confirmationTitle: 'Hapus Treatment', confirmationMessage: (r) => `Hapus treatment ${r.name}?` },
  ];

  return (
    <PageLayout currentPath="/template/treatment/daftar">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-gray-800" style={{ fontSize: 22 }}>Daftar Treatment</h1>
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div />
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm border rounded-md font-medium transition-colors" style={{ borderColor: '#0152EA', color: '#0152EA', borderRadius: '9px' }}>
            Atur Kategori
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-white rounded-md" style={{ backgroundColor: '#0152EA', borderRadius: '9px' }}>
            <Plus size={16} /> Buat Treatment
          </button>
          <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-md px-3 py-2">
            <Search size={15} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari Treatment"
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent" style={{ width: 150 }} />
          </div>
        </div>
      </div>

      <NexTable columns={columns} data={filtered} actions={actions} emptyTitle="Tidak ada treatment" emptyDesc="Belum ada data treatment." />
    </PageLayout>
  );
}
