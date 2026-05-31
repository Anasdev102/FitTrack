<?php

namespace App\Http\Controllers\Api\Member;

use App\Http\Controllers\Controller;
use App\Http\Resources\AttendanceResource;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\SubscriptionResource;
use App\Http\Resources\TrainingPlanResource;
use App\Http\Resources\UserResource;
use App\Models\CoachAssignment;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\TrainingPlan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();
        Subscription::expirePastDue();
        $subscription = $user->subscriptions()
            ->whereIn('status', ['pending', 'active', 'expired', 'rejected', 'cancelled'])
            ->latest()
            ->first();

        return response()->json([
            'user' => new UserResource($user->load('activeSubscription')),
            'subscription' => $subscription ? new SubscriptionResource($subscription) : null,
            'payments' => PaymentResource::collection($user->payments()->latest()->limit(5)->get()),
            'attendances' => AttendanceResource::collection($user->attendances()->latest()->limit(5)->get()),
            'assigned_coach' => CoachAssignment::with('coach.user')
                ->where('member_id', $user->id)
                ->where('status', 'approved')
                ->latest('approved_at')
                ->first()?->coach,
            'training_plans' => TrainingPlanResource::collection($user->hasMany(TrainingPlan::class, 'member_id')->latest()->get()),
        ]);
    }

    public function subscriptions(Request $request)
    {
        Subscription::expirePastDue();

        return SubscriptionResource::collection($request->user()->subscriptions()->latest()->get());
    }

    public function currentSubscription(Request $request)
    {
        Subscription::expirePastDue();

        $subscription = $request->user()->subscriptions()
            ->whereIn('status', ['pending', 'active', 'expired', 'rejected'])
            ->latest()
            ->first();

        return response()->json(['data' => $subscription ? new SubscriptionResource($subscription) : null]);
    }

    public function payments(Request $request)
    {
        return PaymentResource::collection($request->user()->payments()->latest()->get());
    }

    public function attendances(Request $request)
    {
        return AttendanceResource::collection($request->user()->attendances()->latest()->get());
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'image' => ['nullable', 'string', 'max:255'],
        ]);

        $user->update($data);

        return new UserResource($user);
    }

    public function subscribe(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', Rule::in(['monthly', 'quarterly', 'yearly'])],
        ]);

        $user = $request->user();
        $plan = config("plans.{$data['type']}");

        if ($user->subscriptions()->where('status', 'pending')->exists()) {
            return response()->json([
                'message' => 'You already have a pending subscription request. Please visit the gym reception to pay in cash.',
            ], 422);
        }

        $subscription = $user->subscriptions()->create([
            'user_id' => $user->id,
            'type' => $data['type'],
            'plan_name' => $plan['name'],
            'duration_days' => $plan['duration_days'],
            'price' => $plan['price'],
            'start_date' => null,
            'end_date' => null,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'payment_method' => 'cash',
            'requested_at' => now(),
            'payment_deadline' => now()->addHours(48),
        ]);

        return response()->json([
            'subscription' => new SubscriptionResource($subscription),
            'message' => 'Your subscription request has been created. Please visit the gym reception and pay in cash to activate your membership.',
        ], 201);
    }
}
