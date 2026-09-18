import type { Metadata } from 'next'
import './globals.css'
import { font } from '@/lib/tokens'

export const metadata: Metadata = {
  title: 'BI Dashboard',
  description: 'Upload a CSV or Excel file and get instant charts and insights.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: font.family }}>{children}</body>
    </html>
  )
}
