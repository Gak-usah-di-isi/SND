import { useState } from 'react';
import AdminPageLayout from '../../../../Components/ui/shared/AdminPageLayout';
import EmailTemplateTab from './EmailTemplateTab';
import PdfTemplateTab from './PdfTemplateTab';
import BroadcastTab from './BroadcastTab';
import HistoryTab from './HistoryTab';
import TestTab from './TestTab';

const TABS = [
  { key: 'email-template', label: 'Email Template' },
  { key: 'pdf-template', label: 'PDF Template' },
  { key: 'broadcast', label: 'Send Broadcast' },
  { key: 'history', label: 'Delivery History' },
  { key: 'test', label: 'Test Send' },
];

export default function BroadcastInvitationIndexPage({
  template,
  rundownItems = [],
  history,
  historyStats,
  historyFilters,
  roleOptions = {},
}) {
  const [activeTab, setActiveTab] = useState('email-template');

  return (
    <AdminPageLayout currentPath="/admin/broadcast/invitation">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 6, fontFamily: 'Manrope, sans-serif' }}>
        Broadcast — Send Invitation
      </h1>
      <p style={{ fontSize: 13.5, color: '#64748B', marginBottom: 24, fontFamily: 'Manrope, sans-serif' }}>
        Manage invitation templates (email &amp; PDF), send to participants based on role and payment status, and monitor delivery history here.
      </p>

      <div className="flex border-b border-gray-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className="px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px"
            style={{
              borderColor: activeTab === t.key ? '#0152EA' : 'transparent',
              color: activeTab === t.key ? '#0152EA' : '#64748B',
              background: 'none',
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'email-template' && (
        <EmailTemplateTab template={template} rundownItems={rundownItems} />
      )}

      {activeTab === 'pdf-template' && (
        <PdfTemplateTab template={template} rundownItems={rundownItems} />
      )}

      {activeTab === 'broadcast' && (
        <BroadcastTab roleOptions={roleOptions} />
      )}

      {activeTab === 'history' && (
        <HistoryTab
          history={history}
          stats={historyStats}
          filters={historyFilters}
          roleOptions={roleOptions}
        />
      )}

      {activeTab === 'test' && (
        <TestTab roleOptions={roleOptions} />
      )}
    </AdminPageLayout>
  );
}
