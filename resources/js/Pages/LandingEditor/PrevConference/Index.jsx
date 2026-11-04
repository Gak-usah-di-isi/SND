import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import PrevConferenceForm from './PrevConferenceForm';
import { Icon } from '@iconify/react';

const pdfUrl = (pdf) => (pdf.startsWith('http') ? pdf : `/storage/${pdf}`);

export default function Index() {
  const { prevconferences } = usePage().props;
  const toast = useToast();

  const [view, setView] = useState('list');
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openCreate = () => { setEditItem(null); setView('create'); };
  const openEdit = (item) => { setEditItem(item); setView('edit'); };
  const backToList = () => { setView('list'); setEditItem(null); };

  const handleDelete = () => {
    if (!confirmDelete) return;
    router.delete(`/landing/prevconference/${confirmDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Previous conference deleted successfully.');
        setConfirmDelete(null);
      },
      onError: () => toast.error('Failed to delete data.'),
    });
  };

  if (view === 'create' || view === 'edit') {
    return (
      <LandingEditorPageLayout currentPath="/landing/prevconference">
        <PrevConferenceForm
          mode={view}
          initial={editItem}
          toast={toast}
          onCancel={backToList}
          onSuccess={(message) => { toast.success(message); backToList(); }}
        />
        <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      </LandingEditorPageLayout>
    );
  }

  return (
    <LandingEditorPageLayout currentPath="/landing/prevconference">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
            Previous Conference
          </h1>
          <p style={{ color: '#6B7280', fontSize: 13.5, fontFamily: 'Manrope,sans-serif', margin: '4px 0 0' }}>
            Manage previous conferences list.
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            height: 36, padding: '0 16px', borderRadius: 8,
            background: '#0152EA', color: '#fff', border: 'none',
            fontSize: 13, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
            display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          }}
        >
          <Icon icon="lucide:plus" width={16} />
          Add Conference
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'no', label: '#' },
          { key: 'image', label: 'Poster' },
          { key: 'title', label: 'Title' },
          { key: 'date', label: 'Date' },
          { key: 'year', label: 'Year' },
          { key: 'pdf', label: 'PDF' },
          { key: 'action', label: 'Actions' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-6">
            <Icon icon="solar:calendar-mark-outline" width={48} style={{ color: '#D1D5DB' }} />
            <p style={{ color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>No previous conference data found</p>
          </div>
        )}
      >
        {(prevconferences || []).map((item, index) => (
          <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-100">
            <td className="px-6 py-4" style={{ fontSize: 13.5, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>
              {index + 1}
            </td>
            <td className="px-6 py-4">
              <img
                src={`/storage/${item.image}`}
                alt={item.title}
                style={{ width: 56, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid #E2E8F0' }}
              />
            </td>
            <td className="px-6 py-4">
              <p style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
                {item.title}
              </p>
              <p style={{ fontSize: 12.5, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: '2px 0 0', maxWidth: 320 }}>
                {item.description}
              </p>
            </td>
            <td className="px-6 py-4" style={{ fontSize: 13.5, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>
              {item.date}
            </td>
            <td className="px-6 py-4" style={{ fontSize: 13.5, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>
              {item.year}
            </td>
            <td className="px-6 py-4">
              {item.pdf ? (
                <a
                  href={pdfUrl(item.pdf)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 13, color: '#0152EA', fontFamily: 'Manrope,sans-serif', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <Icon icon="solar:file-download-outline" width={16} />
                  Download
                </a>
              ) : (
                <span style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>-</span>
              )}
            </td>
            <td className="px-6 py-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  title="Edit"
                  className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  <Icon icon="solar:pen-2-outline" width={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(item)}
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
        open={Boolean(confirmDelete)}
        title="Delete Previous Conference"
        message={confirmDelete ? `Are you sure you want to delete "${confirmDelete.title}"?` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
      />
    </LandingEditorPageLayout>
  );
}
