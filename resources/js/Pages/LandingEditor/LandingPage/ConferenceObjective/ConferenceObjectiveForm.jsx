import { FloatInput } from '../../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../../Components/ui/FloatSelect';
import FormActions from '../../../../Components/ui/FormActions';
import { Card } from '../../../../Components/ui/card';

const ICON_SUGGESTIONS = [
  { value: 'bi bi-globe', label: 'Globe (bi bi-globe)' },
  { value: 'bi bi-people-fill', label: 'People (bi bi-people-fill)' },
  { value: 'bi bi-journal-check', label: 'Journal (bi bi-journal-check)' },
  { value: 'bi bi-lightbulb-fill', label: 'Lightbulb (bi bi-lightbulb-fill)' },
  { value: 'bi bi-award-fill', label: 'Award (bi bi-award-fill)' },
  { value: 'bi bi-recycle', label: 'Recycle (bi bi-recycle)' },
  { value: 'bi bi-diagram-3-fill', label: 'Network (bi bi-diagram-3-fill)' },
  { value: 'bi bi-cpu-fill', label: 'CPU/Tech (bi bi-cpu-fill)' },
  { value: 'bi bi-book-fill', label: 'Book (bi bi-book-fill)' },
  { value: 'bi bi-mortarboard-fill', label: 'Education (bi bi-mortarboard-fill)' },
  { value: 'bi bi-graph-up-arrow', label: 'Growth (bi bi-graph-up-arrow)' },
  { value: 'bi bi-check-circle-fill', label: 'Check (bi bi-check-circle-fill)' },
  { value: 'bi bi-stars', label: 'Stars (bi bi-stars)' },
  { value: 'bi bi-broadcast-pin', label: 'Broadcast (bi bi-broadcast-pin)' },
  { value: 'bi bi-building-check', label: 'Building (bi bi-building-check)' },
];

export default function ConferenceObjectiveForm({
  form,
  setForm,
  formErrors,
  setFormErrors,
  onCancel,
  onSubmit,
}) {
  const activeYear = new Date().getFullYear();

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const iconOpts = ICON_SUGGESTIONS.map(s => ({ value: s.value, label: s.label }));

  return (
    <>
      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
          Objective Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FloatInput
            id="year"
            label="Year *"
            type="number"
            value={form.year}
            onChange={e => handleChange('year', e.target.value)}
            error={Boolean(formErrors.year)}
            helperText={formErrors.year}
          />
          <FloatInput
            id="order_number"
            label="Order Number"
            type="number"
            value={form.order_number}
            onChange={e => handleChange('order_number', e.target.value)}
            error={Boolean(formErrors.order_number)}
            helperText={formErrors.order_number || 'Lower number appears first'}
          />
        </div>

        {/* Icon selector */}
        <div className="mb-4">
          <FloatSelect
            id="icon"
            label="Icon *"
            value={form.icon}
            options={iconOpts}
            onChange={val => handleChange('icon', val)}
            error={Boolean(formErrors.icon)}
            helperText={formErrors.icon}
          />
          {/* Preview selected icon */}
          {form.icon && (
            <div className="flex items-center gap-2 mt-2">
              <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Manrope, sans-serif' }}>Preview:</span>
              <i
                className={form.icon}
                style={{ fontSize: 22, color: '#0152EA' }}
                title={form.icon}
              />
              <code style={{ fontSize: 12, color: '#94A3B8' }}>{form.icon}</code>
            </div>
          )}
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4, fontFamily: 'Manrope, sans-serif' }}>
            Choose from the list or type a custom{' '}
            <a href="https://icons.getbootstrap.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0152EA' }}>
              Bootstrap Icons
            </a>{' '}
            class.
          </p>
        </div>

        {/* Content */}
        <div className="mb-4">
          <FloatInput
            id="content"
            label="Objective Content *"
            multiline
            rows={3}
            value={form.content}
            onChange={e => handleChange('content', e.target.value)}
            error={Boolean(formErrors.content)}
            helperText={formErrors.content || `${(form.content || '').length}/500 chars`}
          />
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-3 mt-2">
          <label
            htmlFor="is_active_toggle"
            style={{ fontSize: 14, fontWeight: 500, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}
          >
            Active (visible on landing page)
          </label>
          <button
            id="is_active_toggle"
            type="button"
            role="switch"
            aria-checked={form.is_active}
            onClick={() => handleChange('is_active', !form.is_active)}
            style={{
              position: 'relative', display: 'inline-flex', alignItems: 'center',
              width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: form.is_active ? '#0152EA' : '#D1D5DB',
              transition: 'background 0.2s',
            }}
          >
            <span style={{
              position: 'absolute', top: 2,
              left: form.is_active ? 22 : 2,
              width: 20, height: 20, borderRadius: '50%', background: '#fff',
              transition: 'left 0.2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            }} />
          </button>
        </div>
      </Card>

      <div className="mt-6">
        <FormActions
          id="objective-form"
          cancelText="Cancel"
          submitText="Save"
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
}
