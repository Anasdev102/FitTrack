<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CoachFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'speciality' => fake()->randomElement(['Strength Training', 'CrossFit', 'Yoga', 'Boxing']),
            'salary' => fake()->numberBetween(3000, 8000),
        ];
    }
}
