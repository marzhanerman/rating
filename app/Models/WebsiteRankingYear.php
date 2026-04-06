<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteRankingYear extends Model
{
    protected $fillable = [
        'year',
        'title',
        'metric_columns',
    ];

    protected $casts = [
        'year' => 'integer',
        'metric_columns' => 'array',
    ];
}
