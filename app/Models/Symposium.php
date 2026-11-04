<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Symposium extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'symposiums';

    protected $fillable = [
        'name',
        'abbreviation',
        'description',
    ];

    public function abstracts()
    {
        return $this->hasMany(AbstractModel::class);
    }
}
