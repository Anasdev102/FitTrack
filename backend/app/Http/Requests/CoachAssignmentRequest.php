<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CoachAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'coach_id' => ['required', 'exists:coaches,id'],
            'member_id' => ['required', 'exists:users,id'],
        ];
    }
}
