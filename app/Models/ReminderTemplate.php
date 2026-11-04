<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReminderTemplate extends Model
{
    use HasFactory;

    protected $fillable = ['subject', 'payment_deadline'];
}
