<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coaches', function (Blueprint $table) {
            if (! Schema::hasColumn('coaches', 'bio')) {
                $table->text('bio')->nullable()->after('speciality');
            }
        });

        if (! Schema::hasTable('coach_schedules')) {
            Schema::create('coach_schedules', function (Blueprint $table) {
                $table->id();
                $table->foreignId('coach_id')->constrained('coaches')->cascadeOnDelete();
                $table->string('title');
                $table->text('description')->nullable();
                $table->date('schedule_date');
                $table->time('start_time');
                $table->time('end_time')->nullable();
                $table->string('location')->nullable();
                $table->string('status')->default('scheduled');
                $table->timestamps();
                $table->index(['coach_id', 'schedule_date']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('coach_schedules');

        Schema::table('coaches', function (Blueprint $table) {
            if (Schema::hasColumn('coaches', 'bio')) {
                $table->dropColumn('bio');
            }
        });
    }
};
