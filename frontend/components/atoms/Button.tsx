import { color, font, radius, space, transition } from '@/lib/tokens'
import { CSSProperties, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost'
type Size = 'sm' | 'md'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const styles: Record<Variant, CSSProperties> = {
  primary: {
    background: color.accent,
    color: color.inverse,
    border: `1.5px solid ${color.accent}`,
  },
  ghost: {
    background: 'transparent',
    color: color.text,
    border: `1.5px solid ${color.border}`,
  },
}

const sizes: Record<Size, CSSProperties> = {
  sm: { padding: `${space[2]} ${space[3]}`, fontSize: font.size.sm },
  md: { padding: `${space[2]} ${space[5]}`, fontSize: font.size.base },
}

export function Button({ variant = 'primary', size = 'md', style, children, disabled, ...rest }: Props) {
  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: space[2],
        fontFamily: font.family,
        fontWeight: font.weight.medium,
        borderRadius: radius.sm,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition,
        whiteSpace: 'nowrap',
        ...styles[variant],
        ...sizes[size],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
