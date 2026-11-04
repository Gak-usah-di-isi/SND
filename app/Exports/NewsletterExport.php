<?php

namespace App\Exports;

use App\Models\Newsletter;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class NewsletterExport implements FromCollection, WithHeadings, WithMapping
{
    /**
     * Mengambil data dari database
     */
    public function collection()
    {
        return Newsletter::select('email', 'created_at')->get();
    }

    /**
     * Menentukan header pada file Excel
     */
    public function headings(): array
    {
        return ["Email", "Subscribed At"];
    }

    /**
     * Format setiap baris data sebelum diekspor
     */
    public function map($newsletter): array
    {
        return [
            $newsletter->email,
            $newsletter->created_at->format('d-m-Y H:i:s'), // Format tanggal lebih rapi
        ];
    }
}
