<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
     public function up(): void
    {
        Schema::create('lesson_schedule', function (Blueprint $table) {

            $table->id();

            $table->foreignId('lesson_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('schedule_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->timestamps();

            // evita duplicação
            $table->unique([
                'lesson_id',
                'schedule_id'
            ]);

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lesson_schedule');
    }
};
