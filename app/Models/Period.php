<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Period extends Model
{
     protected $fillable = [
        'course_id',
        'number'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function schedules()
    {
     return $this->hasMany(Schedule::class); 
    }
}
