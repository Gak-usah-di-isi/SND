import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import LandingEditorPageLayout from '../../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../../Components/ui/DataTable';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';
import BackButton from '../../../../Components/ui/BackButton';
import DetailForm from './DetailForm';

const CURRENT_PATH = '/landing/conference-detail';
const CELL = 'px-6 py-4 text-sm text-gray-700';

const emptyForm = () => ({
  title: '',
  theme: '',
  university: '',
  hosted: '',
  date: '',
  year: new Date().getFullYear(),
});

export default function ConferenceDetailIndex({ conferences = [] }) {
  const toast = useToast();
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [formErrors, setFormErrors] = useState({});
  const [confirmRow, setConfirmRow] = useState(null);

  const validate = () => {
    const errors = {};
    if (!form.title) errors.title = 'Title is required';
    if (!form.theme) errors.theme = 'Theme is required';
    if (!form.university) errors.university = 'University is required';
    if (!form.hosted) errors.hosted = 'Hosted is required';
    if (!form.date) errors.date = 'Date is required';
    if (!form.year) errors.year = 'Year is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = () => {
    if (!validate()) return;
    router.post(CURRENT_PATH, form, {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setView('list');
        toast.success('Conference detail added successfully.');
      },
    });
  };

  const handleEditSubmit = () => {
    if (!selected || !validate()) return;
    router.put(`${CURRENT_PATH}/${selected.id}`, form, {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setSelected(null);
        setView('list');
        toast.success('Conference detail updated successfully.');
      },
    });
  };

  const handleDelete = () => {
    if (!confirmRow) return;
    router.delete(`${CURRENT_PATH}/${confirmRow.id}`, {
      preserveScroll: true,
      onSuccess: () => { toast.success('Conference detail deleted successfully.'); setConfirmRow(null); },
      onError: () => { toast.error('Failed to delete conference detail.'); setConfirmRow(null); },
    });
  };

  const openEdit = (item) => {
    setSelected(item);
    setForm({
      title: item.title ?? '',
      theme: item.theme ?? '',
      university: item.university ?? '',
      hosted: item.hosted ?? '',
      date: item.date ?? '',
      year: item.year ?? new Date().getFullYear(),
    });
    setFormErrors({});
    setView('edit');
  };

  if (view === 'create' || view === 'edit') {
    return (
      <LandingEditorPageLayout currentPath={CURRENT_PATH}>
        <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
          <BackButton onClick={() => { setView('list'); setSelected(null); }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
            {view === 'create' ? 'Add Conference Detail' : 'Edit Conference Detail'}
          </h1>
        </div>
        <DetailForm
          form={form}
          setForm={setForm}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          onCancel={() => { setView('list'); setSelected(null); }}
          onSubmit={view === 'create' ? handleCreateSubmit : handleEditSubmit}
        />
        <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      </LandingEditorPageLayout>
    );
  }

  return (
    <LandingEditorPageLayout currentPath={CURRENT_PATH}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', margin: 0, fontFamily: 'Manrope,sans-serif' }}>
          Conference Detail
        </h1>
        <button
          type="button"
          onClick={() => {
            setForm(emptyForm());
            setFormErrors({});
            setView('create');
          }}
          style={{
            height: 36, padding: '0 16px', borderRadius: 8,
            background: '#0152EA', color: '#fff', border: 'none',
            fontSize: 13, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
            display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          }}
        >
          <Icon icon="lucide:plus" width={16} />
          Add Detail
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'theme', label: 'Theme' },
          { key: 'university', label: 'University' },
          { key: 'date', label: 'Date' },
          { key: 'year', label: 'Year' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-6">
            <Icon icon="solar:info-circle-outline" width={48} style={{ color: '#D1D5DB' }} />
            <p style={{ color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>No conference details found</p>
          </div>
        )}
      >
        {conferences.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={CELL}>
              <div style={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.title}
              </div>
            </td>
            <td className={CELL}>
              <div style={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.theme}
              </div>
            </td>
            <td className={CELL}>
              <div style={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.university}
              </div>
            </td>
            <td className={CELL}>{item.date}</td>
            <td className={CELL}>{item.year}</td>
            <td className="px-6 py-4">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
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
                  onClick={() => setConfirmRow(item)}
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
        open={Boolean(confirmRow)}
        title="Delete Conference Detail"
        message={confirmRow ? `Delete conference detail "${confirmRow.title}"? This action cannot be undone.` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setConfirmRow(null)}
        onConfirm={handleDelete}
      />
    </LandingEditorPageLayout>
  );
}
