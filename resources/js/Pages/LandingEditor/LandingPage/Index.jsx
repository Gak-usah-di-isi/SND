import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../Components/ui/shared/LandingEditorPageLayout';

const modules = [
  { title: 'Title', url: '/landing/conference-title', icon: 'solar:text-square-outline' },
  { title: 'About', url: '/landing/abouts', icon: 'solar:info-circle-outline' },
  { title: 'Speakers', url: '/landing/speakers', icon: 'solar:users-group-rounded-outline' },
  { title: 'Poster', url: '/landing/poster', icon: 'solar:gallery-outline' },
  { title: 'Deadline Dates', url: '/landing/deadlines', icon: 'solar:calendar-date-outline' },
  { title: 'Registration Fee', url: '/landing/registrationFee', icon: 'solar:wallet-money-outline' },
  { title: 'Venue', url: '/landing/venue', icon: 'solar:map-point-outline' },
  { title: 'Publications Journal', url: '/landing/publications-journal', icon: 'solar:document-text-outline' },
  { title: 'Conference Objectives', url: '/landing/conference-objectives', icon: 'solar:target-outline' },
  { title: 'Contact', url: '/landing/contact', icon: 'solar:chat-round-line-outline' },
];

export default function LandingPageIndex() {
  return (
    <LandingEditorPageLayout currentPath="/landing/landingpage">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', margin: 0, fontFamily: 'Manrope,sans-serif' }}>
          Landing Page Hub
        </h1>
        <p style={{ color: '#6B7280', fontFamily: 'Manrope,sans-serif', marginTop: 8 }}>
          Select a landing page module to edit.
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
