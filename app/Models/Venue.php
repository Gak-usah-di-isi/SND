<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = [
        'image_path', 'venue_name', 'address', 'date', 'link_map', 'map', 'year',
        'conference_mode', 'onsite_programme', 'online_programme'
    ];
}
