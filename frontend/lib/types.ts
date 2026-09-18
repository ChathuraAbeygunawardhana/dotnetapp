export interface ColumnInfo  { name: string; type: 'Date' | 'Number' | 'Category' | 'Unknown' }
export interface StatSummary {
  column: string
  min?: number; max?: number; mean?: number; sum?: number
  topCategory?: string; topCategoryCount?: number
}
export interface ChartSpec {
  id: string
  type: 'LineChart' | 'BarChart' | 'PieChart' | 'ScatterChart'
  title: string
  xKey: string
  yKey: string
  data: Record<string, unknown>[]
}
export interface AnalysisResult {
  rowCount: number
  columns: ColumnInfo[]
  stats: StatSummary[]
  charts: ChartSpec[]
  insights: string[]
  preview: Record<string, unknown>[]
}
