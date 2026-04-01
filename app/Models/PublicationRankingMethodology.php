<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicationRankingMethodology extends Model
{
    protected $fillable = [
        'year',
        'title',
        'criteria',
        'html',
    ];

    protected $casts = [
        'year' => 'integer',
        'criteria' => 'array',
    ];
}
