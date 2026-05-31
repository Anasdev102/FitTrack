<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CoachRequest;
use App\Http\Resources\CoachResource;
use App\Models\Coach;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CoachController extends Controller
{
    public function index()
    {
        return CoachResource::collection(Coach::with('user')->latest()->paginate(12));
    }

    public function store(CoachRequest $request)
    {
        $data = $request->validated();
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
            'role' => 'coach',
            'image' => $data['image'] ?? null,
        ]);

        unset($data['email'], $data['password']);

        return new CoachResource(Coach::create(array_merge($data, ['user_id' => $user->id]))->load('user'));
    }

    public function update(CoachRequest $request, Coach $coach)
    {
        $data = $request->validated();
        if ($coach->user) {
            $coach->user->update(array_filter([
                'name' => $data['name'],
                'email' => $data['email'] ?? $coach->user->email,
                'phone' => $data['phone'] ?? null,
                'image' => $data['image'] ?? null,
                'password' => ! empty($data['password']) ? Hash::make($data['password']) : null,
            ], fn ($value) => $value !== null));
        }

        unset($data['email'], $data['password']);
        $coach->update($data);

        return new CoachResource($coach->load('user'));
    }

    public function destroy(Coach $coach)
    {
        $coach->delete();

        return response()->noContent();
    }
}
