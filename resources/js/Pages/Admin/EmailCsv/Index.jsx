import React from 'react';
import AdminPageLayout from "../../../Components/ui/shared/AdminPageLayout.jsx";
import {Card} from '../../../Components/ui/card';
import CsvBox from '../../../Components/ui/CsvBox';

export default function Index({ emailCsv }) {
    return (
        <AdminPageLayout>
            <div className="flex flex-col gap-6 font-[Manrope]">
                {/* Judul Halaman */}
                <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
                    Email CSV
                </h1>
                
                {/* Pembungkus Konten menggunakan Card */}
                <Card>
                    <CsvBox 
                        value={emailCsv}
                        description="To send emails to specific participants, copy the following list (already in CSV format) and use it as BCC for privacy."
                        rows={25}
                    />
                </Card>
            </div>
        </AdminPageLayout>
    );
}