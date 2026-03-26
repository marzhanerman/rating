<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    protected $table = 'universities';

    protected $fillable = [
        'current_name',
        'status',
        'closed_year',
        'city',
    ];

    public function institutionalRatings()
    {
        return $this->hasMany(InstitutionalRating::class, 'university_id');
    }
}
