import { useState } from 'react';
import { router } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../../Components/ui/DataTable';
import BackButton from '../../../../Components/ui/BackButton';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import HotelForm from './HotelForm';

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

export default function HotelIndex({ hotels }) {
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  
  const [form, setForm] = useState({ 
    name: '', 
    address: '', 
    phone: '', 
    email: '', 
    website: '', 
    description: '',
    rating: '',
    reviews_count: 0,
    stars: 5,
    map_url: '',
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [confirmRow, setConfirmRow] = useState(null);
  
  const toast = useToast();

  const handleCreateSubmit = () => {
    let hasError = false;
    const errors = {};
    if (!form.name) { errors.name = 'Name is required'; hasError = true; }
    if (!form.address) { errors.address = 'Address is required'; hasError = true; }
    if (!form.phone) { errors.phone = 'Phone is required'; hasError = true; }
    
    if (hasError) {
      setFormErrors(errors);
      return;
    }

    router.post('/landing/hotels', form, {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setView('list');
        toast.success('Hotel added successfully.');
      },
    });
  };

  const handleEditSubmit = () => {
    if (!selected) return;
    let hasError = false;
    const errors = {};
    if (!form.name) { errors.name = 'Name is required'; hasError = true; }
    if (!form.address) { errors.address = 'Address is required'; hasError = true; }
    if (!form.phone) { errors.phone = 'Phone is required'; hasError = true; }
    
    if (hasError) {
      setFormErrors(errors);
      return;
    }

    router.post(`/landing/hotels/${selected.id}`, {
      _method: 'put',
      ...form
    }, {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setSelected(null);
        setView('list');
        toast.success('Hotel updated successfully.');
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmRow) return;
    router.delete(`/landing/hotels/${confirmRow.id}`, {
      onSuccess: () => {
        toast.success('Hotel deleted successfully.');
        setConfirmRow(null);
      },
      onError: () => toast.error('Failed to delete hotel.'),
    });
  };

  if (view === 'create' || view === 'edit') {
    return (
      <LandingEditorPageLayout currentPath="/landing/hotels">
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <BackButton onClick={() => {
            setView('list');
            setSelected(null);
          }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
            {view === 'create' ? 'Add Hotel' : 'Edit Hotel'}
          </h1>
        </div>
        <HotelForm
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
    <LandingEditorPageLayout currentPath="/landing/hotels">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Hotel & Accommodations
      </h1>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2"></div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setForm({ 
                name: '', 
                address: '', 
                phone: '', 
                email: '', 
                website: '', 
                description: '',
                rating: '',
                reviews_count: 0,
                stars: 5,
                map_url: '',
                image: null
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
            Add Hotel
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'image', label: 'Image' },
          { key: 'name', label: 'Hotel Name' },
          { key: 'address', label: 'Address' },
          { key: 'phone', label: 'Phone' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-8">
            <p className="font-medium text-gray-500">No hotels available</p>
          </div>
        )}
      >
        {(hotels || []).map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={COL_CELL}>
              {item.image ? (
                <img 
                  src={`/storage/${item.image}`} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded text-gray-400">No Image</div>
              )}
            </td>
            <td className={COL_CELL}>{item.name}</td>
            <td className={COL_CELL}>{item.address}</td>
            <td className={COL_CELL}>{item.phone}</td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(item);
                    setForm({
                      name: item.name || '',
                      address: item.address || '',
                      phone: item.phone || '',
                      email: item.email || '',
                      website: item.website || '',
                      description: item.description || '',
                      rating: item.rating || '',
                      reviews_count: item.reviews_count || 0,
                      stars: item.stars || 5,
                      map_url: item.map_url || '',
                      image: null
                    });
                    setPreviewUrl(item.image ? `/storage/${item.image}` : '');
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

      <ConfirmDialog
        isOpen={Boolean(confirmRow)}
        title="Delete Hotel"
        message={`Are you sure you want to delete ${confirmRow?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmRow(null)}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </LandingEditorPageLayout>
  );
}
