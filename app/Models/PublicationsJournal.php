<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PublicationsJournal extends Model
{
    use HasFactory;
    protected $fillable = [
        'image_type',
        'image_path',
        'year'
    ];
}
