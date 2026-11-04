import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import FormActions from '../../../Components/ui/FormActions';
import BackButton from '../../../Components/ui/BackButton';

export default function InstagramForm({ mode, initial, onCancel, onSuccess, toast }) {
  const isEdit = mode === 'edit';

  const [data, setData] = useState({
    link: initial?.link ?? '',
    year: initial?.year ?? new Date().getFullYear(),
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const validate = () => {
    const errs = {};
    if (!data.link) {
      errs.link = 'Instagram link is required.';
    } else if (!data.link.startsWith('http')) {
      errs.link = 'Link must start with http or https.';
    }
    if (!data.year) errs.year = 'Year is required.';
    return errs;
  };

  const submit = (e) => {
    e.preventDefault();

    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setProcessing(true);
    setErrors({});

    const url = isEdit ? `/landing/instagram/${initial.id}` : '/landing/instagram';

    router.post(url, { ...data, _method: isEdit ? 'PUT' : 'POST' }, {
      onSuccess: () => {
        setProcessing(false);
        onSuccess(isEdit ? 'Instagram link updated successfully.' : 'Instagram link added successfully.');
      },
      onError: (err) => {
        setProcessing(false);
        setErrors(err);
        toast.error('There are form errors.');
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BackButton onClick={onCancel} />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
          {isEdit ? 'Edit Instagram' : 'Add Instagram'}
        </h1>
      </div>

      <Card style={{ padding: 24, borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <form onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 24 }}>

            <div>
              <FloatInput
                label="Instagram Link (e.g. https://instagram.com/...)"
                value={data.link}
                onChange={(e) => setData({ ...data, link: e.target.value })}
                error={errors.link}
                disabled={processing}
                style={{ fontFamily: 'Manrope,sans-serif' }}
              />
              {errors.link && (
                <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4, fontFamily: 'Manrope,sans-serif' }}>
                  {errors.link}
                </p>
              )}
            </div>

            <div>
              <FloatInput
                label="Year"
                type="number"
                value={data.year}
                onChange={(e) => setData({ ...data, year: e.target.value })}
                error={errors.year}
                disabled={processing}
                style={{ fontFamily: 'Manrope,sans-serif' }}
              />
              {errors.year && (
                <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4, fontFamily: 'Manrope,sans-serif' }}>
                  {errors.year}
                </p>
              )}
            </div>

          </div>

          <FormActions
            onCancel={onCancel}
            isProcessing={processing}
            submitText={isEdit ? 'Save Changes' : 'Save'}
          />
        </form>
      </Card>
    </div>
  );
}
