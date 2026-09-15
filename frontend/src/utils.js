export const STATUS_LABEL = {
  'pending': 'To do',
  'in-progress': 'In progress',
  'completed': 'Done'
};

export const STATUSES = ['pending', 'in-progress', 'completed'];
export const PRIORITIES = ['low', 'medium', 'high'];

export const iso = (d) =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

export function parseDate(s) {
  if (!s) return null;
  const p = String(s).slice(0, 10).split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}

export function today() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export function dayDiff(s, from) {
  const d = parseDate(s);
  if (!d) return null;
  return Math.round((d - (from || today())) / 86400000);
}

export function dueText(task, from) {
  if (!task.deadline) return 'No deadline';
  if (task.status === 'completed') return 'Completed';
  const d = dayDiff(task.deadline, from);
  if (d < 0) return d === -1 ? 'Due yesterday' : Math.abs(d) + ' days overdue';
  if (d === 0) return 'Due today';
  if (d === 1) return 'Due tomorrow';
  if (d < 7) return 'Due ' + parseDate(task.deadline).toLocaleDateString('en-GB', { weekday: 'long' });
  return 'Due ' + parseDate(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/** 'late' | 'soon' | 'none' — drives the colour of the due-date pill. */
export function urgency(task, from) {
  if (task.status === 'completed') return 'none';
  const d = dayDiff(task.deadline, from);
  if (d === null) return 'none';
  return d < 0 ? 'late' : d <= 1 ? 'soon' : 'none';
}

export function initialsOf(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'A';
}

const PRIORITY_WEIGHT = { high: 0, medium: 1, low: 2 };

export function sortTasks(list, sortBy, order) {
  const dir = order === 'desc' ? -1 : 1;
  return list.slice().sort((a, b) => {
    if ((a.status === 'completed') !== (b.status === 'completed')) return a.status === 'completed' ? 1 : -1;
    if (sortBy === 'priority') {
      const diff = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
      if (diff !== 0) return dir * diff;
      return 0;
    }
    return dir * String(a.deadline || '9999').localeCompare(String(b.deadline || '9999'));
  });
}

export function matchesQuery(task, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (task.title || '').toLowerCase().includes(q) || (task.description || '').toLowerCase().includes(q);
}
