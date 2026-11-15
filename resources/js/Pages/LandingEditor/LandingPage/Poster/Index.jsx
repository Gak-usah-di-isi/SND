import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../../Components/ui/DataTable';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import PosterForm from './PosterForm';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';
import { Icon } from '@iconify/react';

export default function PosterIndex() {
  const { posters, years } = usePage().props;
  const toast = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState(null);
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
        row.image ? (
          <img
            src={`/storage/${row.image}`}
            alt="Poster"
            style={{ width: 64, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #E2E8F0' }}
          />
        ) : (
          <div
            aria-label="Poster image unavailable"
            style={{
              width: 64,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              color: '#9CA3AF',
              fontSize: 12,
              textAlign: 'center',
            }}
          >
            No image
          </div>
        )
      ),
      width: '100px',
    },
    {
      label: 'Year',
      cell: (row) => <span style={{ fontFamily: 'Manrope,sans-serif' }}>{row.year}</span>,
      width: '100px',
    },
    {
      label: 'Link',
      cell: (row) => (
        row.link ? (
          <a href={row.link} target="_blank" rel="noreferrer" style={{ fontFamily: 'Manrope,sans-serif', color: '#0152EA', textDecoration: 'none' }}>
            {row.link.substring(0, 50)}{row.link.length > 50 ? '...' : ''}
          </a>
        ) : (
          <span style={{ fontFamily: 'Manrope,sans-serif', color: '#9CA3AF' }}>-</span>
        )
      ),
    },
    {
      label: 'Actions',
      cell: (row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { setSelectedPoster(row); setIsFormOpen(true); }}
            style={{ padding: 8, background: '#EFF6FF', color: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer' }}
          >
            <Icon icon="solar:pen-new-square-outline" width={20} />
          </button>
          <button
            onClick={() => { setSelectedPoster(row); setIsDeleteDialogOpen(true); }}
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
    if (!selectedPoster) return;
    router.delete(`/landing/poster/${selectedPoster.id}`, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success('Poster deleted successfully!');
      },
      onError: () => toast.error('Failed to delete poster.'),
    });
  };

  return (
    <LandingEditorPageLayout currentPath="/landing/poster">
      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2A3D', margin: 0, fontFamily: 'Manrope,sans-serif' }}>
            Poster
          </h1>
          <p style={{ color: '#6B7280', margin: 0, fontFamily: 'Manrope,sans-serif' }}>
            Manage conference posters.
          </p>
        </div>
        <button
          onClick={() => { setSelectedPoster(null); setIsFormOpen(true); }}
          style={{ background: '#0152EA', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}
        >
          <Icon icon="solar:add-circle-outline" width={20} /> Add Data
        </button>
      </div>

      <DataTable columns={columns} colSpan={columns.length}>
        {posters.map((poster) => (
          <tr key={poster.id} className="border-b border-gray-100">
            {columns.map((column, index) => (
              <td key={column.key ?? column.label} className="px-6 py-3">
                {column.cell(poster, index)}
              </td>
            ))}
          </tr>
        ))}
      </DataTable>

      {isFormOpen && (
        <PosterForm
          initialData={selectedPoster}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => { setIsFormOpen(false); toast.success('Saved successfully!'); }}
          toast={toast}
        />
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Poster"
        message={`Are you sure you want to delete the poster for year ${selectedPoster?.year}?`}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </LandingEditorPageLayout>
  );
}
