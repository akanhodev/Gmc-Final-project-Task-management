# Taskbook - React client

React port of the `Task Manager v2` design prototype. It runs standalone in demo mode,
and swaps to the Express/MongoDB backend by flipping one environment variable.

## Run it

```bash
cd export
npm install
cp .env.example .env
npm run dev          # http://localhost:5173
```

Demo mode is on by default: any valid email plus a 6+ character password logs you in
with seeded coursework. Signing up instead starts you on the empty state.

## Wire it to the backend

1. Set `VITE_DEMO=false` in `.env`.
2. Start the Express server on port 5000 (`vite.config.js` proxies `/api` to it).
3. `src/api.js` already calls the routes the server exposes:

| Function | Request |
| --- | --- |
| `register` | `POST /api/auth/register` |
| `login` | `POST /api/auth/login` |
| `me` | `GET /api/auth/me` |
| `listTasks` | `GET /api/tasks` |
| `createTask` | `POST /api/tasks` |
| `updateTask` | `PUT /api/tasks/:id` |
| `deleteTask` | `DELETE /api/tasks/:id` |

The JWT returned by login/register is stored under `taskbook.token` and sent as
`Authorization: Bearer <token>` on every request.

## Structure

```
src/
  api.js               fetch client + in-memory demo store
  theme.js             colours, type, radii, shadows - the single source of design truth
  utils.js             date maths, due-date copy, urgency, sorting
  seed.js              demo coursework, dated relative to today
  hooks/
    useBreakpoint.js   single-column layout below 880px
    useToast.js        transient confirmation messages
  components/
    AuthScreen.jsx     login + signup, split layout
    Sidebar.jsx        navigation, task counts, account button
    TaskListView.jsx   greeting, progress card, filters, list, empty states
    TaskRow.jsx        one task: checkbox, title, due pill, priority edge
    CalendarView.jsx   month grid of deadlines
    ProfileView.jsx    account summary, stats, preferences, sign out
    TaskDetail.jsx     right-hand drawer: read, advance status, edit, delete
    TaskComposer.jsx   create/edit modal with validation
    Toast.jsx          bottom confirmation pill
```

## Styling

Design values live in `src/theme.js` and are applied as inline style objects, so a colour
or radius changes in exactly one place. `src/index.css` holds only what inline styles cannot
express: keyframes, resets, and hover/focus states (`.btn-primary`, `.task-row`, `.field`, etc.).

## Task shape

```js
{ _id, title, description, status: 'pending' | 'in-progress' | 'completed',
  priority: 'low' | 'medium' | 'high', deadline: 'YYYY-MM-DD' | null }
```

This mirrors `models/Task.js`. The design deliberately shows no subtasks, tags,
attachments, or percent-complete field - the schema does not carry them. Progress is
derived as completed / total.
