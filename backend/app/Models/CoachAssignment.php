<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoachAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'coach_id',
        'member_id',
        'status',
        'request_date',
        'approved_at',
    ];

    protected $casts = [
        'request_date' => 'date',
        'approved_at' => 'datetime',
    ];

    public function coach()
    {
        return $this->belongsTo(Coach::class);
    }

    public function member()
    {
        return $this->belongsTo(User::class, 'member_id');
    }
}
