import { space } from '@/lib/tokens'
import { StatCard } from '@/components/molecules/StatCard'
import { StatSummary } from '@/lib/types'

interface Props { rowCount: number; stats: StatSummary[] }

export function StatsRow({ rowCount, stats }: Props) {
  const numStats = stats.filter(s => s.min != null).slice(0, 3)
  const catStats = stats.filter(s => s.topCategory != null).slice(0, 1)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: space[4],
    }}>
      <StatCard label="Total Rows" value={rowCount} />
      {numStats.map(s => (
        <StatCard
          key={s.column}
          label={`Total ${s.column}`}
          value={s.sum != null ? s.sum.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}
          sub={`Avg: ${s.mean?.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
        />
      ))}
      {catStats.map(s => (
        <StatCard
          key={s.column}
          label={`Top ${s.column}`}
          value={s.topCategory ?? '—'}
          sub={`${s.topCategoryCount} records`}
        />
      ))}
    </div>
  )
}
