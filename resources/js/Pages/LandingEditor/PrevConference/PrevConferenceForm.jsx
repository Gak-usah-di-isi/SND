import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import FormActions from '../../../Components/ui/FormActions';
import PhotoUpload from '../../../Components/ui/PhotoUpload';
import BackButton from '../../../Components/ui/BackButton';
import { Icon } from '@iconify/react';

const SECTION_TITLE = { fontSize: 16, fontWeight: 600, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' };

export default function PrevConferenceForm({ mode = 'create', initial = null, onCancel, onSuccess, toast }) {
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    keynote: initial?.keynote ?? '',
    date: initial?.date ?? '',
    location: initial?.location ?? '',
    year: initial?.year ?? '',
    image: null,
    pdf: null,
  });

  const [preview, setPreview] = useState(initial?.image ? `/storage/${initial.image}` : null);
  const [pdfName, setPdfName] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setInput = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, pdf: file }));
      setPdfName(file.name);
    }
  };

  const validate = () => {
    const errs = {};
    if (!isEdit && !form.image) errs.image = 'Poster is required.';
    if (!form.title) errs.title = 'Title is required.';
    if (!form.description) errs.description = 'Theme is required.';
    if (!form.keynote) errs.keynote = 'Keynote is required.';
    if (!form.date) errs.date = 'Date is required.';
    if (!form.location) errs.location = 'Location is required.';
    if (!form.year) errs.year = 'Year is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();

    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      toast.error('Please check your form input.');
      return;
    }

    setLoading(true);
    setErrors({});

    const url = isEdit ? `/landing/prevconference/${initial.id}` : '/landing/prevconference';
    const data = { ...form };

    if (!data.image) delete data.image;
    if (!data.pdf) delete data.pdf;
    if (isEdit) data._method = 'put';

    router.post(url, data, {
      forceFormData: true,
      onSuccess: () => {
        setLoading(false);
        onSuccess(isEdit ? 'Previous conference updated successfully.' : 'Previous conference added successfully.');
      },
      onError: (errs) => {
        setErrors(errs);
        setLoading(false);
        toast.error('Please check your form input.');
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BackButton onClick={onCancel} />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
          {isEdit ? 'Edit Previous Conference' : 'Add Previous Conference'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card style={{ padding: 24, borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: 'none', marginBottom: 20 }}>
          <p style={SECTION_TITLE}>Conference Data</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <PhotoUpload
                label="Poster *"
                inputId="prevconference-image"
                previewUrl={preview}
                onChange={handleImageChange}
                helperText={'Ensure JPG or PNG format\nMax size 2MB'}
              />
              {errors.image && (
                <p style={{ color: '#EF4444', fontSize: 12, marginTop: 6, fontFamily: 'Manrope,sans-serif' }}>{errors.image}</p>
              )}
            </div>

            <FloatInput
              id="title"
              label="Title *"
              placeholder="e.g. ICASVE 2025"
              value={form.title}
              onChange={setInput('title')}
              error={!!errors.title}
              helperText={errors.title}
            />

            <FloatInput
              id="description"
              label="Theme *"
              multiline
              rows={3}
              placeholder="e.g. Entrepreneurship, Creativity, and AI-driven Innovation in the Digital Era"
              value={form.description}
              onChange={setInput('description')}
              error={!!errors.description}
              helperText={errors.description}
            />

            <FloatInput
              id="keynote"
              label="Keynote *"
              multiline
              rows={5}
              placeholder="e.g. Dr. John Doe"
              value={form.keynote}
              onChange={setInput('keynote')}
              error={!!errors.keynote}
              helperText={errors.keynote}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <FloatInput
                id="date"
                label="Date *"
                placeholder="e.g. 12-13 August 2025"
                value={form.date}
                onChange={setInput('date')}
                error={!!errors.date}
                helperText={errors.date}
              />

              <FloatInput
                id="year"
                label="Year *"
                type="number"
                placeholder="e.g. 2025"
                value={form.year}
                onChange={setInput('year')}
                error={!!errors.year}
                helperText={errors.year}
              />
            </div>

            <FloatInput
              id="location"
              label="Location *"
              placeholder="e.g. Jl. Veteran 12-14 Malang, East Java"
              value={form.location}
              onChange={setInput('location')}
              error={!!errors.location}
              helperText={errors.location}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
                PDF Document (Optional)
              </p>

              <label
                htmlFor="prevconference-pdf"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  border: `1px dashed ${errors.pdf ? '#EF4444' : '#E0E0E0'}`,
                  borderRadius: 8, padding: '12px 16px', cursor: 'pointer',
                  background: '#fff', fontFamily: 'Manrope,sans-serif', fontSize: 13.5, color: '#6B7280',
                }}
              >
                <Icon icon="solar:file-text-outline" width={20} style={{ color: '#0152EA', flexShrink: 0 }} />
                <span style={{ color: pdfName ? '#1F2A3D' : '#6B7280' }}>
                  {pdfName ?? (initial?.pdf ? 'Replace PDF file (existing file will be kept if empty)' : 'Select PDF file (max 5MB)')}
                </span>
              </label>
              <input
                id="prevconference-pdf"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handlePdfChange}
              />

              {initial?.pdf && !pdfName && (
                <a
                  href={initial.pdf.startsWith('http') ? initial.pdf : `/storage/${initial.pdf}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 12.5, color: '#0152EA', fontFamily: 'Manrope,sans-serif', textDecoration: 'none' }}
                >
                  View current PDF
                </a>
              )}

              {errors.pdf && (
                <p style={{ color: '#EF4444', fontSize: 12, fontFamily: 'Manrope,sans-serif', margin: 0 }}>{errors.pdf}</p>
              )}
            </div>
          </div>
        </Card>

        <FormActions
          id="prevconference-form"
          cancelText="Cancel"
          submitText={loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Save'}
          onCancel={onCancel}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
}
