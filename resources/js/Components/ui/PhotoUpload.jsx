import { Plus } from 'lucide-react';

export default function PhotoUpload({
  label,
  previewUrl,
  onChange,
  helperText = 'Make sure your photo format is JPG or PNG\nMaximum file size is 2MB',
  inputId = 'photo-upload',
}) {
  const helperLines = String(helperText).split('\n');

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-gray-800">{label}</p>
      <div
        className="flex flex-col items-center justify-center text-center"
        style={{
          width: 240,
          height: 240,
          border: '2px dashed #E0E0E0',
          borderRadius: 8,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
        onClick={() => document.getElementById(inputId)?.click()}
        onMouseEnter={(event) => {
          event.currentTarget.style.borderColor = '#1976D2';
          event.currentTarget.style.backgroundColor = '#F5F5F5';
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.borderColor = '#E0E0E0';
          event.currentTarget.style.backgroundColor = '#fff';
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <div
              className="flex items-center justify-center rounded-full mb-2"
              style={{ width: 44, height: 44, backgroundColor: '#E3F2FD' }}
            >
              <Plus size={26} className="text-[#1976D2]" />
            </div>
            <p className="text-xs text-gray-500 px-6">
              {helperLines.map((line, index) => (
                <span key={line + index}>
                  {line}
                  {index < helperLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
          </>
        )}
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="hidden"
          onChange={onChange}
        />
      </div>
    </div>
  );
}
