import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import EditorFullpaperTable from './EditorFullpaperTable';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

export default function EditorFullpaperWithDecisionPage({ fullpapers, badgeCounts, search, filters }) {
  const toast = useToast();
  useFlashToast(toast);

  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 4, fontFamily: 'Manrope,sans-serif' }}>
        With Decision
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: '0 0 20px' }}>
        Full papers that have been accepted
      </p>

      <EditorFullpaperTable
        search={search}
        filters={filters}
        showStatusFilter={false}
        fullpapers={fullpapers}
        baseUrl="/reviewer/editor-fullpaper/with-decision"
        exportScope="with-decision"
        showReviews
        emptyText="No accepted full papers yet"
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </>
  );
}

EditorFullpaperWithDecisionPage.layout = editorLayout;
