import { color, priorityColor, radius } from '../theme.js';
import { STATUS_LABEL, dueText, urgency } from '../utils.js';

const DUE_TONE = {
  late: { color: '#8E3A19', background: '#F6E6DD', border: '1px solid #EBD2C4' },
  soon: { color: '#9C6A22', background: '#F7EEDC', border: '1px solid #EBDCBF' },
  none: { color: '#7D7666', background: 'transparent', border: '1px solid transparent' }
};

export default function TaskRow({ task, onToggle, onOpen }) {
  const isDone = task.status === 'completed';
  const tone = DUE_TONE[urgency(task)];

  return (
    <div
      className="task-row"
      style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 14,
        background: color.panel, border: '1px solid #E6E0D0', borderRadius: radius.row,
        padding: '17px 20px 17px 22px', overflow: 'hidden',
        transition: 'transform .16s ease, box-shadow .16s ease, border-color .16s',
        boxShadow: '0 1px 2px rgba(30,28,23,.03)', opacity: isDone ? 0.58 : 1
      }}
    >
      <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: isDone ? '#C9C2B1' : priorityColor[task.priority], opacity: isDone ? 0.5 : 0.9 }} />

      <button
        className="task-check"
        aria-label={isDone ? 'Mark as to do' : 'Mark complete'}
        onClick={() => onToggle(task)}
        style={{
          width: 22, height: 22, flex: 'none', borderRadius: '50%',
          border: '1.5px solid ' + (isDone ? color.done : '#C7BFAD'),
          background: isDone ? color.done : 'transparent', color: '#FBF9F4', fontSize: 12,
          lineHeight: 1, cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 0,
          transition: 'all .16s'
        }}
      >
        {isDone ? '\u2713' : ''}
      </button>

      <button onClick={() => onOpen(task)} style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 7 }}>
        <span style={{ fontSize: 15.5, fontWeight: 500, color: color.ink, textDecoration: isDone ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%', letterSpacing: '-0.005em' }}>
          {task.title}
        </span>
        <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, borderRadius: 99, padding: '3px 9px', ...tone }}>{dueText(task)}</span>
          <span style={{ fontSize: 12, color: color.faint, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.04em' }}>{STATUS_LABEL[task.status]}</span>
        </span>
      </button>

      <span style={{ flex: 'none', fontSize: 11.5, textTransform: 'capitalize', color: '#7D7666', paddingLeft: 10, borderLeft: '1px solid #EBE5D6' }}>
        {task.priority}
      </span>
    </div>
  );
}
