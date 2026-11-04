// Mirrors the "editor" / "chief-editor" role menu in resources/views/layouts/partials/sidebar.blade.php
// Only "Summary" and "Review Abstract" are migrated to Inertia for now.
// The rest still point to the existing Blade routes and will do a full page navigation.

// tone: same palette language as the BADGE map in Pages/Admin/Summary/Index.jsx
const tone = (count, activeTone) => ({ count: count ?? 0, tone: (count ?? 0) > 0 ? activeTone : 'gray' });

/**
 * Builds the editor/chief-editor sidebar content.
 * `id` is derived from `url` (stable across re-renders) — NOT an incrementing
 * counter, which would mint a new id on every call and force React to
 * remount every sidebar row (visible as flicker) each time this is rebuilt
 * on re-render, e.g. while typing in a form on the page.
 * @param {object} counts - raw counters from the controller (see SummaryReviewerController::sidebarBadgeCounts)
 */
export function buildSidebarContentEditor(counts = {}, isEditor = true) {
  const sections = [
    {
      id: 1,
      name: 'DASHBOARD',
      items: [
        {
          heading: 'DASHBOARD',
          children: [
            { name: 'Summary', icon: 'solar:chart-square-outline', id: '/reviewer/summary', url: '/reviewer/summary' },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'ABSTRACT REVIEW',
      items: [
        {
          heading: 'ABSTRACT REVIEW',
          children: [
            { name: 'Review Abstract',    icon: 'solar:document-text-outline', id: '/reviewer/review-abstract',           url: '/reviewer/review-abstract',           badge: tone(counts.reviewAbstract, 'red') },
            { name: 'Abstract Completed', icon: 'solar:check-circle-outline',  id: '/reviewer/review-abstract-completed', url: '/reviewer/review-abstract-completed', badge: tone(counts.abstractCompleted, 'green') },
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'FULLPAPER REVIEW',
      items: [
        {
          heading: 'FULLPAPER REVIEW',
          children: [
            { name: 'Review Fullpaper', icon: 'solar:document-outline',   id: '/reviewer/review-fullpaper',           url: '/reviewer/review-fullpaper',           badge: tone(counts.reviewFullpaper, 'red') },
            { name: 'Paper Completed',  icon: 'solar:check-read-outline', id: '/reviewer/review-fullpaper-completed', url: '/reviewer/review-fullpaper-completed', badge: tone(counts.paperCompleted, 'green') },
          ],
        },
      ],
    },
    {
      id: 4,
      name: 'EDITOR: ABSTRACT',
      items: [
        {
          heading: 'EDITOR: ABSTRACT',
          children: [
            { name: 'No Review',       icon: 'solar:close-circle-outline',            id: '/reviewer/editor-abstract/no-reviewer',   url: '/reviewer/editor-abstract/no-reviewer',   badge: tone(counts.abstractNoReview, 'red') },
            { name: 'Revision Req',    icon: 'solar:pen-outline',                     id: '/reviewer/editor-abstract/revision',       url: '/reviewer/editor-abstract/revision',       badge: tone(counts.abstractRevision, 'amber') },
            { name: 'No Decision',     icon: 'solar:hourglass-outline',               id: '/reviewer/editor-abstract/no-decision',    url: '/reviewer/editor-abstract/no-decision',    badge: tone(counts.abstractNoDecision, 'cyan') },
            { name: 'With Decision',   icon: 'solar:check-circle-outline',            id: '/reviewer/editor-abstract/with-decision',  url: '/reviewer/editor-abstract/with-decision',  badge: { count: counts.abstractWithDecision ?? 0, tone: 'green' } },
            { name: 'All Abstract',    icon: 'solar:file-outline',                    id: '/reviewer/all-abstract',                   url: '/reviewer/all-abstract',                   badge: tone(counts.allAbstract, 'blue') },
            { name: 'Review Workload', icon: 'solar:checklist-minimalistic-outline',  id: '/reviewer/abstract-workload',              url: '/reviewer/abstract-workload' },
          ],
        },
      ],
    },
    {
      id: 5,
      name: 'EDITOR: PAPER',
      items: [
        {
          heading: 'EDITOR: PAPER',
          children: [
            { name: 'No Review',       icon: 'solar:close-circle-outline',            id: '/reviewer/editor-fullpaper/no-reviewer',   url: '/reviewer/editor-fullpaper/no-reviewer',   badge: tone(counts.paperNoReview, 'red') },
            { name: 'Revision Req',    icon: 'solar:pen-outline',                     id: '/reviewer/editor-fullpaper/revision',       url: '/reviewer/editor-fullpaper/revision',       badge: tone(counts.paperRevision, 'amber') },
            { name: 'No Decision',     icon: 'solar:hourglass-outline',               id: '/reviewer/editor-fullpaper/no-decision',    url: '/reviewer/editor-fullpaper/no-decision',    badge: tone(counts.paperNoDecision, 'cyan') },
            { name: 'With Decision',   icon: 'solar:check-circle-outline',            id: '/reviewer/editor-fullpaper/with-decision',  url: '/reviewer/editor-fullpaper/with-decision',  badge: { count: counts.paperWithDecision ?? 0, tone: 'green' } },
            { name: 'All Papers',      icon: 'solar:file-outline',                    id: '/reviewer/all-fullpaper',                   url: '/reviewer/all-fullpaper',                   badge: tone(counts.allPapers, 'blue') },
            { name: 'Review Workload', icon: 'solar:checklist-minimalistic-outline',  id: '/reviewer/fullpaper-workload',              url: '/reviewer/fullpaper-workload' },
          ],
        },
      ],
    },
  ];

  // Reviewer biasa hanya melihat menu review miliknya sendiri — grup
  // "EDITOR: ABSTRACT" & "EDITOR: PAPER" khusus editor/chief-editor,
  // sama seperti pemisahan @role di resources/views/layouts/partials/sidebar.blade.php.
  return isEditor
    ? sections
    : sections.filter(s => !s.name.startsWith('EDITOR:'));
}

// Static default (no badges) — kept for consumers that don't have counts on hand yet.
const SidebarContentEditor = buildSidebarContentEditor();

export default SidebarContentEditor;
