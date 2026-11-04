let _id = 0;
const uniqueId = () => String(++_id);

const SidebarContentSekretaris = [
  {
    id: 1,
    name: 'DASHBOARD',
    items: [
      {
        heading: 'DASHBOARD',
        children: [
          { name: 'Summary', icon: 'solar:chart-square-outline', id: uniqueId(), url: '/sekretaris/summary' },
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
          { name: 'Participants', icon: 'solar:users-group-two-rounded-outline', id: uniqueId(), url: '/sekretaris/participants' },
          { name: 'Abstracts', icon: 'solar:document-text-outline', id: uniqueId(), url: '/sekretaris/abstracts' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'SYMPOSIUM',
    items: [
      {
        heading: 'SYMPOSIUM',
        children: [
          { name: 'Abstracts Book', icon: 'solar:book-bookmark-outline', id: uniqueId(), url: '/sekretaris/abstract-book' },
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
          { name: 'Payments', icon: 'solar:wallet-outline', id: uniqueId(), url: '/sekretaris/payments' },
          { name: 'Certificates', icon: 'solar:diploma-outline', id: uniqueId(), url: '/sekretaris/certificates' },
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
          { name: 'Reviewers', icon: 'solar:user-outline', id: uniqueId(), url: '/sekretaris/reviewers' },
          { name: 'Email CSV', icon: 'solar:letter-unread-outline', id: uniqueId(), url: '/sekretaris/email-csv' },
        ],
      },
    ],
  },
];

export default SidebarContentSekretaris;
