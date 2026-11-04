import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import FullpaperTable from './FullpaperTable';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

export default function EditorPaperCompletedPage({ fullPapers = [], badgeCounts }) {
  const toast = useToast();
  useFlashToast(toast);

  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 4, fontFamily: 'Manrope,sans-serif' }}>
        Paper Completed
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: '0 0 20px' }}>
        Full papers that have completed review (accepted)
      </p>

      <FullpaperTable
        fullPapers={fullPapers}
        emptyText="No full papers completed review yet"
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </>
  );
}

EditorPaperCompletedPage.layout = editorLayout;
