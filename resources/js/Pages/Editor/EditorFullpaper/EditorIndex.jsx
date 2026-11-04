import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import EditorFullpaperTable from './EditorFullpaperTable';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

export default function EditorFullpaperIndexPage({ fullpapers, badgeCounts, search, filters }) {
  const toast = useToast();
  useFlashToast(toast);

  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 4, fontFamily: 'Manrope,sans-serif' }}>
        All Papers
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: '0 0 20px' }}>
        All full papers for the active conference year
      </p>

      <EditorFullpaperTable
        search={search}
        filters={filters}
        fullpapers={fullpapers}
        baseUrl="/reviewer/all-fullpaper"
        showReviews
        emptyText="No full papers found"
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </>
  );
}

EditorFullpaperIndexPage.layout = editorLayout;
