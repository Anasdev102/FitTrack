<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'member' => new UserResource($this->whenLoaded('user')),
            'date' => $this->date?->toDateString(),
            'time' => $this->time,
        ];
    }
}
