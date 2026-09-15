import { color, eyebrow, font, pageTitle, priorityColor, radius, shadow } from '../theme.js';
import { iso, today } from '../utils.js';

const SUN_FIRST = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON_FIRST = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarView({ tasks, mondayFirst, onOpen }) {
  const now = today();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const lead = (first.getDay() - (mondayFirst ? 1 : 0) + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = Math.ceil((lead + daysInMonth) / 7);
  const start = new Date(year, month, 1 - lead);
  const names = mondayFirst ? MON_FIRST : SUN_FIRST;

  const cells = Array.from({ length: weeks * 7 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const key = iso(d);
    return {
      i,
      key,
      num: d.getDate(),
      inMonth: d.getMonth() === month,
      isToday: key === iso(now),
      items: tasks.filter((t) => t.deadline && String(t.deadline).slice(0, 10) === key)
    };
  });

  return (
    <div style={{ animation: 'rise .34s ease both' }}>
      <header style={{ marginBottom: 30 }}>
        <div style={eyebrow}>Deadlines</div>
        <h1 style={pageTitle}>{now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h1>
      </header>

      <div style={{ background: color.panel, border: '1px solid ' + color.line, borderRadius: radius.card, overflow: 'hidden', boxShadow: shadow.card }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', borderBottom: '1px solid ' + color.lineSoft, background: '#F6F2E8' }}>
          {names.map((n) => (
            <div key={n} style={{ padding: '12px 13px', fontFamily: font.mono, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: color.faint }}>{n}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
          {cells.map((c) => (
            <div
              key={c.key}
              style={{
                minHeight: 112, minWidth: 0, padding: '9px 10px',
                borderRight: c.i % 7 === 6 ? 'none' : '1px solid ' + color.lineSoft,
                borderBottom: c.i < (weeks - 1) * 7 ? '1px solid ' + color.lineSoft : 'none',
                background: c.isToday ? '#F4EEE2' : c.inMonth ? 'transparent' : '#F5F2EA',
                opacity: c.inMonth ? 1 : 0.55
              }}
            >
              <div style={{ fontFamily: font.mono, fontSize: 12, color: c.isToday ? color.accent : color.faint, fontWeight: c.isToday ? 600 : 400 }}>{c.num}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 7 }}>
                {c.items.map((t) => {
                  const isDone = t.status === 'completed';
                  return (
                    <button
                      key={t._id}
                      className="cal-chip"
                      onClick={() => onOpen(t)}
                      style={{
                        background: isDone ? '#E6EAE1' : priorityColor[t.priority] + '18',
                        color: isDone ? '#586B51' : priorityColor[t.priority],
                        border: 'none', borderRadius: 6, padding: '5px 7px', fontSize: 11.5,
                        fontWeight: 500, textAlign: 'left', cursor: 'pointer', overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0,
                        textDecoration: isDone ? 'line-through' : 'none', transition: 'opacity .15s'
                      }}
                    >
                      {t.title}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
