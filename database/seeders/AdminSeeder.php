<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // make seeding idempotent: insert or update existing admin by username
        DB::table('admins')->updateOrInsert(
            ['username' => 'angel'],
            [
                'email' => 'angel@gmail.com',
                'password' => Hash::make('angel1'),
                'updated_at' => Carbon::now(),
                'created_at' => Carbon::now(),
            ]
        );
    }
}
