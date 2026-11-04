<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prevconference extends Model
{
    protected $fillable = [
        'image',
        'title',
        'description',
        'keynote',
        'date',
        'location',
        'pdf',
        'year'
    ];
}
