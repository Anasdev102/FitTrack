<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'subscription_id' => $this->subscription_id,
            'member' => new UserResource($this->whenLoaded('user')),
            'amount' => (float) $this->amount,
            'method' => $this->method,
            'status' => $this->status,
            'payment_date' => $this->payment_date?->toDateString(),
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
