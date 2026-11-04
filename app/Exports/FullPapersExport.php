<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Support\Collection;

class FullPapersExport implements FromCollection, WithHeadings, WithMapping
{
    protected Collection $fullpapers;
    protected int $rowNumber = 1;

    public function __construct(Collection $fullpapers)
    {
        $this->fullpapers = $fullpapers;
    }

    public function collection()
    {
        return $this->fullpapers;
    }

    public function headings(): array
    {
        return [
            'No',
            'Title',
            'Correspondent Email',
            'Authors',
            'Affiliations',
            'Symposium',
            'Presentation Type',
            'Publication',
            'Status',
            'Reviewers',
            'Reviewer Comment',
            'Editor Notes',
            'Submitted At',
        ];
    }

    public function map($fullpaper): array
    {
        $abstract = $fullpaper->abstract;
        $reviewers = $fullpaper->fullPaperReviews
            ->map(fn ($review) => $review->reviewer?->name)
            ->filter()
            ->unique()
            ->join(', ');

        // Komentar reviewer digabung rapi dengan penomoran bila lebih dari satu.
        $reviewerComments = $fullpaper->fullPaperReviews
            ->filter(fn ($review) => filled($review->comment))
            ->values()
            ->map(fn ($review, $index) => ($index + 1) . '. '
                . ($review->reviewer?->name ?? 'Reviewer') . ': '
                . trim($review->comment))
            ->join("\n");

        return [
            $this->rowNumber++,
            $abstract?->title ?? '-',
            $abstract?->corresponding_email ?? '-',
            $abstract?->authors ?? '-',
            $abstract?->affiliations ?? '-',
            $abstract?->symposium?->name ?? '-',
            $abstract?->presentation_type ?? '-',
            $abstract?->publication ?? '-',
            $fullpaper->status ?? '-',
            $reviewers ?: 'No reviewer assigned',
            $reviewerComments ?: 'No comment yet',
            $fullpaper->note ?? '-',
            $fullpaper->created_at ? $fullpaper->created_at->format('Y-m-d H:i') : '-',
        ];
    }

}
