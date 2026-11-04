<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PublicationSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'proceedings_text',
        'journal_title',
        'journal_text',
        'is_journal_active',
    ];

    protected $casts = [
        'is_journal_active' => 'boolean',
    ];

    public static function defaultProceedingsText($year = '2026'): string
    {
        return "All accepted and presented papers that meet the publication requirements will be published in the ICASVE {$year} Conference Proceedings with an ISSN.";
    }

    public static function defaultJournalText(): string
    {
        return "In collaboration with the Asian Journal of Accounting Research (AJAR), a Scopus-indexed Q2 journal published by Emerald Publishing, selected high-quality papers aligned with the journal’s aims and scope will be invited to submit extended versions of their manuscripts for consideration for publication in the journal. Any submission to the journal will be subject to the journal’s standard editorial screening and peer-review process.";
    }

    public static function getOrDefault($year)
    {
        try {
            $setting = self::where('year', $year)->first();
            if ($setting) {
                return $setting;
            }
        } catch (\Throwable $e) {
            // Table might not exist yet before migration
        }

        $obj = new self();
        $obj->year = (string) $year;
        $obj->proceedings_text = self::defaultProceedingsText($year);
        $obj->journal_title = 'Journal Publication Opportunity';
        $obj->journal_text = self::defaultJournalText();
        $obj->is_journal_active = true;
        return $obj;
    }
}
