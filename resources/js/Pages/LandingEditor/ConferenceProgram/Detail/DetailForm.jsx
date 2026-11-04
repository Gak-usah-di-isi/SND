import { FloatInput } from '../../../../Components/ui/FloatInput';
import FormActions from '../../../../Components/ui/FormActions';
import { Card } from '../../../../Components/ui/card';

const SECTION_TITLE = { fontSize: 16, fontWeight: 600, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' };

export default function DetailForm({ form, setForm, formErrors, setFormErrors, onCancel, onSubmit }) {
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <>
      <Card>
        <p style={SECTION_TITLE}>Conference Detail Data</p>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <FloatInput
            id="title"
            label="Title *"
            placeholder="e.g. Rundown The 4th ICASVE 2025"
            value={form.title}
            onChange={handleChange('title')}
            error={Boolean(formErrors.title)}
            helperText={formErrors.title || undefined}
          />
          <FloatInput
            id="theme"
            label="Theme *"
            placeholder="e.g. International Conference on Applied Science for Vocational Education"
            value={form.theme}
            onChange={handleChange('theme')}
            error={Boolean(formErrors.theme)}
            helperText={formErrors.theme || undefined}
          />
          <FloatInput
            id="university"
            label="University *"
            placeholder="e.g. Hybrid Conference | Faculty of Vocational Studies, Universitas Brawijaya"
            value={form.university}
            onChange={handleChange('university')}
            error={Boolean(formErrors.university)}
            helperText={formErrors.university || undefined}
          />
          <FloatInput
            id="hosted"
            label="Hosted *"
            placeholder="e.g. Co-hosted by State Polytechnic of Batam & State University of Malang"
            value={form.hosted}
            onChange={handleChange('hosted')}
            error={Boolean(formErrors.hosted)}
            helperText={formErrors.hosted || undefined}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatInput
            id="date"
            label="Date *"
            placeholder="e.g. 12–14 August 2025"
            value={form.date}
            onChange={handleChange('date')}
            error={Boolean(formErrors.date)}
            helperText={formErrors.date || 'Free text format, e.g. date range.'}
          />
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
        </div>
      </Card>

      <div className="mt-6">
        <FormActions
          id="conference-detail-form"
          cancelText="Cancel"
          submitText="Save"
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
}
