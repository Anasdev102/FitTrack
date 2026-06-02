# API Connection Report

## Date

June 2, 2026

## Branch

`fix/api-connectivity`

## Summary

The frontend was showing connection and generic error messages because the API server was not reliably reachable on `http://127.0.0.1:8001/api`, and subscription creation could fail with a backend `500` when the database schema did not match the cash-payment subscription workflow.

## Problems Found

### API Server Connectivity

- The frontend expects the backend API at `http://127.0.0.1:8001/api`.
- When no backend process was listening on port `8001`, Login/Register showed:
  - `Unable to connect to the server. Please check your internet connection.`
- Docker-based backend startup could also be unstable when Laravel read the host `.env` instead of Docker database values.

### Subscription Request Failure

- Member subscription requests send:
  - `POST /api/member/subscriptions/request`
  - payload: `{ "type": "monthly" }`
- The backend correctly creates pending cash-payment subscription requests with:
  - `start_date = null`
  - `end_date = null`
  - `status = pending`
- The MySQL `subscriptions` schema still required non-null dates and only allowed old statuses.
- Exact failure:
  - `SQLSTATE[23000]: Integrity constraint violation: 1048 Column 'start_date' cannot be null`

### Generic Error Display

- Some frontend flows read only `error.response.data.message`.
- Validation messages in `error.response.data.errors` could be hidden behind generic fallback text.

## Fixes Applied

- Added a reusable frontend API error helper:
  - `frontend/src/utils/getApiErrorMessage.js`
- Updated auth and subscription actions to use the helper.
- Updated member subscription request UI to show backend-friendly errors.
- Added a database migration to align MySQL `subscriptions` schema with the pending cash-payment workflow.
- Updated Docker backend startup so Docker uses generated container-safe environment values.
- Added a lightweight Docker Laravel router script for the PHP development server.

## Verification Performed

### API Health

Command:

```bash
curl http://127.0.0.1:8001/api/health
```

Result:

```json
{"status":"ok"}
```

Status: PASS

### Login

Endpoint:

```text
POST /api/login
```

Payload:

```json
{
  "email": "admin@fitmanager.test",
  "password": "password"
}
```

Result:

- Returned token and admin user.

Status: PASS

### Invalid Login

Payload:

```json
{
  "email": "admin@fitmanager.test",
  "password": "wrong"
}
```

Result:

```json
{"message":"Incorrect email or password. Please try again."}
```

Status: PASS

### Register

Endpoint:

```text
POST /api/register
```

Result:

- Returned token and newly created member user.

Status: PASS

### Subscription Request

Endpoint:

```text
POST /api/member/subscriptions/request
```

Payload:

```json
{"type":"monthly"}
```

Result:

- Returned pending subscription with:
  - `status = pending`
  - `payment_status = unpaid`
  - `payment_method = cash`
  - `start_date = null`
  - `end_date = null`

Status: PASS

### Duplicate Pending Request

Result:

```json
{"message":"You already have a pending subscription request. Please visit the gym reception to pay in cash."}
```

Status: PASS

### Build

Command:

```bash
npm run build
```

Result:

- Build completed successfully.
- Vite reported a large chunk warning only.

Status: PASS

## Remaining Risks

- The PHP development server must be running on port `8001` for frontend API calls.
- Docker Desktop instability on the local machine can still prevent Docker-based testing until Docker itself is healthy.
- The frontend bundle is large and should be code-split later, but this is not an API connectivity blocker.

