import { FloatInput } from '../../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../../Components/ui/FloatSelect';
import FormActions from '../../../../Components/ui/FormActions';
import { Card } from '../../../../Components/ui/card';

const SECTION_TITLE = { fontSize: 16, fontWeight: 600, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' };
const LABEL = { fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', display: 'block', marginBottom: 8 };

const inputStyle = (hasError) => ({
  width: '100%', height: 36, padding: '0 14px', borderRadius: 8,
  border: `1px solid ${hasError ? '#d32f2f' : '#E2E8F0'}`,
  fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem',
  color: '#1E293B', background: '#fff', outline: 'none',
});

export default function ProgramForm({ form, setForm, formErrors, setFormErrors, dayOptions = [], onCancel, onSubmit }) {
  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleChange = (field) => (event) => setField(field, event.target.value);

  return (
    <>
      <Card>
        <p style={SECTION_TITLE}>Program Data</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FloatInput
            id="year"
            label="Year *"
            type="number"
            placeholder="e.g. 2025"
            value={form.year}
            onChange={handleChange('year')}
            error={Boolean(formErrors.year)}
            helperText={formErrors.year || undefined}
          />
          <FloatSelect
            id="day_number"
            label="Day Number *"
            options={dayOptions}
            value={form.day_number}
            onChange={(value) => setField('day_number', value)}
            error={Boolean(formErrors.day_number)}
            helperText={formErrors.day_number || undefined}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="date" style={LABEL}>Date *</label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={handleChange('date')}
              style={inputStyle(Boolean(formErrors.date))}
            />
            {formErrors.date && <p className="text-sm text-red-500 mt-1">{formErrors.date}</p>}
          </div>
          <div>
            <label htmlFor="start_time" style={LABEL}>Start Time *</label>
            <input
              id="start_time"
              type="time"
              value={form.start_time}
              onChange={handleChange('start_time')}
              style={inputStyle(Boolean(formErrors.start_time))}
            />
            {formErrors.start_time && <p className="text-sm text-red-500 mt-1">{formErrors.start_time}</p>}
          </div>
          <div>
            <label htmlFor="end_time" style={LABEL}>End Time *</label>
            <input
              id="end_time"
              type="time"
              value={form.end_time}
              onChange={handleChange('end_time')}
              style={inputStyle(Boolean(formErrors.end_time))}
            />
            {formErrors.end_time && <p className="text-sm text-red-500 mt-1">{formErrors.end_time}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatInput
            id="program_name"
            label="Program Name *"
            value={form.program_name}
            onChange={handleChange('program_name')}
            error={Boolean(formErrors.program_name)}
            helperText={formErrors.program_name || undefined}
          />
          <FloatInput
            id="pic"
            label="PIC (Person in Charge)"
            value={form.pic}
            onChange={handleChange('pic')}
            error={Boolean(formErrors.pic)}
            helperText={formErrors.pic || 'Leave empty if none, will default to "-".'}
          />
        </div>
      </Card>

      <div className="mt-6">
        <FormActions
          id="program-form"
          cancelText="Cancel"
          submitText="Save"
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
}
