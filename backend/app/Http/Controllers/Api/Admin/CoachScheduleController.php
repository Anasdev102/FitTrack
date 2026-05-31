<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CoachScheduleRequest;
use App\Http\Resources\CoachScheduleResource;
use App\Models\CoachSchedule;
use Illuminate\Http\Request;

class CoachScheduleController extends Controller
{
    public function index(Request $request)
    {
        return CoachScheduleResource::collection(
            CoachSchedule::with('coach.user')
                ->when($request->coach_id, fn ($query, $coachId) => $query->where('coach_id', $coachId))
                ->when($request->status, fn ($query, $status) => $query->where('status', $status))
                ->orderBy('schedule_date')
                ->orderBy('start_time')
                ->paginate(20)
        );
    }

    public function store(CoachScheduleRequest $request)
    {
        return new CoachScheduleResource(
            CoachSchedule::create(array_merge($request->validated(), [
                'status' => $request->validated('status') ?? 'scheduled',
            ]))->load('coach.user')
        );
    }

    public function update(CoachScheduleRequest $request, CoachSchedule $coachSchedule)
    {
        $coachSchedule->update(array_merge($request->validated(), [
            'status' => $request->validated('status') ?? 'scheduled',
        ]));

        return new CoachScheduleResource($coachSchedule->load('coach.user'));
    }

    public function destroy(CoachSchedule $coachSchedule)
    {
        $coachSchedule->delete();

        return response()->noContent();
    }
}
