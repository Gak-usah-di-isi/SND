import { useState } from 'react';
import { router } from '@inertiajs/react';
import LandingEditorPageLayout from '../../../Components/ui/shared/LandingEditorPageLayout';
import BackButton from '../../../Components/ui/BackButton';
import ConfirmDialog from '../../../Components/ui/ConfirmDialog';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import GalleryForm from './GalleryForm';

function IconTrash({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

function IconEdit({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
      <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415z" />
    </svg>
  );
}

function IconX({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function GalleryIndex({ galleries }) {
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [confirmImage, setConfirmImage] = useState(null);
  const [confirmAlbum, setConfirmAlbum] = useState(null);

  const toast = useToast();

  const handleDeleteImage = () => {
    if (!confirmImage) return;
    router.delete(`/landing/gallery-images/${confirmImage.id}`, {
      onSuccess: () => {
        toast.success('Image deleted successfully.');
        setConfirmImage(null);
      },
      onError: () => toast.error('Failed to delete image.'),
    });
  };

  const handleDeleteAlbum = () => {
    if (!confirmAlbum) return;
    router.delete(`/landing/gallery/${confirmAlbum.id}`, {
      onSuccess: () => {
        toast.success('Album deleted successfully.');
        setConfirmAlbum(null);
      },
      onError: () => toast.error('Failed to delete album.'),
    });
  };

  // ─── Create / Edit View ───────────────────────────────────────────────────────
  if (view === 'create' || view === 'edit') {
    return (
      <LandingEditorPageLayout currentPath="/landing/gallery">
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <BackButton onClick={() => {
            setView('list');
            setSelected(null);
          }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
            {view === 'create' ? 'Add Gallery' : 'Edit Gallery'}
          </h1>
        </div>
        <GalleryForm
          mode={view}
          editGallery={selected}
          onCancel={() => {
            setView('list');
            setSelected(null);
          }}
        />
        <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
      </LandingEditorPageLayout>
    );
  }

  // ─── List View ────────────────────────────────────────────────────────────────
  const items = galleries || [];

  return (
    <LandingEditorPageLayout currentPath="/landing/gallery">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Gallery
      </h1>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <span style={{ fontSize: 14, color: '#64748B', fontFamily: 'Manrope, sans-serif' }}>
          Total: <strong style={{ color: '#1F2A3D' }}>{items.length}</strong> albums
        </span>
        <button
          type="button"
          onClick={() => setView('create')}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5v14" />
          </svg>
          Add Gallery
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16"
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            border: '1px solid #E2E8F0',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p className="font-medium text-gray-500 mt-3">No gallery albums found</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Gallery" to create a photo album.</p>
        </div>
      )}

      {/* Gallery Groups by Year */}
      {items.map((gallery) => (
        <div
          key={gallery.id}
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            border: '1px solid #E2E8F0',
            marginBottom: 24,
            overflow: 'hidden',
          }}
        >
          {/* Year Header */}
          <div
            className="flex items-center justify-between flex-wrap gap-2"
            style={{
              padding: '16px 20px',
              borderBottom: gallery.images && gallery.images.length > 0 ? '1px solid #F1F5F9' : 'none',
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#1F2A3D',
                fontFamily: 'Manrope, sans-serif',
              }}>
                {gallery.year}
              </span>
              <span style={{
                fontSize: 12,
                color: '#94A3B8',
                fontFamily: 'Manrope, sans-serif',
              }}>
                ({gallery.images ? gallery.images.length : 0} images)
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setSelected(gallery);
                  setView('edit');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                style={{ color: '#0152EA', cursor: 'pointer', border: 'none', background: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <IconEdit size={14} />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setConfirmAlbum(gallery)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                style={{ color: '#EF4444', cursor: 'pointer', border: 'none', background: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <IconTrash size={14} />
                Delete Album
              </button>
            </div>
          </div>

          {/* Image Grid */}
          {gallery.images && gallery.images.length > 0 && (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
              style={{ padding: '16px 20px' }}
            >
              {gallery.images.map((img) => (
                <div
                  key={img.id}
                  style={{
                    position: 'relative',
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    aspectRatio: '1',
                  }}
                >
                  <img
                    src={`/storage/${img.image_path}`}
                    alt="Gallery"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.backgroundColor = '#F1F5F9';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setConfirmImage(img)}
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.55)',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 150ms',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.85)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.55)'}
                    title="Delete image"
                  >
                    <IconX />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty images */}
          {(!gallery.images || gallery.images.length === 0) && (
            <div className="flex items-center justify-center py-8" style={{ color: '#94A3B8', fontSize: 13, fontFamily: 'Manrope, sans-serif' }}>
              No images in this album
            </div>
          )}
        </div>
      ))}

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />

      {/* Confirm delete image */}
      <ConfirmDialog
        open={Boolean(confirmImage)}
        title="Delete Image"
        message="Are you sure you want to delete this image?"
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setConfirmImage(null)}
        onConfirm={handleDeleteImage}
      />

      {/* Confirm delete album */}
      <ConfirmDialog
        open={Boolean(confirmAlbum)}
        title="Delete Album"
        message={confirmAlbum ? `Are you sure you want to delete the album for year ${confirmAlbum.year} and all its images?` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setConfirmAlbum(null)}
        onConfirm={handleDeleteAlbum}
      />
    </LandingEditorPageLayout>
  );
}
