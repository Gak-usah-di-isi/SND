import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import LandingEditorPageLayout from '../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import BackButton from '../../../Components/ui/BackButton';
import LogoForm from './LogoForm';

function LogoRow({ logo, index, onDelete, onEdit }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
      <td className="px-4 py-4">
         <img src={`/storage/${logo.image}`} alt={`Logo ${logo.year}`} style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0' }} />
      </td>
      <td className="px-4 py-4">
        <span style={{ fontSize: 13, color: '#374151', fontFamily: 'Manrope,sans-serif' }}>{logo.year}</span>
      </td>
      <td className="px-4 py-4">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
          <button
            type="button"
            onClick={() => onEdit(logo)}
            title="Edit"
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <Icon icon="solar:pen-2-outline" width={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(logo)}
            title="Delete"
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors cursor-pointer"
          >
            <Icon icon="solar:trash-bin-minimalistic-outline" width={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function LogoIndexPage({ logos = [] }) {
  const toast = useToast();
  const [view, setView]               = useState('list');
  const [editLogo, setEditLogo]       = useState(null);
  const [confirmLogo, setConfirmLogo] = useState(null);

  const openEdit = (logo) => { setEditLogo(logo); setView('edit'); };

  const handleDelete = () => {
    if (!confirmLogo) return;
    router.delete(`/landing/logos/${confirmLogo.id}`, {
      onSuccess: () => { toast.success('Logo deleted successfully.'); setConfirmLogo(null); },
      onError:   () => { toast.error('Failed to delete logo.'); setConfirmLogo(null); },
      preserveScroll: true,
    });
  };

  if (view === 'create' || view === 'edit') {
    const isEdit = view === 'edit';
    return (
      <LandingEditorPageLayout currentPath="/landing/logos">
        <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
          <BackButton onClick={() => { setView('list'); setEditLogo(null); }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
            {isEdit ? 'Edit Logo' : 'Add Logo'}
          </h1>
        </div>
        <LogoForm
          mode={isEdit ? 'edit' : 'create'}
          initial={isEdit ? editLogo : null}
          toast={toast}
          onCancel={() => { setView('list'); setEditLogo(null); }}
          onSuccess={() => {
            toast.success(isEdit ? 'Logo updated successfully.' : 'Logo added successfully.');
            setView('list'); setEditLogo(null);
          }}
        />
        <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      </LandingEditorPageLayout>
    );
  }

  return (
    <LandingEditorPageLayout currentPath="/landing/logos">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', margin: 0, fontFamily: 'Manrope,sans-serif' }}>
          Logos
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
          Add Logo
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'image', label: 'Image' },
          { key: 'year',  label: 'Year' },
          { key: 'action', label: '' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-6">
            <Icon icon="solar:gallery-outline" width={48} style={{ color: '#D1D5DB' }} />
            <p style={{ color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>No logos found</p>
          </div>
        )}
      >
        {logos.map((logo, i) => (
          <LogoRow key={logo.id} logo={logo} index={i} onDelete={setConfirmLogo} onEdit={openEdit} />
        ))}
      </DataTable>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <ConfirmDialog
        open={Boolean(confirmLogo)}
        title="Delete Logo"
        message={confirmLogo ? `Delete logo for year ${confirmLogo.year}? This action cannot be undone.` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setConfirmLogo(null)}
        onConfirm={handleDelete}
      />
    </LandingEditorPageLayout>
  );
}
