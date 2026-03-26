<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EducationalProgram extends Model
{
    protected $fillable = [
        'code',
        'name',
        'group_id',
        'field_id',
        'degree',
    ];
}