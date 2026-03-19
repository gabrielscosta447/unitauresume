<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Summary extends Model
{
     protected $fillable = [
        'lesson_id',
        'content'
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
