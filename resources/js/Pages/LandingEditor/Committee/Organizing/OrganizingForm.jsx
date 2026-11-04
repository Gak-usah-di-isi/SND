import { FloatInput } from '../../../../Components/ui/FloatInput';
import FormActions from '../../../../Components/ui/FormActions';
import { Card } from '../../../../Components/ui/card';

export default function OrganizingForm({ form, setForm, formErrors, setFormErrors, onCancel, onSubmit }) {
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <>
      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
          Organizing Committee Details
        </h2>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <FloatInput
            id="name"
            label="Name *"
            value={form.name}
            onChange={handleChange('name')}
            error={Boolean(formErrors.name)}
            helperText={formErrors.name || undefined}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatInput
            id="category"
            label="Category *"
            value={form.category}
            onChange={handleChange('category')}
            error={Boolean(formErrors.category)}
            helperText={formErrors.category || undefined}
          />
          <FloatInput
            id="year"
            label="Year *"
            type="number"
            value={form.year}
            onChange={handleChange('year')}
            error={Boolean(formErrors.year)}
            helperText={formErrors.year || undefined}
          />
        </div>
      </Card>

      <div className="mt-6">
        <FormActions
          id="organizing-form"
          cancelText="Cancel"
          submitText="Save"
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
}
