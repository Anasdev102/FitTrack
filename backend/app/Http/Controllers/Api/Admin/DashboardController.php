<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\UserResource;
use App\Models\Attendance;
use App\Models\Coach;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function __invoke()
    {
        Subscription::expirePastDue();

        $activeSubscriptions = Subscription::where('status', 'active')->count();
        $expiredSubscriptions = Subscription::where('status', 'expired')->count();
        $pendingSubscriptions = Subscription::where('status', 'pending')->count();
        $totalSubscriptions = max($activeSubscriptions + $expiredSubscriptions + $pendingSubscriptions, 1);

        return response()->json([
            'stats' => [
                'members' => User::where('role', 'member')->count(),
                'active_subscriptions' => $activeSubscriptions,
                'monthly_revenue' => Payment::where('status', 'paid')->whereMonth('payment_date', now()->month)->sum('amount'),
                'coaches' => Coach::count(),
                'attendance_today' => Attendance::whereDate('date', today())->count(),
                'renewals_this_week' => Subscription::whereBetween('end_date', [today(), today()->addDays(7)])->count(),
            ],
            'recent_members' => UserResource::collection(User::where('role', 'member')->latest()->limit(5)->get()),
            'recent_payments' => PaymentResource::collection(Payment::with('user')->latest()->limit(5)->get()),
            'membership_mix' => [
                'active' => [
                    'count' => $activeSubscriptions,
                    'percent' => round(($activeSubscriptions / $totalSubscriptions) * 100),
                ],
                'expired' => [
                    'count' => $expiredSubscriptions,
                    'percent' => round(($expiredSubscriptions / $totalSubscriptions) * 100),
                ],
                'pending' => [
                    'count' => $pendingSubscriptions,
                    'percent' => round(($pendingSubscriptions / $totalSubscriptions) * 100),
                ],
            ],
            'payments_chart' => collect(range(5, 0))->map(fn ($monthsAgo) => [
                'month' => Carbon::now()->subMonths($monthsAgo)->format('M'),
                'revenue' => (float) Payment::where('status', 'paid')
                    ->whereYear('payment_date', Carbon::now()->subMonths($monthsAgo)->year)
                    ->whereMonth('payment_date', Carbon::now()->subMonths($monthsAgo)->month)
                    ->sum('amount'),
            ]),
        ]);
    }
}
