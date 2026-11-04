import { useMemo, useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import UserPageLayout from '../../../Components/ui/shared/UserPageLayout';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import StatusBadge from '../../../Components/ui/StatusBadge';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import BackButton from '../../../Components/ui/BackButton';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import FormActions from '../../../Components/ui/FormActions';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

const CARD = { background: '#fff', borderRadius: 12, boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)', padding: 24 };
const MAX_WORDS = 350;

const PRESENTATION_OPTIONS = [
  { value: 'Oral presentation', label: 'Oral Presentation (Presentasi Lisan)' },
  { value: 'Poster presentation', label: 'Poster Presentation (Poster)' },
];

const FORMAT_GUIDE_ROWS = [
  { format: 'Italic', code: '<em> ... </em>', example: '<em>Oryza sativa</em>', result: <em>Oryza sativa</em> },
  { format: 'Subscript', code: '<sub> ... </sub>', example: 'CH<sub>4</sub>', result: <>CH<sub>4</sub></> },
  { format: 'Superscript', code: '<sup> ... </sup>', example: 'H<sup>+</sup>', result: <>H<sup>+</sup></> },
  { format: 'Right arrow', code: '&#8594;', example: 'A + B &#8594; C', result: 'A + B → C' },
  { format: 'Equilibrium arrow', code: '&#8652;', example: 'A + B &#8652; C', result: 'A + B ⇌ C' },
  { format: 'LaTeX inline math', code: '\\( ... \\)', example: 'The force acting between molecules is given by \\( \\vec{F}_{ij} = -\\nabla V \\)', result: 'The force acting between molecules is given by \\( \\vec{F}_{ij} = -\\nabla V \\)' },
  { format: 'LaTeX display math', code: '\\[ ... \\]', example: 'The wave function is normalized so that \\[ \\int_0^{\\infty} \\psi^*_{1s} \\psi_{1s} d\\tau = 1 \\]', result: 'The wave function is normalized so that \\[ \\int_0^{\\infty} \\psi^*_{1s} \\psi_{1s} d\\tau = 1 \\]' },
];

/* ---------- Formatting Guideline ---------- */
function FormatGuide() {
  return (
    <div id="formatguide" style={{ ...CARD, marginTop: 24 }}>
      <p className="text-sm text-gray-500 text-center italic mb-2">
        Panduan format teks berikut bersifat <strong>OPSIONAL</strong>, digunakan jika abstrak Anda memerlukan simbol ilmiah atau rumus.
      </p>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', textAlign: 'center', marginBottom: 16 }}>
        PANDUAN FORMAT TEKS ABSTRAK
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(1,82,234,0.08)' }}>
              {['Format', 'Kode', 'Contoh', 'Hasil'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: '#1F2A3D', border: '1px solid #E2E8F0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FORMAT_GUIDE_ROWS.map(row => (
              <tr key={row.format}>
                <td className="px-3 py-2" style={{ border: '1px solid #E2E8F0', color: '#374151' }}>{row.format}</td>
                <td className="px-3 py-2" style={{ border: '1px solid #E2E8F0', color: '#6B7280', fontFamily: 'monospace', fontSize: 12.5 }}>{row.code}</td>
                <td className="px-3 py-2" style={{ border: '1px solid #E2E8F0', color: '#6B7280', fontFamily: 'monospace', fontSize: 12.5 }}>{row.example}</td>
                <td className="px-3 py-2" style={{ border: '1px solid #E2E8F0', color: '#374151' }}>{row.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Create / Edit Form ---------- */
function AbstractFormView({
  mode,
  abstract,
  symposiums = [],
  presentationTypes = [],
  sdgs = [],
  onCancel,
  toast,
}) {
  const { errors } = usePage().props;
  const isEdit = mode === 'edit';

  const presentationOptions = useMemo(() => {
    if (presentationTypes && presentationTypes.length > 0) {
      return presentationTypes.map(pt => ({ value: pt.name, label: pt.name }));
    }
    return PRESENTATION_OPTIONS;
  }, [presentationTypes]);

  const [form, setForm] = useState({
    title: abstract?.title ?? '',
    symposium_id: abstract?.symposium_id ?? '',
    presentation_type: abstract?.presentation_type ?? (presentationTypes?.[0]?.name || 'Oral presentation'),
    authors: abstract?.authors ?? '',
    affiliations: abstract?.affiliations ?? '',
    corresponding_email: abstract?.corresponding_email ?? '',
    abstract: abstract?.abstract ?? '',
    keyword: abstract?.keyword ?? '',
    sdg_ids: abstract?.sdgs ? abstract.sdgs.map(s => s.id) : [],
  });

  const symposiumOptions = symposiums.map(s => ({ value: s.id, label: s.name }));

  const wordCount = useMemo(() => {
    const words = form.abstract.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length;
  }, [form.abstract]);

  const setField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const toggleSdg = (id) => {
    setForm(prev => {
      const exists = prev.sdg_ids.includes(id);
      const next = exists
        ? prev.sdg_ids.filter(x => x !== id)
        : [...prev.sdg_ids, id];
      return { ...prev, sdg_ids: next };
    });
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (form.sdg_ids.length === 0) {
      toast.error('Harap pilih minimal 1 tema SDGs yang sesuai.');
      return;
    }

    setSubmitting(true);
    const options = {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        onCancel();
      },
      onError: () => {
        toast.error('Terjadi kesalahan. Silakan periksa kembali input formulir Anda.');
      },
      onFinish: () => setSubmitting(false),
    };

    if (isEdit) {
      router.put(`/abstracts/${abstract.route_key}`, form, options);
    } else {
      router.post('/abstracts', form, options);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <BackButton onClick={onCancel} />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
          {isEdit ? 'Edit / Revisi Abstrak' : 'Unggah Abstrak Baru'}
        </h1>
      </div>

      <Card className="mb-4">
        <p style={{ fontSize: 13.5, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
          Pastikan data penulis, judul, dan isi abstrak diisi dengan lengkap. Panduan rumus dan simbol teks ilmiah dapat dilihat pada{' '}
          <a href="#formatguide" style={{ color: '#0152EA', textDecoration: 'underline' }}>panduan di bawah</a>.
        </p>
      </Card>

      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
          {isEdit ? 'Formulir Perubahan Abstrak' : 'Detail Pengajuan Abstrak'}
        </h2>

        <div className="flex flex-col gap-4">
          <FloatInput
            id="title"
            label="Judul Makalah / Paper Title *"
            value={form.title}
            onChange={setField('title')}
            error={Boolean(errors?.title)}
            helperText={errors?.title}
          />

          {symposiumOptions.length > 0 && (
            <FloatSelect
              id="symposium_id"
              label="Topik Konferensi (Opsional)"
              options={symposiumOptions}
              value={form.symposium_id}
              onChange={(val) => setForm(prev => ({ ...prev, symposium_id: val }))}
              placeholder="-- Pilih Topik Konferensi --"
              error={Boolean(errors?.symposium_id)}
              helperText={errors?.symposium_id}
            />
          )}

          {/* ---------- SDGs Checkbox Selection (Multiple Choice) ---------- */}
          <div
            className="p-4 rounded-xl border border-gray-200"
            style={{ background: '#FAFBFD' }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
              <label style={{ fontSize: 14, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
                Pilihan Tema SDGs (Dapat memilih lebih dari 1) *
              </label>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-bold"
                style={{
                  background: form.sdg_ids.length > 0 ? 'rgba(1,82,234,0.1)' : 'rgba(239,68,68,0.1)',
                  color: form.sdg_ids.length > 0 ? '#0152EA' : '#EF4444',
                  fontFamily: 'Manrope, sans-serif'
                }}
              >
                {form.sdg_ids.length} SDG dipilih
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: '#6B7280', margin: '0 0 12px', fontFamily: 'Manrope, sans-serif' }}>
              Pilihlah satu atau lebih dari 17 Tujuan Pembangunan Berkelanjutan (SDGs) yang relevan dengan topik makalah Anda:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto p-1">
              {sdgs.map(sdg => {
                const isChecked = form.sdg_ids.includes(sdg.id);
                return (
                  <div
                    key={sdg.id}
                    onClick={() => toggleSdg(sdg.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'border-blue-500 bg-blue-50/70 shadow-sm ring-1 ring-blue-500'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className="text-[11px] px-1.5 py-0.5 rounded font-bold text-white shrink-0"
                          style={{ background: sdg.color || '#0152EA' }}
                        >
                          {sdg.code}
                        </span>
                        <span className="text-xs font-semibold text-gray-800 truncate" title={sdg.name_id || sdg.name_en}>
                          {sdg.name_id || sdg.name_en}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate m-0">{sdg.name_en}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors?.sdg_ids && (
              <p className="text-xs text-red-500 mt-2 font-medium">{errors.sdg_ids}</p>
            )}
          </div>

          <FloatSelect
            id="presentation_type"
            label="Jenis Presentasi *"
            options={presentationOptions}
            value={form.presentation_type}
            onChange={(val) => setForm(prev => ({ ...prev, presentation_type: val }))}
            placeholder="-- Pilih Jenis Presentasi --"
            error={Boolean(errors?.presentation_type)}
            helperText={errors?.presentation_type}
          />

          <FloatInput
            id="authors"
            label="Nama Penulis / Author(s) *"
            value={form.authors}
            onChange={setField('authors')}
            placeholder="Contoh: Budi Santoso*[1], Siti Aminah[2], Ahmad Dahlan[1,2]"
            error={Boolean(errors?.authors)}
            helperText={errors?.authors}
          />

          <FloatInput
            id="affiliations"
            label="Afiliasi / Instansi Penulis *"
            value={form.affiliations}
            onChange={setField('affiliations')}
            multiline
            rows={4}
            placeholder={'[1] Fakultas Vokasi, Universitas Brawijaya, Malang, Indonesia\n[2] Departemen Teknik, Universitas Brawijaya, Malang, Indonesia'}
            error={Boolean(errors?.affiliations)}
            helperText={errors?.affiliations}
          />

          <FloatInput
            id="corresponding_email"
            label="Email Penulis Korespondensi *"
            type="email"
            value={form.corresponding_email}
            onChange={setField('corresponding_email')}
            placeholder="penulis@ub.ac.id"
            error={Boolean(errors?.corresponding_email)}
            helperText={errors?.corresponding_email}
          />

          <div>
            <FloatInput
              id="abstract"
              label="Isi Abstrak *"
              value={form.abstract}
              onChange={setField('abstract')}
              multiline
              rows={8}
              placeholder="Tuliskan latar belakang, tujuan, metode, hasil utama, dan kesimpulan singkat..."
              error={Boolean(errors?.abstract)}
              helperText={errors?.abstract}
            />
            <p
              className="mt-1"
              style={{ fontSize: 12, fontFamily: 'Manrope,sans-serif', color: wordCount > MAX_WORDS ? '#EF4444' : '#9CA3AF' }}
            >
              {wordCount} kata (Maksimal: {MAX_WORDS} kata)
            </p>
          </div>

          <FloatInput
            id="keyword"
            label="Kata Kunci / Keywords *"
            value={form.keyword}
            onChange={setField('keyword')}
            placeholder="Contoh: Pendidikan Vokasi, SDGs, Pengabdian Masyarakat"
            error={Boolean(errors?.keyword)}
            helperText={errors?.keyword}
          />

          <FormActions
            onCancel={onCancel}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
            submitText={isEdit ? 'Simpan & Kirim Revisi' : 'Simpan Abstrak'}
          />
        </div>
      </Card>

      <FormatGuide />
    </>
  );
}

/* ---------- Detail Header Card per Abstract ---------- */
function DetailCard({ abstract, isPaymentEnabled, onEdit }) {
  const isAccepted = abstract.status === 'accepted';
  const isRevision = abstract.status === 'revision';
  const isRejected = abstract.status === 'rejected';

  const hasPaid = abstract.user?.file_payment?.status === 'verified';
  const canDownloadLoa = isAccepted && (!isPaymentEnabled || hasPaid);

  return (
    <div style={{ ...CARD, marginBottom: 16 }}>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-2">
          <StatusBadge label={capitalize(abstract.status)} />
          <span className="text-xs text-gray-400">&bull; {abstract.presentation_type}</span>
        </div>

        <div className="flex items-center gap-2">
          {canDownloadLoa && (
            <a
              href={`/abstracts/${abstract.id}/acceptance-pdf`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
              style={{ textDecoration: 'none' }}
            >
              <Icon icon="solar:diploma-verified-outline" width={14} />
              Unduh LoA (PDF)
            </a>
          )}

          {isRevision && (
            <button
              type="button"
              onClick={() => onEdit(abstract)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition cursor-pointer"
            >
              <Icon icon="solar:pen-outline" width={14} />
              Kirim Revisi Abstrak
            </button>
          )}

          <Link
            href={`/abstracts/${abstract.route_key}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            style={{ textDecoration: 'none' }}
          >
            <Icon icon="solar:document-text-outline" width={14} />
            Lihat Detail
          </Link>
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: '0 0 6px' }}>
        {abstract.title}
      </h3>

      {/* SDGs Badges */}
      {abstract.sdgs && abstract.sdgs.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          <span className="text-xs text-gray-500 font-medium">Tema SDGs:</span>
          {abstract.sdgs.map(sdg => (
            <span
              key={sdg.id}
              className="text-xs px-2 py-0.5 rounded-md font-semibold text-white"
              style={{ background: sdg.color || '#0152EA', fontFamily: 'Manrope,sans-serif' }}
              title={`${sdg.code}: ${sdg.name_id || sdg.name_en}`}
            >
              {sdg.code}: {sdg.name_id || sdg.name_en}
            </span>
          ))}
        </div>
      )}

      {/* Catatan Editor / Reviewer jika ada */}
      {isRevision && (
        <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <Icon icon="solar:pen-new-square-outline" width={16} style={{ color: '#D97706' }} />
            <span className="text-xs font-bold text-amber-900">Catatan Revisi dari Editor / Reviewer:</span>
          </div>
          <p className="text-xs text-amber-950 m-0 whitespace-pre-wrap">
            {abstract.editor_feedback || 'Mohon sesuaikan isi abstrak sesuai catatan review.'}
          </p>
          {abstract.reviewers && abstract.reviewers.length > 0 && abstract.reviewers.some(r => r.pivot?.comment) && (
            <div className="mt-2 pt-2 border-t border-amber-200/60">
              {abstract.reviewers.filter(r => r.pivot?.comment).map((r, i) => (
                <div key={i} className="text-xs text-amber-900 mb-1">
                  &bull; <em>{r.name}:</em> {r.pivot.comment}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isRejected && (
        <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <Icon icon="solar:close-circle-bold" width={16} style={{ color: '#DC2626' }} />
            <span className="text-xs font-bold text-red-900">Alasan Penolakan:</span>
          </div>
          <p className="text-xs text-red-950 m-0 whitespace-pre-wrap">
            {abstract.editor_feedback || 'Mohon maaf, abstrak belum memenuhi kriteria seminar nasional berdampak.'}
          </p>
        </div>
      )}

      {isAccepted && isPaymentEnabled && !hasPaid && (
        <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50 text-xs text-yellow-800">
          Abstrak telah diterima! Silakan selesaikan <a href="/payment" className="underline font-bold text-blue-600">pembayaran pendaftaran</a> untuk dapat mengunduh Letter of Acceptance (LoA).
        </div>
      )}
    </div>
  );
}

/* ---------- Expandable Table Row ---------- */
function AbstractRow({ abstract, isPaymentEnabled, onDelete, onEdit }) {
  const [open, setOpen] = useState(false);
  const titleWords = (abstract.title ?? '').split(' ');
  const shortTitle = titleWords.slice(0, 8).join(' ') + (titleWords.length > 8 ? '...' : '');

  const isAccepted = abstract.status === 'accepted';
  const hasPaid = abstract.user?.file_payment?.status === 'verified';
  const loaAvailable = isAccepted && (!isPaymentEnabled || hasPaid);

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
        <td className="px-3 py-4 w-10">
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E2E8F0', background: open ? '#F0F5FF' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: open ? '#0152EA' : '#6B7280', transition: 'all 150ms' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </td>
        <td className="px-4 py-4" style={{ maxWidth: 320 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', lineHeight: 1.4 }} title={abstract.title}>
            {shortTitle}
          </span>
        </td>
        <td className="px-4 py-4">
          <span style={{ fontSize: 13, color: '#4B5563', fontFamily: 'Manrope,sans-serif' }}>
            {abstract.corresponding_email}
          </span>
        </td>
        <td className="px-4 py-4">
          <StatusBadge label={capitalize(abstract.status)} />
        </td>
        <td className="px-4 py-4">
          {abstract.sdgs && abstract.sdgs.length > 0 ? (
            <div className="flex items-center gap-1 flex-wrap" style={{ maxWidth: 220 }}>
              {abstract.sdgs.map(s => (
                <span
                  key={s.id}
                  className="text-[11px] px-1.5 py-0.5 rounded font-bold text-white"
                  style={{ background: s.color || '#0152EA' }}
                  title={`${s.code}: ${s.name_id || s.name_en}`}
                >
                  {s.code}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`/abstracts/${abstract.route_key}`}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
              style={{ color: '#0152EA' }}
              title="Detail"
            >
              <Icon icon="solar:document-text-outline" width={16} />
            </Link>
            <button
              type="button"
              onClick={() => onEdit(abstract)}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
              style={{ color: '#0152EA', cursor: 'pointer' }}
              title="Edit / Revisi"
            >
              <Icon icon="solar:pen-2-outline" width={16} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(abstract)}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
              style={{ color: '#EF4444', cursor: 'pointer' }}
              title="Hapus"
            >
              <Icon icon="solar:trash-bin-minimalistic-outline" width={16} />
            </button>
          </div>
        </td>
      </tr>

      {open && (
        <tr style={{ background: '#F8FAFC' }}>
          <td />
          <td colSpan={5} className="px-4 pb-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3" style={{ fontSize: 13, fontFamily: 'Manrope,sans-serif' }}>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Judul Lengkap</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{abstract.title}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Tema SDGs</span>
                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                  {abstract.sdgs && abstract.sdgs.length > 0 ? (
                    abstract.sdgs.map(s => (
                      <span
                        key={s.id}
                        className="text-xs px-2 py-0.5 rounded text-white font-semibold"
                        style={{ background: s.color || '#0152EA' }}
                      >
                        {s.code}: {s.name_id || s.name_en}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">Belum memilih SDGs</span>
                  )}
                </div>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Jenis Presentasi</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{abstract.presentation_type ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Kata Kunci</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{abstract.keyword ?? '-'}</p>
              </div>

              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Letter of Acceptance (LoA)</span>
                <div style={{ marginTop: 4 }}>
                  {loaAvailable ? (
                    <a
                      href={`/abstracts/${abstract.id}/acceptance-pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                      style={{ textDecoration: 'none' }}
                    >
                      <Icon icon="solar:diploma-verified-outline" width={14} />
                      Unduh LoA (PDF)
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">
                      {isAccepted ? 'Tersedia setelah pembayaran' : 'Tersedia setelah abstrak diterima'}
                    </span>
                  )}
                </div>
              </div>

              {abstract.editor_feedback && (
                <div className="md:col-span-2">
                  <span style={{ color: '#D97706', fontWeight: 700 }}>Catatan Editor / Reviewer:</span>
                  <p style={{ color: '#92400E', marginTop: 2, background: '#FEF3C7', padding: '8px 12px', borderRadius: 8 }}>
                    {abstract.editor_feedback}
                  </p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function UserAbstractsIndex({
  abstracts,
  openAbstractSubmission,
  symposiums = [],
  presentationTypes = [],
  sdgs = [],
  isPaymentEnabled = false,
  maxAbstracts = 1,
}) {
  const toast = useToast();
  useFlashToast(toast);

  const totalAbstracts = abstracts?.total ?? (abstracts?.data ? abstracts.data.length : 0);
  const reachedAbstractLimit = totalAbstracts >= maxAbstracts;

  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [confirmRow, setConfirmRow] = useState(null);

  const rows = abstracts?.data ?? [];
  const page = Math.max((abstracts?.current_page ?? 1) - 1, 0);
  const rowsPerPage = abstracts?.per_page ?? 10;

  const hasAccepted = rows.some(a => a.status === 'accepted');
  const hasRevision = rows.some(a => a.status === 'revision');

  const navigate = (params) => {
    router.get('/abstracts', params, { preserveScroll: true, preserveState: true });
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 0) return;
    navigate({ page: nextPage + 1, per_page: rowsPerPage });
  };

  const handleRowsChange = (nextRows) => {
    navigate({ page: 1, per_page: nextRows });
  };

  const handleConfirmDelete = () => {
    if (!confirmRow) return;
    router.delete(`/abstracts/${confirmRow.route_key}`, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setConfirmRow(null);
      },
      onError: () => { toast.error('Gagal menghapus abstrak.'); setConfirmRow(null); },
    });
  };

  const closeForm = () => {
    setSelected(null);
    setView('list');
  };

  if (view === 'create' || view === 'edit') {
    return (
      <UserPageLayout currentPath="/abstracts">
        <AbstractFormView
          mode={view}
          abstract={view === 'edit' ? selected : null}
          symposiums={symposiums}
          presentationTypes={presentationTypes}
          sdgs={sdgs}
          onCancel={closeForm}
          toast={toast}
        />
      </UserPageLayout>
    );
  }

  return (
    <UserPageLayout currentPath="/abstracts">
      {rows.length > 0 && rows.map(abstract => (
        <DetailCard
          key={`detail-${abstract.id}`}
          abstract={abstract}
          isPaymentEnabled={isPaymentEnabled}
          onEdit={(a) => { setSelected(a); setView('edit'); }}
        />
      ))}

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
            Pengajuan Abstrak
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {openAbstractSubmission && !hasAccepted && !reachedAbstractLimit && (
            <button
              type="button"
              onClick={() => setView('create')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
            >
              <Icon icon="solar:document-add-outline" width={18} />
              {hasRevision ? 'Unggah Revisi Abstrak' : 'Tambah Abstrak Baru'}
            </button>
          )}
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'toggle', label: '' },
          { key: 'title', label: 'Judul Makalah' },
          { key: 'correspondent', label: 'Email Korespondensi' },
          { key: 'status', label: 'Status' },
          { key: 'sdgs', label: 'Tema SDGs' },
          { key: 'action', label: 'Aksi', align: 'right' },
        ]}
        empty={(
          <div className="flex flex-col items-center gap-2 py-8">
            <Icon icon="solar:document-text-outline" width={48} style={{ color: '#D1D5DB' }} />
            <p className="font-medium text-gray-500">Belum ada data abstrak yang dikirimkan</p>
          </div>
        )}
        footer={(
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            total={abstracts?.total ?? 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[10, 25, 50]}
          />
        )}
      >
        {rows.map(abstract => (
          <AbstractRow
            key={abstract.id}
            abstract={abstract}
            isPaymentEnabled={isPaymentEnabled}
            onDelete={setConfirmRow}
            onEdit={(a) => { setSelected(a); setView('edit'); }}
          />
        ))}
      </DataTable>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      <ConfirmDialog
        open={Boolean(confirmRow)}
        title="Konfirmasi Hapus Abstrak"
        message={confirmRow ? `Apakah Anda yakin ingin menghapus abstrak "${confirmRow.title}"? Tindakan ini tidak dapat dibatalkan.` : ''}
        cancelText="Batal"
        confirmText="Hapus"
        onClose={() => setConfirmRow(null)}
        onConfirm={handleConfirmDelete}
      />
    </UserPageLayout>
  );
}
