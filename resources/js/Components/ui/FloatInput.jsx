import { useState, useRef } from 'react';

export function FloatInput({
  label, id, value = '', onChange, placeholder = '',
  type = 'text', disabled = false,
  multiline = false, rows = 4,
  error = false, helperText, forceFloating = false, onFocus, onBlur, ...rest
}) {
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);

  const filled   = value !== '' && value !== null && value !== undefined;
  const floating = focused || filled || forceFloating;

  const borderColor = error ? '#d32f2f' : focused ? '#0152EA' : '#E2E8F0';
  const labelColor  = error ? '#d32f2f' : focused ? '#0152EA' : '#1F2A3D';

  // Notch width: label scaled 0.75, each char ~6.6px at 0.875rem, +8px padding
  const notchW = floating && label ? label.length * 6.6 + 10 : 0;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Floating label */}
      {label && (
        <label
          htmlFor={id}
          onClick={() => ref.current?.focus()}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 1,
            pointerEvents: floating ? 'none' : 'auto',
            cursor: 'text',
            transformOrigin: 'top left',
            transform: floating
              ? 'translate(14px, -9px) scale(0.75)'
              : multiline
                ? 'translate(14px, 8px) scale(1)'
                : 'translate(14px, 6px) scale(1)',
            transition: 'transform 200ms cubic-bezier(0,0,0.2,1), color 200ms',
            fontSize: '0.875rem',
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 600,
            lineHeight: 1.4375,
            color: labelColor,
            backgroundColor: floating ? '#fff' : 'transparent',
            padding: floating ? '0 4px' : '0',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </label>
      )}

      {/* Wrapper div — this IS the visible border box */}
      <div
        onClick={() => ref.current?.focus()}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          width: '100%',
          minHeight: 36,
          borderRadius: '8px',
          boxSizing: 'border-box',
          cursor: disabled ? 'not-allowed' : 'text',
          backgroundColor: disabled ? '#F8FAFC' : '#fff',
        }}
      >
        {/* Notched fieldset — purely visual border */}
        <fieldset
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-8px 0px 0px',
            margin: 0,
            padding: '0 8px',
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
            pointerEvents: 'none',
            transition: 'border-color 200ms',
            overflow: 'hidden',
            bottom: 0,
          }}
        >
          <legend style={{
            float: 'unset',
            display: 'block',
            visibility: 'hidden',
            overflow: 'hidden',
            height: '11px',
            padding: 0,
            fontSize: '0.75em',
            maxWidth: floating ? `${notchW}px` : '0.01px',
            transition: 'max-width 100ms cubic-bezier(0,0,0.2,1) 50ms',
            whiteSpace: 'nowrap',
            marginLeft: '6px',
          }}>&ZeroWidthSpace;{label}</legend>
        </fieldset>

        {/* Actual input / textarea */}
        {multiline ? (
          <textarea
            {...rest}
            ref={ref} id={id} value={value} onChange={onChange}
            disabled={disabled} rows={rows}
            placeholder={focused ? placeholder : ''}
            onFocus={(event) => { setFocused(true); onFocus?.(event); }}
            onBlur={(event) => { setFocused(false); onBlur?.(event); }}
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 400,
              color: disabled ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.87)',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
              cursor: disabled ? 'not-allowed' : undefined,
              padding: '6px 14px 12px',
              resize: 'none',
              lineHeight: 1.5,
            }}
          />
        ) : (
          <input
            {...rest}
            ref={ref} id={id} type={type} value={value} onChange={onChange}
            disabled={disabled}
            placeholder={focused ? placeholder : ''}
            onFocus={(event) => { setFocused(true); onFocus?.(event); }}
            onBlur={(event) => { setFocused(false); onBlur?.(event); }}
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 400,
              color: disabled ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.87)',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
              cursor: disabled ? 'not-allowed' : undefined,
              padding: '0 14px',
              height: 36,
              lineHeight: '36px',
            }}
          />
        )}
      </div>

      {helperText && (
        <p style={{ fontSize: '0.75rem', marginTop: 4, marginLeft: 2, color: error ? '#d32f2f' : '#94A3B8' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}
