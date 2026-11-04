import { useState } from 'react';
import { router } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../../Components/ui/DataTable';
import BackButton from '../../../../Components/ui/BackButton';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import ContactForm from './ContactForm';

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

export default function ContactIndex({ contacts }) {
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  
  const [form, setForm] = useState({ 
    phone1: '', 
    phone1_name: '', 
    phone2: '', 
    phone2_name: '', 
    email: '', 
    address: '', 
    year: new Date().getFullYear(),
  });
  const [formErrors, setFormErrors] = useState({});
  const [confirmRow, setConfirmRow] = useState(null);
  
  const toast = useToast();

  const handleCreateSubmit = () => {
    let hasError = false;
    const errors = {};
    if (!form.phone1) { errors.phone1 = 'Phone 1 is required'; hasError = true; }
    if (!form.address) { errors.address = 'Address is required'; hasError = true; }
    if (!form.year) { errors.year = 'Year is required'; hasError = true; }
    
    if (hasError) {
      setFormErrors(errors);
      return;
    }

    router.post('/landing/contact', form, {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setView('list');
        toast.success('Contact added successfully!');
      },
    });
  };

  const handleEditSubmit = () => {
    if (!selected) return;
    let hasError = false;
    const errors = {};
    if (!form.phone1) { errors.phone1 = 'Phone 1 is required'; hasError = true; }
    if (!form.address) { errors.address = 'Address is required'; hasError = true; }
    if (!form.year) { errors.year = 'Year is required'; hasError = true; }
    
    if (hasError) {
      setFormErrors(errors);
      return;
    }

    router.put(`/landing/contact/${selected.id}`, form, {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setSelected(null);
        setView('list');
        toast.success('Contact updated successfully!');
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmRow) return;
    router.delete(`/landing/contact/${confirmRow.id}`, {
      onSuccess: () => {
        toast.success('Contact deleted successfully!');
        setConfirmRow(null);
      },
      onError: () => toast.error('Failed to delete contact.'),
    });
  };

  if (view === 'create' || view === 'edit') {
    return (
      <LandingEditorPageLayout currentPath="/landing/contact">
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <BackButton onClick={() => {
            setView('list');
            setSelected(null);
          }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
            {view === 'create' ? 'Add Contact' : 'Edit Contact'}
          </h1>
        </div>
        <ContactForm
          view={view}
          form={form}
          setForm={setForm}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
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
    <LandingEditorPageLayout currentPath="/landing/contact">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Contact
      </h1>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
           {/* Filters can be added here if needed */}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setForm({ 
                phone1: '', 
                phone1_name: '', 
                phone2: '', 
                phone2_name: '', 
                email: '', 
                address: '', 
                year: new Date().getFullYear(),
              });
              setFormErrors({});
              setView('create');
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Add Contact
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'phone1', label: 'Phone 1' },
          { key: 'phone2', label: 'Phone 2' },
          { key: 'email', label: 'Email' },
          { key: 'year', label: 'Year' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-8">
            <p className="font-medium text-gray-500">No contacts available</p>
          </div>
        )}
      >
        {(contacts || []).map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={COL_CELL}>
              <div>{item.phone1}</div>
              <div className="text-xs text-gray-500">{item.phone1_name}</div>
            </td>
            <td className={COL_CELL}>
              <div>{item.phone2 || '-'}</div>
              <div className="text-xs text-gray-500">{item.phone2_name}</div>
            </td>
            <td className={COL_CELL}>{item.email || '-'}</td>
            <td className={COL_CELL}>{item.year}</td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(item);
                    setForm({
                      phone1: item.phone1 || '',
                      phone1_name: item.phone1_name || '',
                      phone2: item.phone2 || '',
                      phone2_name: item.phone2_name || '',
                      email: item.email || '',
                      address: item.address || '',
                      year: item.year || new Date().getFullYear(),
                    });
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
        message={confirmRow ? `Are you sure you want to delete this contact?` : ''}
        cancelText="Cancel"
        confirmText="Confirm"
        onClose={() => setConfirmRow(null)}
        onConfirm={handleConfirmDelete}
      />
    </LandingEditorPageLayout>
  );
}
