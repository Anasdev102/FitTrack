<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF');
            DB::statement("
                CREATE TABLE users_new (
                    id integer primary key autoincrement not null,
                    name varchar not null,
                    email varchar not null,
                    phone varchar null,
                    password varchar not null,
                    role varchar not null default 'member' check (role in ('admin', 'member', 'coach')),
                    image varchar null,
                    email_verified_at datetime null,
                    remember_token varchar null,
                    created_at datetime null,
                    updated_at datetime null
                )
            ");
            DB::statement("INSERT INTO users_new SELECT * FROM users");
            DB::statement('DROP TABLE users');
            DB::statement('ALTER TABLE users_new RENAME TO users');
            DB::statement('CREATE UNIQUE INDEX users_email_unique ON users(email)');
            DB::statement('CREATE INDEX users_phone_index ON users(phone)');
            DB::statement('CREATE INDEX users_role_index ON users(role)');
            DB::statement('PRAGMA foreign_keys = ON');
        }

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role ENUM('admin', 'member', 'coach') NOT NULL DEFAULT 'member'");
        }

        Schema::table('coaches', function (Blueprint $table) {
            if (! Schema::hasColumn('coaches', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
            }
        });

        Schema::create('coach_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('coach_id')->constrained('coaches')->cascadeOnDelete();
            $table->foreignId('member_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->index();
            $table->date('request_date')->index();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->unique(['coach_id', 'member_id']);
        });

        Schema::create('coach_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('coach_id')->constrained('coaches')->cascadeOnDelete();
            $table->foreignId('member_id')->constrained('users')->cascadeOnDelete();
            $table->text('note');
            $table->timestamps();
        });

        Schema::create('training_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('coach_id')->constrained('coaches')->cascadeOnDelete();
            $table->foreignId('member_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->enum('status', ['active', 'completed'])->default('active')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_plans');
        Schema::dropIfExists('coach_notes');
        Schema::dropIfExists('coach_assignments');
    }
};
