<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConferenceDetail extends Model
{
    use HasFactory;

    protected $table = 'conference_details';

    protected $fillable = [
        'title', 'theme', 'university', 'hosted', 'date', 'year'
    ];
}
