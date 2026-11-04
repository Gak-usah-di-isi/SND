import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Card } from '../../../../Components/ui/card';
import { FloatInput } from '../../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../../Components/ui/FloatSelect';
import FormActions from '../../../../Components/ui/FormActions';
import PhotoUpload from '../../../../Components/ui/PhotoUpload';

const normalizeRole = (role) => ({
  'Keynote Speaker': 'keynote_speaker',
  'Invited Speaker': 'invited_speaker',
}[role] || role || '');

export default function SpeakerForm({ initialData, onClose, onSuccess, toast }) {
  const isEdit = !!initialData;
  const { years = [], activeYear } = usePage().props;
  const currentActiveYear = activeYear?.year ?? activeYear ?? years?.[0] ?? new Date().getFullYear();

  const allYears = Array.from(new Set([currentActiveYear, ...years])).filter(Boolean).sort((a, b) => b - a);
  const yearOptions = allYears.map(y => ({
    value: String(y),
    label: `${y}${String(y) === String(currentActiveYear) ? ' (Active Year)' : ''}`
  }));

  const roleOptions = [
    { value: 'keynote_speaker', label: 'Keynote Speaker' },
    { value: 'invited_speaker', label: 'Invited Speaker' },
  ];

  const [form, setForm] = useState({
    name: initialData?.name || '',
    role: normalizeRole(initialData?.role),
    institution: initialData?.institution || '',
    country: initialData?.country || '',
    year: initialData?.year ? String(initialData.year) : String(currentActiveYear),
    session_topic: initialData?.session_topic || '',
    await_confirmation: !!initialData?.await_confirmation,
    image: null,
  });
  const [preview, setPreview] = useState(
    initialData?.image ? `/storage/${initialData.image}` : null
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };
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

    const url = isEdit ? `/landing/speakers/${initialData.id}` : '/landing/speakers';
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
            {isEdit ? 'Edit Speaker' : 'Add Speaker'}
          </h2>
        </div>

        <div style={{ padding: '24px 32px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="w-full">
            <PhotoUpload
              label="Speaker Photo"
              previewUrl={preview}
              onChange={handlePhotoSelect}
            />
            {errors.image && (
              <span style={{ color: '#EF4444', fontSize: 12 }}>{errors.image}</span>
            )}
          </div>
          
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

            <FloatSelect
              id="role"
              label="Role *"
              value={form.role}
              options={roleOptions}
              onChange={(val) => {
                setForm(prev => ({ ...prev, role: val }));
                if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
              }}
              error={Boolean(errors.role)}
              helperText={errors.role}
            />

            <FloatInput
              label="Speaker Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <FloatInput
              label="Institution"
              name="institution"
              value={form.institution}
              onChange={handleChange}
              error={errors.institution}
              required
            />

            <FloatInput
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              error={errors.country}
              required
            />

            <FloatInput
              label="Session Topic (Optional)"
              name="session_topic"
              value={form.session_topic}
              onChange={handleChange}
              error={errors.session_topic}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <input
              type="checkbox"
              id="await_confirmation"
              name="await_confirmation"
              checked={form.await_confirmation}
              onChange={handleChange}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <label htmlFor="await_confirmation" style={{ fontFamily: 'Manrope,sans-serif', fontSize: 14, cursor: 'pointer', userSelect: 'none' }}>
              Mark as "Await Confirmation"
            </label>
          </div>

        </div>

        <FormActions onCancel={onClose} onSubmit={handleSubmit} loading={loading} submitText="Save" />
      </Card>
    </div>
  );
}
