let _id = 0;
const uniqueId = () => String(++_id);

// Presenters (indonesia-presenter, foreign-presenter) get Dashboard + Abstract + Payment.
// Plain participants (indonesia-participants, foreign-participants) get Dashboard + Payment only,
// mirroring the two @role blocks in resources/views/layouts/partials/sidebar.blade.php.
const SidebarContentUser = (showAbstract = true, showFinalPaper = false) => [
  {
    id: 1,
    name: 'MENU',
    items: [
      {
        heading: 'MENU',
        children: [
          { name: 'Dashboard', icon: 'solar:widget-outline', id: uniqueId(), url: '/dashboard' },
          ...(showAbstract
            ? [{ name: 'Abstrak', icon: 'solar:document-text-outline', id: uniqueId(), url: '/abstracts' }]
            : []),
          { name: 'Pembayaran', icon: 'solar:wallet-outline', id: uniqueId(), url: '/payment' },
        ],
      },
    ],
  },
];

export default SidebarContentUser;
