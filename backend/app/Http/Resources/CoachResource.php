<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CoachResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'name' => $this->name,
            'phone' => $this->phone,
            'speciality' => $this->speciality,
            'bio' => $this->bio,
            'salary' => $this->salary ? (float) $this->salary : null,
            'image' => $this->image,
        ];
    }
}
