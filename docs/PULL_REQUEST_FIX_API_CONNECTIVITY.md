# Pull Request Summary: Fix API Connectivity

## Problem

Login, Register, and member subscription requests could show connection or generic error messages instead of completing normally. The frontend could not reliably communicate with the Laravel API on `http://127.0.0.1:8001/api`, and subscription creation could return a backend `500`.

## Root Cause

- The backend API was not consistently reachable on port `8001` during local testing.
- Docker backend startup could read the host `.env` instead of Docker database values, causing incorrect database configuration.
- The MySQL `subscriptions` table still used the old schema:
  - `start_date` was not nullable.
  - `end_date` was not nullable.
  - `status` only allowed `active` and `expired`.
- The current cash-payment workflow creates pending requests with `null` dates and `status = pending`, so MySQL rejected inserts.
- Frontend subscription/auth flows did not consistently read validation messages from `error.response.data.errors`.

## Files Changed

- `.gitignore`
- `docker-compose.yml`
- `backend/.docker/entrypoint.sh`
- `backend/.docker/server.php`
- `backend/app/Http/Requests/RegisterMemberRequest.php`
- `backend/database/migrations/2026_06_02_000010_fix_subscription_request_schema.php`
- `frontend/src/store/slices/authSlice.js`
- `frontend/src/store/slices/subscriptionsSlice.js`
- `frontend/src/pages/member/MySubscription.jsx`
- `frontend/src/utils/getApiErrorMessage.js`
- `docs/API_CONNECTION_REPORT.md`
- `docs/PULL_REQUEST_FIX_API_CONNECTIVITY.md`

## Tests Performed

- Verified API health endpoint:
  - `GET /api/health`
- Verified admin login:
  - `POST /api/login`
- Verified invalid login friendly error:
  - `Incorrect email or password. Please try again.`
- Verified member registration:
  - `POST /api/register`
- Verified member subscription request:
  - `POST /api/member/subscriptions/request`
- Verified duplicate pending subscription request friendly error.
- Ran route checks:
  - `php artisan route:list --path=api/health`
  - `php artisan route:list --path=api/login`
- Ran frontend production build:
  - `npm run build`

## Remaining Risks

- Local frontend requests still require the backend server to be running on port `8001`.
- Docker Desktop issues on the developer machine can still block Docker commands independently from application code.
- Frontend bundle size warning remains and can be handled separately with code splitting.

