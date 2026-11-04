import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import EditorAbstractTable from './EditorAbstractTable';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

export default function EditorAbstractIndexPage({ abstracts, badgeCounts, search, filters }) {
  const toast = useToast();
  useFlashToast(toast);

  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 4, fontFamily: 'Manrope,sans-serif' }}>
        All Abstract
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: '0 0 20px' }}>
        All abstracts for the active conference year
      </p>

      <EditorAbstractTable
        search={search}
        filters={filters}
        abstracts={abstracts}
        baseUrl="/reviewer/all-abstract"
        showReviews
        emptyText="No abstracts found"
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </>
  );
}

EditorAbstractIndexPage.layout = editorLayout;
