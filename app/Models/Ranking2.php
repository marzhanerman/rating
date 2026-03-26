<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ranking2 extends Model
{
    protected $table = 'rankings2';
    protected $casts = [
        'programs' => 'array',
    ];
    protected $fillable = [
        'university_id',
        'year',
        'level_type',
        'level_id',
        'rank',
        'total_score',
        'institutional_category',
        'programs'
    ];
}
