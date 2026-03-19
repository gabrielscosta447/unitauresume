<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['name'];

    public function periods()
    {
        return $this->hasMany(Period::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
