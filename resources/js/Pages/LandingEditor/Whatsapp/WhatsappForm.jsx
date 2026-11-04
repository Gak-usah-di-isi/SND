import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import FormActions from '../../../Components/ui/FormActions';
import BackButton from '../../../Components/ui/BackButton';

export default function WhatsappForm({ mode, initial, onCancel, onSuccess, toast }) {
  const isEdit = mode === 'edit';
  
  const [data, setData] = useState({
    nomor: initial?.nomor ?? '',
    year: initial?.year ?? new Date().getFullYear(),
  });
  
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    const url = isEdit ? `/landing/whatsapp/${initial.id}` : '/landing/whatsapp';
    
    // We can use router.post directly and spoof method for PUT
    const formData = {
      ...data,
      _method: isEdit ? 'PUT' : 'POST'
    };

    router.post(url, formData, {
      onSuccess: () => {
        setProcessing(false);
        onSuccess(isEdit ? 'WhatsApp number updated successfully.' : 'WhatsApp number added successfully.');
      },
      onError: (err) => {
        setProcessing(false);
        setErrors(err);
        toast.error('There are form errors.');
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BackButton onClick={onCancel} />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
          {isEdit ? 'Edit WhatsApp' : 'Add WhatsApp'}
        </h1>
      </div>

      <Card style={{ padding: 24, borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <form onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 24 }}>
            
            <FloatInput
              label="WhatsApp Number (e.g. 6281234567890)"
              value={data.nomor}
              onChange={(e) => setData({ ...data, nomor: e.target.value })}
              error={errors.nomor}
              disabled={processing}
              style={{ fontFamily: 'Manrope,sans-serif' }}
            />

            <FloatInput
              label="Year"
              type="number"
              value={data.year}
              onChange={(e) => setData({ ...data, year: e.target.value })}
              error={errors.year}
              disabled={processing}
              style={{ fontFamily: 'Manrope,sans-serif' }}
            />

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
