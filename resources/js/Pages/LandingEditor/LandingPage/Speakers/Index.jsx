import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../../Components/ui/DataTable';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import SpeakerForm from './SpeakerForm';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';
import { Icon } from '@iconify/react';

export default function SpeakersIndex() {
  const { speakers, years } = usePage().props;
  const toast = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
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
          alt={row.name}
          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%', border: '1px solid #E2E8F0' }}
        />
      ),
      width: '80px',
    },
    {
      label: 'Name',
      cell: (row) => <span style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}>{row.name}</span>,
    },
    {
      label: 'Role',
      cell: (row) => <span style={{ fontFamily: 'Manrope,sans-serif' }}>{row.role}</span>,
    },
    {
      label: 'Institution',
      cell: (row) => <span style={{ fontFamily: 'Manrope,sans-serif', color: '#6B7280' }}>{row.institution}</span>,
    },
    {
      label: 'Country',
      cell: (row) => <span style={{ fontFamily: 'Manrope,sans-serif', color: '#6B7280' }}>{row.country}</span>,
    },
    {
      label: 'Year',
      cell: (row) => <span style={{ fontFamily: 'Manrope,sans-serif' }}>{row.year}</span>,
      width: '80px',
    },
    {
      label: 'Actions',
      cell: (row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { setSelectedSpeaker(row); setIsFormOpen(true); }}
            style={{ padding: 8, background: '#EFF6FF', color: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer' }}
          >
            <Icon icon="solar:pen-new-square-outline" width={20} />
          </button>
          <button
            onClick={() => { setSelectedSpeaker(row); setIsDeleteDialogOpen(true); }}
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
    if (!selectedSpeaker) return;
    router.delete(`/landing/speakers/${selectedSpeaker.id}`, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success('Speaker deleted successfully!');
      },
      onError: () => toast.error('Failed to delete speaker.'),
    });
  };

  return (
    <LandingEditorPageLayout currentPath="/landing/speakers">
      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2A3D', margin: 0, fontFamily: 'Manrope,sans-serif' }}>
            Speakers
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontFamily: 'Manrope,sans-serif' }}>
            Manage speakers list.
          </p>
        </div>
        <button
          onClick={() => { setSelectedSpeaker(null); setIsFormOpen(true); }}
          style={{ background: '#0152EA', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}
        >
          <Icon icon="solar:add-circle-outline" width={20} /> Add Data
        </button>
      </div>

      <DataTable columns={columns} colSpan={columns.length}>
        {speakers.map((speaker) => (
          <tr key={speaker.id} className="border-b border-gray-100">
            {columns.map((column, index) => (
              <td key={column.key ?? column.label} className="px-6 py-3">
                {column.cell(speaker, index)}
              </td>
            ))}
          </tr>
        ))}
      </DataTable>

      {isFormOpen && (
        <SpeakerForm
          initialData={selectedSpeaker}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => { setIsFormOpen(false); toast.success('Saved successfully!'); }}
          toast={toast}
        />
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Speaker"
        message={`Are you sure you want to delete ${selectedSpeaker?.name}?`}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </LandingEditorPageLayout>
  );
}
