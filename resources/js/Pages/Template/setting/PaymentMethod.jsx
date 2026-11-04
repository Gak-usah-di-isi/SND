import { useState } from 'react';
import PageLayout from '../../../Components/ui/shared/PageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';

const SAMPLE = [
  { id: '1', category: 'E-Wallet',    service_name: 'GoPay',       description: 'Pembayaran via GoPay',         image_url: null },
  { id: '2', category: 'E-Wallet',    service_name: 'OVO',         description: 'Pembayaran via OVO',           image_url: null },
  { id: '3', category: 'Transfer',    service_name: 'BCA',         description: 'Transfer via BCA',             image_url: null },
  { id: '4', category: 'Transfer',    service_name: 'Mandiri',     description: 'Transfer via Bank Mandiri',    image_url: null },
  { id: '5', category: 'Tunai',       service_name: 'Cash',        description: 'Pembayaran tunai di tempat',   image_url: null },
  { id: '6', category: 'QRIS',        service_name: 'QRIS',        description: 'Scan QRIS untuk pembayaran',   image_url: null },
];

function PaymentLogo({ name }) {
  const colors = { 'GoPay': '#00AED6', 'OVO': '#4C3494', 'BCA': '#0066AE', 'Mandiri': '#003D79', 'Cash': '#10B981', 'QRIS': '#E54856' };
  const bg = colors[name] ?? '#0152EA';
  return (
    <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: bg }}>
      <span className="text-xs font-bold text-white">{name[0]}</span>
    </div>
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

export default function PaymentMethodPage() {
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paged = SAMPLE.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <PageLayout currentPath="/template/pengaturan/payment">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Payment Method
      </h1>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div />
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 text-sm font-medium transition-colors"
            style={{ border: '1px solid #0152EA', color: '#0152EA', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
            Atur Kategori
          </button>

          <button
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Buat Payment Method
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'category',       label: 'Category'       },
          { key: 'logo',           label: 'Logo'           },
          { key: 'payment_method', label: 'Payment Method' },
          { key: 'description',    label: 'Description'    },
          { key: 'aksi',           label: '', align: 'right' },
        ]}
        empty={
          <div className="flex flex-col items-center gap-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
            <p className="font-medium text-gray-500">No payment methods found</p>
            <p className="text-sm text-gray-400">Click the button above to add a payment method.</p>
          </div>
        }
        footer={
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={SAMPLE.length}
            onPageChange={setPage}
            onRowsPerPageChange={n => { setRowsPerPage(n); setPage(0); }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        }
      >
        {paged.map(pm => (
          <tr key={pm.id} className="hover:bg-gray-50 transition-colors">
            <td className={COL_CELL}>{pm.category || '-'}</td>
            <td className={COL_CELL}>
              <PaymentLogo name={pm.service_name} />
            </td>
            <td className={COL_CELL + ' font-medium text-gray-800'}>{pm.service_name}</td>
            <td className={COL_CELL}>{pm.description}</td>
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
