import { FloatInput } from '../../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../../Components/ui/FloatSelect';
import FormActions from '../../../../Components/ui/FormActions';
import { Card } from '../../../../Components/ui/card';
import { Plus, X } from 'lucide-react';

export default function PublicationsJournalForm({ 
  view, 
  form, 
  setForm, 
  formErrors, 
  setFormErrors, 
  imageFiles,
  setImageFiles,
  previewUrls, 
  setPreviewUrls, 
  onCancel, 
  onSubmit 
}) {
  const imageTypeOptions = [
    { value: 'publications_journal', label: 'Publications Journal' },
    { value: 'hosted_by', label: 'Hosted By' },
    { value: 'co_hosted_by', label: 'Co-Hosted By' },
    { value: 'supported_by', label: 'Supported By' },
  ];

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (view === 'create') {
        const newFiles = Array.from(e.target.files);
        setImageFiles(prev => [...prev, ...newFiles]);
        
        if (formErrors.image_path) setFormErrors(prev => ({ ...prev, image_path: '' }));

        newFiles.forEach(file => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            setPreviewUrls(prev => [...prev, ev.target.result]);
          };
          reader.readAsDataURL(file);
        });
      } else {
        const file = e.target.files[0];
        setImageFiles([file]);
        if (formErrors.image_path) setFormErrors(prev => ({ ...prev, image_path: '' }));
        
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPreviewUrls([ev.target.result]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (indexToRemove) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviewUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <>
      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
          Publication Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FloatSelect
            id="image_type"
            label="Image Type *"
            value={form.image_type}
            options={imageTypeOptions}
            onChange={(val) => {
              setForm(prev => ({ ...prev, image_type: val }));
              if (formErrors.image_type) setFormErrors(prev => ({ ...prev, image_type: '' }));
            }}
            error={Boolean(formErrors.image_type)}
            helperText={formErrors.image_type || undefined}
          />
          <FloatInput
            id="year"
            label="Year *"
            type="number"
            value={form.year}
            onChange={(event) => {
              setForm(prev => ({ ...prev, year: event.target.value }));
              if (formErrors.year) setFormErrors(prev => ({ ...prev, year: '' }));
            }}
            error={Boolean(formErrors.year)}
            helperText={formErrors.year || undefined}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-800 mb-2">Image {view === 'create' ? '(Multiple Allowed)' : '*'} </p>
          <div className="flex flex-wrap gap-4">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="relative w-32 h-32 border rounded-md overflow-hidden bg-gray-50">
                <img src={url} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                {view === 'create' && (
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}

            {(view === 'create' || previewUrls.length === 0) && (
              <div
                className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => document.getElementById('pub-image-upload')?.click()}
              >
                <Plus size={24} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Upload</span>
              </div>
            )}
          </div>
          {formErrors.image_path && (
            <p className="text-red-500 text-sm mt-2">{formErrors.image_path}</p>
          )}
          <input
            id="pub-image-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            multiple={view === 'create'}
            onChange={handleImageChange}
          />
        </div>
      </Card>
      <div className="mt-6">
        <FormActions
          id="publications-form"
          cancelText="Cancel"
          submitText="Save"
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
}
