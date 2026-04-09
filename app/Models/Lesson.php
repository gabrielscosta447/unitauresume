<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = [

        'lesson_date'
    ];

  public function schedules()
{
    return $this->belongsToMany(
        Schedule::class,
        'lesson_schedule'
    );
}

    public function boardImages()
    {
    return $this->hasMany(BoardImage::class); 
    }

    public function summary()
    {
      return $this->hasOne(Summary::class); 
    }
}