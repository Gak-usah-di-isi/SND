<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InvitationRundownItem extends Model
{
    use HasFactory;

    protected $fillable = ['time_label', 'program', 'pic', 'is_section_header', 'sort_order'];

    protected $casts = [
        'is_section_header' => 'boolean',
    ];

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}
