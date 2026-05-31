<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $attendances = Attendance::with('user')
            ->when($request->date, fn ($query, $date) => $query->whereDate('date', $date))
            ->latest()
            ->paginate(20);

        return AttendanceResource::collection($attendances);
    }

    public function searchMembers(Request $request)
    {
        $members = User::where('role', 'member')
            ->where(fn ($query) => $query->where('name', 'like', "%{$request->search}%")->orWhere('phone', 'like', "%{$request->search}%"))
            ->limit(10)
            ->get();

        return \App\Http\Resources\UserResource::collection($members);
    }

    public function store(AttendanceRequest $request)
    {
        $attendance = Attendance::firstOrCreate(
            ['user_id' => $request->user_id, 'date' => today()->toDateString()],
            ['time' => now()->format('H:i:s')]
        );

        return new AttendanceResource($attendance->load('user'));
    }
}
