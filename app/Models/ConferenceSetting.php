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
        'payment_instruction',
        'is_payment_enabled',
        'enable_student_registration',
        'open_registration',
        'open_full_paper_upload',
        'open_abstract_submission',
        'enable_publication_selection',
    ];

    protected $casts = [
        'is_payment_enabled' => 'boolean',
        'enable_student_registration' => 'boolean',
        'open_registration' => 'boolean',
        'open_full_paper_upload' => 'boolean',
        'open_abstract_submission' => 'boolean',
        'enable_publication_selection' => 'boolean',
    ];
}
