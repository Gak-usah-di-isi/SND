import React from 'react';
import HumasPageLayout from '../../../Components/ui/shared/HumasPageLayout';
import { Card } from '../../../Components/ui/card';
import CsvBox from '../../../Components/ui/CsvBox';

export default function HumasEmailCsvIndex({ emailCsv, totalEmails }) {
  return (
    <HumasPageLayout currentPath="/humas/email-csv">
      <div className="flex flex-col gap-6 font-[Manrope]">
        <div className="flex items-center justify-between">
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#1F2A3D',
              marginBottom: 0,
              fontFamily: 'Manrope, sans-serif',
            }}
          >
            Email CSV
          </h1>
          {totalEmails !== undefined && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#64748B',
                fontFamily: 'Manrope, sans-serif',
              }}
            >
              Total: {totalEmails} emails
            </span>
          )}
        </div>

        <Card>
          <CsvBox
            value={emailCsv}
            description="To send emails to specific participants, copy the following list (already in CSV format) and use it as BCC for privacy."
            rows={25}
          />
        </Card>
      </div>
    </HumasPageLayout>
  );
}
