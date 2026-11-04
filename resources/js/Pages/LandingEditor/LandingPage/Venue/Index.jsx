import { useState } from 'react';
import { router } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../../Components/ui/DataTable';
import BackButton from '../../../../Components/ui/BackButton';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import VenueForm from './VenueForm';

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

export default function VenueIndex({ venues }) {
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  
  const [form, setForm] = useState({ 
    venue_name: '', 
    address: '', 
    date: '', 
    link_map: '', 
    map: '', 
    year: new Date().getFullYear(),
    conference_mode: '',
    onsite_programme: '',
    online_programme: '',
    image_path: null
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [confirmRow, setConfirmRow] = useState(null);
  
  const toast = useToast();

  const handleCreateSubmit = () => {
    let hasError = false;
    const errors = {};
    if (!form.venue_name) { errors.venue_name = 'Venue name is required'; hasError = true; }
    if (!form.address) { errors.address = 'Address is required'; hasError = true; }
    if (!form.date) { errors.date = 'Date is required'; hasError = true; }
    if (!form.link_map) { errors.link_map = 'Map link is required'; hasError = true; }
    if (!form.map) { errors.map = 'Map iframe is required'; hasError = true; }
    if (!form.year) { errors.year = 'Year is required'; hasError = true; }
    if (!form.image_path) { errors.image_path = 'Image is required'; hasError = true; }
    
    if (hasError) {
      setFormErrors(errors);
      return;
    }

    router.post('/landing/venue', form, {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setView('list');
        toast.success('Venue added successfully.');
      },
    });
  };

  const handleEditSubmit = () => {
    if (!selected) return;
    let hasError = false;
    const errors = {};
    if (!form.venue_name) { errors.venue_name = 'Venue name is required'; hasError = true; }
    if (!form.address) { errors.address = 'Address is required'; hasError = true; }
    if (!form.date) { errors.date = 'Date is required'; hasError = true; }
    if (!form.link_map) { errors.link_map = 'Map link is required'; hasError = true; }
    if (!form.map) { errors.map = 'Map iframe is required'; hasError = true; }
    if (!form.year) { errors.year = 'Year is required'; hasError = true; }
    
    if (hasError) {
      setFormErrors(errors);
      return;
    }

    router.post(`/landing/venue/${selected.id}`, {
      _method: 'put',
      ...form
    }, {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setSelected(null);
        setView('list');
        toast.success('Venue updated successfully.');
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmRow) return;
    router.delete(`/landing/venue/${confirmRow.id}`, {
      onSuccess: () => {
        toast.success('Venue deleted successfully.');
        setConfirmRow(null);
      },
      onError: () => toast.error('Failed to delete venue.'),
    });
  };

  if (view === 'create' || view === 'edit') {
    return (
      <LandingEditorPageLayout currentPath="/landing/venue">
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <BackButton onClick={() => {
            setView('list');
            setSelected(null);
          }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
            {view === 'create' ? 'Add Venue' : 'Edit Venue'}
          </h1>
        </div>
        <VenueForm
          view={view}
          form={form}
          setForm={setForm}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          onCancel={() => {
            setView('list');
            setSelected(null);
          }}
          onSubmit={view === 'create' ? handleCreateSubmit : handleEditSubmit}
        />
        <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      </LandingEditorPageLayout>
    );
  }

  return (
    <LandingEditorPageLayout currentPath="/landing/venue">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Venue
      </h1>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
           {/* No year filter for Venue as it only shows active year based on controller */}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setForm({ 
                venue_name: '', 
                address: '', 
                date: '', 
                link_map: '', 
                map: '', 
                year: new Date().getFullYear(),
                conference_mode: '',
                onsite_programme: '',
                online_programme: '',
                image_path: null
              });
              setPreviewUrl('');
              setFormErrors({});
              setView('create');
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Add Venue
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'image', label: 'Image' },
          { key: 'venue_name', label: 'Venue Name' },
          { key: 'date', label: 'Date' },
          { key: 'address', label: 'Address' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-8">
            <p className="font-medium text-gray-500">No venues available for the active year</p>
          </div>
        )}
      >
        {(venues || []).map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={COL_CELL}>
              {item.image_path ? (
                <img 
                  src={`/storage/${item.image_path}`} 
                  alt={item.venue_name}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded text-gray-400">No Image</div>
              )}
            </td>
            <td className={COL_CELL}>{item.venue_name}</td>
            <td className={COL_CELL}>{item.date}</td>
            <td className={COL_CELL}>{item.address}</td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(item);
                    setForm({
                      venue_name: item.venue_name || '',
                      address: item.address || '',
                      date: item.date ? item.date.split('T')[0] : '',
                      link_map: item.link_map || '',
                      map: item.map || '',
                      year: item.year || new Date().getFullYear(),
                      conference_mode: item.conference_mode || '',
                      onsite_programme: item.onsite_programme || '',
                      online_programme: item.online_programme || '',
                      image_path: null // Don't set the file object from existing data
                    });
                    setPreviewUrl(item.image_path ? `/storage/${item.image_path}` : '');
                    setFormErrors({});
                    setView('edit');
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: '#0152EA', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Edit"
                >
                  <IconEdit />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRow(item)}
                  className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: '#EF4444', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Delete"
                >
                  <IconTrash />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <ConfirmDialog
        open={Boolean(confirmRow)}
        title="Confirm Delete"
        message={confirmRow ? `Are you sure you want to delete "${confirmRow.venue_name}"?` : ''}
        cancelText="Cancel"
        confirmText="Confirm"
        onClose={() => setConfirmRow(null)}
        onConfirm={handleConfirmDelete}
      />
    </LandingEditorPageLayout>
  );
}
