import { space } from '@/lib/tokens'
import { ChartCard } from '@/components/molecules/ChartCard'
import { ChartSpec } from '@/lib/types'

interface Props { charts: ChartSpec[] }

export function ChartsGrid({ charts }: Props) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
      gap: space[4],
    }}>
      {charts.map(c => <ChartCard key={c.id} spec={c} />)}
    </div>
  )
}
