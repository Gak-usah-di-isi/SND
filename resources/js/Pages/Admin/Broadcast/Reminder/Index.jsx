import { useState } from 'react';
import AdminPageLayout from '../../../../Components/ui/shared/AdminPageLayout';
import TemplateTab from './TemplateTab';
import BroadcastTab from './BroadcastTab';
import HistoryTab from './HistoryTab';
import TestTab from './TestTab';

const TABS = [
  { key: 'template', label: 'Template & Preview' },
  { key: 'broadcast', label: 'Send Broadcast' },
  { key: 'history', label: 'Delivery History' },
  { key: 'test', label: 'Test Send' },
];

export default function BroadcastReminderIndexPage({
  template,
  history,
  historyStats,
  historyFilters,
  roleOptions = {},
}) {
  const [activeTab, setActiveTab] = useState('template');

  return (
    <AdminPageLayout currentPath="/admin/broadcast/reminder">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 6, fontFamily: 'Manrope, sans-serif' }}>
        Broadcast — Send Reminder
      </h1>
      <p style={{ fontSize: 13.5, color: '#64748B', marginBottom: 24, fontFamily: 'Manrope, sans-serif' }}>
        Manage payment reminder email templates, send to unverified payment participants based on role, and monitor delivery history here.
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

      {activeTab === 'template' && (
        <TemplateTab template={template} />
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
