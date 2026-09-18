import { color } from '@/lib/tokens'
import { CSSProperties } from 'react'

interface Props { style?: CSSProperties; vertical?: boolean }

export function Divider({ style, vertical }: Props) {
  if (vertical) return (
    <div style={{
      width: '1px',
      alignSelf: 'stretch',
      background: color.border,
      flexShrink: 0,
      ...style,
    }} />
  )
  return (
    <hr style={{
      border: 'none',
      borderTop: `1px solid ${color.border}`,
      width: '100%',
      ...style,
    }} />
  )
}
