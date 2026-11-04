import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card } from '../../../../Components/ui/card';
import { FloatInput } from '../../../../Components/ui/FloatInput';
import FormActions from '../../../../Components/ui/FormActions';

const SECTION_TITLE = { fontSize: 16, fontWeight: 600, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' };
const LABEL = { fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', display: 'block', marginBottom: 8 };

const ENDPOINT = '/landing/fullpaper-guidelines';

export default function FullpaperGuidelineForm({ mode = 'create', initial = null, onCancel, onSuccess, toast }) {
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    year: initial?.year ?? new Date().getFullYear(),
    content: initial?.content ?? '',
    pdf_file: null,
  });
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setInput = (key) => (e) => {
    const value = e.target.value;
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setForm(f => ({ ...f, pdf_file: file }));
    setFileName(file ? file.name : '');
    if (errors.pdf_file) setErrors(prev => ({ ...prev, pdf_file: '' }));
  };

  const handleSubmit = () => {
    const nextErrors = {};
    if (!form.year) nextErrors.year = 'Year is required';
    if (!form.content) nextErrors.content = 'Content is required';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    const url = isEdit ? `${ENDPOINT}/${initial.id}` : ENDPOINT;

    const data = { year: form.year, content: form.content };
    if (form.pdf_file) data.pdf_file = form.pdf_file;
    if (isEdit) data._method = 'put';

    router.post(url, data, {
      forceFormData: true,
      onSuccess: () => { setLoading(false); onSuccess(); },
      onError: (errs) => { setErrors(errs); setLoading(false); toast.error('Please review the form.'); },
    });
  };

  return (
    <>
      <Card style={{ marginBottom: 20 }}>
        <p style={SECTION_TITLE}>Fullpaper Guideline Data</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ width: '50%' }}>
            <FloatInput
              id="year"
              label="Year *"
              type="number"
              placeholder="e.g. 2024"
              value={form.year}
              onChange={setInput('year')}
              error={!!errors.year}
              helperText={errors.year}
            />
          </div>

          <div>
            <label htmlFor="content" style={LABEL}>Content *</label>
            <textarea
              id="content"
              rows={14}
              value={form.content}
              onChange={setInput('content')}
              placeholder="Write fullpaper submission guidelines here..."
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 8,
                border: `1px solid ${errors.content ? '#d32f2f' : '#E2E8F0'}`,
                fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem',
                color: '#1E293B', outline: 'none', resize: 'vertical',
              }}
            />
            {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content}</p>}
          </div>

          <div>
            <label htmlFor="pdf_file" style={LABEL}>Guideline File (PDF/DOC/PPT)</label>
            {initial?.pdf_file && (
              <p style={{ marginBottom: 8, fontSize: 13, fontFamily: 'Manrope, sans-serif' }}>
                <a
                  href={`/storage/${initial.pdf_file}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#0152EA', textDecoration: 'underline' }}
                >
                  View current file
                </a>
              </p>
            )}
            <input
              id="pdf_file"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={handleFileChange}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                border: `1px solid ${errors.pdf_file ? '#d32f2f' : '#E2E8F0'}`,
                fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem',
                color: '#1E293B', background: '#fff', cursor: 'pointer',
              }}
            />
            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, fontFamily: 'Manrope, sans-serif' }}>
              {fileName
                ? `Selected file: ${fileName}`
                : `PDF, DOC, DOCX, PPT, or PPTX format. Maximum 2MB.${initial?.pdf_file ? ' Leave blank if you do not want to replace the file.' : ''}`}
            </p>
            {errors.pdf_file && <p className="text-sm text-red-500 mt-1">{errors.pdf_file}</p>}
          </div>
        </div>
      </Card>

      <FormActions
        id="fullpaper-guideline-form"
        cancelText="Cancel"
        submitText={loading ? 'Saving...' : 'Save'}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </>
  );
}
