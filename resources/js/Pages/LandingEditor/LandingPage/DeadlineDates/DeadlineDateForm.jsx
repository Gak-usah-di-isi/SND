import { FloatInput } from '../../../../Components/ui/FloatInput';
import FormActions from '../../../../Components/ui/FormActions';
import { Card } from '../../../../Components/ui/card';

export default function DeadlineDateForm({ view, form, setForm, formErrors, setFormErrors, onCancel, onSubmit }) {
  return (
    <>
      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
          Profile Deadline
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatInput
            id="name"
            label="Name *"
            value={form.name}
            onChange={(event) => {
              setForm(prev => ({ ...prev, name: event.target.value }));
              if (formErrors.name) setFormErrors(prev => ({ ...prev, name: '' }));
            }}
            placeholder="Abstract Submission"
            error={Boolean(formErrors.name)}
            helperText={formErrors.name || undefined}
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
      </Card>
      <div className="mt-6">
        <FormActions
          id="deadline-form"
          cancelText="Cancel"
          submitText="Save"
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
}
