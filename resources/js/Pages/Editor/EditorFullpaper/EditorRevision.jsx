import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import EditorFullpaperTable from './EditorFullpaperTable';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

export default function EditorFullpaperRevisionPage({ fullpapers, badgeCounts, search, filters }) {
  const toast = useToast();
  useFlashToast(toast);

  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 4, fontFamily: 'Manrope,sans-serif' }}>
        Revision Req
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: '0 0 20px' }}>
        Full papers with revision status
      </p>

      <EditorFullpaperTable
        search={search}
        filters={filters}
        showStatusFilter={false}
        fullpapers={fullpapers}
        baseUrl="/reviewer/editor-fullpaper/revision"
        exportScope="revision"
        showReviews
        emptyText="No full papers requiring revision"
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </>
  );
}

EditorFullpaperRevisionPage.layout = editorLayout;
