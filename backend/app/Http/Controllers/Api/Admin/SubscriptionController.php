<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubscriptionRequest;
use App\Http\Resources\SubscriptionResource;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        Subscription::expirePastDue();

        $subscriptions = Subscription::with('user')
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(12);

        return SubscriptionResource::collection($subscriptions);
    }

    public function store(SubscriptionRequest $request)
    {
        $plan = config("plans.{$request->type}");

        if (Subscription::where('user_id', $request->user_id)->where('status', 'pending')->exists()) {
            return response()->json(['message' => 'This member already has a pending subscription request.'], 422);
        }

        $subscription = Subscription::create([
            'user_id' => $request->user_id,
            'type' => $request->type,
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

        return new SubscriptionResource($subscription->load('user'));
    }

    public function update(SubscriptionRequest $request, Subscription $subscription)
    {
        $plan = config("plans.{$request->type}");
        $subscription->update([
            'user_id' => $request->user_id,
            'type' => $request->type,
            'price' => $plan['price'],
        ]);

        return new SubscriptionResource($subscription->load('user'));
    }

    public function approve(Subscription $subscription)
    {
        return $this->activate($subscription);
    }

    public function confirmCashPayment(Subscription $subscription)
    {
        $subscription->cancelIfPaymentDeadlinePassed();

        if ($subscription->status !== 'pending') {
            return response()->json(['message' => 'Only pending subscription requests can receive cash payment.'], 422);
        }

        $plan = $this->planFor($subscription);

        Payment::updateOrCreate(
            ['subscription_id' => $subscription->id],
            [
                'user_id' => $subscription->user_id,
                'amount' => $plan['price'],
                'method' => 'cash',
                'status' => 'paid',
                'payment_date' => today(),
            ]
        );

        $subscription->update([
            'price' => $plan['price'],
            'plan_name' => $plan['name'],
            'duration_days' => $plan['duration_days'],
            'payment_method' => 'cash',
            'payment_status' => 'paid',
            'paid_at' => now(),
        ]);

        return new SubscriptionResource($subscription->load('user'));
    }

    public function activate(Subscription $subscription)
    {
        Subscription::expirePastDue();
        $subscription->cancelIfPaymentDeadlinePassed();

        if ($subscription->status !== 'pending') {
            return response()->json(['message' => 'Only pending subscription requests can be activated.'], 422);
        }

        if ($subscription->payment_status !== 'paid') {
            return response()->json(['message' => 'Cash payment must be confirmed before activation.'], 422);
        }

        $plan = $this->planFor($subscription);
        $startDate = today();
        $endDate = today()->addDays($plan['duration_days']);

        Subscription::where('user_id', $subscription->user_id)
            ->where('status', 'active')
            ->where('id', '!=', $subscription->id)
            ->update(['status' => 'expired']);

        $subscription->update([
            'price' => $plan['price'],
            'plan_name' => $plan['name'],
            'duration_days' => $plan['duration_days'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => 'active',
            'payment_status' => 'paid',
            'payment_method' => 'cash',
            'activated_at' => now(),
            'approved_at' => now(),
            'rejected_at' => null,
        ]);

        return new SubscriptionResource($subscription->load('user'));
    }

    public function reject(Subscription $subscription)
    {
        $subscription->cancelIfPaymentDeadlinePassed();

        if ($subscription->status !== 'pending' || $subscription->payment_status === 'paid') {
            return response()->json(['message' => 'Only unpaid pending requests can be rejected.'], 422);
        }

        $subscription->update([
            'status' => 'rejected',
            'payment_status' => 'unpaid',
            'rejected_at' => now(),
        ]);

        return new SubscriptionResource($subscription->load('user'));
    }

    public function destroy(Subscription $subscription)
    {
        $subscription->delete();

        return response()->noContent();
    }

    private function planFor(Subscription $subscription): array
    {
        $plan = config("plans.{$subscription->type}");

        return [
            'name' => $subscription->plan_name ?: $plan['name'],
            'price' => $subscription->price ?: $plan['price'],
            'duration_days' => $subscription->duration_days ?: $plan['duration_days'],
        ];
    }
}
