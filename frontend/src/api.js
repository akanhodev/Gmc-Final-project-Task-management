/**
 * Thin client for the Express API.
 *
 * DEMO mode keeps everything in memory so the UI runs with no server.
 * Set VITE_DEMO=false once the backend is up; every function below already
 * matches the routes in routes/authRoutes.js and routes/taskRoutes.js.
 */
import { SEED_TASKS, SEED_USER } from './seed.js';

const DEMO = import.meta.env.VITE_DEMO !== 'false';
const BASE = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'taskbook.token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

async function request(path, options) {
  const opts = options || {};
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = 'Bearer ' + token;
  const res = await fetch(BASE + path, {
    method: opts.method || 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

/* ---------- demo store ---------- */
let demoTasks = SEED_TASKS.slice();
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function validateCredentials(email, password) {
  if (!email || !password) throw new Error('Email and password are required');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Please provide a valid email');
  if (password.length < 6) throw new Error('Password must be at least 6 characters');
}

/* ---------- auth ---------- */
export async function register({ name, email, password }) {
  if (DEMO) {
    await delay(240);
    if (!name || !name.trim()) throw new Error('Name, email and password are required');
    validateCredentials(email, password);
    demoTasks = [];
    setToken('demo-token');
    return { user: { name: name.trim(), email: email.trim().toLowerCase() } };
  }
  const res = await request('/auth/signup', { method: 'POST', body: { name, email, password } });
  setToken(res.data.token);
  return { user: res.data };
}

export async function login({ email, password }) {
  if (DEMO) {
    await delay(240);
    validateCredentials(email, password);
    demoTasks = SEED_TASKS.slice();
    setToken('demo-token');
    return { user: { ...SEED_USER, email: email.trim().toLowerCase() } };
  }
  const res = await request('/auth/login', { method: 'POST', body: { email, password } });
  setToken(res.data.token);
  return { user: res.data };
}

export async function me() {
  if (DEMO) return { user: SEED_USER };
  const res = await request('/auth/me');
  return { user: res.data };
}

export function logout() {
  setToken(null);
}

/* ---------- tasks ---------- */
export async function listTasks() {
  if (DEMO) { await delay(120); return { tasks: demoTasks.slice() }; }
  const res = await request('/tasks');
  return { tasks: res.data };
}

export async function createTask(body) {
  if (DEMO) {
    await delay(120);
    const task = { _id: String(Date.now()), ...body };
    demoTasks = demoTasks.concat([task]);
    return { task };
  }
  const res = await request('/tasks', { method: 'POST', body });
  return { task: res.data };
}

export async function updateTask(id, body) {
  if (DEMO) {
    await delay(120);
    demoTasks = demoTasks.map((t) => (t._id === id ? { ...t, ...body } : t));
    return { task: demoTasks.find((t) => t._id === id) };
  }
  const res = await request('/tasks/' + id, { method: 'PUT', body });
  return { task: res.data };
}

export async function deleteTask(id) {
  if (DEMO) {
    await delay(120);
    demoTasks = demoTasks.filter((t) => t._id !== id);
    return { success: true };
  }
  return request('/tasks/' + id, { method: 'DELETE' });
}
