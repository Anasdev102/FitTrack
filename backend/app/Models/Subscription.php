<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'plan_name',
        'duration_days',
        'price',
        'start_date',
        'end_date',
        'status',
        'payment_status',
        'payment_method',
        'requested_at',
        'payment_deadline',
        'paid_at',
        'activated_at',
        'approved_at',
        'rejected_at',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'requested_at' => 'datetime',
        'payment_deadline' => 'datetime',
        'paid_at' => 'datetime',
        'activated_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public static function expirePastDue(): void
    {
        static::cancelExpiredPending();

        static::where('status', 'active')
            ->whereNotNull('end_date')
            ->whereDate('end_date', '<', today())
            ->update(['status' => 'expired']);
    }

    public static function cancelExpiredPending(): int
    {
        return static::where('status', 'pending')
            ->where('payment_status', 'unpaid')
            ->whereNotNull('payment_deadline')
            ->where('payment_deadline', '<', now())
            ->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancellation_reason' => 'Payment not received within 48 hours',
            ]);
    }

    public function cancelIfPaymentDeadlinePassed(): bool
    {
        if (
            $this->status === 'pending'
            && $this->payment_status === 'unpaid'
            && $this->payment_deadline
            && $this->payment_deadline->isPast()
        ) {
            $this->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancellation_reason' => 'Payment not received within 48 hours',
            ]);
            $this->refresh();

            return true;
        }

        return false;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
