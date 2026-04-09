<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
     protected $fillable = [
        'course_id',
        'period_id',
        'subject_id',
        'weekday',
      'time_slot_id'
    ];

    public function period()
    {
        return $this->belongsTo(Period::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

   public function lessons()
{
    return $this->belongsToMany(
        Lesson::class,
        'lesson_schedule'
    );
}

    public function  timeSlot()
    {
        return $this->belongsTo(TimeSlot::class);
    }
}
