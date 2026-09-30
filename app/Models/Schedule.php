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
        'time_slot_id',
    ];

    protected $appends = [
        'time',
        'subject_name',
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

    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class);
    }

    public function getTimeAttribute()
    {
        return $this->timeSlot?->start_time;
    }

    public function getSubjectNameAttribute()
    {
        return $this->subject?->name;
    }
}