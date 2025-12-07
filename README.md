# DTS Developer Technical Test - Junior Software Developer

## Objective
To assess your ability to build a simple API and frontend using best coding practices.

Please aim to spend no more than 2.5 hours on this task.

## Scenario
HMCTS requires a new system to be developed so caseworkers can keep track of their tasks.

Your technical test is to develop a new system to facilitate the creation of these tasks.

## Task Requirements

You are required to create a backend API that allows for the creation of new tasks, and a frontend application to interact with this.

A task should have the following properties:
- Title
- Description (optional field)
- Status
- Due date/time

On successful task creation, the API should return the task and the frontend display a confirmation message alongside the successfully created task details.

No other CRUD operations related to the management of tasks are required.

## Technical Requirements
You can find the technical criteria for this challenge below:

- **Backend**: Any OOP language and framework of your choice
- **Frontend**: Any language and framework of your choice
- Implement **unit tests**
- Store data in a **database**
- Include **validation and error handling**
- **Document API endpoints**

Here are a few starter repositories if you would like to use our tech stack:
- [Backend Starter Repo](https://github.com/hmcts/hmcts-dev-test-backend)
- [Frontend Starter Repo](https://github.com/hmcts/hmcts-dev-test-frontend)

## Submission Guidelines
- Create repositories on GitHub and add the links to your application
- Include a helpful `README.md`!
- The use of AI coding assistants is permitted. However, please ensure the submission represents your own understanding, as you will be required to explain, justify and extend your code during the interview

Happy coding!

---

## Solution Overview

- **Backend**: TypeScript + Express with Prisma/SQLite, validation via Zod, Jest + Supertest tests, Swagger UI docs on `/docs`.
- **Frontend**: React + Vite + TypeScript, React Hook Form with Zod validation, Vitest + Testing Library for UI tests.
- **Database**: Prisma migrations targeting SQLite (stored in `backend/prisma`).
- **Tooling**: ESLint/Prettier in both apps, Dockerfiles for independent builds, `docker-compose.yml` for combined stack, health check at `/health`.
- **Validation**: API rejects malformed payloads and due dates set in the past; the UI mirrors these rules before calling the backend.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- (Optional) Docker 24+ and Docker Compose v2 for containerised runs

### Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

The API will be available at `http://localhost:4000`. Swagger documentation lives at `http://localhost:4000/docs`.

### Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The UI will be served from `http://localhost:5173` and proxies API requests to the backend when both run locally.

### Running Tests

- **Backend**: `cd backend && npm test`
- **Frontend**: `cd frontend && npm test`

### Docker Compose

To build and run both services together:

```bash
docker compose up --build
```

This exposes the backend on `http://localhost:4000` and the frontend on `http://localhost:5173`.

## API Reference

- `POST /api/tasks` – create a task. Body schema:
	```json
	{
		"title": "Review case files",
		"description": "Optional context",
		"status": "NEW",
		"dueDateTime": "2030-01-01T09:00:00.000Z"
	}
	```
- Success response (`201`):
	```json
	{
		"message": "Task created successfully",
		"data": {
			"id": 1,
			"title": "Review case files",
			"description": "Optional context",
			"status": "NEW",
			"dueDateTime": "2030-01-01T09:00:00.000Z",
			"createdAt": "2030-01-01T08:00:00.000Z",
			"updatedAt": "2030-01-01T08:00:00.000Z"
		}
	}
	```
- Validation errors return `400` with an array of field-level issues.

## Project Structure

```
backend/
	src/
		controllers/
		docs/
		middleware/
		routes/
		schemas/
	prisma/
	tests/
frontend/
	src/
		api/
		components/
	vitest setup & tests
docker-compose.yml
```

## Future Enhancements

- Add authentication and per-user task segregation.
- Extend API with listing or filtering endpoints.
- Persist tasks in a managed database (PostgreSQL) for production readiness.
- Integrate accessibility and cross-browser automated checks in the CI pipeline.
