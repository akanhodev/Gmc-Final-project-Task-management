import { useState } from 'react';
import { color, fieldStyle, font, label, radius, shadow } from '../theme.js';
import { PRIORITIES, STATUSES, STATUS_LABEL } from '../utils.js';

export default function TaskComposer({ draft, onChange, onCancel, onSave }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isEdit = draft.mode === 'edit';

  const set = (k) => (e) => { onChange({ ...draft, [k]: e.target.value }); setError(''); };

  const submit = async () => {
    if (!draft.title.trim()) return setError('Title is required');
    if (draft.title.trim().length > 200) return setError('Title must be 200 characters or fewer');
    setBusy(true);
    try {
      await onSave(draft);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, background: 'rgba(25,24,19,.42)', backdropFilter: 'blur(3px)', zIndex: 60, display: 'grid', placeItems: 'center', padding: 24 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 530, background: color.panel, border: '1px solid ' + color.line, borderRadius: radius.modal, padding: 30, display: 'flex', flexDirection: 'column', gap: 16, animation: 'rise .24s ease both', maxHeight: '90vh', overflow: 'auto', boxShadow: shadow.modal }}
      >
        <div style={{ fontFamily: font.serif, fontSize: 31, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
          {isEdit ? 'Edit task' : 'New task'}
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 7, ...label }}>
          Title
          <input className="field" style={fieldStyle} value={draft.title} onChange={set('title')} placeholder="e.g. Submit statistics problem set 5" autoFocus />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 7, ...label }}>
          Description
          <textarea className="field" rows={3} style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.6 }} value={draft.description || ''} onChange={set('description')} placeholder="Optional detail, links, page numbers" />
        </label>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <label style={{ flex: 1, minWidth: 150, display: 'flex', flexDirection: 'column', gap: 7, ...label }}>
            Deadline
            <input className="field" type="date" style={{ ...fieldStyle, padding: '12px 15px' }} value={draft.deadline || ''} onChange={set('deadline')} />
          </label>
          <label style={{ flex: 1, minWidth: 150, display: 'flex', flexDirection: 'column', gap: 7, ...label }}>
            Priority
            <select className="field" style={{ ...fieldStyle, padding: '12px 15px' }} value={draft.priority} onChange={set('priority')}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...label }}>
          Status
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {STATUSES.map((s) => {
              const on = draft.status === s;
              return (
                <button
                  key={s}
                  onClick={() => onChange({ ...draft, status: s })}
                  style={{ background: on ? color.dark : '#FFFFFF', color: on ? '#F7F4ED' : color.inkSoft, border: '1px solid ' + (on ? color.dark : color.field), borderRadius: 9, padding: '10px 16px', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', transition: 'all .15s', textTransform: 'none', letterSpacing: 'normal' }}
                >
                  {STATUS_LABEL[s]}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div style={{ fontSize: 13, color: color.accentInk, background: color.accentWash, border: '1px solid #EBD2C4', borderRadius: 9, padding: '10px 13px' }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: 9, justifyContent: 'flex-end', marginTop: 4 }}>
          <button className="btn-ghost" onClick={onCancel} style={{ background: 'none', border: '1px solid ' + color.field, borderRadius: radius.field, padding: '12px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer', color: color.inkSoft }}>
            Cancel
          </button>
          <button className="btn-primary" onClick={submit} disabled={busy} style={{ background: color.accent, color: '#FDFBF7', border: 'none', borderRadius: radius.field, padding: '12px 24px', fontSize: 14, fontWeight: 500, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.7 : 1, boxShadow: shadow.raise }}>
            {isEdit ? 'Save changes' : 'Add task'}
          </button>
        </div>
      </div>
    </div>
  );
}
