<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FullPaper extends Model
{
    use HasFactory;

    protected $fillable = [
        'abstract_id', 'file_path', 'commitment_letter_path', 'camera_ready_path', 'status', 'note',
        'similarity_file',
    ];

    public function abstract()
    {
        return $this->belongsTo(AbstractModel::class, 'abstract_id');
    }

    public function fullPaperReviews()
    {
        return $this->hasMany(FullPaperReview::class);
    }

    public function reviewers()
    {
        return $this->belongsToMany(User::class, 'full_paper_reviews', 'full_paper_id', 'reviewer_id');
    }

    public function symposium()
    {
        return $this->belongsTo(Symposium::class);
    }
}
