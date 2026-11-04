import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { Icon } from '@iconify/react';
import AdminPageLayout from "../../../Components/ui/shared/AdminPageLayout.jsx";
import { FilterPopover } from '../../../Components/ui/FilterPopover';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import StatusBadge from '../../../Components/ui/StatusBadge';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import BackButton from '../../../Components/ui/BackButton';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import FormActions from '../../../Components/ui/FormActions';

/* ---------- Constants ---------- */
const PRESENTATION_OPTIONS = [
  { value: 'Oral presentation', label: 'Oral Presentation' },
  { value: 'Poster presentation', label: 'Poster Presentation' },
];
const PUBLICATION_OPTIONS = [
  { value: 'Journal Publication', label: 'Journal Publication' },
  { value: 'International Indexed Proceedings', label: 'International Indexed Proceedings' },
];
const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'revision', label: 'Revision' },
  { value: 'rejected', label: 'Rejected' },
];
const SECTION_TITLE = { fontSize: 16, fontWeight: 600, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' };
const GRID_2 = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 };

/* ---------- Stat Card ---------- */
function StatCard({ label, value, description }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 8,
      boxShadow: '0px 4px 12px rgba(0,0,0,0.04)',
      padding: '16px 16px 24px 16px',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12,
      fontFamily: 'Manrope,sans-serif',
    }}>
      <span style={{ fontWeight: 700, fontSize: 18, color: 'rgba(42,53,71,0.8)' }}>{label}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 24, color: '#0152EA' }}>{value}</div>
        {description && (
          <div style={{ fontWeight: 700, fontSize: 12, marginTop: 4, color: '#0152EA', opacity: 0.4 }}>{description}</div>
        )}
      </div>
    </div>
  );
}

/* ---------- Avatar Initial ---------- */
function EmailBadge({ email }) {
  const initial = (email ?? '').split('@')[0].slice(0, 2).toUpperCase();
  return (
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0152EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'Manrope,sans-serif' }}>{initial}</span>
    </div>
  );
}

