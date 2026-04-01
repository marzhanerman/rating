<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function groupLevel(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'level_id');
    }

    public function educationalProgramLevel(): BelongsTo
    {
        return $this->belongsTo(EducationalProgram::class, 'level_id');
    }
}
