let _id = 0;
const uniqueId = () => String(++_id);

const SidebarContentBendahara = [
  {
    id: 1,
    name: 'DASHBOARD',
    items: [
      {
        heading: 'DASHBOARD',
        children: [
          { name: 'Summary', icon: 'solar:chart-square-outline', id: uniqueId(), url: '/bendahara/summary' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'PAYMENTS',
    items: [
      {
        heading: 'PAYMENTS',
        children: [
          { name: 'Payments', icon: 'solar:wallet-outline', id: uniqueId(), url: '/bendahara/payments' },
        ],
      },
    ],
  },
];

export default SidebarContentBendahara;
