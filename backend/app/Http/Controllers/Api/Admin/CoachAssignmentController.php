<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CoachAssignment;
use Illuminate\Http\Request;

class CoachAssignmentController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'data' => CoachAssignment::with(['coach.user', 'member'])
                ->when($request->status, fn ($query, $status) => $query->where('status', $status))
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'coach_id' => ['required', 'exists:coaches,id'],
            'member_id' => ['required', 'exists:users,id'],
        ]);

        $assignment = CoachAssignment::updateOrCreate(
            ['coach_id' => $data['coach_id'], 'member_id' => $data['member_id']],
            ['status' => 'pending', 'request_date' => today(), 'approved_at' => null]
        );

        return response()->json(['data' => $assignment->load(['coach.user', 'member'])], 201);
    }

    public function approve(CoachAssignment $assignment)
    {
        $assignment->update(['status' => 'approved', 'approved_at' => now()]);

        return response()->json(['data' => $assignment->load(['coach.user', 'member'])]);
    }

    public function reject(CoachAssignment $assignment)
    {
        $assignment->update(['status' => 'rejected', 'approved_at' => null]);

        return response()->json(['data' => $assignment->load(['coach.user', 'member'])]);
    }
}
