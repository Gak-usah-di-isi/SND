import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import LandingEditorPageLayout from '../../../../Components/ui/shared/LandingEditorPageLayout';
import { DataTable } from '../../../../Components/ui/DataTable';
import BackButton from '../../../../Components/ui/BackButton';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import PublicationsJournalForm from './PublicationsJournalForm';

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

export default function PublicationsJournalIndex({ publications_journals, years, imageTypes, filters, publicationSetting, activeYear }) {
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  
  const [filterYear, setFilterYear] = useState(filters?.year || activeYear || '');
  const [filterType, setFilterType] = useState(filters?.image_type || '');
  
  const [form, setForm] = useState({ 
    image_type: '', 
    year: new Date().getFullYear(),
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  
  const [formErrors, setFormErrors] = useState({});
  const [confirmRow, setConfirmRow] = useState(null);

  // Settings State untuk Textarea & Toggle Status Jurnal
  const [settingsForm, setSettingsForm] = useState({
    year: filterYear || activeYear || new Date().getFullYear(),
    proceedings_text: publicationSetting?.proceedings_text ?? '',
    journal_title: publicationSetting?.journal_title ?? 'Journal Publication Opportunity',
    journal_text: publicationSetting?.journal_text ?? '',
    is_journal_active: Boolean(publicationSetting?.is_journal_active ?? true),
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  const toast = useToast();

  useEffect(() => {
    if (publicationSetting) {
      setSettingsForm({
        year: filterYear || activeYear || new Date().getFullYear(),
        proceedings_text: publicationSetting.proceedings_text ?? '',
        journal_title: publicationSetting.journal_title ?? 'Journal Publication Opportunity',
        journal_text: publicationSetting.journal_text ?? '',
        is_journal_active: Boolean(publicationSetting.is_journal_active ?? true),
      });
    }
  }, [publicationSetting, filterYear, activeYear]);

  const handleCreateSubmit = () => {
    let hasError = false;
    const errors = {};
    if (!form.image_type) { errors.image_type = 'Image type is required'; hasError = true; }
    if (!form.year) { errors.year = 'Year is required'; hasError = true; }
    if (imageFiles.length === 0) { errors.image_path = 'At least one image is required'; hasError = true; }
    
    if (hasError) {
      setFormErrors(errors);
      return;
    }

    const submitData = {
      ...form,
      image_path: imageFiles
    };

    router.post('/landing/publications-journal', submitData, {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setView('list');
        toast.success('Publications created successfully.');
      },
    });
  };

  const handleEditSubmit = () => {
    if (!selected) return;
    let hasError = false;
    const errors = {};
    if (!form.image_type) { errors.image_type = 'Image type is required'; hasError = true; }
    if (!form.year) { errors.year = 'Year is required'; hasError = true; }
    
    if (hasError) {
      setFormErrors(errors);
      return;
    }

    const submitData = {
      _method: 'put',
      ...form,
    };
    
    if (imageFiles.length > 0) {
      submitData.image_path = imageFiles[0];
    }

    router.post(`/landing/publications-journal/${selected.id}`, submitData, {
      onError: (errs) => setFormErrors(errs),
      onSuccess: () => {
        setSelected(null);
        setView('list');
        toast.success('Publication updated successfully.');
      },
    });
  };

  const handleSaveSettings = (e) => {
    e?.preventDefault();
    setIsSavingSettings(true);
    router.post('/landing/publications-journal/settings', {
      ...settingsForm,
      year: filterYear || activeYear || new Date().getFullYear(),
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSavingSettings(false);
        toast.success('Publication text settings & journal status saved successfully!');
      },
      onError: () => {
        setIsSavingSettings(false);
        toast.error('Failed to save settings.');
      },
      onFinish: () => {
        setIsSavingSettings(false);
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmRow) return;
    router.delete(`/landing/publications-journal/${confirmRow.id}`, {
      onSuccess: () => {
        toast.success('Publication deleted successfully.');
        setConfirmRow(null);
      },
      onError: () => toast.error('Failed to delete publication.'),
    });
  };

  const applyFilters = (year, type) => {
    router.get('/landing/publications-journal', { year, image_type: type }, { preserveState: true, preserveScroll: true });
  };
  
  const handleYearFilter = (e) => {
    const val = e.target.value;
    setFilterYear(val);
    applyFilters(val, filterType);
  };

  const handleTypeFilter = (e) => {
    const val = e.target.value;
    setFilterType(val);
    applyFilters(filterYear, val);
  };
  
  const handlePageChange = (nextPage) => {
    if (nextPage < 0) return;
    router.get('/landing/publications-journal', { page: nextPage + 1, year: filterYear, image_type: filterType }, { preserveState: true, preserveScroll: true });
  };

  if (view === 'create' || view === 'edit') {
    return (
      <LandingEditorPageLayout currentPath="/landing/publications-journal">
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <BackButton onClick={() => {
            setView('list');
            setSelected(null);
          }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
            {view === 'create' ? 'Add Publications' : 'Edit Publication'}
          </h1>
        </div>
        <PublicationsJournalForm
          view={view}
          form={form}
          setForm={setForm}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          previewUrls={previewUrls}
          setPreviewUrls={setPreviewUrls}
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
  const rows = publications_journals?.data || [];
  const pagination = publications_journals ? {
    pageIndex: publications_journals.current_page - 1,
    pageSize: publications_journals.per_page,
    pageCount: publications_journals.last_page,
    total: publications_journals.total,
  } : undefined;

  return (
    <LandingEditorPageLayout currentPath="/landing/publications-journal">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
          Publications & Journal
        </h1>
        <p style={{ color: '#6B7280', fontFamily: 'Manrope, sans-serif', marginTop: 6, fontSize: 14 }}>
          Manage conference proceedings descriptions, journal publication opportunities, journal active status, and partner journal logos.
        </p>
      </div>

      {/* ============================================================== */}
      {/* CARD 1: Pengaturan Teks Publikasi & Toggle Aktif / Non-Aktif   */}
      {/* ============================================================== */}
      <div
        className="bg-white p-6 mb-8 border border-gray-100 shadow-sm"
        style={{ borderRadius: 14, fontFamily: 'Manrope, sans-serif' }}
      >
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(1, 82, 234, 0.08)', color: '#0152EA' }}
            >
              <Icon icon="solar:document-text-outline" width={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 m-0">Publication Text Settings (Year {filterYear || activeYear})</h2>
              <p className="text-xs text-gray-500 m-0 mt-0.5">
                This text will be displayed directly in the Publications section on the ICASVE landing page.
              </p>
            </div>
          </div>

          {/* Toggle Switch Aktif / Non-aktif Journal Publication */}
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
            <span className="text-xs font-semibold text-gray-700">Journal Publication:</span>
            <button
              type="button"
              onClick={() => setSettingsForm(prev => ({ ...prev, is_journal_active: !prev.is_journal_active }))}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settingsForm.is_journal_active ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settingsForm.is_journal_active ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                settingsForm.is_journal_active
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {settingsForm.is_journal_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-5">
          {/* Section 1: Proceedings Textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              1. Conference Proceedings Description
            </label>
            <textarea
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="All accepted and presented papers that meet the publication requirements will be published in the ICASVE 2026 Conference Proceedings with an ISSN."
              value={settingsForm.proceedings_text}
              onChange={(e) => setSettingsForm(prev => ({ ...prev, proceedings_text: e.target.value }))}
            />
            <p className="text-xs text-gray-400 mt-1">
              Conference proceedings publication info displayed at the top of the Publications section.
            </p>
          </div>

          {/* Section 2: Journal Publication Opportunity */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              settingsForm.is_journal_active
                ? 'bg-blue-50/40 border-blue-200'
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-800">
                2. Journal Publication Opportunity
              </label>
              {!settingsForm.is_journal_active && (
                <span className="text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  ⚠️ Journal section is currently disabled (hidden from landing page)
                </span>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Journal Sub-section Title</label>
              <input
                type="text"
                className="w-full px-3.5 py-2 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Journal Publication Opportunity"
                value={settingsForm.journal_title}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, journal_title: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Journal Description Text</label>
              <textarea
                rows={4}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="In collaboration with the Asian Journal of Accounting Research (AJAR), a Scopus-indexed Q2 journal published by Emerald Publishing..."
                value={settingsForm.journal_text}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, journal_text: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Describe affiliated journal partners (such as AJAR / Emerald Publishing) and publication terms.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-5 py-2.5 text-sm font-semibold text-white transition-opacity flex items-center gap-2"
              style={{
                backgroundColor: '#0152EA',
                borderRadius: 8,
                border: 'none',
                cursor: isSavingSettings ? 'not-allowed' : 'pointer',
                opacity: isSavingSettings ? 0.7 : 1,
              }}
            >
              {isSavingSettings ? (
                <>
                  <Icon icon="solar:spinner-line-duotone" className="animate-spin" width={16} />
                  Saving...
                </>
              ) : (
                <>
                  <Icon icon="solar:check-circle-outline" width={16} />
                  Save Publication Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ============================================================== */}
      {/* CARD 2: Logo Mitra Jurnal & Dokumen Pendukung                  */}
      {/* ============================================================== */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900 m-0" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Publication & Partner Logos
          </h2>
          <p className="text-xs text-gray-500 m-0 mt-0.5">
            Logos of affiliated journals, hosted by, and supporting sponsors.
          </p>
        </div>

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
           
           <select 
              value={filterType}
              onChange={handleTypeFilter}
              className="border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none"
              style={{ borderRadius: 8, fontFamily: 'Manrope, sans-serif' }}
           >
              <option value="">All Types</option>
              {imageTypes && imageTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
           </select>

          <button
            type="button"
            onClick={() => {
              setForm({ 
                image_type: '', 
                year: filterYear || new Date().getFullYear(),
              });
              setImageFiles([]);
              setPreviewUrls([]);
              setFormErrors({});
              setView('create');
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white ml-1"
            style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5v14" />
            </svg>
            Add Logo / Image
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'image', label: 'Image' },
          { key: 'image_type', label: 'Type' },
          { key: 'year', label: 'Year' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-8">
            <p className="font-medium text-gray-500">No publications available</p>
          </div>
        )}
        pagination={pagination}
        onPageChange={handlePageChange}
      >
        {rows.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className={COL_CELL}>
              {item.image_path ? (
                <img 
                  src={`/storage/${item.image_path}`} 
                  alt={item.image_type}
                  className="w-16 h-16 object-contain rounded bg-white border"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded text-gray-400">No Image</div>
              )}
            </td>
            <td className={COL_CELL}>
              <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-700 capitalize">
                {item.image_type?.replace(/_/g, ' ')}
              </span>
            </td>
            <td className={COL_CELL}>{item.year}</td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelected(item);
                    setForm({
                      image_type: item.image_type || '',
                      year: item.year || new Date().getFullYear(),
                    });
                    setImageFiles([]);
                    setPreviewUrls(item.image_path ? [`/storage/${item.image_path}`] : []);
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
        message={confirmRow ? `Are you sure you want to delete this publication?` : ''}
        cancelText="Cancel"
        confirmText="Confirm"
        onClose={() => setConfirmRow(null)}
        onConfirm={handleConfirmDelete}
      />
    </LandingEditorPageLayout>
  );
}
