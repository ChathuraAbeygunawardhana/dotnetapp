'use client'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

type Theme = 'light' | 'dark'
interface ThemeCtxValue { theme: Theme; toggle: () => void }

const ThemeCtx = createContext<ThemeCtxValue>({ theme: 'light', toggle: () => {} })
export const useTheme = () => useContext(ThemeCtx)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const busy = useRef(false)

  // Restore persisted preference on mount
  useEffect(() => {
    const stored = localStorage.getItem('bi-theme') as Theme | null
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.setAttribute('data-theme', stored)
      setTheme(stored)
    }
  }, [])

  const toggle = () => {
    if (busy.current) return
    busy.current = true

    const next: Theme = theme === 'light' ? 'dark' : 'light'

    // Apply changes: update data-theme attr (drives CSS vars) + React state
    const apply = () => {
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('bi-theme', next)
      // flushSync forces React to re-render synchronously inside the transition
      // callback so the View Transitions API captures the fully-updated DOM
      flushSync(() => setTheme(next))
      busy.current = false
    }

    if ('startViewTransition' in document) {
      // The browser screenshots the current state, runs apply(), screenshots
      // the new state, then animates them via ::view-transition-* in CSS.
      // Both states slide simultaneously — old leaves left, new enters right.
      ;(document as Document & {
        startViewTransition: (cb: () => void) => void
      }).startViewTransition(apply)
    } else {
      // Fallback for Firefox: instant switch (no animation)
      apply()
    }
  }

  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      {children}
    </ThemeCtx.Provider>
  )
}
