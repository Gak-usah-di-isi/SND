import { FloatInput } from '../../../Components/ui/FloatInput';
import FormActions from '../../../Components/ui/FormActions';
import { Card } from '../../../Components/ui/card';

export default function FaqForm({ view, form, setForm, formErrors, setFormErrors, onCancel, onSubmit }) {
  // Client-side required fields check
  const isSubmitDisabled = !form.title || !form.description;

  return (
    <>
      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
          FAQ Details
        </h2>
        
        <div className="grid grid-cols-1 gap-4 mb-4">
          <FloatInput
            id="title"
            label="Title *"
            value={form.title}
            onChange={(event) => {
              setForm(prev => ({ ...prev, title: event.target.value }));
              if (formErrors.title) setFormErrors(prev => ({ ...prev, title: '' }));
            }}
            error={Boolean(formErrors.title)}
            helperText={formErrors.title || undefined}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FloatInput
            id="description"
            label="Description *"
            value={form.description}
            onChange={(event) => {
              setForm(prev => ({ ...prev, description: event.target.value }));
              if (formErrors.description) setFormErrors(prev => ({ ...prev, description: '' }));
            }}
            multiline
            rows={6}
            error={Boolean(formErrors.description)}
            helperText={formErrors.description || undefined}
          />
        </div>
      </Card>
      
      <div className="mt-6">
        <FormActions
          id="faq-form"
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
