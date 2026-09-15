import { useState } from 'react';
import { color, fieldStyle, font, label, radius, shadow } from '../theme.js';

const CHIPS = ['Private to your account', 'Sorted by deadline', 'Works on your phone'];

export default function AuthScreen({ narrow, onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isSignup = mode === 'signup';

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setError(''); };

  const submit = async () => {
    setBusy(true);
    try {
      await onAuth(mode, form);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const onKeyDown = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div style={{ fontFamily: font.sans, color: color.ink, background: color.bg, display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1.05fr 1fr', minHeight: '100vh' }}>
      <div style={{ position: 'relative', overflow: 'hidden', background: color.dark, color: '#EFEBE1', padding: narrow ? '40px 28px' : '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 340 }}>
        <div style={{ position: 'absolute', width: 640, height: 640, right: -220, top: -180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,85,47,.30), rgba(196,85,47,0) 68%)', animation: 'glow 5s ease-in-out infinite alternate', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{ width: 26, height: 26, borderRadius: 8, background: color.accent, display: 'grid', placeItems: 'center', fontFamily: font.serif, fontSize: 16, color: '#FBF9F4' }}>T</span>
          <span style={{ fontFamily: font.mono, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A79F8D' }}>Taskbook</span>
        </div>
        <div style={{ position: 'relative', maxWidth: 460, padding: '52px 0' }}>
          <div style={{ fontFamily: font.serif, fontSize: narrow ? 44 : 62, lineHeight: 1.02, letterSpacing: '-0.02em' }}>
            Every deadline,<br />
            <span style={{ fontStyle: 'italic', color: '#E1A88A' }}>one quiet page.</span>
          </div>
          <p style={{ fontSize: 16.5, lineHeight: 1.7, color: '#ADA593', margin: '26px 0 0', maxWidth: 400, textWrap: 'pretty' }}>
            A calm home for coursework. Write the task down, set the date, and let the week close itself out.
          </p>
        </div>
        <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {CHIPS.map((c) => (
            <span key={c} style={{ fontSize: 12.5, color: '#9C9482', border: '1px solid #302E27', borderRadius: radius.pill, padding: '6px 13px' }}>{c}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 32px', background: color.bg }}>
        <div style={{ width: '100%', maxWidth: 396, background: color.panel, border: '1px solid ' + color.line, borderRadius: radius.modal, padding: '38px 34px', boxShadow: '0 1px 2px rgba(30,28,23,.04), 0 26px 50px -28px rgba(30,28,23,.22)', animation: 'rise .45s ease both' }}>
          <div style={{ fontFamily: font.serif, fontSize: 38, lineHeight: 1.08, letterSpacing: '-0.01em' }}>
            {isSignup ? 'Create your account' : 'Welcome back'}
          </div>
          <p style={{ fontSize: 14.5, color: color.muted, margin: '10px 0 30px', lineHeight: 1.6, textWrap: 'pretty' }}>
            {isSignup ? 'One list, scoped to you. Nothing is shared unless you share it.' : 'Sign in to pick up where the week left off.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {isSignup && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: 7, ...label }}>
                Full name
                <input className="field" style={fieldStyle} value={form.name} onChange={set('name')} onKeyDown={onKeyDown} placeholder="Amara Okoye" />
              </label>
            )}
            <label style={{ display: 'flex', flexDirection: 'column', gap: 7, ...label }}>
              Email
              <input className="field" style={fieldStyle} value={form.email} onChange={set('email')} onKeyDown={onKeyDown} placeholder="you@university.edu" />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 7, ...label }}>
              Password
              <input className="field" type="password" style={fieldStyle} value={form.password} onChange={set('password')} onKeyDown={onKeyDown} placeholder="At least 6 characters" />
            </label>

            {error && (
              <div style={{ fontSize: 13, color: color.accentInk, background: color.accentWash, border: '1px solid #EBD2C4', borderRadius: 9, padding: '10px 13px', lineHeight: 1.5 }}>{error}</div>
            )}

            <button
              className="btn-primary"
              onClick={submit}
              disabled={busy}
              style={{ marginTop: 6, background: color.accent, color: '#FDFBF7', border: 'none', borderRadius: radius.field, padding: '14px 18px', fontSize: 15, fontWeight: 500, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.7 : 1, transition: 'background .15s, transform .12s', boxShadow: shadow.raise }}
            >
              {busy ? 'One moment...' : isSignup ? 'Create account' : 'Log in'}
            </button>

            <div style={{ fontSize: 14, color: color.muted, textAlign: 'center', marginTop: 8 }}>
              {isSignup ? 'Already have an account?' : 'New here?'}
              <button
                onClick={() => { setMode(isSignup ? 'login' : 'signup'); setError(''); }}
                style={{ background: 'none', border: 'none', color: color.accent, fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '0 0 0 5px', textDecoration: 'underline', textUnderlineOffset: 2 }}
              >
                {isSignup ? 'Log in' : 'Create one'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
