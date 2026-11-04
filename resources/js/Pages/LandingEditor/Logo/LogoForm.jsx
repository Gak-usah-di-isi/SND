import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import FormActions from '../../../Components/ui/FormActions';
import PhotoUpload from '../../../Components/ui/PhotoUpload';

const SECTION_TITLE = { fontSize: 16, fontWeight: 600, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' };

export default function LogoForm({ mode = 'create', initial = null, onCancel, onSuccess, toast }) {
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    year: initial?.year ?? '',
    image: null,
  });
  const [preview, setPreview] = useState(initial?.image ? `/storage/${initial.image}` : null);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const setInput = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(f => ({ ...f, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    const url    = isEdit ? `/landing/logos/${initial.id}` : '/landing/logos';
    
    const data = { ...form };
    if (isEdit) {
      data._method = 'put';
      if (!data.image) {
          delete data.image; 
      }
    }

    router.post(url, data, {
      forceFormData: true,
      onSuccess: () => { setLoading(false); onSuccess(); },
      onError: (errs) => { setErrors(errs); setLoading(false); toast.error('Please review the form.'); },
    });
  };

  return (
    <>
      <Card style={{ marginBottom: 20 }}>
        <p style={SECTION_TITLE}>Logo Data</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <PhotoUpload
            label="Upload Logo *"
            previewUrl={preview}
            onChange={handleImageChange}
            helperText="Make sure photo format is JPG or PNG\nMaximum size 2MB, minimum 300x300px"
          />
          {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}

          <div style={{ width: '50%' }}>
             <FloatInput id="year" label="Year *" type="number" placeholder="e.g. 2024"
               value={form.year} onChange={setInput('year')} error={!!errors.year} helperText={errors.year} />
          </div>
        </div>
      </Card>

      <FormActions
        id="logo-form"
        cancelText="Cancel"
        submitText={loading ? 'Saving...' : 'Save'}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </>
  );
}
