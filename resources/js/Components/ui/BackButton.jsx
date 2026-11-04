import { ArrowLeft } from 'lucide-react';

export default function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
      style={{ borderRadius: 8, color: '#64748B', backgroundColor: 'transparent' }}
      onMouseEnter={(event) => {
        event.currentTarget.style.backgroundColor = '#EAF1FF';
        event.currentTarget.style.color = '#0152EA';
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.backgroundColor = 'transparent';
        event.currentTarget.style.color = '#64748B';
      }}
    >
      <ArrowLeft size={20} />
    </button>
  );
}