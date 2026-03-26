<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstitutionalRating extends Model
{
    protected $table = 'institutional_ratings';

    protected $fillable = [
        'university_id',
        'year',
        'rank',
        'total_score',
    ];

    public function university()
    {
        return $this->belongsTo(University::class, 'university_id');
    }
}
