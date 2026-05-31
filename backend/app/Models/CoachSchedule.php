<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoachSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'coach_id',
        'title',
        'description',
        'schedule_date',
        'start_time',
        'end_time',
        'location',
        'status',
    ];

    protected $casts = [
        'schedule_date' => 'date:Y-m-d',
    ];

    public function coach()
    {
        return $this->belongsTo(Coach::class);
    }
}
