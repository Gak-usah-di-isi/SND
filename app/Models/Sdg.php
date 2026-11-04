<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sdg extends Model
{
    use HasFactory;

    protected $fillable = [
        'order',
        'code',
        'name_en',
        'name_id',
        'color',
        'icon',
    ];

    public function abstracts()
    {
        return $this->belongsToMany(AbstractModel::class, 'abstract_sdg', 'sdg_id', 'abstract_id');
    }
}
