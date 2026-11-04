<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DeadlineDate extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'date', 'year'];
}
