import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Card } from '../../../../Components/ui/card';
import { FloatSelect } from '../../../../Components/ui/FloatSelect';
import FormActions from '../../../../Components/ui/FormActions';
import { ToastContainer, useToast } from '../../../../Components/ui/Toast';

const PRESENTER_ROLES = ['indonesia-presenter', 'foreign-presenter'];

export default function TestTab({ roleOptions = {} }) {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [role, setRole] = useState('presenter');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    axios.get('/admin/broadcast/invitation/test-users')
      .then((res) => setUsers(res.data ?? []))
      .catch(() => toast.error('Failed to load registered users list.'))
      .finally(() => setLoadingUsers(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedUser = users.find((u) => String(u.id) === String(selectedUserId));

  useEffect(() => {
    if (selectedUser) {
      setRole(PRESENTER_ROLES.includes(selectedUser.role) ? 'presenter' : 'participant');
    }
  }, [selectedUser]);

  const handleSend = () => {
    if (!selectedUserId) {
      toast.warning('Please select a registered user first.');
      return;
    }

    setSending(true);
    router.post('/admin/broadcast/invitation/test-send', {
      user_id: selectedUserId,
      role,
    }, {
      preserveScroll: true,
      onSuccess: (page) => {
        const flash = page.props?.flash;
        flash?.type === 'error' ? toast.error(flash.message) : toast.success(flash?.message ?? 'Test email sent.');
      },
      onError: () => toast.error('Failed to send test email.'),
      onFinish: () => setSending(false),
    });
  };

  return (
    <Card>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
        Test Send Invitation
      </h2>

      <div className="flex flex-col gap-4" style={{ maxWidth: 420 }}>
        <FloatSelect
          id="test-user"
          label={loadingUsers ? 'Loading...' : 'Select Registered User'}
          value={selectedUserId}
          onChange={setSelectedUserId}
          options={users.map((u) => ({ value: String(u.id), label: `${u.name} — ${u.email}` }))}
        />

        {selectedUser && (
          <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Manrope, sans-serif' }}>
            Role: {roleOptions[selectedUser.role] ?? selectedUser.role ?? '-'} — email content will adapt to this role.
          </p>
        )}
      </div>

      <div className="mt-6" style={{ maxWidth: 420 }}>
        <FormActions id="test-send-form" submitText={sending ? 'Sending...' : 'Send Test'} onSubmit={handleSend} />
      </div>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </Card>
  );
}
