<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    public function toArray($request): array
    {
        if (! $this->resource) {
            return [];
        }

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'member' => new UserResource($this->whenLoaded('user')),
            'type' => $this->type,
            'plan_name' => $this->plan_name,
            'duration_days' => $this->duration_days,
            'price' => (float) $this->price,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'payment_method' => $this->payment_method ?? 'cash',
            'payment_deadline' => $this->payment_deadline?->toDateTimeString(),
            'cancelled_at' => $this->cancelled_at?->toDateTimeString(),
            'cancellation_reason' => $this->cancellation_reason,
            'remaining_days' => $this->end_date && $this->status === 'active'
                ? max(0, today()->diffInDays($this->end_date, false))
                : null,
            'requested_at' => $this->requested_at?->toDateTimeString(),
            'paid_at' => $this->paid_at?->toDateTimeString(),
            'activated_at' => $this->activated_at?->toDateTimeString(),
            'approved_at' => $this->approved_at?->toDateTimeString(),
            'rejected_at' => $this->rejected_at?->toDateTimeString(),
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
