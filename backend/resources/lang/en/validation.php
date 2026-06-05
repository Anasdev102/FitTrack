<?php

return [
    'required' => 'The :attribute field is required.',
    'email' => 'The :attribute must be a valid email address.',
    'string' => 'The :attribute must be text.',
    'numeric' => 'The :attribute must be a number.',
    'date' => 'The :attribute must be a valid date.',
    'date_format' => 'The :attribute must match the required format.',
    'after' => 'The :attribute must be after :date.',
    'exists' => 'The selected :attribute is invalid.',
    'in' => 'The selected :attribute is invalid.',
    'max' => [
        'string' => 'The :attribute must not be greater than :max characters.',
        'numeric' => 'The :attribute must not be greater than :max.',
        'file' => 'The :attribute must not be greater than :max kilobytes.',
        'array' => 'The :attribute must not have more than :max items.',
    ],
    'min' => [
        'string' => 'The :attribute must be at least :min characters.',
        'numeric' => 'The :attribute must be at least :min.',
        'file' => 'The :attribute must be at least :min kilobytes.',
        'array' => 'The :attribute must have at least :min items.',
    ],
    'unique' => 'The :attribute has already been taken.',

    'attributes' => [
        'coach_id' => 'coach',
        'member_id' => 'member',
        'schedule_date' => 'date',
        'start_time' => 'start time',
        'end_time' => 'end time',
        'payment_deadline' => 'payment deadline',
        'reminder_type' => 'reminder type',
        'plan_name' => 'plan name',
        'member_name' => 'member name',
        'payment_status' => 'payment status',
        'subscription_status' => 'subscription status',
    ],
];
