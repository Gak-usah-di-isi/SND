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
  ];

  // Reviewer biasa hanya melihat menu review miliknya sendiri — grup
  // "EDITOR: ABSTRACT" khusus editor/chief-editor.
  return isEditor
    ? sections
    : sections.filter(s => !s.name.startsWith('EDITOR:'));
}

// Static default (no badges) — kept for consumers that don't have counts on hand yet.
const SidebarContentEditor = buildSidebarContentEditor();

export default SidebarContentEditor;
