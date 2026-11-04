import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import AbstractTable from './AbstractTable';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

export default function EditorReviewAbstractIndexPage({ abstracts = [], badgeCounts }) {
  const toast = useToast();
  useFlashToast(toast);

  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope,sans-serif' }}>
        Review Abstract
      </h1>

      <AbstractTable
        abstracts={abstracts}
        showAction
        emptyText="No abstracts assigned for review yet"
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </>
  );
}

EditorReviewAbstractIndexPage.layout = editorLayout;
