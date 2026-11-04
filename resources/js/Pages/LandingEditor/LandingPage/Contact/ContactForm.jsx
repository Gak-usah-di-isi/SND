import { FloatInput } from '../../../../Components/ui/FloatInput';
import FormActions from '../../../../Components/ui/FormActions';
import { Card } from '../../../../Components/ui/card';

export default function ContactForm({ view, form, setForm, formErrors, setFormErrors, onCancel, onSubmit }) {
  // Required fields: phone1, address, year
  const isSubmitDisabled = !form.phone1 || !form.address || !form.year;

  return (
    <>
      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
          Contact Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FloatInput
            id="phone1"
            label="Phone 1 *"
            value={form.phone1}
            onChange={(event) => {
              setForm(prev => ({ ...prev, phone1: event.target.value }));
              if (formErrors.phone1) setFormErrors(prev => ({ ...prev, phone1: '' }));
            }}
            error={Boolean(formErrors.phone1)}
            helperText={formErrors.phone1 || undefined}
          />
          <FloatInput
            id="phone1_name"
            label="Phone 1 Name"
            value={form.phone1_name}
            onChange={(event) => {
              setForm(prev => ({ ...prev, phone1_name: event.target.value }));
              if (formErrors.phone1_name) setFormErrors(prev => ({ ...prev, phone1_name: '' }));
            }}
            error={Boolean(formErrors.phone1_name)}
            helperText={formErrors.phone1_name || undefined}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FloatInput
            id="phone2"
            label="Phone 2"
            value={form.phone2}
            onChange={(event) => {
              setForm(prev => ({ ...prev, phone2: event.target.value }));
              if (formErrors.phone2) setFormErrors(prev => ({ ...prev, phone2: '' }));
            }}
            error={Boolean(formErrors.phone2)}
            helperText={formErrors.phone2 || undefined}
          />
          <FloatInput
            id="phone2_name"
            label="Phone 2 Name"
            value={form.phone2_name}
            onChange={(event) => {
              setForm(prev => ({ ...prev, phone2_name: event.target.value }));
              if (formErrors.phone2_name) setFormErrors(prev => ({ ...prev, phone2_name: '' }));
            }}
            error={Boolean(formErrors.phone2_name)}
            helperText={formErrors.phone2_name || undefined}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

        <div className="grid grid-cols-1 gap-4">
          <FloatInput
            id="address"
            label="Address *"
            value={form.address}
            onChange={(event) => {
              setForm(prev => ({ ...prev, address: event.target.value }));
              if (formErrors.address) setFormErrors(prev => ({ ...prev, address: '' }));
            }}
            multiline
            rows={3}
            error={Boolean(formErrors.address)}
            helperText={formErrors.address || undefined}
          />
        </div>
      </Card>
      
      <div className="mt-6">
        <FormActions
          id="contact-form"
          cancelText="Cancel"
          submitText="Save"
          onCancel={onCancel}
          onSubmit={onSubmit}
          submitDisabled={isSubmitDisabled}
        />
      </div>
    </>
  );
}
