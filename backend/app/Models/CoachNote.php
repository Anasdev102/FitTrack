<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoachNote extends Model
{
    use HasFactory;

    protected $fillable = ['coach_id', 'member_id', 'note'];

    public function coach()
    {
        return $this->belongsTo(Coach::class);
    }

    public function member()
    {
        return $this->belongsTo(User::class, 'member_id');
    }
}
