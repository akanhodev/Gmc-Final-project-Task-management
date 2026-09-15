export const color = {
  bg: '#E9E4D8',
  panel: '#FBF9F4',
  panelAlt: '#F8F5EC',
  ink: '#1E1C17',
  inkSoft: '#4A453B',
  muted: '#6B6455',
  faint: '#8B8472',
  line: '#E4DDCD',
  lineSoft: '#EDE7D9',
  field: '#DED6C5',
  dark: '#191813',
  darkRaised: '#2A2822',
  accent: '#B4512C',
  accentDeep: '#9C4222',
  accentInk: '#8E3A19',
  accentWash: '#F6E6DD',
  warnInk: '#9C6A22',
  warnWash: '#F7EEDC',
  done: '#6F8168'
};

export const priorityColor = { low: '#6F8168', medium: '#A97F35', high: '#B4512C' };

export const font = {
  sans: "'IBM Plex Sans', system-ui, sans-serif",
  serif: "'Instrument Serif', serif",
  mono: "'IBM Plex Mono', monospace"
};

export const radius = { field: 10, card: 16, row: 13, modal: 18, pill: 99 };

export const shadow = {
  card: '0 1px 2px rgba(30,28,23,.04), 0 20px 40px -30px rgba(30,28,23,.25)',
  raise: '0 8px 18px -10px rgba(180,81,44,.7)',
  modal: '0 40px 70px -30px rgba(25,24,19,.45)',
  drawer: '-30px 0 60px -40px rgba(25,24,19,.5)'
};

export const label = {
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#857E6E'
};

export const fieldStyle = {
  border: '1px solid ' + color.field,
  background: '#FFFFFF',
  borderRadius: radius.field,
  padding: '13px 15px',
  fontSize: 15,
  color: color.ink,
  outline: 'none',
  transition: 'border-color .15s, box-shadow .15s'
};

export const eyebrow = {
  fontFamily: font.mono,
  fontSize: 11.5,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: color.faint
};

export const pageTitle = {
  fontFamily: font.serif,
  fontSize: 46,
  fontWeight: 400,
  margin: '10px 0 0',
  letterSpacing: '-0.02em',
  lineHeight: 1.05
};

export const cardStyle = {
  background: color.panel,
  border: '1px solid ' + color.line,
  borderRadius: radius.card,
  padding: '26px 28px',
  boxShadow: shadow.card
};
