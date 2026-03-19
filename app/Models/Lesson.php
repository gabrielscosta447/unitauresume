<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = [
        'schedule_id',
        'lesson_date'
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
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