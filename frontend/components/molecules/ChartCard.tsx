'use client'
import { color, font, rawColors } from '@/lib/tokens'
import { useTheme } from '@/lib/ThemeContext'
import { ChartSpec } from '@/lib/types'
import { radius, shadow, space } from '@/lib/tokens'
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface Props { spec: ChartSpec }

export function ChartCard({ spec }: Props) {
  const { theme } = useTheme()
  const raw = rawColors[theme]
  const tickStyle = { fontFamily: font.family, fontSize: 11, fill: raw.muted }

  const renderChart = () => {
    switch (spec.type) {
      case 'LineChart':
        return (
          <LineChart data={spec.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={raw.border} />
            <XAxis dataKey={spec.xKey} tick={tickStyle} tickLine={false} axisLine={{ stroke: raw.border }} />
            <YAxis tick={tickStyle} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ fontFamily: font.family, fontSize: 12, background: color.surface, borderColor: raw.border, color: color.text }} />
            <Line type="monotone" dataKey={spec.yKey} stroke={raw.line} strokeWidth={2} dot={false} />
          </LineChart>
        )
      case 'BarChart':
        return (
          <BarChart data={spec.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={raw.border} vertical={false} />
            <XAxis dataKey={spec.xKey} tick={tickStyle} tickLine={false} axisLine={{ stroke: raw.border }} />
            <YAxis tick={tickStyle} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ fontFamily: font.family, fontSize: 12, background: color.surface, borderColor: raw.border, color: color.text }} />
            <Bar dataKey={spec.yKey} fill={raw.line} radius={[2, 2, 0, 0]} />
          </BarChart>
        )
      case 'PieChart':
        return (
          <PieChart>
            <Pie data={spec.data} dataKey="value" nameKey="name"
              cx="50%" cy="50%" outerRadius={90}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {spec.data.map((_, i) => (
                <Cell key={i} fill={raw.chart[i % raw.chart.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontFamily: font.family, fontSize: 12, background: color.surface, borderColor: raw.border, color: color.text }} />
          </PieChart>
        )
      case 'ScatterChart':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke={raw.border} />
            <XAxis dataKey={spec.xKey} name={spec.xKey} tick={tickStyle} tickLine={false} axisLine={{ stroke: raw.border }} />
            <YAxis dataKey={spec.yKey} name={spec.yKey} tick={tickStyle} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ fontFamily: font.family, fontSize: 12, background: color.surface, borderColor: raw.border, color: color.text }} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={spec.data} fill={raw.line} />
          </ScatterChart>
        )
    }
  }

  return (
    <div style={{
      background: color.bg,
      border: `1px solid ${color.border}`,
      borderRadius: radius.md,
      padding: space[5],
      boxShadow: shadow.sm,
    }}>
      <p style={{
        fontFamily: font.family,
        fontWeight: font.weight.semibold,
        fontSize: font.size.base,
        color: color.text,
        marginBottom: space[4],
      }}>
        {spec.title}
      </p>
      <ResponsiveContainer width="100%" height={220}>
        {renderChart()!}
      </ResponsiveContainer>
    </div>
  )
}
