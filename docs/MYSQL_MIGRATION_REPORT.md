# MySQL Migration Report

## Summary

FitManager was moved from a SQLite-based development configuration to a MySQL-first application configuration.

SQLite remains available only for automated tests through `backend/phpunit.xml`.

## Configuration Changes

- `backend/.env.example` now uses MySQL values.
- `backend/.env.docker` now uses MySQL with `DB_PASSWORD=secret`.
- `backend/.env` was updated from SQLite to local MySQL.
- `docker-compose.yml` keeps the MySQL service and healthcheck, and now uses `DB_PASSWORD=secret`.

## Migration Compatibility Fixes

### Users Role Enum

Issue found:

- The base users migration created `role` as `ENUM('admin', 'member')`.
- The coach workflow later added coach features, but the MySQL migration did not expand the enum to include `coach`.
- This would break coach account creation on MySQL.

Fix applied:

- `2026_05_23_000006_add_coach_role_and_coach_workspace_tables.php` now updates MySQL role enum to:

```sql
ENUM('admin', 'member', 'coach')
```

## Migration Test

Command attempted:

```bash
cd backend
php artisan config:clear
php artisan migrate:fresh --seed
```

Result:

- MySQL connection was configured locally using database `fitmanager`, user `fitmanager`, and password `secret`.
- Migrations successfully ran through:
  - users
  - personal access tokens
  - subscriptions
  - payments
  - coaches
  - attendances
  - subscription request workflow
  - coach role and coach workspace tables
- The run stopped during the coach schedules migration because the local machine has no free disk space.

Failure details:

```text
SQLSTATE[HY000]: General error: 3 Error writing file
Errcode: 28 "No space left on device"
```

This is an environment/storage failure, not a Laravel schema incompatibility discovered in code.

## Tables Observed

After the partial migration run, MySQL showed these tables:

- attendances
- coach_assignments
- coach_notes
- coach_schedules
- coaches
- migrations
- payments
- personal_access_tokens
- subscriptions
- training_plans
- users

## Modules To Verify After Disk Space Is Fixed

- Authentication
- Members
- Subscriptions
- Payments
- Attendance
- Coaches
- Coach Assignments
- AI Reminder
- Dashboard statistics

## Remaining Risks

- Full `migrate:fresh --seed` could not complete because `C:` had `0 bytes` free.
- MySQL temporary files under `C:\xampp\tmp` could not be written.
- Seeder verification is pending until local disk space is available.
- If Docker MySQL was previously initialized with `DB_PASSWORD=password`, the existing Docker volume must be recreated or the user password must be changed manually.

## Next Verification Commands

After freeing disk space, run:

```bash
cd backend
php artisan config:clear
php artisan migrate:fresh --seed
php artisan route:list
```

Then verify the main workflows:

- Admin login
- Member registration/login
- Coach login
- Member subscription request
- Admin cash payment confirmation
- Subscription activation
- Attendance creation
- Coach assignment
- AI reminder generation
