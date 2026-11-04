import { useEffect, useRef, useState } from 'react';

/**
 * Rich text editor sederhana berbasis contentEditable (tanpa dependensi).
 *
 * Toolbar: Bold, Italic, Underline, Bullet List, Numbered List, Clear Format.
 * Nilai yang dihasilkan berupa HTML (b, strong, i, em, u, ul, ol, li, br, p, div)
 * sehingga bisa disimpan apa adanya ke kolom text (mis. conference_settings.bank_account)
 * dan di-render kembali dengan dangerouslySetInnerHTML di halaman peserta.
 */
const TOOLS = [
  { cmd: 'bold', title: 'Bold', text: 'B', css: { fontWeight: 800 } },
  { cmd: 'italic', title: 'Italic', text: 'I', css: { fontStyle: 'italic' } },
  { cmd: 'underline', title: 'Underline', text: 'U', css: { textDecoration: 'underline' } },
  { cmd: 'insertUnorderedList', title: 'Bullet List', text: '• —', css: { fontSize: 12 } },
  { cmd: 'insertOrderedList', title: 'Numbered List', text: '1. —', css: { fontSize: 12 } },
  { cmd: 'removeFormat', title: 'Clear Format', text: 'Tx', css: { fontSize: 12, fontWeight: 700 } },
];

/** HTML yang dianggap kosong oleh editor. */
function isEmptyHtml(html) {
  const stripped = String(html ?? '')
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<\/?(p|div|ul|ol|li|b|i|u|strong|em)[^>]*>/gi, '')
    .replace(/&nbsp;/gi, '')
    .trim();
  return stripped === '';
}

export default function RichTextEditor({
  id,
  label,
  value = '',
  onChange,
  placeholder = '',
  rows = 12,
  error = false,
  disabled = false,
  helperText,
}) {
  const editorRef = useRef(null);
  const [focused, setFocused] = useState(false);

  /**
   * Sinkronkan DOM dengan nilai dari server (saat mount / saat di-reset dari luar).
   * Hanya menulis bila benar-benar berbeda supaya kursor tidak terputus saat mengetik.
   */
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const next = value ?? '';
    if (el.innerHTML !== next) el.innerHTML = next;
  }, [value]);

  const handleInput = () => {
    onChange?.(editorRef.current?.innerHTML ?? '');
  };

  const runCommand = (cmd) => {
    const el = editorRef.current;
    if (!el || disabled) return;
    el.focus();
    document.execCommand(cmd, false, null);
    handleInput();
  };

  const borderColor = error ? '#d32f2f' : focused ? '#0152EA' : '#E2E8F0';
  const labelColor = error ? '#d32f2f' : focused ? '#0152EA' : '#1F2A3D';
  const showPlaceholder = focused && isEmptyHtml(value) && !!placeholder;

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 600,
            color: labelColor,
            marginBottom: 6,
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          border: `1px solid ${borderColor}`,
          borderRadius: 8,
          overflow: 'hidden',
          background: disabled ? '#F8FAFC' : '#fff',
          transition: 'border-color 200ms',
        }}
      >
        {/* Toolbar */}
        <div
          role="toolbar"
          aria-label={label ? `${label} toolbar` : 'Formatting toolbar'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            padding: '6px 8px',
            borderBottom: '1px solid #E2E8F0',
            background: '#F8FAFC',
          }}
        >
          {TOOLS.map((tool, index) => (
            <span key={tool.cmd} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <button
                type="button"
                title={tool.title}
                aria-label={tool.title}
                // Mencegah klik tombol menghapus seleksi di dalam editor.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => runCommand(tool.cmd)}
                disabled={disabled}
                style={{
                  minWidth: 30,
                  height: 28,
                  padding: '0 7px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'transparent',
                  color: '#374151',
                  fontFamily: 'Manrope, sans-serif',
                  lineHeight: 1,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1,
                }}
                onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = '#E2E8F0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontFamily: 'Manrope, sans-serif', ...tool.css }}>{tool.text}</span>
              </button>
              {(index === 2 || index === 4) && (
                <span aria-hidden style={{ width: 1, height: 16, background: '#E2E8F0', margin: '0 5px' }} />
              )}
            </span>
          ))}
        </div>

        {/* Area teks */}
        <div style={{ position: 'relative' }}>
          <div
            ref={editorRef}
            id={id}
            role="textbox"
            aria-multiline="true"
            aria-label={label}
            contentEditable={!disabled}
            suppressContentEditableWarning
            onInput={handleInput}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              minHeight: rows * 20,
              padding: '10px 14px',
              outline: 'none',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 400,
              lineHeight: 1.6,
              color: disabled ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.87)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              cursor: disabled ? 'not-allowed' : 'text',
            }}
          />
          {showPlaceholder && (
            <span
              aria-hidden
              style={{
                position: 'absolute',
                left: 14,
                top: 10,
                color: '#94A3B8',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.875rem',
                pointerEvents: 'none',
              }}
            >
              {placeholder}
            </span>
          )}
        </div>
      </div>

      {helperText && (
        <p style={{ fontSize: '0.75rem', marginTop: 4, marginLeft: 2, color: error ? '#d32f2f' : '#94A3B8' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}
