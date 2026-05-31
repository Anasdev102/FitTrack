<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Coach;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'FitManager Admin',
            'email' => 'admin@fitmanager.test',
            'phone' => '+212600000000',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $members = User::factory()->count(18)->create(['role' => 'member']);
        Coach::factory()->count(4)->create();

        $members->each(function (User $member) {
            $subscription = Subscription::factory()->create(['user_id' => $member->id]);
            Payment::factory()->create([
                'user_id' => $member->id,
                'subscription_id' => $subscription->id,
                'amount' => $subscription->price,
                'status' => 'paid',
            ]);

            collect(range(1, rand(2, 8)))
                ->map(fn () => fake()->dateTimeBetween('-30 days', 'now')->format('Y-m-d'))
                ->unique()
                ->each(function ($date) use ($member) {
                Attendance::create([
                    'user_id' => $member->id,
                    'date' => $date,
                    'time' => fake()->time('H:i:s'),
                ]);
            });
        });
    }
}
