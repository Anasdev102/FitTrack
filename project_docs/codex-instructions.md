
---


# Codex Instructions

Read all files inside the project-docs folder before generating code.

Follow all documentation strictly.

## Important Rules

- This project is NOT SaaS.
- This project is NOT multi-tenant.
- This project is for one fitness club owner.
- Keep the MVP simple but professional.
- Do not add unnecessary complexity.
- Use clean architecture.
- Use clear naming conventions.
- Generate production-like clean code.

## Required Stack

### Backend

- Laravel 12 or Laravel 13
- PHP 8.2+
- Laravel Sanctum
- MySQL
- REST API
- Eloquent ORM
- Form Requests
- API Resources
- Seeders and Factories

### Frontend

- React
- Vite
- Tailwind CSS
- Redux Toolkit
- React Redux
- React Router DOM
- Axios
- React Hook Form
- Recharts
- Lucide React
- React Hot Toast

### DevOps

- Docker
- Docker Compose
- GitHub Actions
- Git/GitHub
- Postman

## Redux Rules

- Use Redux Toolkit.
- Use React Redux Provider in main.jsx.
- Configure store in src/store/store.js.
- Use createSlice.
- Use createAsyncThunk for async API calls.
- Keep API functions separated in src/api.
- Components should dispatch Redux actions.
- Components should not call Axios directly.
- Persist auth token and user in localStorage.
- Use loading and error states in UI.

## Backend Requirements

Generate:

- migrations
- models
- relationships
- seeders
- factories
- Sanctum authentication
- role middleware
- controllers
- form requests
- API resources
- API routes

## Frontend Requirements

Generate:

- React app structure
- layouts
- pages
- Redux store
- Redux slices
- routing
- protected routes
- role routes
- reusable components
- responsive UI

## Docker Requirements

Generate:

- docker-compose.yml
- backend/Dockerfile
- frontend/Dockerfile
- backend/.docker/php.ini
- backend/.docker/nginx.conf if needed

## GitHub Actions Requirements

Generate:

- .github/workflows/backend-ci.yml
- .github/workflows/frontend-ci.yml
- .github/workflows/docker-build.yml

## README Requirements

README.md should include:

- project description
- features
- tech stack
- installation without Docker
- installation with Docker
- API overview
- GitHub Actions explanation
- screenshots section placeholder

## Generation Order

Generate the project in this order:

1. Backend setup
2. Database migrations
3. Models and relationships
4. Seeders and factories
5. Sanctum authentication
6. Role middleware
7. Controllers
8. API routes
9. API Resources
10. Frontend setup
11. Redux store and slices
12. Routing
13. Layouts
14. Admin pages
15. Member pages
16. Public pages
17. Docker setup
18. GitHub Actions
19. README.md

## Final Goal

Create a complete portfolio-ready project with:

- Laravel API
- React frontend
- Redux Toolkit
- MySQL
- Docker
- GitHub Actions
- Professional structure
- Clean UI
- Clear README