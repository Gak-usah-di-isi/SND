import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../../Components/ui/DataTable';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import AboutForm from './AboutForm';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';
import { Icon } from '@iconify/react';

export default function AboutIndex() {
  const { abouts, years } = usePage().props;
  const toast = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAbout, setSelectedAbout] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const columns = [
    {
      label: 'No',
      cell: (row, i) => <span style={{ fontFamily: 'Manrope,sans-serif' }}>{i + 1}</span>,
      width: '60px',
    },
    {
      label: 'Image',
      cell: (row) => (
        <img
          src={`/storage/${row.image}`}
          alt={row.title}
          style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #E2E8F0' }}
        />
      ),
      width: '100px',
    },
    {
      label: 'Year',
      cell: (row) => <span style={{ fontFamily: 'Manrope,sans-serif' }}>{row.year}</span>,
      width: '100px',
    },
    {
      label: 'Title',
      cell: (row) => <span style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}>{row.title}</span>,
    },
    {
      label: 'Content',
      cell: (row) => <span style={{ fontFamily: 'Manrope,sans-serif', color: '#6B7280' }}>{row.content?.substring(0, 50)}{row.content?.length > 50 ? '...' : ''}</span>,
    },
    {
      label: 'Actions',
      cell: (row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { setSelectedAbout(row); setIsFormOpen(true); }}
            style={{ padding: 8, background: '#EFF6FF', color: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer' }}
          >
            <Icon icon="solar:pen-new-square-outline" width={20} />
          </button>
          <button
            onClick={() => { setSelectedAbout(row); setIsDeleteDialogOpen(true); }}
            style={{ padding: 8, background: '#FEF2F2', color: '#EF4444', borderRadius: 8, border: 'none', cursor: 'pointer' }}
          >
            <Icon icon="solar:trash-bin-trash-outline" width={20} />
          </button>
        </div>
      ),
      width: '100px',
    }
  ];

  const handleDelete = () => {
    if (!selectedAbout) return;
    router.delete(`/landing/abouts/${selectedAbout.id}`, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success('About deleted successfully!');
      },
      onError: () => toast.error('Failed to delete about.'),
    });
  };

  return (
    <LandingEditorPageLayout currentPath="/landing/abouts">
      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2A3D', margin: 0, fontFamily: 'Manrope,sans-serif' }}>
            About
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontFamily: 'Manrope,sans-serif' }}>
            Manage conference About section.
          </p>
        </div>
        <button
          onClick={() => { setSelectedAbout(null); setIsFormOpen(true); }}
          style={{ background: '#0152EA', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}
        >
          <Icon icon="solar:add-circle-outline" width={20} /> Add Data
        </button>
      </div>

      <DataTable columns={columns} colSpan={columns.length}>
        {abouts.map((about) => (
          <tr key={about.id} className="border-b border-gray-100">
            {columns.map((column, index) => (
              <td key={column.key ?? column.label} className="px-6 py-3">
                {column.cell(about, index)}
              </td>
            ))}
          </tr>
        ))}
      </DataTable>

      {isFormOpen && (
        <AboutForm
          initialData={selectedAbout}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => { setIsFormOpen(false); toast.success('Saved successfully!'); }}
          toast={toast}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete About"
        message={`Are you sure you want to delete the about section for year ${selectedAbout?.year}?`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </LandingEditorPageLayout>
  );
}
