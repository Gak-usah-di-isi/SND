import { useState } from 'react';
import { router } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../../Components/ui/DataTable';
import BackButton from '../../../../Components/ui/BackButton';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import ConferenceObjectiveForm from './ConferenceObjectiveForm';

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

const EMPTY_FORM = {
  year: new Date().getFullYear(),
  icon: 'bi bi-check-circle-fill',
  content: '',
  order_number: 0,
  is_active: true,
};

export default function ConferenceObjectiveIndex({ objectives, years, activeYear, filters }) {
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [filterYear, setFilterYear] = useState(filters?.year || '');
  const [form, setForm] = useState({ ...EMPTY_FORM, year: activeYear ?? new Date().getFullYear() });
  const [formErrors, setFormErrors] = useState({});
  const [confirmRow, setConfirmRow] = useState(null);
  const toast = useToast();

  /* ---------- helpers ---------- */
  const resetForm = (item = null) => {
    if (item) {
      setForm({
        year: item.year,
        icon: item.icon,
        content: item.content,
        order_number: item.order_number,
        is_active: Boolean(item.is_active),
      });
    } else {
      setForm({ ...EMPTY_FORM, year: activeYear ?? new Date().getFullYear() });
    }
    setFormErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!form.year) errs.year = 'Year is required';
    if (!form.icon) errs.icon = 'Icon is required';
    if (!form.content || form.content.trim().length === 0) errs.content = 'Content is required';
    if (form.content && form.content.length > 500) errs.content = 'Max 500 characters';
    return errs;
  };

  /* ---------- CRUD ---------- */
  const handleCreateSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    router.post('/landing/conference-objectives', form, {
      onError: (e) => setFormErrors(e),
      onSuccess: () => { setView('list'); toast.success('Objective added successfully.'); },
    });
  };

  const handleEditSubmit = () => {
    if (!selected) return;
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    router.put(`/landing/conference-objectives/${selected.id}`, form, {
      onError: (e) => setFormErrors(e),
      onSuccess: () => { setSelected(null); setView('list'); toast.success('Objective updated successfully.'); },
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmRow) return;
    router.delete(`/landing/conference-objectives/${confirmRow.id}`, {
      onSuccess: () => { toast.success('Objective deleted successfully.'); setConfirmRow(null); },
      onError: () => toast.error('Failed to delete objective.'),
    });
  };

  /* ---------- filters / pagination ---------- */
  const applyYearFilter = (year) => {
    setFilterYear(year);
    router.get('/landing/conference-objectives', { year }, { preserveState: true, preserveScroll: true });
  };

  const handlePageChange = (nextPage) => {
    router.get('/landing/conference-objectives', { page: nextPage + 1, year: filterYear }, {
      preserveState: true, preserveScroll: true,
    });
  };

  /* ---------- form view ---------- */
  if (view === 'create' || view === 'edit') {
    return (
      <LandingEditorPageLayout currentPath="/landing/conference-objectives">
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <BackButton onClick={() => { setView('list'); setSelected(null); }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
            {view === 'create' ? 'Add Conference Objective' : 'Edit Conference Objective'}
          </h1>
        </div>
        <ConferenceObjectiveForm
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

  /* ---------- list view ---------- */
  const rows = objectives?.data || [];
  const pagination = objectives ? {
    pageIndex: objectives.current_page - 1,
    pageSize: objectives.per_page,
    pageCount: objectives.last_page,
    total: objectives.total,
  } : undefined;

  return (
    <LandingEditorPageLayout currentPath="/landing/conference-objectives">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Conference Objectives
      </h1>

      {/* toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <select
            value={filterYear}
            onChange={e => applyYearFilter(e.target.value)}
            className="border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none"
            style={{ borderRadius: 8, fontFamily: 'Manrope, sans-serif' }}
          >
            <option value="">All Years</option>
            {years && years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <button
          type="button"
          onClick={() => { resetForm(); setView('create'); }}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5v14" />
          </svg>
          Add Objective
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'order', label: '#', align: 'center' },
          { key: 'icon', label: 'Icon', align: 'center' },
          { key: 'content', label: 'Content' },
          { key: 'year', label: 'Year' },
          { key: 'status', label: 'Status', align: 'center' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-8">
            <p className="font-medium text-gray-500">No objectives found</p>
          </div>
        )}
        pagination={pagination}
        onPageChange={handlePageChange}
      >
        {rows.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={`${COL_CELL} text-center font-medium text-gray-400`}>{item.order_number}</td>
            <td className={`${COL_CELL} text-center`}>
              <i className={item.icon} style={{ fontSize: 22, color: '#0152EA' }} title={item.icon} />
            </td>
            <td className={COL_CELL} style={{ maxWidth: 420 }}>
              <span className="line-clamp-2">{item.content}</span>
            </td>
            <td className={COL_CELL}>{item.year}</td>
            <td className={`${COL_CELL} text-center`}>
              <span
                style={{
                  display: 'inline-block', padding: '2px 10px', borderRadius: 20,
                  fontSize: 12, fontWeight: 600, fontFamily: 'Manrope, sans-serif',
                  background: item.is_active ? '#DCFCE7' : '#F1F5F9',
                  color: item.is_active ? '#16A34A' : '#94A3B8',
                }}
              >
                {item.is_active ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => { setSelected(item); resetForm(item); setView('edit'); }}
                  className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
                  style={{ color: '#0152EA', cursor: 'pointer', border: 'none', background: 'transparent' }}
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
                  style={{ color: '#EF4444', cursor: 'pointer', border: 'none', background: 'transparent' }}
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
        title="Delete Objective"
        message={confirmRow ? `Are you sure you want to delete this objective?` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setConfirmRow(null)}
        onConfirm={handleConfirmDelete}
      />
    </LandingEditorPageLayout>
  );
}
