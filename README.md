# FitTrack / FitManager

FitManager is a private fitness club management system for one gym owner. It includes a Laravel REST API, a React dashboard, member self-service pages, coach workspace, Docker setup, and CI workflows.

## Features

- Public fitness club website with plans, coaches preview, and contact entry points
- Sanctum authentication with admin, member, and coach roles
- Admin dashboard for members, subscription requests, cash payments, coaches, assignments, schedules, attendance, and reminders
- Cash-only subscription workflow with admin payment confirmation, activation, and 48-hour unpaid request cancellation
- Limited coach dashboard for assigned members, attendance history, notes, training plans, and schedules
- Member dashboard with subscription status, payment history, attendance, and profile views
- Orange/black/white fitness club UI theme with responsive dashboard sidebars

## Tech Stack

- Backend: Laravel, PHP, Sanctum, Eloquent, API Resources, Form Requests
- Frontend: React, Vite, Tailwind CSS, Redux Toolkit, React Router, Axios, Recharts, Lucide
- DevOps: Docker, Docker Compose, GitHub Actions

## Run Without Docker

Backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8001
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Run With Docker

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8001/api

Seeded admin:

- Email: `admin@fitmanager.test`
- Password: `password`

## API Overview

- `POST /api/register`
- `POST /api/login`
- `GET /api/me`
- `POST /api/logout`
- `GET /api/admin/dashboard`
- `apiResource /api/admin/members`
- `apiResource /api/admin/subscriptions`
- `apiResource /api/admin/payments`
- `apiResource /api/admin/coaches`
- `apiResource /api/admin/coach-schedules`
- `GET|POST /api/admin/attendance`
- `POST /api/admin/ai/reminder`
- `GET /api/member/dashboard`
- `POST /api/member/subscriptions/request`
- `GET /api/member/subscriptions/current`
- `GET /api/member/subscriptions/history`
- `GET /api/coach/dashboard`
- `GET /api/coach/members`
- `GET /api/coach/schedule`

## GitHub Actions

- `backend-ci.yml` installs PHP dependencies and runs Laravel tests
- `frontend-ci.yml` installs Node dependencies and builds the Vite app
- `docker-build.yml` verifies Docker images build successfully