/* ---------- Expandable Row ---------- */
function AbstractRow({ item, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const titleWords = (item.title ?? '').split(' ');
  const shortTitle = titleWords.slice(0, 8).join(' ') + (titleWords.length > 8 ? '...' : '');

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
        <td className="px-3 py-4 w-10">
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E2E8F0', background: open ? '#F0F5FF' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: open ? '#0152EA' : '#6B7280', transition: 'all 150ms' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </td>
        <td className="px-4 py-4" style={{ maxWidth: 320 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', lineHeight: 1.4 }} title={item.title}>
            {shortTitle}
          </span>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2.5">
            <EmailBadge email={item.corresponding_email} />
            <div className="flex flex-col">
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                {(item.corresponding_email ?? '').split('@')[0]}
              </span>
              <span style={{ fontSize: 11.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>
                {item.corresponding_email}
              </span>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <span style={{ fontSize: 12.5, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>
            {item.presentation_type ?? '-'}
          </span>
        </td>
        <td className="px-4 py-4">
          <StatusBadge label={item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'} />
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center justify-end gap-1">
            <a
              href={`/admin/abstracts-participant/${item.id}?from=abstract`}
              title="View Abstract"
              className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
              style={{ color: '#0152EA', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1, 82, 234, 0.08)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Icon icon="solar:document-text-outline" width={16} />
            </a>
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
              style={{ color: '#0152EA', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Edit"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
                <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
              style={{ color: '#EF4444', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Delete"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
              </svg>
            </button>
          </div>
        </td>
      </tr>

      {open && (
        <tr style={{ background: '#F8FAFC' }}>
          <td />
          <td colSpan={5} className="px-4 pb-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2" style={{ fontSize: 13, fontFamily: 'Manrope,sans-serif' }}>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Full Title</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.title}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Symposium</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.symposium?.name ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Authors</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.authors ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Publication</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.publication ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Affiliations</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.affiliations ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Full Paper</span>
                {item.full_paper ? (
                  <div className="flex gap-3 mt-2">
                    {item.full_paper.file_path && (
                      <a href={`/storage/${item.full_paper.file_path}`} target="_blank" rel="noreferrer"
                        className="flex flex-col items-center gap-1" style={{ color: '#0152EA', textDecoration: 'none' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                        </svg>
                        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>Download</span>
                      </a>
                    )}
                    {item.full_paper.revised_file_path && (
                      <a href={`/storage/${item.full_paper.revised_file_path}`} target="_blank" rel="noreferrer"
                        className="flex flex-col items-center gap-1" style={{ color: '#D97706', textDecoration: 'none' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/><path d="M12 18v-6M9 15l3 3 3-3"/>
                        </svg>
                        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>Revised</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <p style={{ color: '#9CA3AF', marginTop: 4, fontSize: 13 }}>Not Submitted</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ---------- Main Page ---------- */
export default function AbstractIndexPage({
  abstracts,
  symposiums = [],
  presentationTypes = [],
  enablePublicationSelection = true,
  oralTotal = 0, oralPaid = 0,
  posterTotal = 0, posterPaid = 0,
  openTotal = 0, revisionTotal = 0,
  search: initialSearch = '',
  filters = {},
}) {
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    title: '', symposium_id: '', presentation_type: '',
    publication: '', status: '', authors: '',
    affiliations: '', corresponding_email: '', keyword: '', abstract: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const [search, setSearch] = useState(initialSearch);
  const [filterVals, setFilterVals] = useState({
    status: filters.status ?? '',
    presentation_type: filters.presentation_type ?? '',
  });
  const [appliedVals, setAppliedVals] = useState({
    status: filters.status ?? '',
    presentation_type: filters.presentation_type ?? '',
  });
  const [confirmRow, setConfirmRow] = useState(null);
  const toast = useToast();

  const symposiumOptions = symposiums.map(s => ({ value: String(s.id), label: s.name }));
  const presentationTypeOptions = useMemo(() => {
    if (presentationTypes && presentationTypes.length > 0) {
      return presentationTypes.map(pt => ({ value: pt.name, label: pt.name }));
    }
    return PRESENTATION_OPTIONS;
  }, [presentationTypes]);

  const rows = abstracts?.data ?? [];
  const page = Math.max((abstracts?.current_page ?? 1) - 1, 0);
  const rowsPerPage = abstracts?.per_page ?? 10;

  const navigate = (params) => {
    router.get('/admin/abstract', params, { preserveScroll: true, preserveState: true });
  };

  const handleSearch = (val) => {
    setSearch(val);
    navigate({ search: val, status: appliedVals.status, presentation_type: appliedVals.presentation_type, page: 1 });
  };

  const handleApply = () => {
    setAppliedVals({ ...filterVals });
    navigate({ search, status: filterVals.status, presentation_type: filterVals.presentation_type, page: 1 });
  };

  const handleClear = () => {
    const empty = { status: '', presentation_type: '' };
    setFilterVals(empty);
    setAppliedVals(empty);
    navigate({ search, page: 1 });
  };

  const handlePageChange = (nextPage) => {
    navigate({ search, status: appliedVals.status, presentation_type: appliedVals.presentation_type, page: nextPage + 1, per_page: rowsPerPage });
  };

  const handleRowsChange = (nextRows) => {
    navigate({ search, status: appliedVals.status, presentation_type: appliedVals.presentation_type, page: 1, per_page: nextRows });
  };

  const handleEdit = (item) => {
    setSelected(item);
    setForm({
      title:               item.title ?? '',
      symposium_id:        item.symposium_id ? String(item.symposium_id) : '',
      presentation_type:   item.presentation_type ?? '',
      publication:         item.publication ?? '',
      status:              item.status ?? '',
      authors:             item.authors ?? '',
      affiliations:        item.affiliations ?? '',
      corresponding_email: item.corresponding_email ?? '',
      keyword:             item.keyword ?? '',
      abstract:            item.abstract ?? '',
    });
    setFormErrors({});
    setView('edit');
  };

  const handleCancelEdit = () => {
    setSelected(null);
    setForm({ title: '', symposium_id: '', presentation_type: '', publication: '', status: '', authors: '', affiliations: '', corresponding_email: '', keyword: '', abstract: '' });
    setFormErrors({});
    setView('list');
  };

  const validate = () => {
    const errs = {};
    const required = ['title', 'symposium_id', 'presentation_type', 'authors', 'affiliations', 'corresponding_email', 'abstract'];
    if (enablePublicationSelection) {
      required.push('publication');
    }
    required.forEach(k => { if (!form[k]?.trim()) errs[k] = 'Required'; });
    if (form.corresponding_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.corresponding_email)) {
      errs.corresponding_email = 'Invalid email format';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEditSubmit = () => {
    if (!validate()) return;
    router.put(`/admin/abstract/${selected.id}`, {
      ...form,
      symposium_id: Number(form.symposium_id),
    }, {
      onSuccess: () => {
        toast.success('Abstract updated successfully.');
        handleCancelEdit();
      },
      onError: (errs) => {
        setFormErrors(errs);
        toast.error('Failed to save. Please check the form.');
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmRow) return;
    router.delete(`/admin/abstract/${confirmRow.id}`, {
      onSuccess: () => { toast.success('Abstract deleted successfully.'); setConfirmRow(null); },
      onError: () => { toast.error('Failed to delete abstract.'); setConfirmRow(null); },
    });
  };

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));
  const setInput = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  /* ---------- Edit View ---------- */
  if (view === 'edit') {
    return (
      <AdminPageLayout currentPath="/admin/abstract">
        <div className="flex items-center gap-3 mb-6">
          <BackButton onClick={handleCancelEdit} />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
            Edit Abstract
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Card 1 — Main Information */}
          <Card>
            <p style={SECTION_TITLE}>Main Information</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <FloatInput
                id="title"
                label="Title *"
                placeholder="Enter abstract title"
                value={form.title}
                onChange={setInput('title')}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
              <div style={GRID_2}>
                <FloatSelect
                  id="symposium_id"
                  label="Symposium *"
                  options={symposiumOptions}
                  value={form.symposium_id}
                  onChange={set('symposium_id')}
                  error={!!formErrors.symposium_id}
                  helperText={formErrors.symposium_id}
                />
                <FloatSelect
                  id="presentation_type"
                  label="Presentation Type *"
                  options={presentationTypeOptions}
                  value={form.presentation_type}
                  onChange={set('presentation_type')}
                  error={!!formErrors.presentation_type}
                  helperText={formErrors.presentation_type}
                />
                {enablePublicationSelection && (
                  <FloatSelect
                    id="publication"
                    label="Publication *"
                    options={PUBLICATION_OPTIONS}
                    value={form.publication}
                    onChange={set('publication')}
                    error={!!formErrors.publication}
                    helperText={formErrors.publication}
                  />
                )}
                <FloatSelect
                  id="status"
                  label="Status"
                  options={STATUS_OPTIONS}
                  value={form.status}
                  onChange={set('status')}
                />
              </div>
            </div>
          </Card>

          {/* Card 2 — Authors */}
          <Card>
            <p style={SECTION_TITLE}>Authors</p>
            <div style={GRID_2}>
              <FloatInput
                id="authors"
                label="Authors *"
                placeholder="Example: John Doe[1], Jane Smith[2]"
                value={form.authors}
                onChange={setInput('authors')}
                error={!!formErrors.authors}
                helperText={formErrors.authors}
              />
              <FloatInput
                id="corresponding_email"
                label="Corresponding Email *"
                placeholder="email@example.com"
                type="email"
                value={form.corresponding_email}
                onChange={setInput('corresponding_email')}
                error={!!formErrors.corresponding_email}
                helperText={formErrors.corresponding_email}
              />
            </div>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <FloatInput
                id="affiliations"
                label="Affiliations *"
                placeholder="Example: [1] University X, [2] Institute Y"
                value={form.affiliations}
                onChange={setInput('affiliations')}
                multiline
                rows={3}
                error={!!formErrors.affiliations}
                helperText={formErrors.affiliations}
              />
              <FloatInput
                id="keyword"
                label="Keywords"
                placeholder="Separate with commas"
                value={form.keyword}
                onChange={setInput('keyword')}
              />
            </div>
          </Card>

          {/* Card 3 — Abstract Content */}
          <Card>
            <p style={SECTION_TITLE}>Abstract Content</p>
            <FloatInput
              id="abstract"
              label="Abstract *"
              placeholder="Write abstract content here..."
              value={form.abstract}
              onChange={setInput('abstract')}
              multiline
              rows={10}
              error={!!formErrors.abstract}
              helperText={formErrors.abstract}
            />
          </Card>

          <FormActions
            id="abstract-edit-form"
            onCancel={handleCancelEdit}
            onSubmit={handleEditSubmit}
            cancelText="Cancel"
            submitText="Save"
          />
        </div>

        <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      </AdminPageLayout>
    );
  }

  /* ---------- List View ---------- */
  return (
    <AdminPageLayout currentPath="/admin/abstract">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope,sans-serif' }}>
        Abstract
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Accepted for Oral" value={oralTotal} description={`${oralPaid} paid | ${oralTotal - oralPaid} unpaid`} />
        <StatCard label="Accepted for Poster" value={posterTotal} description={`${posterPaid} paid | ${posterTotal - posterPaid} unpaid`} />
        <StatCard label="Open" value={openTotal} description="Awaiting reviewer decision" />
        <StatCard label="Revision" value={revisionTotal} description="Needs revision from reviewer" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <FilterPopover
          filters={[
            {
              id: 'status', label: 'Status',
              options: [
                { value: 'open', label: 'Open' },
                { value: 'accepted', label: 'Accepted' },
                { value: 'revision', label: 'Revision' },
                { value: 'rejected', label: 'Rejected' },
              ],
            },
            {
              id: 'presentation_type', label: 'Presentation Type',
              options: presentationTypeOptions,
            },
          ]}
          values={filterVals}
          onChange={(id, val) => setFilterVals(prev => ({ ...prev, [id]: val }))}
          onApply={handleApply}
          onClear={handleClear}
          showRange={false}
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            style={{
              height: 36, display: 'flex', alignItems: 'center', gap: 6,
              padding: '0 14px', borderRadius: 8,
              border: '1px solid #E2E8F0', background: '#fff',
              fontSize: 13, fontFamily: 'Manrope,sans-serif', color: '#374151', cursor: 'pointer',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
            Export File
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          <div className="flex items-center gap-2 border border-gray-200 bg-white px-3 py-2" style={{ borderRadius: 8, height: 36 }}>
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search title..."
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              style={{ width: 170, fontFamily: 'Manrope,sans-serif' }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          { key: 'toggle', label: '' },
          { key: 'title', label: 'Title' },
          { key: 'correspondent', label: 'Correspondent' },
          { key: 'type', label: 'Presentation' },
          { key: 'status', label: 'Status' },
          { key: 'action', label: '' },
        ]}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={abstracts?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[10, 25, 50]}
          />
        )}
      >
        {rows.map(item => (
          <AbstractRow key={item.id} item={item} onEdit={handleEdit} onDelete={setConfirmRow} />
        ))}
      </DataTable>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <ConfirmDialog
        open={Boolean(confirmRow)}
        title="Delete Abstract"
        message={confirmRow ? `Delete abstract "${(confirmRow.title ?? '').split(' ').slice(0, 6).join(' ')}..."? This action cannot be undone.` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setConfirmRow(null)}
        onConfirm={handleConfirmDelete}
      />
    </AdminPageLayout>
  );
}
