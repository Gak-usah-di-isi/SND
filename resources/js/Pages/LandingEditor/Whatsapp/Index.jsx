import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { Icon } from '@iconify/react';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import WhatsappForm from './WhatsappForm';

export default function Index() {
  const { whatsapps } = usePage().props;
  const toast = useToast();
  
  const [view, setView] = useState('list');
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openEdit = (item) => { setEditItem(item); setView('edit'); };
  const openCreate = () => { setEditItem(null); setView('create'); };
  
  const handleDelete = () => {
    if (!confirmDelete) return;
    router.delete(`/landing/whatsapp/${confirmDelete.id}`, {
      onSuccess: () => {
        toast.success('WhatsApp number deleted successfully.');
        setConfirmDelete(null);
      },
      preserveScroll: true
    });
  };

  if (view === 'create' || view === 'edit') {
    return (
      <LandingEditorPageLayout currentPath="/landing/whatsapp">
        <WhatsappForm 
          mode={view} 
          initial={editItem}
          toast={toast}
          onCancel={() => { setView('list'); setEditItem(null); }}
          onSuccess={(msg) => {
            toast.success(msg);
            setView('list'); setEditItem(null);
          }}
        />
        <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      </LandingEditorPageLayout>
    );
  }

  return (
    <LandingEditorPageLayout currentPath="/landing/whatsapp">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
          WhatsApp List
        </h1>
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
          Add WhatsApp
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'nomor', label: 'WhatsApp Number' },
          { key: 'year', label: 'Year' },
          { key: 'action', label: 'Actions' }
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-6">
            <Icon icon="solar:phone-calling-rounded-outline" width={48} style={{ color: '#D1D5DB' }} />
            <p style={{ color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>No WhatsApp numbers yet</p>
          </div>
        )}
      >
        {(whatsapps || []).map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-100">
            <td className="px-4 py-4" style={{ fontSize: 13.5, fontWeight: 500, fontFamily: 'Manrope,sans-serif', color: '#1F2A3D' }}>
              {item.nomor}
            </td>
            <td className="px-4 py-4" style={{ fontSize: 13.5, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>
              {item.year}
            </td>
            <td className="px-4 py-4">
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
        title="Delete WhatsApp"
        message={confirmDelete ? `Are you sure you want to delete number ${confirmDelete.nomor}?` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
      />
    </LandingEditorPageLayout>
  );
}
