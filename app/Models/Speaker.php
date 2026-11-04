<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Speaker extends Model
{
    use HasFactory;
    protected $fillable = [
        'role', 'name', 'institution', 'image', 'country', 'year', 'session_topic', 'await_confirmation'
    ];

    protected $casts = [
        'await_confirmation' => 'boolean',
    ];
}
