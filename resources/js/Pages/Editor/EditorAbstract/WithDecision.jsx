import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import EditorAbstractTable from './EditorAbstractTable';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

export default function EditorAbstractWithDecisionPage({ abstracts, badgeCounts, search, filters }) {
  const toast = useToast();
  useFlashToast(toast);

  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 4, fontFamily: 'Manrope,sans-serif' }}>
        With Decision
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: '0 0 20px' }}>
        Abstracts that have been accepted
      </p>

      <EditorAbstractTable
        search={search}
        filters={filters}
        showStatusFilter={false}
        abstracts={abstracts}
        baseUrl="/reviewer/editor-abstract/with-decision"
        showReviews
        emptyText="No accepted abstracts yet"
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </>
  );
}

EditorAbstractWithDecisionPage.layout = editorLayout;
