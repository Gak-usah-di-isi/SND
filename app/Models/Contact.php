<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'phone1', 'phone1_name', 
        'phone2', 'phone2_name',
        'email', 'address', 'year'
    ];

    protected $casts = [
        'year' => 'integer',
    ];
}
