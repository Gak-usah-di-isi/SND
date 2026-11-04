import { Icon } from '@iconify/react';
import AdminPageLayout from '../../../Components/ui/shared/AdminPageLayout';
import SekretarisPageLayout from '../../../Components/ui/shared/SekretarisPageLayout';
import HumasPageLayout from '../../../Components/ui/shared/HumasPageLayout';
import BackButton from '../../../Components/ui/BackButton';

export default function ShowAbstractPage({ abstract, from }) {
  const isSekretaris = from === 'sekretaris' || (typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/sekretaris') ||
    new URLSearchParams(window.location.search).get('role') === 'sekretaris' ||
    document.referrer.includes('/sekretaris')
  ));

  const isHumas = from === 'humas' || (typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/humas') ||
    new URLSearchParams(window.location.search).get('role') === 'humas' ||
    document.referrer.includes('/humas')
  ));

  const isFromAbstract = from === 'abstract' ||
    (typeof window !== 'undefined' && (
      new URLSearchParams(window.location.search).get('from') === 'abstract' ||
      document.referrer.includes('/admin/abstract') ||
      document.referrer.includes('/sekretaris/abstract') ||
      document.referrer.includes('/humas/abstract')
    ));

  const currentPath = isHumas
    ? (isFromAbstract ? '/humas/abstracts' : '/humas/participants')
    : isSekretaris
    ? (isFromAbstract ? '/sekretaris/abstracts' : '/sekretaris/participants')
    : (isFromAbstract ? '/admin/abstract' : '/admin/participant');

  const Layout = isHumas ? HumasPageLayout : (isSekretaris ? SekretarisPageLayout : AdminPageLayout);

  const fallbackBackUrl = isHumas
    ? (isFromAbstract ? '/humas/abstracts' : '/humas/participants')
    : isSekretaris
    ? (isFromAbstract ? '/sekretaris/abstracts' : '/sekretaris/participants')
    : (isFromAbstract ? '/admin/abstract' : '/admin/participant');

  const downloadUrl = isHumas
    ? `/humas/abstracts-participant/${abstract.id}/download`
    : isSekretaris
    ? `/sekretaris/abstracts-participant/${abstract.id}/download`
    : `/admin/abstracts-participant/${abstract.id}/download`;

  return (
    <Layout currentPath={currentPath}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div className="flex items-center gap-3">
          <BackButton onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = fallbackBackUrl;
            }
          }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
            Abstract Details
          </h1>
        </div>

        <a
          href={downloadUrl}
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
        {abstract.formattedAuthors && (
          <p style={{ textAlign: 'center', fontSize: 15, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: '0 0 12px' }}
            dangerouslySetInnerHTML={{ __html: abstract.formattedAuthors }} />
        )}

        {/* Affiliations */}
        {abstract.formattedAffiliations && (
          <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', fontFamily: 'Manrope,sans-serif', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 16px' }}
            dangerouslySetInnerHTML={{ __html: abstract.formattedAffiliations }} />
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
          <p style={{ fontSize: 13.5, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: '0 0 20px' }}>
            <strong>Keywords:</strong> {abstract.keyword}
          </p>
        )}

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '24px 0 0' }} />
      </div>
    </Layout>
  );
}
