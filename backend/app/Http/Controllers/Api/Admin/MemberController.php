<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MemberRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $members = User::query()
            ->where('role', 'member')
            ->with('activeSubscription')
            ->when($request->search, fn ($query, $search) => $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('phone', 'like', "%{$search}%")))
            ->when($request->status, fn ($query, $status) => $query->whereHas('subscriptions', fn ($q) => $q->where('status', $status)))
            ->latest()
            ->paginate(12);

        return UserResource::collection($members);
    }

    public function store(MemberRequest $request)
    {
        $data = $request->validated();
        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $member = User::create(array_merge($data, ['role' => 'member']));

        return new UserResource($member);
    }

    public function show(User $member)
    {
        abort_unless($member->role === 'member', 404);

        return new UserResource($member->load(['subscriptions', 'payments', 'attendances']));
    }

    public function update(MemberRequest $request, User $member)
    {
        abort_unless($member->role === 'member', 404);
        $data = array_filter($request->validated(), fn ($value) => $value !== null);
        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $member->update($data);

        return new UserResource($member);
    }

    public function destroy(User $member)
    {
        abort_unless($member->role === 'member', 404);
        $member->delete();

        return response()->noContent();
    }
}
