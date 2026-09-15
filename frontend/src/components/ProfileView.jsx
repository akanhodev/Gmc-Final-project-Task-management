import { cardStyle, color, eyebrow, font, pageTitle, radius } from '../theme.js';
import { initialsOf } from '../utils.js';

const PREFS = [
  { key: 'emailReminders', label: 'Email me the morning of a deadline', help: 'One digest at 07:00, only on days with something due.' },
  { key: 'weekStartsMonday', label: 'Start the week on Monday', help: 'Applies to the deadlines calendar.' }
];

export default function ProfileView({ user, tasks, prefs, onPrefs, onLogout }) {
  const done = tasks.filter((t) => t.status === 'completed').length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const stats = [
    { v: tasks.length, k: 'Tasks tracked' },
    { v: done, k: 'Completed' },
    { v: pct + '%', k: 'Completion rate' }
  ];

  return (
    <div style={{ animation: 'rise .34s ease both', maxWidth: 580 }}>
      <header style={{ marginBottom: 30 }}>
        <div style={eyebrow}>Account</div>
        <h1 style={pageTitle}>Profile</h1>
      </header>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 17, paddingBottom: 24, borderBottom: '1px solid #EBE5D6' }}>
          <span style={{ width: 58, height: 58, borderRadius: 18, background: color.accent, color: '#FDFBF7', display: 'grid', placeItems: 'center', fontSize: 21, fontWeight: 600, flex: 'none', boxShadow: '0 10px 22px -12px rgba(180,81,44,.8)' }}>
            {initialsOf(user.name)}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 14, color: color.muted, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18, padding: '24px 0', borderBottom: '1px solid #EBE5D6' }}>
          {stats.map((s) => (
            <div key={s.k}>
              <div style={{ fontFamily: font.serif, fontSize: 34, lineHeight: 1, letterSpacing: '-0.01em' }}>{s.v}</div>
              <div style={{ fontSize: 12.5, color: color.faint, marginTop: 5 }}>{s.k}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 14 }}>
          {PREFS.map((p) => {
            const on = prefs[p.key];
            return (
              <button
                key={p.key}
                role="switch"
                aria-checked={on}
                onClick={() => onPrefs({ ...prefs, [p.key]: !on })}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, background: 'none', border: 'none', padding: '14px 0', cursor: 'pointer', textAlign: 'left', color: color.ink }}
              >
                <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 500 }}>{p.label}</span>
                  <span style={{ fontSize: 12.5, color: color.faint, lineHeight: 1.5 }}>{p.help}</span>
                </span>
                <span style={{ width: 42, height: 24, flex: 'none', borderRadius: 99, background: on ? color.done : '#DCD4C2', display: 'flex', alignItems: 'center', padding: 2, transition: 'background .2s' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#FDFBF7', transform: on ? 'translateX(18px)' : 'none', transition: 'transform .2s cubic-bezier(.4,1.4,.6,1)', boxShadow: '0 1px 3px rgba(30,28,23,.25)' }} />
                </span>
              </button>
            );
          })}
        </div>

        <button className="btn-danger" onClick={onLogout} style={{ marginTop: 22, background: 'none', border: '1px solid ' + color.field, color: color.accentInk, borderRadius: radius.field, padding: '12px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background .15s' }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
