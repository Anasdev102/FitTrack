<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coach extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'speciality',
        'bio',
        'salary',
        'image',
    ];

    protected $casts = [
        'salary' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignments()
    {
        return $this->hasMany(CoachAssignment::class);
    }

    public function schedules()
    {
        return $this->hasMany(CoachSchedule::class);
    }

    public function approvedMembers()
    {
        return $this->belongsToMany(User::class, 'coach_assignments', 'coach_id', 'member_id')
            ->wherePivot('status', 'approved')
            ->withPivot(['status', 'request_date', 'approved_at']);
    }
}
