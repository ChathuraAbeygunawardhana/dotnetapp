// ─────────────────────────────────────────────────────────────────────────────
// Design Tokens — single source of truth. Colors reference CSS custom
// properties so they respond to [data-theme] automatically.
// ─────────────────────────────────────────────────────────────────────────────

export const color = {
  bg:           'var(--color-bg)',
  surface:      'var(--color-surface)',
  border:       'var(--color-border)',
  borderStrong: 'var(--color-border-strong)',
  text:         'var(--color-text)',
  muted:        'var(--color-muted)',
  inverse:      'var(--color-inverse)',
  accent:       'var(--color-accent)',
  error:        'var(--color-error)',
  errorBg:      'var(--color-error-bg)',
  errorBorder:  'var(--color-error-border)',
} as const

// Raw hex values for contexts that do NOT support CSS variables (e.g. SVG
// presentation attributes, Recharts stroke/fill props). Use the theme-aware
// versions returned by useChartColors() in ChartCard instead of these directly.
export const rawColors = {
  light: {
    line:   '#0A0A0A',
    line2:  '#525252',
    border: '#D4D4D4',
    muted:  '#737373',
    chart:  ['#0A0A0A','#525252','#A3A3A3','#D4D4D4','#404040','#737373','#171717','#8A8A8A'],
  },
  dark: {
    line:   '#F0F0F0',
    line2:  '#A3A3A3',
    border: '#2A2A2A',
    muted:  '#888888',
    chart:  ['#F0F0F0','#A3A3A3','#525252','#2A2A2A','#C0C0C0','#737373','#E0E0E0','#707070'],
  },
} as const

export const font = {
  family: '"Space Grotesk", system-ui, sans-serif',
  mono:   '"JetBrains Mono", "Fira Mono", monospace',
  size: {
    xs:   '0.6875rem',
    sm:   '0.8125rem',
    base: '0.9375rem',
    md:   '1.0625rem',
    lg:   '1.25rem',
    xl:   '1.625rem',
    '2xl':'2.25rem',
  },
  weight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { tight: 1.2, base: 1.5, loose: 1.75 },
} as const

export const space = {
  0:'0px', 1:'4px', 2:'8px', 3:'12px', 4:'16px',
  5:'24px', 6:'32px', 7:'48px', 8:'64px', 9:'96px',
} as const

export const radius = { none:'0px', sm:'3px', md:'6px', lg:'10px' } as const
export const shadow = {
  sm: '0 1px 2px rgba(0,0,0,0.06)',
  md: '0 2px 8px rgba(0,0,0,0.08)',
} as const

export const transition = 'all 0.15s ease'
