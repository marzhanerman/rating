<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    public const DEGREE_BACHELOR = 'bachelor';
    public const DEGREE_MASTER = 'master';
    public const DEGREE_PHD = 'phd';
    
    protected $fillable = [
        'code',
        'name',
        'degree',
        'type'
    ];
}
