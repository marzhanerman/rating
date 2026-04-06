<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteRanking extends Model
{
    protected $fillable = [
        'year',
        'category_key',
        'category_label',
        'place',
        'university_name',
        'website_url',
        'total_score',
        'metrics',
        'source_item_id',
        'source_title',
    ];

    protected $casts = [
        'year' => 'integer',
        'place' => 'integer',
        'total_score' => 'decimal:2',
        'metrics' => 'array',
        'source_item_id' => 'integer',
    ];
}
