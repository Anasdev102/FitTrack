<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CoachScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'coach_id' => ['required', 'exists:coaches,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'schedule_date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i', 'after:start_time'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['scheduled', 'completed', 'cancelled'])],
        ];
    }

    public function messages(): array
    {
        return [
            'coach_id.required' => 'Coach is required.',
            'coach_id.exists' => 'Please choose a valid coach.',
            'title.required' => 'Title is required.',
            'schedule_date.required' => 'Date is required.',
            'schedule_date.date' => 'Date must be valid.',
            'start_time.required' => 'Start time is required.',
            'start_time.date_format' => 'Start time must use HH:MM format.',
            'end_time.date_format' => 'End time must use HH:MM format.',
            'end_time.after' => 'End time must be after start time.',
            'status.in' => 'Please choose a valid status.',
        ];
    }
}
