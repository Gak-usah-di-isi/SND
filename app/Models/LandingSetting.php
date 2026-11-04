<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LandingSetting extends Model
{
    use HasFactory;
    protected $table = 'landing_settings';
    protected $fillable = ['year', 'is_active'];
}
