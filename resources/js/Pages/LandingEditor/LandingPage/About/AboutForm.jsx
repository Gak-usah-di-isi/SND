import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Card } from '../../../../Components/ui/card';
import { FloatInput } from '../../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../../Components/ui/FloatSelect';
import FormActions from '../../../../Components/ui/FormActions';
import PhotoUpload from '../../../../Components/ui/PhotoUpload';

export default function AboutForm({ initialData, onClose, onSuccess, toast }) {
  const isEdit = !!initialData;
  const { years = [], activeYear } = usePage().props;
  const currentActiveYear = activeYear?.year ?? activeYear ?? years?.[0] ?? new Date().getFullYear();

  const allYears = Array.from(new Set([currentActiveYear, ...years])).filter(Boolean).sort((a, b) => b - a);
  const yearOptions = allYears.map(y => ({
    value: String(y),
    label: `${y}${String(y) === String(currentActiveYear) ? ' (Active Year)' : ''}`
  }));

  const [form, setForm] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    year: initialData?.year ? String(initialData.year) : String(currentActiveYear),
    image: null,
  });
  const [preview, setPreview] = useState(
    initialData?.image ? `/storage/${initialData.image}` : null
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((currentForm) => ({ ...currentForm, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const url = isEdit ? `/landing/abouts/${initialData.id}` : '/landing/abouts';
    const data = { ...form };
    
    if (isEdit) {
      data._method = 'put';
      if (!data.image) {
        delete data.image; // Don't send null image on edit
      }
    }

    router.post(url, data, {
      forceFormData: true,
      onSuccess: () => { setLoading(false); onSuccess(); },
      onError: (errs) => { setErrors(errs); setLoading(false); toast.error('Please check your form input.'); },
    });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99, display: 'flex', justifyContent: 'flex-end' }}>
      <Card style={{ width: '75vw', maxWidth: '75vw', height: '100%', borderRadius: '16px 0 0 16px', display: 'flex', flexDirection: 'column', background: '#fff', boxShadow: '-4px 0 32px rgba(0,0,0,0.14)' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #E2E8F0' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}>
            {isEdit ? 'Edit About' : 'Add About'}
          </h2>
        </div>

        <div style={{ padding: '24px 32px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <PhotoUpload
            label="About Image"
            previewUrl={preview}
            onChange={handlePhotoSelect}
          />
          {errors.image && (
            <span style={{ color: '#EF4444', fontSize: 12 }}>{errors.image}</span>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatSelect
              id="year"
              label="Year *"
              value={form.year}
              options={yearOptions}
              onChange={(val) => {
                setForm(prev => ({ ...prev, year: val }));
                if (errors.year) setErrors(prev => ({ ...prev, year: '' }));
              }}
              error={Boolean(errors.year)}
              helperText={errors.year}
            />

            <FloatInput
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={errors.title}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontFamily: 'Manrope,sans-serif', fontSize: 14, fontWeight: 500 }}>Content <span style={{ color: '#EF4444' }}>*</span></label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={5}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 8,
                border: `1px solid ${errors.content ? '#EF4444' : '#E2E8F0'}`,
                outline: 'none', fontFamily: 'Manrope,sans-serif', fontSize: 14,
                background: '#F8FAFC', resize: 'vertical'
              }}
            />
            {errors.content && <span style={{ color: '#EF4444', fontSize: 12 }}>{errors.content}</span>}
          </div>
        </div>

        <FormActions onCancel={onClose} onSubmit={handleSubmit} loading={loading} submitText="Save" />
      </Card>
    </div>
  );
}
