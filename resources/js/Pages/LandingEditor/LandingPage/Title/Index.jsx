import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../../Components/ui/DataTable';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import TitleForm from './TitleForm';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';
import { Icon } from '@iconify/react';

export default function TitleIndex() {
  const { conferenceTitles, years } = usePage().props;
  const toast = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const columns = [
    {
      label: 'No',
      cell: (row, i) => <span style={{ fontFamily: 'Manrope,sans-serif' }}>{i + 1}</span>,
      width: '60px',
    },
    {
      label: 'Year',
      cell: (row) => <span style={{ fontFamily: 'Manrope,sans-serif' }}>{row.year}</span>,
    },
    {
      label: 'Title',
      cell: (row) => <span style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}>{row.title}</span>,
    },
    {
      label: 'Description',
      cell: (row) => <span style={{ fontFamily: 'Manrope,sans-serif', color: '#6B7280' }}>{row.description?.substring(0, 50)}{row.description?.length > 50 ? '...' : ''}</span>,
    },
    {
      label: 'Actions',
      cell: (row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { setSelectedTitle(row); setIsFormOpen(true); }}
            style={{ padding: 8, background: '#EFF6FF', color: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer' }}
          >
            <Icon icon="solar:pen-new-square-outline" width={20} />
          </button>
          <button
            onClick={() => { setSelectedTitle(row); setIsDeleteDialogOpen(true); }}
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
    if (!selectedTitle) return;
    router.delete(`/landing/conference-title/${selectedTitle.id}`, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success('Title deleted successfully!');
      },
      onError: () => toast.error('Failed to delete title.'),
    });
  };

  return (
    <LandingEditorPageLayout currentPath="/landing/conference-title">
      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2A3D', margin: 0, fontFamily: 'Manrope,sans-serif' }}>
            Conference Title
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontFamily: 'Manrope,sans-serif' }}>
            Manage conference title and description.
          </p>
        </div>
        <button
          onClick={() => { setSelectedTitle(null); setIsFormOpen(true); }}
          style={{ background: '#0152EA', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}
        >
          <Icon icon="solar:add-circle-outline" width={20} /> Add Data
        </button>
      </div>

      <DataTable columns={columns} colSpan={columns.length}>
        {conferenceTitles.map((conferenceTitle) => (
          <tr key={conferenceTitle.id} className="border-b border-gray-100">
            {columns.map((column, index) => (
              <td key={column.key ?? column.label} className="px-6 py-3">
                {column.cell(conferenceTitle, index)}
              </td>
            ))}
          </tr>
        ))}
      </DataTable>

      {isFormOpen && (
        <TitleForm
          initialData={selectedTitle}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => { setIsFormOpen(false); toast.success('Saved successfully!'); }}
          toast={toast}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Title"
        message={`Are you sure you want to delete the title for year ${selectedTitle?.year}?`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </LandingEditorPageLayout>
  );
}
