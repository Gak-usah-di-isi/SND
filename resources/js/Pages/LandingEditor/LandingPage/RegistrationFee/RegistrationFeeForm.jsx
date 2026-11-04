import { FloatInput } from '../../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../../Components/ui/FloatSelect';
import FormActions from '../../../../Components/ui/FormActions';
import { Card } from '../../../../Components/ui/card';

export default function RegistrationFeeForm({ view, form, setForm, formErrors, setFormErrors, onCancel, onSubmit }) {
  const roleOptions = [
    { value: 'presenter', label: 'Presenter' },
    { value: 'non_presenter', label: 'Non-Presenter' },
    { value: 'additional_fee', label: 'Additional Fee' },
  ];

  return (
    <>
      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
          Profile Registration Fee
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatSelect
            id="role_type"
            label="Role *"
            value={form.role_type}
            options={roleOptions}
            onChange={(val) => {
              setForm(prev => ({ ...prev, role_type: val }));
              if (formErrors.role_type) setFormErrors(prev => ({ ...prev, role_type: '' }));
            }}
            error={Boolean(formErrors.role_type)}
            helperText={formErrors.role_type || undefined}
          />
          <FloatInput
            id="category_name"
            label="Category Name *"
            value={form.category_name}
            onChange={(event) => {
              setForm(prev => ({ ...prev, category_name: event.target.value }));
              if (formErrors.category_name) setFormErrors(prev => ({ ...prev, category_name: '' }));
            }}
            placeholder="Student, Professional"
            error={Boolean(formErrors.category_name)}
            helperText={formErrors.category_name || undefined}
          />
          <FloatInput
            id="domestic_participants"
            label="Domestic Participants"
            value={form.domestic_participants}
            onChange={(event) => {
              setForm(prev => ({ ...prev, domestic_participants: event.target.value }));
              if (formErrors.domestic_participants) setFormErrors(prev => ({ ...prev, domestic_participants: '' }));
            }}
            placeholder="e.g. 100000 or TBA"
            error={Boolean(formErrors.domestic_participants)}
            helperText={formErrors.domestic_participants || undefined}
          />
          <FloatInput
            id="international_participants"
            label="International Participants"
            value={form.international_participants}
            onChange={(event) => {
              setForm(prev => ({ ...prev, international_participants: event.target.value }));
              if (formErrors.international_participants) setFormErrors(prev => ({ ...prev, international_participants: '' }));
            }}
            placeholder="e.g. 200000 or TBA"
            error={Boolean(formErrors.international_participants)}
            helperText={formErrors.international_participants || undefined}
          />
          <FloatInput
            id="period_of_payment"
            label="Period of Payment"
            type="date"
            value={form.period_of_payment}
            onChange={(event) => {
              setForm(prev => ({ ...prev, period_of_payment: event.target.value }));
              if (formErrors.period_of_payment) setFormErrors(prev => ({ ...prev, period_of_payment: '' }));
            }}
            error={Boolean(formErrors.period_of_payment)}
            helperText={formErrors.period_of_payment || undefined}
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
          id="registrationfee-form"
          cancelText="Cancel"
          submitText="Save"
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
}
