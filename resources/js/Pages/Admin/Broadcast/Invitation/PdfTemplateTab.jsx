import { useState, useRef, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Card } from '../../../../Components/ui/card';
import { FloatInput } from '../../../../Components/ui/FloatInput';
import FormActions from '../../../../Components/ui/FormActions';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';

const label = { fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' };
const emptyRowForm = { time_label: '', program: '', pic: '', is_section_header: false };

function RundownRowForm({ initial, onCancel, onSave }) {
  const [row, setRow] = useState(initial ?? emptyRowForm);

  return (
    <div style={{ border: '1px dashed #CBD5E1', borderRadius: 10, padding: 14, marginBottom: 12, background: '#F8FAFC' }}>
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2" style={{ fontSize: 13, fontFamily: 'Manrope, sans-serif', color: '#374151' }}>
          <input
            type="checkbox"
            checked={row.is_section_header}
            onChange={(e) => setRow((r) => ({ ...r, is_section_header: e.target.checked }))}
          />
          Section divider row (e.g. "Parallel Session") — displays bold, full width
        </label>

        {!row.is_section_header && (
          <FloatInput
            id="rundown-time"
            label="Time"
            value={row.time_label}
            onChange={(e) => setRow((r) => ({ ...r, time_label: e.target.value }))}
            placeholder="e.g. 09.00 – 09.30 or Room 1\n14.00 - 16.30"
            multiline
            rows={2}
          />
        )}

        <FloatInput
          id="rundown-program"
          label={row.is_section_header ? 'Section Title' : 'Program'}
          value={row.program}
          onChange={(e) => setRow((r) => ({ ...r, program: e.target.value }))}
          multiline
          rows={2}
        />

        {!row.is_section_header && (
          <FloatInput
            id="rundown-pic"
            label="PIC"
            value={row.pic}
            onChange={(e) => setRow((r) => ({ ...r, pic: e.target.value }))}
            multiline
            rows={2}
          />
        )}

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-200 text-gray-600 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(row)}
            className="px-3 py-1.5 text-sm rounded-md text-white cursor-pointer"
            style={{ background: '#0152EA' }}
          >
            Save Row
          </button>
        </div>
      </div>
    </div>
  );
}

