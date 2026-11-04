import { useMemo, useRef, useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import UserPageLayout from '../../../Components/ui/shared/UserPageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import StatusBadge from '../../../Components/ui/StatusBadge';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import BackButton from '../../../Components/ui/BackButton';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import FormActions from '../../../Components/ui/FormActions';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

const CARD = { background: '#fff', borderRadius: 12, boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)', padding: 24 };
const MAX_WORDS = 350;

const PRESENTATION_OPTIONS = [
  { value: 'Oral presentation', label: 'Oral Presentation' },
  { value: 'Poster presentation', label: 'Poster Presentation' },
];

const PUBLICATION_OPTIONS = [
  { value: 'Journal Publication', label: 'Journal Publication' },
  { value: 'Proceedings Indexed in EBSCO', label: 'Proceedings Indexed in EBSCO' },
];

const FORMAT_GUIDE_ROWS = [
  { format: 'Italic', code: '<em> ... </em>', example: '<em>Oryza sativa</em>', result: <em>Oryza sativa</em> },
  { format: 'Subscript', code: '<sub> ... </sub>', example: 'CH<sub>4</sub>', result: <>CH<sub>4</sub></> },
  { format: 'Superscript', code: '<sup> ... </sup>', example: 'H<sup>+</sup>', result: <>H<sup>+</sup></> },
  { format: 'Right arrow', code: '&#8594;', example: 'A + B &#8594; C', result: 'A + B → C' },
  { format: 'Equilibrium arrow', code: '&#8652;', example: 'A + B &#8652; C', result: 'A + B ⇌ C' },
  { format: 'LaTeX inline math', code: '\\( ... \\)', example: 'The force acting between molecules is given by \\( \\vec{F}_{ij} = -\\nabla V \\)', result: 'The force acting between molecules is given by \\( \\vec{F}_{ij} = -\\nabla V \\)' },
  { format: 'LaTeX display math', code: '\\[ ... \\]', example: 'The wave function is normalized so that \\[ \\int_0^{\\infty} \\psi^*_{1s} \\psi_{1s} d\\tau = 1 \\]', result: 'The wave function is normalized so that \\[ \\int_0^{\\infty} \\psi^*_{1s} \\psi_{1s} d\\tau = 1 \\]' },
];

/* ---------- Upload Modal (full paper / commitment letter) ---------- */
function UploadFileModal({ open, title, description, accept, fieldName, errorKey, url, onClose, toast, maxSizeText = 'Max 10MB' }) {
  const { errors } = usePage().props;
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  if (!open) return null;

  const handleClose = () => {
    if (submitting) return;
    setFile(null);
    onClose();
  };

  const handleSubmit = () => {
    if (!file) return;
    const data = new FormData();
    data.append(fieldName, file);

    setSubmitting(true);
    router.post(url, data, {
      forceFormData: true,
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setFile(null);
        onClose();
      },
      onError: () => toast.error('Failed to upload file. Please check the selected file.'),
      onFinish: () => setSubmitting(false),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <p className="text-base font-semibold text-gray-800 mb-1">{title}</p>
        {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}

        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          style={{
            padding: '20px 16px', borderRadius: 10,
            border: `2px dashed ${dragging ? '#0152EA' : file ? '#10B981' : '#E2E8F0'}`,
            background: dragging ? 'rgba(1,82,234,0.04)' : file ? 'rgba(16,185,129,0.04)' : '#fff',
          }}
        >
          <Icon icon={file ? 'solar:check-circle-outline' : 'solar:upload-minimalistic-outline'} width={28} style={{ color: file ? '#10B981' : '#9CA3AF' }} />
          <span className="text-sm" style={{ color: file ? '#10B981' : '#6B7280' }}>
            {file ? file.name : 'Choose or drag file here'}
          </span>
          <span className="text-xs text-gray-400">Format: {accept.replace(/\./g, '').toUpperCase()} — {maxSizeText}</span>
          <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>
        {errors?.[errorKey] && <p className="text-xs text-red-500 mt-2">{errors[errorKey]}</p>}

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !file}
            className="px-4 py-2 text-sm rounded-md text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: '#0152EA' }}
          >
            {submitting ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Formatting Guideline (persis panduan di blade lama) ---------- */
function FormatGuide() {
  return (
    <div id="formatguide" style={{ ...CARD, marginTop: 24 }}>
      <p className="text-sm text-gray-500 text-center italic mb-2">
        The following rules in abstract formatting is <strong>OPTIONAL</strong>, but they can make your abstract more readable.
      </p>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', textAlign: 'center', marginBottom: 16 }}>
        ABSTRACT FORMATTING GUIDELINE
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(1,82,234,0.08)' }}>
              {['Format', 'Code', 'Example', 'Result'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: '#1F2A3D', border: '1px solid #E2E8F0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FORMAT_GUIDE_ROWS.map(row => (
              <tr key={row.format}>
                <td className="px-3 py-2" style={{ border: '1px solid #E2E8F0', color: '#374151' }}>{row.format}</td>
                <td className="px-3 py-2" style={{ border: '1px solid #E2E8F0', color: '#6B7280', fontFamily: 'monospace', fontSize: 12.5 }}>{row.code}</td>
                <td className="px-3 py-2" style={{ border: '1px solid #E2E8F0', color: '#6B7280', fontFamily: 'monospace', fontSize: 12.5 }}>{row.example}</td>
                <td className="px-3 py-2" style={{ border: '1px solid #E2E8F0', color: '#374151' }}>{row.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <a
          href="http://www.hostmath.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white"
          style={{ background: '#EF4444', borderRadius: 8, textDecoration: 'none', fontFamily: 'Manrope,sans-serif' }}
        >
          Online LaTeX equation tool
        </a>
      </div>
    </div>
  );
}

/* ---------- Create / Edit Form ---------- */
function AbstractFormView({ mode, abstract, symposiums, presentationTypes = [], enablePublicationSelection = true, onCancel, toast }) {
  const { errors } = usePage().props;
  const isEdit = mode === 'edit';

  const presentationOptions = useMemo(() => {
    if (presentationTypes && presentationTypes.length > 0) {
      return presentationTypes.map(pt => ({ value: pt.name, label: pt.name }));
    }
    return PRESENTATION_OPTIONS;
  }, [presentationTypes]);

  const [form, setForm] = useState({
    title: abstract?.title ?? '',
    symposium_id: abstract?.symposium_id ?? '',
    presentation_type: abstract?.presentation_type ?? (presentationTypes?.[0]?.name || 'Oral presentation'),
    publication: abstract?.publication ?? '',
    authors: abstract?.authors ?? '',
    affiliations: abstract?.affiliations ?? '',
    corresponding_email: abstract?.corresponding_email ?? '',
    abstract: abstract?.abstract ?? '',
    keyword: abstract?.keyword ?? '',
  });

  const symposiumOptions = symposiums.map(s => ({ value: s.id, label: s.name }));

  const wordCount = useMemo(() => {
    const words = form.abstract.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length;
  }, [form.abstract]);

  const setField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    const options = {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        onCancel();
      },
      onError: () => {
        toast.error('Please check your form input.');
      },
      onFinish: () => setSubmitting(false),
    };

    if (isEdit) {
      router.put(`/abstracts/${abstract.route_key}`, form, options);
    } else {
      router.post('/abstracts', form, options);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <BackButton onClick={onCancel} />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
          {isEdit ? 'Edit Abstract' : 'Abstract Submission'}
        </h1>
      </div>

      <Card className="mb-4">
        <p style={{ fontSize: 13.5, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
          If you require special formatting in your abstract title or body, please see the{' '}
          <a href="#formatguide" style={{ color: '#0152EA', textDecoration: 'underline' }}>formatting guide below</a>.
        </p>
      </Card>

      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
          {isEdit ? 'Edit Abstract Details' : 'Abstract Details'}
        </h2>

        <div className="flex flex-col gap-4">
          <FloatInput
            id="title"
            label="Paper Title *"
            value={form.title}
            onChange={setField('title')}
            error={Boolean(errors?.title)}
            helperText={errors?.title}
          />

          <FloatSelect
            id="symposium_id"
            label="Conference Topic *"
            options={symposiumOptions}
            value={form.symposium_id}
            onChange={(val) => setForm(prev => ({ ...prev, symposium_id: val }))}
            placeholder="-- Select Conference Topic --"
            error={Boolean(errors?.symposium_id)}
            helperText={errors?.symposium_id}
          />

          <FloatSelect
            id="presentation_type"
            label="Presentation Type *"
            options={presentationOptions}
            value={form.presentation_type}
            onChange={(val) => setForm(prev => ({ ...prev, presentation_type: val }))}
            placeholder="-- Select Presentation Type --"
            error={Boolean(errors?.presentation_type)}
            helperText={errors?.presentation_type}
          />

          {enablePublicationSelection && (
            <FloatSelect
              id="publication"
              label="Publication *"
              options={PUBLICATION_OPTIONS}
              value={form.publication}
              onChange={(val) => setForm(prev => ({ ...prev, publication: val }))}
              placeholder="-- Select Publication Type --"
              error={Boolean(errors?.publication)}
              helperText={errors?.publication}
            />
          )}

          <FloatInput
            id="authors"
            label="Author(s) *"
            value={form.authors}
            onChange={setField('authors')}
            placeholder="Martin Karplus*[1], Werner Heisenberg[2], Ada Lovelace[2,3]"
            error={Boolean(errors?.authors)}
            helperText={errors?.authors}
          />

          <FloatInput
            id="affiliations"
            label="Author Affiliations *"
            value={form.affiliations}
            onChange={setField('affiliations')}
            multiline
            rows={5}
            placeholder={'[1]Dept. of Chemistry, Brawijaya University, Malang, Indonesia\n[2]Dept. of Biology, University of Tokyo, Tokyo, Japan'}
            error={Boolean(errors?.affiliations)}
            helperText={errors?.affiliations}
          />

          <FloatInput
            id="corresponding_email"
            label="Corresponding Author's Email *"
            type="email"
            value={form.corresponding_email}
            onChange={setField('corresponding_email')}
            placeholder="user@example.com"
            error={Boolean(errors?.corresponding_email)}
            helperText={errors?.corresponding_email}
          />

          <div>
            <FloatInput
              id="abstract"
              label="Abstract *"
              value={form.abstract}
              onChange={setField('abstract')}
              multiline
              rows={8}
              placeholder="Please see formatting guidance below, if needed"
              error={Boolean(errors?.abstract)}
              helperText={errors?.abstract}
            />
            <p
              className="mt-1"
              style={{ fontSize: 12, fontFamily: 'Manrope,sans-serif', color: wordCount > MAX_WORDS ? '#EF4444' : '#9CA3AF' }}
            >
              {wordCount} words (Max: {MAX_WORDS} words)
            </p>
          </div>

          <FloatInput
            id="keyword"
            label="Keywords *"
            value={form.keyword}
            onChange={setField('keyword')}
            placeholder="Artificial Intelligence (AI), Machine Learning (ML), Deep Learning (DL)"
            error={Boolean(errors?.keyword)}
            helperText={errors?.keyword}
          />
        </div>
      </Card>

      <div className="mt-6">
        <FormActions
          id="abstract-form"
          cancelText="Cancel"
          submitText={submitting ? 'Submitting...' : (isEdit ? 'Update' : 'Submit')}
          onCancel={onCancel}
          onSubmit={submitting ? undefined : handleSubmit}
        />
      </div>

      <FormatGuide />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </>
  );
}

/* ---------- Avatar Initial (koresponden) ---------- */
function EmailBadge({ email }) {
  const initial = (email ?? '').split('@')[0].slice(0, 2).toUpperCase();
  return (
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0152EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'Manrope,sans-serif' }}>{initial}</span>
    </div>
  );
}

/* ---------- Detail Card (di atas tabel, per abstract) ---------- */
function DetailCard({ abstract, openFullPaperUpload, onUploadFullPaper, onUploadCameraReady }) {
  const { features } = usePage().props;
  const loaAvailable = abstract.status === 'accepted' && abstract.user?.file_payment?.status === 'verified';
  const showAbstractRevision = abstract.status === 'revision' && (abstract.reviewers?.length ?? 0) > 0;
  const showFullPaperRevision = abstract.full_paper
    && (abstract.full_paper.full_paper_reviews?.length ?? 0) > 0
    && abstract.full_paper.status === 'revision';
  const canUploadCameraReady = openFullPaperUpload
    && abstract.status === 'accepted';

  return (
    <div style={{ ...CARD, marginBottom: 16 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-gray-800 text-sm mb-1">Abstract</p>
          <Link
            href={`/abstracts/${abstract.route_key}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
            style={{ color: '#0152EA', background: 'rgba(1,82,234,0.08)', borderRadius: 8, textDecoration: 'none' }}
          >
            <Icon icon="solar:document-text-outline" width={15} />
            Detail
          </Link>
        </div>

        <div>
          <p className="font-semibold text-gray-800 text-sm mb-1">Letter of Acceptance</p>
          {loaAvailable ? (
            <a
              href={`/abstracts/${abstract.id}/acceptance-pdf`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
              style={{ color: '#0152EA', background: 'rgba(1,82,234,0.08)', borderRadius: 8, textDecoration: 'none' }}
            >
              <Icon icon="solar:diploma-verified-outline" width={15} />
              LOA PDF
            </a>
          ) : (
            <span className="text-sm text-gray-400">Not Available</span>
          )}
        </div>

        <div>
          <p className="font-semibold text-gray-800 text-sm mb-1">Full Paper (Draft)</p>
          {abstract.full_paper ? (
            <>
              <div className="flex items-center gap-2.5 flex-wrap">
                <a href={`/storage/${abstract.full_paper.file_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: '#0152EA' }}>
                  <Icon icon="solar:download-outline" width={16} />
                  Download Full Paper
                </a>
                {openFullPaperUpload && ['revision', 'open'].includes(abstract.full_paper.status) && onUploadFullPaper && (
                  <button
                    type="button"
                    onClick={() => onUploadFullPaper(abstract)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold"
                    style={{ color: '#0152EA', background: 'rgba(1,82,234,0.08)', borderRadius: 6, border: 'none', cursor: 'pointer' }}
                  >
                    <Icon icon="solar:upload-outline" width={13} />
                    Re-upload
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Submitted</p>
              {abstract.full_paper.revised_file_path && (
                <>
                  <a href={`/storage/${abstract.full_paper.revised_file_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium mt-2" style={{ color: '#F59E0B' }}>
                    <Icon icon="solar:file-download-outline" width={16} />
                    Download Revised
                  </a>
                  <p className="text-xs text-gray-400 mt-1">Revised</p>
                </>
              )}
            </>
          ) : openFullPaperUpload && onUploadFullPaper ? (
            <button
              type="button"
              onClick={() => onUploadFullPaper(abstract)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
              style={{ color: '#0152EA', background: 'rgba(1,82,234,0.08)', borderRadius: 8, border: 'none', cursor: 'pointer' }}
            >
              <Icon icon="solar:upload-outline" width={15} />
              Upload Full Paper
            </button>
          ) : (
            <p className="text-sm text-gray-400">No Full Paper Uploaded</p>
          )}
        </div>

        {features?.commitment_letter && (
          <div>
            <p className="font-semibold text-gray-800 text-sm mb-1">Commitment Letter</p>
            {abstract.full_paper?.commitment_letter_path ? (
              <a href={`/storage/${abstract.full_paper.commitment_letter_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: '#0152EA' }}>
                <Icon icon="solar:download-outline" width={16} />
                Download Commitment Letter
              </a>
            ) : (
              <span className="text-sm text-gray-400">Not Available</span>
            )}
          </div>
        )}

        <div>
          <p className="font-semibold text-gray-800 text-sm mb-1">Camera-Ready / Final Paper</p>
          {abstract.full_paper?.camera_ready_path ? (
            <>
              <div className="flex items-center gap-2.5 flex-wrap">
                <a
                  href={`/storage/${abstract.full_paper.camera_ready_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: '#0152EA' }}
                >
                  <Icon icon="solar:diploma-verified-outline" width={16} />
                  Download Final Paper
                </a>
                {canUploadCameraReady && onUploadCameraReady && (
                  <button
                    type="button"
                    onClick={() => onUploadCameraReady(abstract)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold"
                    style={{ color: '#0152EA', background: 'rgba(1,82,234,0.08)', borderRadius: 6, border: 'none', cursor: 'pointer' }}
                  >
                    <Icon icon="solar:upload-outline" width={13} />
                    Re-upload
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Camera-Ready Submitted</p>
            </>
          ) : canUploadCameraReady && onUploadCameraReady ? (
            <button
              type="button"
              onClick={() => onUploadCameraReady(abstract)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white"
              style={{ background: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
            >
              <Icon icon="solar:upload-outline" width={15} />
              Upload Final Paper
            </button>
          ) : (
            <span className="text-sm text-gray-400">Available after abstract acceptance</span>
          )}
        </div>

        {showAbstractRevision && (
          <div>
            <p className="font-semibold text-gray-800 text-sm mb-1">Revision Abstract</p>
            {abstract.reviewers.map((reviewer, i) => (
              <div key={i} className="mb-2">
                {reviewer.pivot?.comment && <p className="text-sm text-red-600">{reviewer.pivot.comment}</p>}
                <p className="text-xs text-gray-400">Revision by: {reviewer.name}</p>
              </div>
            ))}
          </div>
        )}

        {showFullPaperRevision && (
          <div>
            <p className="font-semibold text-gray-800 text-sm mb-1">Revision Fullpaper</p>
            {abstract.full_paper.full_paper_reviews.map((review, i) => (
              <div key={i} className="mb-2">
                <p className="text-sm text-red-600">{review.comment}</p>
                <p className="text-xs text-gray-400">Revision by: {review.reviewer?.name ?? 'Reviewer'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Expandable Row ---------- */
function AbstractRow({ abstract, enablePublicationSelection = true, onDelete, onEdit }) {
  const [open, setOpen] = useState(false);
  const titleWords = (abstract.title ?? '').split(' ');
  const shortTitle = titleWords.slice(0, 8).join(' ') + (titleWords.length > 8 ? '...' : '');

  const loaAvailable = abstract.status === 'accepted' && abstract.user?.file_payment?.status === 'verified';
  const showAbstractRevision = abstract.status === 'revision' && (abstract.reviewers?.length ?? 0) > 0;
  const showFullPaperRevision = abstract.full_paper
    && (abstract.full_paper.full_paper_reviews?.length ?? 0) > 0
    && abstract.full_paper.status === 'revision';

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
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', lineHeight: 1.4 }} title={abstract.title}>
            {shortTitle}
          </span>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2.5">
            <EmailBadge email={abstract.corresponding_email} />
            <div className="flex flex-col">
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                {(abstract.corresponding_email ?? '').split('@')[0]}
              </span>
              <span style={{ fontSize: 11.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>
                {abstract.corresponding_email}
              </span>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <StatusBadge label={capitalize(abstract.status)} />
        </td>
        <td className="px-4 py-4">
          {abstract.full_paper ? (
            <StatusBadge label={capitalize(abstract.full_paper.status)} />
          ) : (
            <span className="text-sm text-gray-400">Not Submitted</span>
          )}
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`/abstracts/${abstract.route_key}`}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
              style={{ color: '#0152EA' }}
              title="Detail"
            >
              <Icon icon="solar:document-text-outline" width={16} />
            </Link>
            <button
              type="button"
              onClick={() => onEdit(abstract)}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
              style={{ color: '#0152EA', cursor: 'pointer' }}
              title="Edit"
            >
              <Icon icon="solar:pen-2-outline" width={16} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(abstract)}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
              style={{ color: '#EF4444', cursor: 'pointer' }}
              title="Delete"
            >
              <Icon icon="solar:trash-bin-minimalistic-outline" width={16} />
            </button>
          </div>
        </td>
      </tr>

      {open && (
        <tr style={{ background: '#F8FAFC' }}>
          <td />
          <td colSpan={5} className="px-4 pb-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3" style={{ fontSize: 13, fontFamily: 'Manrope,sans-serif' }}>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Full Title</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{abstract.title}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Conference Topic</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{abstract.symposium?.name ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Requested</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{abstract.presentation_type ?? '-'}</p>
              </div>
              {(enablePublicationSelection || abstract.publication) && (
                <div>
                  <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Publication</span>
                  <p style={{ color: '#1F2A3D', marginTop: 2 }}>{abstract.publication ?? 'Not Specified'}</p>
                </div>
              )}

              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Letter of Acceptance</span>
                <div style={{ marginTop: 4 }}>
                  {loaAvailable ? (
                    <a
                      href={`/abstracts/${abstract.id}/acceptance-pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
                      style={{ color: '#0152EA', background: 'rgba(1,82,234,0.08)', borderRadius: 8, textDecoration: 'none' }}
                    >
                      <Icon icon="solar:diploma-verified-outline" width={15} />
                      LOA PDF
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">Not Available</span>
                  )}
                </div>
              </div>

              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Full Paper</span>
                {abstract.full_paper ? (
                  <div className="flex gap-3 mt-2 flex-wrap">
                    <a href={`/storage/${abstract.full_paper.file_path}`} target="_blank" rel="noreferrer"
                      className="flex flex-col items-center gap-1" style={{ color: '#0152EA', textDecoration: 'none' }}>
                      <Icon icon="solar:file-download-outline" width={20} />
                      <span style={{ fontSize: 11, fontWeight: 700 }}>Submitted</span>
                    </a>
                    {abstract.full_paper.revised_file_path && (
                      <a href={`/storage/${abstract.full_paper.revised_file_path}`} target="_blank" rel="noreferrer"
                        className="flex flex-col items-center gap-1" style={{ color: '#D97706', textDecoration: 'none' }}>
                        <Icon icon="solar:file-check-outline" width={20} />
                        <span style={{ fontSize: 11, fontWeight: 700 }}>Revised</span>
                      </a>
                    )}
                    {abstract.full_paper.camera_ready_path && (
                      <a href={`/storage/${abstract.full_paper.camera_ready_path}`} target="_blank" rel="noreferrer"
                        className="flex flex-col items-center gap-1" style={{ color: '#0152EA', textDecoration: 'none' }}>
                        <Icon icon="solar:diploma-verified-outline" width={20} />
                        <span style={{ fontSize: 11, fontWeight: 700 }}>Final Paper</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <p style={{ color: '#9CA3AF', marginTop: 4, fontSize: 13 }}>No Full Paper Uploaded</p>
                )}
              </div>

              {showAbstractRevision && (
                <div>
                  <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Revision Abstract</span>
                  {abstract.reviewers.map((reviewer, i) => (
                    <div key={i} style={{ marginTop: 4 }}>
                      {reviewer.pivot?.comment && <p style={{ color: '#DC2626' }}>{reviewer.pivot.comment}</p>}
                      <p style={{ color: '#9CA3AF', fontSize: 11.5 }}>Revision by: {reviewer.name}</p>
                    </div>
                  ))}
                </div>
              )}

              {showFullPaperRevision && (
                <div>
                  <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Revision Fullpaper</span>
                  {abstract.full_paper.full_paper_reviews.map((review, i) => (
                    <div key={i} style={{ marginTop: 4 }}>
                      <p style={{ color: '#DC2626' }}>{review.comment}</p>
                      <p style={{ color: '#9CA3AF', fontSize: 11.5 }}>Revision by: {review.reviewer?.name ?? 'Reviewer'}</p>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Keyword</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{abstract.keyword ?? '-'}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function UserAbstractsIndex({
  abstracts,
  openAbstractSubmission,
  openFullPaperUpload,
  symposiums = [],
  presentationTypes = [],
  enablePublicationSelection = true,
  maxAbstracts = 1,
}) {
  const toast = useToast();
  useFlashToast(toast);
  const { features } = usePage().props;

  const totalAbstracts = abstracts?.total ?? (abstracts?.data ? abstracts.data.length : 0);
  const reachedAbstractLimit = totalAbstracts >= maxAbstracts;

  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [confirmRow, setConfirmRow] = useState(null);
  const [uploadTarget, setUploadTarget] = useState(null); // { type: 'fullpaper' | 'commitment', abstract }

  const rows = abstracts?.data ?? [];
  const page = Math.max((abstracts?.current_page ?? 1) - 1, 0);
  const rowsPerPage = abstracts?.per_page ?? 10;

  const hasAccepted = rows.some(a => a.status === 'accepted');
  const hasRevision = rows.some(a => a.status === 'revision');

  const navigate = (params) => {
    router.get('/abstracts', params, { preserveScroll: true, preserveState: true });
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 0) return;
    navigate({ page: nextPage + 1, per_page: rowsPerPage });
  };

  const handleRowsChange = (nextRows) => {
    navigate({ page: 1, per_page: nextRows });
  };

  const handleConfirmDelete = () => {
    if (!confirmRow) return;
    router.delete(`/abstracts/${confirmRow.route_key}`, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setConfirmRow(null);
      },
      onError: () => { toast.error('Failed to delete abstract.'); setConfirmRow(null); },
    });
  };

  const closeForm = () => {
    setSelected(null);
    setView('list');
  };

  if (view === 'create' || view === 'edit') {
    return (
      <UserPageLayout currentPath="/abstracts">
        <AbstractFormView
          mode={view}
          abstract={view === 'edit' ? selected : null}
          symposiums={symposiums}
          presentationTypes={presentationTypes}
          enablePublicationSelection={enablePublicationSelection}
          onCancel={closeForm}
          toast={toast}
        />
      </UserPageLayout>
    );
  }

  return (
    <UserPageLayout currentPath="/abstracts">
      {rows.length > 0 && rows.map(abstract => (
        <DetailCard
          key={`detail-${abstract.id}`}
          abstract={abstract}
          openFullPaperUpload={openFullPaperUpload}
          onUploadFullPaper={(a) => setUploadTarget({ type: 'fullpaper', abstract: a })}
          onUploadCameraReady={(a) => setUploadTarget({ type: 'cameraready', abstract: a })}
        />
      ))}

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
          Abstracts
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          {openAbstractSubmission && !hasAccepted && !reachedAbstractLimit && (
            <button
              type="button"
              onClick={() => setView('create')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
            >
              {hasRevision ? 'Add the Revised Abstract' : 'Add Abstract'}
            </button>
          )}

          {openFullPaperUpload && rows
            .filter(a => a.status !== 'rejected' && (!a.full_paper || a.full_paper.status === 'revision'))
            .map(a => (
              <button
                key={`fp-${a.id}`}
                type="button"
                onClick={() => setUploadTarget({ type: 'fullpaper', abstract: a })}
                className="px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
              >
                {a.full_paper?.status === 'revision'
                  ? (rows.length > 1 ? `Upload Revised Full Paper (${(a.title ?? '').slice(0, 16)}...)` : 'Upload Revised Full Paper')
                  : (rows.length > 1 ? `Upload Full Paper (${(a.title ?? '').slice(0, 20)}...)` : 'Upload Full Paper')}
              </button>
            ))}

          {openFullPaperUpload && hasAccepted && rows
            .filter(a => a.status === 'accepted')
            .map(a => (
              <div key={`acc-btns-${a.id}`} className="flex items-center gap-2 flex-wrap">
                {!a.full_paper?.camera_ready_path && (
                  <button
                    key={`cr-${a.id}`}
                    type="button"
                    onClick={() => setUploadTarget({ type: 'cameraready', abstract: a })}
                    className="px-4 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
                  >
                    {rows.length > 1 ? `Upload Final Paper (${(a.title ?? '').slice(0, 16)}...)` : 'Upload Final Paper (Camera-Ready)'}
                  </button>
                )}
                {features?.commitment_letter && !a.full_paper?.commitment_letter_path && (
                  <button
                    key={`cl-${a.id}`}
                    type="button"
                    onClick={() => setUploadTarget({ type: 'commitment', abstract: a })}
                    className="px-4 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
                  >
                    {rows.length > 1 ? `Upload Commitment Letter (${(a.title ?? '').slice(0, 16)}...)` : 'Upload Commitment Letter'}
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'toggle', label: '' },
          { key: 'title', label: 'Title' },
          { key: 'correspondent', label: 'Correspondent' },
          { key: 'status', label: 'Status' },
          { key: 'fpStatus', label: 'FullPaper Status' },
          { key: 'action', label: '', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2">
            <Icon icon="solar:document-text-outline" width={48} style={{ color: '#D1D5DB' }} />
            <p className="font-medium text-gray-500">No abstracts found</p>
          </div>
        )}
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
        {rows.map(abstract => (
          <AbstractRow
            key={abstract.id}
            abstract={abstract}
            enablePublicationSelection={enablePublicationSelection}
            onDelete={setConfirmRow}
            onEdit={(a) => { setSelected(a); setView('edit'); }}
          />
        ))}
      </DataTable>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <ConfirmDialog
        open={Boolean(confirmRow)}
        title="Confirm Delete"
        message={confirmRow ? `Are you sure you want to delete "${confirmRow.title}"? This action cannot be undone.` : ''}
        cancelText="Cancel"
        confirmText="Confirm"
        onClose={() => setConfirmRow(null)}
        onConfirm={handleConfirmDelete}
      />

      <UploadFileModal
        open={uploadTarget?.type === 'fullpaper'}
        title="Upload Full Paper"
        description={`Abstract: ${uploadTarget?.abstract?.title ?? ''}`}
        accept=".pdf,.docx"
        fieldName="file"
        errorKey="file"
        url={uploadTarget ? `/store/${uploadTarget.abstract.id}` : ''}
        onClose={() => setUploadTarget(null)}
        toast={toast}
      />

      {features?.commitment_letter && (
        <UploadFileModal
          open={uploadTarget?.type === 'commitment'}
          title="Upload Commitment Letter"
          description={`Abstract: ${uploadTarget?.abstract?.title ?? ''}`}
          accept=".pdf,.docx,.doc"
          fieldName="commitment_letter"
          errorKey="commitment_letter"
          url={uploadTarget ? `/fullpaper/commitment-letter/${uploadTarget.abstract.id}` : ''}
          onClose={() => setUploadTarget(null)}
          toast={toast}
        />
      )}

      <UploadFileModal
        open={uploadTarget?.type === 'cameraready'}
        title="Upload Camera-Ready / Final Paper"
        description={`Abstract: ${uploadTarget?.abstract?.title ?? ''}`}
        accept=".pdf,.docx,.doc"
        fieldName="camera_ready_file"
        errorKey="camera_ready_file"
        maxSizeText="Max 15MB"
        url={uploadTarget ? `/fullpaper/camera-ready/${uploadTarget.abstract.id}` : ''}
        onClose={() => setUploadTarget(null)}
        toast={toast}
      />
    </UserPageLayout>
  );
}
