<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        \App\Console\Commands\CancelExpiredPendingSubscriptions::class,
    ];

    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('subscriptions:cancel-expired-pending')->hourly();
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/../../routes/console.php');
    }
}
