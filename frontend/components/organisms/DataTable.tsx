import { color, font, radius, shadow, space } from '@/lib/tokens'
import { Badge } from '@/components/atoms/Badge'
import { ColumnInfo } from '@/lib/types'

const ENUM_MAP: Record<number, string> = { 0: 'date', 1: 'number', 2: 'category', 3: 'unknown' }
const toTypeStr = (t: string | number) =>
  (typeof t === 'number' ? ENUM_MAP[t] : t.toLowerCase()) as 'date' | 'number' | 'category' | 'unknown'

interface Props {
  columns: ColumnInfo[]
  rows: Record<string, unknown>[]
}

export function DataTable({ columns, rows }: Props) {
  return (
    <div style={{
      background: color.bg,
      border: `1px solid ${color.border}`,
      borderRadius: radius.md,
      boxShadow: shadow.sm,
      overflow: 'hidden',
    }}>
      <div style={{
        overflowX: 'auto',
        maxHeight: '400px',
        overflowY: 'auto',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font.family }}>
          <thead>
            <tr style={{ background: color.surface, position: 'sticky', top: 0, zIndex: 1 }}>
              {columns.map(col => (
                <th key={col.name} style={{
                  padding: `${space[3]} ${space[4]}`,
                  textAlign: 'left',
                  fontSize: font.size.xs,
                  fontWeight: font.weight.semibold,
                  color: color.muted,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderBottom: `1px solid ${color.border}`,
                  whiteSpace: 'nowrap',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: space[1] }}>
                    {col.name}
                    <Badge type={toTypeStr(col.type)} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} style={{
                borderBottom: `1px solid ${color.border}`,
                background: ri % 2 === 0 ? color.bg : color.surface,
              }}>
                {columns.map(col => (
                  <td key={col.name} style={{
                    padding: `${space[2]} ${space[4]}`,
                    fontSize: font.size.sm,
                    color: color.text,
                    whiteSpace: 'nowrap',
                    maxWidth: '220px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {String(row[col.name] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{
        padding: `${space[2]} ${space[4]}`,
        borderTop: `1px solid ${color.border}`,
        background: color.surface,
        fontSize: font.size.xs,
        color: color.muted,
        fontFamily: font.family,
      }}>
        Showing {rows.length} preview rows
      </div>
    </div>
  )
}
