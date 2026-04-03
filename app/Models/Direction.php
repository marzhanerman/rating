<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Direction extends Model
{
    protected $fillable = [
        'code',
        'name',
        'field_id',
        'year',
    ];

    public function field(): BelongsTo
    {
        return $this->belongsTo(Field::class);
    }
}
