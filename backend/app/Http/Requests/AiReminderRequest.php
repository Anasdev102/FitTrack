<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AiReminderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'member_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'reminder_type' => ['required', Rule::in(['pending_payment', 'expiring_soon', 'expired', 'renewal', 'cancelled', 'rejected'])],
            'language' => ['required', Rule::in(['ar', 'fr', 'en'])],
            'plan_name' => ['nullable', 'string', 'max:255'],
            'amount' => ['nullable', 'numeric'],
            'payment_deadline' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'subscription_status' => ['nullable', Rule::in(['pending', 'active', 'expired', 'rejected', 'cancelled'])],
            'payment_status' => ['nullable', Rule::in(['paid', 'unpaid'])],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $type = $this->input('reminder_type');
            $status = $this->input('subscription_status');
            $paymentStatus = $this->input('payment_status');

            if ($type === 'pending_payment' && ($status !== 'pending' || $paymentStatus !== 'unpaid')) {
                $validator->errors()->add('reminder_type', 'This member does not have a pending cash payment request.');
            }

            if ($type === 'pending_payment' && ! $this->filled('payment_deadline')) {
                $validator->errors()->add('payment_deadline', 'Payment deadline is required for pending cash payment reminders.');
            }

            if (in_array($type, ['expiring_soon', 'expired'], true) && ! $this->filled('end_date')) {
                $validator->errors()->add('end_date', 'End date is required for this reminder type.');
            }
        });
    }
}
