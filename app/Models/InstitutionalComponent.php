<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstitutionalComponent extends Model
{
    protected $fillable = [
        'ranking_id',
        'university_score',
        'expert_score',
        'employer_score',
        'student_score',
        'alumni_score',
    ];

    public function ranking()
    {
        return $this->belongsTo(Ranking::class);
    }
}
