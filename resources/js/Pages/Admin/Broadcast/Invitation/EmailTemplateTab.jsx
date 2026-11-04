import { useState, useRef, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Card } from '../../../../Components/ui/card';
import { FloatInput } from '../../../../Components/ui/FloatInput';
import FormActions from '../../../../Components/ui/FormActions';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';

const label = { fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' };

function EmailPreviewFrame({ title, form, rundownItems, role, toast }) {
  const iframeRef = useRef(null);
  const abortRef = useRef(null);

  const refresh = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await axios.post('/admin/broadcast/invitation/preview', {
        ...form,
        role,
        rundown: rundownItems.map((r) => ({
          time_label: r.time_label,
          program: r.program,
          pic: r.pic,
          is_section_header: r.is_section_header,
        })),
      }, { responseType: 'text', signal: controller.signal });
      if (iframeRef.current) {
        iframeRef.current.srcdoc = res.data;
      }
    } catch (e) {
      if (axios.isCancel(e) || e.code === 'ERR_CANCELED') return;
      // eslint-disable-next-line no-console
      console.error(`Preview email (${role}) failed:`, e.response?.status, e.response?.data, e);
      toast.error(`Failed to load email preview ${title} (${e.response?.status ?? 'no response'}).`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, role, rundownItems]);

  // Debounce 600ms — jangan nembak request tiap 1 huruf diketik.
  useEffect(() => {
    const timer = setTimeout(refresh, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, role, rundownItems]);

  return (
    <div>
      <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Manrope, sans-serif', marginBottom: 8 }}>
        Preview — {title}
      </p>
      <iframe
        ref={iframeRef}
        title={`Email preview ${title}`}
        style={{ width: '100%', height: 460, border: '1px solid #E2E8F0', borderRadius: 8 }}
      />
    </div>
  );
}

export default function EmailTemplateTab({ template, rundownItems = [] }) {
  const toast = useToast();
  const [form, setForm] = useState({
    subject: template?.subject || '',
    zoom_url: template?.zoom_url || '',
    zoom_id: template?.zoom_id || '',
    zoom_pass: template?.zoom_pass || '',
    venue: template?.venue || '',
  });

  const handleSave = () => {
    router.post('/admin/broadcast/invitation/template/email', form, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => toast.success('Email template saved successfully.'),
      onError: () => toast.error('Failed to save email template.'),
    });
  };

  return (
    <div>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 style={label}>Subject, Zoom &amp; Venue</h2>
          {template?.updated_at && (
            <span style={{ fontSize: 11.5, color: '#94A3B8', fontFamily: 'Manrope, sans-serif' }}>
              Last updated: {new Date(template.updated_at).toLocaleString('en-US')}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatInput
            id="tpl-subject" label="Email Subject *"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          />
          <FloatInput
            id="tpl-venue" label="Venue (onsite location)"
            value={form.venue}
            onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
          />
          <FloatInput
            id="tpl-zoom-url" label="Zoom URL"
            value={form.zoom_url}
            onChange={(e) => setForm((f) => ({ ...f, zoom_url: e.target.value }))}
          />
          <FloatInput
            id="tpl-zoom-id" label="Zoom Meeting ID"
            value={form.zoom_id}
            onChange={(e) => setForm((f) => ({ ...f, zoom_id: e.target.value }))}
          />
          <FloatInput
            id="tpl-zoom-pass" label="Zoom Passcode"
            value={form.zoom_pass}
            onChange={(e) => setForm((f) => ({ ...f, zoom_pass: e.target.value }))}
          />
        </div>
        <div className="mt-4">
          <FormActions id="tpl-email-form" submitText="Save Email Template" onSubmit={handleSave} />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Card>
          <EmailPreviewFrame title="Presenter" form={form} rundownItems={rundownItems} role="presenter" toast={toast} />
        </Card>
        <Card>
          <EmailPreviewFrame title="Participant" form={form} rundownItems={rundownItems} role="participant" toast={toast} />
        </Card>
      </div>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </div>
  );
}
