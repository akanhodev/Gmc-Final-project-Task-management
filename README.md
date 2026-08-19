# Task Manager — Backend (Step 1: Project Setup & Backend Configuration)

MERN stack task management app — backend service.

## Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection logic
├── models/
│   ├── User.js             # User schema (auth)
│   └── Task.js             # Task schema
├── controllers/
│   ├── authController.js   # signup / login / getMe
│   └── taskController.js   # CRUD logic for tasks
├── routes/
│   ├── authRoutes.js       # /api/auth/*
│   └── taskRoutes.js       # /api/tasks/*
├── middleware/
│   ├── authMiddleware.js   # JWT verification (protect route)
│   └── errorMiddleware.js  # centralized error handling
├── .env.example
├── .gitignore
├── package.json
└── server.js                # app entry point
```

## Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   - `MONGO_URI`: your local MongoDB URI or a MongoDB Atlas connection string
   - `JWT_SECRET`: any long random string
   - `CLIENT_URL`: your React app's URL (for CORS), e.g. `http://localhost:5173`

3. Start MongoDB locally (if not using Atlas):
   ```bash
   mongod
   ```

4. Run the server:
   ```bash
   npm run dev     # with nodemon (auto-restart)
   # or
   npm start
   ```

5. Confirm it's alive:
   ```bash
   curl http://localhost:5000/api/health
   ```

## API Endpoints

### Auth
| Method | Endpoint          | Access  | Description               |
|--------|-------------------|---------|----------------------------|
| POST   | `/api/auth/signup`| Public  | Register a new user       |
| POST   | `/api/auth/login` | Public  | Log in, returns JWT token |
| GET    | `/api/auth/me`    | Private | Get current user profile  |

### Tasks (all require `Authorization: Bearer <token>`)
| Method | Endpoint          | Description                     |
|--------|-------------------|----------------------------------|
| GET    | `/api/tasks`      | Get all tasks for the logged-in user (supports `?status=` and `?sort=deadline`) |
| GET    | `/api/tasks/:id`  | Get a single task                |
| POST   | `/api/tasks`      | Create a task                    |
| PUT    | `/api/tasks/:id`  | Update a task                    |
| DELETE | `/api/tasks/:id`  | Delete a task                    |

### Task fields
- `title` (required)
- `description`
- `status`: `pending` | `in-progress` | `completed`
- `priority`: `low` | `medium` | `high`
- `deadline`: date

## Design notes
- Tasks are scoped to the authenticated user (`req.user._id`) at both the query and the mutation level, so no user can read or modify another user's tasks.
- Passwords are hashed with bcrypt before saving (`User.js` pre-save hook) and never returned in queries (`select: false`).
- A centralized error handler normalizes Mongoose validation, cast, and duplicate-key errors into consistent JSON responses.
- Compound index on `{ user, deadline }` in the Task model, since "a user's tasks sorted by deadline" is the primary access pattern the app needs.

## Next steps (later phases)
- React frontend (auth forms, task list/board UI)
- Input validation with `express-validator` on request bodies
- Tests (e.g. Jest + Supertest) for auth and task routes
- Deployment config
