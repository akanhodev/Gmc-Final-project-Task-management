import { color } from '../theme.js';

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', left: '50%', bottom: 30, transform: 'translateX(-50%)',
      background: color.dark, color: '#EFEBE1', padding: '13px 22px', borderRadius: 99,
      fontSize: 13.5, zIndex: 80, animation: 'rise .2s ease both',
      boxShadow: '0 14px 34px -14px rgba(25,24,19,.6)'
    }}>
      {message}
    </div>
  );
}
