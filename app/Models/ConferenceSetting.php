<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ConferenceSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'conference_title',
        'conference_abbreviation',
        'conference_chairperson',
        'administrator_email',
        'treasurer_email',
        'bank_account',
        'max_abstracts_per_participant',
        'max_words_in_abstract_body',
        'attendance_format',
        'open_registration',
        'open_full_paper_upload',
        'open_abstract_submission',
        'enable_publication_selection',
    ];

    protected $casts = [
        'open_registration' => 'boolean',
        'open_full_paper_upload' => 'boolean',
        'open_abstract_submission' => 'boolean',
        'enable_publication_selection' => 'boolean',
    ];
}
