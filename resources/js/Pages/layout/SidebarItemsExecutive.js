// Mirrors the "executive" role menu in resources/views/layouts/partials/sidebar.blade.php
// Only "Summary" is migrated to Inertia for now.
// The rest (Participants, Abstracts, Payments, Reviewers) point to the existing Blade routes.

const tone = (count, activeTone) => ({ count: count ?? 0, tone: (count ?? 0) > 0 ? activeTone : 'gray' });

/**
 * Builds the executive sidebar content.
 * @param {object} counts - badge counters (e.g. pendingPayments)
 */
export function buildSidebarContentExecutive(counts = {}) {
  return [
    {
      id: 1,
      name: 'DASHBOARD',
      items: [
        {
          heading: 'DASHBOARD',
          children: [
            { name: 'Summary', icon: 'solar:chart-square-outline', id: '/executive', url: '/executive' },
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
            { name: 'Participants', icon: 'solar:users-group-two-rounded-outline', id: '/executive/participants', url: '/executive/participants' },
            { name: 'Abstracts',    icon: 'solar:document-text-outline',           id: '/executive/abstracts',    url: '/executive/abstracts' },
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'PAYMENTS',
      items: [
        {
          heading: 'PAYMENTS',
          children: [
            { name: 'Payment', icon: 'solar:wallet-outline', id: '/executive/payments', url: '/executive/payments' },
          ],
        },
      ],
    },
    {
      id: 4,
      name: 'REVIEWERS',
      items: [
        {
          heading: 'REVIEWERS',
          children: [
            { name: 'Reviewers', icon: 'solar:user-outline', id: '/executive/reviewers', url: '/executive/reviewers' },
          ],
        },
      ],
    },
  ];
}

export default buildSidebarContentExecutive;
