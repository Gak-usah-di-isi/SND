<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InvitationBroadcastLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'email',
        'name',
        'role',
        'abstract_id',
        'status',
        'error_message',
        'is_test',
        'sent_at',
    ];

    protected $casts = [
        'is_test' => 'boolean',
        'sent_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function abstract()
    {
        return $this->belongsTo(AbstractModel::class, 'abstract_id');
    }
}
