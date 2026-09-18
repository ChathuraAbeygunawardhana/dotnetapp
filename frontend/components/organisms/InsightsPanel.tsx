import { color, font, radius, shadow, space } from '@/lib/tokens'
import { InsightItem } from '@/components/molecules/InsightItem'
import { Divider } from '@/components/atoms/Divider'
import { Label } from '@/components/atoms/Label'

interface Props { insights: string[] }

export function InsightsPanel({ insights }: Props) {
  return (
    <div style={{
      background: color.surface,
      border: `1px solid ${color.border}`,
      borderRadius: radius.md,
      padding: space[5],
      boxShadow: shadow.sm,
    }}>
      <Label upper style={{ marginBottom: space[3], display: 'block' }}>Insights</Label>
      <Divider style={{ marginBottom: space[4] }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: space[4] }}>
        {insights.map((text, i) => (
          <InsightItem key={i} index={i + 1} text={text} />
        ))}
      </div>
    </div>
  )
}
