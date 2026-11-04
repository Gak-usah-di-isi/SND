<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InvitationTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject', 'zoom_url', 'zoom_id', 'zoom_pass',
        'venue', 'letter_date', 'pdf_theme_paragraph',
        'rundown_edition', 'organizer', 'event_date_label',
    ];
}
