<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use Illuminate\Console\Command;

class CancelExpiredPendingSubscriptions extends Command
{
    protected $signature = 'subscriptions:cancel-expired-pending';

    protected $description = 'Cancel unpaid pending subscription requests after their 48-hour cash payment deadline.';

    public function handle(): int
    {
        $cancelled = Subscription::cancelExpiredPending();

        $this->info("Cancelled {$cancelled} expired pending subscription request(s).");

        return self::SUCCESS;
    }
}
