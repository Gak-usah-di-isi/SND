let _id = 0;
const uniqueId = () => String(++_id);

// Mirrors the "landing-editor" role menu in resources/views/layouts/partials/sidebar.blade.php
const SidebarContentLandingEditor = [
  {
    id: 1,
    name: 'BRANDING',
    items: [
      {
        heading: 'BRANDING',
        children: [
          { name: 'Logo',         icon: 'solar:gallery-outline',      id: uniqueId(), url: '/landing/logos' },
          { name: 'Landing Page', icon: 'solar:home-2-outline',       id: uniqueId(), url: '/landing/landingpage' },
          { name: 'Call for Paper', icon: 'solar:checklist-outline',  id: uniqueId(), url: '/landing/themes' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'COMMITTEE & SUBMISSION',
    items: [
      {
        heading: 'COMMITTEE & SUBMISSION',
        children: [
          { name: 'Committee',            icon: 'solar:users-group-two-rounded-outline', id: uniqueId(), url: '/landing/committee' },
          { name: 'Submission Guidelines', icon: 'solar:document-text-outline',          id: uniqueId(), url: '/landing/submission' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'CONFERENCE',
    items: [
      {
        heading: 'CONFERENCE',
        children: [
          { name: 'Conference Program',     icon: 'solar:calendar-outline',       id: uniqueId(), url: '/landing/conferencelanding' },
          { name: 'Previous Conference',    icon: 'solar:calendar-mark-outline',  id: uniqueId(), url: '/landing/prevconference' },
          { name: 'Gallery',               icon: 'solar:gallery-wide-outline',   id: uniqueId(), url: '/landing/gallery' },
          { name: 'Conference Objectives', icon: 'solar:target-outline',         id: uniqueId(), url: '/landing/conference-objectives' },
          { name: 'Payment Guidelines',    icon: 'solar:wallet-money-outline',   id: uniqueId(), url: '/landing/payment_guidelines' },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'COMMUNICATION',
    items: [
      {
        heading: 'COMMUNICATION',
        children: [
          { name: 'FAQ',         icon: 'solar:question-circle-outline', id: uniqueId(), url: '/landing/faq' },
          { name: 'Hotel & Accom.', icon: 'solar:bed-outline',           id: uniqueId(), url: '/landing/hotels' },
          { name: 'Whatsapp',    icon: 'solar:chat-round-outline',      id: uniqueId(), url: '/landing/whatsapp' },
          { name: 'Instagram',   icon: 'solar:camera-outline',          id: uniqueId(), url: '/landing/instagram' },
          { name: 'Newsletter',  icon: 'solar:letter-outline',          id: uniqueId(), url: '/landing/newsletters' },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'SETTINGS',
    items: [
      {
        heading: 'SETTINGS',
        children: [
          { name: 'Setting', icon: 'solar:settings-outline', id: uniqueId(), url: '/landing/setting' },
        ],
      },
    ],
  },
];

export default SidebarContentLandingEditor;
