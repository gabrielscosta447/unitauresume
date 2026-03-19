<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TimeSlotSeeder extends Seeder
{
    public function run(): void
    {
        $slots = [

            [
                'start_time' => '19:00',
                'end_time' => '20:40'
            ],
            [
                'start_time' => '21:00',
                'end_time' => '22:40'
            ],

        ];

        DB::table('time_slots')->insert($slots);
    }
}