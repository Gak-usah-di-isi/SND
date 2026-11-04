import React, { useState } from 'react';

export default function CsvBox({ value, description, rows = 10 }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setIsCopied(true); 
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (err) {
            console.error('Gagal menyalin teks: ', err);
        }
    };

    return (
        <div className="flex flex-col gap-2 font-[Manrope]">
            {description && (
                <p className="text-sm text-gray-500">{description}</p>
            )}

            <div className="relative w-full">
                {/* Kotak Textarea */}
                <textarea
                    readOnly
                    value={value}
                    rows={rows}
                    className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] resize-none focus:outline-none focus:ring-2 focus:ring-[#0152EA] transition-all"
                />

                {/* Tombol Salin */}
                <button
                    onClick={handleCopy}
                    className={`absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-[8px] text-white text-sm font-medium transition-all duration-300 ${
                        isCopied 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-[#0152EA] hover:bg-blue-700'
                    }`}
                >
                    {isCopied ? (
                        <>
                            {/* Icon Centang (Tersalin) */}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Tersalin!
                        </>
                    ) : (
                        <>
                            {/* Icon Copy (Belum disalin) */}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Salin
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}