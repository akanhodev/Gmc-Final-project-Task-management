import { useEffect } from 'react';
import { color, font, priorityColor, radius, shadow } from '../theme.js';
import { STATUS_LABEL, dueText, parseDate, urgency } from '../utils.js';

const TONE = { late: '#8E3A19', soon: '#9C6A22', none: '#7D7666' };

export default function TaskDetail({ task, narrow, onClose, onAdvance, onEdit, onDelete }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const next = task.status === 'pending' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : 'pending';
  const advanceLabel = next === 'in-progress' ? 'Start working' : next === 'completed' ? 'Mark complete' : 'Reopen task';
  const prio = priorityColor[task.priority];

  const meta = [
    { k: 'Status', v: STATUS_LABEL[task.status], color: task.status === 'completed' ? '#586B51' : color.ink },
    { k: 'Deadline', v: task.deadline ? parseDate(task.deadline).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : 'None', color: color.ink },
    { k: 'Timing', v: dueText(task), color: TONE[urgency(task)] }
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(25,24,19,.34)', backdropFilter: 'blur(2px)', zIndex: 40 }} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: narrow ? '100%' : 452,
        background: color.panel, borderLeft: '1px solid ' + color.line, padding: '32px 32px 44px',
        display: 'flex', flexDirection: 'column', gap: 22, zIndex: 50, overflow: 'auto',
        animation: 'slidein .24s ease both', boxShadow: shadow.drawer
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: prio, background: prio + '14', border: '1px solid ' + prio + '33', borderRadius: 99, padding: '6px 12px' }}>
            {task.priority} priority
          </span>
          <button className="btn-ghost" onClick={onClose} aria-label="Close" style={{ background: 'none', border: '1px solid ' + color.line, borderRadius: 8, width: 32, height: 32, fontSize: 15, lineHeight: 1, color: '#857E6E', cursor: 'pointer', padding: 0, flex: 'none' }}>
            {'\u2715'}
          </button>
        </div>

        <h2 style={{ fontFamily: font.serif, fontSize: 33, fontWeight: 400, lineHeight: 1.14, margin: 0, letterSpacing: '-0.015em' }}>{task.title}</h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.7, color: color.inkSoft, margin: 0, textWrap: 'pretty' }}>
          {task.description || 'No description.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#EBE5D6', border: '1px solid #EBE5D6', borderRadius: 12, overflow: 'hidden' }}>
          {meta.map((m) => (
            <div key={m.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, background: color.panelAlt, padding: '14px 17px', fontSize: 14 }}>
              <span style={{ color: '#857E6E' }}>{m.k}</span>
              <span style={{ color: m.color, fontWeight: 500 }}>{m.v}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 2 }}>
          <button className="btn-dark" onClick={onAdvance} style={{ flex: 1, minWidth: 150, background: color.dark, color: '#EFEBE1', border: 'none', borderRadius: radius.field, padding: '13px 18px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            {advanceLabel}
          </button>
          <button className="btn-ghost" onClick={onEdit} style={{ background: 'none', border: '1px solid ' + color.field, color: color.ink, borderRadius: radius.field, padding: '13px 18px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            Edit
          </button>
          <button className="btn-danger" onClick={onDelete} style={{ background: 'none', border: '1px solid ' + color.field, color: color.accentInk, borderRadius: radius.field, padding: '13px 18px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      </aside>
    </>
  );
}
