export default function OmzetCard({ label, value, description = '' }) {
  return (
    <div
      className="flex flex-col justify-center px-6 py-5 bg-white w-full"
      style={{ borderRadius: '8px', height: 132, boxShadow: '0px 4px 12px rgba(0,0,0,0.04)' }}
    >
      <p className="font-bold" style={{ fontSize: 18, color: 'rgba(42,53,71,0.8)' }}>{label}</p>
      <p className="font-bold mt-2" style={{ fontSize: 24, color: '#0152EA' }}>{value}</p>
      {description && (
        <p className="font-bold mt-1" style={{ fontSize: 12, color: '#0152EA', opacity: 0.4 }}>{description}</p>
      )}
    </div>
  );
}
