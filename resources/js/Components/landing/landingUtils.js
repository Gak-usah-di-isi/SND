// Path dari database disimpan relatif ke disk "public" (mis. "speakers/a.jpg").
export function assetUrl(path) {
    if (!path) return null;
    if (path.startsWith('/') || path.startsWith('http')) return path;
    return `/storage/${path}`;
}

// "2026-12-19" dibaca sebagai tanggal lokal, bukan UTC, agar tidak bergeser sehari.
export function parseDate(value) {
    if (!value) return null;
    const [y, m, d] = String(value).slice(0, 10).split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
}

const longFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const monthFmt = new Intl.DateTimeFormat('id-ID', { month: 'short' });

export function formatDate(value) {
    const date = parseDate(value);
    return date ? longFmt.format(date) : null;
}

export function dateParts(value) {
    const date = parseDate(value);
    if (!date) return null;
    return { day: date.getDate(), month: monthFmt.format(date).replace('.', ''), year: date.getFullYear() };
}

// Inisial untuk avatar pengganti saat foto belum diunggah. Gelar (Dr., Prof.) dilewati.
export function initials(name = '') {
    const words = name
        .split(/[\s,]+/)
        .filter((w) => w && !w.includes('.') && /^[A-Za-z]/.test(w));
    return words.slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';
}

export function waLink(phone) {
    if (!phone) return null;
    const digits = String(phone).replace(/\D/g, '').replace(/^0/, '62');
    return `https://wa.me/${digits}`;
}

export function displayPhone(phone) {
    if (!phone) return '';
    const digits = String(phone).replace(/\D/g, '').replace(/^62/, '0');
    return digits.replace(/(\d{4})(\d{4})(\d+)/, '$1 $2 $3');
}
