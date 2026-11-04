<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RegistrationFee extends Model
{
    use HasFactory;
    protected $fillable = ['category_name', 'role_type', 'domestic_participants', 'international_participants', 'period_of_payment', 'year'];
}
