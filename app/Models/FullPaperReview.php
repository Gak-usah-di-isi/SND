<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FullPaperReview extends Model
{
    use HasFactory;

    protected $fillable = ['full_paper_id', 'reviewer_id', 'recommendation', 'comment'];

    public function fullPaper()
    {
        return $this->belongsTo(FullPaper::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
