import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../Components/ui/shared/LandingEditorPageLayout';

const modules = [
  { title: 'Steering Committee', url: '/landing/steering', icon: 'solar:presentation-graph-outline' },
  { title: 'Reviewer Committee', url: '/landing/reviewer', icon: 'solar:magnifer-outline' },
  { title: 'Organizing Committee', url: '/landing/organizing', icon: 'solar:users-group-rounded-outline' },
];

export default function CommitteeIndex() {
  return (
    <LandingEditorPageLayout currentPath="/landing/committee">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', margin: 0, fontFamily: 'Manrope,sans-serif' }}>
          Committee Hub
        </h1>
        <p style={{ color: '#6B7280', fontFamily: 'Manrope,sans-serif', marginTop: 8 }}>
          Select a committee module to edit.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
        {modules.map((mod, i) => (
          <Link
            key={i}
            href={mod.url}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: '#fff', padding: 24, borderRadius: 8,
              border: '1px solid #E2E8F0', textDecoration: 'none',
              color: '#1F2A3D', transition: 'all 0.2s',
            }}
            className="hover:shadow-md hover:border-blue-200"
          >
            <div style={{
              width: 48, height: 48, borderRadius: 8, background: '#EFF6FF',
              color: '#0152EA', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Icon icon={mod.icon} width={24} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, fontFamily: 'Manrope,sans-serif' }}>
              {mod.title}
            </span>
          </Link>
        ))}
      </div>
    </LandingEditorPageLayout>
  );
}
