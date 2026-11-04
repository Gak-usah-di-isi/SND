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
  hasAcceptedWithoutPayment,
  isPaymentEnabled = false,
  showParticipantCertificate,
  showPresenterCertificate,
  participantCertificateUrl,
  presenterCertificateUrl,
}) {
  const toast = useToast();
  useFlashToast(toast);

  const { authUser, authRoles } = usePage().props;
  const roleLabel = authRoles?.[0]
    ? authRoles[0].charAt(0).toUpperCase() + authRoles[0].slice(1)
    : 'Presenter';

  const abstract = user?.abstracts?.[0] ?? null;
  const filePayment = user?.file_payment ?? null;

  const paymentDisplay = isPaymentEnabled
    ? (filePayment ? filePayment.status : 'Belum Bayar')
    : 'Gratis (Tahun Ini)';

  const abstractStatusDisplay = abstract
    ? (abstract.status.charAt(0).toUpperCase() + abstract.status.slice(1))
    : 'Belum Dibuat';

  const sdgCount = abstract?.sdgs?.length ?? 0;

  return (
    <UserPageLayout currentPath="/dashboard">
      {hasAcceptedWithoutPayment && (
        <div
          className="flex items-center gap-3 mb-5"
          style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '14px 18px' }}
        >
          <Icon icon="solar:danger-triangle-bold" width={22} style={{ color: '#F59E0B', flexShrink: 0 }} />
          <p style={{ fontSize: 13.5, color: '#92400E', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
            <strong>Pemberitahuan:</strong> Abstrak Anda telah <strong>diterima (accepted)</strong>, namun Anda belum menyelesaikan pembayaran.{' '}
            <a href="/payment" style={{ color: '#0152EA', fontWeight: 600, textDecoration: 'underline' }}>
              Klik di sini untuk melakukan pembayaran
            </a>.
          </p>
        </div>
      )}

      <div className="mb-6">
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
          Selamat Datang, {authUser?.name}
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Manrope, sans-serif', margin: '4px 0 0' }}>
          Seminar Nasional Berdampak (BPPM Vokasi UB) &bull; Masuk sebagai <span style={{ color: '#0152EA', fontWeight: 600 }}>{roleLabel}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Status Abstrak"
          value={abstractStatusDisplay}
          icon="solar:document-text-outline"
          color="#8B5CF6"
        />
        <StatCard
          label="Tema SDGs Dipilih"
          value={sdgCount > 0 ? `${sdgCount} SDG Dipilih` : 'Belum Memilih'}
          icon="solar:leaf-bold"
          color="#10B981"
        />
        <StatCard
          label="Status Biaya"
          value={paymentDisplay}
          icon="solar:wallet-outline"
          color="#0152EA"
        />
      </div>

      {abstract ? (
        <div style={{ ...CARD, marginBottom: 24 }}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <p style={LABEL}>Informasi Abstrak Anda</p>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{
                background: abstract.status === 'accepted' ? 'rgba(16,185,129,0.1)' : abstract.status === 'revision' ? 'rgba(245,158,11,0.1)' : 'rgba(1,82,234,0.1)',
                color: abstract.status === 'accepted' ? '#10B981' : abstract.status === 'revision' ? '#D97706' : '#0152EA',
                fontFamily: 'Manrope,sans-serif'
              }}
            >
              Status: {abstractStatusDisplay}
            </span>
          </div>

          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: '0 0 10px' }}>
            {abstract.title}
          </h3>

          {/* SDGs Badges */}
          {abstract.sdgs && abstract.sdgs.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mb-4">
              <span className="text-xs text-gray-500 font-medium">SDGs:</span>
              {abstract.sdgs.map(sdg => (
                <span
                  key={sdg.id}
                  className="text-xs px-2 py-0.5 rounded-md font-semibold text-white"
                  style={{ background: sdg.color || '#0152EA', fontFamily: 'Manrope,sans-serif' }}
                  title={`${sdg.code}: ${sdg.name_id || sdg.name_en}`}
                >
                  {sdg.code}
                </span>
              ))}
            </div>
          )}

          {/* Catatan Revisi jika ada */}
          {abstract.status === 'revision' && (
            <div
              className="p-4 mb-4 rounded-xl border border-amber-200 bg-amber-50"
              style={{ fontFamily: 'Manrope,sans-serif' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon icon="solar:pen-new-square-outline" width={18} style={{ color: '#D97706' }} />
                <span className="text-sm font-bold text-amber-800">Catatan Revisi dari Editor / Reviewer:</span>
              </div>
              <p className="text-sm text-amber-900 m-0 mb-3 whitespace-pre-wrap">
                {abstract.editor_feedback || 'Silakan cek dan perbaiki abstrak Anda sesuai rekomendasi reviewer.'}
              </p>
              <a
                href="/abstracts"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition"
              >
                <Icon icon="solar:pen-outline" width={14} />
                Buka & Submit Revisi Abstrak
              </a>
            </div>
          )}

          {/* Tombol LoA jika Accepted */}
          {abstract.status === 'accepted' && (
            <div
              className="p-4 mb-3 rounded-xl border border-green-200 bg-green-50 flex items-center justify-between flex-wrap gap-3"
              style={{ fontFamily: 'Manrope,sans-serif' }}
            >
              <div className="flex items-center gap-2.5">
                <Icon icon="solar:check-circle-bold" width={22} style={{ color: '#10B981' }} />
                <div>
                  <p className="text-sm font-bold text-green-900 m-0">Selamat! Abstrak Anda Telah Diterima</p>
                  <p className="text-xs text-green-700 m-0">Letter of Acceptance (LoA) resmi telah diterbitkan.</p>
                </div>
              </div>
              <a
                href={`/abstracts/${abstract.id}/acceptance-pdf`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
              >
                <Icon icon="solar:download-outline" width={15} />
                Unduh LoA (PDF)
              </a>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <a
              href="/abstracts"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
              style={{ fontFamily: 'Manrope,sans-serif' }}
            >
              <Icon icon="solar:document-text-outline" width={14} />
              Kelola di Halaman Abstrak &rarr;
            </a>
          </div>
        </div>
      ) : (
        <div style={{ ...CARD, marginBottom: 24, textAlign: 'center', padding: '36px 20px' }}>
          <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(1,82,234,0.08)' }}>
            <Icon icon="solar:document-add-outline" width={24} style={{ color: '#0152EA' }} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: '0 0 6px' }}>
            Anda Belum Mengunggah Abstrak
          </h3>
          <p style={{ fontSize: 13.5, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: '0 0 16px' }}>
            Kirimkan abstrak artikel Anda dengan memilih tema SDGs yang sesuai.
          </p>
          <a
            href="/abstracts"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm"
            style={{ background: '#0152EA', fontFamily: 'Manrope,sans-serif', textDecoration: 'none' }}
          >
            <Icon icon="solar:upload-outline" width={16} />
            Unggah Abstrak Sekarang
          </a>
        </div>
      )}

      {/* Sertifikat Section */}
      {(showParticipantCertificate || showPresenterCertificate) && (
        <div style={CARD}>
          <p style={LABEL}>Sertifikat</p>
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
                    Sertifikat Peserta
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
                  Unduh
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
                    Sertifikat Presenter
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
                  Unduh
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
