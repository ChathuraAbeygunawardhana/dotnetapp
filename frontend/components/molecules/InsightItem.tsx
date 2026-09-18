import { color, font, space } from '@/lib/tokens'

interface Props { index: number; text: string }

export function InsightItem({ index, text }: Props) {
  return (
    <div style={{ display: 'flex', gap: space[3], alignItems: 'flex-start' }}>
      <span style={{
        flexShrink: 0,
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        background: color.accent,
        color: color.inverse,
        fontFamily: font.family,
        fontSize: font.size.xs,
        fontWeight: font.weight.bold,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2px',
      }}>
        {index}
      </span>
      <p style={{
        fontFamily: font.family,
        fontSize: font.size.base,
        color: color.text,
        lineHeight: font.lineHeight.base,
      }}>
        {text}
      </p>
    </div>
  )
}
