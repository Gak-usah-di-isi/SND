import { usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import UserPageLayout from '../../../Components/ui/shared/UserPageLayout';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

const CARD = { background: '#fff', borderRadius: 12, boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)', padding: 24 };
const LABEL = { fontSize: 13, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', margin: '0 0 8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' };
const VALUE = { fontSize: 20, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 };

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="flex items-center justify-between">
        <p style={LABEL}>{label}</p>
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${color}1A` }}>
          <Icon icon={icon} width={18} style={{ color }} />
        </div>
      </div>
      <p style={VALUE}>{value}</p>
    </div>
  );
}

export default function UserDashboardIndex({
  user,
  isFullPaperAccepted,
  hasAcceptedWithoutPayment,
  commitmentLetterUrl,
  showParticipantCertificate,
  showPresenterCertificate,
  participantCertificateUrl,
  presenterCertificateUrl,
}) {
  const toast = useToast();
  useFlashToast(toast);

  const { authUser, authRoles, features } = usePage().props;
  const roleLabel = authRoles?.[0]
    ? authRoles[0].charAt(0).toUpperCase() + authRoles[0].slice(1)
    : 'User';

  const abstract = user?.abstracts?.[0] ?? null;
  const fullPaper = abstract?.full_paper ?? null;
  const filePayment = user?.file_payment ?? null;

  return (
    <UserPageLayout currentPath="/dashboard">
      {hasAcceptedWithoutPayment && (
        <div
          className="flex items-center gap-3 mb-5"
          style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '14px 18px' }}
        >
          <Icon icon="solar:danger-triangle-bold" width={22} style={{ color: '#F59E0B', flexShrink: 0 }} />
          <p style={{ fontSize: 13.5, color: '#92400E', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
            <strong>Warning!</strong> Your abstract has been <strong>accepted</strong>, but you have not completed the payment.{' '}
            <a href="/payment" style={{ color: '#0152EA', fontWeight: 600, textDecoration: 'underline' }}>
              Click here to proceed with payment
            </a>.
          </p>
        </div>
      )}

      <div className="mb-6">
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
          Welcome {authUser?.name}
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Manrope, sans-serif', margin: '4px 0 0' }}>
          You are logged in as <span style={{ color: '#0152EA', fontWeight: 600 }}>{roleLabel}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Payment Status"
          value={filePayment ? filePayment.status : 'Not Paid'}
          icon="solar:wallet-outline"
          color="#0152EA"
        />
        <StatCard
          label="Abstract Status"
          value={abstract ? abstract.status : 'Not Created'}
          icon="solar:document-text-outline"
          color="#8B5CF6"
        />
        <StatCard
          label="Full Paper Status"
          value={fullPaper ? fullPaper.status : 'Not Uploaded'}
          icon="solar:file-check-outline"
          color="#F59E0B"
        />
      </div>

      <div style={{ ...CARD, marginBottom: 24 }}>
        <p style={LABEL}>Full Paper</p>
        {fullPaper ? (
          <div className="flex flex-col gap-2.5">
            <a
              href={`/storage/${fullPaper.file_path}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2"
              style={{ color: '#0152EA', fontFamily: 'Manrope,sans-serif', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
            >
              <Icon icon="solar:download-outline" width={20} />
              Download Full Paper (Draft)
            </a>
            {fullPaper.camera_ready_path && (
              <a
                href={`/storage/${fullPaper.camera_ready_path}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2"
                style={{ color: '#0152EA', fontFamily: 'Manrope,sans-serif', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
              >
                <Icon icon="solar:diploma-verified-outline" width={20} />
                Download Camera-Ready / Final Paper
              </a>
            )}
            {features?.commitment_letter && fullPaper.commitment_letter_path && (
              <a
                href={`/storage/${fullPaper.commitment_letter_path}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2"
                style={{ color: '#6366F1', fontFamily: 'Manrope,sans-serif', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
              >
                <Icon icon="solar:document-text-outline" width={20} />
                Download Submitted Commitment Letter
              </a>
            )}
          </div>
        ) : (
          <p style={{ fontSize: 13.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
            No Full Paper Uploaded
          </p>
        )}
      </div>

      {features?.commitment_letter && isFullPaperAccepted && (
        <div style={{ ...CARD, marginBottom: 24 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: '0 0 8px' }}>
            Commitment Letter Template
          </p>
          <p style={{ fontSize: 13.5, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: '0 0 16px' }}>
            This Commitment Letter template is available for download once your full paper is accepted.
            Please download the template and provide your signature as needed.
          </p>
          <a
            href={commitmentLetterUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white"
            style={{ background: '#0152EA', borderRadius: 8, textDecoration: 'none', fontFamily: 'Manrope,sans-serif', cursor: 'pointer' }}
          >
            <Icon icon="solar:download-outline" width={16} />
            Download Template
          </a>
        </div>
      )}

      {(showParticipantCertificate || showPresenterCertificate) && (
        <div style={CARD}>
          <p style={LABEL}>Certificates</p>
          <div className="flex flex-col">
            {showParticipantCertificate && (
              <div
                className="flex items-center justify-between"
                style={{ padding: '12px 0', borderBottom: showPresenterCertificate ? '1px solid #F1F5F9' : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(1,82,234,0.1)' }}>
                    <Icon icon="solar:diploma-bold" width={18} style={{ color: '#0152EA' }} />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
                    Participant Certificate
                  </p>
                </div>
                <a
                  href={participantCertificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
                  style={{ color: '#0152EA', background: 'rgba(1,82,234,0.08)', borderRadius: 8, textDecoration: 'none', fontFamily: 'Manrope,sans-serif' }}
                >
                  <Icon icon="solar:download-outline" width={15} />
                  Download
                </a>
              </div>
            )}
            {showPresenterCertificate && (
              <div className="flex items-center justify-between" style={{ padding: '12px 0' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.1)' }}>
                    <Icon icon="solar:document-medicine-bold" width={18} style={{ color: '#F59E0B' }} />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
                    Presenter Certificate
                  </p>
                </div>
                <a
                  href={presenterCertificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
                  style={{ color: '#0152EA', background: 'rgba(1,82,234,0.08)', borderRadius: 8, textDecoration: 'none', fontFamily: 'Manrope,sans-serif' }}
                >
                  <Icon icon="solar:download-outline" width={15} />
                  Download
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </UserPageLayout>
  );
}
