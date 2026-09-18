import { color, font, space } from '@/lib/tokens'
import { CSSProperties, ReactNode } from 'react'

interface Props {
  children: ReactNode
  as?: 'label' | 'span' | 'p'
  muted?: boolean
  upper?: boolean
  style?: CSSProperties
}

export function Label({ children, as: Tag = 'span', muted, upper, style }: Props) {
  return (
    <Tag style={{
      fontFamily: font.family,
      fontSize: font.size.xs,
      fontWeight: font.weight.semibold,
      letterSpacing: upper ? '0.08em' : '0',
      textTransform: upper ? 'uppercase' : 'none',
      color: muted ? color.muted : color.text,
      lineHeight: font.lineHeight.tight,
      ...style,
    }}>
      {children}
    </Tag>
  )
}
