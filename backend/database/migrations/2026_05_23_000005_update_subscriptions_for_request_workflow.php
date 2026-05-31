<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF');
            DB::statement("
                CREATE TABLE subscriptions_new (
                    id integer primary key autoincrement not null,
                    user_id integer not null,
                    type varchar not null check (type in ('monthly', 'quarterly', 'yearly')),
                    price numeric not null,
                    start_date date null,
                    end_date date null,
                    status varchar not null default 'pending' check (status in ('pending', 'active', 'expired', 'rejected')),
                    payment_status varchar not null default 'unpaid' check (payment_status in ('paid', 'unpaid')),
                    requested_at datetime null,
                    approved_at datetime null,
                    rejected_at datetime null,
                    created_at datetime null,
                    updated_at datetime null,
                    foreign key(user_id) references users(id) on delete cascade
                )
            ");
            DB::statement("
                INSERT INTO subscriptions_new (
                    id, user_id, type, price, start_date, end_date, status, payment_status,
                    requested_at, approved_at, created_at, updated_at
                )
                SELECT
                    id, user_id, type, price, start_date, end_date,
                    CASE WHEN status = 'active' THEN 'active' ELSE 'expired' END,
                    CASE WHEN status = 'active' THEN 'paid' ELSE 'unpaid' END,
                    created_at, CASE WHEN status = 'active' THEN created_at ELSE null END,
                    created_at, updated_at
                FROM subscriptions
            ");
            DB::statement('DROP TABLE subscriptions');
            DB::statement('ALTER TABLE subscriptions_new RENAME TO subscriptions');
            DB::statement('CREATE INDEX subscriptions_end_date_index ON subscriptions(end_date)');
            DB::statement('CREATE INDEX subscriptions_status_index ON subscriptions(status)');
            DB::statement('CREATE INDEX subscriptions_payment_status_index ON subscriptions(payment_status)');
            DB::statement('PRAGMA foreign_keys = ON');
            return;
        }

        Schema::table('subscriptions', function ($table) {
            $table->string('payment_status')->default('unpaid')->after('status')->index();
            $table->timestamp('requested_at')->nullable()->after('payment_status');
            $table->timestamp('approved_at')->nullable()->after('requested_at');
            $table->timestamp('rejected_at')->nullable()->after('approved_at');
        });
    }

    public function down(): void
    {
        // Development migration for the MVP workflow; down is intentionally conservative.
    }
};
