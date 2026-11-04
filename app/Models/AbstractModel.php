<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AbstractModel extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'abstracts';
    protected $fillable = [
        'user_id', 'symposium_id', 'title', 'slug', 'keyword', 'authors', 'affiliations',
        'corresponding_email', 'abstract', 'presentation_type', 'publication', 'status'
    ];
    protected $appends = ['route_key'];

    // Legacy (2025) rows have no slug and keep resolving by id; new rows resolve by slug.
    public function resolveRouteBinding($value, $field = null)
    {
        $field = ctype_digit((string) $value) ? 'id' : 'slug';
        return $this->resolveRouteBindingQuery($this, $value, $field)->first();
    }

    public function getRouteKeyAttribute()
    {
        return $this->slug ?? (string) $this->id;
    }

    // Clean slug in the common case (e.g. "machine-learning"); only appends -2, -3, ...
    // when the base slug is already taken by another abstract.
    public static function generateUniqueSlug(string $title): string
    {
        $base = Str::limit(Str::slug($title), 180, '');
        $slug = $base;
        $counter = 1;

        while (static::withTrashed()->where('slug', $slug)->exists()) {
            $counter++;
            $slug = "{$base}-{$counter}";
        }

        return $slug;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function symposium()
    {
        return $this->belongsTo(Symposium::class);
    }

    public function abstractReviews()
    {
        return $this->hasMany(AbstractReview::class, 'abstract_id');
    }

    public function fullPaper()
    {
        return $this->hasOne(FullPaper::class, 'abstract_id');
    }

    public function reviewers()
    {
        return $this->belongsToMany(User::class, 'abstract_reviews', 'abstract_id', 'reviewer_id')->withPivot(['comment', 'recommendation'])->withTimestamps();
    }

    /** Pembayaran pemilik abstract untuk tahun konferensi yang sedang aktif. */
    public function filePayment()
    {
        return $this->hasOne(FilePayment::class, 'user_id', 'user_id')->forYear(Year::activeYear());
    }
}
