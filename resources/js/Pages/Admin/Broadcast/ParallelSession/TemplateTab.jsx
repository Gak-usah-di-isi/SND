import { useState, useRef, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Card } from '../../../../Components/ui/card';
import { FloatInput } from '../../../../Components/ui/FloatInput';
import FormActions from '../../../../Components/ui/FormActions';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';

const label = { fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' };

export default function TemplateTab({ template }) {
  const toast = useToast();
  const [form, setForm] = useState({
    subject: template?.subject || '',
    important_notes: template?.important_notes || '',
    online_guidelines: template?.online_guidelines || '',
    submission_form_url: template?.submission_form_url || '',
  });
  const iframeRef = useRef(null);
  const abortRef = useRef(null);

  const refreshPreview = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await axios.post('/admin/broadcast/parallel-session/preview', form, {
        responseType: 'text',
        signal: controller.signal,
      });
      if (iframeRef.current) {
        iframeRef.current.srcdoc = res.data;
      }
    } catch (e) {
      if (axios.isCancel(e) || e.code === 'ERR_CANCELED') return;
      // eslint-disable-next-line no-console
      console.error('Preview parallel session failed:', e.response?.status, e.response?.data, e);
      toast.error(`Failed to load preview (${e.response?.status ?? 'no response'}).`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  useEffect(() => {
    const timer = setTimeout(refreshPreview, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleSave = () => {
    router.post('/admin/broadcast/parallel-session/template', form, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => toast.success('Template saved successfully.'),
      onError: () => toast.error('Failed to save template.'),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 style={label}>Email Content</h2>
          {template?.updated_at && (
            <span style={{ fontSize: 11.5, color: '#94A3B8', fontFamily: 'Manrope, sans-serif' }}>
              Last updated: {new Date(template.updated_at).toLocaleString('en-US')}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <FloatInput
            id="tpl-subject" label="Email Subject *"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          />
          <FloatInput
            id="tpl-notes" label="Important Notes (1 line = 1 point)"
            value={form.important_notes}
            onChange={(e) => setForm((f) => ({ ...f, important_notes: e.target.value }))}
            multiline
            rows={5}
          />
          <FloatInput
            id="tpl-guidelines" label="For Online Presenters — Guidelines (1 line = 1 point)"
            value={form.online_guidelines}
            onChange={(e) => setForm((f) => ({ ...f, online_guidelines: e.target.value }))}
            multiline
            rows={3}
          />
          <FloatInput
            id="tpl-form-url" label="Google Form Link for Material Submission"
            value={form.submission_form_url}
            onChange={(e) => setForm((f) => ({ ...f, submission_form_url: e.target.value }))}
          />
        </div>
        <div className="mt-4">
          <FormActions id="tpl-parallel-form" submitText="Save Template" onSubmit={handleSave} />
        </div>
      </Card>

      <Card>
        <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Manrope, sans-serif', marginBottom: 8 }}>
          Preview
        </p>
        <iframe
          ref={iframeRef}
          title="Parallel session email preview"
          style={{ width: '100%', height: 560, border: '1px solid #E2E8F0', borderRadius: 8 }}
        />
        <p style={{ fontSize: 11.5, color: '#94A3B8', fontFamily: 'Manrope, sans-serif', marginTop: 8 }}>
          Attachments (presentation schedule &amp; Zoom background) are managed on the{' '}
          <a href="/admin/download-files" style={{ color: '#0152EA' }}>Files &amp; Documents</a> page, not here.
        </p>
      </Card>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </div>
  );
}
