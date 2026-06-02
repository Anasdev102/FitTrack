<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement('ALTER TABLE subscriptions MODIFY start_date DATE NULL');
        DB::statement('ALTER TABLE subscriptions MODIFY end_date DATE NULL');
        DB::statement("ALTER TABLE subscriptions MODIFY status ENUM('pending', 'active', 'expired', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement("UPDATE subscriptions SET status = 'expired' WHERE status IN ('pending', 'rejected', 'cancelled')");
        DB::statement("ALTER TABLE subscriptions MODIFY status ENUM('active', 'expired') NOT NULL DEFAULT 'active'");
        DB::statement("UPDATE subscriptions SET start_date = CURDATE() WHERE start_date IS NULL");
        DB::statement("UPDATE subscriptions SET end_date = CURDATE() WHERE end_date IS NULL");
        DB::statement('ALTER TABLE subscriptions MODIFY start_date DATE NOT NULL');
        DB::statement('ALTER TABLE subscriptions MODIFY end_date DATE NOT NULL');
    }
};

