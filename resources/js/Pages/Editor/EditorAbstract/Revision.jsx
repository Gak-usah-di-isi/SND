import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import EditorAbstractTable from './EditorAbstractTable';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

export default function EditorAbstractRevisionPage({ abstracts, badgeCounts, search, filters }) {
  const toast = useToast();
  useFlashToast(toast);

  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 4, fontFamily: 'Manrope,sans-serif' }}>
        Revision Req
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: '0 0 20px' }}>
        Abstracts with revision status
      </p>

      <EditorAbstractTable
        search={search}
        filters={filters}
        showStatusFilter={false}
        abstracts={abstracts}
        baseUrl="/reviewer/editor-abstract/revision"
        showReviews
        emptyText="No abstracts requiring revision"
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </>
  );
}

EditorAbstractRevisionPage.layout = editorLayout;
