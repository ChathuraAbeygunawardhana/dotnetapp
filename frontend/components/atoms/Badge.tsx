import { color, font, radius, space } from '@/lib/tokens'
import { CSSProperties } from 'react'

type Variant = 'date' | 'number' | 'category' | 'unknown'

const variantStyles: Record<Variant, CSSProperties> = {
  date:     { background: '#0A0A0A', color: '#FFFFFF' },
  number:   { background: '#404040', color: '#FFFFFF' },
  category: { background: '#F5F5F5', color: '#0A0A0A', border: `1px solid #D4D4D4` },
  unknown:  { background: '#F5F5F5', color: '#737373', border: `1px solid #D4D4D4` },
}

const labels: Record<Variant, string> = {
  date: 'Date', number: 'Number', category: 'Category', unknown: 'Unknown',
}

interface Props { type: Variant; style?: CSSProperties }

export function Badge({ type, style }: Props) {
  return (
    <span style={{
      display: 'inline-block',
      padding: `${space[1]} ${space[2]}`,
      borderRadius: radius.sm,
      fontSize: font.size.xs,
      fontWeight: font.weight.semibold,
      fontFamily: font.family,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      ...variantStyles[type],
      ...style,
    }}>
      {labels[type]}
    </span>
  )
}
