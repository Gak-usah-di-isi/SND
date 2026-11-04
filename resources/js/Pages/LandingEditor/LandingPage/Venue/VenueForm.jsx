import { FloatInput } from '../../../../Components/ui/FloatInput';
import FormActions from '../../../../Components/ui/FormActions';
import { Card } from '../../../../Components/ui/card';
import PhotoUpload from '../../../../Components/ui/PhotoUpload';

export default function VenueForm({ 
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
      setForm(prev => ({ ...prev, image_path: file }));
      if (formErrors.image_path) setFormErrors(prev => ({ ...prev, image_path: '' }));
      
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
          Venue Profile
        </h2>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-shrink-0">
            <PhotoUpload
              label="Venue Image"
              previewUrl={previewUrl}
              onChange={handleImageChange}
            />
            {formErrors.image_path && (
              <p className="text-red-500 text-sm mt-1">{formErrors.image_path}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
            <FloatInput
              id="venue_name"
              label="Venue Name *"
              value={form.venue_name}
              onChange={(event) => {
                setForm(prev => ({ ...prev, venue_name: event.target.value }));
                if (formErrors.venue_name) setFormErrors(prev => ({ ...prev, venue_name: '' }));
              }}
              error={Boolean(formErrors.venue_name)}
              helperText={formErrors.venue_name || undefined}
            />
            <FloatInput
              id="date"
              label="Date *"
              type="date"
              value={form.date}
              onChange={(event) => {
                setForm(prev => ({ ...prev, date: event.target.value }));
                if (formErrors.date) setFormErrors(prev => ({ ...prev, date: '' }));
              }}
              error={Boolean(formErrors.date)}
              helperText={formErrors.date || undefined}
              forceFloating
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
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FloatInput
            id="link_map"
            label="Map Link (Google Maps URL) *"
            type="url"
            value={form.link_map}
            onChange={(event) => {
              setForm(prev => ({ ...prev, link_map: event.target.value }));
              if (formErrors.link_map) setFormErrors(prev => ({ ...prev, link_map: '' }));
            }}
            error={Boolean(formErrors.link_map)}
            helperText={formErrors.link_map || undefined}
          />
          <FloatInput
            id="map"
            label="Map Iframe (HTML) *"
            value={form.map}
            onChange={(event) => {
              setForm(prev => ({ ...prev, map: event.target.value }));
              if (formErrors.map) setFormErrors(prev => ({ ...prev, map: '' }));
            }}
            multiline
            rows={4}
            error={Boolean(formErrors.map)}
            helperText={formErrors.map || undefined}
          />

          <FloatInput
            id="conference_mode"
            label="Conference Mode (e.g. Hybrid - Onsite and Online)"
            value={form.conference_mode}
            onChange={(event) => {
              setForm(prev => ({ ...prev, conference_mode: event.target.value }));
              if (formErrors.conference_mode) setFormErrors(prev => ({ ...prev, conference_mode: '' }));
            }}
            error={Boolean(formErrors.conference_mode)}
            helperText={formErrors.conference_mode || undefined}
          />

          <FloatInput
            id="onsite_programme"
            label="Onsite Programme"
            value={form.onsite_programme}
            onChange={(event) => {
              setForm(prev => ({ ...prev, onsite_programme: event.target.value }));
              if (formErrors.onsite_programme) setFormErrors(prev => ({ ...prev, onsite_programme: '' }));
            }}
            multiline
            rows={3}
            error={Boolean(formErrors.onsite_programme)}
            helperText={formErrors.onsite_programme || undefined}
          />

          <FloatInput
            id="online_programme"
            label="Online Programme"
            value={form.online_programme}
            onChange={(event) => {
              setForm(prev => ({ ...prev, online_programme: event.target.value }));
              if (formErrors.online_programme) setFormErrors(prev => ({ ...prev, online_programme: '' }));
            }}
            multiline
            rows={3}
            error={Boolean(formErrors.online_programme)}
            helperText={formErrors.online_programme || undefined}
          />
        </div>
      </Card>
      <div className="mt-6">
        <FormActions
          id="venue-form"
          cancelText="Cancel"
          submitText="Save"
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
}
