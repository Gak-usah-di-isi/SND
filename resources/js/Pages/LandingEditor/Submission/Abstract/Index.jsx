import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import LandingEditorPageLayout from '../../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../../Components/ui/DataTable';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';
import BackButton from '../../../../Components/ui/BackButton';
import AbstractGuidelineForm from './AbstractGuidelineForm';

const CURRENT_PATH = '/landing/abstract-guidelines';
const CELL = 'px-6 py-4 text-sm text-gray-700';

function stripHtml(value = '') {
  return String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function AbstractGuidelineIndex({ guidelines = [] }) {
  const toast = useToast();
  const [view, setView] = useState('list');
  const [editItem, setEditItem] = useState(null);
  const [confirmItem, setConfirmItem] = useState(null);

  const handleDelete = () => {
    if (!confirmItem) return;
    router.delete(`${CURRENT_PATH}/${confirmItem.id}`, {
      preserveScroll: true,
      onSuccess: () => { toast.success('Abstract guideline deleted successfully.'); setConfirmItem(null); },
      onError: () => { toast.error('Failed to delete abstract guideline.'); setConfirmItem(null); },
    });
  };

  if (view === 'create' || view === 'edit') {
    const isEdit = view === 'edit';
    return (
      <LandingEditorPageLayout currentPath={CURRENT_PATH}>
        <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
          <BackButton onClick={() => { setView('list'); setEditItem(null); }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
            {isEdit ? 'Edit Abstract Guideline' : 'Add Abstract Guideline'}
          </h1>
        </div>
        <AbstractGuidelineForm
          mode={isEdit ? 'edit' : 'create'}
          initial={isEdit ? editItem : null}
          toast={toast}
          onCancel={() => { setView('list'); setEditItem(null); }}
          onSuccess={() => {
            toast.success(isEdit ? 'Abstract guideline updated successfully.' : 'Abstract guideline added successfully.');
            setView('list'); setEditItem(null);
          }}
        />
        <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      </LandingEditorPageLayout>
    );
  }

  return (
    <LandingEditorPageLayout currentPath={CURRENT_PATH}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', margin: 0, fontFamily: 'Manrope,sans-serif' }}>
          Abstract Guidelines
        </h1>
        <button
          type="button"
          onClick={() => setView('create')}
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

      <DataTable
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'content', label: 'Content' },
          { key: 'pdf_file', label: 'File' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-6">
            <Icon icon="solar:document-text-outline" width={48} style={{ color: '#D1D5DB' }} />
            <p style={{ color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>No abstract guidelines yet</p>
          </div>
        )}
      >
        {guidelines.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={CELL}>{item.year}</td>
            <td className={CELL}>
              <div style={{ maxWidth: 420, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {stripHtml(item.content)}
              </div>
            </td>
            <td className={CELL}>
              {item.pdf_file ? (
                <a
                  href={`/storage/${item.pdf_file}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#0152EA', textDecoration: 'underline' }}
                >
                  View file
                </a>
              ) : (
                <span style={{ color: '#94A3B8' }}>—</span>
              )}
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
        title="Delete Abstract Guideline"
        message={confirmItem ? `Delete abstract guideline for year ${confirmItem.year}? This action cannot be undone.` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setConfirmItem(null)}
        onConfirm={handleDelete}
      />
    </LandingEditorPageLayout>
  );
}
