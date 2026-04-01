<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PublicationRanking extends Model
{
    protected $fillable = [
        'year',
        'category',
        'place',
        'university',
        'total',
        'university_id',
        'matched_by',
        'match_percent',
    ];

    protected $casts = [
        'year' => 'integer',
        'place' => 'integer',
        'total' => 'decimal:2',
        'match_percent' => 'decimal:2',
    ];

    public function universityModel(): BelongsTo
    {
        return $this->belongsTo(University::class, 'university_id');
    }
}
