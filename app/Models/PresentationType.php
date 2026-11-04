<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PresentationType extends Model
{
    use HasFactory;

    protected $table = 'presentation_types';

    protected $fillable = [
        'name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function abstracts()
    {
        return $this->hasMany(AbstractModel::class, 'presentation_type', 'name');
    }
}
