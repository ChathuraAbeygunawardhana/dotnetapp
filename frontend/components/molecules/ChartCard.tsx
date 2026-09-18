'use client'
import { color, font, radius, shadow, space } from '@/lib/tokens'
import { ChartSpec } from '@/lib/types'
import { chartColors } from '@/lib/tokens'
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

interface Props { spec: ChartSpec }

export function ChartCard({ spec }: Props) {
  const tickStyle = { fontFamily: font.family, fontSize: 11, fill: color.muted }

  const renderChart = () => {
    switch (spec.type) {
      case 'LineChart':
        return (
          <LineChart data={spec.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={color.border} />
            <XAxis dataKey={spec.xKey} tick={tickStyle} tickLine={false} axisLine={{ stroke: color.border }} />
            <YAxis tick={tickStyle} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ fontFamily: font.family, fontSize: 12, borderColor: color.border }} />
            <Line type="monotone" dataKey={spec.yKey} stroke={chartColors[0]} strokeWidth={2} dot={false} />
          </LineChart>
        )
      case 'BarChart':
        return (
          <BarChart data={spec.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={color.border} vertical={false} />
            <XAxis dataKey={spec.xKey} tick={tickStyle} tickLine={false} axisLine={{ stroke: color.border }} />
            <YAxis tick={tickStyle} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ fontFamily: font.family, fontSize: 12, borderColor: color.border }} />
            <Bar dataKey={spec.yKey} fill={chartColors[0]} radius={[2, 2, 0, 0]} />
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
                <Cell key={i} fill={chartColors[i % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontFamily: font.family, fontSize: 12, borderColor: color.border }} />
          </PieChart>
        )
      case 'ScatterChart':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke={color.border} />
            <XAxis dataKey={spec.xKey} name={spec.xKey} tick={tickStyle} tickLine={false} axisLine={{ stroke: color.border }} />
            <YAxis dataKey={spec.yKey} name={spec.yKey} tick={tickStyle} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ fontFamily: font.family, fontSize: 12, borderColor: color.border }} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={spec.data} fill={chartColors[0]} />
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
