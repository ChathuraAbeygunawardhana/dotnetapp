import type { Metadata } from 'next'
import './globals.css'
import { font } from '@/lib/tokens'
import { ThemeProvider } from '@/lib/ThemeContext'
import { ThemeToggle } from '@/components/atoms/ThemeToggle'

export const metadata: Metadata = {
  title: 'BI Dashboard',
  description: 'Upload a CSV or Excel file and get instant charts and insights.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body style={{ fontFamily: font.family }}>
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
