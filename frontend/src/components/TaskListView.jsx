import { useState } from 'react';
import { cardStyle, color, eyebrow, fieldStyle, font, pageTitle, radius, shadow } from '../theme.js';
import { STATUS_LABEL, dayDiff, matchesQuery, sortTasks, today } from '../utils.js';
import TaskRow from './TaskRow.jsx';

const FILTERS = [
  ['all', 'All'],
  ['pending', 'To do'],
  ['in-progress', 'In progress'],
  ['completed', 'Done']
];

const SORTS = [
  ['deadline', 'Deadline'],
  ['priority', 'Priority']
];

export default function TaskListView({ user, tasks, filter, onFilter, onOpen, onToggle, onCreate }) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [order, setOrder] = useState('asc');

  const open = tasks.filter((t) => t.status !== 'completed');
  const done = tasks.length - open.length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const overdue = open.filter((t) => t.deadline && dayDiff(t.deadline) < 0).length;
  const soon = open.filter((t) => t.deadline && dayDiff(t.deadline) >= 0 && dayDiff(t.deadline) <= 2).length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;

  const scoped = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);
  const searched = scoped.filter((t) => matchesQuery(t, query));
  const list = sortTasks(searched, sortBy, order);
  const firstName = (user.name || '').split(' ')[0];

  const stats = [
    { v: overdue, k: 'Overdue', color: overdue ? color.accent : color.ink },
    { v: soon, k: 'Due in 48h', color: color.ink },
    { v: inProgress, k: 'In progress', color: color.ink }
  ];

  return (
    <div style={{ animation: 'rise .34s ease both' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', gap: 22, alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={eyebrow}>{today().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <h1 style={pageTitle}>
            {tasks.length ? 'Good morning, ' + firstName + '.' : 'Let\u2019s set up your list, ' + firstName + '.'}
          </h1>
        </div>
        <button
          className="btn-dark"
          onClick={onCreate}
          style={{ background: color.dark, color: '#EFEBE1', border: 'none', borderRadius: radius.field, padding: '13px 22px', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background .15s', boxShadow: '0 8px 18px -12px rgba(25,24,19,.8)' }}
        >
          New task
        </button>
      </header>

      <section style={cardStyle}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 26, alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ ...eyebrow, fontSize: 11 }}>This week</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
              <span style={{ fontFamily: font.serif, fontSize: 46, lineHeight: 1, letterSpacing: '-0.02em' }}>{pct}%</span>
              <span style={{ fontSize: 14, color: color.muted }}>
                {tasks.length ? done + ' of ' + tasks.length + ' tasks complete' : 'nothing tracked yet'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 30 }}>
            {stats.map((s) => (
              <div key={s.k}>
                <div style={{ fontFamily: font.serif, fontSize: 27, lineHeight: 1, color: s.color }}>{s.v}</div>
                <div style={{ fontSize: 12, color: color.faint, marginTop: 3 }}>{s.k}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 7, background: '#E6E0D0', borderRadius: 99, marginTop: 22, overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', background: 'linear-gradient(90deg, #6F8168, #586B51)', borderRadius: 99, transition: 'width .4s ease' }} />
        </div>
      </section>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', margin: '30px 0 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {FILTERS.map(([key, text]) => {
            const on = filter === key;
            return (
              <button
                key={key}
                onClick={() => onFilter(key)}
                style={{ background: on ? color.dark : 'transparent', color: on ? '#F7F4ED' : color.inkSoft, border: '1px solid ' + (on ? color.dark : '#DCD4C2'), borderRadius: 99, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .15s' }}
              >
                {text}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
          <input
            className="field"
            style={{ ...fieldStyle, padding: '9px 14px', fontSize: 13.5, width: 220, maxWidth: '100%' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or description"
          />
          <select
            className="field"
            style={{ ...fieldStyle, padding: '9px 14px', fontSize: 13.5 }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORTS.map(([key, text]) => (
              <option key={key} value={key}>Sort by {text}</option>
            ))}
          </select>
          <button
            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
            aria-label={order === 'asc' ? 'Ascending order, click for descending' : 'Descending order, click for ascending'}
            title={order === 'asc' ? 'Ascending' : 'Descending'}
            style={{ ...fieldStyle, padding: '9px 14px', fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, background: '#FFFFFF' }}
          >
            {order === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
      </div>

      {list.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {list.map((t) => (
            <TaskRow key={t._id} task={t} onToggle={onToggle} onOpen={onOpen} />
          ))}
        </div>
      ) : (
        <div style={{ border: '1px dashed #D3CAB7', borderRadius: radius.card, padding: '64px 32px', textAlign: 'center', background: '#F2EEE4' }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#E6DFCF', margin: '0 auto 18px', display: 'grid', placeItems: 'center', fontFamily: font.serif, fontSize: 24, color: color.faint }}>+</div>
          <div style={{ fontFamily: font.serif, fontSize: 29, lineHeight: 1.15 }}>
            {tasks.length === 0 ? 'Your list is empty' : 'Nothing here'}
          </div>
          <p style={{ fontSize: 14.5, color: color.muted, margin: '10px auto 24px', maxWidth: 350, lineHeight: 1.65, textWrap: 'pretty' }}>
            {tasks.length === 0
              ? 'Add the first thing on your mind \u2014 a reading, a problem set, an email you keep putting off.'
              : query.trim()
                ? 'No tasks match \u201c' + query.trim() + '\u201d. Try another search, or add something new.'
                : 'No tasks match this filter. Try another one, or add something new.'}
          </p>
          <button className="btn-primary" onClick={onCreate} style={{ background: color.accent, color: '#FDFBF7', border: 'none', borderRadius: radius.field, padding: '12px 22px', fontSize: 14, fontWeight: 500, cursor: 'pointer', boxShadow: shadow.raise }}>
            Add a task
          </button>
        </div>
      )}
    </div>
  );
}
