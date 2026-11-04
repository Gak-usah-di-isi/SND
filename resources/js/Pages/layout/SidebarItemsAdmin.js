let _id = 0;
const uniqueId = () => String(++_id);

const SidebarContentAdmin = [
  {
    id: 1,
    name: 'DASHBOARD',
    items: [
      {
        heading: 'DASHBOARD',
        children: [
          { name: 'Summary', icon: 'solar:chart-square-outline', id: uniqueId(), url: '/admin/summary' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'PARTICIPANTS',
    items: [
      {
        heading: 'PARTICIPANTS',
        children: [
          { name: 'Participants',      icon: 'solar:users-group-two-rounded-outline', id: uniqueId(), url: '/admin/participant' },
          { name: 'Abstracts',         icon: 'solar:document-text-outline',           id: uniqueId(), url: '/admin/abstract' },
          { name: 'Oral Distribution', icon: 'solar:microphone-3-outline',            id: uniqueId(), url: '/admin/oral' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'SDGs & TEMA',
    items: [
      {
        heading: 'SDGs & TEMA',
        children: [
          { name: 'Tema SDGs',          icon: 'solar:leaf-outline',                   id: uniqueId(), url: '/admin/sdgs' },
          { name: 'Symposiums',         icon: 'solar:window-frame-outline',           id: uniqueId(), url: '/admin/symposium' },
          { name: 'Presentation Types', icon: 'solar:presentation-graph-outline',     id: uniqueId(), url: '/admin/presentation-type' },
          { name: 'Abstracts Book',     icon: 'solar:notebook-outline',               id: uniqueId(), url: '/admin/abstract-book' },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'PAYMENTS',
    items: [
      {
        heading: 'PAYMENTS',
        children: [
          { name: 'Payment',      icon: 'solar:wallet-outline',             id: uniqueId(), url: '/admin/payment' },
          { name: 'Certificates', icon: 'solar:medal-ribbons-star-outline', id: uniqueId(), url: '/admin/certificates' },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'REVIEWERS',
    items: [
      {
        heading: 'REVIEWERS',
        children: [
          { name: 'Reviewers', icon: 'solar:user-outline',    id: uniqueId(), url: '/admin/reviewer' },
          { name: 'Email CSV', icon: 'solar:mailbox-outline', id: uniqueId(), url: '/admin/email-csv' },
        ],
      },
    ],
  },
  {
    id: 6,
    name: 'FILES',
    items: [
      {
        heading: 'FILES',
        children: [
          { name: 'Files & Documents', icon: 'solar:file-text-outline', id: uniqueId(), url: '/admin/download-files' },
        ],
      },
    ],
  },
  {
    id: 7,
    name: 'SETTINGS',
    items: [
      {
        heading: 'SETTINGS',
        children: [
          { name: 'Setting',                icon: 'solar:settings-outline',   id: uniqueId(), url: '/admin/settings' },
          { name: 'Edit Email Template',    icon: 'solar:mailbox-outline',    id: uniqueId(), url: '/admin/email-template' },
          { name: 'Regenerate Certificate', icon: 'solar:refresh-outline',    id: uniqueId(), url: '/admin/regenerate-certificate' },
        ],
      },
    ],
  },
  {
    id: 8,
    name: 'BROADCAST',
    items: [
      {
        heading: 'BROADCAST',
        children: [
          { name: 'Send Invitation', icon: 'solar:letter-outline', id: uniqueId(), url: '/admin/broadcast/invitation' },
          { name: 'Send Parallel Session', icon: 'solar:calendar-outline', id: uniqueId(), url: '/admin/broadcast/parallel-session' },
          { name: 'Send Reminder', icon: 'solar:bell-outline', id: uniqueId(), url: '/admin/broadcast/reminder' },
        ],
      },
    ],
  },
];

export default SidebarContentAdmin;
