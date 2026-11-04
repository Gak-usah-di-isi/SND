import { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Card } from '../../../../Components/ui/card';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';
import ConfirmDialog from '../../../../Components/ui/ConfirmDialog';

const ROLE_ORDER = ['indonesia-presenter', 'foreign-presenter', 'indonesia-participants', 'foreign-participants'];
const PRESENTER_ROLES = ['indonesia-presenter', 'foreign-presenter'];

const defaultFilters = () => Object.fromEntries(
  ROLE_ORDER.map((role) => [role, { included: false }])
);

export default function BroadcastTab({ roleOptions = {} }) {
  const toast = useToast();
  const [filters, setFilters] = useState(defaultFilters());
  const [estimate, setEstimate] = useState(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [confirmSend, setConfirmSend] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [sending, setSending] = useState(false);

  const toggleRoleIncluded = (role) => {
    setFilters((f) => ({ ...f, [role]: { included: !f[role].included } }));
    setEstimate(null);
  };

  const handleEstimate = async () => {
    setLoadingEstimate(true);
    try {
      const res = await axios.post('/admin/broadcast/reminder/recipient-count', { roles: filters });
      setEstimate(res.data);
    } catch (e) {
      toast.error('Failed to calculate estimate.');
    } finally {
      setLoadingEstimate(false);
    }
  };

  const handleSend = () => {
    setSending(true);
    router.post('/admin/broadcast/reminder/send', { roles: filters }, {
      preserveScroll: true,
      onSuccess: (page) => {
        const flash = page.props?.flash;
        if (flash?.message) {
          flash.type === 'success' ? toast.success(flash.message) : toast.warning(flash.message);
        } else {
          toast.success('Reminder broadcast sent successfully.');
        }
        setEstimate(null);
        setConfirmSend(false);
      },
      onError: () => toast.error('Failed to send broadcast.'),
      onFinish: () => setSending(false),
    });
  };

  const handleClearHistory = () => {
    router.delete('/admin/broadcast/reminder/history', {
      preserveScroll: true,
      onSuccess: () => { toast.success('Delivery history deleted.'); setConfirmClear(false); },
      onError: () => { toast.error('Failed to delete history.'); setConfirmClear(false); },
    });
  };

  const anyIncluded = ROLE_ORDER.some((role) => filters[role].included);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {ROLE_ORDER.map((role) => {
          const f = filters[role];
          const isPresenter = PRESENTER_ROLES.includes(role);
          return (
            <Card key={role}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={f.included} onChange={() => toggleRoleIncluded(role)} />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
                  {roleOptions[role] ?? role}
                </span>
              </label>
              <p style={{ fontSize: 11.5, color: '#94A3B8', fontFamily: 'Manrope, sans-serif', marginTop: 8 }}>
                Automatically only to unverified payment participants in the active year
                {isPresenter ? ', and their abstract has been accepted in the active year.' : ', and registered in the active year.'}
              </p>

              {estimate && f.included && (
                <p style={{ fontSize: 12.5, color: '#0152EA', fontFamily: 'Manrope, sans-serif', marginTop: 10, fontWeight: 600 }}>
                  Estimate: {estimate.perRole?.[role] ?? 0} people
                </p>
              )}
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p style={{ fontSize: 13, color: '#374151', fontFamily: 'Manrope, sans-serif' }}>
              {estimate
                ? <>Total estimated recipients: <strong style={{ color: '#0152EA' }}>{estimate.total}</strong> people</>
                : 'Calculate estimated recipient count before sending.'}
            </p>
            <p style={{ fontSize: 11.5, color: '#94A3B8', fontFamily: 'Manrope, sans-serif', marginTop: 2 }}>
              Broadcast is sent directly (without queue), so it may take time for large recipient lists.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="px-4 py-2 text-sm rounded-md cursor-pointer"
              style={{ border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', background: 'rgba(239,68,68,0.04)' }}
            >
              Delete All History
            </button>
            <button
              type="button"
              disabled={!anyIncluded || loadingEstimate}
              onClick={handleEstimate}
              className="px-4 py-2 text-sm rounded-md cursor-pointer"
              style={{ border: '1px solid #0152EA', color: '#0152EA', background: '#fff', opacity: !anyIncluded ? 0.5 : 1 }}
            >
              {loadingEstimate ? 'Calculating...' : 'Calculate Estimate'}
            </button>
            <button
              type="button"
              disabled={!estimate || estimate.total === 0}
              onClick={() => setConfirmSend(true)}
              className="px-4 py-2 text-sm rounded-md text-white cursor-pointer"
              style={{ background: '#0152EA', opacity: (!estimate || estimate.total === 0) ? 0.5 : 1 }}
            >
              Send Now
            </button>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmSend}
        title="Send Reminder Broadcast"
        message={`Broadcast will be sent directly to ${estimate?.total ?? 0} recipients. This action cannot be cancelled midway. Continue?`}
        confirmText={sending ? 'Sending...' : 'Send'}
        cancelText="Cancel"
        onClose={() => setConfirmSend(false)}
        onConfirm={handleSend}
      />

      <ConfirmDialog
        open={confirmClear}
        title="Delete All History"
        message="All reminder delivery history (including failed ones) will be permanently deleted. Continue?"
        confirmText="Delete All"
        cancelText="Cancel"
        onClose={() => setConfirmClear(false)}
        onConfirm={handleClearHistory}
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </div>
  );
}
