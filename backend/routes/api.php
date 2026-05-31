<?php

use App\Http\Controllers\Api\Admin\AiReminderController;
use App\Http\Controllers\Api\Admin\AttendanceController;
use App\Http\Controllers\Api\Admin\CoachController;
use App\Http\Controllers\Api\Admin\CoachAssignmentController;
use App\Http\Controllers\Api\Admin\CoachScheduleController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\MemberController;
use App\Http\Controllers\Api\Admin\PaymentController;
use App\Http\Controllers\Api\Admin\SubscriptionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Coach\CoachAreaController;
use App\Http\Controllers\Api\Member\ProfileController;
use App\Http\Resources\CoachResource;
use App\Models\Coach;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));
Route::get('/plans', fn () => response()->json(['data' => config('plans')]));
Route::get('/coaches', fn () => CoachResource::collection(Coach::with('user')->latest()->get()));
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', DashboardController::class);
        Route::apiResource('members', MemberController::class)->parameters(['members' => 'member']);
        Route::get('/subscription-requests', [SubscriptionController::class, 'index']);
        Route::post('/subscription-requests/{subscription}/confirm-cash-payment', [SubscriptionController::class, 'confirmCashPayment']);
        Route::post('/subscription-requests/{subscription}/activate', [SubscriptionController::class, 'activate']);
        Route::post('/subscription-requests/{subscription}/reject', [SubscriptionController::class, 'reject']);
        Route::post('/subscriptions/{subscription}/approve', [SubscriptionController::class, 'approve']);
        Route::post('/subscriptions/{subscription}/confirm-cash-payment', [SubscriptionController::class, 'confirmCashPayment']);
        Route::post('/subscriptions/{subscription}/activate', [SubscriptionController::class, 'activate']);
        Route::post('/subscriptions/{subscription}/reject', [SubscriptionController::class, 'reject']);
        Route::apiResource('subscriptions', SubscriptionController::class)->except(['show']);
        Route::apiResource('payments', PaymentController::class)->except(['show']);
        Route::apiResource('coaches', CoachController::class)->except(['show']);
        Route::apiResource('coach-schedules', CoachScheduleController::class)
            ->parameters(['coach-schedules' => 'coachSchedule'])
            ->except(['show']);
        Route::get('/coach-assignments', [CoachAssignmentController::class, 'index']);
        Route::post('/coach-assignments', [CoachAssignmentController::class, 'store']);
        Route::post('/coach-assignments/{assignment}/approve', [CoachAssignmentController::class, 'approve']);
        Route::post('/coach-assignments/{assignment}/reject', [CoachAssignmentController::class, 'reject']);
        Route::get('/attendance', [AttendanceController::class, 'index']);
        Route::get('/attendance/search-members', [AttendanceController::class, 'searchMembers']);
        Route::post('/attendance', [AttendanceController::class, 'store']);
        Route::post('/ai/reminder', AiReminderController::class);
    });

    Route::middleware('role:member')->prefix('member')->group(function () {
        Route::get('/dashboard', [ProfileController::class, 'dashboard']);
        Route::get('/subscriptions', [ProfileController::class, 'subscriptions']);
        Route::get('/subscriptions/current', [ProfileController::class, 'currentSubscription']);
        Route::get('/subscriptions/history', [ProfileController::class, 'subscriptions']);
        Route::get('/payments', [ProfileController::class, 'payments']);
        Route::get('/attendances', [ProfileController::class, 'attendances']);
        Route::post('/subscribe', [ProfileController::class, 'subscribe']);
        Route::post('/subscriptions/request', [ProfileController::class, 'subscribe']);
        Route::put('/profile', [ProfileController::class, 'update']);
    });

    Route::middleware('role:coach')->prefix('coach')->group(function () {
        Route::get('/dashboard', [CoachAreaController::class, 'dashboard']);
        Route::get('/schedule', [CoachAreaController::class, 'schedule']);
        Route::get('/members', [CoachAreaController::class, 'members']);
        Route::get('/members/{member}', [CoachAreaController::class, 'member']);
        Route::get('/members/{member}/attendances', [CoachAreaController::class, 'attendances']);
        Route::get('/members/{member}/notes', [CoachAreaController::class, 'notes']);
        Route::post('/members/{member}/notes', [CoachAreaController::class, 'storeNote']);
        Route::get('/members/{member}/training-plans', [CoachAreaController::class, 'trainingPlans']);
        Route::post('/members/{member}/training-plans', [CoachAreaController::class, 'storeTrainingPlan']);
    });
});
