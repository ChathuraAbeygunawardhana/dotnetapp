// ─────────────────────────────────────────────────────────────────────────────
// Design Tokens — single source of truth for all styling.
// Import and use these in every component. Never hardcode values.
// ─────────────────────────────────────────────────────────────────────────────

export const color = {
  bg:       '#FFFFFF',
  surface:  '#F5F5F5',
  border:   '#D4D4D4',
  borderStrong: '#0A0A0A',
  text:     '#0A0A0A',
  muted:    '#737373',
  inverse:  '#FFFFFF',
  accent:   '#0A0A0A',
  error:    '#B91C1C',
  errorBg:  '#FEF2F2',
} as const;

export const font = {
  family: '"Space Grotesk", system-ui, sans-serif',
  mono:   '"JetBrains Mono", "Fira Mono", monospace',
  size: {
    xs:   '0.6875rem',  // 11px
    sm:   '0.8125rem',  // 13px
    base: '0.9375rem',  // 15px
    md:   '1.0625rem',  // 17px
    lg:   '1.25rem',    // 20px
    xl:   '1.625rem',   // 26px
    '2xl':'2.25rem',    // 36px
  },
  weight: {
    normal:   400,
    medium:   500,
    semibold: 600,
    bold:     700,
  },
  lineHeight: {
    tight:  1.2,
    base:   1.5,
    loose:  1.75,
  },
} as const;

export const space = {
  0:  '0px',
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '24px',
  6:  '32px',
  7:  '48px',
  8:  '64px',
  9:  '96px',
} as const;

export const radius = {
  none: '0px',
  sm:   '3px',
  md:   '6px',
  lg:   '10px',
} as const;

export const shadow = {
  sm: '0 1px 2px rgba(0,0,0,0.06)',
  md: '0 2px 8px rgba(0,0,0,0.08)',
} as const;

// Chart colours (monochromatic palette for the B&W theme)
export const chartColors = [
  '#0A0A0A',
  '#525252',
  '#A3A3A3',
  '#D4D4D4',
  '#404040',
  '#737373',
  '#171717',
  '#8A8A8A',
] as const;

export const transition = 'all 0.15s ease';
