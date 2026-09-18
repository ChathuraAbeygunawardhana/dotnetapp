'use client'
import { color, font, radius, shadow, space, transition } from '@/lib/tokens'
import { useCallback, useState } from 'react'

interface Props {
  onFile: (f: File) => void
  disabled?: boolean
}

export function FileDropzone({ onFile, disabled }: Props) {
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }, [onFile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) onFile(f)
  }

  return (
    <label
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space[3],
        padding: `${space[8]} ${space[6]}`,
        border: `1.5px dashed ${dragging ? color.accent : color.border}`,
        borderRadius: radius.lg,
        background: dragging ? '#F5F5F5' : color.bg,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition,
        userSelect: 'none',
        boxShadow: dragging ? shadow.md : shadow.sm,
      }}
    >
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        style={{ display: 'none' }}
        onChange={handleChange}
        disabled={disabled}
      />

      {/* Icon */}
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
        stroke={color.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: font.family, fontWeight: font.weight.medium, fontSize: font.size.base, color: color.text }}>
          Drop your file here, or <span style={{ textDecoration: 'underline' }}>browse</span>
        </p>
        <p style={{ fontFamily: font.family, fontSize: font.size.sm, color: color.muted, marginTop: space[1] }}>
          Supports CSV and Excel (.xlsx) files
        </p>
      </div>
    </label>
  )
}
