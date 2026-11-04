<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ConferenceTitle extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'year'];

    public static function getByYear($year)
    {
        return self::where('year', $year)->first();
    }
}
