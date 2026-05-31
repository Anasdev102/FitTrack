<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'subscription_id' => null,
            'amount' => fake()->randomElement([250, 650, 2200]),
            'method' => fake()->randomElement(['cash', 'card', 'bank_transfer']),
            'status' => fake()->randomElement(['paid', 'unpaid']),
            'payment_date' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