function RundownEditor({ rundownItems, toast }) {
  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const persist = (url, method, data, successMsg) => {
    router[method](url, data, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success(successMsg);
        setAddingNew(false);
        setEditingId(null);
      },
      onError: () => toast.error('Failed to save rundown row.'),
    });
  };

  const handleCreate = (row) => persist('/admin/broadcast/invitation/rundown', 'post', row, 'Rundown row added.');
  const handleUpdate = (id, row) => persist(`/admin/broadcast/invitation/rundown/${id}`, 'put', row, 'Rundown row updated.');
  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/broadcast/invitation/rundown/${deleteTarget.id}`, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => { toast.success('Rundown row deleted.'); setDeleteTarget(null); },
      onError: () => { toast.error('Failed to delete row.'); setDeleteTarget(null); },
    });
  };

  const move = (index, direction) => {
    const ids = rundownItems.map((r) => r.id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    router.post('/admin/broadcast/invitation/rundown/reorder', { ids }, {
      preserveScroll: true,
      preserveState: true,
      onError: () => toast.error('Failed to reorder.'),
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 style={label}>Rundown (Schedule)</h2>
        {!addingNew && (
          <button
            type="button"
            onClick={() => setAddingNew(true)}
            className="px-3 py-1.5 text-sm rounded-md text-white cursor-pointer"
            style={{ background: '#0152EA' }}
          >
            + Add Row
          </button>
        )}
      </div>

      {addingNew && (
        <RundownRowForm onCancel={() => setAddingNew(false)} onSave={handleCreate} />
      )}

      <div className="flex flex-col gap-2">
        {rundownItems.map((item, index) => (
          <div key={item.id}>
            {editingId === item.id ? (
              <RundownRowForm initial={item} onCancel={() => setEditingId(null)} onSave={(row) => handleUpdate(item.id, row)} />
            ) : (
              <div
                className="flex items-start justify-between gap-3"
                style={{
                  border: '1px solid #F1F5F9',
                  borderRadius: 8,
                  padding: '10px 12px',
                  background: item.is_section_header ? '#EFF3FF' : '#fff',
                }}
              >
                <div style={{ flex: 1, fontFamily: 'Manrope, sans-serif' }}>
                  {item.is_section_header ? (
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0152EA', margin: 0 }}>{item.program}</p>
                  ) : (
                    <>
                      <p style={{ fontSize: 12.5, fontWeight: 600, color: '#1F2A3D', margin: 0, whiteSpace: 'pre-line' }}>{item.time_label}</p>
                      <p style={{ fontSize: 12.5, color: '#374151', margin: '2px 0 0', whiteSpace: 'pre-line' }}>{item.program}</p>
                      <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0', whiteSpace: 'pre-line' }}>{item.pic}</p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0}
                    style={{ width: 26, height: 26, border: '1px solid #E2E8F0', borderRadius: 6, background: '#fff', cursor: index === 0 ? 'not-allowed' : 'pointer', color: '#64748B' }}>↑</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === rundownItems.length - 1}
                    style={{ width: 26, height: 26, border: '1px solid #E2E8F0', borderRadius: 6, background: '#fff', cursor: index === rundownItems.length - 1 ? 'not-allowed' : 'pointer', color: '#64748B' }}>↓</button>
                  <button type="button" onClick={() => setEditingId(item.id)}
                    style={{ padding: '4px 10px', fontSize: 12, border: '1px solid rgba(1,82,234,0.3)', borderRadius: 6, background: 'rgba(1,82,234,0.04)', color: '#0152EA', cursor: 'pointer' }}>Edit</button>
                  <button type="button" onClick={() => setDeleteTarget(item)}
                    style={{ padding: '4px 10px', fontSize: 12, border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, background: 'rgba(239,68,68,0.04)', color: '#EF4444', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {rundownItems.length === 0 && !addingNew && (
          <p style={{ fontSize: 13, color: '#94A3B8', fontFamily: 'Manrope, sans-serif', textAlign: 'center', padding: '20px 0' }}>
            No rundown rows yet.
          </p>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Rundown Row"
        message="This rundown row will be permanently deleted. Continue?"
        confirmText="Delete"
        cancelText="Cancel"
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Card>
  );
}

function PdfPreviewFrame({ title, form, subject, rundownItems, role, toast, triggerToken }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);

  const refresh = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const res = await axios.post('/admin/broadcast/invitation/preview-pdf', {
        ...form,
        subject,
        role,
        rundown: rundownItems.map((r) => ({
          time_label: r.time_label,
          program: r.program,
          pic: r.pic,
          is_section_header: r.is_section_header,
        })),
      }, { responseType: 'blob', signal: controller.signal });
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      });
    } catch (e) {
      if (axios.isCancel(e) || e.code === 'ERR_CANCELED') return;
      // eslint-disable-next-line no-console
      console.error(`Preview PDF (${role}) failed:`, e.response?.status, e.response?.data, e);
      toast.error(`Failed to load PDF preview ${title} (${e.response?.status ?? 'no response'}).`);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, subject, role, rundownItems]);

  // Sengaja TIDAK auto-refresh saat form berubah — generate PDF (DomPDF) bisa
  // berat/lambat tergantung ukuran gambar letterhead, jadi harus manual biar
  // ga numpuk banyak request berat sekaligus tiap kali user ngetik.
  useEffect(() => {
    if (triggerToken > 0) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerToken]);

  return (
    <div>
      <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Manrope, sans-serif', marginBottom: 8 }}>
        Preview — {title}
      </p>
      {loading ? (
        <div style={{ height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontFamily: 'Manrope, sans-serif', fontSize: 13, border: '1px solid #E2E8F0', borderRadius: 8 }}>
          Generating PDF... (may take a few seconds)
        </div>
      ) : pdfUrl ? (
        <embed src={pdfUrl} type="application/pdf" style={{ width: '100%', height: 520, border: '1px solid #E2E8F0', borderRadius: 8 }} />
      ) : (
        <div style={{ height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontFamily: 'Manrope, sans-serif', fontSize: 13, border: '1px solid #E2E8F0', borderRadius: 8 }}>
          Click "Generate Preview" to see the result.
        </div>
      )}
    </div>
  );
}

export default function PdfTemplateTab({ template, rundownItems = [] }) {
  const toast = useToast();
  const [form, setForm] = useState({
    letter_date: template?.letter_date || '',
    pdf_theme_paragraph: template?.pdf_theme_paragraph || '',
    rundown_edition: template?.rundown_edition || '',
    organizer: template?.organizer || '',
    event_date_label: template?.event_date_label || '',
  });
  const [previewToken, setPreviewToken] = useState(0);

  const handleSave = () => {
    router.post('/admin/broadcast/invitation/template/pdf', form, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => toast.success('PDF template saved successfully.'),
      onError: () => toast.error('Failed to save PDF template.'),
    });
  };

  return (
    <div>
      <Card>
        <h2 style={{ ...label, marginBottom: 16 }}>Letter &amp; Theme (PDF Attachment)</h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatInput
              id="tpl-letter-date" label="Letter Date *" type="date"
              value={form.letter_date}
              onChange={(e) => setForm((f) => ({ ...f, letter_date: e.target.value }))}
            />
            <FloatInput
              id="tpl-event-date-label" label="Event Date (free text) *"
              value={form.event_date_label}
              onChange={(e) => setForm((f) => ({ ...f, event_date_label: e.target.value }))}
              placeholder="e.g. August 1st – 2nd, 2026"
            />
            <FloatInput
              id="tpl-rundown-edition" label="Rundown Edition *"
              value={form.rundown_edition}
              onChange={(e) => setForm((f) => ({ ...f, rundown_edition: e.target.value }))}
              placeholder="e.g. 4th"
            />
            <FloatInput
              id="tpl-organizer" label="Organizer *"
              value={form.organizer}
              onChange={(e) => setForm((f) => ({ ...f, organizer: e.target.value }))}
            />
          </div>
          <FloatInput
            id="tpl-theme" label="Conference Theme Paragraph *"
            value={form.pdf_theme_paragraph}
            onChange={(e) => setForm((f) => ({ ...f, pdf_theme_paragraph: e.target.value }))}
            multiline
            rows={6}
          />
        </div>
        <div className="mt-4">
          <FormActions id="tpl-pdf-form" submitText="Save PDF Template" onSubmit={handleSave} />
        </div>
      </Card>

      <div className="mt-6">
        <RundownEditor rundownItems={rundownItems} toast={toast} />
      </div>

      <div className="flex items-center justify-between mt-6 mb-3">
        <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Manrope, sans-serif' }}>
          PDF preview is not automatic — generate manually, as creating PDFs can take time.
        </p>
        <button
          type="button"
          onClick={() => setPreviewToken((t) => t + 1)}
          className="px-4 py-2 text-sm rounded-md text-white cursor-pointer"
          style={{ background: '#0152EA' }}
        >
          Generate Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <PdfPreviewFrame title="Presenter" form={form} subject={template?.subject || ''} rundownItems={rundownItems} role="presenter" toast={toast} triggerToken={previewToken} />
        </Card>
        <Card>
          <PdfPreviewFrame title="Participant" form={form} subject={template?.subject || ''} rundownItems={rundownItems} role="participant" toast={toast} triggerToken={previewToken} />
        </Card>
      </div>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </div>
  );
}
