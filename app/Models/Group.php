<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Group extends Model
{
    protected $fillable = [
        'code',
        'name',
        'direction_id',
        'year',
    ];

    public function direction(): BelongsTo
    {
        return $this->belongsTo(Direction::class);
    }
}
