<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AbstractGuideline extends Model
{
    use HasFactory;

    protected $fillable = ['year', 'content', 'pdf_file'];
}
