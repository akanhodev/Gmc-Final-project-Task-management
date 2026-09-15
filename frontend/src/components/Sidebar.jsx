import { color, font } from '../theme.js';
import { initialsOf } from '../utils.js';

export default function Sidebar({ narrow, user, screen, tasks, onNavigate }) {
  const openCount = tasks.filter((t) => t.status !== 'completed').length;
  const datedCount = tasks.filter((t) => t.deadline).length;
  const items = [
    { key: 'list', label: 'Tasks', count: openCount },
    { key: 'calendar', label: 'Deadlines', count: datedCount },
    { key: 'profile', label: 'Profile', count: null }
  ];

  return (
    <aside style={{
      background: color.dark, color: '#EFEBE1', width: narrow ? '100%' : 244, flex: 'none',
      padding: narrow ? '16px 20px' : '30px 20px', display: 'flex',
      flexDirection: narrow ? 'row' : 'column', alignItems: narrow ? 'center' : 'stretch',
      gap: narrow ? 18 : 30, position: narrow ? 'static' : 'sticky', top: 0,
      alignSelf: 'flex-start', height: narrow ? 'auto' : '100vh'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
        <span style={{ width: 26, height: 26, borderRadius: 8, background: color.accent, display: 'grid', placeItems: 'center', fontFamily: font.serif, fontSize: 16, color: '#FBF9F4', flex: 'none' }}>T</span>
        <span style={{ fontFamily: font.mono, fontSize: 11.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A79F8D' }}>Taskbook</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: narrow ? 'row' : 'column', gap: 3, flex: 1, minWidth: 0, overflow: 'auto' }}>
        {items.map((it) => {
          const on = screen === it.key;
          return (
            <button
              key={it.key}
              className="nav-item"
              onClick={() => onNavigate(it.key)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%',
                background: on ? color.darkRaised : 'transparent', color: on ? '#F7F4ED' : '#A79F8D',
                border: 'none', borderRadius: 9, padding: '11px 13px', fontSize: 14, fontWeight: on ? 500 : 400,
                cursor: 'pointer', textAlign: 'left', transition: 'background .15s, color .15s',
                boxShadow: on ? 'inset 0 1px 0 rgba(255,255,255,.05)' : 'none'
              }}
            >
              {it.label}
              <span style={{ fontFamily: font.mono, fontSize: 11.5, color: on ? '#C6BFAE' : '#726B5B' }}>
                {it.count === null ? '' : it.count}
              </span>
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: narrow ? 0 : 'auto', flex: 'none', minWidth: 0, paddingTop: narrow ? 0 : 18, borderTop: narrow ? 'none' : '1px solid ' + color.darkRaised }}>
        <button onClick={() => onNavigate('profile')} style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#EFEBE1', textAlign: 'left', width: '100%' }}>
          <span style={{ width: 34, height: 34, borderRadius: 11, background: color.accent, color: '#FDFBF7', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600, flex: 'none' }}>
            {initialsOf(user.name)}
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.35, minWidth: 0 }}>
            <span style={{ fontSize: 13.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
            <span style={{ fontSize: 11.5, color: '#8B8472' }}>View profile</span>
          </span>
        </button>
      </div>
    </aside>
  );
}
