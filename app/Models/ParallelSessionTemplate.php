<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ParallelSessionTemplate extends Model
{
    use HasFactory;

    protected $fillable = ['subject', 'important_notes', 'online_guidelines', 'submission_form_url'];
}
