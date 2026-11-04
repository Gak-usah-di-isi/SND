import { useState } from 'react';
import { router } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import BackButton from '../../../Components/ui/BackButton';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import ThemeForm from './ThemeForm';

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

export default function CallForPaperIndex({ themes, years, filters }) {
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  
  const [filterYear, setFilterYear] = useState(filters?.year || '');
  
  const [form, setForm] = useState({ 
    title: '', 
    description: '',
    year: new Date().getFullYear(),
  });
  const [formErrors, setFormErrors] = useState({});
  const [confirmRow, setConfirmRow] = useState(null);
  
  const toast = useToast();

  const handleCreateSubmit = () => {
    let hasError = false;
    const errors = {};
    if (!form.title) { errors.title = 'Title is required'; hasError = true; }
    if (!form.description) { errors.description = 'Description is required'; hasError = true; }
    if (!form.year) { errors.year = 'Year is required'; hasError = true; }
    
    if (hasError) {
      setFormErrors(errors);
      return;
    }

    router.post('/landing/themes', form, {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setView('list');
        toast.success('Theme added successfully.');
      },
    });
  };

  const handleEditSubmit = () => {
    if (!selected) return;
    let hasError = false;
    const errors = {};
    if (!form.title) { errors.title = 'Title is required'; hasError = true; }
    if (!form.description) { errors.description = 'Description is required'; hasError = true; }
    if (!form.year) { errors.year = 'Year is required'; hasError = true; }
    
    if (hasError) {
      setFormErrors(errors);
      return;
    }

    router.put(`/landing/themes/${selected.id}`, form, {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setSelected(null);
        setView('list');
        toast.success('Theme updated successfully.');
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmRow) return;
    router.delete(`/landing/themes/${confirmRow.id}`, {
      onSuccess: () => {
        toast.success('Theme deleted successfully.');
        setConfirmRow(null);
      },
      onError: () => toast.error('Failed to delete theme.'),
    });
  };

  const applyFilters = (year) => {
    router.get('/landing/themes', { year }, { preserveState: true, preserveScroll: true });
  };
  
  const handleYearFilter = (e) => {
    const val = e.target.value;
    setFilterYear(val);
    applyFilters(val);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 0) return;
    router.get('/landing/themes', { page: nextPage + 1, year: filterYear }, { preserveState: true, preserveScroll: true });
  };

  if (view === 'create' || view === 'edit') {
    return (
      <LandingEditorPageLayout currentPath="/landing/themes">
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <BackButton onClick={() => {
            setView('list');
            setSelected(null);
          }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
            {view === 'create' ? 'Add Call for Paper (Theme)' : 'Edit Theme'}
          </h1>
        </div>
        <ThemeForm
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

  // paginated data
  const rows = themes?.data || [];
  const pagination = themes ? {
    pageIndex: themes.current_page - 1,
    pageSize: themes.per_page,
    pageCount: themes.last_page,
    total: themes.total,
  } : undefined;

  return (
    <LandingEditorPageLayout currentPath="/landing/themes">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Call for Paper (Themes)
      </h1>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
           <select 
              value={filterYear}
              onChange={handleYearFilter}
              className="border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none"
              style={{ borderRadius: 8, fontFamily: 'Manrope, sans-serif' }}
           >
              <option value="">All Years</option>
              {years && years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
           </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setForm({ 
                title: '', 
                description: '',
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
            Add Theme
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'description', label: 'Description' },
          { key: 'year', label: 'Year' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-8">
            <p className="font-medium text-gray-500">No themes available</p>
          </div>
        )}
        pagination={pagination}
        onPageChange={handlePageChange}
      >
        {rows.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={COL_CELL}>{item.title}</td>
            <td className={COL_CELL}>
                <div style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.description}
                </div>
            </td>
            <td className={COL_CELL}>{item.year}</td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(item);
                    setForm({
                      title: item.title || '',
                      description: item.description || '',
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
        message={confirmRow ? `Are you sure you want to delete theme "${confirmRow.title}"?` : ''}
        cancelText="Cancel"
        confirmText="Confirm"
        onClose={() => setConfirmRow(null)}
        onConfirm={handleConfirmDelete}
      />
    </LandingEditorPageLayout>
  );
}
