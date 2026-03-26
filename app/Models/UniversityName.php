<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UniversityName extends Model
{
    protected $table = 'university_names';

    protected $fillable = [
        'university_id',
        'name',
        'valid_from',
        'valid_to',
    ];

    public function university()
    {
        return $this->belongsTo(University::class);
    }
}