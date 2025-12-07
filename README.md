# DTS Developer Technical Test - Junior Software Developer

## Challenge Brief

### Objective
Assess your ability to build a simple API and companion frontend using solid coding practices. Aim to spend no more than 2.5 hours on the exercise.

### Scenario
HMCTS needs a system that lets caseworkers capture and review tasks. Your assignment is to deliver:

- A backend API that creates new tasks.
- A frontend experience that allows users to submit tasks and view the confirmation details.

Each task includes:

- `title` (required)
- `description` (optional)
- `status`
- `dueDateTime`

A successful submission returns the created task via the API and displays it on the frontend. No additional CRUD endpoints are required.

### Technical Requirements

- Backend: any OOP language/framework
- Frontend: any language/framework
- Include unit tests
- Persist data in a database
- Provide validation & error handling
- Document API endpoints

Reference starter repos:

- [Backend starter](https://github.com/hmcts/hmcts-dev-test-backend)
- [Frontend starter](https://github.com/hmcts/hmcts-dev-test-frontend)

---

## Solution Snapshot

- **Backend**: TypeScript + Express, Prisma ORM with SQLite, Zod validation, Jest + Supertest tests, Swagger UI at `/docs`.
- **Frontend**: React + Vite + TypeScript, React Hook Form + Zod, Vitest + Testing Library tests, confirmation banner with latest task details.
- **Data Layer**: Prisma migrations live in `backend/prisma`; Jest uses an isolated SQLite file to mirror the production schema.
- **Tooling**: ESLint + Prettier for both apps, Dockerfiles for individual services, `docker-compose.yml` for a full stack spin-up, and a `/health` endpoint for readiness checks.

## Architecture Overview

```
┌───────────────┐        POST /api/tasks        ┌───────────────┐
│  React UI     │ ─────────────────────────────▶│ Express API   │
│ (Vite dev)    │                               │ (Prisma ORM)  │
│               │◀──────────────────────────────┤               │
│ Form submits  │      201 + task payload       │ Persists to   │
│ via fetch     │                               │ SQLite DB     │
└───────────────┘                               └───────────────┘
```

- Vite proxies `/api/*` during local development so the UI can talk to `localhost:4000` without CORS issues.
- Swagger UI documents the API contract at `/docs`.
- Docker Compose runs both services; the Nginx-based frontend container proxies `/api` requests to the backend container.

## Feature Highlights

- Create tasks with `title`, optional `description`, required `status` (`NEW`, `IN_PROGRESS`, `DONE`) and a **future** ISO 8601 `dueDateTime`.
- UI mirrors backend validation before sending requests and displays inline error messaging and success confirmation.
- Centralised Express error handler returns consistent JSON payloads (`message` + optional `details`).
- Jest/Vitest suites ensure task creation flow, validation, and UI feedback behave as expected.

## Prerequisites

- Node.js **20.x**
- npm **9.x**
- (Optional) Docker **24+** with Compose v2

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Default                | Purpose                             |
| -------------- | ---------------------- | ----------------------------------- |
| `DATABASE_URL` | `file:./prisma/dev.db` | SQLite database location for Prisma |
| `PORT`         | `4000`                 | HTTP port for the API server        |

### Frontend (`frontend/.env`)

| Variable            | Default | Purpose                                                                      |
| ------------------- | ------- | ---------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | `` (blank) | Optional override for API origin. Leave blank in dev to rely on Vite proxy. |

## Setup & Development

### Backend (API)

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

- API listens on `http://localhost:4000`.
- Swagger docs available at `http://localhost:4000/docs`.
- `npm run prisma:migrate` applies the existing migration. Use `npm run prisma:migrate -- --name <name>` when adding new schema changes.

### Frontend (React UI)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

- Dev server runs on `http://localhost:5173`.
- During development, `/api/*` requests proxy to the backend.

### Available Scripts

| Location | Command | Description |
| -------- | ------- | ----------- |
| backend  | `npm run dev` | Start Express server with `tsx` watcher |
| backend  | `npm run build` | Type-check & transpile TypeScript to `dist/` |
| backend  | `npm start` | Run compiled server from `dist/server.js` |
| backend  | `npm test` | Run Jest suite (serialised to avoid SQLite locks) |
| backend  | `npm run lint` | ESLint TypeScript sources |
| frontend | `npm run dev` | Launch Vite dev server |
| frontend | `npm run build` | Produce production bundle |
| frontend | `npm run preview` | Preview the production build locally |
| frontend | `npm test` | Run Vitest + Testing Library suite |
| frontend | `npm run lint` | ESLint React sources |

## Validation Rules

| Field         | Rules enforced | Layer |
| ------------- | -------------- | ----- |
| `title`       | Required, trimmed, non-empty | API + UI |
| `description` | Optional, trimmed, ≤ 1000 characters (UI) | UI |
| `status`      | One of `NEW`, `IN_PROGRESS`, `DONE` | API + UI |
| `dueDateTime` | Required ISO 8601 string **strictly in the future** | API + UI |

The API returns HTTP `400` for validation failures with field-level detail, e.g.

```json
{
	"message": "Validation failed",
	"details": [
		{"path": "dueDateTime", "message": "Due date/time must be in the future"}
	]
}
```

## API Reference

`POST /api/tasks`

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `title` | string | ✅ | Non-empty |
| `description` | string | ❌ | Optional context |
| `status` | string | ✅ | `NEW`, `IN_PROGRESS`, or `DONE` |
| `dueDateTime` | string | ✅ | Future ISO 8601 timestamp |

Example request:

```json
{
	"title": "Review case files",
	"description": "Prepare bundle for hearing",
	"status": "NEW",
	"dueDateTime": "2030-01-01T09:00:00.000Z"
}
```

Success response (`201`):

```json
{
	"message": "Task created successfully",
	"data": {
		"id": 1,
		"title": "Review case files",
		"description": "Prepare bundle for hearing",
		"status": "NEW",
		"dueDateTime": "2030-01-01T09:00:00.000Z",
		"createdAt": "2030-01-01T08:00:00.000Z",
		"updatedAt": "2030-01-01T08:00:00.000Z"
	}
}
```

More endpoints and schemas are available via Swagger UI.

## Testing Strategy

- **Backend**: Jest + Supertest cover happy path creation and validation failures. The suite runs with `maxWorkers=1` to avoid SQLite locking while sharing a test database file.
- **Frontend**: Vitest + Testing Library simulate user interactions, verifying success banners and prevention of past-due submissions.
- Execute suites independently: `npm test` inside `backend/` and `frontend/`.

## Project Structure

```
backend/
	prisma/
		migrations/
		schema.prisma
	src/
		controllers/
		docs/
		lib/
		middleware/
		routes/
		schemas/
	tests/
frontend/
	src/
		api/
		components/
		App.test.tsx
	vite.config.ts
	index.html
Dockerfile (per app) & docker-compose.yml
```

## Running with Docker

```bash
docker compose up --build
```

- Backend → `http://localhost:4000`
- Swagger → `http://localhost:4000/docs`
- Frontend → `http://localhost:5173`

Stop containers with:

```bash
docker compose down
```

## Troubleshooting

- **`DATABASE_URL` missing**: copy `backend/.env.example` to `.env` or export the variable before running Prisma commands.
- **`@prisma/client` runtime missing**: run `npm run prisma:generate` after installing dependencies or editing the schema.
- **Frontend cannot reach API in production**: set `VITE_API_BASE_URL` to the deployed backend URL during the build.
- **Jest SQLite locks**: delete `backend/prisma/test.db` and re-run `npm test`.

## Future Enhancements

- Add authentication and user-based task segregation.
- Provide listing/filtering endpoints with pagination and sorting.
- Switch to PostgreSQL or another managed datastore for production deployments.
- Embed lint/test automation into CI and add automated accessibility/security checks.

Happy coding!
