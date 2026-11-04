import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import EditorFullpaperTable from './EditorFullpaperTable';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

export default function EditorFullpaperNoReviewerPage({ fullpapers, badgeCounts, search, filters }) {
  const toast = useToast();
  useFlashToast(toast);

  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 4, fontFamily: 'Manrope,sans-serif' }}>
        No Review
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: '0 0 20px' }}>
        Full papers without reviewers or reviewers have not provided comments yet
      </p>

      <EditorFullpaperTable
        search={search}
        filters={filters}
        fullpapers={fullpapers}
        baseUrl="/reviewer/editor-fullpaper/no-reviewer"
        exportScope="no-reviewer"
        showAssign
        emptyText="No full papers need reviewer assignment"
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </>
  );
}

EditorFullpaperNoReviewerPage.layout = editorLayout;
