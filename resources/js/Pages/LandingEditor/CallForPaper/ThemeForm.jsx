import { FloatInput } from '../../../Components/ui/FloatInput';
import FormActions from '../../../Components/ui/FormActions';
import { Card } from '../../../Components/ui/card';

export default function ThemeForm({ view, form, setForm, formErrors, setFormErrors, onCancel, onSubmit }) {
  // Client-side required fields check
  const isSubmitDisabled = !form.title || !form.year || !form.description;

  return (
    <>
      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
          Call for Paper (Theme) Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            id="description"
            label="Description *"
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
          id="theme-form"
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
