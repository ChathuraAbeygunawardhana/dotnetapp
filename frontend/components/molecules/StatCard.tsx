import { color, font, radius, shadow, space } from '@/lib/tokens'
import { Divider } from '@/components/atoms/Divider'
import { Label } from '@/components/atoms/Label'

interface Props {
  label: string
  value: string | number
  sub?: string
}

export function StatCard({ label, value, sub }: Props) {
  return (
    <div style={{
      background: color.bg,
      border: `1px solid ${color.border}`,
      borderRadius: radius.md,
      padding: space[5],
      boxShadow: shadow.sm,
      display: 'flex',
      flexDirection: 'column',
      gap: space[2],
    }}>
      <Label upper muted>{label}</Label>
      <Divider />
      <p style={{
        fontFamily: font.family,
        fontSize: font.size.xl,
        fontWeight: font.weight.bold,
        color: color.text,
        lineHeight: font.lineHeight.tight,
      }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {sub && (
        <p style={{ fontFamily: font.family, fontSize: font.size.sm, color: color.muted }}>
          {sub}
        </p>
      )}
    </div>
  )
}
