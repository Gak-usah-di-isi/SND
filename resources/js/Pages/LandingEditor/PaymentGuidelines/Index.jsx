import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import LandingEditorPageLayout from '../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import BackButton from '../../../Components/ui/BackButton';
import PaymentGuidelineForm from './PaymentGuidelineForm';

const CURRENT_PATH = '/landing/payment_guidelines';
const CELL = 'px-6 py-4 text-sm text-gray-700';

function stripHtml(value = '') {
  return String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function PaymentGuidelineIndex({ paymentGuidelines = [], years = [] }) {
  const toast = useToast();
  const [view, setView] = useState('list');
  const [editItem, setEditItem] = useState(null);
  const [confirmItem, setConfirmItem] = useState(null);
  const [yearFilter, setYearFilter] = useState('');

  const backToList = () => { setView('list'); setEditItem(null); };

  const filtered = yearFilter
    ? paymentGuidelines.filter(item => String(item.year) === String(yearFilter))
    : paymentGuidelines;

  const handleDelete = () => {
    if (!confirmItem) return;
    router.delete(`${CURRENT_PATH}/${confirmItem.id}`, {
      preserveScroll: true,
      onSuccess: () => { toast.success('Payment guideline deleted successfully.'); setConfirmItem(null); },
      onError: () => { toast.error('Failed to delete payment guideline.'); setConfirmItem(null); },
    });
  };

  if (view === 'create' || view === 'edit') {
    const isEdit = view === 'edit';
    return (
      <LandingEditorPageLayout currentPath={CURRENT_PATH}>
        <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
          <BackButton onClick={backToList} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
            {isEdit ? 'Edit Payment Guideline' : 'Add Payment Guideline'}
          </h1>
        </div>
        <PaymentGuidelineForm
          mode={isEdit ? 'edit' : 'create'}
          initial={isEdit ? editItem : null}
          toast={toast}
          onCancel={backToList}
          onSuccess={() => {
            toast.success(isEdit ? 'Payment guideline updated successfully.' : 'Payment guideline added successfully.');
            backToList();
          }}
        />
        <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      </LandingEditorPageLayout>
    );
  }

  return (
    <LandingEditorPageLayout currentPath={CURRENT_PATH}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', margin: 0, fontFamily: 'Manrope,sans-serif' }}>
            Payment Guidelines
          </h1>
          <p style={{ color: '#6B7280', fontSize: 13.5, fontFamily: 'Manrope,sans-serif', margin: '4px 0 0' }}>
            Manage payment guidelines per bank and year.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setEditItem(null); setView('create'); }}
          style={{
            height: 36, padding: '0 16px', borderRadius: 8,
            background: '#0152EA', color: '#fff', border: 'none',
            fontSize: 13, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
            display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          }}
        >
          <Icon icon="lucide:plus" width={16} />
          Add Guideline
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <label
          htmlFor="year-filter"
          style={{ fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}
        >
          Filter Year
        </label>
        <select
          id="year-filter"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          style={{
            height: 36, padding: '0 12px', borderRadius: 8,
            border: '1px solid #E2E8F0', background: '#fff',
            fontFamily: 'Manrope,sans-serif', fontSize: 13, color: '#1E293B',
            outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={[
          { key: 'bank_name', label: 'Bank Name' },
          { key: 'year', label: 'Year' },
          { key: 'guideline', label: 'Guideline' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-6">
            <Icon icon="solar:wallet-money-outline" width={48} style={{ color: '#D1D5DB' }} />
            <p style={{ color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>
              {yearFilter ? `No payment guidelines for year ${yearFilter}` : 'No payment guidelines found'}
            </p>
          </div>
        )}
      >
        {filtered.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={CELL} style={{ fontWeight: 600, color: '#1F2A3D' }}>{item.bank_name}</td>
            <td className={CELL}>{item.year}</td>
            <td className={CELL}>
              <div style={{ maxWidth: 420, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {stripHtml(item.guideline)}
              </div>
            </td>
            <td className="px-6 py-4">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                <button
                  type="button"
                  onClick={() => { setEditItem(item); setView('edit'); }}
                  title="Edit"
                  className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  <Icon icon="solar:pen-2-outline" width={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmItem(item)}
                  title="Delete"
                  className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Icon icon="solar:trash-bin-minimalistic-outline" width={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <ConfirmDialog
        open={Boolean(confirmItem)}
        title="Delete Payment Guideline"
        message={confirmItem ? `Delete guideline ${confirmItem.bank_name} for year ${confirmItem.year}? This action cannot be undone.` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setConfirmItem(null)}
        onConfirm={handleDelete}
      />
    </LandingEditorPageLayout>
  );
}
