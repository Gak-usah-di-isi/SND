import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';
import UserPageLayout from '../../../Components/ui/shared/UserPageLayout';
import BackButton from '../../../Components/ui/BackButton';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

export default function UserAbstractsShow({ abstract, formattedAuthors, formattedAffiliations }) {
  const toast = useToast();
  useFlashToast(toast);

  return (
    <UserPageLayout currentPath="/abstracts">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div className="flex items-center gap-3">
          <BackButton onClick={() => router.get('/abstracts')} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
            Detail Abstract
          </h1>
        </div>

        <a
          href={`/abstracts/${abstract.id}/download-pdf`}
          target="_blank"
          rel="noreferrer"
          style={{
            height: 38, padding: '0 18px', borderRadius: 8,
            background: '#0152EA', color: '#fff', textDecoration: 'none',
            fontSize: 13.5, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
            display: 'inline-flex', alignItems: 'center', gap: 7,
          }}
        >
          <Icon icon="solar:file-text-outline" width={16} />
          Open Abstract PDF
        </a>
      </div>

      {/* Paper Card */}
      <div style={{
        background: '#fff', borderRadius: 12,
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: '48px 56px', maxWidth: 900, margin: '0 auto',
      }}>
        {/* Title */}
        <h1 style={{
          textAlign: 'center', fontSize: 22, fontWeight: 700,
          color: '#1F2A3D', fontFamily: 'Manrope,sans-serif',
          lineHeight: 1.4, margin: '0 0 20px',
        }}>
          {abstract.title}
        </h1>

        {/* Authors */}
        {formattedAuthors && (
          <p style={{ textAlign: 'center', fontSize: 15, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: '0 0 12px' }}
            dangerouslySetInnerHTML={{ __html: formattedAuthors }} />
        )}

        {/* Affiliations */}
        {formattedAffiliations && (
          <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', fontFamily: 'Manrope,sans-serif', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 16px' }}
            dangerouslySetInnerHTML={{ __html: formattedAffiliations }} />
        )}

        {/* Corresponding Email */}
        {abstract.corresponding_email && (
          <p style={{ textAlign: 'center', fontSize: 13.5, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: '0 0 24px' }}>
            <strong>Corresponding Email:</strong> {abstract.corresponding_email}
          </p>
        )}

        {/* Abstract heading */}
        <p style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: '0 0 12px' }}>
          Abstract
        </p>

        {/* Body */}
        <div style={{ fontSize: 14, color: '#374151', fontFamily: 'Manrope,sans-serif', lineHeight: 1.8, textAlign: 'justify', margin: '0 0 20px' }}
          dangerouslySetInnerHTML={{ __html: abstract.abstract ? abstract.abstract.replace(/\n/g, '<br/>') : '' }} />

        {/* Keywords */}
        {abstract.keyword && (
          <p style={{ fontSize: 13.5, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: '0 0 8px' }}>
            <strong>Keyword:</strong> {abstract.keyword}
          </p>
        )}

        {/* Symposium */}
        {abstract.symposium && (
          <p style={{ fontSize: 13.5, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
            <strong>Symposium:</strong> {abstract.symposium.name}
          </p>
        )}

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '24px 0 0' }} />
      </div>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </UserPageLayout>
  );
}
