import { FloatInput } from '../../../../Components/ui/FloatInput';
import FormActions from '../../../../Components/ui/FormActions';
import { Card } from '../../../../Components/ui/card';
import PhotoUpload from '../../../../Components/ui/PhotoUpload';

export default function HotelForm({ 
  view, 
  form, 
  setForm, 
  formErrors, 
  setFormErrors, 
  previewUrl, 
  setPreviewUrl, 
  onCancel, 
  onSubmit 
}) {
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm(prev => ({ ...prev, image: file }));
      if (formErrors.image) setFormErrors(prev => ({ ...prev, image: '' }));
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewUrl(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
          Hotel Profile
        </h2>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-shrink-0">
            <PhotoUpload
              label="Hotel Image"
              previewUrl={previewUrl}
              onChange={handleImageChange}
            />
            {formErrors.image && (
              <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
            <FloatInput
              id="name"
              label="Hotel Name *"
              value={form.name}
              onChange={(event) => {
                setForm(prev => ({ ...prev, name: event.target.value }));
                if (formErrors.name) setFormErrors(prev => ({ ...prev, name: '' }));
              }}
              error={Boolean(formErrors.name)}
              helperText={formErrors.name || undefined}
            />
            <FloatInput
              id="address"
              label="Address *"
              value={form.address}
              onChange={(event) => {
                setForm(prev => ({ ...prev, address: event.target.value }));
                if (formErrors.address) setFormErrors(prev => ({ ...prev, address: '' }));
              }}
              error={Boolean(formErrors.address)}
              helperText={formErrors.address || undefined}
            />
            <FloatInput
              id="phone"
              label="Phone *"
              value={form.phone}
              onChange={(event) => {
                setForm(prev => ({ ...prev, phone: event.target.value }));
                if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: '' }));
              }}
              error={Boolean(formErrors.phone)}
              helperText={formErrors.phone || undefined}
            />
            <FloatInput
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => {
                setForm(prev => ({ ...prev, email: event.target.value }));
                if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
              }}
              error={Boolean(formErrors.email)}
              helperText={formErrors.email || undefined}
            />
            <FloatInput
              id="website"
              label="Website"
              type="url"
              value={form.website}
              onChange={(event) => {
                setForm(prev => ({ ...prev, website: event.target.value }));
                if (formErrors.website) setFormErrors(prev => ({ ...prev, website: '' }));
              }}
              error={Boolean(formErrors.website)}
              helperText={formErrors.website || undefined}
            />
            <FloatInput
              id="stars"
              label="Stars (1-5)"
              type="number"
              value={form.stars}
              onChange={(event) => {
                setForm(prev => ({ ...prev, stars: event.target.value }));
                if (formErrors.stars) setFormErrors(prev => ({ ...prev, stars: '' }));
              }}
              error={Boolean(formErrors.stars)}
              helperText={formErrors.stars || undefined}
            />
            <FloatInput
              id="rating"
              label="Rating (e.g. 4.8)"
              type="number"
              step="0.1"
              value={form.rating}
              onChange={(event) => {
                setForm(prev => ({ ...prev, rating: event.target.value }));
                if (formErrors.rating) setFormErrors(prev => ({ ...prev, rating: '' }));
              }}
              error={Boolean(formErrors.rating)}
              helperText={formErrors.rating || undefined}
            />
            <FloatInput
              id="reviews_count"
              label="Reviews Count"
              type="number"
              value={form.reviews_count}
              onChange={(event) => {
                setForm(prev => ({ ...prev, reviews_count: event.target.value }));
                if (formErrors.reviews_count) setFormErrors(prev => ({ ...prev, reviews_count: '' }));
              }}
              error={Boolean(formErrors.reviews_count)}
              helperText={formErrors.reviews_count || undefined}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FloatInput
            id="map_url"
            label="Map Iframe (HTML)"
            value={form.map_url}
            onChange={(event) => {
              setForm(prev => ({ ...prev, map_url: event.target.value }));
              if (formErrors.map_url) setFormErrors(prev => ({ ...prev, map_url: '' }));
            }}
            multiline
            rows={3}
            error={Boolean(formErrors.map_url)}
            helperText={formErrors.map_url || undefined}
          />
          <FloatInput
            id="description"
            label="Description"
            value={form.description}
            onChange={(event) => {
              setForm(prev => ({ ...prev, description: event.target.value }));
              if (formErrors.description) setFormErrors(prev => ({ ...prev, description: '' }));
            }}
            multiline
            rows={4}
            error={Boolean(formErrors.description)}
            helperText={formErrors.description || undefined}
          />
        </div>
      </Card>
      <div className="mt-6">
        <FormActions
          id="hotel-form"
          cancelText="Cancel"
          submitText="Save"
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
}
