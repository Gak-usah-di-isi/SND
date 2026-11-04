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
            ? [{ name: 'Abstract', icon: 'solar:document-text-outline', id: uniqueId(), url: '/abstracts' }]
            : []),
          ...(showAbstract && showFinalPaper
            ? [{ name: 'Final Paper', icon: 'solar:diploma-verified-outline', id: uniqueId(), url: '/final-paper' }]
            : []),
          { name: 'Payment', icon: 'solar:wallet-outline', id: uniqueId(), url: '/payment' },
        ],
      },
    ],
  },
];

export default SidebarContentUser;
