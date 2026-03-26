<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ranking extends Model
{
    protected $table = 'rankings';

    protected $fillable = [
        'university_id',
        'year',
        'level_type',
        'level_id',
        'rank',
        'total_score',
        'institutional_category'
    ];

    public function university()
    {
        return $this->belongsTo(University::class, 'university_id');
    }
}
