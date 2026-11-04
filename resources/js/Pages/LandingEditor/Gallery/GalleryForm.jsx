import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { FloatInput } from '../../../Components/ui/FloatInput';
import FormActions from '../../../Components/ui/FormActions';
import { Card } from '../../../Components/ui/card';

function IconUpload({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconX({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function GalleryForm({ mode = 'create', editGallery = null, onCancel }) {
  const { data, setData, post, processing, errors } = useForm({
    year: editGallery?.year?.toString() || '',
    images: [],
  });

  const [previews, setPreviews] = useState([]);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(f => {
      const validType = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'].includes(f.type);
      const validSize = f.size <= 2 * 1024 * 1024; // 2MB
      return validType && validSize;
    });

    // Merge with existing
    const merged = [...data.images, ...validFiles];
    setData('images', merged);

    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews(prev => [...prev, { name: file.name, url: ev.target.result, file }]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input agar bisa pilih file yang sama lagi
    e.target.value = '';
  };

  const removeFile = (index) => {
    setData('images', data.images.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (mode === 'create') {
      post('/landing/gallery', { forceFormData: true });
    } else if (editGallery) {
      post(`/landing/gallery/${editGallery.id}`, {
        forceFormData: true,
        _method: 'PUT',
      });
    }
  };

  const isSubmitDisabled = !data.year || (mode === 'create' && data.images.length === 0) || processing;

  return (
    <>
      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
          Gallery Information
        </h2>

        {/* Year */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <FloatInput
            id="year"
            label="Year *"
            type="number"
            value={data.year}
            onChange={(e) => setData('year', e.target.value)}
            error={Boolean(errors.year)}
            helperText={errors.year || undefined}
          />
        </div>

        {/* Multi-file Drop Zone */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-800" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Upload Images {mode === 'create' ? '*' : '(optional, to add new images)'}
          </p>
          <div
            className="flex flex-col items-center justify-center text-center cursor-pointer"
            style={{
              border: '2px dashed #E2E8F0',
              borderRadius: 8,
              padding: '32px 16px',
              backgroundColor: '#FAFBFC',
              transition: 'border-color 150ms, background-color 150ms',
            }}
            onClick={() => document.getElementById('gallery-images-input')?.click()}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0152EA';
              e.currentTarget.style.backgroundColor = '#F0F4FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.backgroundColor = '#FAFBFC';
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#0152EA';
              e.currentTarget.style.backgroundColor = '#F0F4FF';
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.backgroundColor = '#FAFBFC';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.backgroundColor = '#FAFBFC';
              const fakeEvent = { target: { files: e.dataTransfer.files, value: '' } };
              handleFilesChange(fakeEvent);
            }}
          >
            <div
              className="flex items-center justify-center rounded-full mb-3"
              style={{ width: 48, height: 48, backgroundColor: '#EBF0FF' }}
            >
              <IconUpload />
            </div>
            <p style={{ fontSize: 14, color: '#374151', fontWeight: 500, fontFamily: 'Manrope, sans-serif' }}>
              Click or drag & drop images here
            </p>
            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, fontFamily: 'Manrope, sans-serif' }}>
              Formats: JPG, JPEG, PNG, SVG &bull; Max 2MB per file &bull; Multiple selection supported
            </p>
          </div>
          <input
            id="gallery-images-input"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/svg+xml"
            multiple
            className="hidden"
            onChange={handleFilesChange}
          />
          {errors.images && (
            <p style={{ color: '#d32f2f', fontSize: 12, fontFamily: 'Manrope, sans-serif' }}>{errors.images}</p>
          )}
          {errors['images.0'] && (
            <p style={{ color: '#d32f2f', fontSize: 12, fontFamily: 'Manrope, sans-serif' }}>{errors['images.0']}</p>
          )}
        </div>

        {/* Preview Grid */}
        {previews.length > 0 && (
          <div className="mt-4">
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 8, fontFamily: 'Manrope, sans-serif' }}>
              {previews.length} file(s) selected
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {previews.map((p, i) => (
                <div
                  key={i}
                  style={{
                    position: 'relative',
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    aspectRatio: '1',
                  }}
                >
                  <img
                    src={p.url}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Delete"
                  >
                    <IconX size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="mt-6">
        <FormActions
          id="gallery-form"
          cancelText="Cancel"
          submitText={processing ? 'Saving...' : 'Save'}
          onCancel={onCancel}
          onSubmit={handleSubmit}
          submitDisabled={isSubmitDisabled}
        />
      </div>
    </>
  );
}
