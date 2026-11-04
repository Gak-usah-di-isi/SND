<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ConferenceObjective extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'icon',
        'content',
        'order_number',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order_number' => 'integer',
    ];
}
