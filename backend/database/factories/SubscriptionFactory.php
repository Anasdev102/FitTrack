<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubscriptionFactory extends Factory
{
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-6 months', 'now');
        $end = fake()->dateTimeBetween($start, '+1 year');

        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['monthly', 'quarterly', 'yearly']),
            'price' => fake()->randomElement([250, 650, 2200]),
            'start_date' => $start,
            'end_date' => $end,
            'status' => $end >= now() ? 'active' : 'expired',
        ];
    }
}
