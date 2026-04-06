<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteRankingMethodology extends Model
{
    protected $fillable = [
        'year',
        'title',
        'intro',
        'criteria',
        'html',
        'source_item_id',
    ];

    protected $casts = [
        'year' => 'integer',
        'intro' => 'array',
        'criteria' => 'array',
        'source_item_id' => 'integer',
    ];
}
