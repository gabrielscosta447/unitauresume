<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BoardImage extends Model
{
        protected $fillable = [
        'lesson_id',
        'image_path'
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

}
