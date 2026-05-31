<?php

namespace App\Http\Controllers\Api\Coach;

use App\Http\Controllers\Controller;
use App\Http\Resources\AttendanceResource;
use App\Http\Resources\CoachNoteResource;
use App\Http\Resources\CoachScheduleResource;
use App\Http\Resources\TrainingPlanResource;
use App\Http\Resources\UserResource;
use App\Models\Coach;
use App\Models\CoachAssignment;
use App\Models\CoachNote;
use App\Models\CoachSchedule;
use App\Models\TrainingPlan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CoachAreaController extends Controller
{
    public function dashboard(Request $request)
    {
        $coach = $this->coachFor($request);

        return response()->json([
            'coach' => [
                'id' => $coach->id,
                'name' => $coach->name,
                'speciality' => $coach->speciality,
            ],
            'stats' => [
                'assigned_members' => $coach->assignments()->where('status', 'approved')->count(),
                'active_plans' => TrainingPlan::where('coach_id', $coach->id)->where('status', 'active')->count(),
                'notes' => CoachNote::where('coach_id', $coach->id)->count(),
                'today_schedule' => CoachSchedule::where('coach_id', $coach->id)->whereDate('schedule_date', today())->count(),
            ],
            'recent_members' => UserResource::collection($coach->approvedMembers()->latest('coach_assignments.approved_at')->limit(5)->get()),
            'recent_plans' => TrainingPlanResource::collection(TrainingPlan::where('coach_id', $coach->id)->latest()->limit(5)->get()),
            'today_schedule' => CoachScheduleResource::collection($this->scheduleQuery($coach)->whereDate('schedule_date', today())->get()),
            'upcoming_schedule' => CoachScheduleResource::collection($this->scheduleQuery($coach)->whereDate('schedule_date', '>', today())->limit(8)->get()),
        ]);
    }

    public function schedule(Request $request)
    {
        $coach = $this->coachFor($request);

        return CoachScheduleResource::collection($this->scheduleQuery($coach)->paginate(20));
    }

    public function members(Request $request)
    {
        $coach = $this->coachFor($request);

        return UserResource::collection(
            $coach->approvedMembers()->with('activeSubscription')->latest('coach_assignments.approved_at')->paginate(12)
        );
    }

    public function member(Request $request, User $member)
    {
        $coach = $this->coachFor($request);
        $this->ensureAssigned($coach, $member);

        return new UserResource($member->load('activeSubscription'));
    }

    public function attendances(Request $request, User $member)
    {
        $coach = $this->coachFor($request);
        $this->ensureAssigned($coach, $member);

        return AttendanceResource::collection($member->attendances()->latest()->get());
    }

    public function notes(Request $request, User $member)
    {
        $coach = $this->coachFor($request);
        $this->ensureAssigned($coach, $member);

        return CoachNoteResource::collection(
            CoachNote::where('coach_id', $coach->id)->where('member_id', $member->id)->latest()->get()
        );
    }

    public function storeNote(Request $request, User $member)
    {
        $coach = $this->coachFor($request);
        $this->ensureAssigned($coach, $member);

        $data = $request->validate(['note' => ['required', 'string', 'max:5000']]);

        return new CoachNoteResource(CoachNote::create([
            'coach_id' => $coach->id,
            'member_id' => $member->id,
            'note' => $data['note'],
        ]));
    }

    public function trainingPlans(Request $request, User $member)
    {
        $coach = $this->coachFor($request);
        $this->ensureAssigned($coach, $member);

        return TrainingPlanResource::collection(
            TrainingPlan::where('coach_id', $coach->id)->where('member_id', $member->id)->latest()->get()
        );
    }

    public function storeTrainingPlan(Request $request, User $member)
    {
        $coach = $this->coachFor($request);
        $this->ensureAssigned($coach, $member);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:10000'],
            'status' => ['nullable', Rule::in(['active', 'completed'])],
        ]);

        return new TrainingPlanResource(TrainingPlan::create([
            'coach_id' => $coach->id,
            'member_id' => $member->id,
            'title' => $data['title'],
            'description' => $data['description'],
            'status' => $data['status'] ?? 'active',
        ]));
    }

    private function coachFor(Request $request): Coach
    {
        $coach = $request->user()->coachProfile;

        if (! $coach) {
            abort(403, 'Coach profile is not configured.');
        }

        return $coach;
    }

    private function ensureAssigned(Coach $coach, User $member): void
    {
        $assigned = CoachAssignment::where('coach_id', $coach->id)
            ->where('member_id', $member->id)
            ->where('status', 'approved')
            ->exists();

        if (! $assigned) {
            abort(403, 'This member is not assigned to this coach.');
        }
    }

    private function scheduleQuery(Coach $coach)
    {
        return CoachSchedule::where('coach_id', $coach->id)
            ->orderBy('schedule_date')
            ->orderBy('start_time');
    }
}
