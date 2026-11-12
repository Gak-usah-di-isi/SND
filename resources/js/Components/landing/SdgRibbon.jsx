// Pita 17 warna SDGs dari Sdg.color: motif identitas, karena setiap abstrak wajib terhubung ke SDGs.
export default function SdgRibbon({ sdgs, className = '' }) {
    if (!sdgs?.length) return null;
    return (
        <div className={`flex h-2 w-full ${className}`} aria-hidden="true">
            {sdgs.map((s) => (
                <span key={s.id ?? s.code} className="flex-1" style={{ backgroundColor: s.color }} />
            ))}
        </div>
    );
}
