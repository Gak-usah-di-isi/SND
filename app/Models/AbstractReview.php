<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AbstractReview extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        'abstract_id',
        'reviewer_id',
        'recommendation',
        'comment'
    ];

    public function abstract()
    {
        return $this->belongsTo(AbstractModel::class, 'abstract_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
