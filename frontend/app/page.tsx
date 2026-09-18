'use client'
import { color, font, radius, space } from '@/lib/tokens'
import { UploadSection } from '@/components/organisms/UploadSection'
import { StatsRow } from '@/components/organisms/StatsRow'
import { ChartsGrid } from '@/components/organisms/ChartsGrid'
import { InsightsPanel } from '@/components/organisms/InsightsPanel'
import { DataTable } from '@/components/organisms/DataTable'
import { Divider } from '@/components/atoms/Divider'
import { Button } from '@/components/atoms/Button'
import { Label } from '@/components/atoms/Label'
import { AnalysisResult } from '@/lib/types'
import { useState } from 'react'

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const reset = () => setResult(null)

  if (result) {
    return (
      <main style={{
        minHeight: '100vh',
        background: color.bg,
        padding: `${space[5]} ${space[5]} ${space[9]}`,
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: space[6],
        }}>
          <div>
            <h1 style={{ fontFamily: font.family, fontSize: font.size['2xl'], fontWeight: font.weight.bold, color: color.text, lineHeight: 1.1 }}>
              Dashboard
            </h1>
            <p style={{ fontFamily: font.family, fontSize: font.size.sm, color: color.muted, marginTop: space[1] }}>
              {result.rowCount.toLocaleString()} rows · {result.columns.length} columns detected
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={reset}>
            ← Upload new file
          </Button>
        </div>
        <Divider style={{ marginBottom: space[6] }} />

        {/* Stats */}
        <Section label="Key Statistics">
          <StatsRow rowCount={result.rowCount} stats={result.stats} />
        </Section>

        {/* Charts */}
        {result.charts.length > 0 && (
          <Section label="Charts">
            <ChartsGrid charts={result.charts} />
          </Section>
        )}

        {/* Insights */}
        {result.insights.length > 0 && (
          <Section label="Insights">
            <InsightsPanel insights={result.insights} />
          </Section>
        )}

        {/* Data Preview */}
        <Section label={`Data Preview (first ${result.preview.length} rows)`}>
          <DataTable columns={result.columns} rows={result.preview} />
        </Section>
      </main>
    )
  }

  // Upload view
  return (
    <main style={{
      minHeight: '100vh',
      background: color.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: space[5],
    }}>
      <div style={{ width: '100%', maxWidth: '540px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: space[7] }}>
          <h1 style={{
            fontFamily: font.family,
            fontSize: font.size['2xl'],
            fontWeight: font.weight.bold,
            color: color.text,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            BI Dashboard
          </h1>
          <p style={{
            fontFamily: font.family,
            fontSize: font.size.base,
            color: color.muted,
            marginTop: space[3],
            lineHeight: 1.6,
          }}>
            Upload a CSV or Excel file. Get charts and insights instantly.
          </p>
        </div>

        <UploadSection onResult={setResult} />


        {/* File Guide */}
        <div style={{
          marginTop: space[6],
          border: `1px solid ${color.border}`,
          borderRadius: radius.md,
          overflow: 'hidden',
        }}>
          {/* Constraints */}
          <div style={{ padding: space[4], borderBottom: `1px solid ${color.border}` }}>
            <p style={{ fontFamily: font.family, fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: space[3] }}>
              File Constraints
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
              {[
                ['Format', 'CSV (.csv) or Excel (.xlsx)'],
                ['Max size', '50 MB'],
                ['First row', 'Must be column headers'],
                ['Min rows', 'At least 2 data rows'],
                ['Encoding', 'UTF-8 recommended for CSV'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: space[3], alignItems: 'baseline' }}>
                  <span style={{ fontFamily: font.family, fontSize: font.size.sm, fontWeight: font.weight.medium, color: color.text, minWidth: '80px' }}>{k}</span>
                  <span style={{ fontFamily: font.family, fontSize: font.size.sm, color: color.muted }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column types */}
          <div style={{ padding: space[4], borderBottom: `1px solid ${color.border}` }}>
            <p style={{ fontFamily: font.family, fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: space[3] }}>
              Column Types Detected Automatically
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
              {[
                ['Date', 'Generates trend charts. Common formats: YYYY-MM-DD, MM/DD/YYYY, MMM YYYY.'],
                ['Number', 'Generates value charts. Use plain numbers — commas are stripped automatically.'],
                ['Category', 'Generates bar and pie charts. Best with 2–15 distinct values.'],
              ].map(([type, desc]) => (
                <div key={type} style={{ display: 'flex', gap: space[3] }}>
                  <span style={{
                    flexShrink: 0,
                    padding: `${space[1]} ${space[2]}`,
                    background: type === 'Date' ? color.accent : type === 'Number' ? '#404040' : color.surface,
                    color: type === 'Category' ? color.text : color.inverse,
                    border: type === 'Category' ? `1px solid ${color.border}` : 'none',
                    borderRadius: radius.sm,
                    fontFamily: font.family,
                    fontSize: font.size.xs,
                    fontWeight: font.weight.semibold,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                    height: 'fit-content',
                  }}>
                    {type}
                  </span>
                  <span style={{ fontFamily: font.family, fontSize: font.size.sm, color: color.muted, lineHeight: font.lineHeight.base }}>
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Optimal structure */}
          <div style={{ padding: space[4] }}>
            <p style={{ fontFamily: font.family, fontSize: font.size.xs, fontWeight: font.weight.semibold, color: color.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: space[3] }}>
              Optimal File Structure
            </p>
            <p style={{ fontFamily: font.family, fontSize: font.size.sm, color: color.muted, marginBottom: space[3] }}>
              For best results, include at least one column of each type:
            </p>
            <div style={{
              background: color.surface,
              borderRadius: radius.sm,
              border: `1px solid ${color.border}`,
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font.mono }}>
                <thead>
                  <tr>
                    {['Date', 'Category', 'Category', 'Number', 'Number'].map((h, i) => (
                      <th key={i} style={{ padding: `${space[2]} ${space[3]}`, fontSize: font.size.xs, fontWeight: font.weight.semibold, textAlign: 'left', color: color.muted, borderBottom: `1px solid ${color.border}`, whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['2024-01-15', 'Electronics', 'North', '12400', '87'],
                    ['2024-02-03', 'Clothing', 'South', '3850', '142'],
                    ['2024-02-20', 'Furniture', 'East', '6700', '18'],
                  ].map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{ padding: `${space[1]} ${space[3]}`, fontSize: font.size.xs, color: color.text, borderBottom: ri < 2 ? `1px solid ${color.border}` : 'none', whiteSpace: 'nowrap' }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontFamily: font.family, fontSize: font.size.xs, color: color.muted, marginTop: space[3] }}>
              More columns = richer charts. Empty cells are skipped automatically.
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: space[7] }}>
      <Label upper style={{ display: 'block', marginBottom: space[4] }}>{label}</Label>
      {children}
    </section>
  )
}
