import { useState, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { Card } from '../../Components/ui/card';
import { FloatInput } from '../../Components/ui/FloatInput';
import { ToastContainer, useToast } from '../../Components/ui/Toast';

// Layouts based on user role
import AdminPageLayout from '../../Components/ui/shared/AdminPageLayout';
import SekretarisPageLayout from '../../Components/ui/shared/SekretarisPageLayout';
import BendaharaPageLayout from '../../Components/ui/shared/BendaharaPageLayout';
import HumasPageLayout from '../../Components/ui/shared/HumasPageLayout';
import EditorPageLayout from '../../Components/ui/shared/EditorPageLayout';
import ExecutivePageLayout from '../../Components/ui/shared/ExecutivePageLayout';
import LandingEditorPageLayout from '../../Components/ui/shared/LandingEditorPageLayout';
import UserPageLayout from '../../Components/ui/shared/UserPageLayout';

function AppLayout({ children, currentPath = '/profile' }) {
  const { authRoles = [] } = usePage().props;
  const roles = authRoles ?? [];

  if (roles.includes('admin')) {
    return <AdminPageLayout currentPath={currentPath}>{children}</AdminPageLayout>;
  }
  if (roles.includes('sekretaris')) {
    return <SekretarisPageLayout currentPath={currentPath}>{children}</SekretarisPageLayout>;
  }
  if (roles.includes('bendahara')) {
    return <BendaharaPageLayout currentPath={currentPath}>{children}</BendaharaPageLayout>;
  }
  if (roles.includes('humas')) {
    return <HumasPageLayout currentPath={currentPath}>{children}</HumasPageLayout>;
  }
  if (roles.includes('editor') || roles.includes('reviewer') || roles.includes('chief-editor')) {
    return <EditorPageLayout currentPath={currentPath}>{children}</EditorPageLayout>;
  }
  if (roles.includes('executive')) {
    return <ExecutivePageLayout currentPath={currentPath}>{children}</ExecutivePageLayout>;
  }
  if (roles.includes('landing_editor')) {
    return <LandingEditorPageLayout currentPath={currentPath}>{children}</LandingEditorPageLayout>;
  }
  return <UserPageLayout currentPath={currentPath}>{children}</UserPageLayout>;
}

export default function ProfileEdit({ user }) {
  const toast = useToast();
  const { authRoles = [] } = usePage().props;
  const roleName = authRoles?.[0]
    ? authRoles[0].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'User';

  // ---------------- Photo Upload State ----------------
  const fileInputRef = useRef(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profile_photo_url || null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setPhotoError('Allowed file formats: JPG, JPEG, or PNG.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('Maximum file size is 2MB.');
      return;
    }

    setPhotoError('');
    setSelectedPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSavePhoto = () => {
    if (!selectedPhoto) return;
    setPhotoLoading(true);

    const formData = new FormData();
    formData.append('image', selectedPhoto);

    router.post('/profile/upload-photo', formData, {
      preserveScroll: true,
      onSuccess: () => {
        setSelectedPhoto(null);
        toast.success('Profile photo updated successfully.');
      },
      onError: (errs) => {
        setPhotoError(errs?.image || 'Failed to upload photo.');
        toast.error(errs?.image || 'Failed to upload photo.');
      },
      onFinish: () => setPhotoLoading(false),
    });
  };

  const handleCancelPhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(user?.profile_photo_url || null);
    setPhotoError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeletePhoto = () => {
    if (!confirm('Are you sure you want to remove your profile photo?')) return;
    setPhotoLoading(true);
    router.delete('/profile/photo', {
      preserveScroll: true,
      onSuccess: () => {
        setSelectedPhoto(null);
        setPhotoPreview(null);
        toast.success('Profile photo removed.');
      },
      onError: () => toast.error('Failed to remove photo.'),
      onFinish: () => setPhotoLoading(false),
    });
  };

  // ---------------- Profile Details Form ----------------
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    name_certificate: user?.name_certificate || '',
    email: user?.email || '',
    is_student: Boolean(user?.is_student),
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileErrors({});

    router.patch('/profile', profileForm, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Profile details updated successfully.');
      },
      onError: (errs) => {
        setProfileErrors(errs);
        toast.error('Please check your input.');
      },
      onFinish: () => setProfileLoading(false),
    });
  };

  // ---------------- Password Form ----------------
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordErrors({});

    router.put('/password', passwordForm, {
      errorBag: 'updatePassword',
      preserveScroll: true,
      onSuccess: () => {
        setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
        toast.success('Password updated successfully.');
      },
      onError: (errs) => {
        setPasswordErrors(errs);
        toast.error(errs?.current_password || errs?.password || 'Failed to update password.');
      },
      onFinish: () => setPasswordLoading(false),
    });
  };

  // ---------------- Delete Account Modal ----------------
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm.');
      return;
    }

    setDeleteLoading(true);
    setDeleteError('');

    router.delete('/profile', {
      data: { password: deletePassword },
      errorBag: 'userDeletion',
      onError: (errs) => {
        setDeleteError(errs?.password || 'Incorrect password.');
        toast.error(errs?.password || 'Incorrect password.');
      },
      onFinish: () => setDeleteLoading(false),
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <AppLayout currentPath="/profile">
      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
          Account Settings
        </h1>
        <p style={{ fontSize: 13.5, color: '#6B7280', fontFamily: 'Manrope, sans-serif', marginTop: 4 }}>
          Manage your personal details, profile picture, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Photo & Account Overview */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Profile Photo Card */}
          <Card className="p-6">
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
              Profile Photo
            </h2>

            <div className="flex flex-col items-center text-center">
              {/* Avatar circle */}
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#EEF2F6',
                  border: '3px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  position: 'relative',
                }}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt={user?.name || 'Avatar'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: 36, fontWeight: 700, color: '#0152EA', fontFamily: 'Manrope, sans-serif' }}>
                    {getInitials(user?.name)}
                  </span>
                )}
              </div>

              {photoError && (
                <p style={{ fontSize: 12.5, color: '#EF4444', fontFamily: 'Manrope, sans-serif', marginBottom: 12 }}>
                  {photoError}
                </p>
              )}

              {/* Action buttons */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handlePhotoSelect}
              />

              {selectedPhoto ? (
                <div className="flex items-center gap-2 w-full justify-center">
                  <button
                    type="button"
                    onClick={handleSavePhoto}
                    disabled={photoLoading}
                    style={{
                      height: 36,
                      padding: '0 16px',
                      borderRadius: 8,
                      background: '#0152EA',
                      color: '#fff',
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: 'Manrope, sans-serif',
                      cursor: photoLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Icon icon={photoLoading ? 'solar:refresh-outline' : 'solar:check-circle-outline'} width={16} className={photoLoading ? 'animate-spin' : ''} />
                    {photoLoading ? 'Saving...' : 'Save Photo'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelPhoto}
                    disabled={photoLoading}
                    style={{
                      height: 36,
                      padding: '0 14px',
                      borderRadius: 8,
                      background: '#F1F5F9',
                      color: '#475569',
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: 'Manrope, sans-serif',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 w-full items-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      height: 36,
                      padding: '0 18px',
                      borderRadius: 8,
                      background: 'rgba(1, 82, 234, 0.08)',
                      color: '#0152EA',
                      border: '1px solid rgba(1, 82, 234, 0.2)',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: 'Manrope, sans-serif',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'background 150ms',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(1, 82, 234, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(1, 82, 234, 0.08)'}
                  >
                    <Icon icon="solar:camera-outline" width={16} />
                    Upload New Photo
                  </button>

                  {user?.profile_photo_url && (
                    <button
                      type="button"
                      onClick={handleDeletePhoto}
                      disabled={photoLoading}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        fontSize: 12.5,
                        fontWeight: 600,
                        fontFamily: 'Manrope, sans-serif',
                        cursor: 'pointer',
                        padding: '4px 8px',
                      }}
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              )}

              <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Manrope, sans-serif', marginTop: 14, lineHeight: 1.5 }}>
                Allowed JPG, JPEG, or PNG.<br />Maximum file size 2MB.
              </p>
            </div>
          </Card>

          {/* Account Overview Card */}
          <Card className="p-6">
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 14 }}>
              Account Information
            </h2>
            <div className="flex flex-col gap-3">
              <div>
                <span style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Manrope, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Role
                </span>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginTop: 2 }}>
                  {roleName}
                </p>
              </div>
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
                <span style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Manrope, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Registered Email
                </span>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginTop: 2, wordBreak: 'break-all' }}>
                  {user?.email}
                </p>
              </div>
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
                <span style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Manrope, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Student Status
                </span>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: profileForm.is_student ? '#0152EA' : '#64748B', fontFamily: 'Manrope, sans-serif', marginTop: 2 }}>
                  {profileForm.is_student ? '🎓 Student / Mahasiswa' : 'Regular (Non-Student)'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Profile Details Card */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <Icon icon="solar:user-id-outline" width={20} style={{ color: '#0152EA' }} />
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
                Profile Details
              </h2>
            </div>
            <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Manrope, sans-serif', marginBottom: 20 }}>
              Update your account details and the name displayed on your official conference certificates.
            </p>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
              <div>
                <FloatInput
                  id="name"
                  label="Full Name *"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  error={Boolean(profileErrors?.name)}
                  helperText={profileErrors?.name}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <FloatInput
                  id="name_certificate"
                  label="Name on Certificate *"
                  value={profileForm.name_certificate}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name_certificate: e.target.value }))}
                  error={Boolean(profileErrors?.name_certificate)}
                  helperText={
                    profileErrors?.name_certificate ||
                    'This exact name will be printed on all your conference certificates.'
                  }
                  placeholder="e.g. Dr. John Doe, M.Sc."
                />
              </div>

              <div>
                <FloatInput
                  id="email"
                  label="Email Address *"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  error={Boolean(profileErrors?.email)}
                  helperText={profileErrors?.email}
                  placeholder="name@institution.ac.id"
                />
              </div>

              <div>
                <label className="flex items-start gap-3 p-3.5 rounded-lg border border-gray-200 bg-gray-50/70 hover:bg-gray-50 cursor-pointer transition select-none">
                  <input
                    type="checkbox"
                    id="profile_is_student"
                    checked={profileForm.is_student}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, is_student: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">
                      Student / Mahasiswa
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5">
                      Check this box if you are a student to apply student rates on conference invoices.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  style={{
                    height: 40,
                    padding: '0 24px',
                    borderRadius: 8,
                    background: '#0152EA',
                    color: '#fff',
                    border: 'none',
                    fontSize: 13.5,
                    fontWeight: 600,
                    fontFamily: 'Manrope, sans-serif',
                    cursor: profileLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 2px 6px rgba(1, 82, 234, 0.25)',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={(e) => { if (!profileLoading) e.currentTarget.style.background = '#0040B8'; }}
                  onMouseLeave={(e) => { if (!profileLoading) e.currentTarget.style.background = '#0152EA'; }}
                >
                  <Icon icon={profileLoading ? 'solar:refresh-outline' : 'solar:diskette-outline'} width={17} className={profileLoading ? 'animate-spin' : ''} />
                  {profileLoading ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </Card>

          {/* Change Password Card */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <Icon icon="solar:lock-password-outline" width={20} style={{ color: '#0152EA' }} />
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
                Change Password
              </h2>
            </div>
            <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Manrope, sans-serif', marginBottom: 20 }}>
              Ensure your account is using a long, random password to stay secure.
            </p>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
              <div>
                <FloatInput
                  id="current_password"
                  label="Current Password *"
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                  error={Boolean(passwordErrors?.current_password)}
                  helperText={passwordErrors?.current_password}
                  placeholder="Enter your current password"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatInput
                  id="password"
                  label="New Password *"
                  type="password"
                  value={passwordForm.password}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, password: e.target.value }))}
                  error={Boolean(passwordErrors?.password)}
                  helperText={passwordErrors?.password}
                  placeholder="Minimum 8 characters"
                />

                <FloatInput
                  id="password_confirmation"
                  label="Confirm New Password *"
                  type="password"
                  value={passwordForm.password_confirmation}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, password_confirmation: e.target.value }))}
                  error={Boolean(passwordErrors?.password_confirmation)}
                  helperText={passwordErrors?.password_confirmation}
                  placeholder="Repeat new password"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  style={{
                    height: 40,
                    padding: '0 24px',
                    borderRadius: 8,
                    background: '#0152EA',
                    color: '#fff',
                    border: 'none',
                    fontSize: 13.5,
                    fontWeight: 600,
                    fontFamily: 'Manrope, sans-serif',
                    cursor: passwordLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 2px 6px rgba(1, 82, 234, 0.25)',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={(e) => { if (!passwordLoading) e.currentTarget.style.background = '#0040B8'; }}
                  onMouseLeave={(e) => { if (!passwordLoading) e.currentTarget.style.background = '#0152EA'; }}
                >
                  <Icon icon={passwordLoading ? 'solar:refresh-outline' : 'solar:key-outline'} width={17} className={passwordLoading ? 'animate-spin' : ''} />
                  {passwordLoading ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </Card>

          {/* Delete Account (Danger Zone) */}
          <Card className="p-6" style={{ border: '1px solid rgba(239, 68, 68, 0.25)', background: '#FEF2F2' }}>
            <div className="flex items-center gap-2 mb-1">
              <Icon icon="solar:danger-triangle-outline" width={20} style={{ color: '#EF4444' }} />
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#991B1B', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
                Delete Account
              </h2>
            </div>
            <p style={{ fontSize: 13, color: '#7F1D1D', fontFamily: 'Manrope, sans-serif', marginBottom: 16, lineHeight: 1.6 }}>
              Once your account is deleted, all of its resources, submissions, abstracts, and generated certificates will be permanently deleted.
            </p>

            <button
              type="button"
              onClick={() => {
                setDeleteModalOpen(true);
                setDeletePassword('');
                setDeleteError('');
              }}
              style={{
                height: 38,
                padding: '0 20px',
                borderRadius: 8,
                background: '#EF4444',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Manrope, sans-serif',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.25)',
                transition: 'background 150ms',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#DC2626'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#EF4444'}
            >
              <Icon icon="solar:trash-bin-trash-outline" width={16} />
              Delete Account
            </button>
          </Card>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(239, 68, 68, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EF4444',
                }}
              >
                <Icon icon="solar:danger-triangle-bold" width={22} />
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
                  Confirm Account Deletion
                </h3>
                <p style={{ fontSize: 12.5, color: '#6B7280', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#475569', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
              Please enter your password to confirm that you wish to permanently delete your account.
            </p>

            <form onSubmit={handleDeleteAccount} className="flex flex-col gap-4">
              <FloatInput
                id="delete_password"
                label="Password *"
                type="password"
                value={deletePassword}
                onChange={(e) => {
                  setDeletePassword(e.target.value);
                  if (deleteError) setDeleteError('');
                }}
                error={Boolean(deleteError)}
                helperText={deleteError}
                placeholder="Enter your current password"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={deleteLoading}
                  style={{
                    height: 38,
                    padding: '0 16px',
                    borderRadius: 8,
                    background: '#F1F5F9',
                    color: '#475569',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'Manrope, sans-serif',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteLoading}
                  style={{
                    height: 38,
                    padding: '0 18px',
                    borderRadius: 8,
                    background: '#EF4444',
                    color: '#fff',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'Manrope, sans-serif',
                    cursor: deleteLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Icon icon={deleteLoading ? 'solar:refresh-outline' : 'solar:trash-bin-trash-outline'} width={16} className={deleteLoading ? 'animate-spin' : ''} />
                  {deleteLoading ? 'Deleting...' : 'Delete My Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
