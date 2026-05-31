<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            if (! Schema::hasColumn('subscriptions', 'plan_name')) {
                $table->string('plan_name')->nullable()->after('type');
            }
            if (! Schema::hasColumn('subscriptions', 'duration_days')) {
                $table->unsignedInteger('duration_days')->nullable()->after('plan_name');
            }
            if (! Schema::hasColumn('subscriptions', 'payment_method')) {
                $table->string('payment_method')->default('cash')->after('payment_status');
            }
            if (! Schema::hasColumn('subscriptions', 'paid_at')) {
                $table->timestamp('paid_at')->nullable()->after('requested_at');
            }
            if (! Schema::hasColumn('subscriptions', 'activated_at')) {
                $table->timestamp('activated_at')->nullable()->after('paid_at');
            }
        });

        DB::table('subscriptions')->whereNull('payment_method')->update(['payment_method' => 'cash']);
    }

    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            foreach (['plan_name', 'duration_days', 'payment_method', 'paid_at', 'activated_at'] as $column) {
                if (Schema::hasColumn('subscriptions', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
